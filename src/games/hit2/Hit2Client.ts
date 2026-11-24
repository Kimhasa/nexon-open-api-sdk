import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 히트2 클라이언트.
 *
 * 포털 스펙: `specs/openapi/hit2/` (https://openapi.nexon.com/ko/game/hit2/)
 */
export class Hit2Client extends AbstractGameClient {
  protected readonly pathPrefix = 'hit2';
}
