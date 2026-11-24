import { NexonBadRequestError } from '../../core/errors/NexonBadRequestError.js';
import { NEXON_ERROR_CODES } from '../../core/errors/error-codes.js';

/**
 * 필수 문자열 파라미터가 비어 있으면 요청을 보내기 전에 throw한다.
 *
 * 서버의 400 응답(OPENAPI00004)을 기다리지 않고 SDK 경계에서 같은 에러 타입으로 알려준다.
 *
 * @param value - 검사할 값 (JS 호출자를 고려해 `unknown` 으로 받는다)
 * @param name - 파라미터 이름 (에러 메시지용)
 * @param hint - 올바른 값을 얻는 방법 안내
 * @throws {NexonBadRequestError} 값이 문자열이 아니거나 공백뿐일 때
 */
export function assertNonEmptyString(value: unknown, name: string, hint: string): void {
  if (typeof value === 'string' && value.trim() !== '') return;
  throw new NexonBadRequestError(
    `${name} 값이 비어 있습니다. 요청을 보내지 않았습니다.\n→ ${hint}`,
    { code: NEXON_ERROR_CODES.BAD_REQUEST },
  );
}

/**
 * 정수 범위 파라미터를 검사한다.
 *
 * @param value - 검사할 값
 * @param name - 파라미터 이름 (에러 메시지용)
 * @param min - 허용 최솟값 (포함)
 * @param max - 허용 최댓값 (포함). 생략 시 상한 없음
 * @throws {NexonBadRequestError} 정수가 아니거나 범위를 벗어날 때
 */
export function assertIntegerInRange(
  value: unknown,
  name: string,
  min: number,
  max?: number,
): void {
  const ok =
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    (max === undefined || value <= max);
  if (ok) return;
  const range = max === undefined ? `${min} 이상의 정수` : `${min}~${max} 사이의 정수`;
  throw new NexonBadRequestError(
    `${name} 값이 올바르지 않습니다: ${String(value)}. 요청을 보내지 않았습니다.\n→ ${range}를 입력하세요.`,
    { code: NEXON_ERROR_CODES.BAD_REQUEST },
  );
}
