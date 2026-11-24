import { arrayOf } from '../../core/validation/response-shape.js';
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

export const FC_MAX_DIVISION_SHAPE = arrayOf(
  {
    expectedKeys: {
      matchType: 'number',
      division: 'number',
      achievementDate: 'string',
    },
  },
  { allowSingleObject: true },
);

export const FC_TRADE_LIST_SHAPE = arrayOf({
  expectedKeys: {
    tradeDate: 'string',
    saleSn: 'string',
    spid: 'number',
    grade: 'number',
    value: 'number',
  },
});

// ─── Match ──────────────────────────────────────────────────────────────────

export const FC_MATCH_ID_LIST_SHAPE = arrayOf('string');

export const FC_MATCH_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    matchId: 'string',
    matchDate: 'string',
    matchType: 'number',
    matchInfo: 'array',
  },
};

// ─── Ranker ─────────────────────────────────────────────────────────────────

export const FC_RANKER_STATS_SHAPE = arrayOf({
  expectedKeys: {
    spId: 'optional',
    spid: 'optional',
    spPosition: 'number',
    status: 'object',
    createDate: 'string',
  },
});

// ─── Metadata ───────────────────────────────────────────────────────────────

export const FC_MATCH_TYPE_META_SHAPE = arrayOf({
  expectedKeys: { matchtype: 'number', desc: 'string' },
});

export const FC_SPID_META_SHAPE = arrayOf({
  expectedKeys: { id: 'number', name: 'string' },
});

export const FC_SEASON_ID_META_SHAPE = arrayOf({
  expectedKeys: { seasonId: 'number', className: 'string', seasonImg: 'string' },
});

export const FC_SP_POSITION_META_SHAPE = arrayOf({
  expectedKeys: { spposition: 'number', desc: 'string' },
});

export const FC_DIVISION_META_SHAPE = arrayOf({
  expectedKeys: { divisionId: 'number', divisionName: 'string' },
});

export const FC_SEASON_META_SHAPE = arrayOf({
  // 포털 스펙과 실제 정적 응답의 시즌 ID 키 및 타입이 다릅니다.
  expectedKeys: { matchtype: 'number', seasonId: 'optional', seasonid: 'optional' },
});

export const FC_CLASS_META_SHAPE = arrayOf({
  expectedKeys: { class: 'number', className: 'string', classImg: 'string' },
});
