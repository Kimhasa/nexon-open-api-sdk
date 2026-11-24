/**
 * `yarn specs:coverage` — 포털 스펙(manifest)의 오퍼레이션과 SDK가 호출하는 경로를 대조한다.
 *
 * 옵션:
 * - `--json`         표 대신 JSON 출력
 * - `--game <slug>`  한 게임만 출력
 *
 * SDK 경로는 `src/games/**` 소스를 정적으로(정규식) 훑어 추출한다. TypeScript를 실제로
 * 해석하지 않으므로 휴리스틱이며, 한계는 출력의 "한계" 절에 그대로 적는다.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { readManifest, REPO_ROOT, uniqueOperations } from './lib/specs-portal.js';
import type { ManifestGame } from './lib/specs-portal.js';

const GAMES_DIR = resolve(REPO_ROOT, 'src', 'games');

const LIMITATIONS: readonly string[] = [
  "정규식 기반 정적 추출입니다. 문자열 리터럴/템플릿 리터럴로 쓴 URL, `buildUrl('리터럴')`, " +
    '`BASE`류 문자열 상수, `endpoints.ts`의 `as const` 객체만 인식합니다. 변수·함수로 조립한 경로는 놓칩니다.',
  '"구현"은 소스에 경로가 정의돼 있다는 뜻입니다. public 메서드에서 실제로 호출되는지, 파라미터와 응답 타입이 ' +
    '스펙과 맞는지는 확인하지 않습니다 (예: `endpoints.ts`에만 있고 호출되지 않는 상수도 구현으로 셉니다).',
  'HTTP 메서드는 구분하지 않고 SDK 호출을 모두 GET으로 가정합니다.',
  '경로 변수는 이름을 무시하고 자리만 비교합니다. 그래서 `p{spid}.png`와 `p{pid}.png`처럼 변수 이름만 다른 ' +
    '오퍼레이션은 SDK 경로 하나로 둘 다 구현된 것으로 셉니다.',
  '호스트는 매칭에 쓰지 않습니다. 경로가 같고 호스트만 다르면 구현으로 세고 "호스트 불일치"로 따로 표시합니다.',
  '게임 귀속은 `src/games/{dir}` 안의 `pathPrefix` 값으로 정합니다. `_base/`는 건너뜁니다.',
];

// ─── SDK path extraction ─────────────────────────────────────────────

interface SdkEndpoint {
  /** 경로 변수를 `{}`로 정규화한 경로 */
  readonly path: string;
  readonly origin: string | null;
  readonly source: string;
}

interface SdkGame {
  readonly slug: string;
  readonly dir: string;
  readonly endpoints: readonly SdkEndpoint[];
  /** 리터럴이 아니어서 해석하지 못한 `buildUrl(...)` 호출 수 */
  readonly unresolvedBuildUrlCalls: number;
}

function listTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...listTsFiles(full));
    else if (entry.name.endsWith('.ts')) files.push(full);
  }
  return files.sort();
}

/** JSDoc `@example` 안의 URL·buildUrl 예시가 잡히지 않도록 주석을 지운다. `https://`는 보존한다. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
}

function normalizePathVariables(path: string): string {
  return path.replace(/\$?\{[^}]*\}/g, '{}');
}

function splitUrl(url: string): { origin: string; path: string } | null {
  const match = /^(https?:\/\/[^/]+)(\/.*)?$/.exec(url);
  if (!match?.[1]) return null;
  return { origin: match[1], path: (match[2] ?? '/').replace(/[?#].*$/, '') };
}

/**
 * 한 게임 디렉터리에서 SDK가 쓰는 URL을 모은다.
 *
 * 1) 문자열 상수(`const BASE = '…'`, `static readonly BASE = '…'`)와 `as const` 객체 멤버를 수집
 * 2) 모든 문자열/템플릿 리터럴에서 `${상수}`를 치환해 `https://…`로 시작하는 것을 URL 후보로 채택
 * 3) `buildUrl('path', 'version'?)`은 `pathPrefix`와 합쳐 URL로 만든다
 * 4) 다른 템플릿의 접두사로만 쓰인 상수(BASE 상수 자체 등)는 엔드포인트로 세지 않는다
 */
