import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 카트라이더 러쉬플러스 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── User ───────────────────────────────────────────────────────────────────

export const KARTRIDER_OUID_LOOKUP_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid_info: 'array',
  },
};

export const KARTRIDER_USER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    racer_name: 'string',
    racer_date_create: 'string',
    racer_date_last_login: 'string',
    racer_date_last_logout: 'string',
    racer_level: 'number',
  },
};

export const KARTRIDER_USER_TITLE_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title_equipment: 'array',
  },
};

// ─── Notice ─────────────────────────────────────────────────────────────────

export const KARTRIDER_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    notice: 'array',
  },
};

export const KARTRIDER_SEASON_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    season_notice: 'array',
  },
};

export const KARTRIDER_EVENT_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    event_notice: 'array',
  },
};

export const KARTRIDER_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
    notice_tag: 'array',
  },
};
