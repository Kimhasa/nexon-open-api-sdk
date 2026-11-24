import type { TWOcidDateRequest } from '../types.js';

// ─── GET /maplestorytw/v1/character/basic ────────────────────────────────────

/** 캐릭터 기본 정보 — `client.maplestoryTW.character.getBasic()` 의 응답. */
export interface TWCharacterBasic {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character name */
  readonly character_name: string;
  /** World name */
  readonly world_name: string;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Character job advancement tier */
  readonly character_class_level: string;
  /** Character level */
  readonly character_level: number;
  /** Experience points gained at the current level */
  readonly character_exp: number;
  /** Percentage of experience points at the current level */
  readonly character_exp_rate: string;
  /** 캐릭터의 길드 이름. 가입한 길드가 없으면 null. */
  readonly character_guild_name: string | null;
  /**
   * Character appearance image URL.
   *
   * Query parameters can modify the character's action or expression:
   * Append a frame index to an action or emotion code, such as `action=A00.2`.
   *
   * - `action`: A00 ~ A41 (default: A00 stand1)
   * - `emotion`: E00 ~ E24 (default: E00)
   * - `wmotion`: W00 ~ W04 (default: W00)
   * - `width`: 96 ~ 1000 (default: 96)
   * - `height`: 96 ~ 1000 (default: 96)
   * - `x`: Horizontal coordinate (0 < x < width)
   * - `y`: Vertical coordinate (0 < y < height)
   */
  readonly character_image: string;
  /** Character creation date (TST, daily data with hours and minutes set to 0) */
  readonly character_date_create: string;
  /** Login status in the past 7 days ("true": logged in, "false": not logged in) */
  readonly access_flag: string;
  /** Liberation Quest completion status ("0": not completed, "1": Genesis Weapon liberated, "2": Destiny Weapon Phase 1 liberated) */
  readonly liberation_quest_clear: string;
}

// ─── GET /maplestorytw/v1/character/popularity ───────────────────────────────

/** 캐릭터 인기도 — `client.maplestoryTW.character.getPopularity()` 의 응답. */
export interface TWCharacterPopularity {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character popularity */
  readonly popularity: number;
}

// ─── GET /maplestorytw/v1/character/stat ─────────────────────────────────────

/** 캐릭터 정보창의 스탯(종합 능력치) — `client.maplestoryTW.character.getStat()` 의 응답. */
export interface TWCharacterStat {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Current stat information */
  readonly final_stat: readonly TWStatDetail[];
  /** Remaining AP */
  readonly remain_ap: number;
  /** Stats granted by the mentorship system. */
  readonly mentorship_stat: readonly TWMentorshipStat[];
}

/** Stat detail element in final_stat array */
export interface TWStatDetail {
  /** Stat name */
  readonly stat_name: string;
  /** Stat value (null for stats without a value) */
  readonly stat_value: string | null;
}

/** Stat granted by the mentorship system. */
export interface TWMentorshipStat {
  /** Stat name. */
  readonly stat_name: string;
  /** Stat value. */
  readonly stat_value: string;
}

// ─── GET /maplestorytw/v1/character/hyper-stat ───────────────────────────────

/** 하이퍼 스탯 — `client.maplestoryTW.character.getHyperStat()` 의 응답. */
export interface TWCharacterHyperStat {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Active preset number */
  readonly use_preset_no: string;
  /** Maximum available Hyper Stat points */
  readonly use_available_hyper_stat: number;
  /** Hyper Stat information for preset 1 */
  readonly hyper_stat_preset_1: readonly TWHyperStatPreset[];
  /** Remaining Hyper Stat points for preset 1 */
  readonly hyper_stat_preset_1_remain_point: number;
  /** Hyper Stat information for preset 2 */
  readonly hyper_stat_preset_2: readonly TWHyperStatPreset[];
  /** Remaining Hyper Stat points for preset 2 */
  readonly hyper_stat_preset_2_remain_point: number;
  /** Hyper Stat information for preset 3 */
  readonly hyper_stat_preset_3: readonly TWHyperStatPreset[];
  /** Remaining Hyper Stat points for preset 3 */
  readonly hyper_stat_preset_3_remain_point: number;
}

/** Hyper Stat preset element */
export interface TWHyperStatPreset {
  /** Stat type */
  readonly stat_type: string;
  /** Stat points to invest */
  readonly stat_point: number | null;
  /** Stat level */
  readonly stat_level: number;
  /** Stat increases */
  readonly stat_increase: string | null;
}

// ─── GET /maplestorytw/v1/character/propensity ───────────────────────────────

/** 성향 — `client.maplestoryTW.character.getPropensity()` 의 응답. */
export interface TWCharacterPropensity {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Ambition level */
  readonly charisma_level: number;
  /** Empathy level */
  readonly sensibility_level: number;
  /** Insight level */
  readonly insight_level: number;
  /** Willpower level */
  readonly willingness_level: number;
  /** Diligence level */
  readonly handicraft_level: number;
  /** Charm level */
  readonly charm_level: number;
}

// ─── GET /maplestorytw/v1/character/ability ──────────────────────────────────

/** 어빌리티 — `client.maplestoryTW.character.getAbility()` 의 응답. */
export interface TWCharacterAbility {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Ability grade */
  readonly ability_grade: string;
  /** Ability information */
  readonly ability_info: readonly TWAbilityInfo[];
  /** Owned Honor EXP */
  readonly remain_fame: number;
  /** Active ability preset number */
  readonly preset_no: number | null;
  /** Complete information for Ability Preset 1 */
  readonly ability_preset_1: TWAbilityPreset | null;
  /** Complete information for Ability Preset 2 */
  readonly ability_preset_2: TWAbilityPreset | null;
  /** Complete information for Ability Preset 3 */
  readonly ability_preset_3: TWAbilityPreset | null;
}

