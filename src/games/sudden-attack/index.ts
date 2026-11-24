export { SuddenAttackClient } from './SuddenAttackClient.js';
export { SuddenAttackMatchClient } from './match/SuddenAttackMatchClient.js';
export { SuddenAttackMetadataClient } from './metadata/SuddenAttackMetadataClient.js';
export { SuddenAttackUserClient } from './user/SuddenAttackUserClient.js';

export type { SuddenAttackOuid, SuddenAttackOuidResponse } from './types.js';
export type {
  SuddenAttackUserBasic,
  SuddenAttackUserRank,
  SuddenAttackUserTier,
  SuddenAttackUserRecentInfo,
} from './user/types.js';
export type {
  SuddenAttackMatchMode,
  SuddenAttackMatchType,
  SuddenAttackMatchListRequest,
  SuddenAttackMatchSummary,
  SuddenAttackMatchList,
  SuddenAttackMatchParticipant,
  SuddenAttackMatchDetail,
} from './match/types.js';
export type {
  SuddenAttackLogo,
  SuddenAttackGradeMeta,
  SuddenAttackSeasonGradeMeta,
  SuddenAttackTierMeta,
} from './metadata/types.js';
