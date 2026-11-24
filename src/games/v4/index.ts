export { V4Client } from './V4Client.js';
export { V4CharacterClient } from './character/V4CharacterClient.js';

export type { V4OCID, V4OcidRequest } from './types.js';
export type {
  V4CharacterBasic,
  V4Honor,
  V4CharacterHonor,
  V4HonorEquipment,
  V4CharacterHonorEquipment,
} from './character/types.js';

// sub-path만으로 클라이언트를 만들 수 있게 HTTP 계층을 함께 내보낸다
export { HttpClient } from '../../core/http/HttpClient.js';
export type { HttpClientConfig } from '../../core/http/http-types.js';
