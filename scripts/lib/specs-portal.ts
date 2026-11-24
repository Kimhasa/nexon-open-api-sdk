/**
 * 넥슨 Open API 포털 스펙 수집 공용 모듈.
 *
 * `specs:fetch`(저장)와 `specs:check`(비교)가 같은 수집 코드를 써야
 * "fetch 직후 check = 변경 0"이 구조적으로 보장되므로 한 곳에 둔다.
 *
 * 포털 구조:
 * - `GET /ko/game/{slug}/` HTML의 `<script id="__NEXT_DATA__">` JSON
 *   - `props.pageProps.gameResult[]`     전체 게임 목록 (`url`이 있으면 외부 API)
 *   - `props.pageProps.categoryResult[]` 해당 게임 카테고리 (`language[].fileUrl` = OpenAPI YAML)
 * - 모르는 slug도 200(목록 페이지)을 돌려주므로 `page` 값으로 판별한다.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

// ─── Paths ───────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, '..', '..');
export const SPECS_DIR = resolve(REPO_ROOT, 'specs', 'openapi');
export const MANIFEST_PATH = resolve(SPECS_DIR, 'index.json');

// ─── Manifest types ──────────────────────────────────────────────────

export interface ManifestOperation {
  readonly method: string;
  readonly path: string;
  readonly operationId: string | null;
  readonly summary: string | null;
}

export interface ManifestCategory {
  readonly id: number;
  readonly name: string;
  /** 저장한 YAML의 언어 코드 (ko → en → zh-cht → 그 외 우선순위로 선택) */
  readonly language: string;
  readonly availableLanguages: readonly string[];
  /** `specs/openapi/` 기준 상대 경로 */
  readonly file: string;
  readonly fileUrl: string;
  /** 파일명의 `script{YYYYMMDDHHMMSS}`. 포털이 값을 주지 않은 파일은 `00000000000000` */
  readonly timestamp: string | null;
  /** 저장한 YAML 원문 바이트의 SHA-256. 타임스탬프가 없는 파일의 변경 감지용 */
  readonly sha256: string;
  readonly servers: readonly string[];
  readonly operations: readonly ManifestOperation[];
}

export interface ManifestGame {
  readonly slug: string;
  readonly name: string;
  readonly nameEng: string | null;
  /** true면 넥슨 포털이 스펙을 제공하지 않고 `externalUrl`로 보낸다 (네오플 등) */
  readonly external: boolean;
  readonly externalUrl: string | null;
  readonly categories: readonly ManifestCategory[];
}

export interface Manifest {
  readonly schemaVersion: 1;
  readonly source: string;
  readonly games: readonly ManifestGame[];
}

export interface CollectResult {
  readonly manifest: Manifest;
  /** key: `specs/openapi/` 기준 상대 경로, value: YAML 원문 바이트 */
  readonly files: ReadonlyMap<string, Buffer>;
}

/** 수집(네트워크·파싱) 실패. "변경 감지"와 구분하기 위한 전용 에러. */
export class CollectError extends Error {
  override readonly name = 'CollectError';
}

// ─── Constants ───────────────────────────────────────────────────────

export const PORTAL_ORIGIN = 'https://openapi.nexon.com';
const USER_AGENT = 'nexon-open-api-specs-fetch/1.0';
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 800;
/** 포털 부하를 피하려고 요청을 순차로 보내고 사이에 짧게 쉰다 */
const REQUEST_GAP_MS = 150;
const GAME_PAGE = '/game/[contextPath]';
const LANGUAGE_PRIORITY = ['ko', 'en', 'zh-cht'];
export const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options', 'trace'];
/** 게임 목록을 얻으려면 유효한 게임 페이지가 하나 필요하다 (목록 페이지에는 gameResult가 없다) */
const DEFAULT_SEED_SLUGS = ['maplestory', 'fconline', 'maplestorym'];

export function portalGameUrl(slug: string, categoryId?: number): string {
  const base = `${PORTAL_ORIGIN}/ko/game/${slug}/`;
  return categoryId === undefined ? base : `${base}?id=${categoryId}`;
}

