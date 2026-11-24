import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 메이플스토리 KMS 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── User / ID ──────────────────────────────────────────────────────────────

export const OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

export const OUID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
  },
};

export const ACHIEVEMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    account_list: 'array',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const CHARACTER_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    account_list: 'array',
  },
};

export const CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_name: 'string',
    world_name: 'string',
    character_gender: 'string',
    character_class: 'string',
    character_class_level: 'string',
    character_level: 'number',
    character_exp: 'number',
    character_exp_rate: 'string',
    character_guild_name: 'string',
    character_image: 'string',
    character_date_create: 'string',
    access_flag: 'string',
    liberation_quest_clear: 'string',
  },
};

export const CHARACTER_POPULARITY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    popularity: 'number',
  },
};

export const CHARACTER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    final_stat: 'array',
    remain_ap: 'number',
  },
};

export const CHARACTER_HYPER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    use_preset_no: 'string',
    use_available_hyper_stat: 'number',
    hyper_stat_preset_1: 'array',
    hyper_stat_preset_1_remain_point: 'number',
    hyper_stat_preset_2: 'array',
    hyper_stat_preset_2_remain_point: 'number',
    hyper_stat_preset_3: 'array',
    hyper_stat_preset_3_remain_point: 'number',
  },
};

export const CHARACTER_PROPENSITY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    charisma_level: 'number',
    sensibility_level: 'number',
    insight_level: 'number',
    willingness_level: 'number',
    handicraft_level: 'number',
    charm_level: 'number',
  },
};

export const CHARACTER_ABILITY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    ability_grade: 'string',
    ability_info: 'array',
    remain_fame: 'number',
    preset_no: 'number',
    ability_preset_1: 'optional',
    ability_preset_2: 'optional',
    ability_preset_3: 'optional',
  },
};

export const CHARACTER_ITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_gender: 'string',
    character_class: 'string',
    preset_no: 'number',
    item_equipment: 'array',
    item_equipment_preset_1: 'array',
    item_equipment_preset_2: 'array',
    item_equipment_preset_3: 'array',
    title: 'object',
    // 포털 스펙에는 없고 실제 응답에 있는 칭호 프리셋 (2026-11-24 실측)
    title_preset1: 'optional',
    title_preset2: 'optional',
    title_preset3: 'optional',
    dragon_equipment: 'array',
    mechanic_equipment: 'array',
    medal_shape: 'optional',
  },
};

export const CHARACTER_CASHITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_gender: 'string',
    character_class: 'string',
    character_look_mode: 'optional',
    preset_no: 'number',
    cash_item_equipment_base: 'array',
    cash_item_equipment_preset_1: 'array',
    cash_item_equipment_preset_2: 'array',
    cash_item_equipment_preset_3: 'array',
    additional_cash_item_equipment_base: 'array',
    additional_cash_item_equipment_preset_1: 'array',
    additional_cash_item_equipment_preset_2: 'array',
    additional_cash_item_equipment_preset_3: 'array',
    world_share_master_label_activate_flag: 'optional',
    world_share_master_label_base: 'optional',
  },
};

export const CHARACTER_SYMBOL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    symbol: 'array',
  },
};

export const CHARACTER_SET_EFFECT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    set_effect: 'array',
  },
};

export const CHARACTER_BEAUTY_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_gender: 'string',
    character_class: 'string',
    character_hair: 'object',
    character_face: 'object',
    character_skin: 'object',
    additional_character_hair: 'optional',
    additional_character_face: 'optional',
    additional_character_skin: 'optional',
  },
};

export const CHARACTER_ANDROID_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    android_name: 'string',
    android_nickname: 'string',
    android_icon: 'string',
    android_description: 'string',
    android_hair: 'object',
    android_face: 'object',
    android_skin: 'object',
    android_cash_item_equipment: 'array',
    android_ear_sensor_clip_flag: 'string',
    android_gender: 'optional',
    android_grade: 'optional',
    android_non_humanoid_flag: 'optional',
    android_shop_usable_flag: 'optional',
    preset_no: 'optional',
    android_preset_1: 'optional',
    android_preset_2: 'optional',
    android_preset_3: 'optional',
  },
};

