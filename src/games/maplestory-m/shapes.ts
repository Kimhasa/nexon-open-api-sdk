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
    character_class: 'string',
    use_preset_no: 'number',
    item_equipment: 'array',
    soul_set_option: 'string',
    equipment_preset: 'array',
  },
};

export const M_CHARACTER_CASHITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_class: 'string',
    character_gender: 'string',
    use_preset_no: 'number',
    use_additional_preset_no: 'number',
    character_look_mode: 'string',
    cash_item_equipment: 'array',
    additional_cash_item_equipment: 'array',
    cash_equipment_preset: 'array',
    additional_cash_equipment_preset: 'array',
  },
};

export const M_CHARACTER_SYMBOL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_class: 'string',
    arcane_symbol: 'array',
    authentic_symbol: 'array',
  },
};

export const M_CHARACTER_SET_EFFECT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    set_info: 'array',
  },
};

export const M_CHARACTER_ANDROID_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    use_preset_no: 'number',
    android_equipment: 'object',
    heart_equipment: 'object',
    android_heart_equipment_preset: 'array',
  },
};

// 아래 shape는 실제 API 스펙 확인 후 구현 예정
export const M_CHARACTER_JEWEL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    use_jewel_page_no: 'number',
    use_jewel_set_option: 'string',
    jewel_equipment: 'array',
  },
};
export const M_CHARACTER_BEAUTY_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_gender: 'string',
    character_class: 'string',
    character_hair: 'object',
    character_face: 'object',
    character_skin_name: 'string',
    additional_character_hair: 'object',
    additional_character_face: 'object',
    additional_character_skin_name: 'string',
  },
};
export const M_CHARACTER_PET_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    pet_1_name: 'string',
    pet_1_pet_type: 'string',
    pet_1_date_expire: 'string',
    pet_1_icon: 'string',
    pet_2_name: 'string',
    pet_2_pet_type: 'string',
    pet_2_date_expire: 'string',
    pet_2_icon: 'string',
    pet_3_name: 'string',
    pet_3_pet_type: 'string',
    pet_3_date_expire: 'string',
    pet_3_icon: 'string',
    pet_set_option: 'array',
  },
};
export const M_CHARACTER_SKILL_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_class: 'string',
    skill: 'object',
  },
};
export const M_CHARACTER_LINK_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    use_preset_no: 'number',
    link_skill: 'array',
  },
};
export const M_CHARACTER_VMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_class: 'string',
    character_v_core_equipment: 'array',
  },
};
export const M_CHARACTER_HEXAMATRIX_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_class: 'string',
    hexamatrix_skill: 'array',
  },
};
export const M_CHARACTER_HEXAMATRIX_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_class: 'string',
    hexamatrix_stat: 'array',
  },
};

// ─── 아래 shape는 실제 API 스펙 확인 후 구현 예정 ───────────────────────────

// Union
export const M_UNION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    union_level: 'number',
    union_grade: 'string',
    union_level_total_option: 'string',
    union_grade_icon: 'string',
  },
};
export const M_UNION_RAIDER_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    use_preset_no: 'number',
    use_union_occupied_option: 'array',
    use_union_raider_option: 'array',
    battle_map: 'array',
  },
};

// Guild
export const M_GUILD_ID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    oguild_id: 'string',
  },
};
export const M_GUILD_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    guild_name: 'string',
    world_name: 'string',
    guild_level: 'number',
    world_create_date: 'string',
    guild_keyword: 'array',
    guild_mark_icon: 'string',
    guild_master_name: 'string',
    guild_member_count: 'number',
    guild_member: 'array',
    guild_building: 'array',
    guild_skill: 'array',
    guild_ability: 'array',
  },
};

// Ranking
export const M_RANKING_SHAPE: ShapeDescriptor = { expectedKeys: {} };

// Notice
export const M_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: { notice: 'array' },
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
  expectedKeys: { patch_notice: 'array' },
};
export const M_EVENT_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: { event_notice: 'array' },
};
export const M_EVENT_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
  },
};
