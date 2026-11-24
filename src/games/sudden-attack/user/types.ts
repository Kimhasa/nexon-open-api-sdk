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

export interface SuddenAttackUserRank {
  /** 닉네임 */
  readonly user_name: string;
  /** 통합 계급 */
  readonly grade: string;
  /** 통합 계급 경험치 */
  readonly grade_exp: number;
  /** 통합 계급 랭킹 */
  readonly grade_ranking: number;
  /** 시즌 계급 */
  readonly season_grade: string;
  /** 시즌 계급 경험치 */
  readonly season_grade_exp: number;
  /** 시즌 계급 랭킹 */
  readonly season_grade_ranking: number;
}

export interface SuddenAttackUserTier {
  /** 닉네임 */
  readonly user_name: string;
  /** 솔로 랭크전 티어 */
  readonly solo_rank_match_tier: number;
  /** 솔로 랭크전 점수 */
  readonly solo_rank_match_score: number;
  /** 파티 랭크전 티어 */
  readonly party_rank_match_tier: number;
  /** 파티 랭크전 점수 */
  readonly party_rank_match_score: number;
}

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
