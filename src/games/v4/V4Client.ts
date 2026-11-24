import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * V4 클라이언트.
 *
 * 포털 스펙: `specs/openapi/v4/` (https://openapi.nexon.com/ko/game/v4/)
 */
export class V4Client extends AbstractGameClient {
  protected readonly pathPrefix = 'v4';
}
