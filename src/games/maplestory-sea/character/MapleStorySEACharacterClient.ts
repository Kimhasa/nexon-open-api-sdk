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
   */
  async getBasic(params: OcidDateRequest): Promise<SEACharacterBasic> {
    return this.http.get<SEACharacterBasic>(
      `${MapleStorySEACharacterClient.BASE}/character/basic`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/popularity ─────────────────────────

  /**
   * Retrieve popularity information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getPopularity(params: OcidDateRequest): Promise<SEACharacterPopularity> {
    return this.http.get<SEACharacterPopularity>(
      `${MapleStorySEACharacterClient.BASE}/character/popularity`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/stat ───────────────────────────────

  /**
   * Retrieve comprehensive stats information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getStat(params: OcidDateRequest): Promise<SEACharacterStat> {
    return this.http.get<SEACharacterStat>(
      `${MapleStorySEACharacterClient.BASE}/character/stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/hyper-stat ─────────────────────────

  /**
   * Retrieve Hyper Stat information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getHyperStat(params: OcidDateRequest): Promise<SEACharacterHyperStat> {
    return this.http.get<SEACharacterHyperStat>(
      `${MapleStorySEACharacterClient.BASE}/character/hyper-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/propensity ─────────────────────────

  /**
   * Retrieve traits information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getPropensity(params: OcidDateRequest): Promise<SEACharacterPropensity> {
    return this.http.get<SEACharacterPropensity>(
      `${MapleStorySEACharacterClient.BASE}/character/propensity`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/ability ────────────────────────────

  /**
   * Retrieve Ability information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getAbility(params: OcidDateRequest): Promise<SEACharacterAbility> {
    return this.http.get<SEACharacterAbility>(
      `${MapleStorySEACharacterClient.BASE}/character/ability`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/item-equipment ─────────────────────

  /**
   * Retrieve equipped equipment information (excluding cash items).
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getItemEquipment(params: OcidDateRequest): Promise<SEACharacterItemEquipment> {
    return this.http.get<SEACharacterItemEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/cashitem-equipment ─────────────────

  /**
   * Retrieve equipped cash item information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getCashItemEquipment(params: OcidDateRequest): Promise<SEACharacterCashItemEquipment> {
    return this.http.get<SEACharacterCashItemEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/cashitem-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/symbol-equipment ───────────────────

  /**
   * Retrieve equipped symbol information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getSymbolEquipment(params: OcidDateRequest): Promise<SEACharacterSymbolEquipment> {
    return this.http.get<SEACharacterSymbolEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/symbol-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/set-effect ─────────────────────────

  /**
   * Retrieve information about equipped set item effects.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getSetEffect(params: OcidDateRequest): Promise<SEACharacterSetEffect> {
    return this.http.get<SEACharacterSetEffect>(
      `${MapleStorySEACharacterClient.BASE}/character/set-effect`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/beauty-equipment ───────────────────

  /**
   * Retrieve equipped hair, face, and skin information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getBeautyEquipment(params: OcidDateRequest): Promise<SEACharacterBeautyEquipment> {
    return this.http.get<SEACharacterBeautyEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/beauty-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/android-equipment ──────────────────

  /**
   * Retrieve equipped android information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getAndroidEquipment(params: OcidDateRequest): Promise<SEACharacterAndroidEquipment> {
    return this.http.get<SEACharacterAndroidEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/android-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/pet-equipment ──────────────────────

  /**
   * Retrieve equipped pet information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getPetEquipment(params: OcidDateRequest): Promise<SEACharacterPetEquipment> {
    return this.http.get<SEACharacterPetEquipment>(
      `${MapleStorySEACharacterClient.BASE}/character/pet-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/skill ──────────────────────────────

  /**
   * Retrieve skill information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   * @param params.character_skill_grade - Job advancement level ("0"~"6", "hyperpassive", "hyperactive")
   */
  async getSkill(params: SEASkillRequest): Promise<SEACharacterSkill> {
    return this.http.get<SEACharacterSkill>(
      `${MapleStorySEACharacterClient.BASE}/character/skill`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
        character_skill_grade: params.character_skill_grade,
      },
    );
  }

  // ─── GET /maplestorysea/v1/character/link-skill ─────────────────────────

  /**
   * Retrieve equipped Link Skill information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getLinkSkill(params: OcidDateRequest): Promise<SEACharacterLinkSkill> {
    return this.http.get<SEACharacterLinkSkill>(
      `${MapleStorySEACharacterClient.BASE}/character/link-skill`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/vmatrix ────────────────────────────

  /**
   * Retrieve V Matrix information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getVMatrix(params: OcidDateRequest): Promise<SEACharacterVMatrix> {
    return this.http.get<SEACharacterVMatrix>(
      `${MapleStorySEACharacterClient.BASE}/character/vmatrix`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/hexamatrix ─────────────────────────

  /**
   * Retrieve HEXA Node information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getHexaMatrix(params: OcidDateRequest): Promise<SEACharacterHexaMatrix> {
    return this.http.get<SEACharacterHexaMatrix>(
      `${MapleStorySEACharacterClient.BASE}/character/hexamatrix`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/hexamatrix-stat ────────────────────

  /**
   * Retrieve HEXA Matrix configured HEXA stats information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getHexaMatrixStat(params: OcidDateRequest): Promise<SEACharacterHexaMatrixStat> {
    return this.http.get<SEACharacterHexaMatrixStat>(
      `${MapleStorySEACharacterClient.BASE}/character/hexamatrix-stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/character/dojang ─────────────────────────────

  /**
   * Retrieve Mu Lung Garden highest record information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getDojang(params: OcidDateRequest): Promise<SEACharacterDojang> {
    return this.http.get<SEACharacterDojang>(
      `${MapleStorySEACharacterClient.BASE}/character/dojang`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }
}
