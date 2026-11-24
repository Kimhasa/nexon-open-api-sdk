export { FirstDescendantClient } from './FirstDescendantClient.js';

// Common types
export { TFD_LANGUAGE_CODES } from './types.js';
export type { TfdOuid, TfdLanguageCode, TfdPlatformType } from './types.js';

// User types
export type {
  TfdUserRequest,
  TfdUserLocalizedRequest,
  TfdUserArcheTuningRequest,
  TfdUserModule,
  TfdUserAdditionalStat,
  TfdUserCore,
  TfdUserBasic,
  TfdUserCustomizingPaint,
  TfdUserCustomizing,
  TfdUserDescendant,
  TfdUserWeaponItem,
  TfdUserWeapon,
  TfdUserReactor,
  TfdUserExternalComponentItem,
  TfdUserExternalComponent,
  TfdUserArcheTuningNode,
  TfdUserArcheTuningBoard,
  TfdUserArcheTuningSlot,
  TfdUserArcheTuning,
} from './user/types.js';

// Recommendation types
export type {
  TfdRecommendationPeriod,
  TfdRecommendationModuleRequest,
  TfdRecommendationModuleItem,
  TfdRecommendationModuleDescendant,
  TfdRecommendationModuleWeapon,
  TfdRecommendationModule,
} from './recommendation/types.js';

// Leaderboard types
export type {
  TfdLeaderboardType,
  TfdLeaderboardSquadUserCount,
  TfdLeaderboardSoloFilter,
  TfdLeaderboardSquadFilter,
  TfdLeaderboardPlatformFilter,
  TfdLeaderboardVoidInterceptBattleContentsType,
  TfdLeaderboardVoidInterceptBattleRequest,
  TfdLeaderboardVoidErosionPurgeChallengeRequest,
  TfdLeaderboardMember,
  TfdLeaderboardVoidInterceptBattleEntry,
  TfdLeaderboardVoidInterceptBattle,
  TfdLeaderboardVoidErosionPurgeChallengeEntry,
  TfdLeaderboardVoidErosionPurgeChallenge,
} from './leaderboard/types.js';

// Meta types — 메타데이터 타입은 70개 가까이 되고 전부 공개 대상이라 파일 단위로 내보낸다
export type * from './meta/types.js';
