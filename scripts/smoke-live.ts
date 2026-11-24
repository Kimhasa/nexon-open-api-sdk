import { deepEqual, ok as assert } from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import type * as BuiltSdk from '../src/index.js';
import type { HttpLogger, NexonClient } from '../src/index.js';
import { readManifest, REPO_ROOT, uniqueOperations } from './lib/specs-portal.js';
import { fieldPath, isObject } from './lib/specs-schema.js';
import { analyzeSdk, normalizedOperation } from './lib/specs-sdk.js';
import type { SdkMethod, SdkShape } from './lib/specs-sdk.js';

const ORIGIN = 'https://open.api.nexon.com';
const FAKE_KEY = 'sdk-live-smoke-invalid';
const PLAYER_NAME = 'sdk_smoke';
const REQUEST_INTERVAL_MS = 150;

type Sdk = typeof BuiltSdk;
type StaticMethod = SdkMethod & { operation: string };
type ShapeWarning = Parameters<NonNullable<HttpLogger['onResponseShapeMismatch']>>[0];

const authCases: ReadonlyArray<
  [
    game: string,
    path: string,
    query: Record<string, string>,
    call: (c: NexonClient) => Promise<unknown>,
  ]
> = [
  [
    'maplestory',
    '/maplestory/v1/id',
    { character_name: PLAYER_NAME },
    (c) => c.maplestory.getOcid(PLAYER_NAME),
  ],
  [
    'fconline',
    '/fconline/v1/id',
    { nickname: PLAYER_NAME },
    (c) => c.fcOnline.getOuid(PLAYER_NAME),
  ],
  [
    'maplestorym',
    '/maplestorym/v1/id',
    { world_name: '스카니아', character_name: PLAYER_NAME },
    (c) => c.maplestorym.getOcid('스카니아', PLAYER_NAME),
  ],
  [
    'maplestorysea',
    '/maplestorysea/v1/id',
    { character_name: PLAYER_NAME },
    (c) => c.maplestorySEA.getOcid(PLAYER_NAME),
  ],
  [
    'maplestorytw',
    '/maplestorytw/v1/id',
    { character_name: PLAYER_NAME },
    (c) => c.maplestoryTW.getOcid(PLAYER_NAME),
  ],
  [
    'tfd',
    '/tfd/v1/id',
    { user_name: PLAYER_NAME + '#1234' },
    (c) => c.firstDescendant.getOuid(PLAYER_NAME + '#1234'),
  ],
  [
    'heroes',
    '/heroes/v2/id',
    { character_name: PLAYER_NAME },
    (c) => c.mabinogiHeroes.getOcid(PLAYER_NAME),
  ],
  [
    'suddenattack',
    '/suddenattack/v1/id',
    { user_name: PLAYER_NAME },
    (c) => c.suddenAttack.getOuid(PLAYER_NAME),
  ],
  [
    'kartrush',
    '/kartrush/v1/id',
    { racer_name: PLAYER_NAME },
    (c) => c.kartrider.getOuidInfo(PLAYER_NAME),
  ],
  [
    'baram',
    '/baram/v1/id',
    { character_name: PLAYER_NAME, server_name: '연' },
    (c) => c.baram.getOcid(PLAYER_NAME, '연'),
  ],
  [
    'mabinogi',
    '/mabinogi/v1/auction/list',
    { auction_item_category: '검' },
    (c) => c.mabinogi.auction.listItems({ auction_item_category: '검' }),
  ],
  [
    'baramy',
    '/baramy/v1/id',
    { character_name: PLAYER_NAME, server_name: '연' },
    (c) => c.baramYeon.getOcid(PLAYER_NAME, '연'),
  ],
  ['v4', '/v4/v1/id', { character_name: PLAYER_NAME }, (c) => c.v4.getOcid(PLAYER_NAME)],
  ['hit2', '/hit2/v1/id', { character_name: PLAYER_NAME }, (c) => c.hit2.getOcid(PLAYER_NAME)],
  ['platform', '/platform/openapi/v1/notice', {}, (c) => c.platform.getNoticeList()],
];

