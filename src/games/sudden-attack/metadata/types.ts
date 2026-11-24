export interface SuddenAttackLogo {
  /** 서든어택 로고 이미지 */
  readonly logo_image: string;
}

export interface SuddenAttackGradeMeta {
  /** 통합 계급 이름 */
  readonly grade: string;
  /** 통합 계급 이미지 */
  readonly grade_image: string;
}

export interface SuddenAttackSeasonGradeMeta {
  /** 시즌 계급 이름 */
  readonly season_grade: string;
  /** 시즌 계급 이미지 */
  readonly season_grade_image: string;
}

export interface SuddenAttackTierMeta {
  /** 랭크전 티어 이름 */
  readonly tier: string;
  /** 랭크전 티어 이미지 */
  readonly tier_image: string;
}
