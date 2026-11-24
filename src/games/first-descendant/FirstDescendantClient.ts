import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { TFD_OUID_SHAPE } from './shapes.js';
import type { TfdOuid } from './types.js';
import { FirstDescendantUserClient } from './user/FirstDescendantUserClient.js';
import { assertNonEmpty } from './validate.js';

/**
 * 퍼스트 디센던트 (The First Descendant) 클라이언트.
 *
 * 포털 스펙: `specs/openapi/tfd/` (https://openapi.nexon.com/ko/game/tfd/)
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
 * const basic = await client.firstDescendant.user.getBasic({ ouid });
 * const descendants = await client.firstDescendant.meta.getDescendant('ko');
 * ```
 */
export class FirstDescendantClient extends AbstractGameClient {
  protected readonly pathPrefix = 'tfd';

  private _user: FirstDescendantUserClient | undefined;

  /**
   * 닉네임으로 계정 식별자(ouid)를 조회한다.
   *
   * 닉네임은 대소문자를 구분하며 `#` 뒤 태그까지 포함해야 한다.
   * 게임 콘텐츠 변경으로 ouid가 바뀔 수 있으므로 오래 보관한 값은 다시 조회한다.
   *
   * @param userName - 닉네임 (예: `'닉네임#1234'`)
   * @throws {NexonError} userName이 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} 닉네임 형식이 잘못됐거나 계정을 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const basic = await client.firstDescendant.user.getBasic({ ouid });
   * ```
   */
  async getOuid(userName: string): Promise<TfdOuid> {
    assertNonEmpty(
      userName,
      'userName',
      "게임 내 닉네임을 태그까지 포함해 넘기세요. 예: getOuid('닉네임#1234') (대소문자 구분)",
    );
    const response = await this.http.get<{ ouid: string }>(
      this.buildUrl('id'),
      { user_name: userName },
      TFD_OUID_SHAPE,
    );
    return response.ouid as TfdOuid;
  }

  /** 계정 정보 조회 (기본 정보, 장착 계승자·무기·반응로·외장 부품, 아르케 조율) */
  get user(): FirstDescendantUserClient {
    this._user ??= new FirstDescendantUserClient(this.http);
    return this._user;
  }
}
