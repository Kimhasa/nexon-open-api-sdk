import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

// The shared validator uses 'any' to require a key whose value may be either a scalar, an array, or null.
export const OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

export const CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_name: 'string',
    world_name: 'string',
    character_gender: 'string',
    character_class: 'string',
    character_class_level: 'string',
    character_level: 'number',
    character_exp: 'number',
    character_exp_rate: 'string',
    character_guild_name: 'any',
    character_image: 'string',
    character_date_create: 'string',
    access_flag: 'string',
    liberation_quest_clear: 'string',
  },
};

export const CHARACTER_POPULARITY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    popularity: 'number',
  },
};

export const CHARACTER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_class: 'string',
    final_stat: 'array',
    remain_ap: 'number',
    mentorship_stat: 'array',
  },
};

export const CHARACTER_HYPER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
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
    date: 'any',
    ability_grade: 'string',
    ability_info: 'array',
    remain_fame: 'number',
    preset_no: 'any',
    ability_preset_1: 'object',
    ability_preset_2: 'object',
    ability_preset_3: 'object',
  },
};

export const CHARACTER_ITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_gender: 'string',
    character_class: 'string',
    preset_no: 'any',
    item_equipment: 'array',
    item_equipment_preset_1: 'array',
    item_equipment_preset_2: 'array',
    item_equipment_preset_3: 'array',
    title: 'object',
    medal_shape: 'object',
    dragon_equipment: 'array',
    mechanic_equipment: 'array',
  },
};

export const CHARACTER_CASHITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_gender: 'string',
    character_class: 'string',
    character_look_mode: 'string',
    preset_no: 'any',
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
    date: 'any',
    character_class: 'string',
    symbol: 'array',
  },
};

export const CHARACTER_SET_EFFECT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    set_effect: 'array',
  },
};

export const CHARACTER_BEAUTY_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_gender: 'string',
    character_class: 'string',
    character_hair: 'object',
    character_face: 'object',
    character_skin: 'object',
    additional_character_hair: 'object',
    additional_character_face: 'object',
    additional_character_skin: 'object',
  },
};

export const CHARACTER_ANDROID_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    android_name: 'any',
    android_nickname: 'any',
    android_icon: 'any',
    android_description: 'any',
    android_hair: 'object',
    android_face: 'object',
    android_skin: 'object',
    android_cash_item_equipment: 'array',
    android_ear_sensor_clip_flag: 'string',
    android_gender: 'any',
    android_grade: 'any',
    android_non_humanoid_flag: 'string',
    android_shop_usable_flag: 'string',
    preset_no: 'number',
    android_preset_1: 'object',
    android_preset_2: 'object',
    android_preset_3: 'object',
  },
};

export const CHARACTER_PET_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    pet_1_name: 'any',
    pet_1_nickname: 'any',
    pet_1_icon: 'any',
    pet_1_description: 'any',
    pet_1_equipment: 'object',
    pet_1_auto_skill: 'object',
    pet_1_pet_type: 'any',
    pet_1_skill: 'any',
    pet_1_date_expire: 'any',
    pet_1_appearance: 'any',
    pet_1_appearance_icon: 'any',
    pet_1_potential: 'any',
    pet_2_name: 'any',
    pet_2_nickname: 'any',
    pet_2_icon: 'any',
    pet_2_description: 'any',
    pet_2_equipment: 'object',
    pet_2_auto_skill: 'object',
    pet_2_pet_type: 'any',
    pet_2_skill: 'any',
    pet_2_date_expire: 'any',
    pet_2_appearance: 'any',
    pet_2_appearance_icon: 'any',
    pet_2_potential: 'any',
    pet_3_name: 'any',
    pet_3_nickname: 'any',
    pet_3_icon: 'any',
    pet_3_description: 'any',
    pet_3_equipment: 'object',
    pet_3_auto_skill: 'object',
    pet_3_pet_type: 'any',
    pet_3_skill: 'any',
    pet_3_date_expire: 'any',
    pet_3_appearance: 'any',
    pet_3_appearance_icon: 'any',
    pet_3_potential: 'any',
  },
};

export const CHARACTER_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_class: 'string',
    character_skill_grade: 'string',
    character_skill: 'array',
  },
};

export const CHARACTER_LINK_SKILL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_class: 'string',
    character_link_skill: 'array',
    character_link_skill_preset_1: 'array',
    character_link_skill_preset_2: 'array',
    character_link_skill_preset_3: 'array',
    character_owned_link_skill: 'object',
    character_owned_link_skill_preset_1: 'object',
    character_owned_link_skill_preset_2: 'object',
    character_owned_link_skill_preset_3: 'object',
  },
};

export const CHARACTER_VMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_class: 'string',
    character_v_core_equipment: 'array',
    character_v_matrix_remain_slot_upgrade_point: 'number',
  },
};

export const CHARACTER_HEXAMATRIX_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_hexa_core_equipment: 'any',
  },
};

export const CHARACTER_HEXAMATRIX_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_class: 'any',
    character_hexa_stat_core: 'array',
    character_hexa_stat_core_2: 'any',
    character_hexa_stat_core_3: 'any',
    preset_hexa_stat_core: 'array',
    preset_hexa_stat_core_2: 'any',
    preset_hexa_stat_core_3: 'any',
  },
};

export const CHARACTER_DOJANG_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    character_class: 'string',
    world_name: 'string',
    dojang_best_floor: 'number',
    date_dojang_record: 'any',
    dojang_best_time: 'number',
  },
};

export const CHARACTER_FAMILIAR_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    familiar_link_slot: 'array',
    familiar_info: 'array',
  },
};

export const USER_UNION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    union_level: 'number',
    union_grade: 'string',
    union_artifact_level: 'number',
    union_artifact_exp: 'number',
    union_artifact_point: 'number',
  },
};

export const USER_UNION_RAIDER_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    union_raider_stat: 'array',
    union_occupied_stat: 'array',
    union_inner_stat: 'array',
    union_block: 'array',
    use_preset_no: 'number',
    union_raider_preset_1: 'object',
    union_raider_preset_2: 'object',
    union_raider_preset_3: 'object',
    union_raider_preset_4: 'object',
    union_raider_preset_5: 'object',
  },
};

export const USER_UNION_ARTIFACT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    union_artifact_effect: 'array',
    union_artifact_crystal: 'array',
    union_artifact_remain_ap: 'number',
  },
};

export const USER_UNION_CHAMPION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    date: 'any',
    union_champion: 'array',
    champion_badge_total_info: 'array',
  },
};

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
  },
};
