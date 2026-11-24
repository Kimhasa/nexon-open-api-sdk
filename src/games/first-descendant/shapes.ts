import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 퍼스트 디센던트 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 *
 * 정적 메타데이터(`/static/tfd/meta/...`)는 응답 최상위가 배열이라 top-level 키가 없다.
 * `validateShape` 는 객체만 다루므로 메타데이터에는 descriptor를 두지 않는다.
 *
 * 키가 필요한 API는 실응답을 확인하지 못했다(스펙 기준). 스펙이 nullable 여부를 밝히지 않는
 * 부가 필드는 오탐을 피하려고 타입 대신 존재 여부(`'any'`)만 확인한다.
 */

// ─── User / ID ──────────────────────────────────────────────────────────────

export const TFD_OUID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
  },
};

export const TFD_USER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    user_name: 'string',
    platform_type: 'string',
    mastery_rank_level: 'number',
    mastery_rank_exp: 'number',
    title_prefix_id: 'any',
    title_suffix_id: 'any',
    os_language: 'any',
    game_language: 'any',
    medal_id: 'any',
    medal_level: 'any',
  },
};

export const TFD_USER_DESCENDANT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    user_name: 'string',
    descendant_id: 'string',
    descendant_slot_id: 'any',
    descendant_level: 'number',
    module_max_capacity: 'number',
    module_capacity: 'number',
    energy_activator_use_count: 'any',
    module: 'array',
    customizing: 'any',
  },
};

export const TFD_USER_WEAPON_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    user_name: 'string',
    weapon: 'array',
  },
};

export const TFD_USER_REACTOR_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    user_name: 'string',
    reactor_id: 'string',
    reactor_slot_id: 'any',
    reactor_level: 'number',
    reactor_additional_stat: 'array',
    reactor_enchant_level: 'any',
  },
};

export const TFD_USER_EXTERNAL_COMPONENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    user_name: 'string',
    external_component: 'array',
  },
};

export const TFD_USER_ARCHE_TUNING_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    descendant_group_id: 'string',
    arche_tuning_board_group_id: 'any',
    arche_tuning: 'array',
  },
};

// ─── Recommendation ─────────────────────────────────────────────────────────

export const TFD_RECOMMENDATION_MODULE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    descendant: 'object',
    weapon: 'object',
  },
};

// ─── Leaderboard ────────────────────────────────────────────────────────────

// leaderboard는 스펙상 nullable이라 'array' 대신 존재 여부만 확인한다
export const TFD_LEADERBOARD_VOID_INTERCEPT_BATTLE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    leaderboard: 'any',
  },
};

export const TFD_LEADERBOARD_VOID_EROSION_PURGE_CHALLENGE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    leaderboard: 'any',
  },
};
