/**
 * Nexon Open API 에러 코드 상수.
 * @see https://openapi.nexon.com/ko/guide/request-api/
 */
export const NEXON_ERROR_CODES = {
  /** 서버 내부 오류 */
  SERVER_ERROR: 'OPENAPI00001',
  /** 유효하지 않은 API 키 */
  UNAUTHORIZED: 'OPENAPI00002',
  /** 캐릭터/길드 식별자(OCID)를 찾을 수 없음 */
  NOT_FOUND: 'OPENAPI00003',
  /** 요청 파라미터 오류 (날짜 형식 등) */
  BAD_REQUEST: 'OPENAPI00004',
  /** API 키 권한 없음 */
  FORBIDDEN: 'OPENAPI00005',
  /** 요청 파라미터 오류 (구체적인 필드) */
  INVALID_PARAM: 'OPENAPI00006',
  /** 요청 한도 초과 (Rate Limit) */
  RATE_LIMIT: 'OPENAPI00007',
  /** 서버 점검 중 */
  MAINTENANCE: 'OPENAPI00008',
  /** 조회 가능한 데이터 없음 (조회 기간 전) */
  DATA_NOT_READY: 'OPENAPI00009',
  /** 조회 가능한 데이터 없음 (일 단위 데이터 미준비) */
  DATA_PREPARING: 'OPENAPI00010',
  /** 서버 과부하 */
  SERVER_OVERLOAD: 'OPENAPI00011',
} as const;

export type NexonErrorCode = (typeof NEXON_ERROR_CODES)[keyof typeof NEXON_ERROR_CODES];
