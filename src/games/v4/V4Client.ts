import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { V4CharacterClient } from './character/V4CharacterClient.js';
import { assertNonEmpty } from './input-validation.js';
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
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.v4.getOcid('캐릭터명');
 * const basic = await client.v4.character.getBasic({ ocid });
 * console.log(`${basic.character_name} Lv.${basic.character_level}`);
 * ```
 */
export class V4Client extends AbstractGameClient {
  protected readonly pathPrefix = 'v4';

  private _character: V4CharacterClient | undefined;

  /** 캐릭터 정보 API (3개 엔드포인트) */
  get character(): V4CharacterClient {
    this._character ??= new V4CharacterClient(this.http);
    return this._character;
  }

  /**
   * 캐릭터 명으로 캐릭터 식별자(ocid)를 조회한다.
   *
   * 스펙상 서버 파라미터가 없어 캐릭터 명만 받는다.
   *
   * @param characterName - 캐릭터 명
   * @throws {NexonBadRequestError} characterName이 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.v4.getOcid('캐릭터명');
   * console.log(ocid);
   * ```
   */
  async getOcid(characterName: string): Promise<V4OCID> {
    assertNonEmpty(
      characterName,
      'characterName',
      "client.v4.getOcid('캐릭터명') 처럼 조회할 캐릭터 명을 전달해주세요.",
    );
    const response = await this.http.get<{ ocid: string }>(
      this.buildUrl('id'),
      { character_name: characterName },
      V4_OCID_SHAPE,
    );
    return response.ocid as V4OCID;
  }
}
