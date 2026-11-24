import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 인증/권한 오류.
 *
 * HTTP 상태가 아니라 넥슨 에러 코드로 분류하고, `status` 에는 서버가 준 값을 그대로 담습니다.
 * 실제 서버는 잘못된 API 키에 HTTP 400 + `OPENAPI00005` 를 돌려줍니다 (2026-11-24 확인).
 *
 * - `OPENAPI00002`: 유효하지 않은 API 키
 * - `OPENAPI00005`: 해당 게임에 대한 API 키 권한 없음
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonAuthError) {
 *     // API 키를 확인하세요: https://openapi.nexon.com/
 *   }
 * }
 * ```
 */
export class NexonAuthError extends NexonError {
  constructor(message: string, { status, code }: { status: number; code: NexonErrorCode }) {
    super(message, { status, code });
    this.name = 'NexonAuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
