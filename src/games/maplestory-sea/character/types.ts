import type { OcidDateRequest } from '../../_base/maple-base-types.js';

// ─── GET /maplestorysea/v1/character/basic ────────────────────────────────────

/** 캐릭터 기본 정보 — `client.maplestorySEA.character.getBasic()` 의 응답. */
export interface SEACharacterBasic {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
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
  /** Guild name the character belongs to */
  readonly character_guild_name: string;
  /**
   * Character appearance image URL.
   *
   * Query parameters can modify the character's action or expression:
   * - `action`: A00 ~ A41 (default: A00 stand1)
   * - `emotion`: E00 ~ E24 (default: E00)
   * - `wmotion`: W00 ~ W04 (default: W00)
   * - `width`: 96 ~ 1000 (default: 96)
   * - `height`: 96 ~ 1000 (default: 96)
   * - `x`: Horizontal coordinate (0 < x < width)
   * - `y`: Vertical coordinate (0 < y < height)
   */
  readonly character_image: string;
  /** Character creation date (SGT, daily data with hours and minutes set to 0) */
  readonly character_date_create: string;
  /** Login status in the past 7 days ("true": logged in, "false": not logged in) */
  readonly access_flag: string;
  /**
   * Liberation Quest completion status ("true": completed, "false": not completed).
   *
   * @deprecated Will be removed from MapleStory OpenAPI after January 2026.
   * Use {@link liberation_quest_clear} instead.
   */
  readonly liberation_quest_clear_flag: string;
  /** Liberation Quest completion status ("0": not completed, "1": Genesis Weapon liberated, "2": Destiny Weapon Phase 1 liberated) */
  readonly liberation_quest_clear: string;
}

// ─── GET /maplestorysea/v1/character/popularity ───────────────────────────────

/** 캐릭터 인기도 — `client.maplestorySEA.character.getPopularity()` 의 응답. */
export interface SEACharacterPopularity {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character popularity */
  readonly popularity: number;
}

// ─── GET /maplestorysea/v1/character/stat ─────────────────────────────────────

/** 캐릭터 정보창의 스탯(종합 능력치) — `client.maplestorySEA.character.getStat()` 의 응답. */
export interface SEACharacterStat {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Current stat information */
  readonly final_stat: readonly SEAStatDetail[];
  /** Remaining AP */
  readonly remain_ap: number;
  /** Mentorship system stat information */
  readonly mentorship_stat?: readonly SEAStatDetail[] | undefined;
}

/** Stat detail element in final_stat array */
export interface SEAStatDetail {
  /** Stat name */
  readonly stat_name: string;
  /** Stat value (null for stats without a value) */
  readonly stat_value: string | null;
}

// ─── GET /maplestorysea/v1/character/hyper-stat ───────────────────────────────

/** 하이퍼 스탯 — `client.maplestorySEA.character.getHyperStat()` 의 응답. */
export interface SEACharacterHyperStat {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Active preset number */
  readonly use_preset_no: string;
  /** Maximum available Hyper Stat points */
  readonly use_available_hyper_stat: number;
  /** Hyper Stat information for preset 1 */
  readonly hyper_stat_preset_1: readonly SEAHyperStatPreset[];
  /** Remaining Hyper Stat points for preset 1 */
  readonly hyper_stat_preset_1_remain_point: number;
  /** Hyper Stat information for preset 2 */
  readonly hyper_stat_preset_2: readonly SEAHyperStatPreset[];
  /** Remaining Hyper Stat points for preset 2 */
  readonly hyper_stat_preset_2_remain_point: number;
  /** Hyper Stat information for preset 3 */
  readonly hyper_stat_preset_3: readonly SEAHyperStatPreset[];
  /** Remaining Hyper Stat points for preset 3 */
  readonly hyper_stat_preset_3_remain_point: number;
}

/** Hyper Stat preset element */
export interface SEAHyperStatPreset {
  /** Stat type */
  readonly stat_type: string;
  /** Stat points to invest */
  readonly stat_point: number | null;
  /** Stat level */
  readonly stat_level: number;
  /** Stat increases */
  readonly stat_increase: string | null;
}

// ─── GET /maplestorysea/v1/character/propensity ───────────────────────────────