/** Ability info element */
export interface TWAbilityInfo {
  /** Ability number */
  readonly ability_no: string;
  /** Ability grade */
  readonly ability_grade: string;
  /** Ability option and value */
  readonly ability_value: string;
}

/** Ability preset */
export interface TWAbilityPreset {
  /** Ability grade for this preset */
  readonly ability_preset_grade: string;
  /** Ability information for this preset */
  readonly ability_info: readonly TWAbilityInfo[];
}

// ─── GET /maplestorytw/v1/character/item-equipment ───────────────────────────

/** Equipment total option (sum of all options) */
export interface TWItemTotalOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
  readonly boss_damage: string;
  readonly ignore_monster_armor: string;
  readonly all_stat: string;
  readonly damage: string;
  readonly equipment_level_decrease: number;
  readonly max_hp_rate: string;
  readonly max_mp_rate: string;
}

/** Equipment base option */
export interface TWItemBaseOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
  readonly boss_damage: string;
  readonly ignore_monster_armor: string;
  readonly all_stat: string;
  readonly max_hp_rate: string;
  readonly max_mp_rate: string;
  /** Base equipment level */
  readonly base_equipment_level: number;
}

/** Stat bonuses from an exceptional upgrade. */
export interface TWItemExceptionalStats {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
}

/** Exceptional upgrade information on a regular or preset item. */
export interface TWItemExceptionalOption extends TWItemExceptionalStats {
  /** Exceptional upgrade count. */
  readonly exceptional_upgrade: number;
}

/** Equipment add option (bonus stats) */
export interface TWItemAddOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
  readonly boss_damage: string;
  readonly damage: string;
  readonly all_stat: string;
  readonly equipment_level_decrease: number;
}

/** Equipment etc option (scroll/starforce stats) */
export interface TWItemEtcOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
}