function extractSdkGame(dir: string): SdkGame | null {
  const files = listTsFiles(dir).map((file) => ({
    file,
    code: stripComments(readFileSync(file, 'utf8')),
  }));

  let slug: string | null = null;
  for (const { code } of files) {
    slug ??= /pathPrefix\s*(?::\s*string\s*)?=\s*['"]([\w-]+)['"]/.exec(code)?.[1] ?? null;
  }
  if (slug === null) return null;

  // key: 파일 로컬 이름은 `${file}::${name}`, 한정 이름(`Class.BASE`, `OBJ.KEY`)은 그대로
  const constants = new Map<string, string>();
  const prefixUrls = new Set<string>();
  for (const { file, code } of files) {
    const constPattern =
      /(?:\bconst|\bstatic\s+readonly|\breadonly)\s+(\w+)\s*(?::\s*string\s*)?=\s*(['"`])([^'"`\n]*)\2/g;
    for (const match of code.matchAll(constPattern)) {
      const [, name, , value] = match;
      if (name === undefined || value === undefined) continue;
      constants.set(`${file}::${name}`, value);
      const before = code.slice(0, match.index);
      const className = [...before.matchAll(/\bclass\s+(\w+)/g)].pop()?.[1];
      if (className !== undefined) constants.set(`${className}.${name}`, value);
    }
    for (const objectMatch of code.matchAll(/\bconst\s+(\w+)\s*=\s*\{([\s\S]*?)\n\}/g)) {
      const [, objectName, body] = objectMatch;
      if (objectName === undefined || body === undefined) continue;
      for (const member of body.matchAll(/(\w+)\s*:\s*(['"`])([^'"`\n]*)\2/g)) {
        const [, key, , value] = member;
        if (key === undefined || value === undefined) continue;
        // 객체 멤버 값은 같은 파일의 로컬 상수를 참조하므로 파일 문맥을 미리 풀어 둔다
        constants.set(`${objectName}.${key}`, resolveTemplate(value, file, constants, prefixUrls));
      }
    }
  }

  const candidates: SdkEndpoint[] = [];
  let unresolvedBuildUrlCalls = 0;
  for (const { file, code } of files) {
    const source = relative(REPO_ROOT, file).replace(/\\/g, '/');
    for (const literal of code.matchAll(/(['"`])([^'"`\n]*)\1/g)) {
      const resolved = resolveTemplate(literal[2] ?? '', file, constants, prefixUrls);
      const url = splitUrl(resolved);
      if (url === null) continue;
      candidates.push({ path: normalizePathVariables(url.path), origin: url.origin, source });
    }
    for (const call of code.matchAll(/\bbuildUrl\(([^)]*)\)/g)) {
      const args = /^\s*(['"`])([^'"`$]+)\1\s*(?:,\s*(['"`])([^'"`$]+)\3\s*)?,?\s*$/.exec(
        call[1] ?? '',
      );
      if (!args?.[2]) {
        unresolvedBuildUrlCalls++;
        continue;
      }
      candidates.push({
        path: normalizePathVariables(`/${slug}/${args[4] ?? 'v1'}/${args[2]}`),
        origin: 'https://open.api.nexon.com',
        source,
      });
    }
  }

  const byPath = new Map<string, SdkEndpoint>();
  for (const candidate of candidates) {
    if (!byPath.has(candidate.path)) byPath.set(candidate.path, candidate);
  }
  const prefixPaths = new Set(
    [...prefixUrls].map((url) => normalizePathVariables(splitUrl(url)?.path ?? '')),
  );
  const endpoints = [...byPath.values()]
    .filter((endpoint) => !prefixPaths.has(endpoint.path))
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

  return {
    slug,
    dir: relative(REPO_ROOT, dir).replace(/\\/g, '/'),
    endpoints,
    unresolvedBuildUrlCalls,
  };
}

/**
 * 템플릿의 `${상수}`를 값으로 치환한다. 상수 뒤에 다른 글자가 붙어 있으면
 * 그 상수는 "접두사로 쓰였다"고 보고 `prefixUrls`에 기록한다.
 */
function resolveTemplate(
  template: string,
  file: string,
  constants: ReadonlyMap<string, string>,
  prefixUrls: Set<string>,
  depth: number = 0,
): string {
  return template.replace(/\$\{\s*([\w.]+)\s*\}/g, (whole, ref: string) => {
    const value = constants.get(`${file}::${ref}`) ?? constants.get(ref);
    // 상수가 다른 상수를 참조할 수 있다 (BASE → ENDPOINTS.X → 호출부). 순환 참조 방지용 깊이 제한
    if (value === undefined || depth > 4) return whole;
    const resolved = resolveTemplate(value, file, constants, prefixUrls, depth + 1);
    if (whole !== template) prefixUrls.add(resolved);
    return resolved;
  });
}

// ─── Coverage ────────────────────────────────────────────────────────

interface MissingOperation {
  readonly method: string;
  readonly path: string;
  readonly summary: string | null;
  readonly category: string;
}

interface HostMismatch {
  readonly path: string;
  readonly sdkOrigin: string;
  readonly specServers: readonly string[];
}

interface GameCoverage {
  readonly slug: string;
  readonly name: string;
  readonly external: boolean;
  readonly sdkDir: string | null;
  readonly total: number;
  readonly implemented: number;
  readonly missing: readonly MissingOperation[];
  readonly sdkOnly: readonly string[];
  readonly hostMismatches: readonly HostMismatch[];
  readonly unresolvedBuildUrlCalls: number;
}

function coverageFor(game: ManifestGame, sdk: SdkGame | undefined): GameCoverage {
  const sdkByPath = new Map((sdk?.endpoints ?? []).map((e) => [e.path, e]));
  const matchedSdkPaths = new Set<string>();
  const missing: MissingOperation[] = [];
  const hostMismatches: HostMismatch[] = [];
  const operations = uniqueOperations(game);

  for (const operation of operations.values()) {
    const category = game.categories.find((c) => c.operations.includes(operation));
    const normalized = normalizePathVariables(operation.path);
    const endpoint = sdkByPath.get(normalized);
    if (!endpoint) {
      missing.push({
        method: operation.method,
        path: operation.path,
        summary: operation.summary,
        category: category?.name ?? '',
      });
      continue;
    }
    matchedSdkPaths.add(normalized);
    const servers = category?.servers ?? [];
    if (endpoint.origin !== null && servers.length > 0 && !servers.includes(endpoint.origin)) {
      hostMismatches.push({
        path: operation.path,
        sdkOrigin: endpoint.origin,
        specServers: servers,
      });
    }
  }

  return {
    slug: game.slug,
    name: game.name,
    external: game.external,
    sdkDir: sdk?.dir ?? null,
    total: operations.size,
    implemented: operations.size - missing.length,
    missing,
    sdkOnly: [...sdkByPath.keys()].filter((path) => !matchedSdkPaths.has(path)),
    hostMismatches,
    unresolvedBuildUrlCalls: sdk?.unresolvedBuildUrlCalls ?? 0,
  };
}

// ─── Output ──────────────────────────────────────────────────────────

function renderText(rows: readonly GameCoverage[], orphanSdkDirs: readonly SdkGame[]): string {
  const lines: string[] = ['# 포털 스펙 대비 SDK 커버리지', ''];
  lines.push(
    '| 게임 | slug | 구현 / 전체 | 누락 | SDK에만 있음 |',
    '| --- | --- | --- | --- | --- |',
  );
  for (const row of rows) {
    lines.push(
      row.external
        ? `| ${row.name} | ${row.slug} | 외부 API | - | - |`
        : `| ${row.name} | ${row.slug} | ${row.implemented} / ${row.total} | ${row.missing.length} | ${row.sdkOnly.length} |`,
    );
  }
  const internal = rows.filter((row) => !row.external);
  const total = internal.reduce((sum, row) => sum + row.total, 0);
  const implemented = internal.reduce((sum, row) => sum + row.implemented, 0);
  const sdkOnly = internal.reduce((sum, row) => sum + row.sdkOnly.length, 0);
  lines.push(
    `| **합계** | | **${implemented} / ${total}** | ${total - implemented} | ${sdkOnly} |`,
    '',
  );

  for (const row of internal) {
    const hasDetail =
      row.sdkDir !== null &&
      (row.missing.length > 0 || row.sdkOnly.length > 0 || row.hostMismatches.length > 0);
    if (!hasDetail && row.unresolvedBuildUrlCalls === 0) continue;
    lines.push(`## ${row.name} (${row.slug}) — ${row.implemented} / ${row.total}`, '');
    if (row.missing.length > 0) {
      lines.push('누락 (포털에 있고 SDK에 없음):');
      for (const op of row.missing) {
        lines.push(
          `- ${op.method} ${op.path}${op.summary ? ` — ${op.summary}` : ''} [${op.category}]`,
        );
      }
      lines.push('');
    }
    if (row.sdkOnly.length > 0) {
      lines.push('SDK에만 있음 (포털 스펙에 없음):');
      for (const path of row.sdkOnly) lines.push(`- ${path}`);
      lines.push('');
    }
    if (row.hostMismatches.length > 0) {
      lines.push('호스트 불일치 (경로는 같지만 SDK가 스펙과 다른 호스트를 씀):');
      for (const m of row.hostMismatches) {
        lines.push(`- ${m.path} — SDK ${m.sdkOrigin}, 스펙 ${m.specServers.join(', ')}`);
      }
      lines.push('');
    }
    if (row.unresolvedBuildUrlCalls > 0) {
      lines.push(
        `해석하지 못한 buildUrl 호출 ${row.unresolvedBuildUrlCalls}건 (인자가 리터럴이 아님) — 위 수치에서 빠져 있습니다.`,
        '',
      );
    }
  }

  const notStarted = internal.filter((row) => row.sdkDir === null);
  if (notStarted.length > 0) {
    lines.push(
      `SDK 디렉터리가 없는 게임 (전부 누락): ${notStarted.map((row) => `${row.slug}(${row.total})`).join(', ')}`,
      '',
    );
  }
  if (orphanSdkDirs.length > 0) {
    lines.push(
      `포털 게임 목록에 없는 SDK 디렉터리: ${orphanSdkDirs.map((g) => `${g.dir} (pathPrefix=${g.slug})`).join(', ')}`,
      '',
    );
  }

  lines.push('## 한계', '');
  for (const limitation of LIMITATIONS) lines.push(`- ${limitation}`);
  lines.push('');
  return lines.join('\n');
}

function main(): void {
  const argv = process.argv.slice(2);
  let json = false;
  let onlySlug: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') json = true;
    else if (arg === '--game' && argv[i + 1] !== undefined) onlySlug = argv[++i] ?? null;
    else {
      throw new Error(
        `알 수 없는 인자: ${arg ?? ''}. 사용법: yarn specs:coverage [--json] [--game <slug>]`,
      );
    }
  }

  const manifest = readManifest();
  if (onlySlug !== null && !manifest.games.some((g) => g.slug === onlySlug)) {
    throw new Error(
      `manifest에 없는 게임입니다: ${onlySlug}. 사용 가능: ${manifest.games.map((g) => g.slug).join(', ')}`,
    );
  }

  const sdkGames = readdirSync(GAMES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => extractSdkGame(resolve(GAMES_DIR, entry.name)))
    .filter((game): game is SdkGame => game !== null);
  const sdkBySlug = new Map(sdkGames.map((game) => [game.slug, game]));

  const rows = manifest.games
    .filter((game) => onlySlug === null || game.slug === onlySlug)
    .map((game) => coverageFor(game, sdkBySlug.get(game.slug)));
  const orphans =
    onlySlug === null
      ? sdkGames.filter((sdk) => !manifest.games.some((game) => game.slug === sdk.slug))
      : [];

  if (json) {
    const output = {
      games: rows,
      orphanSdkDirs: orphans.map((g) => ({ dir: g.dir, pathPrefix: g.slug })),
      limitations: LIMITATIONS,
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(renderText(rows, orphans));
  }
}

try {
  main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
