import type { TWOcidDateRequest } from '../types.js';

// ─── GET /maplestorytw/v1/character/basic ────────────────────────────────────

/** 캐릭터 기본 정보 — `client.maplestoryTW.character.getBasic()` 의 응답. */
export interface TWCharacterBasic {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
  /** Character popularity */
  readonly popularity: number;
}

// ─── GET /maplestorytw/v1/character/stat ─────────────────────────────────────

/** 캐릭터 정보창의 스탯(종합 능력치) — `client.maplestoryTW.character.getStat()` 의 응답. */
export interface TWCharacterStat {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Equipment description */
  readonly item_description: string;
  /** Equipment appearance name */
  readonly item_shape_name: string;
  /** Equipment appearance icon */
  readonly item_shape_icon: string;
  /** Gender restriction */
  readonly item_gender: string;
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
  /** Remaining scroll upgrade count */
  readonly scroll_upgradable_count: string;
  /** Soul name */
  readonly soul_name: string;
  /** Soul option */
  readonly soul_option: string;
  /** Soul Weapon grade. */
  readonly soul_weapon_grade: string;
  /** Soul Weapon level. */
  readonly soul_weapon_level: string;
  /** Soul Weapon option. */
  readonly soul_weapon_option: string;
  /** Power increase from the Soul Weapon. */
  readonly soul_weapon_power_increase: string;
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
  /** Potential option grade. */
  readonly potential_option_grade: string;
  /** Additional potential option grade. */
  readonly additional_potential_option_grade: string;
  /** First potential option. */
  readonly potential_option_1: string;
  /** Second potential option. */
  readonly potential_option_2: string;
  /** Third potential option. */
  readonly potential_option_3: string;
  /** First additional potential option. */
  readonly additional_potential_option_1: string;
  /** Second additional potential option. */
  readonly additional_potential_option_2: string;
  /** Third additional potential option. */
  readonly additional_potential_option_3: string;
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
  /** Slot occupied by the preset item. */
  readonly equipment_slot: string;
  /** Exceptional upgrade information. */
  readonly item_exceptional_option: TWItemExceptionalOption;
}

/** Dragon or Mechanic equipment. */
export interface TWClassItemEquipment extends TWItemEquipmentDetails {
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
  /** Title appearance name */
  readonly title_shape_name: string;
  /** Title appearance icon */
  readonly title_shape_icon: string;
  /** Title appearance description */
  readonly title_shape_description: string;
}

/** Medal shape info */
export interface TWMedalShape {
  readonly medal_shape_name: string;
  readonly medal_shape_icon: string;
  readonly medal_shape_description: string;
  readonly medal_shape_changed_name: string;
  readonly medal_shape_changed_icon: string;
  readonly medal_shape_changed_description: string;
}

