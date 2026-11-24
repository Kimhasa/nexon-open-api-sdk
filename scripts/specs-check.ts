/**
 * `yarn specs:check` — 커밋된 `specs/openapi/index.json`을 현재 포털과 비교한다.
 *
 * 감지: 게임 추가/삭제, 카테고리 추가/삭제, 스펙 YAML 수정(타임스탬프·내용 해시), 오퍼레이션 추가/삭제.
 *
 * 종료 코드:
 * - 0 : 수집 성공 (변경이 있든 없든). 변경 여부는 출력으로 구분한다.
 * - 1 : 수집 실패(네트워크·파싱) 또는 기준 manifest를 읽지 못함. "변경 감지"가 아니다.
 *
 * 옵션:
 * - `--manifest <path>` 기준 manifest 경로 (기본: specs/openapi/index.json)
 * - `--report <path>`   Markdown 보고서 저장 경로 (기본: 임시 디렉터리)
 *
 * GitHub Actions에서는 `$GITHUB_OUTPUT`에 `changes_detected`, `changes_count`,
 * `report_path`, `fingerprint`를 쓴다.
 */

import { createHash } from 'node:crypto';
import { appendFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
  CollectError,
  collectPortal,
  MANIFEST_PATH,
  portalGameUrl,
  readManifest,
} from './lib/specs-portal.js';
import type { Manifest, ManifestCategory, ManifestGame } from './lib/specs-portal.js';

type ChangeType =
  | 'game_added'
  | 'game_removed'
  | 'game_changed'
  | 'category_added'
  | 'category_removed'
  | 'spec_updated'
  | 'operation_added'
  | 'operation_removed';

interface Change {
  readonly type: ChangeType;
  readonly slug: string;
  readonly gameName: string;
  readonly detail: string;
}

const TYPE_LABEL: Record<ChangeType, string> = {
  game_added: '게임 추가',
  game_removed: '게임 삭제',
  game_changed: '게임 정보 변경',
  category_added: '카테고리 추가',
  category_removed: '카테고리 삭제',
  spec_updated: '스펙 수정',
  operation_added: '오퍼레이션 추가',
  operation_removed: '오퍼레이션 삭제',
};

// ─── Diff ────────────────────────────────────────────────────────────

function byKey<T, K>(items: readonly T[], key: (item: T) => K): Map<K, T> {
  return new Map(items.map((item) => [key(item), item]));
}

function formatTimestamp(timestamp: string | null): string {
  if (timestamp === null || /^0+$/.test(timestamp)) return '시각 정보 없음';
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(timestamp);
  return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}` : timestamp;
}

function categoryLabel(slug: string, category: ManifestCategory): string {
  return `[${category.name} (id=${category.id})](${portalGameUrl(slug, category.id)})`;
}

function diffCategory(
  game: ManifestGame,
  before: ManifestCategory,
  after: ManifestCategory,
): Change[] {
  const changes: Change[] = [];
  const push = (type: ChangeType, detail: string): void => {
    changes.push({ type, slug: game.slug, gameName: game.name, detail });
  };
  const label = categoryLabel(game.slug, after);

  const reasons: string[] = [];
  if (before.timestamp !== after.timestamp) {
    reasons.push(
      `타임스탬프 ${formatTimestamp(before.timestamp)} → ${formatTimestamp(after.timestamp)}`,
    );
  }
  if (before.sha256 !== after.sha256 && before.timestamp === after.timestamp) {
    reasons.push('타임스탬프는 같지만 내용이 바뀜');
  }
  if (before.language !== after.language) {
    reasons.push(`언어 ${before.language} → ${after.language}`);
  }
  if (before.fileUrl !== after.fileUrl && reasons.length === 0) {
    reasons.push(`파일 주소 변경 → ${after.fileUrl}`);
  }
  if (before.name !== after.name) reasons.push(`이름 "${before.name}" → "${after.name}"`);
  if (before.availableLanguages.join(',') !== after.availableLanguages.join(',')) {
    reasons.push(
      `제공 언어 ${before.availableLanguages.join('/')} → ${after.availableLanguages.join('/')}`,
    );
  }
  if (reasons.length > 0) push('spec_updated', `${label} — ${reasons.join(', ')}`);

  const key = (op: { method: string; path: string }): string => `${op.method} ${op.path}`;
  const beforeOps = byKey(before.operations, key);
  const afterOps = byKey(after.operations, key);
  for (const [opKey, op] of afterOps) {
    if (beforeOps.has(opKey)) continue;
    push('operation_added', `\`${opKey}\`${op.summary ? ` — ${op.summary}` : ''} (${label})`);
  }
  for (const [opKey, op] of beforeOps) {
    if (afterOps.has(opKey)) continue;
    push('operation_removed', `\`${opKey}\`${op.summary ? ` — ${op.summary}` : ''} (${label})`);
  }
  return changes;
}

