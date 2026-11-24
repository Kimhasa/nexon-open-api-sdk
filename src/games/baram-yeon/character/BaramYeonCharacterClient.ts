import type { HttpClient } from '../../../core/http/HttpClient.js';
import { assertNonEmpty } from '../input-validation.js';
import {
  BARAM_YEON_CHARACTER_BASIC_SHAPE,
  BARAM_YEON_CHARACTER_TITLE_EQUIPMENT_SHAPE,
  BARAM_YEON_CHARACTER_TITLE_SHAPE,
} from '../shapes.js';
import type { BaramYeonOcidRequest } from '../types.js';
import type {
  BaramYeonCharacterBasic,
  BaramYeonCharacterTitle,
  BaramYeonCharacterTitleEquipment,
} from './types.js';

const OCID_HINT =
  'client.baramYeon.getOcid(characterName, serverName) 로 얻은 값을 { ocid } 로 전달해주세요.';

/**
 * 바람의나라: 연 캐릭터 API 클라이언트.
 *
 * 모든 메서드는 `{ ocid }` 만 받으며 현재 데이터를 반환합니다 (날짜 파라미터 없음).
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
 *
 * const basic = await client.baramYeon.character.getBasic({ ocid });
 * const title = await client.baramYeon.character.getTitle({ ocid });
 * ```
 */
export class BaramYeonCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/baramy/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 기본 정보를 조회한다.
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
   * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
   * const basic = await client.baramYeon.character.getBasic({ ocid });
   * console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
   * ```
   */
  async getBasic(params: BaramYeonOcidRequest): Promise<BaramYeonCharacterBasic> {
    assertNonEmpty(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramYeonCharacterBasic>(
      `${BaramYeonCharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      BARAM_YEON_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 칭호 보유 정보를 조회한다.
   *
   * 칭호 타입(`title_type_name`)은 2022년 3월 18일 이후 획득한 칭호에 한해 제공된다.
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
   * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
   * const { title } = await client.baramYeon.character.getTitle({ ocid });
   * for (const t of title) {
   *   console.log(t.title_type_name ?? '(타입 없음)', t.title_name);
   * }
   * ```
   */
  async getTitle(params: BaramYeonOcidRequest): Promise<BaramYeonCharacterTitle> {
    assertNonEmpty(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramYeonCharacterTitle>(
      `${BaramYeonCharacterClient.BASE}/character/title`,
      { ocid: params.ocid },
      BARAM_YEON_CHARACTER_TITLE_SHAPE,
    );
  }

  /**
   * 장착 칭호 정보를 조회한다.
   *
   * `title_equipment_type` 은 문자열 코드다 (`"1"`: 장착 칭호, `"2"`: 표시 칭호).
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
   * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
   * const { title_equipment } = await client.baramYeon.character.getTitleEquipment({ ocid });
   * const equipped = title_equipment.find((t) => t.title_equipment_type === '1');
   * console.log(equipped?.title_name);
   * ```
   */
  async getTitleEquipment(params: BaramYeonOcidRequest): Promise<BaramYeonCharacterTitleEquipment> {
    assertNonEmpty(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramYeonCharacterTitleEquipment>(
      `${BaramYeonCharacterClient.BASE}/character/title-equipment`,
      { ocid: params.ocid },
      BARAM_YEON_CHARACTER_TITLE_EQUIPMENT_SHAPE,
    );
  }
}
