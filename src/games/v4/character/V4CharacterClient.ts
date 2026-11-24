import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
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
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
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
   * 캐릭터 프로필의 서버·직업·레벨과 접속 시각을 조회한다.
   *
   * `character_date_create` 는 일 단위라 시·분·초가 항상 0이고,
   * `character_create_type` 은 문자열 코드다 (`"0"`: 일반 캐릭터, `"1"`: 점핑 캐릭터). 값이 없으면 null이다.
   *
   * @param params - `ocid`는 `getOcid()`로 찾은 캐릭터 고유 번호
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
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
   * // 캐릭터 카드에 서버와 직업을 표시할 때
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const basic = await client.v4.character.getBasic({ ocid });
   * console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
   * ```
   */
  async getBasic(params: V4OcidRequest): Promise<V4CharacterBasic> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<V4CharacterBasic>(
      `${V4CharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      V4_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 캐릭터가 보유한 명예와 만료 시각을 조회한다.
   *
   * @param params - `ocid`는 `getOcid()`로 찾은 캐릭터 고유 번호
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
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
   * // 명예 보관함에 보유한 명예와 만료 시각을 표시할 때
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const { honor } = await client.v4.character.getHonor({ ocid });
   * for (const h of honor) {
   *   console.log(h.honor_type_name, h.honor_name, h.date_expire ?? '만료 없음');
   * }
   * ```
   */
  async getHonor(params: V4OcidRequest): Promise<V4CharacterHonor> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<V4CharacterHonor>(
      `${V4CharacterClient.BASE}/character/honor`,
      { ocid: params.ocid },
      V4_CHARACTER_HONOR_SHAPE,
    );
  }

  /**
   * 캐릭터가 장착한 명예와 만료 시각을 조회한다.
   *
   * @param params - `ocid`는 `getOcid()`로 찾은 캐릭터 고유 번호
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
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
   * // 프로필 카드에 장착 명예를 표시할 때
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const { honor_equipment } = await client.v4.character.getHonorEquipment({ ocid });
   * console.log(honor_equipment.map((h) => h.honor_name));
   * ```
   */
  async getHonorEquipment(params: V4OcidRequest): Promise<V4CharacterHonorEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<V4CharacterHonorEquipment>(
      `${V4CharacterClient.BASE}/character/honor-equipment`,
      { ocid: params.ocid },
      V4_CHARACTER_HONOR_EQUIPMENT_SHAPE,
    );
  }
}
