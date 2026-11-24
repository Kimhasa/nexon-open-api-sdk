const BASE = 'https://open.api.nexon.com/suddenattack/v1';
const STATIC = 'https://open.api.nexon.com/static/suddenattack/meta';

export const SUDDEN_ATTACK_ENDPOINTS = {
  ID: `${BASE}/id`,
  USER_BASIC: `${BASE}/user/basic`,
  USER_RANK: `${BASE}/user/rank`,
  USER_TIER: `${BASE}/user/tier`,
  USER_RECENT_INFO: `${BASE}/user/recent-info`,
  MATCH: `${BASE}/match`,
  MATCH_DETAIL: `${BASE}/match-detail`,
  LOGO: `${STATIC}/logo`,
  GRADE: `${STATIC}/grade`,
  SEASON_GRADE: `${STATIC}/season_grade`,
  TIER: `${STATIC}/tier`,
} as const;
