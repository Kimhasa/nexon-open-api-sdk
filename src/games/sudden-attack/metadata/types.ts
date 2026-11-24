/** 공식 서든어택 로고 이미지 주소. */
export interface SuddenAttackLogo {
  /** 서든어택 로고 이미지 */
  readonly logo_image: string;
}

/** 통합 계급의 이름과 배지 이미지 주소. */
export interface SuddenAttackGradeMeta {
  /** 통합 계급 이름 */
  readonly grade: string;
  /** 통합 계급 이미지 */
  readonly grade_image: string;
}

/** 시즌 계급의 이름과 배지 이미지 주소. */
export interface SuddenAttackSeasonGradeMeta {
  /** 시즌 계급 이름 */
  readonly season_grade: string;
  /** 시즌 계급 이미지 */
  readonly season_grade_image: string;
}

/** 랭크전 티어의 이름과 배지 이미지 주소. */
export interface SuddenAttackTierMeta {
  /** 랭크전 티어 배지의 이름(예: "BRONZE I") */
  readonly tier: string;
  /** 랭크전 티어 배지 이미지 주소 */
  readonly tier_image: string;
}
