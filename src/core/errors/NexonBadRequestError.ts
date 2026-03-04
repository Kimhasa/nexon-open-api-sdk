import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 요청 파라미터 오류 (HTTP 400).
 *
 * - `OPENAPI00004`: 날짜 형식 오류, 필수 파라미터 누락 등
 * - `OPENAPI00006`: 특정 필드 값 오류
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonBadRequestError) {
 *     console.log('요청 파라미터를 확인해주세요:', err.nexonMessage);
 *   }
 * }
 * ```
 */
export class NexonBadRequestError extends NexonError {
  constructor(
    message: string,
    { code, nexonMessage }: { code: NexonErrorCode; nexonMessage?: string | undefined },
  ) {
    super(message, { status: 400, code, nexonMessage });
    this.name = 'NexonBadRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
