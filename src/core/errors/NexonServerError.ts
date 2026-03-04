import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * Nexon 서버 오류 (HTTP 5xx).
 *
 * - `OPENAPI00001`: 서버 내부 오류
 * - `OPENAPI00008`: 서버 점검 중
 * - `OPENAPI00011`: 서버 과부하
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonServerError) {
 *     // Nexon Open API 서비스 상태를 확인하세요.
 *   }
 * }
 * ```
 */
export class NexonServerError extends NexonError {
  constructor(
    message: string,
    { status, code }: { status: number; code?: NexonErrorCode | undefined },
  ) {
    super(message, { status, code });
    this.name = 'NexonServerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
