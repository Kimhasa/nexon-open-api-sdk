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
    lastVerifiedAt: '2026-03-05',
    sdkVersionAtVerification: '0.1.0',
    endpointCount: 48,
    note: 'E2E script (yarn test:maplestory) passed 43/43 with a real API key (PR #2). Not re-verified since.',
  },
  maplestorym: {
    game: 'MapleStory M',
    pathPrefix: 'maplestorym',
    lastVerifiedAt: '2026-03-05',
    sdkVersionAtVerification: '0.1.1',
    endpointCount: 37,
    note: 'E2E script (yarn test:maplestory-m) passed 37/37 with a real API key (PR #2). Not re-verified since.',
  },
  maplestorysea: {
    game: 'MapleStory SEA',
    pathPrefix: 'maplestorysea',
    lastVerifiedAt: '2026-03-09',
    sdkVersionAtVerification: '0.1.1',
    endpointCount: 26,
    note: 'OCID(1) + Character(19) + Union(4) + Guild(2). Types from the Nexon portal spec; no real-API E2E run on record.',
  },
  fconline: {
    game: 'EA SPORTS FC Online',
    pathPrefix: 'fconline',
    lastVerifiedAt: '2026-03-05',
    sdkVersionAtVerification: '0.1.1',
    endpointCount: 16,
    note: '14 HTTP methods + 2 image URL helpers. E2E script (yarn test:fconline) passed 14/15 with a real API key (PR #2); the failing check was not recorded.',
  },

  // ── 아래 자리는 게임 구현 워커가 채운다: 자기 게임의 [slot] 주석 한 줄을 엔트리로 교체 ──

  // [slot:maplestorytw] MapleStory Taiwan (메이플스토리 대만)

  // [slot:tfd] 퍼스트 디센던트 (The First Descendant)

  // [slot:heroes] 마비노기 영웅전

  // [slot:suddenattack] 서든어택

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

  // [slot:mabinogi] 마비노기

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

  // [slot:hit2] 히트2

  // [slot:platform] 넥슨 Open API 플랫폼 (Open API 공지)
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
