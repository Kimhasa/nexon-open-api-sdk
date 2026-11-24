import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 바람의나라: 연 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── ID ─────────────────────────────────────────────────────────────────────

export const BARAM_YEON_OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const BARAM_YEON_CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    server_name: 'string',
    character_name: 'string',
    character_date_create: 'string',
    character_class_group_name: 'string',
    character_class_name: 'string',
    character_nation: 'string',
    character_gender: 'string',
    character_exp: 'number',
    character_level: 'number',
  },
};

export const BARAM_YEON_CHARACTER_TITLE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'array',
  },
};

export const BARAM_YEON_CHARACTER_TITLE_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title_equipment: 'array',
  },
};
