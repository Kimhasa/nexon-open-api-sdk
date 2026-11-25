import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * API Key 문제로 조회하지 못함.
 *
 * - `OPENAPI00005`: 유효하지 않은 API Key. API Key를 잘못 복사했거나 앞뒤에 공백·따옴표가 붙은 경우
 * - `OPENAPI00002`: 권한이 없는 경우. 이 API Key로는 이 API를 쓸 수 없다
 * - `OPENAPI00006`: 다른 게임용 API Key로 조회했거나 API 주소가 유효하지 않은 경우
 *
 * API Key는 게임마다 따로 발급됩니다. API Key를 발급받은 게임과 조회하려는 게임이 같은지 확인하세요.
 *
 * HTTP 상태가 아니라 넥슨 에러 코드로 분류하고, `status` 에는 서버가 준 값을 그대로 담습니다.
 * 실제 서버는 잘못된 API Key에 HTTP 400 + `OPENAPI00005` 를 돌려줍니다 (2026-11-24 확인).
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonAuthError) {
 *     // 사용자에게 보여 줄 문제가 아니라 운영자가 API Key를 확인해야 하는 문제다
 *     console.error('API Key를 확인하세요:', err.message);
 *   }
 * }
 * ```
 */
export class NexonAuthError extends NexonError {
  constructor(
    message: string,
    {
      status,
      code,
      nexonMessage,
    }: { status: number; code: NexonErrorCode; nexonMessage?: string | undefined },
  ) {
    super(message, { status, code, nexonMessage });
    this.name = 'NexonAuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
