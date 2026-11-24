/** 유저 프로필에 표시할 닉네임, 장착 칭호, 소속 클랜과 매너 등급. */
export interface SuddenAttackUserBasic {
  /** 닉네임 */
  readonly user_name: string;
  /** 계정 생성 일(시) (UTC0) */
  readonly user_date_create: string;
  /** 장착 칭호 명 */
  readonly title_name: string;
  /** 소속 클랜 명 */
  readonly clan_name: string;
  /** 매너 등급 */
  readonly manner_grade: string;
}

/** 게임 접속 종료 시 갱신되는 통합·시즌 계급, 경험치와 순위. */
export interface SuddenAttackUserRank {
  /** 닉네임 */
  readonly user_name: string;
  /** 통합 계급 */
  readonly grade: string;
  /** 통합 계급 경험치 */
  readonly grade_exp: number;
  /** 통합 계급 순위 */
  readonly grade_ranking: number;
  /** 시즌 계급 */
  readonly season_grade: string;
  /** 시즌 계급 경험치 */
  readonly season_grade_exp: number;
  /** 시즌 계급 순위 */
  readonly season_grade_ranking: number;
}

/** 게임 접속 종료 시 갱신되는 솔로·파티 랭크전 티어와 점수. */
export interface SuddenAttackUserTier {
  /** 닉네임 */
  readonly user_name: string;
  /** 솔로 랭크전 티어. 숫자가 아닌 문자열로 온다 (포털 스펙은 숫자로 적지만 2026-11-24 실제 응답은 문자열) */
  readonly solo_rank_match_tier: string;
  /** 솔로 랭크전 점수 */
  readonly solo_rank_match_score: number;
  /** 파티 랭크전 티어. 숫자가 아닌 문자열로 온다 (포털 스펙은 숫자로 적지만 2026-11-24 실제 응답은 문자열) */
  readonly party_rank_match_tier: string;
  /** 파티 랭크전 점수 */
  readonly party_rank_match_score: number;
}

/** 매치 종료 시 갱신되는 최근 승률과 무기별 킬데스. */
export interface SuddenAttackUserRecentInfo {
  /** 닉네임 */
  readonly user_name: string;
  /** 최근 승률 */
  readonly recent_win_rate: number;
  /** 최근 킬데스 */
  readonly recent_kill_death_rate: number;
  /** 최근 돌격소총 킬데스 */
  readonly recent_assault_rate: number;
  /** 최근 저격소총 킬데스 */
  readonly recent_sniper_rate: number;
  /** 최근 특수총 킬데스 */
  readonly recent_special_rate: number;
}
