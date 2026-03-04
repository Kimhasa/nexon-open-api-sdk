import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 메이플스토리M 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── User / ID ──────────────────────────────────────────────────────────────

export const M_OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const M_CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_name: 'string',
    world_name: 'string',
    character_date_create: 'string',
    character_date_last_login: 'string',
    character_date_last_logout: 'string',
    character_job_name: 'string',
    character_class: 'string',
    character_gender: 'string',
    character_exp: 'number',
    character_exp_rate: 'string',
    character_level: 'number',
    character_image: 'string',
  },
};

export const M_CHARACTER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    stat: 'array',
  },
};

export const M_CHARACTER_HYPER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    preset_count: 'number',
    use_preset_no: 'number',
    use_preset_remain_hyper_stat: 'number',
    hyper_stat: 'array',
  },
};

export const M_CHARACTER_GUILD_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    guild_name: 'string',
  },
};

export const M_CHARACTER_ITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_gender: 'string',
    character_class: 'string',
    preset_no: 'number',
    item_equipment: 'array',
  },
};

export const M_CHARACTER_CASHITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_gender: 'string',
    character_class: 'string',
    preset_no: 'number',
    cash_item_equipment_base: 'array',
    cash_item_equipment_preset_1: 'array',
    cash_item_equipment_preset_2: 'array',
    cash_item_equipment_preset_3: 'array',
  },
};

export const M_CHARACTER_SYMBOL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    symbol: 'array',
  },
};

export const M_CHARACTER_SET_EFFECT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    set_effect: 'array',
  },
};

export const M_CHARACTER_ANDROID_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    android_name: 'string',
    android_nickname: 'string',
    android_icon: 'string',
    android_description: 'string',
    android_hair: 'object',
    android_face: 'object',
    android_skin: 'object',
    android_cash_item_equipment: 'array',
    android_ear_sensor_clip_flag: 'string',
    android_gender: 'string',
    android_grade: 'string',
    android_non_humanoid_flag: 'string',
    android_shop_usable_flag: 'string',
  },
};

export const M_CHARACTER_JEWEL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    jewel: 'array',
  },
};

export const M_CHARACTER_BEAUTY_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_gender: 'string',
    character_class: 'string',
    character_hair: 'object',
    character_face: 'object',
    character_skin: 'object',
  },
};

export const M_CHARACTER_PET_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    pet_1_name: 'string',
    pet_1_nickname: 'string',
    pet_1_icon: 'string',
    pet_1_description: 'string',
    pet_1_equipment: 'object',
    pet_1_auto_skill: 'object',
    pet_1_skill: 'array',
    pet_1_date_expire: 'any',
    pet_2_name: 'string',
    pet_2_nickname: 'string',
    pet_2_icon: 'string',
    pet_2_description: 'string',
    pet_2_equipment: 'object',
    pet_2_auto_skill: 'object',
    pet_2_skill: 'array',
    pet_2_date_expire: 'any',
    pet_3_name: 'string',
    pet_3_nickname: 'string',
    pet_3_icon: 'string',
    pet_3_description: 'string',
    pet_3_equipment: 'object',
    pet_3_auto_skill: 'object',
    pet_3_skill: 'array',
    pet_3_date_expire: 'any',
  },
};

export const M_CHARACTER_SKILL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    character_skill: 'array',
  },
};

export const M_CHARACTER_LINK_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    character_link_skill: 'array',
    character_owned_link_skill: 'object',
  },
};

export const M_CHARACTER_VMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    character_v_core_equipment: 'array',
    character_v_matrix_remain_slot_upgrade_point: 'number',
  },
};

export const M_CHARACTER_HEXAMATRIX_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_hexa_core_equipment: 'array',
  },
};

export const M_CHARACTER_HEXAMATRIX_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    character_class: 'string',
    character_hexa_stat_core: 'array',
    preset_hexa_stat_core: 'array',
  },
};

// ─── Union ──────────────────────────────────────────────────────────────────

export const M_UNION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    union_level: 'number',
    union_grade: 'string',
  },
};

export const M_UNION_RAIDER_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'string',
    union_raider_stat: 'array',
    union_occupied_stat: 'array',
    union_inner_stat: 'array',
    union_block: 'array',
  },
};

// ─── Guild ──────────────────────────────────────────────────────────────────

export const M_GUILD_ID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    oguild_id: 'string',
  },
};

export const M_GUILD_BASIC_SHAPE: ShapeDescriptor = {
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
  },
};

// ─── Ranking ────────────────────────────────────────────────────────────────

export const M_RANKING_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ranking: 'array',
  },
};

// ─── Notice ─────────────────────────────────────────────────────────────────

export const M_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    notice: 'array',
  },
};

export const M_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
  },
};

export const M_PATCH_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    patch_notice: 'array',
  },
};

export const M_EVENT_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    event_notice: 'array',
  },
};

export const M_EVENT_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
    date_event_start: 'string',
    date_event_end: 'string',
  },
};
