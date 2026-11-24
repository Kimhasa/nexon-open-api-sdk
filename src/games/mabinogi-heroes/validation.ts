import { NexonBadRequestError } from '../../core/errors/NexonBadRequestError.js';
import { NEXON_ERROR_CODES } from '../../core/errors/error-codes.js';

/**
 * 비어 있지 않은 문자열인지 확인한다. 서버 400 응답을 기다리지 않고 요청 전에 throw한다.
 *
 * @param value - 검사할 값
 * @param label - 에러 메시지에 쓸 파라미터 표기 (예: `'ocid'`)
 * @param hint - 올바른 값을 얻는 방법 안내
 * @throws {NexonBadRequestError} 문자열이 아니거나 공백뿐일 때
 */
export function assertNonEmptyString(value: unknown, label: string, hint: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new NexonBadRequestError(
      `${label} 이(가) 비어 있습니다. ${hint} (API를 호출하지 않고 SDK에서 중단했습니다.)`,
      { code: NEXON_ERROR_CODES.INVALID_PARAM },
    );
  }
}

/**
 * 허용된 값 중 하나인지 확인한다.
 *
 * @throws {NexonBadRequestError} 허용 목록에 없는 값일 때
 */
export function assertOneOf(
  value: unknown,
  allowed: readonly string[],
  label: string,
  hint: string,
): void {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new NexonBadRequestError(
      `${label} 값 ${JSON.stringify(value)} 은(는) 사용할 수 없습니다. ` +
        `${allowed.map((v) => `'${v}'`).join(' 또는 ')} 중 하나를 문자열로 넘겨주세요. ${hint}`,
      { code: NEXON_ERROR_CODES.INVALID_PARAM },
    );
  }
}

/**
 * 1 이상의 정수인지 확인한다.
 *
 * @throws {NexonBadRequestError} 정수가 아니거나 1보다 작을 때
 */
export function assertPositiveInteger(value: unknown, label: string, hint: string): void {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new NexonBadRequestError(
      `${label} 값 ${JSON.stringify(value)} 은(는) 사용할 수 없습니다. 1 이상의 정수를 넘겨주세요. ${hint}`,
      { code: NEXON_ERROR_CODES.INVALID_PARAM },
    );
  }
}
