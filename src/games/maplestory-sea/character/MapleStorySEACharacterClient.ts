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

/**
 * MapleStory SEA Character API client.
 *
 * Data available starting from April 20, 2025.
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
   * Retrieve basic character information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getBasic({ ocid });
   * ```
   */
  async getBasic(params: OcidDateRequest): Promise<SEACharacterBasic> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterBasic>(
      `${MapleStorySEACharacterClient.BASE}/character/basic`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_BASIC_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/popularity ─────────────────────────

  /**
   * Retrieve popularity information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getPopularity({ ocid });
   * ```
   */
  async getPopularity(params: OcidDateRequest): Promise<SEACharacterPopularity> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterPopularity>(
      `${MapleStorySEACharacterClient.BASE}/character/popularity`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_POPULARITY_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/stat ───────────────────────────────

  /**
   * Retrieve comprehensive stats information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getStat({ ocid });
   * ```
   */
  async getStat(params: OcidDateRequest): Promise<SEACharacterStat> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterStat>(
      `${MapleStorySEACharacterClient.BASE}/character/stat`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
      },
      SEA_CHARACTER_STAT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/hyper-stat ─────────────────────────

  /**
   * Retrieve Hyper Stat information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getHyperStat({ ocid });
   * ```
   */
  async getHyperStat(params: OcidDateRequest): Promise<SEACharacterHyperStat> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterHyperStat>(
      `${MapleStorySEACharacterClient.BASE}/character/hyper-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_HYPER_STAT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/propensity ─────────────────────────

  /**
   * Retrieve traits information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getPropensity({ ocid });
   * ```
   */
  async getPropensity(params: OcidDateRequest): Promise<SEACharacterPropensity> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterPropensity>(
      `${MapleStorySEACharacterClient.BASE}/character/propensity`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_PROPENSITY_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/ability ────────────────────────────

  /**
   * Retrieve Ability information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getAbility({ ocid });
   * ```
   */
  async getAbility(params: OcidDateRequest): Promise<SEACharacterAbility> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterAbility>(
      `${MapleStorySEACharacterClient.BASE}/character/ability`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_ABILITY_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/item-equipment ─────────────────────

  /**
   * Retrieve equipped equipment information (excluding cash items).
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getItemEquipment({ ocid });
   * ```
   */
  async getItemEquipment(params: OcidDateRequest): Promise<SEACharacterItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    const response = await this.http.get<SEACharacterItemEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
    const equipment = [response?.dragon_equipment, response?.mechanic_equipment];
    if (equipment.some((items) => hasEquipmentField(items, CLASS_EQUIPMENT_POTENTIAL_FIELDS))) {
      emitDeprecation(
        'SEAClassItemEquipment.potentialOptions',
        'The MapleStory SEA portal omits potential options for dragon and mechanic equipment. Check whether these fields are present before using them.',
      );
    }
    return response;
  }

  // ─── GET /maplestorysea/v1/character/cashitem-equipment ─────────────────

  /**
   * Retrieve equipped cash item information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getCashItemEquipment({ ocid });
   * ```
   */
  async getCashItemEquipment(params: OcidDateRequest): Promise<SEACharacterCashItemEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    const response = await this.http.get<SEACharacterCashItemEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/cashitem-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
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
        'Read skill_info for the names and levels of MapleStory SEA cash equipment skills.',
      );
    }
    return response;
  }

  // ─── GET /maplestorysea/v1/character/symbol-equipment ───────────────────

  /**
   * Retrieve equipped symbol information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getSymbolEquipment({ ocid });
   * ```
   */
  async getSymbolEquipment(params: OcidDateRequest): Promise<SEACharacterSymbolEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterSymbolEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/symbol-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_SYMBOL_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/set-effect ─────────────────────────

  /**
   * Retrieve information about equipped set item effects.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getSetEffect({ ocid });
   * ```
   */
  async getSetEffect(params: OcidDateRequest): Promise<SEACharacterSetEffect> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterSetEffect>(
      `${MapleStorySEACharacterClient.BASE}/character/set-effect`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_SET_EFFECT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/beauty-equipment ───────────────────

  /**
   * Retrieve equipped hair, face, and skin information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getBeautyEquipment({ ocid });
   * ```
   */
  async getBeautyEquipment(params: OcidDateRequest): Promise<SEACharacterBeautyEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterBeautyEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/beauty-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/android-equipment ──────────────────

  /**
   * Retrieve equipped android information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getAndroidEquipment({ ocid });
   * ```
   */
  async getAndroidEquipment(params: OcidDateRequest): Promise<SEACharacterAndroidEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterAndroidEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/android-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_ANDROID_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/pet-equipment ──────────────────────

  /**
   * Retrieve equipped pet information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getPetEquipment({ ocid });
   * ```
   */
  async getPetEquipment(params: OcidDateRequest): Promise<SEACharacterPetEquipment> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterPetEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/pet-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_PET_EQUIPMENT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/skill ──────────────────────────────

  /**
   * Retrieve skill information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   * @param params.character_skill_grade - Job advancement level ("0"~"6", "hyperpassive", "hyperactive")
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getSkill({ ocid, character_skill_grade: '6' });
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
        date: params.date as string | undefined,
        character_skill_grade: params.character_skill_grade,
      },
      SEA_CHARACTER_SKILL_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/link-skill ─────────────────────────

  /**
   * Retrieve equipped Link Skill information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getLinkSkill({ ocid });
   * ```
   */
  async getLinkSkill(params: OcidDateRequest): Promise<SEACharacterLinkSkill> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterLinkSkill>(
      `${MapleStorySEACharacterClient.BASE}/character/link-skill`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_LINK_SKILL_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/vmatrix ────────────────────────────

  /**
   * Retrieve V Matrix information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getVMatrix({ ocid });
   * ```
   */
  async getVMatrix(params: OcidDateRequest): Promise<SEACharacterVMatrix> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterVMatrix>(
      `${MapleStorySEACharacterClient.BASE}/character/vmatrix`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_VMATRIX_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/hexamatrix ─────────────────────────

  /**
   * Retrieve HEXA Node information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getHexaMatrix({ ocid });
   * ```
   */
  async getHexaMatrix(params: OcidDateRequest): Promise<SEACharacterHexaMatrix> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterHexaMatrix>(
      `${MapleStorySEACharacterClient.BASE}/character/hexamatrix`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_HEXAMATRIX_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/hexamatrix-stat ────────────────────

  /**
   * Retrieve HEXA Matrix configured HEXA stats information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getHexaMatrixStat({ ocid });
   * ```
   */
  async getHexaMatrixStat(params: OcidDateRequest): Promise<SEACharacterHexaMatrixStat> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterHexaMatrixStat>(
      `${MapleStorySEACharacterClient.BASE}/character/hexamatrix-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
      SEA_CHARACTER_HEXAMATRIX_STAT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/character/dojang ─────────────────────────────

  /**
   * Retrieve Mu Lung Garden highest record information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.character.getDojang({ ocid });
   * ```
   */
  async getDojang(params: OcidDateRequest): Promise<SEACharacterDojang> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEACharacterDojang>(
      `${MapleStorySEACharacterClient.BASE}/character/dojang`,
      { ocid: params.ocid, date: params.date as string | undefined },
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