// ─── Type guards ─────────────────────────────────────────────────────

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// ─── HTTP ────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchBytes(url: string): Promise<Buffer> {
  let lastError = '';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.ok) {
        const bytes = Buffer.from(await response.arrayBuffer());
        await sleep(REQUEST_GAP_MS);
        return bytes;
      }
      lastError = `HTTP ${response.status}`;
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable) break;
    } catch (error: unknown) {
      lastError = errorMessage(error);
    }
    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_BASE_DELAY_MS * attempt);
  }
  throw new CollectError(`요청 실패: ${url} (${lastError})`);
}

// ─── Portal page parsing ─────────────────────────────────────────────

interface PortalGame {
  readonly slug: string;
  readonly name: string;
  readonly nameEng: string | null;
  readonly externalUrl: string | null;
}

interface PortalLanguageFile {
  readonly code: string;
  readonly fileUrl: string;
  readonly fileName: string;
}

interface PortalCategory {
  readonly id: number;
  readonly name: string;
  readonly languages: readonly PortalLanguageFile[];
}

interface PortalPage {
  readonly games: readonly PortalGame[];
  readonly categories: readonly PortalCategory[];
}

function parseNextData(html: string, url: string): JsonObject {
  const match = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!match?.[1]) throw new CollectError(`__NEXT_DATA__를 찾지 못했습니다: ${url}`);
  let data: unknown;
  try {
    data = JSON.parse(match[1]);
  } catch (error: unknown) {
    throw new CollectError(`__NEXT_DATA__ JSON 파싱 실패: ${url} (${errorMessage(error)})`);
  }
  if (!isObject(data)) throw new CollectError(`__NEXT_DATA__가 객체가 아닙니다: ${url}`);
  return data;
}

function parseGames(raw: unknown, url: string): PortalGame[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new CollectError(`gameResult가 비어 있거나 배열이 아닙니다: ${url}`);
  }
  return raw.map((entry: unknown): PortalGame => {
    const slug = isObject(entry) ? stringOrNull(entry['contextPath']) : null;
    const name = isObject(entry) ? stringOrNull(entry['name']) : null;
    if (!isObject(entry) || slug === null || name === null) {
      throw new CollectError(`gameResult 항목에 contextPath/name이 없습니다: ${url}`);
    }
    return {
      slug,
      name,
      nameEng: stringOrNull(entry['nameEng']),
      externalUrl: stringOrNull(entry['url']),
    };
  });
}

function parseCategories(raw: unknown, url: string): PortalCategory[] {
  if (!Array.isArray(raw)) throw new CollectError(`categoryResult가 배열이 아닙니다: ${url}`);
  return raw.map((entry: unknown): PortalCategory => {
    if (!isObject(entry)) throw new CollectError(`categoryResult 항목이 객체가 아닙니다: ${url}`);
    const id = entry['id'];
    const name = stringOrNull(entry['categoryName']);
    const languageRaw = entry['language'];
    if (typeof id !== 'number' || name === null || !Array.isArray(languageRaw)) {
      throw new CollectError(`categoryResult 항목 형식이 예상과 다릅니다: ${url}`);
    }
    const languages = languageRaw.map((lang: unknown): PortalLanguageFile => {
      const code = isObject(lang) ? stringOrNull(lang['code']) : null;
      const fileUrl = isObject(lang) ? stringOrNull(lang['fileUrl']) : null;
      if (!isObject(lang) || code === null || fileUrl === null) {
        throw new CollectError(`카테고리 ${id}의 language 항목에 code/fileUrl이 없습니다: ${url}`);
      }
      const fileName =
        stringOrNull(lang['fileName']) ?? fileUrl.slice(fileUrl.lastIndexOf('/') + 1);
      return { code: code.toLowerCase(), fileUrl, fileName };
    });
    if (languages.length === 0) {
      throw new CollectError(`카테고리 ${id}에 스펙 파일이 하나도 없습니다: ${url}`);
    }
    return { id, name, languages };
  });
}

/** 유효한 게임 페이지가 아니면(= 모르는 slug) null */
async function fetchGamePage(slug: string): Promise<PortalPage | null> {
  const url = portalGameUrl(slug);
  const data = parseNextData((await fetchBytes(url)).toString('utf8'), url);
  if (data['page'] !== GAME_PAGE) return null;
  const props = data['props'];
  const pageProps = isObject(props) ? props['pageProps'] : undefined;
  if (!isObject(pageProps)) throw new CollectError(`pageProps가 없습니다: ${url}`);
  if (pageProps['contextPath'] !== slug) {
    throw new CollectError(`요청한 slug(${slug})와 응답 contextPath가 다릅니다: ${url}`);
  }
  return {
    games: parseGames(pageProps['gameResult'], url),
    categories: parseCategories(pageProps['categoryResult'], url),
  };
}

