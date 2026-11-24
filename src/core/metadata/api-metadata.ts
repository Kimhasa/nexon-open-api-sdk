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
    note: "Real API E2E with a development key on 2026-11-24 (yarn test:deep): 55 of 56 methods called with 6 public ranking characters (2 with battle-practice replays) and the key owner's account. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json). Not called: getLegacyOuid (needs a legacy developer-center key).",
  },
  maplestorym: {
    game: 'MapleStory M',
    pathPrefix: 'maplestorym',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 38,
    note: 'Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 38 methods called with 3 public ranking characters. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },
  maplestorysea: {
    game: 'MapleStory SEA',
    pathPrefix: 'maplestorysea',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 26,
    note: 'Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 26 methods called with 3 public characters (incl. guild APIs). Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },
  fconline: {
    game: 'EA SPORTS FC Online',
    pathPrefix: 'fconline',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 18,
    note: "Real API E2E with a development key on 2026-11-24 (yarn test:deep): 13 of 16 HTTP methods called with 3 public ranking managers. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json). Not called: getTradeList (returns only the key owner's own transfer-market trades), getAllMatchList (service ended), getSeasonIdMeta (deprecated; its static file is checked by yarn test:live). Image URL helpers are checked by yarn test:live.",
  },

  // ── 아래 자리는 게임 구현 워커가 채운다: 자기 게임의 [slot] 주석 한 줄을 엔트리로 교체 ──

  maplestorytw: {
    game: 'MapleStory Taiwan',
    pathPrefix: 'maplestorytw',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 27,
    note: 'Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 27 methods called with 3 public characters (incl. guild APIs). Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  tfd: {
    game: 'The First Descendant',
    pathPrefix: 'tfd',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 42,
    note: 'OUID(1) + User(6) + Meta(32) + Recommendation(1) + Leaderboard(2). Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 42 methods called with 2 public leaderboard players. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  heroes: {
    game: 'Mabinogi Heroes',
    pathPrefix: 'heroes',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 19,
    note: 'OCID(1) + Character V2(6) + Meta(1) + Notice V1(6) + Marketplace(3) + Ranking(2). Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 19 methods called with 4 public ranking characters. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  suddenattack: {
    game: 'Sudden Attack',
    pathPrefix: 'suddenattack',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 11,
    note: 'Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 11 methods called with 3 public ranking players. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  kartrush: {
    game: 'KartRider Rush+',
    pathPrefix: 'kartrush',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 9,
    note: 'OUID(1) + User(2) + Notice(6). Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 9 methods called with 3 racers. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  baram: {
    game: 'The Kingdom of the Winds (Baram)',
    pathPrefix: 'baram',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 7,
    note: 'OCID(1) + Character(6). Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 7 methods called with 3 public ranking characters. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  mabinogi: {
    game: 'Mabinogi',
    pathPrefix: 'mabinogi',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 5,
    note: 'Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 5 methods called (auction, NPC shop, horn bugle). Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  baramy: {
    game: 'The Kingdom of the Winds: Yeon (Baram: Yeon)',
    pathPrefix: 'baramy',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 4,
    note: 'OCID(1) + Character(3). Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 4 methods called with 3 characters. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  v4: {
    game: 'V4',
    pathPrefix: 'v4',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 4,
    note: 'OCID(1) + Character(3). Real API E2E with a development key on 2026-11-24 (yarn test:deep): all 4 methods called with 3 public ranking characters. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  hit2: {
    game: 'HIT2',
    pathPrefix: 'hit2',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 2,
    note: 'OCID(1) + Character(1). Real API E2E with a development key on 2026-11-24 (yarn test:deep): both methods called with 3 public ranking characters. Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
  },

  platform: {
    game: 'NEXON Open API Platform (Open API notices)',
    pathPrefix: 'platform',
    lastVerifiedAt: '2026-11-24',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 1,
    note: 'Notice(1), path /platform/openapi/v1/notice. Real API E2E with a development key on 2026-11-24 (yarn test:deep). Responses were compared with the SDK types down to nested fields (0 differences); where live data differs from the portal spec, types follow the live data (specs/drift-baseline.json).',
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