function diffManifests(before: Manifest, after: Manifest): Change[] {
  const changes: Change[] = [];
  const beforeGames = byKey(before.games, (g) => g.slug);
  const afterGames = byKey(after.games, (g) => g.slug);

  for (const game of after.games) {
    const push = (type: ChangeType, detail: string): void => {
      changes.push({ type, slug: game.slug, gameName: game.name, detail });
    };
    const previous = beforeGames.get(game.slug);
    if (!previous) {
      const operations = game.categories.reduce((sum, c) => sum + c.operations.length, 0);
      push(
        'game_added',
        game.external
          ? `외부 API 게임 — ${game.externalUrl ?? '주소 없음'}`
          : `[포털 문서](${portalGameUrl(game.slug)}) — 카테고리 ${game.categories.length}개, 오퍼레이션 ${operations}개`,
      );
      continue;
    }

    if (previous.external !== game.external || previous.externalUrl !== game.externalUrl) {
      push(
        'game_changed',
        `외부 API 여부/주소: ${previous.externalUrl ?? '넥슨 포털 제공'} → ${game.externalUrl ?? '넥슨 포털 제공'}`,
      );
    }
    if (previous.name !== game.name) {
      push('game_changed', `이름 "${previous.name}" → "${game.name}"`);
    }

    const beforeCategories = byKey(previous.categories, (c) => c.id);
    const afterCategories = byKey(game.categories, (c) => c.id);
    for (const category of game.categories) {
      const previousCategory = beforeCategories.get(category.id);
      if (!previousCategory) {
        push(
          'category_added',
          `${categoryLabel(game.slug, category)} — 오퍼레이션 ${category.operations.length}개`,
        );
        continue;
      }
      changes.push(...diffCategory(game, previousCategory, category));
    }
    for (const category of previous.categories) {
      if (afterCategories.has(category.id)) continue;
      push(
        'category_removed',
        `${category.name} (id=${category.id}) — 오퍼레이션 ${category.operations.length}개`,
      );
    }
  }

  for (const game of before.games) {
    if (afterGames.has(game.slug)) continue;
    changes.push({
      type: 'game_removed',
      slug: game.slug,
      gameName: game.name,
      detail: `포털 게임 목록에서 사라짐 (카테고리 ${game.categories.length}개)`,
    });
  }
  return changes;
}

// ─── Report ──────────────────────────────────────────────────────────

/** 같은 변경 집합이면 같은 값. 워크플로가 이미 보고한 변경을 다시 코멘트하지 않는 데 쓴다. */
function fingerprintOf(changes: readonly Change[]): string {
  const lines = changes.map((c) => `${c.slug}|${c.type}|${c.detail}`).sort();
  return createHash('sha256').update(lines.join('\n')).digest('hex').slice(0, 16);
}

