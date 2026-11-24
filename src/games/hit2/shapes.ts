import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 히트2 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── ID ─────────────────────────────────────────────────────────────────────

export const HIT2_OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const HIT2_CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    server_name: 'string',
    character_name: 'string',
    character_date_create: 'string',
    // 실제 응답은 date_ 가 붙은 이름으로 온다. 포털 스펙의 이름은 와도, 안 와도 경고하지 않는다 (2026-11-24 실측)
    character_date_last_login: 'optional',
    character_date_last_logout: 'optional',
    character_last_login: 'optional',
    character_last_logout: 'optional',
    character_class_group_name: 'string',
    character_class_name: 'string',
    character_level: 'number',
  },
};