// ─── OpenAPI YAML parsing ────────────────────────────────────────────

interface ParsedSpec {
  readonly servers: string[];
  readonly operations: ManifestOperation[];
}

function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function parseOpenApi(
  bytes: Buffer | string,
  label: string,
): { root: JsonObject; paths: JsonObject } {
  // 포털 YAML은 들여쓰기가 파일마다 다르고 중복 키가 섞인 파일도 있어 관대하게 읽는다
  const doc = parseDocument(bytes.toString(), { uniqueKeys: false, strict: false });
  const firstError = doc.errors[0];
  if (firstError) throw new CollectError(`YAML 파싱 실패: ${label} (${firstError.message})`);
  const root: unknown = doc.toJS();
  if (!isObject(root) || typeof root['openapi'] !== 'string' || !isObject(root['paths'])) {
    throw new CollectError(`OpenAPI 문서가 아닙니다 (openapi/paths 없음): ${label}`);
  }
  return { root, paths: root['paths'] };
}

function parseSpec(bytes: Buffer, label: string): ParsedSpec {
  const { root, paths } = parseOpenApi(bytes, label);
  const serversRaw = root['servers'];
  const servers = (Array.isArray(serversRaw) ? serversRaw : [])
    .map((server: unknown) => (isObject(server) ? stringOrNull(server['url']) : null))
    .filter((serverUrl): serverUrl is string => serverUrl !== null);

  const operations: ManifestOperation[] = [];
  for (const [path, item] of Object.entries(paths)) {
    if (!isObject(item)) continue;
    for (const method of HTTP_METHODS) {
      const operation = item[method];
      if (!isObject(operation)) continue;
      operations.push({
        method: method.toUpperCase(),
        path: path.trim(),
        operationId: stringOrNull(operation['operationId']),
        summary: stringOrNull(operation['summary']),
      });
    }
  }
  if (operations.length === 0) throw new CollectError(`오퍼레이션이 하나도 없습니다: ${label}`);
  operations.sort((a, b) => compareText(a.path, b.path) || compareText(a.method, b.method));
  return { servers, operations };
}

// ─── Collect ─────────────────────────────────────────────────────────

function languageRank(code: string): number {
  const index = LANGUAGE_PRIORITY.indexOf(code);
  return index === -1 ? LANGUAGE_PRIORITY.length : index;
}

function sortLanguages(languages: readonly PortalLanguageFile[]): PortalLanguageFile[] {
  return [...languages].sort(
    (a, b) => languageRank(a.code) - languageRank(b.code) || compareText(a.code, b.code),
  );
}

export interface CollectOptions {
  /** 게임 목록을 얻는 데 먼저 시도할 slug (보통 기존 manifest의 slug 목록) */
  readonly seedSlugs?: readonly string[];
  readonly log?: (message: string) => void;
}

/**
 * 포털의 현재 상태를 통째로 수집한다. 디스크에는 아무것도 쓰지 않는다.
 *
 * @throws {CollectError} 네트워크·파싱 실패, 또는 포털 구조가 예상과 다를 때.
 *   일부만 수집된 결과를 돌려주지 않는다 — 부분 결과는 "삭제"로 오판되기 때문이다.
 */
