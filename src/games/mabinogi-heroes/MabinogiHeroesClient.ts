import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 마비노기 영웅전 클라이언트.
 *
 * 포털 스펙: `specs/openapi/heroes/` (https://openapi.nexon.com/ko/game/heroes/)
 */
export class MabinogiHeroesClient extends AbstractGameClient {
  protected readonly pathPrefix = 'heroes';
}
