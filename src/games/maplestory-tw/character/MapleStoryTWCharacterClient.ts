import type { HttpClient } from '../../../core/http/HttpClient.js';
import { ocidDateParams } from '../query-params.js';
import type { TWFormatQueryDate } from '../query-params.js';
import {
  CHARACTER_BASIC_SHAPE,
  CHARACTER_POPULARITY_SHAPE,
  CHARACTER_STAT_SHAPE,
  CHARACTER_HYPER_STAT_SHAPE,
  CHARACTER_PROPENSITY_SHAPE,
  CHARACTER_ABILITY_SHAPE,
  CHARACTER_ITEM_EQUIPMENT_SHAPE,
  CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
  CHARACTER_SYMBOL_EQUIPMENT_SHAPE,
  CHARACTER_SET_EFFECT_SHAPE,
  CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
  CHARACTER_ANDROID_EQUIPMENT_SHAPE,
  CHARACTER_PET_EQUIPMENT_SHAPE,
  CHARACTER_SKILL_SHAPE,
  CHARACTER_LINK_SKILL_SHAPE,
  CHARACTER_VMATRIX_SHAPE,
  CHARACTER_HEXAMATRIX_SHAPE,
  CHARACTER_HEXAMATRIX_STAT_SHAPE,
  CHARACTER_DOJANG_SHAPE,
  CHARACTER_FAMILIAR_SHAPE,
} from '../shapes.js';
import type { TWOcidDateRequest } from '../types.js';
import { TW_SKILL_GRADES } from './types.js';
import type {
  TWCharacterBasic,
  TWCharacterPopularity,
  TWCharacterStat,
  TWCharacterHyperStat,
  TWCharacterPropensity,
  TWCharacterAbility,
  TWCharacterItemEquipment,
  TWCharacterCashItemEquipment,
  TWCharacterSymbolEquipment,
  TWCharacterSetEffect,
  TWCharacterBeautyEquipment,
  TWCharacterAndroidEquipment,
  TWCharacterPetEquipment,
  TWCharacterSkill,
  TWCharacterLinkSkill,
  TWCharacterVMatrix,
  TWCharacterHexaMatrix,
  TWCharacterHexaMatrixStat,
  TWCharacterDojang,
  TWCharacterFamiliar,
  TWSkillRequest,
} from './types.js';

const FIRST_SNAPSHOT_DATE = '2025-10-15';

