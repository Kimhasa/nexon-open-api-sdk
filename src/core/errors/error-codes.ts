/**
 * NEXON Open API 에러 코드 상수.
 *
 * 주석의 의미와 HTTP 상태는 NEXON Open API 포털의 응답코드 표를 기준으로 설명합니다 (2026-11-24 확인).
 * 실제 서버가 돌려주는 HTTP 상태는 표와 다를 수 있으므로 SDK는 상태가 아니라 코드로 에러를 분류합니다.
 *
 * @see https://openapi.nexon.com/ko/guide/request-api/
 */
export const NEXON_ERROR_CODES = {
  /** 서버 내부 오류 (HTTP 500) */
  SERVER_ERROR: 'OPENAPI00001',
  /** 권한이 없는 경우 (HTTP 403). 이 API Key로는 이 API를 쓸 수 없다 */
  UNAUTHORIZED: 'OPENAPI00002',
  /** 유효하지 않은 식별자 (HTTP 400). 없는 캐릭터·길드·계정이거나 더 이상 쓸 수 없는 식별자 */
  NOT_FOUND: 'OPENAPI00003',
  /** 파라미터 누락 또는 유효하지 않음 (HTTP 400). SDK의 요청 전 입력 검증도 이 코드를 쓴다 */
  BAD_REQUEST: 'OPENAPI00004',
  /** 유효하지 않은 API Key (HTTP 400) */
  INVALID_API_KEY: 'OPENAPI00005',
  /**
   * @deprecated 포털 표에서 `OPENAPI00005` 는 "권한 없음"이 아니라 "유효하지 않은 API Key"입니다.
   * `NEXON_ERROR_CODES.INVALID_API_KEY` 를 사용하세요.
   */
  FORBIDDEN: 'OPENAPI00005',
  /** 유효하지 않은 게임 또는 API PATH (HTTP 400). 다른 게임용 API Key로 불러도 이 코드가 온다 */
  INVALID_GAME_OR_PATH: 'OPENAPI00006',
  /**
   * @deprecated 포털 표에서 `OPENAPI00006` 은 "파라미터 오류"가 아니라 "유효하지 않은 게임 또는 API PATH"입니다.
   * `NEXON_ERROR_CODES.INVALID_GAME_OR_PATH` 를 사용하세요.
   */
  INVALID_PARAM: 'OPENAPI00006',
  /** API 호출량 초과 (HTTP 429) */
  RATE_LIMIT: 'OPENAPI00007',
  /**
   * @deprecated `OPENAPI00008` 은 포털의 응답코드 표에 없는 코드입니다. 기존 코드와의 호환을 위해 남겨 둡니다.
   * 점검은 `NEXON_ERROR_CODES.GAME_MAINTENANCE` 와 `NEXON_ERROR_CODES.API_MAINTENANCE` 로 구분하세요.
   */
  MAINTENANCE: 'OPENAPI00008',
  /** 데이터 준비 중 (HTTP 400). 조회한 날짜의 데이터가 아직 만들어지지 않았다 */
  DATA_NOT_READY: 'OPENAPI00009',
  /** 게임 점검 중 (HTTP 400) */
  GAME_MAINTENANCE: 'OPENAPI00010',
  /**
   * @deprecated 포털 표에서 `OPENAPI00010` 은 "데이터 준비 중"이 아니라 "게임 점검 중"입니다.
   * `NEXON_ERROR_CODES.GAME_MAINTENANCE` 를 사용하세요.
   */
  DATA_PREPARING: 'OPENAPI00010',
  /** API 점검 중 (HTTP 503) */
  API_MAINTENANCE: 'OPENAPI00011',
  /**
   * @deprecated 포털 표에서 `OPENAPI00011` 은 "서버 과부하"가 아니라 "API 점검 중"입니다.
   * `NEXON_ERROR_CODES.API_MAINTENANCE` 를 사용하세요.
   */
  SERVER_OVERLOAD: 'OPENAPI00011',
} as const;

export type NexonErrorCode = (typeof NEXON_ERROR_CODES)[keyof typeof NEXON_ERROR_CODES];
