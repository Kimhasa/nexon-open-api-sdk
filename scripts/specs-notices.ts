import {
  existsSync,
  readFileSync,
  writeFileSync,
  renameSync,
  rmSync,
  appendFileSync,
} from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { format, resolveConfig } from 'prettier';
import { REPO_ROOT, PORTAL_ORIGIN, fetchBytes } from './lib/specs-portal.js';
import { compareText, isObject, markdownCode } from './lib/specs-schema.js';

const CURSOR_PATH = resolve(REPO_ROOT, 'specs/notices.json');
const LIST_URL = `${PORTAL_ORIGIN}/ko/support/notice/`;

interface Notice {
  readonly id: string;
  readonly title: string;
  readonly publishedAt: number;
}

interface Cursor {
  readonly publishedAt: number;
  readonly threadIds: string[];
}

function validDate(value: unknown): value is number {
  return (
    typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= 253402300799
  );
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && /^\d+$/.test(value);
}

function readCursor(): Cursor | undefined {
  if (!existsSync(CURSOR_PATH)) return undefined;
  const raw: unknown = JSON.parse(readFileSync(CURSOR_PATH, 'utf8'));
  if (
    !isObject(raw) ||
    !validDate(raw['publishedAt']) ||
    !Array.isArray(raw['threadIds']) ||
    !raw['threadIds'].length ||
    !raw['threadIds'].every(validId)
  ) {
    throw new Error('specs/notices.json 형식이 올바르지 않습니다.');
  }
  return { publishedAt: raw['publishedAt'], threadIds: raw['threadIds'] };
}

function parseNotice(raw: unknown): Notice {
  if (!isObject(raw)) throw new Error('포털 공지 항목 형식이 올바르지 않습니다.');
  const { threadId, title, createDate, displayStartDate } = raw;
  if (!validId(threadId) || typeof title !== 'string' || !title.trim() || !validDate(createDate)) {
    throw new Error('포털 공지의 ID, 제목 또는 공개 시각을 읽을 수 없습니다.');
  }
  return {
    id: threadId,
    title,
    publishedAt: validDate(displayStartDate) ? displayStartDate : createDate,
  };
}

async function collectNotices(): Promise<Notice[]> {
  // 공지 페이지의 __NEXT_DATA__에는 분류만 있고 실제 목록은 이 공개 JSON을 사용한다.
  const url = new URL('/api/board/notice/threads', PORTAL_ORIGIN);
  url.search = new URLSearchParams({
    paginationType: 'PAGING',
    headlineId: '0',
    pageSize: '100',
    blockSize: '100',
    directionType: 'DEFAULT',
    locale: 'ko',
  }).toString();
  const notices = new Map<string, Notice>();
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
    url.searchParams.set('pageNo', String(page));
    const result: unknown = JSON.parse((await fetchBytes(url.href)).toString('utf8'));
    if (
      !isObject(result) ||
      !Array.isArray(result['threads']) ||
      typeof result['totalPages'] !== 'number' ||
      !Number.isSafeInteger(result['totalPages'])
    ) {
      throw new Error(`포털 공지 목록을 읽을 수 없습니다 (${page} 페이지).`);
    }
    if (page === 1) {
      const { blockStartKey, blockStartNo } = result;
      if (
        result['totalPages'] < 1 ||
        result['totalPages'] > 100 ||
        !Array.isArray(blockStartKey) ||
        !blockStartKey.every(validId) ||
        typeof blockStartNo !== 'number'
      ) {
        throw new Error('포털 공지 목록의 페이지 정보를 읽을 수 없습니다.');
      }
      totalPages = result['totalPages'];
      url.searchParams.set('blockStartKey', blockStartKey.join(','));
      url.searchParams.set('blockStartNo', String(blockStartNo));
    }
    if (result['totalPages'] !== totalPages || !result['threads'].length) {
      throw new Error('수집 중 포털 공지 페이지가 변경되었습니다. 다시 실행하세요.');
    }
    for (const raw of result['threads']) {
      const notice = parseNotice(raw);
      notices.set(notice.id, notice);
    }
  }
  return [...notices.values()].sort(
    (a, b) => b.publishedAt - a.publishedAt || compareText(a.id, b.id),
  );
}

async function main(): Promise<void> {
  const { values } = parseArgs({ options: { report: { type: 'string' } } });
  const before = readCursor();
  const notices = await collectNotices();
  const recent = notices.filter(
    ({ publishedAt, id }) =>
      before &&
      (publishedAt > before.publishedAt ||
        (publishedAt === before.publishedAt && !before.threadIds.includes(id))),
  );
  const lines = ['## 넥슨 포털 공지', ''];
  for (const notice of recent) {
    const date = new Date(notice.publishedAt * 1000).toISOString().slice(0, 10);
    lines.push(`- ${date} · ${markdownCode(notice.title)} · [공지 보기](${LIST_URL}${notice.id}/)`);
  }
  if (!recent.length)
    lines.push(before ? '새 공지가 없습니다.' : '현재 공지 목록을 기준으로 기록했습니다.');
  const report = `${lines.join('\n')}\n`;
  const latest = notices[0];
  if (!latest) throw new Error('포털 공지 목록이 비어 있습니다.');
  const publishedAt = Math.max(latest.publishedAt, before?.publishedAt ?? 0);
  const ids = [
    ...(before?.publishedAt === publishedAt ? before.threadIds : []),
    ...notices.filter((notice) => notice.publishedAt === publishedAt).map(({ id }) => id),
  ];
  const cursor: Cursor = { publishedAt, threadIds: [...new Set(ids)].sort(compareText) };
  if (values.report) writeFileSync(resolve(values.report), report, 'utf8');
  const summaryPath = process.env['GITHUB_STEP_SUMMARY'];
  if (summaryPath) appendFileSync(summaryPath, report);
  if (JSON.stringify(before) !== JSON.stringify(cursor)) {
    const scratch = `${CURSOR_PATH}.${randomUUID()}.tmp`;
    try {
      const options = await resolveConfig(CURSOR_PATH);
      const content = await format(JSON.stringify(cursor), { ...options, filepath: CURSOR_PATH });
      writeFileSync(scratch, content, 'utf8');
      renameSync(scratch, CURSOR_PATH);
    } finally {
      rmSync(scratch, { force: true });
    }
  }
  console.log(report);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
