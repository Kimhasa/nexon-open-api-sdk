/**
 * EA SPORTS FC Online API 엔드포인트 상수.
 *
 * @see https://openapi.nexon.com/game/fconline/
 */

const BASE = 'https://open.api.nexon.com/fconline/v1';
const STATIC = 'https://open.api.nexon.com/static/fconline/meta';
const CDN = 'https://open.api.nexon.com/live/externalAssets/common';

// ─── User (계정 정보 조회) ─────────────────────────────────────────
export const FC_USER_ENDPOINTS = {
  /** 계정 식별자(ouid) 조회 */
  ID: `${BASE}/id`,
  /** 기본 정보 조회 */
  BASIC: `${BASE}/user/basic`,
  /** 역대 최고 등급 조회 */
  MAX_DIVISION: `${BASE}/user/maxdivision`,
  /** 유저의 매치 기록 조회 */
  MATCH_LIST: `${BASE}/user/match`,
  /** 유저의 거래 기록 조회 */
  TRADE: `${BASE}/user/trade`,
} as const;

// ─── Match (매치 정보 조회) ────────────────────────────────────────
export const FC_MATCH_ENDPOINTS = {
  /** 모든 매치 기록 조회 */
  ALL: `${BASE}/match`,
  /** 매치 상세 기록 조회 */
  DETAIL: `${BASE}/match-detail`,
} as const;

// ─── Ranker (랭커 정보 조회) ───────────────────────────────────────
export const FC_RANKER_ENDPOINTS = {
  /** TOP 10,000 랭커 유저가 사용한 선수의 20경기 */
  STATS: `${BASE}/ranker-stats`,
} as const;

// ─── MetaData (메타데이터 정보 조회) ───────────────────────────────
export const FC_METADATA_ENDPOINTS = {
  /** 매치 종류(matchtype) 메타데이터 */
  MATCH_TYPE: `${STATIC}/matchtype.json`,
  /** 선수 고유 식별자(spid) 메타데이터 */
  SPID: `${STATIC}/spid.json`,
  /** 시즌 아이디(seasonId) 메타데이터 */
  SEASON_ID: `${STATIC}/seasonid.json`,
  /** 선수 포지션(spposition) 메타데이터 */
  SP_POSITION: `${STATIC}/spposition.json`,
  /** 등급 식별자(division) 메타데이터 */
  DIVISION: `${STATIC}/division.json`,
  /** 볼타 공식경기 등급 식별자 메타데이터 */
  DIVISION_VOLTA: `${STATIC}/division-volta.json`,
} as const;

// ─── Image (이미지 정보 조회) ──────────────────────────────────────
export const FC_IMAGE_ENDPOINTS = {
  /** 선수 액션샷 이미지 base URL (`/p{spid 또는 pid}.png` 붙여서 사용) */
  ACTION_SHOT: `${CDN}/playersAction`,
  /** 선수 이미지 base URL (`/p{spid 또는 pid}.png` 붙여서 사용) */
  PLAYER: `${CDN}/players`,
} as const;
