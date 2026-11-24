/**
 * `yarn specs:fetch` — 넥슨 Open API 포털의 OpenAPI YAML을 `specs/openapi/`로 내려받는다.
 *
 * - `specs/openapi/{slug}/{categoryId}.yaml` : 포털 원문 바이트 그대로
 * - `specs/openapi/index.json`               : manifest (게임·카테고리·오퍼레이션 목록)
 *
 * 수집이 전부 성공한 뒤에만 디스크를 건드린다. 네트워크·파싱 실패 시 기존 파일은 그대로 두고
 * exit 1로 끝난다. 포털이 변하지 않았으면 재실행해도 git diff가 없다.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  CollectError,
  collectPortal,
  MANIFEST_PATH,
  readManifest,
  serializeManifest,
  SPECS_DIR,
} from './lib/specs-portal.js';

interface WriteSummary {
  written: number;
  unchanged: number;
  removed: number;
}

function knownSlugs(): string[] {
  if (!existsSync(MANIFEST_PATH)) return [];
  try {
    return readManifest()
      .games.filter((g) => !g.external)
      .map((g) => g.slug);
  } catch {
    // 깨진 manifest는 어차피 이번 실행에서 덮어쓴다
    return [];
  }
}

function writeIfChanged(path: string, content: Buffer, summary: WriteSummary): void {
  if (existsSync(path) && readFileSync(path).equals(content)) {
    summary.unchanged++;
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  summary.written++;
}

/** 포털에서 사라진 카테고리·게임의 YAML을 지운다. 수집 성공 후에만 호출한다. */
function removeStale(expected: ReadonlySet<string>, summary: WriteSummary): void {
  if (!existsSync(SPECS_DIR)) return;
  for (const entry of readdirSync(SPECS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const gameDir = resolve(SPECS_DIR, entry.name);
    for (const file of readdirSync(gameDir)) {
      if (!file.endsWith('.yaml') || expected.has(`${entry.name}/${file}`)) continue;
      rmSync(resolve(gameDir, file));
      summary.removed++;
      console.log(`  삭제: specs/openapi/${entry.name}/${file} (포털에 더 이상 없음)`);
    }
    if (readdirSync(gameDir).length === 0) rmdirSync(gameDir);
  }
}

async function main(): Promise<void> {
  console.log('넥슨 Open API 포털 스펙 수집 시작');
  const { manifest, files } = await collectPortal({
    seedSlugs: knownSlugs(),
    log: (message) => console.log(`  ${message}`),
  });

  const summary: WriteSummary = { written: 0, unchanged: 0, removed: 0 };
  for (const [file, bytes] of files) writeIfChanged(resolve(SPECS_DIR, file), bytes, summary);
  removeStale(new Set(files.keys()), summary);
  writeIfChanged(MANIFEST_PATH, Buffer.from(serializeManifest(manifest), 'utf8'), summary);

  const internal = manifest.games.filter((g) => !g.external);
  const operations = internal.reduce(
    (sum, g) => sum + g.categories.reduce((s, c) => s + c.operations.length, 0),
    0,
  );
  console.log(
    `완료: 게임 ${internal.length}개(+외부 ${manifest.games.length - internal.length}개), ` +
      `YAML ${files.size}개, 오퍼레이션 ${operations}개 ` +
      `— 변경 ${summary.written}, 동일 ${summary.unchanged}, 삭제 ${summary.removed}`,
  );
}

main().catch((error: unknown) => {
  if (error instanceof CollectError) {
    console.error(
      `수집 실패 — 기존 specs/openapi/ 파일은 건드리지 않았습니다.\n  ${error.message}`,
    );
  } else {
    console.error('예상하지 못한 오류:', error);
  }
  process.exitCode = 1;
});
