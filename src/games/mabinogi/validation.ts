import { MABINOGI_SERVERS } from './types.js';
import type { MabinogiServerName } from './types.js';

export function validateServer(serverName: MabinogiServerName): void {
  if (!MABINOGI_SERVERS.includes(serverName)) {
    throw new TypeError('server_name에 류트, 만돌린, 하프, 울프 중 하나를 입력하세요.');
  }
}