interface StaticResult {
  readonly method: string;
  readonly path: string;
  readonly language?: string;
  size?: number;
  shapeWarnings: ShapeWarning[];
  differences: Record<string, number>;
  error?: string;
}

interface ImageResult {
  helper: string;
  images: number;
  attempts: {
    spid: number;
    url?: string;
    status?: number;
    contentType?: string | null;
    image?: boolean;
    error?: string;
  }[];
  passed: boolean;
}

interface AuthResult {
  game: string;
  url: string | undefined;
  statuses: number[];
  retries: number;
  checks: Record<string, boolean>;
  message: string;
  passed: boolean;
}

interface RequestLog {
  requests: Parameters<HttpLogger['onRequest']>[0][];
  statuses: number[];
  retries: number;
  warnings: ShapeWarning[];
  logger: HttpLogger;
}

function checkValue(
  value: unknown,
  shape: SdkShape,
  differences: Map<string, number>,
  path = '$',
): void {
  const record = (detail: string): void => {
    const key = path + ' ' + detail;
    differences.set(key, (differences.get(key) ?? 0) + 1);
  };
  if (shape.unsupported) {
    record('cannot compare type ' + shape.unsupported);
    return;
  }
  if (value === null) {
    if (!shape.nullable) record('unexpected null');
    return;
  }
  const actual = Array.isArray(value) ? 'array' : typeof value;
  if (!shape.types.includes(actual)) {
    record('expected ' + shape.types.join(' or ') + ', received ' + actual);
    return;
  }
  if (Array.isArray(value) && shape.items) {
    const itemShape = shape.items;
    for (const item of value) checkValue(item, itemShape, differences, path + '[]');
  } else if (isObject(value)) {
    for (const [key, property] of shape.properties) {
      if (Object.hasOwn(value, key)) {
        checkValue(value[key], property.shape, differences, fieldPath(path, key));
      } else if (!property.optional) {
        record('missing field ' + key);
      }
    }
    for (const key of Object.keys(value)) {
      if (!shape.properties.has(key)) record('additional field ' + key);
    }
  }
}

function checkedSize(data: unknown): number {
  if (Array.isArray(data) || typeof data === 'string') return data.length;
  return isObject(data) ? Object.keys(data).length : 0;
}

function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  return error.name + ': ' + error.message + (error.cause ? ' (' + String(error.cause) + ')' : '');
}

function captureRequests(): RequestLog {
  const log: RequestLog = {
    requests: [],
    statuses: [],
    retries: 0,
    warnings: [],
    logger: {
      onRequest: (info) => {
        log.requests.push(info);
      },
      onResponse: ({ status }) => {
        log.statuses.push(status);
      },
      onRetry: () => {
        log.retries += 1;
      },
      onResponseShapeMismatch: (info) => {
        log.warnings.push(info);
      },
    },
  };
  return log;
}

function passedStatic(row: StaticResult): boolean {
  return !row.error && row.shapeWarnings.length === 0 && Object.keys(row.differences).length === 0;
}

function printRow(values: (string | number)[]): void {
  const cells = values.map((value) =>
    String(value).replaceAll('|', '\\|').replace(/\r?\n/g, '<br>'),
  );
  console.log('| ' + cells.join(' | ') + ' |');
}

