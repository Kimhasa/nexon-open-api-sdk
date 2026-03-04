import { NexonError } from './NexonError.js';
import { NEXON_ERROR_CODES } from './error-codes.js';

/**
 * 요청 한도 초과 오류 (HTTP 429).
 *
 * Nexon Open API는 분당 요청 수 제한이 있습니다.
 * `retryAfterMs`를 참조해 대기 후 재시도하거나,
 * SDK의 자동 재시도 기능을 활용하세요.
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonRateLimitError) {
 *     await sleep(err.retryAfterMs ?? 1000);
 *     // retry...
 *   }
 * }
 * ```
 */
export class NexonRateLimitError extends NexonError {
  /**
   * Retry-After 헤더에서 파싱한 대기 시간 (밀리초).
   * 헤더가 없으면 `undefined`.
   */
  readonly retryAfterMs: number | undefined;

  constructor(message: string, { retryAfterMs }: { retryAfterMs?: number | undefined } = {}) {
    super(message, {
      status: 429,
      code: NEXON_ERROR_CODES.RATE_LIMIT,
    });
    this.name = 'NexonRateLimitError';
    this.retryAfterMs = retryAfterMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
