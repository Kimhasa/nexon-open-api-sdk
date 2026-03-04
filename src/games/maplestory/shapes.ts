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
    date: 'string',
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
    date: 'string',
    popularity: 'number',
  },
};

export const CHARACTER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    final_stat: 'array',
    remain_ap: 'number',
  },
};

export const CHARACTER_HYPER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    use_preset_no: 'string',
    use_available_hyper_stat_point: 'number',
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
    date: 'string',
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
    date: 'string',
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
    date: 'string',
    character_gender: 'string',
    character_class: 'string',
    preset_no: 'number',
    item_equipment: 'array',
    item_equipment_preset_1: 'array',
    item_equipment_preset_2: 'array',
    item_equipment_preset_3: 'array',
    title: 'object',
    dragon_equipment: 'array',
    mechanic_equipment: 'array',
    medal_shape: 'optional',
  },
};

export const CHARACTER_CASHITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_gender: 'string',
    character_class: 'string',
    preset_no: 'number',
    cash_item_equipment_base: 'array',
    cash_item_equipment_preset_1: 'array',
    cash_item_equipment_preset_2: 'array',
    cash_item_equipment_preset_3: 'array',
    additional_cash_item_equipment_base: 'array',
    additional_cash_item_equipment_preset_1: 'array',
    additional_cash_item_equipment_preset_2: 'array',
    additional_cash_item_equipment_preset_3: 'array',
  },
};

export const CHARACTER_SYMBOL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    symbol: 'array',
  },
};

export const CHARACTER_SET_EFFECT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    set_effect: 'array',
  },
};

export const CHARACTER_BEAUTY_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_gender: 'string',
    character_class: 'string',
    character_hair: 'object',
    character_face: 'object',
    character_skin_name: 'string',
    additional_character_hair: 'optional',
    additional_character_face: 'optional',
    additional_character_skin_name: 'optional',
  },
};

export const CHARACTER_ANDROID_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    android_name: 'string',
    android_nickname: 'string',
    android_icon: 'string',
    android_description: 'string',
    android_hair: 'object',
    android_face: 'object',
    android_skin_name: 'string',
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
    date: 'string',
    pet_1_name: 'string',
    pet_1_nickname: 'string',
    pet_1_icon: 'string',
    pet_1_description: 'string',
    pet_1_equipment: 'object',
    pet_1_auto_skill: 'object',
    pet_1_pet_type: 'string',
    pet_1_skill: 'array',
    pet_1_date_expire: 'string',
    pet_1_appearance: 'object',
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
  },
};

export const CHARACTER_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    character_skill_grade: 'string',
    character_skill: 'array',
  },
};

export const CHARACTER_LINK_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
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
    date: 'string',
    character_class: 'string',
    character_v_core_equipment: 'array',
    character_v_matrix_remain_slot_upgrade_point: 'number',
  },
};

export const CHARACTER_HEXAMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_hexa_core_equipment: 'array',
  },
};

export const CHARACTER_HEXAMATRIX_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_hexa_stat_core: 'array',
    preset_hexa_stat_core: 'array',
  },
};

export const CHARACTER_DOJANG_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    world_name: 'string',
    dojang_best_floor: 'number',
    date_dojang_record: 'string',
    dojang_best_time: 'number',
  },
};

export const CHARACTER_OTHER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    other_stat: 'array',
  },
};

export const CHARACTER_RING_EXCHANGE_SKILL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    special_ring_exchange_name: 'string',
    special_ring_exchange_level: 'number',
    special_ring_exchange_icon: 'string',
    special_ring_exchange_description: 'string',
  },
};

// ─── Union ──────────────────────────────────────────────────────────────────

export const UNION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    union_level: 'number',
    union_grade: 'string',
    union_artifact_level: 'optional',
    union_artifact_exp: 'optional',
    union_artifact_point: 'optional',
  },
};

export const UNION_RAIDER_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
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
  },
};

export const UNION_ARTIFACT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    union_artifact_effect: 'array',
    union_artifact_crystal: 'array',
    union_artifact_remain_ap: 'number',
  },
};

export const UNION_CHAMPION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    union_champion_info: 'array',
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
    date: 'string',
    world_name: 'string',
    guild_name: 'string',
    guild_level: 'number',
    guild_fame: 'number',
    guild_point: 'number',
    guild_master_name: 'string',
    guild_member_count: 'number',
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
    next_cursor: 'string',
  },
};

export const POTENTIAL_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    count: 'number',
    potential_history: 'array',
    next_cursor: 'string',
  },
};

export const CUBE_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    count: 'number',
    cube_history: 'array',
    next_cursor: 'string',
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
