export { FcOnlineClient } from './FcOnlineClient.js';

// User types
export type {
  FcUserBasic,
  FcMaxDivision,
  FcUserMatchRequest,
  FcUserTradeRequest,
  FcTradeType,
  FcTradeRecord,
} from './user/types.js';

// Match types
export type {
  FcMatchListRequest,
  FcMatchDetail,
  FcMatchInfo,
  FcMatchDetailInfo,
  FcMatchShoot,
  FcMatchShootDetail,
  FcMatchPass,
  FcMatchDefence,
  FcPlayerStatus,
  FcMatchPlayer,
} from './match/types.js';

// Ranker types
export type {
  FcRankerPlayer,
  FcRankerStatsRequest,
  FcRankerPlayerStatus,
  FcRankerStats,
} from './ranker/types.js';

// Metadata types
export type {
  FcMatchTypeMeta,
  FcSpidMeta,
  FcSeasonIdMeta,
  FcSeasonMeta,
  FcClassMeta,
  FcSpPositionMeta,
  FcDivisionMeta,
  FcDivisionVoltaMeta,
} from './metadata/types.js';

// sub-path만으로 클라이언트를 만들 수 있게 HTTP 계층을 함께 내보낸다
export { HttpClient } from '../../core/http/HttpClient.js';
export type { HttpClientConfig } from '../../core/http/http-types.js';
