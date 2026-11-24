export { PlatformClient } from './PlatformClient.js';

export type {
  PlatformGameName,
  PlatformNoticeRequest,
  PlatformNoticeItem,
  PlatformNoticeList,
} from './notice/types.js';

// sub-path만으로 클라이언트를 만들 수 있게 HTTP 계층을 함께 내보낸다
export { HttpClient } from '../../core/http/HttpClient.js';
export type { HttpClientConfig } from '../../core/http/http-types.js';
