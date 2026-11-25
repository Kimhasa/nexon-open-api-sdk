import { UTC_PLUS_8_OFFSET_MINUTES, snapshotDate } from '../../_base/maple-date.js';
import { assertNonEmptyString } from '../../../core/validation/input.js';
import { emitDeprecation } from '../../../core/deprecation/deprecation.js';
import {
  SEA_CHARACTER_BASIC_SHAPE,
  SEA_CHARACTER_POPULARITY_SHAPE,
  SEA_CHARACTER_STAT_SHAPE,
  SEA_CHARACTER_HYPER_STAT_SHAPE,
  SEA_CHARACTER_PROPENSITY_SHAPE,
  SEA_CHARACTER_ABILITY_SHAPE,
  SEA_CHARACTER_ITEM_EQUIPMENT_SHAPE,
  SEA_CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
  SEA_CHARACTER_SYMBOL_EQUIPMENT_SHAPE,
  SEA_CHARACTER_SET_EFFECT_SHAPE,
  SEA_CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
  SEA_CHARACTER_ANDROID_EQUIPMENT_SHAPE,
  SEA_CHARACTER_PET_EQUIPMENT_SHAPE,
  SEA_CHARACTER_SKILL_SHAPE,
  SEA_CHARACTER_LINK_SKILL_SHAPE,
  SEA_CHARACTER_VMATRIX_SHAPE,
  SEA_CHARACTER_HEXAMATRIX_SHAPE,
  SEA_CHARACTER_HEXAMATRIX_STAT_SHAPE,
  SEA_CHARACTER_DOJANG_SHAPE,
} from '../shapes.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import type {
  SEACharacterBasic,
  SEACharacterPopularity,
  SEACharacterStat,
  SEACharacterHyperStat,
  SEACharacterPropensity,
  SEACharacterAbility,
  SEACharacterItemEquipment,
  SEACharacterCashItemEquipment,
  SEACharacterSymbolEquipment,
  SEACharacterSetEffect,
  SEACharacterBeautyEquipment,
  SEACharacterAndroidEquipment,
  SEACharacterPetEquipment,
  SEACharacterSkill,
  SEACharacterLinkSkill,
  SEACharacterVMatrix,
  SEACharacterHexaMatrix,
  SEACharacterHexaMatrixStat,
  SEACharacterDojang,
  SEASkillRequest,
} from './types.js';

const SNAPSHOT = {
  firstDate: '2025-04-20',
  timezoneOffset: UTC_PLUS_8_OFFSET_MINUTES,
  language: 'en',
  apiLabel: 'Character',
} as const;

/**
 * MapleStorySEA 캐릭터 정보: 스탯·장비·스킬·심볼·V Matrix·HEXA Matrix·Mu Lung Garden 등.
 *
 * 2025년 4월 20일 데이터부터 조회할 수 있습니다. 날짜는 싱가포르 시간(UTC+8) 기준입니다.
 *
 * @example
 * ```ts
 * const ocid = await client.maplestorySEA.getOcid('CharacterName');
 * const basic = await client.maplestorySEA.character.getBasic({ ocid });
 * const stat = await client.maplestorySEA.character.getStat({ ocid });
 * ```
 */
