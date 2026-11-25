import { assertNonEmptyString } from '../../../core/validation/input.js';
import { emitDeprecation } from '../../../core/deprecation/deprecation.js';
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

const OCID_HINT = 'maplestorym.getOcid()로 캐릭터 식별자를 조회하세요.';

/**
 * 메이플스토리M 캐릭터 정보: 스탯·장비·심볼·쥬얼·스킬·V매트릭스·HEXA매트릭스 등.
 *
 * 날짜를 넣지 않고 현재 데이터를 조회합니다. 게임에서 바뀐 내용은 평균 10분 뒤에 조회됩니다.
 * 값이 게임과 다르면 게임에 다시 접속한 뒤 조회하세요.
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
   * 캐릭터 기본 정보(레벨·직업·월드·최근 접속 일시·외형 이미지)를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const basic = await client.maplestorym.character.getBasic({ ocid });
   * console.log(basic.character_name, basic.character_level);
   * ```
   */
  async getBasic(params: MOcidRequest): Promise<MCharacterBasic> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterBasic>(
      `${MapleStoryMCharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      M_CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 캐릭터 스탯(스탯 이름·값 목록)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const stat = await client.maplestorym.character.getStat({ ocid });
   * for (const s of stat.stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
   * ```
   */
  async getStat(params: MOcidRequest): Promise<MCharacterStat> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterStat>(
      `${MapleStoryMCharacterClient.BASE}/character/stat`,
      { ocid: params.ocid },
      M_CHARACTER_STAT_SHAPE,
    );
  }

  /**
   * 하이퍼 스탯(프리셋별 스탯 레벨과 상승량)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const hyperStat = await client.maplestorym.character.getHyperStat({ ocid });
   * console.log(`프리셋 ${hyperStat.use_preset_no} 사용 중`);
   * ```
   */
  async getHyperStat(params: MOcidRequest): Promise<MCharacterHyperStat> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterHyperStat>(
      `${MapleStoryMCharacterClient.BASE}/character/hyper-stat`,
      { ocid: params.ocid },
      M_CHARACTER_HYPER_STAT_SHAPE,
    );
  }

  /**
   * 캐릭터가 가입한 길드 이름을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const guild = await client.maplestorym.character.getGuild({ ocid });
   * console.log(`길드: ${guild.guild_name}`);
   * ```
   */
  async getGuild(params: MOcidRequest): Promise<MCharacterGuild> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterGuild>(
      `${MapleStoryMCharacterClient.BASE}/character/guild`,
      { ocid: params.ocid },
      M_CHARACTER_GUILD_SHAPE,
    );
  }

  /**
   * 장착 장비(프리셋 포함, 캐시 아이템 제외)를 조회한다. 스타포스·잠재능력·에디셔널 잠재능력·소울·마스터리가 함께 온다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const equip = await client.maplestorym.character.getItemEquipment({ ocid });
   * for (const item of equip.item_equipment) {
   *   console.log(`${item.item_equipment_slot_name}: ${item.item_name}`);
   * }
   * ```
   */
  async getItemEquipment(params: MOcidRequest): Promise<MCharacterItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterItemEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 중인 캐시 아이템(코디, 프리셋 포함)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const cash = await client.maplestorym.character.getCashItemEquipment({ ocid });
   * for (const item of cash.cash_item_equipment) {
   *   console.log(`${item.cash_item_equipment_slot_name}: ${item.cash_item_name}`);
   * }
   * ```
   */
  async getCashItemEquipment(params: MOcidRequest): Promise<MCharacterCashItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterCashItemEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/cashitem-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착한 심볼(아케인심볼·어센틱심볼)의 레벨·성장치·옵션을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const symbol = await client.maplestorym.character.getSymbol({ ocid });
   * for (const s of [...symbol.arcane_symbol, ...symbol.authentic_symbol]) {
   *   console.log(`${s.symbol_name} Lv.${s.symbol_level}`);
   * }
   * ```
   */
  async getSymbol(params: MOcidRequest): Promise<MCharacterSymbolEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterSymbolEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/symbol`,
      { ocid: params.ocid },
      M_CHARACTER_SYMBOL_SHAPE,
    );
  }

  /**
   * 적용 중인 세트 효과를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const setEffect = await client.maplestorym.character.getSetEffect({ ocid });
   * for (const s of setEffect.set_info) {
   *   console.log(`${s.set_name} (${s.set_count}세트)`);
   * }
   * ```
   */
  async getSetEffect(params: MOcidRequest): Promise<MCharacterSetEffect> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterSetEffect>(
      `${MapleStoryMCharacterClient.BASE}/character/set-effect`,
      { ocid: params.ocid },
      M_CHARACTER_SET_EFFECT_SHAPE,
    );
  }

  /**
   * 장착 안드로이드(프리셋 포함)를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const android = await client.maplestorym.character.getAndroidEquipment({ ocid });
   * console.log(`${android.android_equipment.android_name} (${android.android_equipment.android_grade})`);
   * ```
   */
  async getAndroidEquipment(params: MOcidRequest): Promise<MCharacterAndroidEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterAndroidEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/android-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_ANDROID_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 쥬얼(페이지별 쥬얼과 쥬얼 세트 옵션)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const jewel = await client.maplestorym.character.getJewel({ ocid });
   * for (const j of jewel.jewel_equipment.flatMap((page) => page.jewel_info)) {
   *   console.log(`${j.jewel_name} (${j.jewel_grade}): ${j.jewel_option}`);
   * }
   * ```
   */
  async getJewel(params: MOcidRequest): Promise<MCharacterJewel> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterJewel>(
      `${MapleStoryMCharacterClient.BASE}/character/jewel`,
      { ocid: params.ocid },
      M_CHARACTER_JEWEL_SHAPE,
    );
  }

  /**
   * 헤어·성형·피부를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const beauty = await client.maplestorym.character.getBeautyEquipment({ ocid });
   * console.log(`헤어: ${beauty.character_hair.hair_name}`);
   * ```
   */
  async getBeautyEquipment(params: MOcidRequest): Promise<MCharacterBeautyEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterBeautyEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/beauty-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 펫과 펫 장비·펫 스킬을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const pet = await client.maplestorym.character.getPetEquipment({ ocid });
   * console.log(`펫1: ${pet.pet_1_name} (${pet.pet_1_pet_type})`);
   * ```
   */
  async getPetEquipment(params: MOcidRequest): Promise<MCharacterPetEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterPetEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/pet-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_PET_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 캐릭터가 장착 중인 스킬을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const skill = await client.maplestorym.character.getSkillEquipment({ ocid });
   * for (const s of skill.skill.equipment_skill) {
   *   console.log(s.skill_name);
   * }
   * ```
   */
  async getSkillEquipment(params: MOcidRequest): Promise<MCharacterSkillEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterSkillEquipment>(
      `${MapleStoryMCharacterClient.BASE}/character/skill-equipment`,
      { ocid: params.ocid },
      M_CHARACTER_SKILL_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 링크 스킬(프리셋별)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const link = await client.maplestorym.character.getLinkSkill({ ocid });
   * for (const s of link.link_skill.flatMap((preset) => preset.link_skill_info)) {
   *   console.log(s.skill_name);
   * }
   * ```
   */
  async getLinkSkill(params: MOcidRequest): Promise<MCharacterLinkSkill> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterLinkSkill>(
      `${MapleStoryMCharacterClient.BASE}/character/link-skill`,
      { ocid: params.ocid },
      M_CHARACTER_LINK_SKILL_SHAPE,
    );
  }

  /**
   * V매트릭스의 V코어(코어 레벨·스킬·코어 점수)를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const vmatrix = await client.maplestorym.character.getVMatrix({ ocid });
   * for (const core of vmatrix.character_v_core_equipment) {
   *   console.log(`${core.vcore_type} Lv.${core.vcore_level}`);
   * }
   * ```
   */
  async getVMatrix(params: MOcidRequest): Promise<MCharacterVMatrix> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    const response = await this.http.get<MCharacterVMatrix>(
      `${MapleStoryMCharacterClient.BASE}/character/vmatrix`,
      { ocid: params.ocid },
      M_CHARACTER_VMATRIX_SHAPE,
    );

    const cores = response?.character_v_core_equipment;
    const legacyFields = [
      'slot_id',
      'slot_level',
      'vcore_name',
      'vcore_skill_name_1',
      'vcore_skill_name_2',
      'vcore_skill_name_3',
    ];
    if (
      Array.isArray(cores) &&
      cores.some((core) => core && legacyFields.some((field) => Object.hasOwn(core, field)))
    ) {
      emitDeprecation(
        'MVCoreEquipment.legacyFields',
        'V코어의 슬롯 및 코어 명 필드는 현재 포털 스펙에서 제거되었습니다. 스킬 명은 vcore_skill_name1~4를 사용하세요.',
      );
    }
    return response;
  }

  /**
   * HEXA매트릭스의 스킬(슬롯 레벨·스킬 타입)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const hexa = await client.maplestorym.character.getHexaMatrixSkill({ ocid });
   * for (const core of hexa.hexamatrix_skill) {
   *   console.log(`${core.skill_name} Lv.${core.slot_level}`);
   * }
   * ```
   */
  async getHexaMatrixSkill(params: MOcidRequest): Promise<MCharacterHexaMatrixSkill> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterHexaMatrixSkill>(
      `${MapleStoryMCharacterClient.BASE}/character/hexamatrix-skill`,
      { ocid: params.ocid },
      M_CHARACTER_HEXAMATRIX_SKILL_SHAPE,
    );
  }

  /**
   * HEXA매트릭스의 HEXA 스탯(메인·서브 스탯 강화 레벨)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const hexaStat = await client.maplestorym.character.getHexaMatrixStat({ ocid });
   * for (const core of hexaStat.hexamatrix_stat.flatMap((slot) => slot.stat_info)) {
   *   console.log(`${core.main_stat} Lv.${core.main_stat_level}`);
   * }
   * ```
   */
  async getHexaMatrixStat(params: MOcidRequest): Promise<MCharacterHexaMatrixStat> {
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MCharacterHexaMatrixStat>(
      `${MapleStoryMCharacterClient.BASE}/character/hexamatrix-stat`,
      { ocid: params.ocid },
      M_CHARACTER_HEXAMATRIX_STAT_SHAPE,
    );
  }
}
