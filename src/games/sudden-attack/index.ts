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

// sub-path만으로 클라이언트를 만들 수 있게 HTTP 계층을 함께 내보낸다
export { HttpClient } from '../../core/http/HttpClient.js';
export type { HttpClientConfig } from '../../core/http/http-types.js';
