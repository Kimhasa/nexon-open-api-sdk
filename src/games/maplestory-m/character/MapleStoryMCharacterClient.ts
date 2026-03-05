import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { MOcidRequest } from '../types.js';
import {
  M_CHARACTER_BASIC_SHAPE,
  M_CHARACTER_STAT_SHAPE,
  M_CHARACTER_HYPER_STAT_SHAPE,
  M_CHARACTER_GUILD_SHAPE,
  M_CHARACTER_ITEM_EQUIPMENT_SHAPE,
  M_CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
  M_CHARACTER_SYMBOL_SHAPE,
  M_CHARACTER_SET_EFFECT_SHAPE,
  M_CHARACTER_ANDROID_EQUIPMENT_SHAPE,
  M_CHARACTER_JEWEL_SHAPE,
  M_CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
  M_CHARACTER_PET_EQUIPMENT_SHAPE,
  M_CHARACTER_SKILL_EQUIPMENT_SHAPE,
  M_CHARACTER_LINK_SKILL_SHAPE,
  M_CHARACTER_VMATRIX_SHAPE,
  M_CHARACTER_HEXAMATRIX_SKILL_SHAPE,
  M_CHARACTER_HEXAMATRIX_STAT_SHAPE,
} from '../shapes.js';
import type {
  MCharacterBasic,
  MCharacterStat,
  MCharacterHyperStat,
  MCharacterGuild,
  MCharacterItemEquipment,
  MCharacterCashItemEquipment,
  MCharacterSymbolEquipment,
  MCharacterSetEffect,
  MCharacterAndroidEquipment,
  MCharacterJewel,
  MCharacterBeautyEquipment,
  MCharacterPetEquipment,
  MCharacterSkillEquipment,
  MCharacterLinkSkill,
  MCharacterVMatrix,
  MCharacterHexaMatrixSkill,
  MCharacterHexaMatrixStat,
} from './types.js';

/**
 * 메이플스토리M 캐릭터 API 클라이언트.
 *
 * 메이플스토리M 캐릭터 API는 date 파라미터 없이 현재 데이터를 반환합니다.
 *
 * @example
 * ```ts
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
 *
 * const basic = await client.maplestorym.character.getBasic({ ocid });
 * const stat = await client.maplestorym.character.getStat({ ocid });
 * ```
 */
