import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * EA SPORTS FC Online 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── User / ID ──────────────────────────────────────────────────────────────

export const FC_OUID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
  },
};

export const FC_USER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ouid: 'string',
    nickname: 'string',
    level: 'number',
  },
};

export const FC_MAX_DIVISION_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    matchType: 'number',
    division: 'number',
    achievementDate: 'string',
  },
};

// ─── Match ──────────────────────────────────────────────────────────────────

export const FC_MATCH_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    matchId: 'string',
    matchDate: 'string',
    matchType: 'number',
    matchInfo: 'array',
  },
};
