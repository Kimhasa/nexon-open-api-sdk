import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import type {
  CharacterAbility,
  CharacterAndroidEquipment,
  CharacterBasic,
  CharacterBeautyEquipment,
  CharacterCashItemEquipment,
  CharacterDojang,
  CharacterHexaMatrix,
  CharacterHexaMatrixStat,
  CharacterHyperStat,
  CharacterItemEquipment,
  CharacterLinkSkill,
  CharacterList,
  CharacterOtherStat,
  CharacterPetEquipment,
  CharacterPopularity,
  CharacterPropensity,
  CharacterRingExchangeSkillEquipment,
  CharacterSetEffect,
  CharacterSkill,
  CharacterStat,
  CharacterSymbolEquipment,
  CharacterVMatrix,
  SkillRequest,
} from './types.js';

/**
 * 메이플스토리 캐릭터 API 클라이언트.
 *
 * @example
 * ```ts
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 *
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * const stat = await client.maplestory.character.getStat({ ocid });
 * ```
 */
export class MapleStoryCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 계정에 보유한 모든 캐릭터 목록을 조회한다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const list = await client.maplestory.character.getList();
   * const allChars = list.account_list.flatMap(a => a.character_list);
   * ```
   */
  async getList(): Promise<CharacterList> {
    return this.http.get<CharacterList>(`${MapleStoryCharacterClient.BASE}/character/list`);
  }

  /**
   * 캐릭터 기본 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonDataNotReadyError} 해당 날짜 데이터 미준비 시
   *
   * @example
   * ```ts
   * const basic = await client.maplestory.character.getBasic({ ocid });
   * console.log(basic.character_name, basic.character_level);
   * ```
   */
  async getBasic(params: OcidDateRequest): Promise<CharacterBasic> {
    return this.http.get<CharacterBasic>(
      `${MapleStoryCharacterClient.BASE}/character/basic`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 인기도 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const pop = await client.maplestory.character.getPopularity({ ocid });
   * console.log(`인기도: ${pop.popularity}`);
   * ```
   */
  async getPopularity(params: OcidDateRequest): Promise<CharacterPopularity> {
    return this.http.get<CharacterPopularity>(
      `${MapleStoryCharacterClient.BASE}/character/popularity`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 종합 능력치 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const stat = await client.maplestory.character.getStat({ ocid });
   * for (const s of stat.final_stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
   * ```
   */
  async getStat(params: OcidDateRequest): Promise<CharacterStat> {
    return this.http.get<CharacterStat>(
      `${MapleStoryCharacterClient.BASE}/character/stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 하이퍼스탯 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const hyper = await client.maplestory.character.getHyperStat({ ocid });
   * console.log(`사용 프리셋: ${hyper.use_preset_no}`);
   * for (const s of hyper.hyper_stat_preset_1) {
   *   console.log(`${s.stat_type} Lv.${s.stat_level}: ${s.stat_increase}`);
   * }
   * ```
   */
  async getHyperStat(params: OcidDateRequest): Promise<CharacterHyperStat> {
    return this.http.get<CharacterHyperStat>(
      `${MapleStoryCharacterClient.BASE}/character/hyper-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 성향 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const prop = await client.maplestory.character.getPropensity({ ocid });
   * console.log(`카리스마: ${prop.charisma_level}, 매력: ${prop.charm_level}`);
   * ```
   */
  async getPropensity(params: OcidDateRequest): Promise<CharacterPropensity> {
    return this.http.get<CharacterPropensity>(
      `${MapleStoryCharacterClient.BASE}/character/propensity`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 어빌리티 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const ability = await client.maplestory.character.getAbility({ ocid });
   * console.log(`등급: ${ability.ability_grade}`);
   * for (const a of ability.ability_info) {
   *   console.log(`${a.ability_value} (${a.ability_grade})`);
   * }
   * ```
   */
  async getAbility(params: OcidDateRequest): Promise<CharacterAbility> {
    return this.http.get<CharacterAbility>(
      `${MapleStoryCharacterClient.BASE}/character/ability`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 장착 장비 정보를 조회한다 (캐시 장비 제외).
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const equip = await client.maplestory.character.getItemEquipment({ ocid });
   * for (const item of equip.item_equipment) {
   *   console.log(`[${item.item_equipment_part}] ${item.item_name} ★${item.starforce}`);
   * }
   * ```
   */
  async getItemEquipment(params: OcidDateRequest): Promise<CharacterItemEquipment> {
    return this.http.get<CharacterItemEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 장착 캐시 장비 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const cash = await client.maplestory.character.getCashItemEquipment({ ocid });
   * for (const item of cash.cash_item_equipment_base) {
   *   console.log(`[${item.cash_item_equipment_part}] ${item.cash_item_name}`);
   * }
   * ```
   *
   */
  async getCashItemEquipment(params: OcidDateRequest): Promise<CharacterCashItemEquipment> {
    return this.http.get<CharacterCashItemEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/cashitem-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 장착 심볼 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const symbols = await client.maplestory.character.getSymbolEquipment({ ocid });
   * for (const s of symbols.symbol) {
   *   console.log(`${s.symbol_name} Lv.${s.symbol_level} (${s.symbol_force})`);
   * }
   * ```
   *
   */
  async getSymbolEquipment(params: OcidDateRequest): Promise<CharacterSymbolEquipment> {
    return this.http.get<CharacterSymbolEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/symbol-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 적용 중인 세트 효과 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const effect = await client.maplestory.character.getSetEffect({ ocid });
   * for (const set of effect.set_effect) {
   *   console.log(`${set.set_name} (${set.total_set_count}세트)`);
   * }
   * ```
   *
   */
  async getSetEffect(params: OcidDateRequest): Promise<CharacterSetEffect> {
    return this.http.get<CharacterSetEffect>(
      `${MapleStoryCharacterClient.BASE}/character/set-effect`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 장착 헤어, 성형, 피부 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const beauty = await client.maplestory.character.getBeautyEquipment({ ocid });
   * console.log(`헤어: ${beauty.character_hair.hair_name}`);
   * console.log(`성형: ${beauty.character_face.face_name}`);
   * ```
   *
   */
  async getBeautyEquipment(params: OcidDateRequest): Promise<CharacterBeautyEquipment> {
    return this.http.get<CharacterBeautyEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/beauty-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 장착 안드로이드 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const android = await client.maplestory.character.getAndroidEquipment({ ocid });
   * console.log(`안드로이드: ${android.android_name} (${android.android_grade})`);
   * ```
   *
   */
  async getAndroidEquipment(params: OcidDateRequest): Promise<CharacterAndroidEquipment> {
    return this.http.get<CharacterAndroidEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/android-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }
  /**
   * 장착 펫 및 펫 스킬, 장비 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const pet = await client.maplestory.character.getPetEquipment({ ocid });
   * console.log(`펫1: ${pet.pet_1_name} (${pet.pet_1_nickname})`);
   * ```
   *
   */
  async getPetEquipment(params: OcidDateRequest): Promise<CharacterPetEquipment> {
    return this.http.get<CharacterPetEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/pet-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 스킬과 하이퍼 스킬 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   * @param params.character_skill_grade - 전직 차수 ("0"~"6", "hyperpassive", "hyperactive")
   *
   * @example
   * ```ts
   * const skill = await client.maplestory.character.getSkill({
   *   ocid,
   *   character_skill_grade: '4',
   * });
   * for (const s of skill.character_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   *
   */
  async getSkill(params: SkillRequest): Promise<CharacterSkill> {
    return this.http.get<CharacterSkill>(
      `${MapleStoryCharacterClient.BASE}/character/skill`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
        character_skill_grade: params.character_skill_grade,
      },
    );
  }

  /**
   * 장착 링크 스킬 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const link = await client.maplestory.character.getLinkSkill({ ocid });
   * for (const s of link.character_link_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   *
   */
  async getLinkSkill(params: OcidDateRequest): Promise<CharacterLinkSkill> {
    return this.http.get<CharacterLinkSkill>(
      `${MapleStoryCharacterClient.BASE}/character/link-skill`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * V매트릭스 슬롯 정보와 장착 V코어 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const vm = await client.maplestory.character.getVMatrix({ ocid });
   * for (const core of vm.character_v_core_equipment) {
   *   console.log(`${core.v_core_name} Lv.${core.v_core_level} (${core.v_core_type})`);
   * }
   * ```
   *
   */
  async getVMatrix(params: OcidDateRequest): Promise<CharacterVMatrix> {
    return this.http.get<CharacterVMatrix>(
      `${MapleStoryCharacterClient.BASE}/character/vmatrix`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * HEXA 매트릭스에 장착한 HEXA 코어 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const hexa = await client.maplestory.character.getHexaMatrix({ ocid });
   * for (const core of hexa.character_hexa_core_equipment) {
   *   console.log(`${core.hexa_core_name} Lv.${core.hexa_core_level} (${core.hexa_core_type})`);
   * }
   * ```
   *
   */
  async getHexaMatrix(params: OcidDateRequest): Promise<CharacterHexaMatrix> {
    return this.http.get<CharacterHexaMatrix>(
      `${MapleStoryCharacterClient.BASE}/character/hexamatrix`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * HEXA 매트릭스에 설정한 HEXA 스탯 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const stat = await client.maplestory.character.getHexaMatrixStat({ ocid });
   * for (const core of stat.character_hexa_stat_core) {
   *   console.log(`${core.main_stat_name} Lv.${core.main_stat_level}`);
   * }
   * ```
   *
   */
  async getHexaMatrixStat(params: OcidDateRequest): Promise<CharacterHexaMatrixStat> {
    return this.http.get<CharacterHexaMatrixStat>(
      `${MapleStoryCharacterClient.BASE}/character/hexamatrix-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 캐릭터 무릉도장 최고 기록 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const dojang = await client.maplestory.character.getDojang({ ocid });
   * console.log(`최고 기록: ${dojang.dojang_best_floor}층 (${dojang.dojang_best_time}초)`);
   * ```
   *
   */
  async getDojang(params: OcidDateRequest): Promise<CharacterDojang> {
    return this.http.get<CharacterDojang>(
      `${MapleStoryCharacterClient.BASE}/character/dojang`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 능력치에 영향을 주는 기타 요소 정보를 조회한다.
   *
   * 2025년 8월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const other = await client.maplestory.character.getOtherStat({ ocid });
   * for (const entry of other.other_stat) {
   *   console.log(`[${entry.other_stat_type}]`);
   *   for (const s of entry.stat_info) {
   *     console.log(`  ${s.stat_name}: ${s.stat_value}`);
   *   }
   * }
   * ```
   *
   */
  async getOtherStat(params: OcidDateRequest): Promise<CharacterOtherStat> {
    return this.http.get<CharacterOtherStat>(
      `${MapleStoryCharacterClient.BASE}/character/other-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  /**
   * 링 익스체인지 스킬 등록 장비를 조회한다.
   *
   * 2025년 8월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const ring = await client.maplestory.character.getRingExchangeSkillEquipment({ ocid });
   * console.log(`${ring.special_ring_exchange_name} Lv.${ring.special_ring_exchange_level}`);
   * ```
   *
   */
  async getRingExchangeSkillEquipment(
    params: OcidDateRequest,
  ): Promise<CharacterRingExchangeSkillEquipment> {
    return this.http.get<CharacterRingExchangeSkillEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/ring-exchange-skill-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }
}
