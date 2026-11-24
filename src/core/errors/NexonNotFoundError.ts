import { NexonError } from './NexonError.js';
import { NEXON_ERROR_CODES } from './error-codes.js';

/**
 * 캐릭터·길드·계정을 찾을 수 없음 (HTTP 400, `OPENAPI00003` 유효하지 않은 식별자).
 *
 * - 캐릭터명·길드명·닉네임에 오타가 있거나, 월드·서버를 잘못 골랐다
 * - 닉네임을 바꾸기 전의 이름으로 조회했다
 * - 저장해 둔 고유 번호(OCID·OUID)가 게임 콘텐츠 변경으로 바뀌어 더 이상 쓸 수 없다.
 *   이름으로 고유 번호를 다시 받으세요
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonNotFoundError) {
 *     console.log('캐릭터를 찾을 수 없어요. 이름을 다시 확인해 주세요.');
 *   }
 * }
 * ```
 */
export class NexonNotFoundError extends NexonError {
  constructor(message: string, { nexonMessage }: { nexonMessage?: string | undefined } = {}) {
    super(message, {
      status: 400,
      code: NEXON_ERROR_CODES.NOT_FOUND,
      nexonMessage,
    });
    this.name = 'NexonNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