/** Equipment details shared by regular, preset, dragon, and mechanic items. */
export interface TWItemEquipmentDetails {
  /** Equipment part name */
  readonly item_equipment_part: string;
  /** Equipment name */
  readonly item_name: string;
  /** Equipment icon */
  readonly item_icon: string;
  /** 장비 설명. 설명이 없으면 null. */
  readonly item_description: string | null;
  /** Equipment appearance name */
  readonly item_shape_name: string;
  /** Equipment appearance icon */
  readonly item_shape_icon: string;
  /** 장비 착용 성별 제한. 제한이 없으면 null. */
  readonly item_gender: string | null;
  /** Total option (sum of all options) */
  readonly item_total_option: TWItemTotalOption;
  /** Base option */
  readonly item_base_option: TWItemBaseOption;
  /** Equipment level increase */
  readonly equipment_level_increase: number;
  /** Add option (bonus stats) */
  readonly item_add_option: TWItemAddOption;
  /** Growth EXP */
  readonly growth_exp: number;
  /** Growth level */
  readonly growth_level: number;
  /** Scroll upgrade count */
  readonly scroll_upgrade: string;
  /** Scissors of Karma usable count (255 = untradeable) */
  readonly cuttable_count: string;
  /** Golden Hammer upgrade status ("true" when applied, "false" otherwise). */
  readonly golden_hammer_flag: string;
  /** Scroll resilience count */
  readonly scroll_resilience_count: string;
  /** 업그레이드 가능 횟수. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 scroll_upgradeable_count로 온다. */
  readonly scroll_upgradable_count?: string | undefined;
  /** 업그레이드 가능 횟수. 실제 응답의 필드. 포털 스펙에는 scroll_upgradable_count로 적혀 있다. */
  readonly scroll_upgradeable_count?: string | undefined;
  /** 장착한 소울 이름. 소울이 없으면 null. */
  readonly soul_name: string | null;
  /** 장착한 소울 옵션. 값이 없으면 null. */
  readonly soul_option: string | null;
  /** 소울웨폰 등급. 값이 없으면 null. */
  readonly soul_weapon_grade: string | null;
  /** 소울웨폰 레벨. 값이 없으면 null. */
  readonly soul_weapon_level: string | null;
  /** 소울웨폰 옵션. 값이 없으면 null. */
  readonly soul_weapon_option: string | null;
  /** 소울웨폰으로 증가한 수치. 값이 없으면 null. */
  readonly soul_weapon_power_increase: string | null;
  /** Etc option (scroll stats) */
  readonly item_etc_option: TWItemEtcOption;
  /** Starforce enhancement level */
  readonly starforce: string;
  /** Enhancement scroll usage ("true" when used, "false" otherwise). */
  readonly starforce_scroll_flag: string;
  /** Starforce option */
  readonly item_starforce_option: TWItemEtcOption;
  /** Special ring level */
  readonly special_ring_level: number;
  /** Equipment expiry date (null = permanent) */
  readonly date_expire: string | null;
  /** Freestyle coupon applied ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Potential grades and lines on regular and preset items. */
export interface TWItemPotentialOptions {
  /** 잠재능력 등급. 잠재능력이 없으면 null. */
  readonly potential_option_grade: string | null;
  /** 에디셔널 잠재능력 등급. 에디셔널 잠재능력이 없으면 null. */
  readonly additional_potential_option_grade: string | null;
  /** 잠재능력 1번째 줄. 해당 줄이 없으면 null. */
  readonly potential_option_1: string | null;
  /** 잠재능력 2번째 줄. 해당 줄이 없으면 null. */
  readonly potential_option_2: string | null;
  /** 잠재능력 3번째 줄. 해당 줄이 없으면 null. */
  readonly potential_option_3: string | null;
  /** 에디셔널 잠재능력 1번째 줄. 해당 줄이 없으면 null. */
  readonly additional_potential_option_1: string | null;
  /** 에디셔널 잠재능력 2번째 줄. 해당 줄이 없으면 null. */
  readonly additional_potential_option_2: string | null;
  /** 에디셔널 잠재능력 3번째 줄. 해당 줄이 없으면 null. */
  readonly additional_potential_option_3: string | null;
}

/** Currently equipped item. */
export interface TWItemEquipment extends TWItemEquipmentDetails, TWItemPotentialOptions {
  /** Slot occupied by the item. */
  readonly item_equipment_slot: string;
  /** Potential seal status ("true" for sealed). */
  readonly potential_option_flag: string;
  /** Additional potential seal status ("true" for sealed). */
  readonly additional_potential_option_flag: string;
  /** Exceptional upgrade information. */
  readonly item_exceptional_option: TWItemExceptionalOption;
}

/** Item in an equipment preset. */
export interface TWPresetItemEquipment extends TWItemEquipmentDetails, TWItemPotentialOptions {
  /** 프리셋 장비 슬롯. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 item_equipment_slot으로 온다. */
  readonly equipment_slot?: string | undefined;
  /** 프리셋 장비 슬롯. 실제 응답의 필드. 포털 스펙에는 equipment_slot으로 적혀 있다. */
  readonly item_equipment_slot?: string | undefined;
  /** 잠재능력 봉인 상태. 포털 스펙에는 없고 실제 응답에 있는 필드 (2026-11-24 실측). */
  readonly potential_option_flag?: string | undefined;
  /** 에디셔널 잠재능력 봉인 상태. 포털 스펙에는 없고 실제 응답에 있는 필드 (2026-11-24 실측). */
  readonly additional_potential_option_flag?: string | undefined;
  /** Exceptional upgrade information. */
  readonly item_exceptional_option: TWItemExceptionalOption;
}

/** Dragon or Mechanic equipment. */
export interface TWClassItemEquipment extends Omit<
  TWItemEquipmentDetails,
  'scroll_upgradeable_count'
> {
  /** 직업 전용 장비의 업그레이드 가능 횟수. */
  readonly scroll_upgradable_count: string;
  readonly item_description: string;
  readonly item_gender: string;
  readonly soul_name: string;
  readonly soul_option: string;
  readonly soul_weapon_grade: string;
  readonly soul_weapon_level: string;
  readonly soul_weapon_option: string;
  readonly soul_weapon_power_increase: string;
  /** Slot occupied by the class item. */
  readonly equipment_slot: string;
  /** Stats from exceptional upgrades. */
  readonly item_exceptional_option: TWItemExceptionalStats;
}

/** Title info */
export interface TWTitleInfo {
  /** Title name */
  readonly title_name: string;
  /** Title icon */
  readonly title_icon: string;
  /** Title description */
  readonly title_description: string;
  /** Title expiry date (null = permanent) */
  readonly date_expire: string | null;
  /** Title option expiry date (TST, "expired" when expired, null when permanent) */
  readonly date_option_expire: string | null;
  /** 칭호 외형 이름. 값이 없으면 null. */
  readonly title_shape_name: string | null;
  /** 칭호 외형 아이콘. 값이 없으면 null. */
  readonly title_shape_icon: string | null;
  /** 칭호 외형 설명. 값이 없으면 null. */
  readonly title_shape_description: string | null;
}

/** Medal shape info */
export interface TWMedalShape {
  readonly medal_shape_name: string;
  readonly medal_shape_icon: string;
  /** 훈장 외형 설명. 설명이 없으면 null. */
  readonly medal_shape_description: string | null;
  readonly medal_shape_changed_name: string;
  readonly medal_shape_changed_icon: string;
  /** 모루로 바꾼 훈장 외형의 설명. 설명이 없으면 null. */
  readonly medal_shape_changed_description: string | null;
}

/** 장착 장비(캐시 장비 제외) — `client.maplestoryTW.character.getItemEquipment()` 의 응답. */
export interface TWCharacterItemEquipment {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Active equipment preset number */
  readonly preset_no: number | null;
  /** Equipped item information */
  readonly item_equipment: readonly TWItemEquipment[];
  /** Preset 1 equipment */
  readonly item_equipment_preset_1: readonly TWPresetItemEquipment[];
  /** Preset 2 equipment */
  readonly item_equipment_preset_2: readonly TWPresetItemEquipment[];
  /** Preset 3 equipment */
  readonly item_equipment_preset_3: readonly TWPresetItemEquipment[];
  /** 장착한 칭호 정보. 장착한 칭호가 없으면 null. */
  readonly title: TWTitleInfo | null;
  /** 훈장 외형 정보. 값이 없으면 null. */
  readonly medal_shape: TWMedalShape | null;
  /** Evan dragon equipment (only for Evan class) */
  readonly dragon_equipment: readonly TWClassItemEquipment[];
  /** Mechanic equipment (only for Mechanic class) */
  readonly mechanic_equipment: readonly TWClassItemEquipment[];
}

// ─── GET /maplestorytw/v1/character/cashitem-equipment ───────────────────────

/** Cash item option info */
export interface TWCashItemOption {
  /** Option type */
  readonly option_type: string;
  /** Option value */
  readonly option_value: string;
}

/** Cash item coloring prism info */
export interface TWCashItemColoringPrism {
  /** Coloring prism color range */
  readonly color_range: string;
  /** Coloring prism hue */
  readonly hue: number;
  /** Coloring prism saturation */
  readonly saturation: number;
  /** Coloring prism brightness */
  readonly value: number;
}

/** Skill granted by a cash item. */
export interface TWCashItemSkill {
  /** Skill name. */
  readonly skill_name: string;
  /** Skill level. */
  readonly skill_level: number;
}

/** Individual cash item equipment info */
export interface TWCashItemEquipmentItem {
  /** Cash equipment part name */
  readonly cash_item_equipment_part: string;
  /** Cash equipment slot position */
  readonly cash_item_equipment_slot: string;
  /** Cash equipment name */
  readonly cash_item_name: string;
  /** Cash equipment icon */
  readonly cash_item_icon: string;
  /** 캐시 장비 설명. 설명이 없으면 null. */
  readonly cash_item_description: string | null;
  /** Cash equipment options */
  readonly cash_item_option: readonly TWCashItemOption[];
  /** Cash equipment expiry date (TST, null = permanent) */
  readonly date_expire: string | null;
  /** Cash equipment option expiry date (TST, null = permanent) */
  readonly date_option_expire: string | null;
  /** 캐시 장비 라벨. 라벨이 없으면 null. */
  readonly cash_item_label: string | null;
  /** Cash equipment coloring prism info (null = not applied) */
  readonly cash_item_coloring_prism: TWCashItemColoringPrism | null;
  /** 캐시 장비 착용 성별 제한. 제한이 없으면 null. */
  readonly item_gender: string | null;
  /** Skill names */
  readonly skills: readonly string[];
  /** Name and level of each skill granted by the cash item. */
  readonly skill_info: readonly TWCashItemSkill[];
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** 장착 캐시 장비 — `client.maplestoryTW.character.getCashItemEquipment()` 의 응답. */
export interface TWCharacterCashItemEquipment {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Character appearance mode ("0": Normal, "1": Beta for Zero / Dress-up for Angelic Buster) */
  readonly character_look_mode: string;
  /** 적용 중인 캐시 장비 프리셋 번호. 적용된 프리셋이 없으면 null. */
  readonly preset_no: number | null;
  /** Equipped cash item info */
  readonly cash_item_equipment_base: readonly TWCashItemEquipmentItem[];
  /** Preset 1 cash item info */
  readonly cash_item_equipment_preset_1: readonly TWCashItemEquipmentItem[];
  /** Preset 2 cash item info */
  readonly cash_item_equipment_preset_2: readonly TWCashItemEquipmentItem[];
  /** Preset 3 cash item info */
  readonly cash_item_equipment_preset_3: readonly TWCashItemEquipmentItem[];
  /** Additional equipped cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_base: readonly TWCashItemEquipmentItem[];
  /** Additional preset 1 cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_preset_1: readonly TWCashItemEquipmentItem[];
  /** Additional preset 2 cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_preset_2: readonly TWCashItemEquipmentItem[];
  /** Additional preset 3 cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_preset_3: readonly TWCashItemEquipmentItem[];
}

// ─── GET /maplestorytw/v1/character/symbol-equipment ─────────────────────────

/** Symbol info element */
export interface TWSymbolInfo {
  /** Symbol name */
  readonly symbol_name: string;
  /** Symbol icon */
  readonly symbol_icon: string;
  /** Symbol description */
  readonly symbol_description: string;
  /** Increase in stats due to the symbol (e.g., Arcane Force) */
  readonly symbol_force: string;
  /** Symbol level */
  readonly symbol_level: number;
  /** STR increase */
  readonly symbol_str: string;
  /** DEX increase */
  readonly symbol_dex: string;
  /** INT increase */
  readonly symbol_int: string;
  /** LUK increase */
  readonly symbol_luk: string;
  /** HP increase */
  readonly symbol_hp: string;
  /** Item drop rate increase (%) */
  readonly symbol_drop_rate: string;
  /** Meso acquisition rate increase (%) */
  readonly symbol_meso_rate: string;
  /** EXP acquisition rate increase (%) */
  readonly symbol_exp_rate: string;
  /** Current growth points */
  readonly symbol_growth_count: number;
  /** Growth points required for the next level */
  readonly symbol_require_growth_count: number;
}

/** 장착 심볼 — `client.maplestoryTW.character.getSymbolEquipment()` 의 응답. */
export interface TWCharacterSymbolEquipment {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Symbol information */
  readonly symbol: readonly TWSymbolInfo[];
}

// ─── GET /maplestorytw/v1/character/set-effect ───────────────────────────────

/** Set item effect level info */
export interface TWSetEffectInfo {
  /** Set Item effect level (number of equipped items) */
  readonly set_count: number;
  /** Set Item effect */
  readonly set_option: string;
}

/** Set item effect detail */
export interface TWSetEffectDetail {
  /** Set Item effect name */
  readonly set_name: string;
  /** Number of Set Items (including Lucky Items) */
  readonly total_set_count: number;
  /** Active Set Item effect information */
  readonly set_effect_info: readonly TWSetEffectInfo[];
  /** All Set Item effect information */
  readonly set_option_full: readonly TWSetEffectInfo[];
}

/** 적용 중인 세트 효과 — `client.maplestoryTW.character.getSetEffect()` 의 응답. */
export interface TWCharacterSetEffect {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Set Item effect information */
  readonly set_effect: readonly TWSetEffectDetail[];
}

// ─── GET /maplestorytw/v1/character/beauty-equipment ─────────────────────────

/** Hair info */
export interface TWHairInfo {
  /** 헤어 이름. 값이 없으면 null. */
  readonly hair_name: string | null;
  /** 기본 헤어 색상. 값이 없으면 null. */
  readonly base_color: string | null;
  /** 믹스염색 색상. 믹스염색이 없으면 null. */
  readonly mix_color: string | null;
  /** Dye ratio for mixed hair color */
  readonly mix_rate: string;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Face info */
export interface TWFaceInfo {
  /** 성형 이름. 값이 없으면 null. */
  readonly face_name: string | null;
  /** 기본 컬러렌즈 색상. 값이 없으면 null. */
  readonly base_color: string | null;
  /** 믹스 컬러렌즈 색상. 믹스 컬러렌즈가 없으면 null. */
  readonly mix_color: string | null;
  /** Dye ratio for mixed face color */
  readonly mix_rate: string;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Skin info */
export interface TWSkinInfo {
  /** Skin name */
  readonly skin_name: string;
  /** 피부 색상 유형. 색상 보정 정보가 없으면 null. */
  readonly color_style: string | null;
  /** 피부 색조. 색상 보정 정보가 없으면 null. */
  readonly hue: number | null;
  /** 피부 채도. 색상 보정 정보가 없으면 null. */
  readonly saturation: number | null;
  /** 피부 밝기. 색상 보정 정보가 없으면 null. */
  readonly brightness: number | null;
}

/** 헤어·성형·피부 — `client.maplestoryTW.character.getBeautyEquipment()` 의 응답. */
export interface TWCharacterBeautyEquipment {
  /** 조회 기준일(대만 시간). 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Character hair info (Normal mode / Alpha mode for Zero) */
  readonly character_hair: TWHairInfo;
  /** Character face info (Normal mode / Alpha mode for Zero) */
  readonly character_face: TWFaceInfo;
  /** Character skin info (Normal mode / Alpha mode for Zero) */
  readonly character_skin: TWSkinInfo;
  /** 제로 베타 모드 또는 엔젤릭버스터 드레스업 모드의 헤어. 해당 외형이 없으면 null. */
  readonly additional_character_hair: TWHairInfo | null;
  /** 제로 베타 모드 또는 엔젤릭버스터 드레스업 모드의 성형. 해당 외형이 없으면 null. */
  readonly additional_character_face: TWFaceInfo | null;
  /** 제로 베타 모드 또는 엔젤릭버스터 드레스업 모드의 피부. 해당 외형이 없으면 null. */
  readonly additional_character_skin: TWSkinInfo | null;
}

// ─── GET /maplestorytw/v1/character/android-equipment ────────────────────────

/** Android cash item equipment info */
export interface TWAndroidCashItem {
  /** Cash item part name */
  readonly cash_item_equipment_part: string;
  /** Cash item slot position */
  readonly cash_item_equipment_slot: string;
  /** Cash item name */
  readonly cash_item_name: string;
  /** Cash item icon */
  readonly cash_item_icon: string;
  /** 캐시 장비 설명. 설명이 없으면 null. */
  readonly cash_item_description: string | null;
  /** Cash item options */
  readonly cash_item_option: readonly TWCashItemOption[];
  /** Cash item expiry date (TST) */
  readonly date_expire: string | null;
  /** Cash item option expiry date (TST) */
  readonly date_option_expire: string | null;
  /** 캐시 장비 라벨. 라벨이 없으면 null. */
  readonly cash_item_label: string | null;
  /** Cash item coloring prism info (null = not applied) */
  readonly cash_item_coloring_prism: TWCashItemColoringPrism | null;
  /** 안드로이드 캐시 장비 착용 성별 제한. 제한이 없으면 null. */
  readonly android_item_gender: string | null;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Android preset info */
export interface TWAndroidPreset {
  /** Android name */
  readonly android_name: string;
  /** Android nickname */
  readonly android_nickname: string;
  /** Android icon */
  readonly android_icon: string;
  /** Android item description */
  readonly android_description: string;
  /** Android gender */
  readonly android_gender: string;
  /** Android grade */
  readonly android_grade: string;
  /** 안드로이드 피부 정보. 값이 없으면 null. */
  readonly android_skin: TWSkinInfo | null;
  /** Android hair info */
  readonly android_hair: TWHairInfo;
  /** Android face info */
  readonly android_face: TWFaceInfo;
  /** Android ear sensor clip status as a string flag. */
  readonly android_ear_sensor_clip_flag: string;
  /** Whether the Android is non-humanoid, encoded as a string flag. */
  readonly android_non_humanoid_flag: string;
  /** Whether the Android can use the general store, encoded as a string flag. */
  readonly android_shop_usable_flag: string;
}

/** 장착 안드로이드 — `client.maplestoryTW.character.getAndroidEquipment()` 의 응답. */
export interface TWCharacterAndroidEquipment {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Android name */
  readonly android_name: string | null;
  /** Android nickname */
  readonly android_nickname: string | null;
  /** Android icon */
  readonly android_icon: string | null;
  /** Android item description */
  readonly android_description: string | null;
  /** Android hair info */
  readonly android_hair: TWHairInfo;
  /** Android face info */
  readonly android_face: TWFaceInfo;
  /** 안드로이드 피부 정보. 값이 없으면 null. */
  readonly android_skin: TWSkinInfo | null;
  /** Android cash item equipment info */
  readonly android_cash_item_equipment: readonly TWAndroidCashItem[];
  /** Android ear sensor clip status as a string flag. */
  readonly android_ear_sensor_clip_flag: string;
  /** Android gender */
  readonly android_gender: string | null;
  /** Android grade */
  readonly android_grade: string | null;
  /** 비인간형 안드로이드 여부. 값이 없으면 null. */
  readonly android_non_humanoid_flag: string | null;
  /** 안드로이드 잡화상점 이용 가능 여부. 값이 없으면 null. */
  readonly android_shop_usable_flag: string | null;
  /** Active equipment preset number */
  readonly preset_no: number;
  /** Android preset 1 info */
  readonly android_preset_1: TWAndroidPreset | null;
  /** Android preset 2 info */
  readonly android_preset_2: TWAndroidPreset | null;
  /** Android preset 3 info */
  readonly android_preset_3: TWAndroidPreset | null;
}

// ─── GET /maplestorytw/v1/character/pet-equipment ────────────────────────────

/** Pet item option */
export interface TWPetItemOption {
  /** Option type */
  readonly option_type: string;
  /** Option value */
  readonly option_value: string;
}

/** Pet equipment info */
export interface TWPetEquipmentInfo {
  /** 펫 장비 이름. 값이 없으면 null. */
  readonly item_name: string | null;
  /** 펫 장비 아이콘. 값이 없으면 null. */
  readonly item_icon: string | null;
  /** 펫 장비 설명. 설명이 없으면 null. */
  readonly item_description: string | null;
  /** Displayed item options */
  readonly item_option: readonly TWPetItemOption[];
  /** Number of upgrades */
  readonly scroll_upgrade: number;
  /** Number of upgrades available */
  readonly scroll_upgradable: number;
  /** 펫 장비 외형 이름. 값이 없으면 null. */
  readonly item_shape: string | null;
  /** 펫 장비 외형 아이콘. 값이 없으면 null. */
  readonly item_shape_icon: string | null;
}

/** Pet auto buff skill info */
export interface TWPetAutoSkill {
  /** Auto skill in the first slot */
  readonly skill_1: string;
  /** Icon for the auto skill in the first slot */
  readonly skill_1_icon: string;
  /** Auto skill in the second slot */
  readonly skill_2: string;
  /** Icon for the auto skill in the second slot */
  readonly skill_2_icon: string;
}

/** Potential line on an equipped pet. */
export interface TWPetPotential {
  /** Potential tier ("1" to "3", or "0" when inactive). */
  readonly potential_step: string;
  /** 펫 잠재능력 종류. 값이 없으면 null. */
  readonly potential_type: string | null;
  /** 펫 잠재능력 1번 증가량. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 potential_increase1로 온다. */
  readonly potential_increase_1?: string | undefined;
  /** 펫 잠재능력 1번 증가량. 값이 없으면 null. 실제 응답의 필드. 포털 스펙에는 potential_increase_1로 적혀 있다. */
  readonly potential_increase1?: string | null | undefined;
  /** 펫 잠재능력 2번 증가량. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 potential_increase2로 온다. */
  readonly potential_increase_2?: string | undefined;
  /** 펫 잠재능력 2번 증가량. 값이 없으면 null. 실제 응답의 필드. 포털 스펙에는 potential_increase_2로 적혀 있다. */
  readonly potential_increase2?: string | null | undefined;
}

/** 장착 펫과 펫 장비·펫 스킬 — `client.maplestoryTW.character.getPetEquipment()` 의 응답. */
export interface TWCharacterPetEquipment {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Name of pet 1 */
  readonly pet_1_name: string | null;
  /** Nickname of pet 1 */
  readonly pet_1_nickname: string | null;
  /** Icon of pet 1 */
  readonly pet_1_icon: string | null;
  /** Description of pet 1 */
  readonly pet_1_description: string | null;
  /** Equipment info for pet 1 */
  readonly pet_1_equipment: TWPetEquipmentInfo | null;
  /** Auto buff skill info for pet 1 */
  readonly pet_1_auto_skill: TWPetAutoSkill | null;
  /** Wonder pet type of pet 1 */
  readonly pet_1_pet_type: string | null;
  /** Skills possessed by pet 1 */
  readonly pet_1_skill: readonly string[] | null;
  /** Pet 1 magic time expiry (TST) */
  readonly pet_1_date_expire: string | null;
  /** Appearance of pet 1 */
  readonly pet_1_appearance: string | null;
  /** Appearance icon of pet 1 */
  readonly pet_1_appearance_icon: string | null;
  /** 1번 펫의 잠재능력. 잠재능력 정보가 없으면 null. */
  readonly pet_1_potential: readonly TWPetPotential[] | null;
  /** Name of pet 2 */
  readonly pet_2_name: string | null;
  /** Nickname of pet 2 */
  readonly pet_2_nickname: string | null;
  /** Icon of pet 2 */
  readonly pet_2_icon: string | null;
  /** Description of pet 2 */
  readonly pet_2_description: string | null;
  /** Equipment info for pet 2 */
  readonly pet_2_equipment: TWPetEquipmentInfo | null;
  /** Auto buff skill info for pet 2 */
  readonly pet_2_auto_skill: TWPetAutoSkill | null;
  /** Wonder pet type of pet 2 */
  readonly pet_2_pet_type: string | null;
  /** Skills possessed by pet 2 */
  readonly pet_2_skill: readonly string[] | null;
  /** Pet 2 magic time expiry (TST) */
  readonly pet_2_date_expire: string | null;
  /** Appearance of pet 2 */
  readonly pet_2_appearance: string | null;
  /** Appearance icon of pet 2 */
  readonly pet_2_appearance_icon: string | null;
  /** 2번 펫의 잠재능력. 잠재능력 정보가 없으면 null. */
  readonly pet_2_potential: readonly TWPetPotential[] | null;
  /** Name of pet 3 */
  readonly pet_3_name: string | null;
  /** Nickname of pet 3 */
  readonly pet_3_nickname: string | null;
  /** Icon of pet 3 */
  readonly pet_3_icon: string | null;
  /** Description of pet 3 */
  readonly pet_3_description: string | null;
  /** Equipment info for pet 3 */
  readonly pet_3_equipment: TWPetEquipmentInfo | null;
  /** Auto buff skill info for pet 3 */
  readonly pet_3_auto_skill: TWPetAutoSkill | null;
  /** Wonder pet type of pet 3 */
  readonly pet_3_pet_type: string | null;
  /** Skills possessed by pet 3 */
  readonly pet_3_skill: readonly string[] | null;
  /** Pet 3 magic time expiry (TST) */
  readonly pet_3_date_expire: string | null;
  /** Appearance of pet 3 */
  readonly pet_3_appearance: string | null;
  /** Appearance icon of pet 3 */
  readonly pet_3_appearance_icon: string | null;
  /** 3번 펫의 잠재능력. 잠재능력 정보가 없으면 null. */
  readonly pet_3_potential: readonly TWPetPotential[] | null;
}

// ─── GET /maplestorytw/v1/character/skill ────────────────────────────────────

export const TW_SKILL_GRADES = [
  '0',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '4',
  'hyperpassive',
  'hyperactive',
  '5',
  '6',
] as const;

/** Skill tier, including Zero's shared (0) and Alpha/Beta (4) skills and Hyper Skills. */
export type TWSkillGrade = (typeof TW_SKILL_GRADES)[number];

/** Skill request parameters. */
export interface TWSkillRequest extends TWOcidDateRequest {
  /** Character job advancement tier or Hyper Skill category. */
  readonly character_skill_grade: TWSkillGrade;
}

/** Skill info element */
export interface TWSkillInfo {
  /** Skill name */
  readonly skill_name: string;
  /** Skill description */
  readonly skill_description: string;
  /** Skill level */
  readonly skill_level: number;
  /** Effect description by skill level */
  readonly skill_effect: string;
  /** 다음 레벨 스킬 효과. 다음 레벨 효과가 없으면 null. */
  readonly skill_effect_next: string | null;
  /** Skill icon */
  readonly skill_icon: string;
}

/** 전직 차수별 스킬 — `client.maplestoryTW.character.getSkill()` 의 응답. */
export interface TWCharacterSkill {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Job advancement tier */
  readonly character_skill_grade: string;
  /** Skill information */
  readonly character_skill: readonly TWSkillInfo[];
}

// ─── GET /maplestorytw/v1/character/link-skill ───────────────────────────────

/** Link Skill info element (with skill_effect_next) */
export interface TWLinkSkillInfo {
  /** Skill name */
  readonly skill_name: string;
  /** Skill description */
  readonly skill_description: string;
  /** Skill level */
  readonly skill_level: number;
  /** Skill effect */
  readonly skill_effect: string;
  /** 다음 레벨 링크 스킬 효과. 다음 레벨 효과가 없으면 null. */
  readonly skill_effect_next: string | null;
  /** Skill icon */
  readonly skill_icon: string;
}

/** Link Skill preset info element (no skill_effect_next) */
export interface TWLinkSkillPresetInfo {
  /** Skill name */
  readonly skill_name: string;
  /** Skill description */
  readonly skill_description: string;
  /** Skill level */
  readonly skill_level: number;
  /** Skill effect */
  readonly skill_effect: string;
  /** Skill icon */
  readonly skill_icon: string;
}

/** 링크 스킬 — `client.maplestoryTW.character.getLinkSkill()` 의 응답. */
export interface TWCharacterLinkSkill {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Link Skill information */
  readonly character_link_skill: readonly TWLinkSkillInfo[];
  /** Link Skill preset 1 */
  readonly character_link_skill_preset_1: readonly TWLinkSkillPresetInfo[];
  /** Link Skill preset 2 */
  readonly character_link_skill_preset_2: readonly TWLinkSkillPresetInfo[];
  /** Link Skill preset 3 */
  readonly character_link_skill_preset_3: readonly TWLinkSkillPresetInfo[];
  /** My Link Skill information */
  readonly character_owned_link_skill: TWLinkSkillPresetInfo | null;
  /** My Link Skill preset 1 */
  readonly character_owned_link_skill_preset_1: TWLinkSkillPresetInfo | null;
  /** My Link Skill preset 2 */
  readonly character_owned_link_skill_preset_2: TWLinkSkillPresetInfo | null;
  /** My Link Skill preset 3 */
  readonly character_owned_link_skill_preset_3: TWLinkSkillPresetInfo | null;
}

// ─── GET /maplestorytw/v1/character/vmatrix ──────────────────────────────────

/** V Matrix Node info element */
export interface TWVCoreInfo {
  /** Slot index */
  readonly slot_id: string;
  /** Slot level */
  readonly slot_level: number;
  /** V코어 이름. 슬롯에 코어가 없으면 null. */
  readonly v_core_name: string | null;
  /** V코어 종류. 슬롯에 코어가 없으면 null. */
  readonly v_core_type: string | null;
  /** Node level */
  readonly v_core_level: number;
  /** 코어의 첫 번째 스킬 이름. 해당 스킬이 없으면 null. */
  readonly v_core_skill_1: string | null;
  /** 코어의 두 번째 스킬 이름. 해당 스킬이 없으면 null. */
  readonly v_core_skill_2: string | null;
  /** 코어의 세 번째 스킬 이름. 해당 스킬이 없으면 null. */
  readonly v_core_skill_3: string | null;
}

/** V매트릭스(5차) — `client.maplestoryTW.character.getVMatrix()` 의 응답. */
export interface TWCharacterVMatrix {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** V Matrix Node information */
  readonly character_v_core_equipment: readonly TWVCoreInfo[];
  /** Remaining Matrix enhancement points */
  readonly character_v_matrix_remain_slot_upgrade_point: number;
}

// ─── GET /maplestorytw/v1/character/hexamatrix ───────────────────────────────

/** HEXA linked skill */
export interface TWHexaLinkedSkill {
  /** HEXA Skill name */
  readonly hexa_skill_id: string;
}

/** HEXA Node info element */
export interface TWHexaCoreInfo {
  /** Node name */
  readonly hexa_core_name: string;
  /** Node level */
  readonly hexa_core_level: number;
  /** Node type */
  readonly hexa_core_type: string;
  /** Linked skills */
  readonly linked_skill: readonly TWHexaLinkedSkill[];
}

/** HEXA 매트릭스(6차)의 HEXA 코어 — `client.maplestoryTW.character.getHexaMatrix()` 의 응답. */
export interface TWCharacterHexaMatrix {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** 장착한 HEXA 코어 정보. 값이 없으면 null. */
  readonly character_hexa_core_equipment: readonly TWHexaCoreInfo[] | null;
}

// ─── GET /maplestorytw/v1/character/hexamatrix-stat ──────────────────────────

/** HEXA Stat core info element */
export interface TWHexaStatCoreInfo {
  /** Slot index */
  readonly slot_id: string;
  /** HEXA 스탯 코어의 메인 스탯 이름. 선택한 스탯이 없으면 null. */
  readonly main_stat_name: string | null;
  /** HEXA 스탯 코어의 첫 번째 추가 스탯 이름. 선택한 스탯이 없으면 null. */
  readonly sub_stat_name_1: string | null;
  /** HEXA 스탯 코어의 두 번째 추가 스탯 이름. 선택한 스탯이 없으면 null. */
  readonly sub_stat_name_2: string | null;
  /** Main Stat level */
  readonly main_stat_level: number;
  /** First sub stat level */
  readonly sub_stat_level_1: number;
  /** Second sub stat level */
  readonly sub_stat_level_2: number;
  /** Stat core level */
  readonly stat_grade: number;
}

/** HEXA 스탯 — `client.maplestoryTW.character.getHexaMatrixStat()` 의 응답. */
export interface TWCharacterHexaMatrixStat {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** HEXA 스탯에 기록된 캐릭터 직업. 값이 없으면 null. */
  readonly character_class: string | null;
  /** HEXA Stat Node I information */
  readonly character_hexa_stat_core: readonly TWHexaStatCoreInfo[];
  /** HEXA 스탯 코어 II 정보. 값이 없으면 null. */
  readonly character_hexa_stat_core_2: readonly TWHexaStatCoreInfo[] | null;
  /** HEXA 스탯 코어 III 정보. 값이 없으면 null. */
  readonly character_hexa_stat_core_3: readonly TWHexaStatCoreInfo[] | null;
  /** Preset HEXA Stat Node I information */
  readonly preset_hexa_stat_core: readonly TWHexaStatCoreInfo[];
  /** 프리셋의 HEXA 스탯 코어 II 정보. 값이 없으면 null. */
  readonly preset_hexa_stat_core_2: readonly TWHexaStatCoreInfo[] | null;
  /** 프리셋의 HEXA 스탯 코어 III 정보. 값이 없으면 null. */
  readonly preset_hexa_stat_core_3: readonly TWHexaStatCoreInfo[] | null;
}

// ─── GET /maplestorytw/v1/character/dojang ───────────────────────────────────

/** 무릉도장 최고 기록 — `client.maplestoryTW.character.getDojang()` 의 응답. */
export interface TWCharacterDojang {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** World name */
  readonly world_name: string;
  /** Highest floor record in Mu Lung Dojo */
  readonly dojang_best_floor: number;
  /** Achievement date of the highest record (TST) */
  readonly date_dojang_record: string | null;
  /** Time taken to clear the highest floor (in seconds) */
  readonly dojang_best_time: number;
}

// GET /maplestorytw/v1/character/familiar

/** Familiar link slot. */
export interface TWFamiliarLinkSlot {
  /** Slot identifier ("1", "2", "3", or "vip"). */
  readonly slot_id: string;
  /** Linked Familiar name, or null if the slot is empty. */
  readonly familiar_name: string | null;
  /** Whether the link slot is active ("true" or "false"). */
  readonly active_flag: string;
  /** 패밀리어 연결 슬롯의 만료 날짜. 만료 정보가 없으면 null. */
  readonly expire_date: string | null;
}

/** Familiar option. */
export interface TWFamiliarOption {
  /** Option number. */
  readonly option_no: number;
  /** Option name. */
  readonly option_name: string;
  /** Option value. */
  readonly option_value: string;
}

/** Familiar details. */
export interface TWFamiliarInfo {
  /** Familiar name. */
  readonly familiar_name: string;
  /** Familiar nickname. */
  readonly familiar_nickname: string;
  /** Whether the Familiar is special, encoded as a string flag. */
  readonly familiar_special_flag: string;
  /** Familiar state. */
  readonly familiar_state: string;
  /** Familiar level. */
  readonly familiar_level: number;
  /** Familiar experience. */
  readonly familiar_exp: number;
  /** 패밀리어가 배운 스킬 이름. 배운 스킬이 없으면 null. */
  readonly skill_name: string | null;
  /** Level of the Familiar's options. */
  readonly option_level: number;
  /** Familiar options. */
  readonly option: readonly TWFamiliarOption[];
  /** 패밀리어 등급. 값이 없으면 null. */
  readonly familiar_grade: string | null;
  /** 패밀리어 외형 이름. 값이 없으면 null. */
  readonly look_name: string | null;
  /** Whether the Familiar is summoned, encoded as a string flag. */
  readonly summoned_flag: string;
  /** Link slot identifier ("1", "2", "3", "vip", or "not link"). */
  readonly slot_id: string;
}

/** 패밀리어(萌獸) — `client.maplestoryTW.character.getFamiliar()` 의 응답. */
export interface TWCharacterFamiliar {
  /** 조회 기준일(대만 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Familiar link slots. */
  readonly familiar_link_slot: readonly TWFamiliarLinkSlot[];
  /** Familiar details. */
  readonly familiar_info: readonly TWFamiliarInfo[];
}
