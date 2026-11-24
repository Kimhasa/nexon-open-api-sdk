import { NEXON_ERROR_CODES } from './error-codes.js';
import { NexonBadRequestError } from './NexonBadRequestError.js';
import { NexonNotFoundError } from './NexonNotFoundError.js';

/** 이름 조회가 실패했을 때 보여 줄 안내 */
export interface NameLookupNotFound {
  /** 무엇을 못 찾았는지. 예: `'캐릭터명' 캐릭터를 찾을 수 없습니다.` */
  readonly message: string;
  /** 어떻게 고치는지. 예: `캐릭터 이름의 띄어쓰기와 대소문자를 확인하세요.` */
  readonly hint: string;
}

/**
 * 이름으로 고유 번호를 찾는 요청을 감싼다 (`getOcid`, `getOuid`, `guild.getId` 등).
 *
 * 넥슨은 없는 캐릭터·계정 이름에 `OPENAPI00003`(찾을 수 없음)이 아니라 `OPENAPI00004`(파라미터 오류)를 돌려준다
 * (2026-11-24, 14개 게임 실측). 이름의 형식은 SDK가 요청 전에 검사하므로, 이 요청에서 넥슨이 준
 * `OPENAPI00004` 는 "그런 이름이 없다"로 보고 {@link NexonNotFoundError} 로 바꿔 던진다.
 * `code` 와 `nexonMessage` 는 넥슨이 준 값 그대로 두고, 원래 에러는 `cause` 에 담는다.
 *
 * `request` 에는 HTTP 요청만 넣는다. SDK의 입력 검증은 이 함수 밖에서 먼저 한다.
 */
export async function lookupByName<T>(
  request: () => Promise<T>,
  notFound: NameLookupNotFound,
): Promise<T> {
  try {
    return await request();
  } catch (err) {
    if (err instanceof NexonBadRequestError && err.code === NEXON_ERROR_CODES.BAD_REQUEST) {
      throw new NexonNotFoundError(`${notFound.message}\n→ ${notFound.hint}`, {
        code: err.code,
        nexonMessage: err.nexonMessage,
        cause: err,
      });
    }
    throw err;
  }
}

/**
 * 이름 조회 응답의 고유 번호가 비어 있으면(넥슨이 200과 `null` 을 돌려준 경우) {@link NexonNotFoundError} 를 던진다.
 *
 * 메이플스토리·SEA·TW의 길드 이름 조회는 없는 길드에 에러 대신 `{ oguild_id: null }` 을 돌려준다 (2026-11-24 실측).
 */
export function requireFoundId<T extends string>(
  id: T | null | undefined,
  notFound: NameLookupNotFound,
): T {
  if (typeof id === 'string' && id !== '') return id;
  throw new NexonNotFoundError(`${notFound.message}\n→ ${notFound.hint}`, {
    code: undefined,
    status: 200,
  });
}