async function checkStatic(
  sdk: Sdk,
  methods: StaticMethod[],
): Promise<{ staticResults: StaticResult[]; spids: Set<number> }> {
  const staticResults: StaticResult[] = [];
  const spids = new Set<number>();
  for (const method of methods) {
    const template = method.operation.slice('GET '.length);
    const languages = template.includes('{') ? ['ko', 'en'] : [undefined];
    for (const language of languages) {
      const path = language ? template.replace(/\{[^}]+\}/g, language) : template;
      const log = captureRequests();
      const row: StaticResult = {
        method: method.name,
        path,
        ...(language ? { language } : {}),
        shapeWarnings: log.warnings,
        differences: {},
      };
      staticResults.push(row);
      try {
        const client = new sdk.NexonClient({
          apiKey: FAKE_KEY,
          responseValidation: true,
          maxRetries: 0,
          logger: log.logger,
        });
        const owners = {
          FcOnlineClient: client.fcOnline,
          SuddenAttackMetadataClient: client.suddenAttack.metadata,
          FirstDescendantMetaClient: client.firstDescendant.meta,
        };
        const [owner, name] = method.name.split('.');
        assert(
          owner && name && Object.hasOwn(owners, owner),
          '정적 메서드의 SDK 클라이언트를 지정하세요.',
        );
        const receiver = owners[owner as keyof typeof owners];
        const call: unknown = Reflect.get(receiver, name);
        assert(typeof call === 'function', '빌드에서 정적 메서드를 찾을 수 없습니다.');
        const data: unknown = await Reflect.apply(call, receiver, language ? [language] : []);
        deepEqual(
          log.requests.map(({ method, url }) => [method, url]),
          [['GET', ORIGIN + path]],
        );
        deepEqual(log.statuses, [200]);
        row.size = checkedSize(data);
        assert(row.size > 0, '빈 응답');
        assert(method.response, method.limitation ?? 'SDK 반환 타입을 찾을 수 없습니다.');
        const differences = new Map<string, number>();
        checkValue(data, method.response, differences);
        row.differences = Object.fromEntries(differences);
        if (name === 'getSpidMeta' && Array.isArray(data)) {
          for (const entry of data) {
            if (
              isObject(entry) &&
              typeof entry['id'] === 'number' &&
              Number.isSafeInteger(entry['id']) &&
              entry['id'] % 1_000_000 > 0
            ) {
              spids.add(entry['id']);
            }
          }
        }
      } catch (error) {
        row.error = errorMessage(error);
      }
      await delay(REQUEST_INTERVAL_MS);
    }
  }
  return { staticResults, spids };
}

async function checkImages(sdk: Sdk, spids: Set<number>): Promise<ImageResult[]> {
  const cdnClient = new sdk.NexonClient({ apiKey: FAKE_KEY }).fcOnline;
  const players = [...spids];
  // Include the SDK example when available and sample across the current metadata.
  const exampleSpid = 272167135;
  const samples = [
    ...new Set([
      ...(spids.has(exampleSpid) ? [exampleSpid] : []),
      ...Array.from(
        { length: Math.min(6, players.length) },
        (_, i) => players[Math.floor((i * players.length) / 6)]!,
      ),
    ]),
  ].slice(0, 6);
  const imageResults: ImageResult[] = [];
  const imageCases = {
    getActionShotUrl: (spid: number) => cdnClient.getActionShotUrl(spid),
    getPlayerImageUrl: (spid: number) => cdnClient.getPlayerImageUrl(spid % 1_000_000),
  };
  for (const [helper, urlFor] of Object.entries(imageCases)) {
    const attempts: ImageResult['attempts'] = [];
    for (const spid of samples) {
      const attempt: (typeof attempts)[number] = { spid };
      attempts.push(attempt);
      try {
        attempt.url = urlFor(spid);
        const response = await fetch(attempt.url, { signal: AbortSignal.timeout(10_000) });
        attempt.status = response.status;
        attempt.contentType = response.headers.get('content-type');
        attempt.image = response.status === 200 && /^image\//i.test(attempt.contentType ?? '');
        // The CDN can return a storage AccessDenied response for an absent image.
        const unavailable =
          response.status === 403 && /<Code>AccessDenied<\/Code>/.test(await response.text());
        if (response.status !== 403) await response.body?.cancel();
        if (!attempt.image && !unavailable && ![404, 410].includes(response.status)) {
          attempt.error = '예상 밖의 이미지 응답';
        }
      } catch (error) {
        attempt.error = errorMessage(error);
      }
      await delay(REQUEST_INTERVAL_MS);
    }
    const images = attempts.filter(({ image }) => image).length;
    imageResults.push({
      helper,
      images,
      attempts,
      passed: images > 0 && attempts.every(({ error }) => !error),
    });
  }
  return imageResults;
}

