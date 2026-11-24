import { NEXON_ERROR_CODES } from '../../core/errors/error-codes.js';
import { NexonBadRequestError } from '../../core/errors/NexonBadRequestError.js';

/**
 * 비어 있는 문자열 인자를 요청 전에 걸러낸다.
 *
 * 넥슨 서버의 400(OPENAPI00004)을 기다리지 않고 같은 에러 타입으로 즉시 throw해
 * 호출 한도를 쓰지 않고, 무엇을 고쳐야 하는지 메시지로 안내한다.
 *
 * @param value - 검사할 인자
 * @param name - 에러 메시지에 쓸 인자 이름
 * @param hint - 고치는 방법 안내
 * @throws {NexonBadRequestError} 문자열이 아니거나 공백뿐일 때 (`nexonMessage` 는 `undefined`)
 */
export function assertNonEmpty(
  value: unknown,
  name: string,
  hint: string,
): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new NexonBadRequestError(
      `${name} 값이 비어 있습니다. ${hint} (SDK가 요청을 보내기 전에 차단했습니다.)`,
      { code: NEXON_ERROR_CODES.BAD_REQUEST },
    );
  }
}

/**
 * 공지 식별자가 정수인지 요청 전에 확인한다.
 *
 * @param value - 검사할 공지 식별자
 * @param hint - 고치는 방법 안내
 * @throws {NexonBadRequestError} 정수가 아닐 때 (`nexonMessage` 는 `undefined`)
 */
export function assertNoticeId(value: unknown, hint: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new NexonBadRequestError(
      `noticeId 는 정수여야 합니다 (받은 값: ${String(value)}). ${hint} (SDK가 요청을 보내기 전에 차단했습니다.)`,
      { code: NEXON_ERROR_CODES.BAD_REQUEST },
    );
  }
}