export const CHARACTER_PET_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    pet_1_name: 'string',
    pet_1_nickname: 'string',
    pet_1_icon: 'string',
    pet_1_description: 'string',
    pet_1_equipment: 'object',
    pet_1_auto_skill: 'object',
    pet_1_pet_type: 'string',
    pet_1_skill: 'array',
    pet_1_date_expire: 'string',
    pet_1_appearance: 'any',
    pet_1_appearance_icon: 'string',
    pet_2_name: 'optional',
    pet_2_nickname: 'optional',
    pet_2_icon: 'optional',
    pet_2_description: 'optional',
    pet_2_equipment: 'optional',
    pet_2_auto_skill: 'optional',
    pet_2_pet_type: 'optional',
    pet_2_skill: 'optional',
    pet_2_date_expire: 'optional',
    pet_2_appearance: 'optional',
    pet_2_appearance_icon: 'optional',
    pet_3_name: 'optional',
    pet_3_nickname: 'optional',
    pet_3_icon: 'optional',
    pet_3_description: 'optional',
    pet_3_equipment: 'optional',
    pet_3_auto_skill: 'optional',
    pet_3_pet_type: 'optional',
    pet_3_skill: 'optional',
    pet_3_date_expire: 'optional',
    pet_3_appearance: 'optional',
    pet_3_appearance_icon: 'optional',
    pet_activate_flag: 'optional',
    world_share_pet_1_name: 'optional',
    world_share_pet_1_nickname: 'optional',
    world_share_pet_1_icon: 'optional',
    world_share_pet_1_description: 'optional',
    world_share_pet_1_pet_type: 'optional',
    world_share_pet_1_equipment_preset_no: 'optional',
    world_share_pet_1_equipment: 'optional',
    world_share_pet_1_auto_skill: 'optional',
    world_share_pet_1_skill: 'optional',
    world_share_pet_1_date_expire: 'optional',
    world_share_pet_1_appearance: 'optional',
    world_share_pet_1_appearance_icon: 'optional',
    world_share_pet_2_name: 'optional',
    world_share_pet_2_nickname: 'optional',
    world_share_pet_2_icon: 'optional',
    world_share_pet_2_description: 'optional',
    world_share_pet_2_pet_type: 'optional',
    world_share_pet_2_equipment_preset_no: 'optional',
    world_share_pet_2_equipment: 'optional',
    world_share_pet_2_auto_skill: 'optional',
    world_share_pet_2_skill: 'optional',
    world_share_pet_2_date_expire: 'optional',
    world_share_pet_2_appearance: 'optional',
    world_share_pet_2_appearance_icon: 'optional',
    world_share_pet_3_name: 'optional',
    world_share_pet_3_nickname: 'optional',
    world_share_pet_3_icon: 'optional',
    world_share_pet_3_description: 'optional',
    world_share_pet_3_pet_type: 'optional',
    world_share_pet_3_equipment_preset_no: 'optional',
    world_share_pet_3_equipment: 'optional',
    world_share_pet_3_auto_skill: 'optional',
    world_share_pet_3_skill: 'optional',
    world_share_pet_3_date_expire: 'optional',
    world_share_pet_3_appearance: 'optional',
    world_share_pet_3_appearance_icon: 'optional',
    world_share_pet_equipment_preset: 'optional',
    petite_luna_pet_skill: 'optional',
  },
};

export const CHARACTER_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    character_skill_grade: 'string',
    character_skill: 'array',
  },
};

export const CHARACTER_LINK_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    character_link_skill: 'array',
    character_link_skill_preset_1: 'optional',
    character_link_skill_preset_2: 'optional',
    character_link_skill_preset_3: 'optional',
    character_owned_link_skill: 'object',
    character_owned_link_skill_preset_1: 'optional',
    character_owned_link_skill_preset_2: 'optional',
    character_owned_link_skill_preset_3: 'optional',
  },
};

export const CHARACTER_VMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    character_v_core_equipment: 'array',
    character_v_matrix_remain_slot_upgrade_point: 'number',
    character_v_core_equipment_preset_1: 'optional',
    character_v_core_equipment_preset_2: 'optional',
    character_v_core_equipment_preset_3: 'optional',
    character_v_core_equipment_preset_4: 'optional',
    character_v_core_equipment_preset_5: 'optional',
  },
};

export const CHARACTER_HEXAMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_hexa_core_equipment: 'array',
  },
};

export const CHARACTER_HEXAMATRIX_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    character_hexa_stat_core: 'array',
    character_hexa_stat_core_2: 'array',
    character_hexa_stat_core_3: 'array',
    preset_hexa_stat_core: 'array',
    preset_hexa_stat_core_2: 'array',
    preset_hexa_stat_core_3: 'array',
  },
};

export const CHARACTER_DOJANG_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    character_class: 'string',
    world_name: 'string',
    dojang_best_floor: 'number',
    date_dojang_record: 'string',
    dojang_best_time: 'number',
  },
};

export const CHARACTER_OTHER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    // 기타 능력치가 없는 캐릭터는 null이 온다
    other_stat: 'any',
  },
};

export const CHARACTER_RING_EXCHANGE_SKILL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    // 등록한 반지가 없으면 null이 온다
    special_ring_exchange_name: 'any',
    special_ring_exchange_level: 'any',
    special_ring_exchange_icon: 'any',
    special_ring_exchange_description: 'any',
  },
};

export const CHARACTER_RING_RESERVE_SKILL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 반지 미장착 시 null이 올 수 있어 문자열 필드는 타입을 강제하지 않는다
    date: 'any',
    character_class: 'string',
    special_ring_reserve_name: 'any',
    special_ring_reserve_level: 'any',
    special_ring_reserve_icon: 'any',
    special_ring_reserve_description: 'any',
  },
};

