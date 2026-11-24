import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

export const NPC_SHOP_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    shop_tab_count: 'number',
    shop: 'array',
    date_inquire: 'string',
    date_shop_next_update: 'string',
  },
};

export const AUCTION_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: { auction_item: 'array', next_cursor: 'any' },
};

export const AUCTION_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: { auction_history: 'array', next_cursor: 'any' },
};

export const HORN_BUGLE_WORLD_HISTORY_SHAPE: ShapeDescriptor = {
  expectedKeys: { horn_bugle_world_history: 'array' },
};