export async function collectPortal(options: CollectOptions = {}): Promise<CollectResult> {
  const log = options.log ?? ((): void => {});
  const seeds = [...new Set([...(options.seedSlugs ?? []), ...DEFAULT_SEED_SLUGS])];

  const pages = new Map<string, PortalPage>();
  let portalGames: readonly PortalGame[] | null = null;
  for (const seed of seeds) {
    const page = await fetchGamePage(seed);
    if (page === null) continue;
    pages.set(seed, page);
    portalGames = page.games;
    break;
  }
  if (portalGames === null) {
    throw new CollectError(
      `게임 목록을 얻지 못했습니다. 시도한 slug(${seeds.join(', ')})가 모두 게임 페이지가 아닙니다. ` +
        `포털 구조가 바뀌었는지 ${PORTAL_ORIGIN}/ko/game/ 에서 확인하세요.`,
    );
  }

  const files = new Map<string, Buffer>();
  const games: ManifestGame[] = [];
  for (const game of [...portalGames].sort((a, b) => compareText(a.slug, b.slug))) {
    if (game.externalUrl !== null) {
      log(`${game.slug}: 외부 API (${game.externalUrl})`);
      games.push({ ...pickGame(game), external: true, categories: [] });
      continue;
    }
    const page = pages.get(game.slug) ?? (await fetchGamePage(game.slug));
    if (page === null) {
      throw new CollectError(
        `${game.slug}: 게임 목록에는 있지만 게임 페이지가 열리지 않습니다 (${portalGameUrl(game.slug)})`,
      );
    }

    const categories: ManifestCategory[] = [];
    for (const category of [...page.categories].sort((a, b) => a.id - b.id)) {
      const languages = sortLanguages(category.languages);
      const chosen = languages[0];
      if (!chosen) continue;
      const file = `${game.slug}/${category.id}.yaml`;
      const bytes = await fetchBytes(chosen.fileUrl);
      const spec = parseSpec(bytes, `${file} ← ${chosen.fileUrl}`);
      files.set(file, bytes);
      categories.push({
        id: category.id,
        name: category.name,
        language: chosen.code,
        availableLanguages: languages.map((lang) => lang.code),
        file,
        fileUrl: chosen.fileUrl,
        timestamp: /script(\d{14})/.exec(chosen.fileName)?.[1] ?? null,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        servers: spec.servers,
        operations: spec.operations,
      });
    }
    const operationCount = categories.reduce((sum, c) => sum + c.operations.length, 0);
    log(`${game.slug}: 카테고리 ${categories.length}개, 오퍼레이션 ${operationCount}개`);
    games.push({ ...pickGame(game), external: false, categories });
  }

  return {
    manifest: { schemaVersion: 1, source: `${PORTAL_ORIGIN}/ko/game/{slug}/`, games },
    files,
  };
}

function pickGame(game: PortalGame): Omit<ManifestGame, 'external' | 'categories'> {
  return { slug: game.slug, name: game.name, nameEng: game.nameEng, externalUrl: game.externalUrl };
}

// ─── Manifest IO ─────────────────────────────────────────────────────

/** 객체 키를 재귀적으로 정렬한다. 배열 순서는 수집 단계에서 이미 정렬했으므로 건드리지 않는다. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!isObject(value)) return value;
  const sorted: JsonObject = {};
  for (const key of Object.keys(value).sort()) sorted[key] = sortKeys(value[key]);
  return sorted;
}

/** 같은 포털 상태면 항상 같은 바이트가 나오도록 직렬화한다 (수집 시각 등 가변 값 없음). */
export function serializeManifest(manifest: Manifest): string {
  return `${JSON.stringify(sortKeys(manifest), null, 2)}\n`;
}

/**
 * 커밋된 manifest를 읽는다.
 *
 * @throws {Error} 파일이 없거나 형식이 다를 때. `yarn specs:fetch`로 다시 만들면 된다.
 */
export function readManifest(path: string = MANIFEST_PATH): Manifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error: unknown) {
    throw new Error(
      `manifest를 읽지 못했습니다: ${path} (${errorMessage(error)}). ` +
        '`yarn specs:fetch`를 실행해 specs/openapi/index.json을 생성하세요.',
    );
  }
  if (!isObject(parsed) || parsed['schemaVersion'] !== 1 || !Array.isArray(parsed['games'])) {
    throw new Error(
      `manifest 형식이 예상과 다릅니다: ${path}. \`yarn specs:fetch\`로 다시 생성하세요.`,
    );
  }
  // 스크립트가 직접 쓴 파일이므로 최상위 형태만 확인하고 내부 구조는 신뢰한다
  return parsed as unknown as Manifest;
}

/** 게임별 고유 오퍼레이션(`METHOD path`) 집합. 한 경로가 여러 카테고리에 실려도 한 번만 센다. */
export function uniqueOperations(game: ManifestGame): Map<string, ManifestOperation> {
  const result = new Map<string, ManifestOperation>();
  for (const category of game.categories) {
    for (const operation of category.operations) {
      const key = `${operation.method} ${operation.path}`;
      if (!result.has(key)) result.set(key, operation);
    }
  }
  return result;
}
