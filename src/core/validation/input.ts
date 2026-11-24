import { NEXON_ERROR_CODES } from '../errors/error-codes.js';
import { NexonBadRequestError } from '../errors/NexonBadRequestError.js';

/** Report a validation failure before sending an API request. */
export function invalidInput(message: string, hint?: string): never {
  throw new NexonBadRequestError(hint ? `${message} ${hint}` : message, {
    code: NEXON_ERROR_CODES.BAD_REQUEST,
  });
}

export function assertNonEmptyString(
  value: unknown,
  name: string,
  hint?: string,
): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    invalidInput(
      `${name} 값이 비어 있거나 문자열이 아닙니다.`,
      hint ?? '비어 있지 않은 문자열을 입력하세요.',
    );
  }
}

export function assertOneOf<T extends string | number>(
  value: unknown,
  allowed: readonly T[],
  name: string,
  hint?: string,
): asserts value is T {
  if (!(allowed as readonly unknown[]).includes(value)) {
    const choices = allowed.map((choice) => JSON.stringify(choice)).join(', ');
    invalidInput(`${name} 값이 허용 목록에 없습니다. ${choices} 중 하나를 입력하세요.`, hint);
  }
}

interface IntegerOptions {
  readonly min?: number;
  readonly max?: number;
  readonly safe?: boolean;
  readonly hint?: string;
}

/** Use safe only for endpoints that already require a safe integer. */
export function assertInteger(
  value: unknown,
  name: string,
  { min = -Infinity, max = Infinity, safe = false, hint }: IntegerOptions = {},
): asserts value is number {
  const isInteger = safe ? Number.isSafeInteger : Number.isInteger;
  if (typeof value !== 'number' || !isInteger(value) || value < min || value > max) {
    const bounds = [min === -Infinity ? '' : `${min} 이상`, max === Infinity ? '' : `${max} 이하`]
      .filter(Boolean)
      .join(' ');
    const expected = [bounds, safe ? '안전한 정수' : '정수'].filter(Boolean).join(' ');
    invalidInput(`${name} 값이 올바르지 않습니다. ${expected}를 입력하세요.`, hint);
  }
}

/** Compare calendar dates that have already been validated as YYYY-MM-DD. */
export function assertDateInRange(date: string, min: string, max: string, hint?: string): void {
  if (date < min || date > max) {
    invalidInput(`date must be between ${min} and ${max}.`, hint);
  }
}
