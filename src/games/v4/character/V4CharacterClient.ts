import type { HttpClient } from '../../../core/http/HttpClient.js';
import { assertNonEmpty } from '../input-validation.js';
import {
  V4_CHARACTER_BASIC_SHAPE,
  V4_CHARACTER_HONOR_EQUIPMENT_SHAPE,
  V4_CHARACTER_HONOR_SHAPE,
} from '../shapes.js';
import type { V4OcidRequest } from '../types.js';
import type { V4CharacterBasic, V4CharacterHonor, V4CharacterHonorEquipment } from './types.js';

const OCID_HINT = 'client.v4.getOcid(characterName) 로 얻은 값을 { ocid } 로 전달해주세요.';

/**
 * V4 캐릭터 API 클라이언트.
 *
 * 모든 메서드는 `{ ocid }` 만 받으며 현재 데이터를 반환합니다 (날짜 파라미터 없음).
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.v4.getOcid('캐릭터명');
 *
 * const basic = await client.v4.character.getBasic({ ocid });
 * const honor = await client.v4.character.getHonor({ ocid });
 * ```
 */
export class V4CharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/v4/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 기본 정보를 조회한다.
   *
   * `character_date_create` 는 일 단위라 시·분·초가 항상 0이고,
   * `character_create_type` 은 문자열 코드다 (`"0"`: 일반 캐릭터, `"1"`: 점핑 캐릭터).
   *
   * @param params - `{ ocid }` 캐릭터 식별자
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const basic = await client.v4.character.getBasic({ ocid });
   * console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
   * ```
   */
  async getBasic(params: V4OcidRequest): Promise<V4CharacterBasic> {
    assertNonEmpty(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<V4CharacterBasic>(
      `${V4CharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      V4_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 명예 보유 정보를 조회한다.
   *
   * @param params - `{ ocid }` 캐릭터 식별자
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const { honor } = await client.v4.character.getHonor({ ocid });
   * for (const h of honor) {
   *   console.log(h.honor_type_name, h.honor_name, h.date_expire ?? '만료 없음');
   * }
   * ```
   */
  async getHonor(params: V4OcidRequest): Promise<V4CharacterHonor> {
    assertNonEmpty(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<V4CharacterHonor>(
      `${V4CharacterClient.BASE}/character/honor`,
      { ocid: params.ocid },
      V4_CHARACTER_HONOR_SHAPE,
    );
  }

  /**
   * 장착 명예 정보를 조회한다.
   *
   * @param params - `{ ocid }` 캐릭터 식별자
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const { honor_equipment } = await client.v4.character.getHonorEquipment({ ocid });
   * console.log(honor_equipment.map((h) => h.honor_name));
   * ```
   */
  async getHonorEquipment(params: V4OcidRequest): Promise<V4CharacterHonorEquipment> {
    assertNonEmpty(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<V4CharacterHonorEquipment>(
      `${V4CharacterClient.BASE}/character/honor-equipment`,
      { ocid: params.ocid },
      V4_CHARACTER_HONOR_EQUIPMENT_SHAPE,
    );
  }
}
