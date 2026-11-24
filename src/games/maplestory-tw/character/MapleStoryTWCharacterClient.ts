import { assertOneOf } from '../../../core/validation/input.js';
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

/** MapleStory Taiwan 캐릭터 정보: 스탯·장비·스킬·심볼·무릉도장(武陵道場)·패밀리어(萌獸) 등. 2025-10-15 데이터부터 있다. */
export class MapleStoryTWCharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorytw/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly formatDate: TWFormatQueryDate,
  ) {}

  /**
   * 캐릭터 기본 정보(레벨·직업·월드·소속 길드·외형 이미지)를 조회한다. 대만 명칭: 基本資訊.
   * Add query parameters to the returned image URL to change its action or expression.
   *
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const basic = await client.maplestoryTW.character.getBasic({ ocid });
   * console.log(basic.character_name, basic.character_level);
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
   * 캐릭터 인기도를 조회한다. 대만 명칭: 名聲.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const pop = await client.maplestoryTW.character.getPopularity({ ocid });
   * console.log(`인기도: ${pop.popularity}`);
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
   * 캐릭터 정보창의 스탯(종합 능력치)을 조회한다. 스탯 이름·값 목록으로 온다. 대만 명칭: 綜合能力值.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const stat = await client.maplestoryTW.character.getStat({ ocid });
   * for (const s of stat.final_stat) {
   *   console.log(`${s.stat_name}: ${s.stat_value}`);
   * }
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
   * 하이퍼 스탯을 조회한다. 프리셋별 스탯 레벨과 상승량, 남은 포인트가 들어 있다. 대만 명칭: 極限屬性.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const hyper = await client.maplestoryTW.character.getHyperStat({ ocid });
   * console.log(`사용 프리셋: ${hyper.use_preset_no}`);
   * for (const s of hyper.hyper_stat_preset_1) {
   *   console.log(`${s.stat_type} Lv.${s.stat_level}: ${s.stat_increase}`);
   * }
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
   * 성향 6종(카리스마·감성·통찰력·의지·손재주·매력)의 레벨을 조회한다. 대만 명칭: 性向.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const prop = await client.maplestoryTW.character.getPropensity({ ocid });
   * console.log(`카리스마: ${prop.charisma_level}, 매력: ${prop.charm_level}`);
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
   * 어빌리티(등급과 옵션, 프리셋 포함)와 보유 명성치를 조회한다. 대만 명칭: 能力.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const ability = await client.maplestoryTW.character.getAbility({ ocid });
   * console.log(`등급: ${ability.ability_grade}`);
   * for (const a of ability.ability_info) {
   *   console.log(`${a.ability_value} (${a.ability_grade})`);
   * }
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
   * 장비창의 장착 장비(프리셋 포함, 캐시 장비 제외)를 조회한다. 스타포스·잠재능력·에디셔널 잠재능력·추가 옵션과 칭호가 함께 온다. 대만 명칭: 已裝備道具.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const equip = await client.maplestoryTW.character.getItemEquipment({ ocid });
   * for (const item of equip.item_equipment) {
   *   console.log(`[${item.item_equipment_part}] ${item.item_name} ★${item.starforce}`);
   * }
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
   * 장착 중인 캐시 장비(코디, 프리셋 포함)를 조회한다. 대만 명칭: 已裝備現金道具.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const cash = await client.maplestoryTW.character.getCashItemEquipment({ ocid });
   * for (const item of cash.cash_item_equipment_base) {
   *   console.log(`[${item.cash_item_equipment_part}] ${item.cash_item_name}`);
   * }
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
   * 장착한 심볼(아케인심볼·어센틱심볼)의 레벨·성장치·증가 스탯을 조회한다. 대만 명칭: 符文.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const symbols = await client.maplestoryTW.character.getSymbolEquipment({ ocid });
   * for (const s of symbols.symbol) {
   *   console.log(`${s.symbol_name} Lv.${s.symbol_level} (${s.symbol_force})`);
   * }
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
   * 적용 중인 세트 효과(세트 이름, 착용 세트 수, 옵션)를 조회한다. 대만 명칭: 套裝效果.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const effect = await client.maplestoryTW.character.getSetEffect({ ocid });
   * for (const set of effect.set_effect) {
   *   console.log(`${set.set_name} (${set.total_set_count}세트)`);
   * }
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
   * 헤어·성형·피부(믹스 염색 포함)를 조회한다. 대만 명칭: 髮型、臉型與膚色.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const beauty = await client.maplestoryTW.character.getBeautyEquipment({ ocid });
   * console.log(`헤어: ${beauty.character_hair.hair_name}`);
   * console.log(`성형: ${beauty.character_face.face_name}`);
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
   * 장착 안드로이드(외형·캐시 장비·프리셋)를 조회한다. 대만 명칭: 機器人.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const android = await client.maplestoryTW.character.getAndroidEquipment({ ocid });
   * console.log(`안드로이드: ${android.android_name} (${android.android_grade})`);
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
   * 장착 펫(최대 3마리)과 펫 장비·펫 스킬(자동 버프)을 조회한다. 대만 명칭: 寵物.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const pet = await client.maplestoryTW.character.getPetEquipment({ ocid });
   * console.log(`펫1: ${pet.pet_1_name} (${pet.pet_1_nickname})`);
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
   * 전직 차수별 스킬 또는 하이퍼 스킬(스킬 레벨·효과)을 조회한다. 대만 명칭: 技能、超技能.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @param params.character_skill_grade - 전직 차수 ("0"~"6", "1.5", "2.5") 또는 하이퍼 스킬 ("hyperpassive", "hyperactive")
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range, or the skill grade is unsupported.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const skill = await client.maplestoryTW.character.getSkill({
   *   ocid,
   *   character_skill_grade: '4',
   * });
   * for (const s of skill.character_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
   * ```
   */
  async getSkill(params: TWSkillRequest): Promise<TWCharacterSkill> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    assertOneOf(params.character_skill_grade, TW_SKILL_GRADES, 'character_skill_grade');
    return this.http.get<TWCharacterSkill>(
      `${MapleStoryTWCharacterClient.BASE}/character/skill`,
      { ...query, character_skill_grade: params.character_skill_grade },
      CHARACTER_SKILL_SHAPE,
    );
  }

  /**
   * 장착 링크 스킬(프리셋 포함)과 이 캐릭터가 주는 링크 스킬을 조회한다. 대만 명칭: 連結技能.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const link = await client.maplestoryTW.character.getLinkSkill({ ocid });
   * for (const s of link.character_link_skill) {
   *   console.log(`${s.skill_name} Lv.${s.skill_level}`);
   * }
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
   * V매트릭스(5차)에 장착한 V코어와 슬롯 정보를 조회한다. 대만 명칭: V 矩陣、V 核心.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const vm = await client.maplestoryTW.character.getVMatrix({ ocid });
   * for (const core of vm.character_v_core_equipment) {
   *   console.log(`${core.v_core_name} Lv.${core.v_core_level} (${core.v_core_type})`);
   * }
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
   * HEXA 매트릭스(6차)에 장착한 HEXA 코어(이름·레벨·타입)를 조회한다. 대만 명칭: HEXA 核心.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const hexa = await client.maplestoryTW.character.getHexaMatrix({ ocid });
   * for (const core of hexa.character_hexa_core_equipment) {
   *   console.log(`${core.hexa_core_name} Lv.${core.hexa_core_level} (${core.hexa_core_type})`);
   * }
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
   * HEXA 매트릭스에 설정한 HEXA 스탯(메인·서브 스탯 레벨)을 조회한다. 대만 명칭: HEXA 屬性.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const stat = await client.maplestoryTW.character.getHexaMatrixStat({ ocid });
   * for (const core of stat.character_hexa_stat_core) {
   *   console.log(`${core.main_stat_name} Lv.${core.main_stat_level}`);
   * }
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
   * 무릉도장 최고 기록(최고 층수와 클리어 시간)을 조회한다. 대만 명칭: 武陵道場.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const dojang = await client.maplestoryTW.character.getDojang({ ocid });
   * console.log(`최고 기록: ${dojang.dojang_best_floor}층 (${dojang.dojang_best_time}초)`);
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
   * 패밀리어(萌獸) 정보와 연결 슬롯을 조회한다. 대만 서버에만 있다. 대만 명칭: 萌獸.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-15 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
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
