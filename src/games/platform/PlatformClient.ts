import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 넥슨 Open API 플랫폼 (Open API 공지) 클라이언트.
 *
 * 포털 스펙: `specs/openapi/platform/` (https://openapi.nexon.com/ko/game/platform/)
 */
export class PlatformClient extends AbstractGameClient {
  protected readonly pathPrefix = 'platform';
}
