import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 퍼스트 디센던트 (The First Descendant) 클라이언트.
 *
 * 포털 스펙: `specs/openapi/tfd/` (https://openapi.nexon.com/ko/game/tfd/)
 */
export class FirstDescendantClient extends AbstractGameClient {
  protected readonly pathPrefix = 'tfd';
}
