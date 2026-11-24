import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import {
  CHARACTER_LIST_SHAPE,
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
  CHARACTER_OTHER_STAT_SHAPE,
  CHARACTER_RING_EXCHANGE_SKILL_EQUIPMENT_SHAPE,
  CHARACTER_RING_RESERVE_SKILL_EQUIPMENT_SHAPE,
} from '../shapes.js';
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
  CharacterRingReserveSkillEquipment,
  CharacterSetEffect,
  CharacterSkill,
  CharacterStat,
  CharacterSymbolEquipment,
  CharacterVMatrix,
  SkillRequest,
} from './types.js';

/**
 * 메이플스토리 캐릭터 정보: 스탯·장비·스킬·심볼·V매트릭스·HEXA 매트릭스·무릉도장 등.
 *
 * `getList()` 를 뺀 모든 메서드는 캐릭터 고유 번호(`ocid`)가 필요합니다.
 * 게임에서 바뀐 내용은 평균 15분 뒤에 조회되고, 어제 날짜의 데이터는 오늘 오전 2시부터 조회됩니다.
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
   * 내 계정의 모든 캐릭터 목록(월드·직업·레벨)을 조회한다. API 키를 발급받은 계정이 기준이다.
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
    return this.http.get<CharacterList>(
      `${MapleStoryCharacterClient.BASE}/character/list`,
      undefined,
      CHARACTER_LIST_SHAPE,
    );
  }

  /**
   * 캐릭터 기본 정보(레벨·직업·월드·소속 길드·외형 이미지)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_BASIC_SHAPE,
    );
  }

  /**
   * 캐릭터 인기도를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_POPULARITY_SHAPE,
    );
  }

  /**
   * 캐릭터 정보창의 스탯(종합 능력치)을 조회한다. 스탯 이름·값 목록으로 온다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
   *
   * @example
   * ```ts
   * // 디스코드 봇의 `!전투력 캐릭터명` 응답: 스탯 목록에서 전투력만 골라 보여 주기
   * const stat = await client.maplestory.character.getStat({ ocid });
   * const power = stat.final_stat.find((s) => s.stat_name === '전투력');
   * console.log(`전투력: ${power?.stat_value ?? '정보 없음'}`);
   * ```
   */
  async getStat(params: OcidDateRequest): Promise<CharacterStat> {
    return this.http.get<CharacterStat>(
      `${MapleStoryCharacterClient.BASE}/character/stat`,
      { ocid: params.ocid, date: params.date as string | undefined },
      CHARACTER_STAT_SHAPE,
    );
  }

  /**
   * 하이퍼 스탯을 조회한다. 프리셋별 스탯 레벨과 상승량, 남은 포인트가 들어 있다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_HYPER_STAT_SHAPE,
    );
  }

  /**
   * 성향 6종(카리스마·감성·통찰력·의지·손재주·매력)의 레벨을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_PROPENSITY_SHAPE,
    );
  }

  /**
   * 어빌리티(등급과 옵션, 프리셋 포함)와 보유 명성치를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_ABILITY_SHAPE,
    );
  }

  /**
   * 장비창의 장착 장비(프리셋 포함, 캐시 장비 제외)를 조회한다. 스타포스·잠재능력·에디셔널 잠재능력·추가 옵션과 칭호가 함께 온다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
   *
   * @example
   * ```ts
   * // 장비 검색 사이트: 부위별 장비 이름, 스타포스, 잠재능력 등급 표시
   * const equip = await client.maplestory.character.getItemEquipment({ ocid });
   * for (const item of equip.item_equipment) {
   *   console.log(
   *     `[${item.item_equipment_part}] ${item.item_name} ★${item.starforce} ${item.potential_option_grade}`,
   *   );
   * }
   * ```
   */
  async getItemEquipment(params: OcidDateRequest): Promise<CharacterItemEquipment> {
    return this.http.get<CharacterItemEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/item-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      CHARACTER_ITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 중인 캐시 장비(코디, 프리셋 포함)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_CASHITEM_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착한 심볼(아케인심볼·어센틱심볼)의 레벨·성장치·증가 스탯을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_SYMBOL_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 적용 중인 세트 효과(세트 이름, 착용 세트 수, 옵션)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_SET_EFFECT_SHAPE,
    );
  }

  /**
   * 헤어·성형·피부(믹스 염색 포함)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_BEAUTY_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 장착 안드로이드(외형·캐시 장비·프리셋)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_ANDROID_EQUIPMENT_SHAPE,
    );
  }
  /**
   * 장착 펫(최대 3마리)과 펫 장비·펫 스킬(자동 버프)을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_PET_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 전직 차수별 스킬 또는 하이퍼 스킬(스킬 레벨·효과)을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
   * @param params.character_skill_grade - 전직 차수 ("0"~"6", "1.5", "2.5") 또는 하이퍼 스킬 ("hyperpassive": 하이퍼 패시브, "hyperactive": 하이퍼 액티브). "5" 는 5차(V매트릭스), "6" 은 6차(HEXA 매트릭스) 스킬
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
      CHARACTER_SKILL_SHAPE,
    );
  }

  /**
   * 장착 링크 스킬(프리셋 포함)과 이 캐릭터가 주는 링크 스킬을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_LINK_SKILL_SHAPE,
    );
  }

  /**
   * V매트릭스(5차)에 장착한 V코어와 슬롯 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_VMATRIX_SHAPE,
    );
  }

  /**
   * HEXA 매트릭스(6차)에 장착한 HEXA 코어(이름·레벨·타입)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_HEXAMATRIX_SHAPE,
    );
  }

  /**
   * HEXA 매트릭스에 설정한 HEXA 스탯(메인·서브 스탯 레벨)을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_HEXAMATRIX_STAT_SHAPE,
    );
  }

  /**
   * 무릉도장 최고 기록(최고 층수와 클리어 시간)을 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_DOJANG_SHAPE,
    );
  }

  /**
   * 다른 조회에서는 확인하기 어려운, 능력치에 영향을 주는 기타 요소를 조회한다.
   *
   * 2025년 8월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_OTHER_STAT_SHAPE,
    );
  }

  /**
   * 링 익스체인지에 등록한 특수 반지를 조회한다.
   *
   * 2025년 8월 21일부터 2026년 3월 18일까지의 데이터만 조회할 수 있습니다.
   * 2026년 3월 19일 이후 날짜는 {@link MapleStoryCharacterClient.getRingReserveSkillEquipment} 를 사용하세요.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
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
      CHARACTER_RING_EXCHANGE_SKILL_EQUIPMENT_SHAPE,
    );
  }

  /**
   * 예비 특수 반지 슬롯에 장착한 특수 반지를 조회한다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 생략하면 가장 최근 데이터(게임 반영까지 평균 15분). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(KST)부터 조회할 수 있다
   *
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonDataNotReadyError} 해당 날짜 데이터 미준비 시
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('캐릭터명');
   * const ring = await client.maplestory.character.getRingReserveSkillEquipment({ ocid });
   * if (ring.special_ring_reserve_name) {
   *   console.log(`${ring.special_ring_reserve_name} Lv.${ring.special_ring_reserve_level}`);
   * }
   * ```
   */
  async getRingReserveSkillEquipment(
    params: OcidDateRequest,
  ): Promise<CharacterRingReserveSkillEquipment> {
    assertNonEmptyString(
      params.ocid,
      'ocid',
      "client.maplestory.getOcid('캐릭터명') 으로 얻은 값을 전달하세요.",
    );
    return this.http.get<CharacterRingReserveSkillEquipment>(
      `${MapleStoryCharacterClient.BASE}/character/ring-reserve-skill-equipment`,
      { ocid: params.ocid, date: params.date as string | undefined },
      CHARACTER_RING_RESERVE_SKILL_EQUIPMENT_SHAPE,
    );
  }
}
