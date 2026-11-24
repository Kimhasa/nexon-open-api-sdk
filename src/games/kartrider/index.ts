export { KartriderClient } from './KartriderClient.js';
export { KartriderUserClient } from './user/KartriderUserClient.js';
export { KartriderNoticeClient } from './notice/KartriderNoticeClient.js';

export type { KartriderOUID, KartriderOuidRequest } from './types.js';
export type {
  KartriderOuidInfo,
  KartriderOuidLookup,
  KartriderUserBasic,
  KartriderTitleEquipment,
  KartriderUserTitleEquipment,
} from './user/types.js';
export type {
  KartriderNoticeItem,
  KartriderNoticeDetail,
  KartriderNoticeList,
  KartriderSeasonNoticeList,
  KartriderEventNoticeList,
} from './notice/types.js';

// sub-path만으로 클라이언트를 만들 수 있게 HTTP 계층을 함께 내보낸다
export { HttpClient } from '../../core/http/HttpClient.js';
export type { HttpClientConfig } from '../../core/http/http-types.js';