async function checkAuth(sdk: Sdk): Promise<AuthResult[]> {
  const authResults: AuthResult[] = [];
  for (const [game, path, query, call] of authCases) {
    const log = captureRequests();
    const client = new sdk.NexonClient({ apiKey: FAKE_KEY, maxRetries: 1, logger: log.logger });
    let outcome: unknown;
    try {
      await call(client);
    } catch (error) {
      outcome = error;
    }
    const request = log.requests[0];
    const error = outcome instanceof sdk.NexonError ? outcome : undefined;
    const url = request && new URL(request.url);
    const headers = new Headers(request?.headers);
    const checks = {
      authError:
        outcome instanceof sdk.NexonAuthError &&
        error?.code === 'OPENAPI00005' &&
        error.status === 400,
      guidance: /→ API 키가 올바르지 않습니다\..*https:\/\/openapi\.nexon\.com\//.test(
        error?.message ?? '',
      ),
      // 서버 원문 메시지가 에러에 그대로 담기는지 (예: "The apikey is not valid.")
      nexonMessage: typeof error?.nexonMessage === 'string' && error.nexonMessage.length > 0,
      noRetry: log.retries === 0 && log.statuses.join(',') === '400',
      request:
        log.requests.length === 1 &&
        request?.method === 'GET' &&
        url?.origin === ORIGIN &&
        url.pathname === path &&
        [...url.searchParams].length === Object.keys(query).length &&
        Object.entries(query).every(([key, value]) => url.searchParams.get(key) === value) &&
        headers.get('x-nxopen-api-key') === FAKE_KEY &&
        headers.get('accept') === 'application/json',
    };
    authResults.push({
      game,
      url: request?.url,
      statuses: log.statuses,
      retries: log.retries,
      checks,
      message:
        outcome === undefined ? 'API 호출이 오류 없이 반환되었습니다.' : errorMessage(outcome),
      passed: Object.values(checks).every(Boolean),
    });
    await delay(REQUEST_INTERVAL_MS);
  }
  return authResults;
}

