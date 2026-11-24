import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { V4CharacterClient } from './character/V4CharacterClient.js';
import { V4_OCID_SHAPE } from './shapes.js';
import type { V4OCID } from './types.js';

/**
 * V4 클라이언트.
 *
 * 포털 스펙: `specs/openapi/v4/` (https://openapi.nexon.com/ko/game/v4/)
 *
 * - 게임 데이터는 평균 10분 후 확인 가능합니다.
 * - 2022년 1월 1일 이후 데이터를 조회할 수 있습니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 *
 * const ocid = await client.v4.getOcid('캐릭터명');
 * const basic = await client.v4.character.getBasic({ ocid });
 * console.log(`${basic.character_name} Lv.${basic.character_level}`);
 * ```
 */
export class V4Client extends AbstractGameClient {
  protected readonly pathPrefix = 'v4';

  private _character: V4CharacterClient | undefined;

  /** 캐릭터의 프로필·보유 명예·장착 명예를 조회하는 메뉴. */
  get character(): V4CharacterClient {
    this._character ??= new V4CharacterClient(this.http);
    return this._character;
  }

  /**
   * 캐릭터 이름으로 고유 번호를 조회한다.
   *
   * 스펙상 서버 파라미터가 없어 캐릭터 명만 받는다.
   *
   * @param characterName - 조회할 캐릭터 이름
   * @throws {NexonBadRequestError} characterName이 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 캐릭터 검색에서 이름을 고유 번호로 바꿀 때
   * const ocid = await client.v4.getOcid('캐릭터명');
   * console.log(ocid);
   * ```
   */
  async getOcid(characterName: string): Promise<V4OCID> {
    assertNonEmptyString(
      characterName,
      'characterName',
      "client.v4.getOcid('캐릭터명') 처럼 조회할 캐릭터 명을 전달해주세요.",
    );
    const notFound = {
      message: `'${characterName}' 캐릭터를 찾을 수 없습니다.`,
      hint: 'V4 캐릭터 이름을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ ocid: string }>(
          this.buildUrl('id'),
          { character_name: characterName },
          V4_OCID_SHAPE,
        ),
      notFound,
    );
    return response.ocid as V4OCID;
  }
}
