import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { HeroesOcidRequest } from '../types.js';
import {
  HEROES_CHARACTER_BASIC_SHAPE,
  HEROES_CHARACTER_GUILD_SHAPE,
  HEROES_CHARACTER_ITEM_EQUIPMENT_SHAPE,
  HEROES_CHARACTER_STAT_SHAPE,
  HEROES_CHARACTER_TITLE_EQUIPMENT_SHAPE,
  HEROES_CHARACTER_TITLE_SHAPE,
} from '../shapes.js';
import type {
  HeroesCharacterBasic,
  HeroesCharacterGuild,
  HeroesCharacterItemEquipment,
  HeroesCharacterStat,
  HeroesCharacterTitle,
  HeroesCharacterTitleEquipment,
} from './types.js';

/**
 * 마비노기 영웅전 캐릭터 API 클라이언트 (V2).
 *
 * 모든 메서드는 `ocid` 하나만 받으며 현재 데이터를 반환합니다 (날짜 파라미터 없음).
 * 게임 데이터는 평균 10분 뒤 반영됩니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
 *
 * const basic = await client.mabinogiHeroes.character.getBasic({ ocid });
 * const stat = await client.mabinogiHeroes.character.getStat({ ocid });
 * ```
 */
export class MabinogiHeroesCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/heroes/v2';

  constructor(private readonly http: HttpClient) {}

  /**
   * 기본 정보를 조회한다.
   *
   * 버프, 아이템 사용 등으로 적용된 효과 때문에 경험치·레벨이 게임 내 데이터와 다를 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회)
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전에 SDK가 throw) 또는 파라미터가 잘못됐을 때
   * @throws {NexonNotFoundError} ocid에 해당하는 캐릭터가 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const basic = await client.mabinogiHeroes.character.getBasic({ ocid });
   * console.log(`${basic.character_name} Lv.${basic.character_level} (${basic.character_class_name})`);
   * ```
   */
  async getBasic(params: HeroesOcidRequest): Promise<HeroesCharacterBasic> {
    return this.http.get<HeroesCharacterBasic>(
      `${MabinogiHeroesCharacterClient.BASE}/character/basic`,
      { ocid: requireOcid(params) },
      HEROES_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 타이틀/문양 보유 정보를 조회한다.
   *
   * `title_type` 은 2023년 11월 23일 이후 획득한 타이틀/문양에 한해 조회됩니다.
   *
   * @param params.ocid - 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회)
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전에 SDK가 throw) 또는 파라미터가 잘못됐을 때
   * @throws {NexonNotFoundError} ocid에 해당하는 캐릭터가 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const { title } = await client.mabinogiHeroes.character.getTitle({ ocid });
   * for (const t of title) {
   *   console.log(t.title_type, t.title_name);
   * }
   * ```
   */
  async getTitle(params: HeroesOcidRequest): Promise<HeroesCharacterTitle> {
    return this.http.get<HeroesCharacterTitle>(
      `${MabinogiHeroesCharacterClient.BASE}/character/title`,
      { ocid: requireOcid(params) },
      HEROES_CHARACTER_TITLE_SHAPE,
    );
  }

  /**
   * 장착 타이틀/문양 정보를 조회한다.
   *
   * `title_type` 은 2023년 11월 23일 이후 장착한 타이틀/문양에 한해 조회됩니다.
   *
   * @param params.ocid - 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회)
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전에 SDK가 throw) 또는 파라미터가 잘못됐을 때
   * @throws {NexonNotFoundError} ocid에 해당하는 캐릭터가 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const { title_equipment } = await client.mabinogiHeroes.character.getTitleEquipment({ ocid });
   * for (const t of title_equipment) {
   *   console.log(`${t.title_equipment_type_name}: ${t.title_name}`);
   * }
   * ```
   */
  async getTitleEquipment(params: HeroesOcidRequest): Promise<HeroesCharacterTitleEquipment> {
    return this.http.get<HeroesCharacterTitleEquipment>(
      `${MabinogiHeroesCharacterClient.BASE}/character/title-equipment`,
      { ocid: requireOcid(params) },
      HEROES_CHARACTER_TITLE_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 아이템 정보를 조회한다.
   *
   * 인챈트 명의 등급·능력치는 `client.mabinogiHeroes.meta.getEnchant()` 로 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회)
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전에 SDK가 throw) 또는 파라미터가 잘못됐을 때
   * @throws {NexonNotFoundError} ocid에 해당하는 캐릭터가 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const { item_equipment } = await client.mabinogiHeroes.character.getItemEquipment({ ocid });
   * for (const item of item_equipment) {
   *   console.log(
   *     `[${item.item_equipment_slot_name}] ${item.item_name} +${item.item_option?.enhancement_level ?? 0}`,
   *   );
   * }
   * ```
   */
  async getItemEquipment(params: HeroesOcidRequest): Promise<HeroesCharacterItemEquipment> {
    return this.http.get<HeroesCharacterItemEquipment>(
      `${MabinogiHeroesCharacterClient.BASE}/character/item-equipment`,
      { ocid: requireOcid(params) },
      HEROES_CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 능력치 정보를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회)
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전에 SDK가 throw) 또는 파라미터가 잘못됐을 때
   * @throws {NexonNotFoundError} ocid에 해당하는 캐릭터가 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const { stat } = await client.mabinogiHeroes.character.getStat({ ocid });
   * for (const s of stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
   * ```
   */
  async getStat(params: HeroesOcidRequest): Promise<HeroesCharacterStat> {
    return this.http.get<HeroesCharacterStat>(
      `${MabinogiHeroesCharacterClient.BASE}/character/stat`,
      { ocid: requireOcid(params) },
      HEROES_CHARACTER_STAT_SHAPE,
    );
  }

  /**
   * 가입/신청한 길드 정보를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회)
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전에 SDK가 throw) 또는 파라미터가 잘못됐을 때
   * @throws {NexonNotFoundError} ocid에 해당하는 캐릭터가 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const guild = await client.mabinogiHeroes.character.getGuild({ ocid });
   * console.log(guild.guild_name ?? '길드 없음');
   * ```
   */
  async getGuild(params: HeroesOcidRequest): Promise<HeroesCharacterGuild> {
    return this.http.get<HeroesCharacterGuild>(
      `${MabinogiHeroesCharacterClient.BASE}/character/guild`,
      { ocid: requireOcid(params) },
      HEROES_CHARACTER_GUILD_SHAPE,
    );
  }
}

function requireOcid(params: HeroesOcidRequest): string {
  // JS 호출자가 params 자체를 빠뜨려도 TypeError 대신 안내 메시지가 나가도록 optional chaining으로 읽는다
  const ocid: unknown = (params as HeroesOcidRequest | undefined)?.ocid;
  assertNonEmptyString(
    ocid,
    'ocid',
    "client.mabinogiHeroes.getOcid('캐릭터명') 으로 받은 값을 { ocid } 로 넘겨주세요.",
  );
  return ocid as string;
}
