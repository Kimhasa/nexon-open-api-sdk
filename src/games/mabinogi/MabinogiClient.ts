import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 마비노기 클라이언트.
 *
 * 포털 스펙: `specs/openapi/mabinogi/` (https://openapi.nexon.com/ko/game/mabinogi/)
 */
export class MabinogiClient extends AbstractGameClient {
  protected readonly pathPrefix = 'mabinogi';
}
