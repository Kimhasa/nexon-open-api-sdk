import { NEXON_ERROR_CODES } from './error-codes.js';
import { NexonError } from './NexonError.js';
import { NexonRateLimitError } from './NexonRateLimitError.js';
import { NexonAuthError } from './NexonAuthError.js';
import { NexonNotFoundError } from './NexonNotFoundError.js';
import { NexonBadRequestError } from './NexonBadRequestError.js';
import { NexonDataNotReadyError } from './NexonDataNotReadyError.js';
import { NexonServerError } from './NexonServerError.js';
import type { NexonErrorPayload } from './NexonError.js';

/**
 * HTTP 상태 코드와 Nexon 에러 코드를 기반으로 적절한 에러 인스턴스를 반환한다.
 *
 * @param status - HTTP 상태 코드
 * @param payload - Nexon API 에러 응답 페이로드 (파싱 실패 시 undefined)
 * @param retryAfterMs - Retry-After 헤더값 (밀리초)
 */
export function classifyError(
  status: number,
  payload: NexonErrorPayload | undefined,
  retryAfterMs?: number,
): NexonError {
  const code = payload?.error.name;
  const nexonMessage = payload?.error.message ?? 'Unknown error';
  const baseMessage = `[${code ?? status}] ${nexonMessage}`;

  // Rate Limit
  if (status === 429 || code === NEXON_ERROR_CODES.RATE_LIMIT) {
    return new NexonRateLimitError(
      `${baseMessage}\n→ 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.`,
      { retryAfterMs },
    );
  }

  // Auth errors
  if (code === NEXON_ERROR_CODES.UNAUTHORIZED || code === NEXON_ERROR_CODES.FORBIDDEN) {
    return new NexonAuthError(`${baseMessage}\n→ API 키를 확인하세요: https://openapi.nexon.com/`, {
      status,
      code,
    });
  }

  // Not found
  if (code === NEXON_ERROR_CODES.NOT_FOUND) {
    return new NexonNotFoundError(`${baseMessage}\n→ 캐릭터명 또는 길드명이 올바른지 확인하세요.`);
  }

  // Data not ready
  if (code === NEXON_ERROR_CODES.DATA_NOT_READY) {
    return new NexonDataNotReadyError(
      `${baseMessage}\n→ 해당 날짜의 데이터가 아직 준비되지 않았습니다. 서비스 시작일 이후 날짜를 입력하세요.`,
      { code },
    );
  }
  if (code === NEXON_ERROR_CODES.DATA_PREPARING) {
    return new NexonDataNotReadyError(
      `${baseMessage}\n→ 오늘 데이터는 KST 기준 익일 오전 1시 이후에 조회 가능합니다.`,
      { code },
    );
  }

  // Bad request
  if (
    status === 400 &&
    (code === NEXON_ERROR_CODES.BAD_REQUEST || code === NEXON_ERROR_CODES.INVALID_PARAM)
  ) {
    return new NexonBadRequestError(
      `${baseMessage}\n→ 요청 파라미터를 확인하세요. 날짜 형식: YYYY-MM-DD`,
      { code: code!, ...(nexonMessage !== undefined ? { nexonMessage } : {}) },
    );
  }

  // Server errors (5xx or maintenance/overload codes)
  if (
    status >= 500 ||
    code === NEXON_ERROR_CODES.SERVER_ERROR ||
    code === NEXON_ERROR_CODES.MAINTENANCE ||
    code === NEXON_ERROR_CODES.SERVER_OVERLOAD
  ) {
    return new NexonServerError(
      `${baseMessage}\n→ Nexon Open API 서버에 문제가 발생했습니다. 잠시 후 다시 시도하세요.`,
      { status, ...(code !== undefined ? { code } : {}) },
    );
  }

  // Fallback
  return new NexonError(baseMessage, { status, code, nexonMessage });
}
