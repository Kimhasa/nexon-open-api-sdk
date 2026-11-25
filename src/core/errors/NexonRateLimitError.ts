import { NexonError } from './NexonError.js';
import { NEXON_ERROR_CODES } from './error-codes.js';

/**
 * API 호출량 초과 (HTTP 429 또는 `OPENAPI00007`).
 *
 * 호출량은 애플리케이션별로 합산됩니다. 넥슨 안내 기준(2026-11-24)으로
 * 호출 허용량은 개발 단계에서 초당 5건·1일 1,000건, 서비스 단계에서 초당 500건·1일 20,000,000건입니다.
 *
 * HTTP 429는 SDK가 잠시 기다렸다가 자동으로 다시 시도하고(기본 3회), 그래도 실패하면 이 에러를 던집니다.
 * 같은 캐릭터를 다시 조회할 때는 저장해 둔 결과를 쓰고, 한꺼번에 많이 부르지 않도록 나눠서 조회하세요.
 *
 * @see https://openapi.nexon.com/ko/guide/prepare-in-advance/
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonRateLimitError) {
 *     console.log('지금 조회가 몰리고 있어요. 조금 뒤 다시 시도해 주세요.');
 *     console.log(`권장 대기 시간: ${err.retryAfterMs ?? 1000}ms`);
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

  constructor(
    message: string,
    {
      retryAfterMs,
      nexonMessage,
    }: { retryAfterMs?: number | undefined; nexonMessage?: string | undefined } = {},
  ) {
    super(message, {
      status: 429,
      code: NEXON_ERROR_CODES.RATE_LIMIT,
      nexonMessage,
    });
    this.name = 'NexonRateLimitError';
    this.retryAfterMs = retryAfterMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
