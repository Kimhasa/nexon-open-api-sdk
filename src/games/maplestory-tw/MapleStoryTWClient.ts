import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';

/**
 * MapleStory Taiwan (메이플스토리 대만) 클라이언트.
 *
 * 포털 스펙: `specs/openapi/maplestorytw/` (https://openapi.nexon.com/ko/game/maplestorytw/)
 */
export class MapleStoryTWClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestorytw';
  protected readonly timezoneOffset = 480; // UTC+8 (TST)
}