/** 장착 장비(캐시 장비 제외) — `client.maplestoryTW.character.getItemEquipment()` 의 응답. */
export interface TWCharacterItemEquipment {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Title info */
  readonly title: TWTitleInfo;
  /** Medal shape info */
  readonly medal_shape: TWMedalShape;
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
  /** Cash equipment description */
  readonly cash_item_description: string;
  /** Cash equipment options */
  readonly cash_item_option: readonly TWCashItemOption[];
  /** Cash equipment expiry date (TST, null = permanent) */
  readonly date_expire: string | null;
  /** Cash equipment option expiry date (TST, null = permanent) */
  readonly date_option_expire: string | null;
  /** Cash equipment label information */
  readonly cash_item_label: string;
  /** Cash equipment coloring prism info (null = not applied) */
  readonly cash_item_coloring_prism: TWCashItemColoringPrism | null;
  /** Gender compatibility for item equipment */
  readonly item_gender: string;
  /** Skill names */
  readonly skills: readonly string[];
  /** Name and level of each skill granted by the cash item. */
  readonly skill_info: readonly TWCashItemSkill[];
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** 장착 캐시 장비 — `client.maplestoryTW.character.getCashItemEquipment()` 의 응답. */
export interface TWCharacterCashItemEquipment {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
  /** Character gender */
  readonly character_gender: string;
  /** Character job */
  readonly character_class: string;
  /** Character appearance mode ("0": Normal, "1": Beta for Zero / Dress-up for Angelic Buster) */
  readonly character_look_mode: string;
  /** Active cash item preset number */
  readonly preset_no: number;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
  /** Set Item effect information */
  readonly set_effect: readonly TWSetEffectDetail[];
}

// ─── GET /maplestorytw/v1/character/beauty-equipment ─────────────────────────

/** Hair info */
export interface TWHairInfo {
  /** Hair name */
  readonly hair_name: string;
  /** Base hair color */
  readonly base_color: string;
  /** Mixed hair color */
  readonly mix_color: string;
  /** Dye ratio for mixed hair color */
  readonly mix_rate: string;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Face info */
export interface TWFaceInfo {
  /** Face name */
  readonly face_name: string;
  /** Base face color */
  readonly base_color: string;
  /** Mixed face color */
  readonly mix_color: string;
  /** Dye ratio for mixed face color */
  readonly mix_rate: string;
  /** Freestyle Coupon application status ("0": not applied, "1": applied) */
  readonly freestyle_flag: string;
}

/** Skin info */
export interface TWSkinInfo {
  /** Skin name */
  readonly skin_name: string;
  /** Color style */
  readonly color_style: string;
  /** Skin hue */
  readonly hue: number;
  /** Skin saturation */
  readonly saturation: number;
  /** Skin brightness */
  readonly brightness: number;
}

/** 헤어·성형·피부 — `client.maplestoryTW.character.getBeautyEquipment()` 의 응답. */
export interface TWCharacterBeautyEquipment {
  /** Reference date for query (TST) */
  readonly date: string;
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
  /** Additional hair info (Beta mode for Zero / Dress-up mode for Angelic Buster) */
  readonly additional_character_hair: TWHairInfo;
  /** Additional face info (Beta mode for Zero / Dress-up mode for Angelic Buster) */
  readonly additional_character_face: TWFaceInfo;
  /** Additional skin info (Beta mode for Zero / Dress-up mode for Angelic Buster) */
  readonly additional_character_skin: TWSkinInfo;
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
  /** Cash item description */
  readonly cash_item_description: string;
  /** Cash item options */
  readonly cash_item_option: readonly TWCashItemOption[];
  /** Cash item expiry date (TST) */
  readonly date_expire: string | null;
  /** Cash item option expiry date (TST) */
  readonly date_option_expire: string | null;
  /** Cash item label info */
  readonly cash_item_label: string;
  /** Cash item coloring prism info (null = not applied) */
  readonly cash_item_coloring_prism: TWCashItemColoringPrism | null;
  /** Gender compatibility for android item */
  readonly android_item_gender: string;
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
  /** Android skin info */
  readonly android_skin: TWSkinInfo;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Android skin info */
  readonly android_skin: TWSkinInfo;
  /** Android cash item equipment info */
  readonly android_cash_item_equipment: readonly TWAndroidCashItem[];
  /** Android ear sensor clip status as a string flag. */
  readonly android_ear_sensor_clip_flag: string;
  /** Android gender */
  readonly android_gender: string | null;
  /** Android grade */
  readonly android_grade: string | null;
  /** Whether the Android is non-humanoid, encoded as a string flag. */
  readonly android_non_humanoid_flag: string;
  /** Whether the Android can use the general store, encoded as a string flag. */
  readonly android_shop_usable_flag: string;
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
  /** Item name */
  readonly item_name: string;
  /** Item icon */
  readonly item_icon: string;
  /** Item description */
  readonly item_description: string;
  /** Displayed item options */
  readonly item_option: readonly TWPetItemOption[];
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
  /** Potential category. */
  readonly potential_type: string;
  /** Primary increase. For paired stats, holds attack power or maximum HP. */
  readonly potential_increase_1: string;
  /** Secondary increase for paired stats, holding magic attack or maximum MP. */
  readonly potential_increase_2: string;
}

/** 장착 펫과 펫 장비·펫 스킬 — `client.maplestoryTW.character.getPetEquipment()` 의 응답. */
export interface TWCharacterPetEquipment {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Potential lines for pet 1. */
  readonly pet_1_potential: readonly TWPetPotential[];
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
  /** Potential lines for pet 2. */
  readonly pet_2_potential: readonly TWPetPotential[];
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
  /** Potential lines for pet 3. */
  readonly pet_3_potential: readonly TWPetPotential[];
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
  /** Effect description for the next skill level */
  readonly skill_effect_next: string;
  /** Skill icon */
  readonly skill_icon: string;
}

/** 전직 차수별 스킬 — `client.maplestoryTW.character.getSkill()` 의 응답. */
export interface TWCharacterSkill {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Effect for the next skill level */
  readonly skill_effect_next: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Node name */
  readonly v_core_name: string;
  /** Node type */
  readonly v_core_type: string;
  /** Node level */
  readonly v_core_level: number;
  /** Name of the skill that corresponds to the node */
  readonly v_core_skill_1: string;
  /** Name of the second skill (Boost Nodes) */
  readonly v_core_skill_2: string;
  /** Name of the third skill (Boost Nodes) */
  readonly v_core_skill_3: string;
}

/** V매트릭스(5차) — `client.maplestoryTW.character.getVMatrix()` 의 응답. */
export interface TWCharacterVMatrix {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
  /** HEXA Node information */
  readonly character_hexa_core_equipment: readonly TWHexaCoreInfo[];
}

// ─── GET /maplestorytw/v1/character/hexamatrix-stat ──────────────────────────

/** HEXA Stat core info element */
export interface TWHexaStatCoreInfo {
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

/** HEXA 스탯 — `client.maplestoryTW.character.getHexaMatrixStat()` 의 응답. */
export interface TWCharacterHexaMatrixStat {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
  /** Character job */
  readonly character_class: string;
  /** HEXA Stat Node I information */
  readonly character_hexa_stat_core: readonly TWHexaStatCoreInfo[];
  /** HEXA Stat Node II information */
  readonly character_hexa_stat_core_2: readonly TWHexaStatCoreInfo[];
  /** HEXA Stat Node III information */
  readonly character_hexa_stat_core_3: readonly TWHexaStatCoreInfo[];
  /** Preset HEXA Stat Node I information */
  readonly preset_hexa_stat_core: readonly TWHexaStatCoreInfo[];
  /** Preset HEXA Stat Node II information */
  readonly preset_hexa_stat_core_2: readonly TWHexaStatCoreInfo[];
  /** Preset HEXA Stat Node III information */
  readonly preset_hexa_stat_core_3: readonly TWHexaStatCoreInfo[];
}

// ─── GET /maplestorytw/v1/character/dojang ───────────────────────────────────

/** 무릉도장 최고 기록 — `client.maplestoryTW.character.getDojang()` 의 응답. */
export interface TWCharacterDojang {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
  readonly date: string;
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
  /** Link expiration date. */
  readonly expire_date: string;
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
  /** Learned skill name. */
  readonly skill_name: string;
  /** Level of the Familiar's options. */
  readonly option_level: number;
  /** Familiar options. */
  readonly option: readonly TWFamiliarOption[];
  /** Familiar grade. */
  readonly familiar_grade: string;
  /** Familiar appearance name. */
  readonly look_name: string;
  /** Whether the Familiar is summoned, encoded as a string flag. */
  readonly summoned_flag: string;
  /** Link slot identifier ("1", "2", "3", "vip", or "not link"). */
  readonly slot_id: string;
}

/** 패밀리어(萌獸) — `client.maplestoryTW.character.getFamiliar()` 의 응답. */
export interface TWCharacterFamiliar {
  /** Reference date for the snapshot (TST, with daily timestamps at midnight). */
  readonly date: string;
  /** Familiar link slots. */
  readonly familiar_link_slot: readonly TWFamiliarLinkSlot[];
  /** Familiar details. */
  readonly familiar_info: readonly TWFamiliarInfo[];
}
