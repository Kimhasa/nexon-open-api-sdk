import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  BARAM_CHARACTER_BASIC_SHAPE,
  BARAM_CHARACTER_GUILD_SHAPE,
  BARAM_CHARACTER_ITEM_EQUIPMENT_SHAPE,
  BARAM_CHARACTER_STAT_SHAPE,
  BARAM_CHARACTER_TITLE_EQUIPMENT_SHAPE,
  BARAM_CHARACTER_TITLE_SHAPE,
} from '../shapes.js';
import type { BaramOcidRequest } from '../types.js';
import type {
  BaramCharacterBasic,
  BaramCharacterGuild,
  BaramCharacterItemEquipment,
  BaramCharacterStat,
  BaramCharacterTitle,
  BaramCharacterTitleEquipment,
} from './types.js';

const OCID_HINT =
  'client.baram.getOcid(characterName, serverName) 로 얻은 값을 { ocid } 로 전달해주세요.';

/**
 * 바람의나라 캐릭터 API 클라이언트.
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
 * const ocid = await client.baram.getOcid('캐릭터명', '연');
 *
 * const basic = await client.baram.character.getBasic({ ocid });
 * const stat = await client.baram.character.getStat({ ocid });
 * ```
 */
export class BaramCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/baram/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 캐릭터 프로필의 직업·국가·경험치·레벨을 조회한다.
   *
   * 버프, 아이템 사용 등으로 적용된 효과 때문에 경험치·레벨이 게임 내 데이터와 다를 수 있다.
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
   * // 문파 디스코드에 캐릭터의 직업과 레벨을 표시할 때
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const basic = await client.baram.character.getBasic({ ocid });
   * console.log(`${basic.character_name} Lv.${basic.character_level} (${basic.character_class_name})`);
   * ```
   */
  async getBasic(params: BaramOcidRequest): Promise<BaramCharacterBasic> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramCharacterBasic>(
      `${BaramCharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      BARAM_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 캐릭터가 보유한 칭호와 만료 시각을 조회한다.
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
   * // 캐릭터 검색에서 보유 칭호와 만료 일시를 표시할 때
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const { title } = await client.baram.character.getTitle({ ocid });
   * for (const t of title) {
   *   console.log(t.title_id, t.date_expire ?? '만료 없음');
   * }
   * ```
   */
  async getTitle(params: BaramOcidRequest): Promise<BaramCharacterTitle> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramCharacterTitle>(
      `${BaramCharacterClient.BASE}/character/title`,
      { ocid: params.ocid },
      BARAM_CHARACTER_TITLE_SHAPE,
    );
  }

  /**
   * 캐릭터가 장착한 칭호와 만료 시각을 조회한다.
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
   * // 프로필 카드에 현재 장착한 칭호를 표시할 때
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const { title_equipment } = await client.baram.character.getTitleEquipment({ ocid });
   * console.log(title_equipment.map((t) => t.title_id));
   * ```
   */
  async getTitleEquipment(params: BaramOcidRequest): Promise<BaramCharacterTitleEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramCharacterTitleEquipment>(
      `${BaramCharacterClient.BASE}/character/title-equipment`,
      { ocid: params.ocid },
      BARAM_CHARACTER_TITLE_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 캐릭터가 장착한 아이템을 장착 부위별로 조회한다.
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
   * // 장비 비교 화면에서 장착 부위와 이름을 표시할 때
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const { item_equipment } = await client.baram.character.getItemEquipment({ ocid });
   * for (const item of item_equipment) {
   *   console.log(`${item.item_equipment_slot_name}: ${item.item_id}`);
   * }
   * ```
   */
  async getItemEquipment(params: BaramOcidRequest): Promise<BaramCharacterItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramCharacterItemEquipment>(
      `${BaramCharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid },
      BARAM_CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 캐릭터의 능력치 이름과 값을 조회한다.
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
   * // 문파 프로필에 캐릭터의 능력치를 표시할 때
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const { stat } = await client.baram.character.getStat({ ocid });
   * for (const s of stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
   * ```
   */
  async getStat(params: BaramOcidRequest): Promise<BaramCharacterStat> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramCharacterStat>(
      `${BaramCharacterClient.BASE}/character/stat`,
      { ocid: params.ocid },
      BARAM_CHARACTER_STAT_SHAPE,
    );
  }

  /**
   * 캐릭터가 가입한 문파를 조회한다.
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
   * // 문파 디스코드의 캐릭터 카드에 문파 이름을 표시할 때
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const guild = await client.baram.character.getGuild({ ocid });
   * console.log(guild.guild_name ?? '문파 없음');
   * ```
   */
  async getGuild(params: BaramOcidRequest): Promise<BaramCharacterGuild> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<BaramCharacterGuild>(
      `${BaramCharacterClient.BASE}/character/guild`,
      { ocid: params.ocid },
      BARAM_CHARACTER_GUILD_SHAPE,
    );
  }
}