/** MapleStory Taiwan Character API client. */
export class MapleStoryTWCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorytw/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly formatDate: TWFormatQueryDate,
  ) {}

  /**
   * Retrieve basic character information.
   * Add query parameters to the returned image URL to change its action or expression.
   *
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getBasic({ ocid });
   * ```
   */
  async getBasic(params: TWOcidDateRequest): Promise<TWCharacterBasic> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterBasic>(
      `${MapleStoryTWCharacterClient.BASE}/character/basic`,
      query,
      CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * Retrieve popularity information.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getPopularity({ ocid });
   * ```
   */
  async getPopularity(params: TWOcidDateRequest): Promise<TWCharacterPopularity> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterPopularity>(
      `${MapleStoryTWCharacterClient.BASE}/character/popularity`,
      query,
      CHARACTER_POPULARITY_SHAPE,
    );
  }

  /**
   * Retrieve comprehensive character stats.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getStat({ ocid });
   * ```
   */
  async getStat(params: TWOcidDateRequest): Promise<TWCharacterStat> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterStat>(
      `${MapleStoryTWCharacterClient.BASE}/character/stat`,
      query,
      CHARACTER_STAT_SHAPE,
    );
  }

  /**
   * Retrieve Hyper Stat information.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getHyperStat({ ocid });
   * ```
   */
  async getHyperStat(params: TWOcidDateRequest): Promise<TWCharacterHyperStat> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterHyperStat>(
      `${MapleStoryTWCharacterClient.BASE}/character/hyper-stat`,
      query,
      CHARACTER_HYPER_STAT_SHAPE,
    );
  }

  /**
   * Retrieve character traits.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getPropensity({ ocid });
   * ```
   */
  async getPropensity(params: TWOcidDateRequest): Promise<TWCharacterPropensity> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterPropensity>(
      `${MapleStoryTWCharacterClient.BASE}/character/propensity`,
      query,
      CHARACTER_PROPENSITY_SHAPE,
    );
  }

  /**
   * Retrieve ability information.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getAbility({ ocid });
   * ```
   */
  async getAbility(params: TWOcidDateRequest): Promise<TWCharacterAbility> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterAbility>(
      `${MapleStoryTWCharacterClient.BASE}/character/ability`,
      query,
      CHARACTER_ABILITY_SHAPE,
    );
  }

  /**
   * Retrieve equipped items, excluding cash items.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getItemEquipment({ ocid });
   * ```
   */
  async getItemEquipment(params: TWOcidDateRequest): Promise<TWCharacterItemEquipment> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterItemEquipment>(
      `${MapleStoryTWCharacterClient.BASE}/character/item-equipment`,
      query,
      CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * Retrieve equipped cash items.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getCashItemEquipment({ ocid });
   * ```
   */
  async getCashItemEquipment(params: TWOcidDateRequest): Promise<TWCharacterCashItemEquipment> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterCashItemEquipment>(
      `${MapleStoryTWCharacterClient.BASE}/character/cashitem-equipment`,
      query,
      CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * Retrieve equipped symbols.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getSymbolEquipment({ ocid });
   * ```
   */
  async getSymbolEquipment(params: TWOcidDateRequest): Promise<TWCharacterSymbolEquipment> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterSymbolEquipment>(
      `${MapleStoryTWCharacterClient.BASE}/character/symbol-equipment`,
      query,
      CHARACTER_SYMBOL_EQUIPMENT_SHAPE,
    );
  }

  /**
   * Retrieve active set effects.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getSetEffect({ ocid });
   * ```
   */
  async getSetEffect(params: TWOcidDateRequest): Promise<TWCharacterSetEffect> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterSetEffect>(
      `${MapleStoryTWCharacterClient.BASE}/character/set-effect`,
      query,
      CHARACTER_SET_EFFECT_SHAPE,
    );
  }

  /**
   * Retrieve equipped hair, face, and skin.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getBeautyEquipment({ ocid });
   * ```
   */
  async getBeautyEquipment(params: TWOcidDateRequest): Promise<TWCharacterBeautyEquipment> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterBeautyEquipment>(
      `${MapleStoryTWCharacterClient.BASE}/character/beauty-equipment`,
      query,
      CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
    );
  }

  /**
   * Retrieve equipped android information.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getAndroidEquipment({ ocid });
   * ```
   */
  async getAndroidEquipment(params: TWOcidDateRequest): Promise<TWCharacterAndroidEquipment> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterAndroidEquipment>(
      `${MapleStoryTWCharacterClient.BASE}/character/android-equipment`,
      query,
      CHARACTER_ANDROID_EQUIPMENT_SHAPE,
    );
  }

  /**
   * Retrieve equipped pets, pet skills, and pet items.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getPetEquipment({ ocid });
   * ```
   */
  async getPetEquipment(params: TWOcidDateRequest): Promise<TWCharacterPetEquipment> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterPetEquipment>(
      `${MapleStoryTWCharacterClient.BASE}/character/pet-equipment`,
      query,
      CHARACTER_PET_EQUIPMENT_SHAPE,
    );
  }

  /**
   * Retrieve character skills and Hyper Skills.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @param params.character_skill_grade - Job advancement tier or Hyper Skill category.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range, or the skill grade is unsupported.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getSkill({ ocid, character_skill_grade: '5' });
   * ```
   */
  async getSkill(params: TWSkillRequest): Promise<TWCharacterSkill> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    if (!TW_SKILL_GRADES.includes(params.character_skill_grade)) {
      throw new RangeError(`character_skill_grade must be one of ${TW_SKILL_GRADES.join(', ')}.`);
    }
    return this.http.get<TWCharacterSkill>(
      `${MapleStoryTWCharacterClient.BASE}/character/skill`,
      { ...query, character_skill_grade: params.character_skill_grade },
      CHARACTER_SKILL_SHAPE,
    );
  }

  /**
   * Retrieve equipped Link Skills.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getLinkSkill({ ocid });
   * ```
   */
  async getLinkSkill(params: TWOcidDateRequest): Promise<TWCharacterLinkSkill> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterLinkSkill>(
      `${MapleStoryTWCharacterClient.BASE}/character/link-skill`,
      query,
      CHARACTER_LINK_SKILL_SHAPE,
    );
  }

  /**
   * Retrieve V Matrix slots and equipped V Nodes.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getVMatrix({ ocid });
   * ```
   */
  async getVMatrix(params: TWOcidDateRequest): Promise<TWCharacterVMatrix> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterVMatrix>(
      `${MapleStoryTWCharacterClient.BASE}/character/vmatrix`,
      query,
      CHARACTER_VMATRIX_SHAPE,
    );
  }

  /**
   * Retrieve equipped HEXA Nodes.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getHexaMatrix({ ocid });
   * ```
   */
  async getHexaMatrix(params: TWOcidDateRequest): Promise<TWCharacterHexaMatrix> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterHexaMatrix>(
      `${MapleStoryTWCharacterClient.BASE}/character/hexamatrix`,
      query,
      CHARACTER_HEXAMATRIX_SHAPE,
    );
  }

  /**
   * Retrieve configured HEXA Stats.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getHexaMatrixStat({ ocid });
   * ```
   */
  async getHexaMatrixStat(params: TWOcidDateRequest): Promise<TWCharacterHexaMatrixStat> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterHexaMatrixStat>(
      `${MapleStoryTWCharacterClient.BASE}/character/hexamatrix-stat`,
      query,
      CHARACTER_HEXAMATRIX_STAT_SHAPE,
    );
  }

  /**
   * Retrieve the highest Mu Lung Dojo record.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getDojang({ ocid });
   * ```
   */
  async getDojang(params: TWOcidDateRequest): Promise<TWCharacterDojang> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterDojang>(
      `${MapleStoryTWCharacterClient.BASE}/character/dojang`,
      query,
      CHARACTER_DOJANG_SHAPE,
    );
  }

  /**
   * Retrieve Familiar details and link slots.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {TypeError} The ocid is blank.
   * @throws {RangeError} The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.character.getFamiliar({ ocid });
   * ```
   */
  async getFamiliar(params: TWOcidDateRequest): Promise<TWCharacterFamiliar> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWCharacterFamiliar>(
      `${MapleStoryTWCharacterClient.BASE}/character/familiar`,
      query,
      CHARACTER_FAMILIAR_SHAPE,
    );
  }
}
