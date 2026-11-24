import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 입력이 잘못되어 조회하지 못함 (HTTP 400).
 *
 * - `OPENAPI00004`: 파라미터 누락 또는 유효하지 않음. 빈 이름, 형식이 틀린 날짜, 허용되지 않는 값 등
 * - `OPENAPI00006`: 유효하지 않은 게임 또는 API PATH. 넥슨이 이 게임 또는 API 주소를 찾지 못했다
 *
 * 빈 캐릭터명이나 달력에 없는 날짜처럼 보내 봐야 실패할 입력은 SDK가 요청을 보내기 전에 거부합니다
 * (항상 `OPENAPI00004`). `message` 에 어떤 값이 왜 틀렸고 어떻게 고치는지가 들어 있습니다.
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonBadRequestError) {
 *     console.log(err.message); // 무엇이 틀렸고 어떻게 고치는지
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
