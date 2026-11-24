import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * V4 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── ID ─────────────────────────────────────────────────────────────────────

export const V4_OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const V4_CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    server_name: 'string',
    character_name: 'string',
    character_date_create: 'string',
    character_create_type: 'any',
    character_date_last_login: 'string',
    character_date_last_logout: 'string',
    character_class_name: 'string',
    character_level: 'number',
  },
};

export const V4_CHARACTER_HONOR_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    honor: 'array',
  },
};

export const V4_CHARACTER_HONOR_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    honor_equipment: 'array',
  },
};
