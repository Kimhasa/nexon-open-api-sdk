import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 바람의나라 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── ID ─────────────────────────────────────────────────────────────────────

export const BARAM_OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const BARAM_CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_name: 'string',
    character_date_create: 'string',
    character_create_type_name: 'string',
    character_class_name: 'string',
    character_nation_name: 'string',
    character_gender: 'string',
    character_exp: 'number',
    character_level: 'number',
  },
};

export const BARAM_CHARACTER_TITLE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'array',
  },
};

export const BARAM_CHARACTER_TITLE_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title_equipment: 'array',
  },
};

export const BARAM_CHARACTER_ITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    item_equipment: 'array',
  },
};

export const BARAM_CHARACTER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    stat: 'array',
  },
};

export const BARAM_CHARACTER_GUILD_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    // 문파 미가입 캐릭터에서 null이 올 수 있어 타입은 검사하지 않고 키 존재만 본다
    guild_name: 'any',
  },
};
