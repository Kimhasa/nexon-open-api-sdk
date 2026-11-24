import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 카트라이더 러쉬플러스 클라이언트.
 *
 * 포털 스펙: `specs/openapi/kartrush/` (https://openapi.nexon.com/ko/game/kartrush/)
 */
export class KartriderClient extends AbstractGameClient {
  protected readonly pathPrefix = 'kartrush';
}
