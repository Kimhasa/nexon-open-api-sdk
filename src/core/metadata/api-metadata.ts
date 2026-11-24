/**
 * 게임별 API 검증 메타데이터.
 *
 * SDK 타입을 넥슨 API(실응답 또는 포털 스펙)와 마지막으로 대조한 시점을 기록합니다.
 * 대조 방식(실 API E2E인지, 포털 스펙 기준인지)은 `note`에 적습니다.
 */
export interface GameApiMetadata {
  /** 게임 이름 */
  readonly game: string;
  /** API URL path prefix */
  readonly pathPrefix: string;
  /** SDK 타입을 넥슨 API(실응답 또는 포털 스펙)와 마지막으로 대조한 날짜 (YYYY-MM-DD) */
  readonly lastVerifiedAt: string;
  /** 그 대조 결과가 처음 포함된 SDK 릴리즈 버전 (npm에 게시된 버전) */
  readonly sdkVersionAtVerification: string;
  /** SDK가 지원하는 API 수 = 게임 클라이언트의 public API 메서드 수 (메서드 1개 = API 경로 1개) */
  readonly endpointCount: number;
  /** 검증 방식·범위에 대한 비고 */
  readonly note?: string | undefined;
}

/**
 * 게임별 API 메타데이터 레지스트리.
 *
 * 새 게임 추가 시 이 객체에 엔트리를 추가합니다. 키는 API path prefix와 같습니다.
 */
export const API_METADATA: Readonly<Record<string, GameApiMetadata>> = {
  maplestory: {
    game: 'MapleStory KMS',
    pathPrefix: 'maplestory',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 56,
    note: 'Portal OpenAPI spec (specs/openapi/maplestory/, 2026-11-24): all 56 operations, request params and response fields compared. Not verified with a real API key; the last real-API E2E run was 43/43 on 2026-03-05 (PR #2, 48 methods).',
  },
  maplestorym: {
    game: 'MapleStory M',
    pathPrefix: 'maplestorym',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 38,
    note: 'Portal OpenAPI spec (specs/openapi/maplestorym/, 2026-11-24) and spec-based fixtures. Not verified with a real API key for this update.',
  },
  maplestorysea: {
    game: 'MapleStory SEA',
    pathPrefix: 'maplestorysea',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 26,
    note: 'Portal OpenAPI spec (specs/openapi/maplestorysea/, 2026-11-24). All 26 response shapes and MSW fixtures verified. Not verified with a real API key.',
  },
  fconline: {
    game: 'EA SPORTS FC Online',
    pathPrefix: 'fconline',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 18,
    note: 'Portal OpenAPI spec (specs/openapi/fconline/, 2026-11-24). Public static metadata and image CDN checked without a key. Authenticated endpoints verified with MSW fixtures.',
  },

  // ── 아래 자리는 게임 구현 워커가 채운다: 자기 게임의 [slot] 주석 한 줄을 엔트리로 교체 ──

  maplestorytw: {
    game: 'MapleStory Taiwan',
    pathPrefix: 'maplestorytw',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 27,
    note: 'Portal OpenAPI spec (specs/openapi/maplestorytw/, 2026-11-24). Not verified with a real API key.',
  },

  tfd: {
    game: 'The First Descendant',
    pathPrefix: 'tfd',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 42,
    note: 'OUID(1) + User(6) + Meta(32) + Recommendation(1) + Leaderboard(2). Portal OpenAPI spec (specs/openapi/tfd/, 2026-11-24). The 32 static meta files were checked against live responses (no key needed); types follow the live data where it differs from the spec. The 10 keyed APIs are not verified with a real API key (spec-based synthetic fixtures).',
  },

  heroes: {
    game: 'Mabinogi Heroes',
    pathPrefix: 'heroes',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 19,
    note: 'OCID(1) + Character V2(6) + Meta(1) + Notice V1(6) + Marketplace(3) + Ranking(2). Portal OpenAPI spec (specs/openapi/heroes/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec, and nullable fields are an SDK-side assumption (the spec marks none).',
  },

  suddenattack: {
    game: '서든어택',
    pathPrefix: 'suddenattack',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 11,
    note: 'Portal OpenAPI spec (specs/openapi/suddenattack/, 2026-11-24). All four static metadata endpoints verified against live data. Authenticated endpoints were mocked from the spec.',
  },

  kartrush: {
    game: 'KartRider Rush+',
    pathPrefix: 'kartrush',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 9,
    note: 'OUID(1) + User(2) + Notice(6). Portal OpenAPI spec (specs/openapi/kartrush/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec.',
  },

  baram: {
    game: 'The Kingdom of the Winds (Baram)',
    pathPrefix: 'baram',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 7,
    note: 'OCID(1) + Character(6). Portal OpenAPI spec (specs/openapi/baram/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec.',
  },

  mabinogi: {
    game: '마비노기',
    pathPrefix: 'mabinogi',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 5,
    note: 'Portal OpenAPI spec (specs/openapi/mabinogi/, 2026-11-24). Fixtures synthesized from the spec. Not verified with a real API key.',
  },

  baramy: {
    game: 'The Kingdom of the Winds: Yeon (Baram: Yeon)',
    pathPrefix: 'baramy',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 4,
    note: 'OCID(1) + Character(3). Portal OpenAPI spec (specs/openapi/baramy/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec.',
  },

  v4: {
    game: 'V4',
    pathPrefix: 'v4',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 4,
    note: 'OCID(1) + Character(3). Portal OpenAPI spec (specs/openapi/v4/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec.',
  },

  hit2: {
    game: 'HIT2',
    pathPrefix: 'hit2',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 2,
    note: 'OCID(1) + Character(1). Portal OpenAPI spec (specs/openapi/hit2/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec.',
  },

  platform: {
    game: 'NEXON Open API Platform (Open API notices)',
    pathPrefix: 'platform',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 1,
    note: 'Notice(1), path /platform/openapi/v1/notice. Portal OpenAPI spec (specs/openapi/platform/, 2026-11-24). Not verified with a real API key; fixtures are synthesized from the spec.',
  },
};

/**
 * 특정 게임의 API 메타데이터를 조회한다.
 *
 * @param gameId - 게임 식별자 = API path prefix (예: `'maplestory'`, `'fconline'`)
 * @returns 해당 게임의 메타데이터, 없으면 `undefined`
 *
 * @example
 * ```ts
 * import { getApiMetadata } from 'nexon-open-api';
 *
 * const meta = getApiMetadata('maplestory');
 * if (meta) {
 *   console.log(`${meta.game}: 마지막 검증 ${meta.lastVerifiedAt}`);
 * }
 * ```
 */
export function getApiMetadata(gameId: string): GameApiMetadata | undefined {
  return API_METADATA[gameId];
}