/** 성향 — `client.maplestorySEA.character.getPropensity()` 의 응답. */
export interface SEACharacterPropensity {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
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

// ─── GET /maplestorysea/v1/character/ability ──────────────────────────────────

/** 어빌리티 — `client.maplestorySEA.character.getAbility()` 의 응답. */
export interface SEACharacterAbility {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Ability grade */
  readonly ability_grade: string;
  /** Ability information */
  readonly ability_info: readonly SEAAbilityInfo[];
  /** Owned Honor EXP */
  readonly remain_fame: number;
  /** Active ability preset number */
  readonly preset_no: number | null;
  /** Complete information for Ability Preset 1 */
  readonly ability_preset_1: SEAAbilityPreset | null;
  /** Complete information for Ability Preset 2 */
  readonly ability_preset_2: SEAAbilityPreset | null;
  /** Complete information for Ability Preset 3 */
  readonly ability_preset_3: SEAAbilityPreset | null;
}

/** Ability info element */
export interface SEAAbilityInfo {
  /** Ability number */
  readonly ability_no: string;
  /** Ability grade */
  readonly ability_grade: string;
  /** Ability option and value */
  readonly ability_value: string;
}

/** Ability preset */
export interface SEAAbilityPreset {
  /** Ability grade for this preset */
  readonly ability_preset_grade: string;
  /** Ability information for this preset */
  readonly ability_info: readonly SEAAbilityInfo[];
}

// ─── GET /maplestorysea/v1/character/item-equipment ───────────────────────────

/** Equipment total option (sum of all options) */
export interface SEAItemTotalOption {
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
export interface SEAItemBaseOption {
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

/** Equipment exceptional option */
export interface SEAItemExceptionalOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  /** Exceptional upgrade count */
  readonly exceptional_upgrade?: number | undefined;
}

/** Equipment add option (bonus stats) */
export interface SEAItemAddOption {
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
export interface SEAItemEtcOption {
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

/** Equipped item info (main equipment, uses item_equipment_slot) */
export interface SEAItemEquipment {
  /** Equipment part name */
  readonly item_equipment_part: string;
  /** Equipment slot position */
  readonly item_equipment_slot: string;
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
  readonly item_total_option: SEAItemTotalOption;
  /** Base option */
  readonly item_base_option: SEAItemBaseOption;
  /** Potential option seal status ("true": sealed) */
  readonly potential_option_flag: string;
  /** Additional potential option seal status */
  readonly additional_potential_option_flag: string;
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
  /** Equipment level increase */
  readonly equipment_level_increase: number;
  /** Exceptional option */
  readonly item_exceptional_option: SEAItemExceptionalOption;
  /** Add option (bonus stats) */
  readonly item_add_option: SEAItemAddOption;
  /** Growth EXP */
  readonly growth_exp: number;
  /** Growth level */
  readonly growth_level: number;
  /** Scroll upgrade count */
  readonly scroll_upgrade: string;
  /** Scissors of Karma usable count (255 = untradeable) */
  readonly cuttable_count: string;
  /** Golden Hammer applied ("1": applied) */
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
  /** Etc option (scroll stats) */
  readonly item_etc_option: SEAItemEtcOption;
  /** Starforce enhancement level */
  readonly starforce: string;
  /** Starforce scroll flag ("0": not used, "1": used) */
  readonly starforce_scroll_flag: string;
  /** Starforce option */
  readonly item_starforce_option: SEAItemEtcOption;
  /** Special ring level */
  readonly special_ring_level: number;
  /** Equipment expiry date (null = permanent) */
  readonly date_expire: string | null;
  /** Freestyle coupon applied ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** 장비 프리셋의 장비 정보. */
export interface SEAPresetItemEquipment {
  readonly item_equipment_part: string;
  /** 프리셋 장비 슬롯. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 item_equipment_slot으로 온다. */
  readonly equipment_slot?: string | undefined;
  /** 프리셋 장비 슬롯. 실제 응답의 필드. 포털 스펙에는 equipment_slot으로 적혀 있다. */
  readonly item_equipment_slot?: string | undefined;
  /** 잠재능력 봉인 상태. 포털 스펙에는 없고 실제 응답에 있는 필드 (2026-11-24 실측). */
  readonly potential_option_flag?: string | undefined;
  /** 에디셔널 잠재능력 봉인 상태. 포털 스펙에는 없고 실제 응답에 있는 필드 (2026-11-24 실측). */
  readonly additional_potential_option_flag?: string | undefined;
  readonly item_name: string;
  readonly item_icon: string;
  /** 장비 설명. 설명이 없으면 null. */
  readonly item_description: string | null;
  readonly item_shape_name: string;
  readonly item_shape_icon: string;
  /** 장비 착용 성별 제한. 제한이 없으면 null. */
  readonly item_gender: string | null;
  readonly item_total_option: SEAItemTotalOption;
  readonly item_base_option: SEAItemBaseOption;
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
  readonly equipment_level_increase: number;
  readonly item_exceptional_option: SEAItemExceptionalOption;
  readonly item_add_option: SEAItemAddOption;
  readonly growth_exp: number;
  readonly growth_level: number;
  readonly scroll_upgrade: string;
  readonly cuttable_count: string;
  readonly golden_hammer_flag: string;
  readonly scroll_resilience_count: string;
  /** 업그레이드 가능 횟수. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 scroll_upgradeable_count로 온다. */
  readonly scroll_upgradable_count?: string | undefined;
  /** 업그레이드 가능 횟수. 실제 응답의 필드. 포털 스펙에는 scroll_upgradable_count로 적혀 있다. */
  readonly scroll_upgradeable_count?: string | undefined;
  /** 장착한 소울 이름. 소울이 없으면 null. */
  readonly soul_name: string | null;
  /** 장착한 소울 옵션. 값이 없으면 null. */
  readonly soul_option: string | null;
  readonly item_etc_option: SEAItemEtcOption;
  readonly starforce: string;
  readonly starforce_scroll_flag: string;
  readonly item_starforce_option: SEAItemEtcOption;
  readonly special_ring_level: number;
  readonly date_expire: string | null;
  readonly freestyle_flag: string;
}

/** Exceptional options on Evan dragon or Mechanic equipment. */
interface SEAClassItemExceptionalOption extends SEAItemExceptionalOption {
  /** @deprecated The portal omits the upgrade count for class equipment. */
  readonly exceptional_upgrade?: number | undefined;
}

/** Evan dragon or Mechanic equipment. */
export interface SEAClassItemEquipment extends Omit<
  SEAPresetItemEquipment,
  | 'item_equipment_slot'
  | 'scroll_upgradeable_count'
  | 'potential_option_flag'
  | 'additional_potential_option_flag'
  | 'potential_option_grade'
  | 'additional_potential_option_grade'
  | 'potential_option_1'
  | 'potential_option_2'
  | 'potential_option_3'
  | 'additional_potential_option_1'
  | 'additional_potential_option_2'
  | 'additional_potential_option_3'
> {
  /** 직업 전용 장비 슬롯. */
  readonly equipment_slot: string;
  /** 직업 전용 장비의 업그레이드 가능 횟수. */
  readonly scroll_upgradable_count: string;
  readonly item_description: string;
  readonly item_gender: string;
  readonly soul_name: string;
  readonly soul_option: string;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly potential_option_grade?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly additional_potential_option_grade?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly potential_option_1?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly potential_option_2?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly potential_option_3?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly additional_potential_option_1?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly additional_potential_option_2?: string | undefined;
  /** @deprecated The portal omits potential options for class equipment. */
  readonly additional_potential_option_3?: string | undefined;
  readonly item_exceptional_option: SEAClassItemExceptionalOption;
}

/** Title info */
export interface SEATitleInfo {
  /** Title name */
  readonly title_name: string;
  /** Title icon */
  readonly title_icon: string;
  /** Title description */
  readonly title_description: string;
  /** Title expiry date (null = permanent) */
  readonly date_expire: string | null;
  /** Title option expiry date */
  readonly date_option_expire: string | null;
  /** Title appearance name */
  readonly title_shape_name: string;
  /** Title appearance icon */
  readonly title_shape_icon: string;
  /** Title appearance description */
  readonly title_shape_description: string;
}

/** Medal shape info */
export interface SEAMedalShape {
  readonly medal_shape_name: string;
  readonly medal_shape_icon: string;
  readonly medal_shape_description: string;
  readonly medal_shape_changed_name: string;
  readonly medal_shape_changed_icon: string;
  readonly medal_shape_changed_description: string;
}

/** 장착 장비(캐시 장비 제외) — `client.maplestorySEA.character.getItemEquipment()` 의 응답. */
export interface SEACharacterItemEquipment {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Active equipment preset number */
  readonly preset_no: number | null;
  /** Equipped item information */
  readonly item_equipment: readonly SEAItemEquipment[];
  /** Preset 1 equipment */
  readonly item_equipment_preset_1: readonly SEAPresetItemEquipment[];
  /** Preset 2 equipment */
  readonly item_equipment_preset_2: readonly SEAPresetItemEquipment[];
  /** Preset 3 equipment */
  readonly item_equipment_preset_3: readonly SEAPresetItemEquipment[];
  /** Title info */
  readonly title: SEATitleInfo;
  /** Medal shape info */
  readonly medal_shape: SEAMedalShape;
  /** Evan dragon equipment (only for Evan class) */
  readonly dragon_equipment: readonly SEAClassItemEquipment[];
  /** Mechanic equipment (only for Mechanic class) */
  readonly mechanic_equipment: readonly SEAClassItemEquipment[];
}

// ─── GET /maplestorysea/v1/character/cashitem-equipment ───────────────────────

/** Cash item option info */
export interface SEACashItemOption {
  /** Option type */
  readonly option_type: string;
  /** Option value */
  readonly option_value: string;
}

/** Cash item coloring prism info */
export interface SEACashItemColoringPrism {
  /** Coloring prism color range */
  readonly color_range: string;
  /** Coloring prism hue */
  readonly hue: number;
  /** Coloring prism saturation */
  readonly saturation: number;
  /** Coloring prism brightness */
  readonly value: number;
}

/** Skill granted by a cash equipment item */
export interface SEACashItemSkillInfo {
  /** Skill name */
  readonly skill_name: string;
  /** Skill level */
  readonly skill_level: number;
}

/** Individual cash item equipment info */
export interface SEACashItemEquipmentItem {
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
  readonly cash_item_option: readonly SEACashItemOption[];
  /** Cash equipment expiry date (SGT, null = permanent) */
  readonly date_expire: string | null;
  /** Cash equipment option expiry date (SGT, null = permanent) */
  readonly date_option_expire: string | null;
  /** 캐시 장비 라벨. 라벨이 없으면 null. */
  readonly cash_item_label: string | null;
  /** Cash equipment coloring prism info (null = not applied) */
  readonly cash_item_coloring_prism: SEACashItemColoringPrism | null;
  /** 캐시 장비 착용 성별 제한. 제한이 없으면 null. */
  readonly item_gender: string | null;
  /** @deprecated Use skill_info for skill names and levels. */
  readonly skills?: readonly string[] | undefined;
  /** Skill information granted to the cash equipment */
  readonly skill_info?: readonly SEACashItemSkillInfo[] | undefined;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** 장착 캐시 장비 — `client.maplestorySEA.character.getCashItemEquipment()` 의 응답. */
export interface SEACharacterCashItemEquipment {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Character appearance mode ("0": Normal, "1": Beta for Zero / Dress-up for Angelic Buster) */
  readonly character_look_mode: string;
  /** Active cash item preset number */
  readonly preset_no: number;
  /** Equipped cash item info */
  readonly cash_item_equipment_base: readonly SEACashItemEquipmentItem[];
  /** Preset 1 cash item info */
  readonly cash_item_equipment_preset_1: readonly SEACashItemEquipmentItem[];
  /** Preset 2 cash item info */
  readonly cash_item_equipment_preset_2: readonly SEACashItemEquipmentItem[];
  /** Preset 3 cash item info */
  readonly cash_item_equipment_preset_3: readonly SEACashItemEquipmentItem[];
  /** Additional equipped cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_base: readonly SEACashItemEquipmentItem[];
  /** Additional preset 1 cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_preset_1: readonly SEACashItemEquipmentItem[];
  /** Additional preset 2 cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_preset_2: readonly SEACashItemEquipmentItem[];
  /** Additional preset 3 cash item info (Zero/Angelic Buster) */
  readonly additional_cash_item_equipment_preset_3: readonly SEACashItemEquipmentItem[];
}

// ─── GET /maplestorysea/v1/character/symbol-equipment ─────────────────────────

/** Symbol info element */
export interface SEASymbolInfo {
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

/** 장착 심볼 — `client.maplestorySEA.character.getSymbolEquipment()` 의 응답. */
export interface SEACharacterSymbolEquipment {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Symbol information */
  readonly symbol: readonly SEASymbolInfo[];
}

// ─── GET /maplestorysea/v1/character/set-effect ───────────────────────────────

/** Set item effect level info */
export interface SEASetEffectInfo {
  /** Set Item effect level (number of equipped items) */
  readonly set_count: number;
  /** Set Item effect */
  readonly set_option: string;
}

/** Set item effect detail */
export interface SEASetEffectDetail {
  /** Set Item effect name */
  readonly set_name: string;
  /** Number of Set Items (including Lucky Items) */
  readonly total_set_count: number;
  /** Active Set Item effect information */
  readonly set_effect_info: readonly SEASetEffectInfo[];
  /** All Set Item effect information */
  readonly set_option_full: readonly SEASetEffectInfo[];
}

/** 적용 중인 세트 효과 — `client.maplestorySEA.character.getSetEffect()` 의 응답. */
export interface SEACharacterSetEffect {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Set Item effect information */
  readonly set_effect: readonly SEASetEffectDetail[];
}

// ─── GET /maplestorysea/v1/character/beauty-equipment ─────────────────────────

/** Hair info */
export interface SEAHairInfo {
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
export interface SEAFaceInfo {
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
export interface SEASkinInfo {
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

/** 헤어·성형·피부 — `client.maplestorySEA.character.getBeautyEquipment()` 의 응답. */
export interface SEACharacterBeautyEquipment {
  /** 조회 기준일(싱가포르 시간). 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Character hair info (Normal mode / Alpha mode for Zero) */
  readonly character_hair: SEAHairInfo;
  /** Character face info (Normal mode / Alpha mode for Zero) */
  readonly character_face: SEAFaceInfo;
  /** Character skin info (Normal mode / Alpha mode for Zero) */
  readonly character_skin: SEASkinInfo;
  /** 제로 베타 모드 또는 엔젤릭버스터 드레스업 모드의 헤어. 해당 외형이 없으면 null. */
  readonly additional_character_hair: SEAHairInfo | null;
  /** 제로 베타 모드 또는 엔젤릭버스터 드레스업 모드의 성형. 해당 외형이 없으면 null. */
  readonly additional_character_face: SEAFaceInfo | null;
  /** 제로 베타 모드 또는 엔젤릭버스터 드레스업 모드의 피부. 해당 외형이 없으면 null. */
  readonly additional_character_skin: SEASkinInfo | null;
}

// ─── GET /maplestorysea/v1/character/android-equipment ────────────────────────

/** Android cash item equipment info */
export interface SEAAndroidCashItem {
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
  readonly cash_item_option: readonly SEACashItemOption[];
  /** Cash item expiry date (SGT) */
  readonly date_expire: string | null;
  /** Cash item option expiry date (SGT) */
  readonly date_option_expire: string | null;
  /** 캐시 장비 라벨. 라벨이 없으면 null. */
  readonly cash_item_label: string | null;
  /** Cash item coloring prism info (null = not applied) */
  readonly cash_item_coloring_prism: SEACashItemColoringPrism | null;
  /** 안드로이드 캐시 장비 착용 성별 제한. 제한이 없으면 null. */
  readonly android_item_gender: string | null;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Android preset info */
export interface SEAAndroidPreset {
  /** Android name */
  readonly android_name: string;
  /** Android nickname */
  readonly android_nickname: string;
  /** Android icon */
  readonly android_icon: string;
  /** 프리셋 안드로이드 설명. 설명이 없으면 null. */
  readonly android_description: string | null;
  /** Android gender */
  readonly android_gender: string;
  /** Android grade */
  readonly android_grade: string;
  /** 안드로이드 피부 정보. 값이 없으면 null. */
  readonly android_skin: SEASkinInfo | null;
  /** Android hair info */
  readonly android_hair: SEAHairInfo;
  /** Android face info */
  readonly android_face: SEAFaceInfo;
  /** Whether the Android ear sensor clip is applied */
  readonly android_ear_sensor_clip_flag: string;
  /** Whether the Android is non-humanoid */
  readonly android_non_humanoid_flag: string;
  /** Whether the Android can use the general store */
  readonly android_shop_usable_flag: string;
}

/** 장착 안드로이드 — `client.maplestorySEA.character.getAndroidEquipment()` 의 응답. */
export interface SEACharacterAndroidEquipment {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
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
  readonly android_hair: SEAHairInfo;
  /** Android face info */
  readonly android_face: SEAFaceInfo;
  /** Android skin info */
  readonly android_skin: SEASkinInfo;
  /** Android cash item equipment info */
  readonly android_cash_item_equipment: readonly SEAAndroidCashItem[];
  /** Whether the Android ear sensor clip is applied */
  readonly android_ear_sensor_clip_flag: string;
  /** Android gender */
  readonly android_gender: string | null;
  /** Android grade */
  readonly android_grade: string | null;
  /** Whether the Android is non-humanoid */
  readonly android_non_humanoid_flag: string;
  /** Whether the Android can use the general store */
  readonly android_shop_usable_flag: string;
  /** Active equipment preset number */
  readonly preset_no: number;
  /** Android preset 1 info */
  readonly android_preset_1: SEAAndroidPreset | null;
  /** Android preset 2 info */
  readonly android_preset_2: SEAAndroidPreset | null;
  /** Android preset 3 info */
  readonly android_preset_3: SEAAndroidPreset | null;
}

// ─── GET /maplestorysea/v1/character/pet-equipment ────────────────────────────

/** Pet item option */
export interface SEAPetItemOption {
  /** Option type */
  readonly option_type: string;
  /** Option value */
  readonly option_value: string;
}

/** Pet equipment info */
export interface SEAPetEquipmentInfo {
  /** Item name */
  readonly item_name: string;
  /** Item icon */
  readonly item_icon: string;
  /** Item description */
  readonly item_description: string;
  /** Displayed item options */
  readonly item_option: readonly SEAPetItemOption[];
  /** Number of upgrades */
  readonly scroll_upgrade: number;
  /** Number of upgrades available */
  readonly scroll_upgradable: number;
  /** Item appearance */
  readonly item_shape: string;
  /** Item appearance icon */
  readonly item_shape_icon: string;
}

/** Pet auto buff skill info */
export interface SEAPetAutoSkill {
  /** 펫 자동 스킬 첫 번째 슬롯의 스킬 이름. 슬롯이 비어 있으면 null. */
  readonly skill_1: string | null;
  /** 펫 자동 스킬 첫 번째 슬롯의 스킬 아이콘. 슬롯이 비어 있으면 null. */
  readonly skill_1_icon: string | null;
  /** Auto skill in the second slot */
  readonly skill_2: string;
  /** Icon for the auto skill in the second slot */
  readonly skill_2_icon: string;
}

/** 장착 펫과 펫 장비·펫 스킬 — `client.maplestorySEA.character.getPetEquipment()` 의 응답. */
export interface SEACharacterPetEquipment {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
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
  readonly pet_1_equipment: SEAPetEquipmentInfo | null;
  /** Auto buff skill info for pet 1 */
  readonly pet_1_auto_skill: SEAPetAutoSkill | null;
  /** Wonder pet type of pet 1 */
  readonly pet_1_pet_type: string | null;
  /** Skills possessed by pet 1 */
  readonly pet_1_skill: readonly string[] | null;
  /** Pet 1 magic time expiry (SGT) */
  readonly pet_1_date_expire: string | null;
  /** Appearance of pet 1 */
  readonly pet_1_appearance: string | null;
  /** Appearance icon of pet 1 */
  readonly pet_1_appearance_icon: string | null;
  /** Name of pet 2 */
  readonly pet_2_name: string | null;
  /** Nickname of pet 2 */
  readonly pet_2_nickname: string | null;
  /** Icon of pet 2 */
  readonly pet_2_icon: string | null;
  /** Description of pet 2 */
  readonly pet_2_description: string | null;
  /** Equipment info for pet 2 */
  readonly pet_2_equipment: SEAPetEquipmentInfo | null;
  /** Auto buff skill info for pet 2 */
  readonly pet_2_auto_skill: SEAPetAutoSkill | null;
  /** Wonder pet type of pet 2 */
  readonly pet_2_pet_type: string | null;
  /** Skills possessed by pet 2 */
  readonly pet_2_skill: readonly string[] | null;
  /** Pet 2 magic time expiry (SGT) */
  readonly pet_2_date_expire: string | null;
  /** Appearance of pet 2 */
  readonly pet_2_appearance: string | null;
  /** Appearance icon of pet 2 */
  readonly pet_2_appearance_icon: string | null;
  /** Name of pet 3 */
  readonly pet_3_name: string | null;
  /** Nickname of pet 3 */
  readonly pet_3_nickname: string | null;
  /** Icon of pet 3 */
  readonly pet_3_icon: string | null;
  /** Description of pet 3 */
  readonly pet_3_description: string | null;
  /** Equipment info for pet 3 */
  readonly pet_3_equipment: SEAPetEquipmentInfo | null;
  /** Auto buff skill info for pet 3 */
  readonly pet_3_auto_skill: SEAPetAutoSkill | null;
  /** Wonder pet type of pet 3 */
  readonly pet_3_pet_type: string | null;
  /** Skills possessed by pet 3 */
  readonly pet_3_skill: readonly string[] | null;
  /** Pet 3 magic time expiry (SGT) */
  readonly pet_3_date_expire: string | null;
  /** Appearance of pet 3 */
  readonly pet_3_appearance: string | null;
  /** Appearance icon of pet 3 */
  readonly pet_3_appearance_icon: string | null;
}

// ─── GET /maplestorysea/v1/character/skill ────────────────────────────────────

/** Skill request parameters */
export interface SEASkillRequest extends OcidDateRequest {
  /** Job advancement level ("0"~"6", "hyperpassive", "hyperactive") */
  readonly character_skill_grade: string;
}

/** Skill info element */
export interface SEASkillInfo {
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

/** 전직 차수별 스킬 — `client.maplestorySEA.character.getSkill()` 의 응답. */
export interface SEACharacterSkill {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Job advancement tier */
  readonly character_skill_grade: string;
  /** Skill information */
  readonly character_skill: readonly SEASkillInfo[];
}

// ─── GET /maplestorysea/v1/character/link-skill ───────────────────────────────

/** Link Skill info element (with skill_effect_next) */
export interface SEALinkSkillInfo {
  /** Skill name */
  readonly skill_name: string;
  /** Skill description */
  readonly skill_description: string;
  /** Skill level */
  readonly skill_level: number;
  /** Skill effect */
  readonly skill_effect: string;
  /** 다음 레벨 스킬 효과. 다음 레벨 효과가 없으면 null. */
  readonly skill_effect_next: string | null;
  /** Skill icon */
  readonly skill_icon: string;
}

/** Link Skill preset info element (no skill_effect_next) */
export interface SEALinkSkillPresetInfo {
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

/** 링크 스킬 — `client.maplestorySEA.character.getLinkSkill()` 의 응답. */
export interface SEACharacterLinkSkill {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** Link Skill information */
  readonly character_link_skill: readonly SEALinkSkillInfo[];
  /** Link Skill preset 1 */
  readonly character_link_skill_preset_1: readonly SEALinkSkillPresetInfo[];
  /** Link Skill preset 2 */
  readonly character_link_skill_preset_2: readonly SEALinkSkillPresetInfo[];
  /** Link Skill preset 3 */
  readonly character_link_skill_preset_3: readonly SEALinkSkillPresetInfo[];
  /** My Link Skill information */
  readonly character_owned_link_skill: SEALinkSkillPresetInfo | null;
  /** My Link Skill preset 1 */
  readonly character_owned_link_skill_preset_1: SEALinkSkillPresetInfo | null;
  /** My Link Skill preset 2 */
  readonly character_owned_link_skill_preset_2: SEALinkSkillPresetInfo | null;
  /** My Link Skill preset 3 */
  readonly character_owned_link_skill_preset_3: SEALinkSkillPresetInfo | null;
}

// ─── GET /maplestorysea/v1/character/vmatrix ──────────────────────────────────

/** V Matrix Node info element */
export interface SEAVCoreInfo {
  /** Slot index */
  readonly slot_id: string;
  /** Slot level */
  readonly slot_level: number;
  /** Node name */
  readonly v_core_name: string;
  /** Node type */
  readonly v_core_type: string;
  /** Node level */
  readonly v_core_level: number;
  /** 코어의 첫 번째 스킬 이름. 해당 스킬이 없으면 null. */
  readonly v_core_skill_1: string | null;
  /** 코어의 두 번째 스킬 이름. 해당 스킬이 없으면 null. */
  readonly v_core_skill_2: string | null;
  /** 코어의 세 번째 스킬 이름. 해당 스킬이 없으면 null. */
  readonly v_core_skill_3: string | null;
}

/** V매트릭스(5차) — `client.maplestorySEA.character.getVMatrix()` 의 응답. */
export interface SEACharacterVMatrix {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** V Matrix Node information */
  readonly character_v_core_equipment: readonly SEAVCoreInfo[];
  /** Remaining Matrix enhancement points */
  readonly character_v_matrix_remain_slot_upgrade_point: number;
}

// ─── GET /maplestorysea/v1/character/hexamatrix ───────────────────────────────

/** HEXA linked skill */
export interface SEAHexaLinkedSkill {
  /** HEXA Skill name */
  readonly hexa_skill_id: string;
}

/** HEXA Node info element */
export interface SEAHexaCoreInfo {
  /** Node name */
  readonly hexa_core_name: string;
  /** Node level */
  readonly hexa_core_level: number;
  /** Node type */
  readonly hexa_core_type: string;
  /** Linked skills */
  readonly linked_skill: readonly SEAHexaLinkedSkill[];
}

/** HEXA 매트릭스(6차)의 HEXA 코어 — `client.maplestorySEA.character.getHexaMatrix()` 의 응답. */
export interface SEACharacterHexaMatrix {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** HEXA Node information */
  readonly character_hexa_core_equipment: readonly SEAHexaCoreInfo[];
}

// ─── GET /maplestorysea/v1/character/hexamatrix-stat ──────────────────────────

/** HEXA Stat core info element */
export interface SEAHexaStatCoreInfo {
  /** Slot index */
  readonly slot_id: string;
  /** Main Stat name */
  readonly main_stat_name: string;
  /** First sub stat name */
  readonly sub_stat_name_1: string;
  /** Second sub stat name */
  readonly sub_stat_name_2: string;
  /** Main Stat level */
  readonly main_stat_level: number;
  /** First sub stat level */
  readonly sub_stat_level_1: number;
  /** Second sub stat level */
  readonly sub_stat_level_2: number;
  /** Stat core level */
  readonly stat_grade: number;
}

/** HEXA 스탯 — `client.maplestorySEA.character.getHexaMatrixStat()` 의 응답. */
export interface SEACharacterHexaMatrixStat {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** HEXA Stat Node I information */
  readonly character_hexa_stat_core: readonly SEAHexaStatCoreInfo[];
  /** HEXA Stat Node II information */
  readonly character_hexa_stat_core_2: readonly SEAHexaStatCoreInfo[];
  /** HEXA Stat Node III information */
  readonly character_hexa_stat_core_3: readonly SEAHexaStatCoreInfo[];
  /** Preset HEXA Stat Node I information */
  readonly preset_hexa_stat_core: readonly SEAHexaStatCoreInfo[];
  /** Preset HEXA Stat Node II information */
  readonly preset_hexa_stat_core_2: readonly SEAHexaStatCoreInfo[];
  /** Preset HEXA Stat Node III information */
  readonly preset_hexa_stat_core_3: readonly SEAHexaStatCoreInfo[];
}

// ─── GET /maplestorysea/v1/character/dojang ───────────────────────────────────

/** 무릉도장 최고 기록 — `client.maplestorySEA.character.getDojang()` 의 응답. */
export interface SEACharacterDojang {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Character job */
  readonly character_class: string;
  /** World name */
  readonly world_name: string;
  /** Highest floor record in Mu Lung Garden */
  readonly dojang_best_floor: number;
  /** Achievement date of the highest record (SGT) */
  readonly date_dojang_record: string | null;
  /** Time taken to clear the highest floor (in seconds) */
  readonly dojang_best_time: number;
}