export class MapleStoryMCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorym/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 기본 정보를 조회한다.
   *
   * @example
   * ```ts
   * const basic = await client.maplestorym.character.getBasic({ ocid });
   * console.log(basic.character_name, basic.character_level);
   * ```
   */
  async getBasic(params: MOcidRequest): Promise<MCharacterBasic> {
    return this.http.get<MCharacterBasic>(
      `${MapleStoryMCharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      M_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 스탯 정보를 조회한다.
   *
   * @example
   * ```ts
   * const stat = await client.maplestorym.character.getStat({ ocid });
   * for (const s of stat.stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
   * ```
   */
  async getStat(params: MOcidRequest): Promise<MCharacterStat> {
    return this.http.get<MCharacterStat>(
      `${MapleStoryMCharacterClient.BASE}/character/stat`,
      { ocid: params.ocid },
      M_CHARACTER_STAT_SHAPE,
    );
  }

  /**
   * 하이퍼 스탯 정보를 조회한다.
   *
   * @example
   * ```ts
   * const hyperStat = await client.maplestorym.character.getHyperStat({ ocid });
   * console.log(`프리셋 ${hyperStat.use_preset_no} 사용 중`);
   * ```
   */
  async getHyperStat(params: MOcidRequest): Promise<MCharacterHyperStat> {
    return this.http.get<MCharacterHyperStat>(
      `${MapleStoryMCharacterClient.BASE}/character/hyper-stat`,
      { ocid: params.ocid },
      M_CHARACTER_HYPER_STAT_SHAPE,
    );
  }

  /**
   * 가입한 길드 정보를 조회한다.
   *
   * @example
   * ```ts
   * const guild = await client.maplestorym.character.getGuild({ ocid });
   * console.log(`길드: ${guild.guild_name}`);
   * ```
   */
  async getGuild(params: MOcidRequest): Promise<MCharacterGuild> {
    return this.http.get<MCharacterGuild>(
      `${MapleStoryMCharacterClient.BASE}/character/guild`,
      { ocid: params.ocid },
      M_CHARACTER_GUILD_SHAPE,
    );
  }

  /**
   * 장착 아이템 정보를 조회한다.
   *
   * @example
   * ```ts
   * const equip = await client.maplestorym.character.getItemEquipment({ ocid });
   * for (const item of equip.item_equipment) {
   *   console.log(`${item.item_equipment_part}: ${item.item_name}`);
   * }
   * ```
   */
  async getItemEquipment(params: MOcidRequest): Promise<MCharacterItemEquipment> {
    return this.http.get<MCharacterItemEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 캐시 아이템 정보를 조회한다.
   *
   * @example
   * ```ts
   * const cash = await client.maplestorym.character.getCashItemEquipment({ ocid });
   * for (const item of cash.cash_item_equipment_base) {
   *   console.log(`${item.cash_item_equipment_part}: ${item.cash_item_name}`);
   * }
   * ```
   */
  async getCashItemEquipment(params: MOcidRequest): Promise<MCharacterCashItemEquipment> {
    return this.http.get<MCharacterCashItemEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/cashitem-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 심볼 정보를 조회한다.
   *
   * @example
   * ```ts
   * const symbol = await client.maplestorym.character.getSymbol({ ocid });
   * for (const s of symbol.symbol) {
   *   console.log(`${s.symbol_name} Lv.${s.symbol_level}`);
   * }
   * ```
   */
  async getSymbol(params: MOcidRequest): Promise<MCharacterSymbolEquipment> {
    return this.http.get<MCharacterSymbolEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/symbol`,
      { ocid: params.ocid },
      M_CHARACTER_SYMBOL_SHAPE,
    );
  }

  /**
   * 적용 세트 효과 정보를 조회한다.
   *
   * @example
   * ```ts
   * const setEffect = await client.maplestorym.character.getSetEffect({ ocid });
   * for (const s of setEffect.set_effect) {
   *   console.log(`${s.set_name} (${s.total_set_count}세트)`);
   * }
   * ```
   */
  async getSetEffect(params: MOcidRequest): Promise<MCharacterSetEffect> {
    return this.http.get<MCharacterSetEffect>(
      `${MapleStoryMCharacterClient.BASE}/character/set-effect`,
      { ocid: params.ocid },
      M_CHARACTER_SET_EFFECT_SHAPE,
    );
  }

  /**
   * 장착 안드로이드 정보를 조회한다.
   *
   * @example
   * ```ts
   * const android = await client.maplestorym.character.getAndroidEquipment({ ocid });
   * console.log(`${android.android_name} (${android.android_grade})`);
   * ```
   */
  async getAndroidEquipment(params: MOcidRequest): Promise<MCharacterAndroidEquipment> {
    return this.http.get<MCharacterAndroidEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/android-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_ANDROID_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 쥬얼 정보를 조회한다.
   *
   * @example
   * ```ts
   * const jewel = await client.maplestorym.character.getJewel({ ocid });
   * for (const j of jewel.jewel) {
   *   console.log(`${j.jewel_name} (${j.jewel_grade}): ${j.jewel_option}`);
   * }
   * ```
   */
  async getJewel(params: MOcidRequest): Promise<MCharacterJewel> {
    return this.http.get<MCharacterJewel>(
      `${MapleStoryMCharacterClient.BASE}/character/jewel`,
      { ocid: params.ocid },
      M_CHARACTER_JEWEL_SHAPE,
    );
  }

  /**
   * 장착 헤어, 성형, 피부 정보를 조회한다.
   *
   * @example
   * ```ts
   * const beauty = await client.maplestorym.character.getBeautyEquipment({ ocid });
   * console.log(`헤어: ${beauty.character_hair.hair_name}`);
   * ```
   */
  async getBeautyEquipment(params: MOcidRequest): Promise<MCharacterBeautyEquipment> {
    return this.http.get<MCharacterBeautyEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/beauty-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 펫 정보를 조회한다.
   *
   * @example
   * ```ts
   * const pet = await client.maplestorym.character.getPetEquipment({ ocid });
   * console.log(`펫1: ${pet.pet_1_name} (${pet.pet_1_nickname})`);
   * ```
   */
  async getPetEquipment(params: MOcidRequest): Promise<MCharacterPetEquipment> {
    return this.http.get<MCharacterPetEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/pet-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_PET_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 스킬 정보를 조회한다.
   *
   * @example
   * ```ts
   * const skill = await client.maplestorym.character.getSkillEquipment({ ocid });
   * for (const s of skill.character_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   */
  async getSkillEquipment(params: MOcidRequest): Promise<MCharacterSkillEquipment> {
    return this.http.get<MCharacterSkillEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/skill-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_SKILL_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 링크 스킬 정보를 조회한다.
   *
   * @example
   * ```ts
   * const link = await client.maplestorym.character.getLinkSkill({ ocid });
   * for (const s of link.character_link_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   */
  async getLinkSkill(params: MOcidRequest): Promise<MCharacterLinkSkill> {
    return this.http.get<MCharacterLinkSkill>(
      `${MapleStoryMCharacterClient.BASE}/character/link-skill`,
      { ocid: params.ocid },
      M_CHARACTER_LINK_SKILL_SHAPE,
    );
  }

  /**
   * V매트릭스 정보를 조회한다.
   *
   * @example
   * ```ts
   * const vmatrix = await client.maplestorym.character.getVMatrix({ ocid });
   * for (const core of vmatrix.character_v_core_equipment) {
   *   console.log(`${core.v_core_name} Lv.${core.v_core_level}`);
   * }
   * ```
   */
  async getVMatrix(params: MOcidRequest): Promise<MCharacterVMatrix> {
    return this.http.get<MCharacterVMatrix>(
      `${MapleStoryMCharacterClient.BASE}/character/vmatrix`,
      { ocid: params.ocid },
      M_CHARACTER_VMATRIX_SHAPE,
    );
  }

  /**
   * HEXA매트릭스 스킬 정보를 조회한다.
   *
   * @example
   * ```ts
   * const hexa = await client.maplestorym.character.getHexaMatrixSkill({ ocid });
   * for (const core of hexa.character_hexa_core_equipment) {
   *   console.log(`${core.hexa_core_name} Lv.${core.hexa_core_level}`);
   * }
   * ```
   */
  async getHexaMatrixSkill(params: MOcidRequest): Promise<MCharacterHexaMatrixSkill> {
    return this.http.get<MCharacterHexaMatrixSkill>(
      `${MapleStoryMCharacterClient.BASE}/character/hexamatrix-skill`,
      { ocid: params.ocid },
      M_CHARACTER_HEXAMATRIX_SKILL_SHAPE,
    );
  }

  /**
   * HEXA매트릭스 스탯 정보를 조회한다.
   *
   * @example
   * ```ts
   * const hexaStat = await client.maplestorym.character.getHexaMatrixStat({ ocid });
   * for (const core of hexaStat.character_hexa_stat_core) {
   *   console.log(`${core.main_stat_name} Lv.${core.main_stat_level}`);
   * }
   * ```
   */
  async getHexaMatrixStat(params: MOcidRequest): Promise<MCharacterHexaMatrixStat> {
    return this.http.get<MCharacterHexaMatrixStat>(
      `${MapleStoryMCharacterClient.BASE}/character/hexamatrix-stat`,
      { ocid: params.ocid },
      M_CHARACTER_HEXAMATRIX_STAT_SHAPE,
    );
  }
}