export class MapleStorySEACharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorysea/v1';

  constructor(private readonly http: HttpClient) {}

  // ─── GET /maplestorysea/v1/character/basic ──────────────────────────────

  /**
   * 캐릭터 기본 정보(레벨·직업·월드·소속 길드·외형 이미지)를 조회한다. SEA 명칭: Basic character information.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const basic = await client.maplestorySEA.character.getBasic({ ocid });
   * console.log(basic.character_name, basic.character_level);
   * ```
   */
  async getBasic(params: OcidDateRequest): Promise<SEACharacterBasic> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterBasic>(
      `${MapleStorySEACharacterClient.BASE}/character/basic`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_BASIC_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/popularity ─────────────────────────

  /**
   * 캐릭터 인기도를 조회한다. SEA 명칭: Popularity.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const pop = await client.maplestorySEA.character.getPopularity({ ocid });
   * console.log(`인기도: ${pop.popularity}`);
   * ```
   */
  async getPopularity(params: OcidDateRequest): Promise<SEACharacterPopularity> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterPopularity>(
      `${MapleStorySEACharacterClient.BASE}/character/popularity`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_POPULARITY_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/stat ───────────────────────────────

  /**
   * 캐릭터 정보창의 스탯(종합 능력치)을 조회한다. 스탯 이름·값 목록으로 온다. SEA 명칭: Comprehensive stats.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const stat = await client.maplestorySEA.character.getStat({ ocid });
   * for (const s of stat.final_stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
   * ```
   */
  async getStat(params: OcidDateRequest): Promise<SEACharacterStat> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterStat>(
      `${MapleStorySEACharacterClient.BASE}/character/stat`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, SNAPSHOT),
      },
      SEA_CHARACTER_STAT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/hyper-stat ─────────────────────────

  /**
   * 하이퍼 스탯을 조회한다. 프리셋별 스탯 레벨과 상승량, 남은 포인트가 들어 있다. SEA 명칭: Hyper Stat.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const hyper = await client.maplestorySEA.character.getHyperStat({ ocid });
   * console.log(`사용 프리셋: ${hyper.use_preset_no}`);
   * for (const s of hyper.hyper_stat_preset_1) {
   *   console.log(`${s.stat_type} Lv.${s.stat_level}: ${s.stat_increase}`);
   * }
   * ```
   */
  async getHyperStat(params: OcidDateRequest): Promise<SEACharacterHyperStat> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterHyperStat>(
      `${MapleStorySEACharacterClient.BASE}/character/hyper-stat`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_HYPER_STAT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/propensity ─────────────────────────

  /**
   * 성향 6종(카리스마·감성·통찰력·의지·손재주·매력)의 레벨을 조회한다. SEA 명칭: Traits.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const prop = await client.maplestorySEA.character.getPropensity({ ocid });
   * console.log(`카리스마: ${prop.charisma_level}, 매력: ${prop.charm_level}`);
   * ```
   */
  async getPropensity(params: OcidDateRequest): Promise<SEACharacterPropensity> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterPropensity>(
      `${MapleStorySEACharacterClient.BASE}/character/propensity`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_PROPENSITY_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/ability ────────────────────────────

  /**
   * 어빌리티(등급과 옵션, 프리셋 포함)와 보유 명성치를 조회한다. SEA 명칭: Ability.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const ability = await client.maplestorySEA.character.getAbility({ ocid });
   * console.log(`등급: ${ability.ability_grade}`);
   * for (const a of ability.ability_info) {
   *   console.log(`${a.ability_value} (${a.ability_grade})`);
   * }
   * ```
   */
  async getAbility(params: OcidDateRequest): Promise<SEACharacterAbility> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterAbility>(
      `${MapleStorySEACharacterClient.BASE}/character/ability`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_ABILITY_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/item-equipment ─────────────────────

  /**
   * 장비창의 장착 장비(프리셋 포함, 캐시 장비 제외)를 조회한다. 스타포스·잠재능력·에디셔널 잠재능력·추가 옵션과 칭호가 함께 온다. SEA 명칭: Equipped equipment (excluding cash items).
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const equip = await client.maplestorySEA.character.getItemEquipment({ ocid });
   * for (const item of equip.item_equipment) {
   *   console.log(`[${item.item_equipment_part}] ${item.item_name} ★${item.starforce}`);
   * }
   * ```
   */
  async getItemEquipment(params: OcidDateRequest): Promise<SEACharacterItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    const response = await this.http.get<SEACharacterItemEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
    const equipment = [response?.dragon_equipment, response?.mechanic_equipment];
    if (equipment.some((items) => hasEquipmentField(items, CLASS_EQUIPMENT_POTENTIAL_FIELDS))) {
      emitDeprecation(
        'SEAClassItemEquipment.potentialOptions',
        'The MapleStorySEA portal omits potential options for dragon and mechanic equipment. Check whether these fields are present before using them.',
      );
    }
    return response;
  }

  // ─── GET /maplestorysea/v1/character/cashitem-equipment ─────────────────

  /**
   * 장착 중인 캐시 장비(코디, 프리셋 포함)를 조회한다. SEA 명칭: Equipped cash items.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const cash = await client.maplestorySEA.character.getCashItemEquipment({ ocid });
   * for (const item of cash.cash_item_equipment_base) {
   *   console.log(`[${item.cash_item_equipment_part}] ${item.cash_item_name}`);
   * }
   * ```
   */
  async getCashItemEquipment(params: OcidDateRequest): Promise<SEACharacterCashItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    const response = await this.http.get<SEACharacterCashItemEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/cashitem-equipment`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
    );
    const equipment = [
      response?.cash_item_equipment_base,
      response?.cash_item_equipment_preset_1,
      response?.cash_item_equipment_preset_2,
      response?.cash_item_equipment_preset_3,
      response?.additional_cash_item_equipment_base,
      response?.additional_cash_item_equipment_preset_1,
      response?.additional_cash_item_equipment_preset_2,
      response?.additional_cash_item_equipment_preset_3,
    ];
    if (equipment.some((items) => hasEquipmentField(items, ['skills']))) {
      emitDeprecation(
        'SEACashItemEquipmentItem.skills',
        'Read skill_info for the names and levels of MapleStorySEA cash equipment skills.',
      );
    }
    return response;
  }

  // ─── GET /maplestorysea/v1/character/symbol-equipment ───────────────────

  /**
   * 장착한 심볼(아케인심볼·어센틱심볼)의 레벨·성장치·증가 스탯을 조회한다. SEA 명칭: Equipped symbols.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const symbols = await client.maplestorySEA.character.getSymbolEquipment({ ocid });
   * for (const s of symbols.symbol) {
   *   console.log(`${s.symbol_name} Lv.${s.symbol_level} (${s.symbol_force})`);
   * }
   * ```
   */
  async getSymbolEquipment(params: OcidDateRequest): Promise<SEACharacterSymbolEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterSymbolEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/symbol-equipment`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_SYMBOL_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/set-effect ─────────────────────────

  /**
   * 적용 중인 세트 효과(세트 이름, 착용 세트 수, 옵션)를 조회한다. SEA 명칭: Set item effects.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const effect = await client.maplestorySEA.character.getSetEffect({ ocid });
   * for (const set of effect.set_effect) {
   *   console.log(`${set.set_name} (${set.total_set_count}세트)`);
   * }
   * ```
   */
  async getSetEffect(params: OcidDateRequest): Promise<SEACharacterSetEffect> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterSetEffect>(
      `${MapleStorySEACharacterClient.BASE}/character/set-effect`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_SET_EFFECT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/beauty-equipment ───────────────────

  /**
   * 헤어·성형·피부(믹스 염색 포함)를 조회한다. SEA 명칭: Hair, face, and skin.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const beauty = await client.maplestorySEA.character.getBeautyEquipment({ ocid });
   * console.log(`헤어: ${beauty.character_hair.hair_name}`);
   * console.log(`성형: ${beauty.character_face.face_name}`);
   * ```
   */
  async getBeautyEquipment(params: OcidDateRequest): Promise<SEACharacterBeautyEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterBeautyEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/beauty-equipment`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/android-equipment ──────────────────

  /**
   * 장착 안드로이드(외형·캐시 장비·프리셋)를 조회한다. SEA 명칭: Android.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const android = await client.maplestorySEA.character.getAndroidEquipment({ ocid });
   * console.log(`안드로이드: ${android.android_name} (${android.android_grade})`);
   * ```
   */
  async getAndroidEquipment(params: OcidDateRequest): Promise<SEACharacterAndroidEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterAndroidEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/android-equipment`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_ANDROID_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/pet-equipment ──────────────────────

  /**
   * 장착 펫(최대 3마리)과 펫 장비·펫 스킬(자동 버프)을 조회한다. SEA 명칭: Pets.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const pet = await client.maplestorySEA.character.getPetEquipment({ ocid });
   * console.log(`펫1: ${pet.pet_1_name} (${pet.pet_1_nickname})`);
   * ```
   */
  async getPetEquipment(params: OcidDateRequest): Promise<SEACharacterPetEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterPetEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/pet-equipment`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_PET_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/skill ──────────────────────────────

  /**
   * 전직 차수별 스킬 또는 하이퍼 스킬(스킬 레벨·효과)을 조회한다. SEA 명칭: Skills and Hyper Skills.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @param params.character_skill_grade - 전직 차수 ("0"~"6", "1.5", "2.5") 또는 하이퍼 스킬 ("hyperpassive", "hyperactive")
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const skill = await client.maplestorySEA.character.getSkill({
   *   ocid,
   *   character_skill_grade: '4',
   * });
   * for (const s of skill.character_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   */
  async getSkill(params: SEASkillRequest): Promise<SEACharacterSkill> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    assertNonEmptyString(
      params.character_skill_grade,
      'character_skill_grade',
      undefined,
      'trim-truthy',
    );
    return this.http.get<SEACharacterSkill>(
      `${MapleStorySEACharacterClient.BASE}/character/skill`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, SNAPSHOT),
        character_skill_grade: params.character_skill_grade,
      },
      SEA_CHARACTER_SKILL_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/link-skill ─────────────────────────

  /**
   * 장착 링크 스킬(프리셋 포함)과 이 캐릭터가 주는 링크 스킬을 조회한다. SEA 명칭: Link Skills.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const link = await client.maplestorySEA.character.getLinkSkill({ ocid });
   * for (const s of link.character_link_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   */
  async getLinkSkill(params: OcidDateRequest): Promise<SEACharacterLinkSkill> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterLinkSkill>(
      `${MapleStorySEACharacterClient.BASE}/character/link-skill`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_LINK_SKILL_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/vmatrix ────────────────────────────

  /**
   * V매트릭스(5차)에 장착한 V코어와 슬롯 정보를 조회한다. SEA 명칭: V Matrix, Nodes.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const vm = await client.maplestorySEA.character.getVMatrix({ ocid });
   * for (const core of vm.character_v_core_equipment) {
   *   console.log(`${core.v_core_name} Lv.${core.v_core_level} (${core.v_core_type})`);
   * }
   * ```
   */
  async getVMatrix(params: OcidDateRequest): Promise<SEACharacterVMatrix> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterVMatrix>(
      `${MapleStorySEACharacterClient.BASE}/character/vmatrix`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_VMATRIX_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/hexamatrix ─────────────────────────

  /**
   * HEXA 매트릭스(6차)에 장착한 HEXA 코어(이름·레벨·타입)를 조회한다. SEA 명칭: HEXA Nodes.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const hexa = await client.maplestorySEA.character.getHexaMatrix({ ocid });
   * for (const core of hexa.character_hexa_core_equipment ?? []) {
   *   console.log(`${core.hexa_core_name} Lv.${core.hexa_core_level} (${core.hexa_core_type})`);
   * }
   * ```
   */
  async getHexaMatrix(params: OcidDateRequest): Promise<SEACharacterHexaMatrix> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterHexaMatrix>(
      `${MapleStorySEACharacterClient.BASE}/character/hexamatrix`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_HEXAMATRIX_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/hexamatrix-stat ────────────────────

  /**
   * HEXA 매트릭스에 설정한 HEXA 스탯(메인·서브 스탯 레벨)을 조회한다. SEA 명칭: HEXA Stats.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const stat = await client.maplestorySEA.character.getHexaMatrixStat({ ocid });
   * for (const core of stat.character_hexa_stat_core) {
   *   console.log(`${core.main_stat_name} Lv.${core.main_stat_level}`);
   * }
   * ```
   */
  async getHexaMatrixStat(params: OcidDateRequest): Promise<SEACharacterHexaMatrixStat> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterHexaMatrixStat>(
      `${MapleStorySEACharacterClient.BASE}/character/hexamatrix-stat`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_HEXAMATRIX_STAT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/dojang ─────────────────────────────

  /**
   * 무릉도장 최고 기록(최고 층수와 클리어 시간)을 조회한다. SEA 명칭: Mu Lung Garden.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const dojang = await client.maplestorySEA.character.getDojang({ ocid });
   * console.log(`최고 기록: ${dojang.dojang_best_floor}층 (${dojang.dojang_best_time}초)`);
   * ```
   */
  async getDojang(params: OcidDateRequest): Promise<SEACharacterDojang> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterDojang>(
      `${MapleStorySEACharacterClient.BASE}/character/dojang`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      SEA_CHARACTER_DOJANG_SHAPE,
    );
  }
}

const CLASS_EQUIPMENT_POTENTIAL_FIELDS = [
  'potential_option_grade',
  'additional_potential_option_grade',
  'potential_option_1',
  'potential_option_2',
  'potential_option_3',
  'additional_potential_option_1',
  'additional_potential_option_2',
  'additional_potential_option_3',
];

function hasEquipmentField(items: unknown, fields: readonly string[]): boolean {
  return (
    Array.isArray(items) &&
    items.some(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        fields.some((field) => Object.hasOwn(item, field)),
    )
  );
}
