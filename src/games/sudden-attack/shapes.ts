import { arrayOf } from '../../core/validation/response-shape.js';
import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

export const OUID_SHAPE: ShapeDescriptor = {
  expectedKeys: { ouid: 'string' },
};

export const USER_BASIC_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    user_name: 'string',
    user_date_create: 'string',
    title_name: 'string',
    clan_name: 'string',
    manner_grade: 'string',
  },
};

export const USER_RANK_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    user_name: 'string',
    grade: 'string',
    grade_exp: 'number',
    grade_ranking: 'number',
    season_grade: 'string',
    season_grade_exp: 'number',
    season_grade_ranking: 'number',
  },
};

export const USER_TIER_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    user_name: 'string',
    solo_rank_match_tier: 'number',
    solo_rank_match_score: 'number',
    party_rank_match_tier: 'number',
    party_rank_match_score: 'number',
  },
};

export const USER_RECENT_INFO_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    user_name: 'string',
    recent_win_rate: 'number',
    recent_kill_death_rate: 'number',
    recent_assault_rate: 'number',
    recent_sniper_rate: 'number',
    recent_special_rate: 'number',
  },
};

export const MATCH_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: { match: 'array' },
};

export const MATCH_DETAIL_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    match_id: 'string',
    match_type: 'string',
    match_mode: 'string',
    date_match: 'string',
    match_map: 'string',
    match_detail: 'array',
  },
};

export const LOGO_SHAPE: ShapeDescriptor = {
  expectedKeys: { logo_image: 'string' },
};

export const GRADE_SHAPE = arrayOf({ expectedKeys: { grade: 'string', grade_image: 'string' } });

export const SEASON_GRADE_SHAPE = arrayOf({
  expectedKeys: { season_grade: 'string', season_grade_image: 'string' },
});

export const TIER_SHAPE = arrayOf({ expectedKeys: { tier: 'string', tier_image: 'string' } });