async function main(): Promise<void> {
  const { values } = parseArgs({ options: { json: { type: 'boolean' } } });
  const dist = resolve(REPO_ROOT, 'dist/index.js');
  assert(existsSync(dist), 'dist/index.js를 찾을 수 없습니다. 먼저 yarn build를 실행하세요.');
  const sdk: Sdk = await import(pathToFileURL(dist).href);
  const manifest = readManifest();
  const portalGames = manifest.games.filter((game) => !game.external);
  deepEqual(
    authCases.map(([game]) => game).sort(),
    portalGames.map(({ slug }) => slug).sort(),
    '포털의 게임마다 인증 테스트 경로를 하나씩 지정하세요.',
  );
  const portalStatic = new Map(
    portalGames.flatMap((game) =>
      [...uniqueOperations(game).values()]
        .filter(({ path }) => path.startsWith('/static/'))
        .map(
          ({ method, path }) =>
            [normalizedOperation(method.toUpperCase() + ' ' + path), path] as const,
        ),
    ),
  );
  const methods = analyzeSdk().filter(
    (method): method is StaticMethod => method.operation?.startsWith('GET /static/') ?? false,
  );
  assert(methods.length > 0, 'SDK에서 정적 메타데이터 메서드를 찾을 수 없습니다.');
  const operations = new Set(methods.map(({ operation }) => normalizedOperation(operation)));
  const missingOperations = [...portalStatic]
    .filter(([op]) => !operations.has(op))
    .map(([, path]) => path);
  const sdkOnlyOperations = [...operations].filter((op) => !portalStatic.has(op));

  const { staticResults, spids } = await checkStatic(sdk, methods);
  const imageResults = await checkImages(sdk, spids);
  const authResults = await checkAuth(sdk);

  const shapeWarnings = staticResults.reduce((count, row) => count + row.shapeWarnings.length, 0);
  const failedCalls = staticResults.filter((row) => !passedStatic(row));
  const summary = {
    staticEndpoints: {
      passed: methods.length - new Set(failedCalls.map(({ method }) => method)).size,
      total: methods.length,
    },
    staticCalls: { passed: staticResults.length - failedCalls.length, total: staticResults.length },
    shapeWarnings,
    deep: {
      checked: staticResults.filter(({ error }) => !error).length,
      differences: staticResults.reduce(
        (count, row) => count + Object.keys(row.differences).length,
        0,
      ),
    },
    auth: { passed: authResults.filter(({ passed }) => passed).length, total: authResults.length },
  };
  const passed =
    missingOperations.length === 0 &&
    failedCalls.length === 0 &&
    imageResults.every((row) => row.passed) &&
    summary.auth.passed === summary.auth.total;
  if (values.json) {
    console.log(
      JSON.stringify(
        {
          passed,
          summary,
          missingOperations,
          sdkOnlyOperations,
          staticResults,
          imageResults,
          authResults,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      `정적 엔드포인트 ${summary.staticEndpoints.passed}/${summary.staticEndpoints.total}, 호출 ${summary.staticCalls.passed}/${summary.staticCalls.total}, shape 경고 ${shapeWarnings}건, 깊은 대조 ${summary.deep.checked}건 및 불일치 항목 ${summary.deep.differences}건`,
    );
    console.log(
      '\n| 정적 메서드 | 경로 | 결과 | 응답 크기 | Shape 경고 | 깊은 대조 |\n| --- | --- | --- | ---: | ---: | --- |',
    );
    for (const row of staticResults) {
      const details = Object.entries(row.differences)
        .map(([message, count]) => message + ' × ' + count)
        .join(', ');
      printRow([
        row.method,
        row.path,
        row.error ?? (passedStatic(row) ? 'PASS' : 'FAIL'),
        row.size ?? '-',
        row.shapeWarnings.length
          ? row.shapeWarnings.map((warning) => JSON.stringify(warning)).join('<br>')
          : '0',
        details || (row.error ? '-' : '일치'),
      ]);
    }
    if (missingOperations.length > 0)
      console.log('\n포털 스펙에만 있는 정적 경로 ' + missingOperations.join(', '));
    if (sdkOnlyOperations.length > 0)
      console.log('\nSDK에만 있는 정적 경로 ' + sdkOnlyOperations.join(', '));
    console.log('\n| FC 이미지 헬퍼 | 성공 비율 | 결과 | 시도 |\n| --- | ---: | --- | --- |');
    for (const row of imageResults) {
      const attempts = row.attempts
        .map(
          ({ spid, status, contentType, error }) =>
            spid + ' → ' + (error ?? [status, contentType].filter(Boolean).join(' ')),
        )
        .join(', ');
      printRow([
        row.helper,
        row.images + '/' + row.attempts.length,
        row.passed ? 'PASS' : 'FAIL',
        attempts,
      ]);
    }
    console.log('\n| 인증 확인 | URL | 상태 | 재시도 | 결과 |\n| --- | --- | --- | ---: | --- |');
    for (const row of authResults) {
      const failed = Object.entries(row.checks)
        .filter(([, ok]) => !ok)
        .map(([check]) => check)
        .join(', ');
      printRow([
        row.game,
        row.url ?? '-',
        row.statuses.join(', ') || '-',
        row.retries,
        row.passed ? 'PASS (NexonAuthError OPENAPI00005)' : 'FAIL (' + failed + ') ' + row.message,
      ]);
    }
    console.log(
      '\n인증 거절은 게이트웨이의 키 검사를 확인합니다. 보호된 엔드포인트의 정상 응답을 확인하려면 유효한 키가 필요합니다.',
    );
  }
  if (!passed) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(errorMessage(error));
  process.exitCode = 1;
});
