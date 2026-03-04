// ─── GET /maplestory/v1/user/achievement ─────────────────────────────────────

/** 개별 업적 정보 */
export interface AchievementInfo {
  /** 업적 명 */
  readonly achievement_name: string;
  /** 업적 설명 */
  readonly achievement_description: string;
}

/** 계정별 업적 정보 */
export interface AccountAchievement {
  /** 메이플스토리 계정 식별자 */
  readonly account_id: string;
  /** 달성 업적 목록 */
  readonly achievement_achieve: AchievementInfo[];
}

/** GET /maplestory/v1/user/achievement 응답 */
export interface Achievement {
  /** 메이플스토리 계정 목록 */
  readonly account_list: AccountAchievement[];
}
