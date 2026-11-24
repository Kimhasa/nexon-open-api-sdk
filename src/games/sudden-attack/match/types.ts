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
   * - 매치 결과는 기본적으로 1: 승리, 2: 패배, 3: 무승부로 기록됩니다.
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

export interface SuddenAttackMatchList {
  /** 매치 목록 */
  readonly match: readonly SuddenAttackMatchSummary[];
}

export interface SuddenAttackMatchParticipant {
  /** 팀 정보 */
  readonly team_id: string;
  /**
   * 매치 결과
   * - 매치 결과는 기본적으로 1: 승리, 2: 패배, 3: 무승부로 기록됩니다.
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
   * -클랜전, 퀵매치 클랜전, 클랜 랭크전에서만 노출
   */
  readonly clan_name?: string | undefined;
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