function renderReport(changes: readonly Change[], fingerprint: string): string {
  if (changes.length === 0) {
    return '## 넥슨 Open API 포털 변경 없음\n\n`specs/openapi/index.json`이 현재 포털과 일치합니다.\n';
  }

  const lines: string[] = [
    `## 넥슨 Open API 포털 변경 감지 (${changes.length}건)`,
    '',
    '커밋된 `specs/openapi/index.json`과 현재 포털이 다릅니다.',
    '',
  ];
  const slugs = [...new Set(changes.map((c) => c.slug))].sort();
  for (const slug of slugs) {
    const gameChanges = changes.filter((c) => c.slug === slug);
    lines.push(`### ${gameChanges[0]?.gameName ?? slug} (\`${slug}\`)`, '');
    for (const change of gameChanges) {
      lines.push(`- **${TYPE_LABEL[change.type]}**: ${change.detail}`);
    }
    lines.push('');
  }
  lines.push(
    '### 처리 절차',
    '',
    '- [ ] `yarn specs:fetch` 실행 후 `specs/openapi/` 변경분 커밋 (이 이슈의 차이가 사라집니다)',
    '- [ ] `git diff specs/openapi/`로 스키마·파라미터 변경 내용 확인',
    '- [ ] `yarn specs:coverage`로 SDK 누락 엔드포인트 확인',
    '- [ ] 필요하면 SDK 타입·메서드 반영 (`SEMVER.md` 정책 참고)',
    '',
    `<!-- specs-check-fingerprint:${fingerprint} -->`,
    '',
  );
  return lines.join('\n');
}

// ─── CLI ─────────────────────────────────────────────────────────────

interface CliOptions {
  readonly manifestPath: string;
  readonly reportPath: string;
}

function parseArgs(argv: readonly string[]): CliOptions {
  let manifestPath = MANIFEST_PATH;
  let reportPath = resolve(process.env['RUNNER_TEMP'] ?? tmpdir(), 'specs-check-report.md');
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = argv[i + 1];
    if ((arg === '--manifest' || arg === '--report') && value !== undefined) {
      if (arg === '--manifest') manifestPath = resolve(value);
      else reportPath = resolve(value);
      i++;
    } else {
      throw new Error(
        `알 수 없는 인자: ${arg ?? ''}. 사용법: yarn specs:check [--manifest <path>] [--report <path>]`,
      );
    }
  }
  return { manifestPath, reportPath };
}

function writeActionsOutput(entries: Record<string, string>): void {
  const outputPath = process.env['GITHUB_OUTPUT'];
  if (!outputPath) return;
  const body = Object.entries(entries)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  appendFileSync(outputPath, `${body}\n`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const baseline = readManifest(options.manifestPath);

  console.log('넥슨 Open API 포털 변경 확인 시작');
  const { manifest: current } = await collectPortal({
    seedSlugs: baseline.games.filter((g) => !g.external).map((g) => g.slug),
    log: (message) => console.log(`  ${message}`),
  });

  const changes = diffManifests(baseline, current);
  const fingerprint = fingerprintOf(changes);
  const report = renderReport(changes, fingerprint);
  writeFileSync(options.reportPath, report, 'utf8');

  const summaryPath = process.env['GITHUB_STEP_SUMMARY'];
  if (summaryPath) appendFileSync(summaryPath, report);

  console.log(`\n${report}`);
  console.log(`changes_detected=${changes.length > 0}`);
  console.log(`changes_count=${changes.length}`);
  console.log(`report_path=${options.reportPath}`);
  writeActionsOutput({
    changes_detected: String(changes.length > 0),
    changes_count: String(changes.length),
    report_path: options.reportPath,
    fingerprint,
  });
}

main().catch((error: unknown) => {
  if (error instanceof CollectError) {
    console.error(
      '수집 실패 — 포털 변경이 아니라 네트워크·파싱 문제입니다. 변경 여부는 판단하지 않았습니다.\n' +
        `  ${error.message}`,
    );
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exitCode = 1;
});
