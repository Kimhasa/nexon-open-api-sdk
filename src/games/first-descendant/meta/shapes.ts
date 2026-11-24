import { arrayOf } from '../../../core/validation/response-shape.js';

// Nullable fields use 'any' to check that the key is present while allowing null.
export const TFD_ACQUISITION_DETAIL_META_SHAPE = arrayOf({
  expectedKeys: {
    acquisition_detail_id: 'string',
    acquisition_detail_name: 'string',
  },
});

export const TFD_ARCHE_TUNING_NODE_META_SHAPE = arrayOf({
  expectedKeys: {
    node_id: 'string',
    node_name: 'string',
    node_image_url: 'string',
    node_type: 'string',
    tier_id: 'string',
    required_tuning_point: 'number',
    node_effect: 'array',
  },
});

export const TFD_COLLECTIBLE_ITEM_META_SHAPE = arrayOf({
  expectedKeys: {
    collectible_item_id: 'string',
    collectible_item_name: 'string',
    collectible_item_description: 'string',
    collectible_item_narrative: 'string',
    collectible_item_tier_id: 'string',
    collectible_item_lounge_size: 'any',
    collect_type: 'string',
    decomposition_flag: 'string',
    decomposition_reward: 'any',
  },
});

export const TFD_CONSUMABLE_MATERIAL_META_SHAPE = arrayOf({
  expectedKeys: {
    consumable_material_id: 'string',
    image_url: 'any',
    consumable_material_name: 'string',
    required_mastery_rank_level: 'any',
    material_type: 'string',
    acquisition_detail: 'array',
    amorphous_reward: 'array',
  },
});

export const TFD_CORE_TYPE_META_SHAPE = arrayOf({
  expectedKeys: {
    core_type_id: 'string',
    core_type: 'string',
    core_option: 'array',
  },
});

export const TFD_CUSTOMIZING_ITEM_META_SHAPE = arrayOf({
  expectedKeys: {
    customizing_item_id: 'string',
    customizing_item_name: 'string',
    customizing_item_type: 'string',
    customizing_item_tier_id: 'any',
    customizing_item_description: 'string',
    customizing_item_image_url: 'any',
    customizing_item_evolution_stage: 'array',
    available_descendant: 'array',
  },
});

export const TFD_DESCENDANT_META_SHAPE = arrayOf({
  expectedKeys: {
    descendant_id: 'string',
    descendant_name: 'string',
    descendant_group_id: 'string',
    descendant_image_url: 'string',
    descendant_stat: 'array',
    descendant_skill: 'array',
  },
});

export const TFD_DESCENDANT_GROUP_META_SHAPE = arrayOf({
  expectedKeys: {
    descendant_group_id: 'string',
    descendant_group_name: 'string',
  },
});

export const TFD_EXTERNAL_COMPONENT_META_SHAPE = arrayOf({
  expectedKeys: {
    external_component_id: 'string',
    external_component_name: 'string',
    image_url: 'string',
    external_component_equipment_type: 'string',
    external_component_tier_id: 'string',
    available_core_slot: 'array',
    base_stat: 'array',
    set_option_detail: 'array',
  },
});

export const TFD_FELLOW_META_SHAPE = arrayOf({
  expectedKeys: {
    fellow_id: 'string',
    fellow_name: 'string',
    fellow_tier_id: 'string',
    fellow_detail: 'array',
  },
});

export const TFD_MEDAL_META_SHAPE = arrayOf({
  expectedKeys: {
    medal_id: 'string',
    medal_detail: 'array',
  },
});

export const TFD_MODULE_META_SHAPE = arrayOf({
  expectedKeys: {
    module_name: 'string',
    module_id: 'string',
    image_url: 'string',
    module_type: 'any',
    module_tier_id: 'string',
    module_socket_type: 'any',
    module_class: 'string',
    available_weapon_type: 'array',
    available_descendant_id: 'array',
    available_module_slot_type: 'array',
    module_stat: 'array',
  },
});

export const TFD_NODE_ITEM_META_SHAPE = arrayOf({
  expectedKeys: {
    node_item_id: 'string',
    node_item_name: 'string',
    node_item_image_url: 'string',
    node_item_description: 'string',
    node_item_socket_type: 'string',
    node_item_effect: 'array',
  },
});

export const TFD_NODE_SOCKET_TYPE_META_SHAPE = arrayOf({
  expectedKeys: {
    node_item_socket_type: 'string',
    node_item_socket_name: 'string',
    node_item_socket_image_url: 'any',
  },
});

