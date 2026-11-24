import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 마비노기 영웅전 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 *
 * - null이 올 수 있는 문자열 키는 `'any'` 로 둔다 (validator가 null을 `'object'` 로만 허용하기 때문).
 */

// ─── ID ─────────────────────────────────────────────────────────────────────

export const HEROES_OCID_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ocid: 'string',
  },
};

// 포털 스펙은 최상위를 배열로 적지만 실제 응답은 `{ ranking: [...] }` 객체다 (2026-11-24 실측).
// 스펙 형태(배열)가 오면 불일치로 보고되고, 클라이언트는 그 배열을 그대로 돌려준다.
export const HEROES_RANKING_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    ranking: 'array',
  },
};

// ─── Character ──────────────────────────────────────────────────────────────

export const HEROES_CHARACTER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    character_name: 'string',
    character_date_create: 'any',
    access_flag: 'string',
    character_class_name: 'string',
    character_gender: 'string',
    character_exp: 'number',
    character_level: 'number',
    cairde_name: 'any',
    title_count: 'number',
    id_title_count: 'number',
    total_title_count: 'number',
    title_stat: 'array',
    skill_awakening: 'array',
    dress_point: 'object',
  },
};

export const HEROES_CHARACTER_TITLE_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'array',
  },
};

export const HEROES_CHARACTER_TITLE_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title_equipment: 'array',
  },
};

export const HEROES_CHARACTER_ITEM_EQUIPMENT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    item_equipment: 'array',
  },
};

export const HEROES_CHARACTER_STAT_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    stat: 'array',
  },
};

export const HEROES_CHARACTER_GUILD_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    guild_name: 'any',
  },
};

// ─── Meta ───────────────────────────────────────────────────────────────────

export const HEROES_ENCHANT_META_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    enchant_grade: 'string',
    enchant_available_slot_name: 'array',
    enchant_stat: 'array',
  },
};

// ─── Notice ─────────────────────────────────────────────────────────────────

export const HEROES_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    notice: 'array',
  },
};

export const HEROES_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date: 'string',
  },
};

export const HEROES_PATCH_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    patch_notice: 'array',
  },
};

export const HEROES_EVENT_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    event_notice: 'array',
  },
};

export const HEROES_EVENT_NOTICE_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    title: 'string',
    url: 'string',
    contents: 'string',
    date_event_start: 'any',
    date_event_end: 'any',
    ongoing_flag: 'any',
  },
};

// ─── Marketplace ────────────────────────────────────────────────────────────

export const HEROES_MARKET_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    next_cursor: 'any',
    item: 'array',
  },
};

export const HEROES_GOLD_MARKET_BUY_TOP_30_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    buy_gold: 'array',
  },
};

export const HEROES_GOLD_MARKET_SELL_TOP_30_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    sell_gold: 'array',
  },
};
