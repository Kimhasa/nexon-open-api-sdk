/**
 * 실 API E2E(`yarn test:{game}`)를 응답 대조 장치(`scripts/lib/deep-check.ts`)와 함께 실행한다.
 *
 * E2E 스크립트는 대표 필드 몇 개만 확인한다. 이 명령은 그동안 호출된 모든 public 메서드의 반환값을
 * SDK가 선언한 응답 타입과 중첩 필드까지 대조해, 누락·추가 필드, 예상하지 못한 null, 타입 차이를 게임별로 요약한다.
 * `.env` 에 게임별 API 키와 테스트할 캐릭터 이름이 있어야 한다 (`.env.example` 참고).
 *
 * 사용법:
 *   yarn test:deep                 # 15개 게임 전부
 *   yarn test:deep maplestory v4   # 일부 게임만
 *   yarn test:deep --out ./deep    # 게임별 대조 JSON을 남길 폴더 (기본: 임시 폴더)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { REPO_ROOT } from './lib/specs-portal.js';

const GAMES = [
  'maplestory',
  'maplestory-m',
  'maplestory-sea',
  'maplestory-tw',
  'fconline',
  'first-descendant',
  'mabinogi-heroes',
  'sudden-attack',
  'kartrider',
  'baram',
  'mabinogi',
  'baram-yeon',
  'v4',
  'hit2',
  'platform',
] as const;

interface MethodReport {
  calls: number;
  differences: Record<string, number>;
  limitation?: string;
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { out: { type: 'string' }, verbose: { type: 'boolean', default: false } },
});
const unknown = positionals.filter((game) => !(GAMES as readonly string[]).includes(game));
if (unknown.length > 0) {
  console.error(
    `알 수 없는 게임: ${unknown.join(', ')}\n→ 다음 중에서 고르세요: ${GAMES.join(', ')}`,
  );
  process.exit(1);
}
const games = positionals.length > 0 ? positionals : [...GAMES];
const outDir = values.out ? resolve(values.out) : mkdtempSync(join(tmpdir(), 'nexon-deep-'));
mkdirSync(outDir, { recursive: true });

const tsx = resolve(REPO_ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const rows: string[][] = [];
let failed = false;
for (const game of games) {
  const report = join(outDir, `${game}.json`);
  const run = spawnSync(
    process.execPath,
    [tsx, '--import', './scripts/lib/deep-check.ts', `scripts/test-${game}.ts`],
    {
      cwd: REPO_ROOT,
      env: { ...process.env, DEEP_CHECK_REPORT: report },
      encoding: 'utf8',
      maxBuffer: 1 << 28,
    },
  );
  if (values.verbose) process.stdout.write(run.stdout);
  const e2eFailed = run.status !== 0;
  if (!existsSync(report)) {
    rows.push([game, e2eFailed ? '실패' : '통과', '-', '-', '-', '-']);
    failed = true;
    continue;
  }
  const methods = Object.entries(
    JSON.parse(readFileSync(report, 'utf8')) as Record<string, MethodReport>,
  );
  const withDifferences = methods.filter(
    ([, method]) => Object.keys(method.differences).length > 0,
  );
  const kinds = withDifferences.reduce(
    (sum, [, method]) => sum + Object.keys(method.differences).length,
    0,
  );
  const calls = methods.reduce((sum, [, method]) => sum + method.calls, 0);
  rows.push([
    game,
    e2eFailed ? '실패' : '통과',
    String(methods.length),
    String(calls),
    String(withDifferences.length),
    String(kinds),
  ]);
  if (e2eFailed || kinds > 0) failed = true;
  for (const [name, method] of withDifferences) {
    console.log(`\n${game} · ${name} (호출 ${method.calls}회)`);
    for (const [detail, count] of Object.entries(method.differences))
      console.log(`  - ${detail} ×${count}`);
  }
}

console.log('\n| 게임 | E2E | 호출한 메서드 | 호출 수 | 차이 있는 메서드 | 차이 종류 |');
console.log('| --- | --- | ---: | ---: | ---: | ---: |');
for (const row of rows) console.log(`| ${row.join(' | ')} |`);
console.log(`\n게임별 대조 결과: ${outDir}`);
process.exitCode = failed ? 1 : 0;