export const TFD_REACTOR_META_SHAPE = arrayOf({
  expectedKeys: {
    reactor_id: 'string',
    reactor_name: 'string',
    image_url: 'string',
    reactor_tier_id: 'string',
    reactor_skill_power: 'array',
    optimized_condition_type: 'any',
  },
});

export const TFD_RESEARCH_META_SHAPE = arrayOf({
  expectedKeys: {
    research_id: 'string',
    research_name: 'string',
    repeatable_research: 'boolean',
    research_type: 'string',
    research_time: 'number',
    research_cost: 'array',
    research_boost_cost: 'array',
    research_result: 'array',
    research_material: 'array',
    available_research_count: 'any',
  },
});

export const TFD_REWARD_META_SHAPE = arrayOf({
  expectedKeys: {
    map_id: 'string',
    map_name: 'string',
    battle_zone: 'array',
  },
});

export const TFD_STAT_META_SHAPE = arrayOf({
  expectedKeys: {
    stat_id: 'string',
    stat_name: 'string',
    stat_order_no: 'any',
  },
});

export const TFD_TIER_META_SHAPE = arrayOf({
  expectedKeys: {
    tier_id: 'string',
    tier_name: 'string',
  },
});

export const TFD_TITLE_META_SHAPE = arrayOf({
  expectedKeys: {
    title_id: 'string',
    title_name: 'string',
  },
});

export const TFD_VEHICLE_META_SHAPE = arrayOf({
  expectedKeys: {
    vehicle_id: 'string',
    vehicle_name: 'string',
    vehicle_description: 'string',
    vehicle_tier_id: 'string',
    image_url: 'string',
    stat_effect: 'array',
    stat_effect_per_level: 'array',
  },
});

export const TFD_VOID_BATTLE_META_SHAPE = arrayOf({
  expectedKeys: {
    void_battle_id: 'string',
    void_battle_name: 'string',
  },
});

export const TFD_WEAPON_META_SHAPE = arrayOf({
  expectedKeys: {
    weapon_name: 'string',
    weapon_id: 'string',
    image_url: 'string',
    weapon_type: 'string',
    weapon_category: 'string',
    weapon_tier_id: 'string',
    weapon_rounds_type: 'string',
    available_core_slot: 'array',
    base_stat: 'array',
    firearm_atk: 'array',
    weapon_perk_ability_name: 'any',
    weapon_perk_ability_description: 'any',
    weapon_perk_ability_image_url: 'any',
  },
});

export const TFD_WEAPON_TYPE_META_SHAPE = arrayOf({
  expectedKeys: {
    weapon_type: 'string',
    weapon_type_name: 'string',
  },
});

export const TFD_ADAPT_LEVEL_META_SHAPE = arrayOf({
  expectedKeys: {
    level: 'number',
    exp_per_level: 'number',
  },
});

export const TFD_AMORPHOUS_REWARD_META_SHAPE = arrayOf({
  expectedKeys: {
    amorphous_reward_id: 'string',
    open_reward: 'array',
  },
});

export const TFD_ARCHE_TUNING_BOARD_META_SHAPE = arrayOf({
  expectedKeys: {
    arche_tuning_board_id: 'string',
    row_size: 'number',
    column_size: 'number',
    node: 'array',
  },
});

export const TFD_ARCHE_TUNING_BOARD_GROUP_META_SHAPE = arrayOf({
  expectedKeys: {
    arche_tuning_board_group_id: 'string',
    descendant_group_id: 'string',
    arche_tuning_board_id: 'string',
  },
});

export const TFD_CORE_SLOT_META_SHAPE = arrayOf({
  expectedKeys: {
    core_slot_id: 'string',
    available_weapon_id: 'array',
    available_external_component_id: 'array',
    available_core_type_id: 'array',
  },
});

export const TFD_DESCENDANT_LEVEL_DETAIL_META_SHAPE = arrayOf({
  expectedKeys: {
    descendant_level: 'number',
    exp_per_level: 'number',
  },
});

export const TFD_FELLOW_LEVEL_DETAIL_META_SHAPE = arrayOf({
  expectedKeys: {
    fellow_level: 'number',
    exp_per_level: 'number',
  },
});

export const TFD_MASTERY_RANK_LEVEL_DETAIL_META_SHAPE = arrayOf({
  expectedKeys: {
    mastery_rank_level: 'optional',
    exp_per_level: 'number',
    mastery_level: 'number',
  },
});
