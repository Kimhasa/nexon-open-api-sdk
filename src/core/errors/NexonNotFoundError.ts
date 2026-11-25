import { NexonError } from './NexonError.js';
import { NEXON_ERROR_CODES } from './error-codes.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 캐릭터·길드·계정을 찾을 수 없음 (HTTP 400).
 *
 * 두 경우에 던진다.
 *
 * - **이름으로 찾았는데 없음** — `getOcid('캐릭터명')`, `getOuid('닉네임')`, `guild.getId('길드명', '월드')` 같은 조회.
 *   넥슨은 없는 이름에 `OPENAPI00004`(파라미터 오류)를 돌려주거나(대부분의 게임), 식별자 없이 `null` 을 돌려준다
 *   (메이플스토리·MapleStorySEA·MapleStoryTaiwan 길드). SDK는 이를 이 에러로 바꿔 알려 주고, `code` 에는 넥슨이 준 값을 그대로 둔다 (2026-11-24 실측).
 *   캐릭터명 오타·띄어쓰기·대소문자, 월드·서버 선택, 닉네임 변경, 퍼스트 디센던트의 `#태그` 를 확인한다.
 * - **저장해 둔 식별자를 더 이상 쓸 수 없음** — `OPENAPI00003`(유효하지 않은 식별자).
 *   OCID·OUID는 게임 콘텐츠 변경으로 바뀔 수 있다. 이름으로 식별자를 다시 받는다.
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
  constructor(
    message: string,
    options: {
      nexonMessage?: string | undefined;
      /**
       * 넥슨이 준 에러 코드. 생략하면 `OPENAPI00003`.
       * 이름 조회에서는 `OPENAPI00004`, 코드 없이 null이 온 경우 `undefined` 를 명시한다
       */
      code?: NexonErrorCode | undefined;
      /** 넥슨이 준 HTTP 상태. 생략하면 400. 길드 이름 조회처럼 200과 null이 온 경우 200 */
      status?: number | undefined;
      cause?: unknown;
    } = {},
  ) {
    super(message, {
      status: options.status ?? 400,
      code: 'code' in options ? options.code : NEXON_ERROR_CODES.NOT_FOUND,
      nexonMessage: options.nexonMessage,
      cause: options.cause,
    });
    this.name = 'NexonNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
