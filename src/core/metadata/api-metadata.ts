/**
 * 게임별 API 검증 메타데이터.
 *
 * SDK 타입이 실제 넥슨 API 응답과 일치하는지 마지막으로 확인한 시점을 기록합니다.
 */
export interface GameApiMetadata {
  /** 게임 이름 */
  readonly game: string;
  /** API URL path prefix */
  readonly pathPrefix: string;
  /** SDK 타입을 실제 API와 마지막으로 검증한 날짜 (YYYY-MM-DD) */
  readonly lastVerifiedAt: string;
  /** 검증 시점의 SDK 버전 */
  readonly sdkVersionAtVerification: string;
  /** 지원하는 엔드포인트 수 */
  readonly endpointCount: number;
  /** 검증 관련 비고 */
  readonly note?: string | undefined;
}

/**
 * 게임별 API 메타데이터 레지스트리.
 *
 * 새 게임 추가 시 이 객체에 엔트리를 추가합니다.
 */
export const API_METADATA: Readonly<Record<string, GameApiMetadata>> = {
  maplestory: {
    game: 'MapleStory KMS',
    pathPrefix: 'maplestory',
    lastVerifiedAt: '2025-06-01',
    sdkVersionAtVerification: '0.1.0',
    endpointCount: 45,
    note: '43/43 E2E tests passed with real API key',
  },
  maplestorym: {
    game: 'MapleStory M',
    pathPrefix: 'maplestorym',
    lastVerifiedAt: '2026-03-04',
    sdkVersionAtVerification: '0.2.0',
    endpointCount: 37,
    note: 'Types based on KMS patterns, API verification pending',
  },
};

/**
 * 특정 게임의 API 메타데이터를 조회한다.
 *
 * @param gameId - 게임 식별자 (예: `'maplestory'`)
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