// ─── Union ──────────────────────────────────────────────────────────────────

export const UNION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    union_level: 'number',
    union_grade: 'string',
    union_artifact_level: 'optional',
    union_artifact_exp: 'optional',
    union_artifact_point: 'optional',
  },
};

export const UNION_RAIDER_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    union_raider_stat: 'array',
    union_occupied_stat: 'array',
    union_inner_stat: 'array',
    union_block: 'array',
    use_preset_no: 'number',
    union_raider_preset_1: 'optional',
    union_raider_preset_2: 'optional',
    union_raider_preset_3: 'optional',
    union_raider_preset_4: 'optional',
    union_raider_preset_5: 'optional',
    union_state_stat: 'optional',
    union_state_stat_preset: 'optional',
    union_max_point: 'optional',
  },
};

export const UNION_ARTIFACT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    union_artifact_effect: 'array',
    union_artifact_crystal: 'array',
    union_artifact_remain_ap: 'number',
  },
};

export const UNION_CHAMPION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    union_champion: 'array',
    champion_badge_total_info: 'array',
  },
};

// ─── Guild ──────────────────────────────────────────────────────────────────

export const GUILD_ID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    oguild_id: 'string',
  },
};

export const GUILD_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 최근 데이터 조회(date 생략)에서는 null이 온다
    date: 'any',
    world_name: 'string',
    guild_name: 'string',
    guild_level: 'number',
    guild_fame: 'number',
    guild_point: 'number',
    guild_master_name: 'string',
    guild_member_count: 'number',
    guild_user_count: 'optional',
    guild_member: 'array',
    guild_skill: 'array',
    guild_noblesse_skill: 'array',
    guild_mark: 'optional',
    guild_mark_custom: 'optional',
  },
};

// ─── Ranking ────────────────────────────────────────────────────────────────

export const RANKING_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ranking: 'array',
  },
};

// ─── History ────────────────────────────────────────────────────────────────

export const STARFORCE_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    count: 'number',
    starforce_history: 'array',
    // 마지막 페이지에서는 null이 온다
    next_cursor: 'any',
  },
};

export const POTENTIAL_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    count: 'number',
    potential_history: 'array',
    // 마지막 페이지에서는 null이 온다
    next_cursor: 'any',
  },
};

export const CUBE_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    count: 'number',
    cube_history: 'array',
    // 마지막 페이지에서는 null이 온다
    next_cursor: 'any',
  },
};

export const SOUL_POTENTIAL_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    count: 'number',
    soul_potential_history: 'array',
    // 마지막 페이지에서는 null이 온다
    next_cursor: 'any',
  },
};

// ─── Notice ─────────────────────────────────────────────────────────────────

export const NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    notice: 'array',
  },
};

export const NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    date: 'string',
    contents: 'string',
  },
};

export const UPDATE_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    update_notice: 'array',
  },
};

export const EVENT_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    event_notice: 'array',
  },
};

export const EVENT_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
    date_event_start: 'string',
    date_event_end: 'string',
  },
};

export const CASHSHOP_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    cashshop_notice: 'array',
  },
};

export const CASHSHOP_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
    date_sale_start: 'string',
    date_sale_end: 'string',
    ongoing_flag: 'string',
  },
};

// ─── Battle Practice ────────────────────────────────────────────────────────

export const BATTLE_PRACTICE_REPLAY_ID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    replay_list: 'array',
  },
};

export const BATTLE_PRACTICE_RESULT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    register_date: 'string',
    total_play_time: 'number',
    total_damage: 'number',
    total_dps: 'number',
    end_type: 'string',
    like_count: 'number',
    skill_statistic: 'array',
  },
};

export const BATTLE_PRACTICE_SKILL_TIMELINE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    page_no: 'number',
    total_page_no: 'number',
    skill_timeline: 'array',
  },
};

export const BATTLE_PRACTICE_CHARACTER_INFO_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    basic_object: 'object',
    stat_object: 'object',
    hyper_stat_object: 'object',
    propensity_object: 'object',
    ability_object: 'object',
    item_object: 'object',
    cash_item_object: 'object',
    pet_object: 'object',
    skill_object: 'object',
    link_skill_object: 'object',
    v_matrix_object: 'object',
    hexa_matrix_object: 'object',
    ring_reserve_skill_object: 'object',
    union_raider_object: 'object',
    union_artifact_object: 'object',
    union_champion_object: 'object',
    guild_object: 'object',
  },
};

// ─── Scheduler ──────────────────────────────────────────────────────────────

export const SCHEDULER_CHARACTER_STATE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 기준일에 접속하지 않은 캐릭터는 값이 비어 올 수 있다
    date: 'any',
    character_name: 'string',
    world_name: 'string',
    character_level: 'number',
    character_class: 'string',
    daily_contents: 'array',
    weekly_contents: 'array',
    boss_contents: 'array',
    weekly_boss_clear_count: 'number',
    weekly_boss_clear_limit_count: 'number',
  },
};
