import type { SuddenAttackOuid } from '../types.js';

export const SUDDEN_ATTACK_MATCH_MODES = [
  '개인전',
  '데스매치',
  '폭파미션',
  '진짜를 모아라',
] as const;

export type SuddenAttackMatchMode = (typeof SUDDEN_ATTACK_MATCH_MODES)[number];

export const SUDDEN_ATTACK_MATCH_TYPES = [
  '일반전',
  '클랜전',
  '퀵매치 클랜전',
  '클랜 랭크전',
  '랭크전 솔로',
  '랭크전 파티',
  '토너먼트',
] as const;

export type SuddenAttackMatchType = (typeof SUDDEN_ATTACK_MATCH_TYPES)[number];

export interface SuddenAttackMatchListRequest {
  /** 계정 식별자 */
  readonly ouid: SuddenAttackOuid;
  /** 게임 모드 */
  readonly match_mode: SuddenAttackMatchMode;
  /** 매치 유형 */
  readonly match_type?: SuddenAttackMatchType | undefined;
}

/** 전적 목록에 들어가는 매치 한 건과 내 킬·데스·어시스트. */
export interface SuddenAttackMatchSummary {
  /** 매치 고유 식별자 */
  readonly match_id: string;
  /** 매치 유형 */
  readonly match_type: string;
  /** 게임 모드 */
  readonly match_mode: string;
  /** 매치 생성 일(시) (UTC0) */
  readonly date_match: string;
  /**
   * 매치 결과
   * - 문자열 "1"은 승리, "2"는 패배, "3"은 무승부다.
   * - 진짜를 모아라 모드는 승리 및 패배 여부가 기록되지 않습니다.
   * - 개인전 및 진짜를 모아라 모드에서는 킬 수가 높은 순으로 순위가 결정되며, 동일한 킬 수일 경우 데스 수가 적은 순으로 순위가 산정됩니다.
   */
  readonly match_result: string;
  /** 킬 기록 */
  readonly kill: number;
  /** 데스 기록 */
  readonly death: number;
  /** 어시스트 기록 */
  readonly assist: number;
}

/** 모드와 유형으로 검색한 최근 매치 목록. 최대 1,000개다. */
export interface SuddenAttackMatchList {
  /** 매치 목록 */
  readonly match: readonly SuddenAttackMatchSummary[];
}

/** 매치에 참가한 유저의 팀, 계급과 킬·데스 등 전적. */
export interface SuddenAttackMatchParticipant {
  /** 팀 정보 */
  readonly team_id: string;
  /**
   * 매치 결과
   * - 문자열 "1"은 승리, "2"는 패배, "3"은 무승부다.
   * - 진짜를 모아라 모드는 승리 및 패배 여부가 기록되지 않습니다.
   * - 개인전 및 진짜를 모아라 모드에서는 킬 수가 높은 순으로 순위가 결정되며, 동일한 킬 수일 경우 데스 수가 적은 순으로 순위가 산정됩니다.
   */
  readonly match_result: string;
  /** 닉네임 */
  readonly user_name: string;
  /** 시즌 계급 */
  readonly season_grade: string;
  /**
   * 클랜 이름
   * - 클랜전, 퀵매치 클랜전, 클랜 랭크전에서만 제공된다.
   */
  readonly clan_name?: string | undefined;
  /**
   * 길드 이름. 포털 스펙에는 없고 실제 응답에 있는 필드 (2026-11-24 실측).
   * 실측에서는 모든 참가자가 null이었다. 클랜 이름은 `clan_name` 으로 온다.
   */
  readonly guild_name?: string | null | undefined;
  /** 킬 기록 */
  readonly kill: number;
  /** 데스 기록 */
  readonly death: number;
  /** 헤드샷 기록 */
  readonly headshot: number;
  /** 데미지 기록 */
  readonly damage: number;
  /** 어시스트 기록 */
  readonly assist: number;
}

/** 매치 한 건의 맵, 유형과 참가자별 전적. */
export interface SuddenAttackMatchDetail {
  /** 매치 고유 식별자 */
  readonly match_id: string;
  /** 매치 유형 */
  readonly match_type: string;
  /** 게임 모드 */
  readonly match_mode: string;
  /** 매치 생성 일(시) (UTC0) */
  readonly date_match: string;
  /** 맵 */
  readonly match_map: string;
  /** 매치 참여 유저 정보 */
  readonly match_detail: readonly SuddenAttackMatchParticipant[];
}
