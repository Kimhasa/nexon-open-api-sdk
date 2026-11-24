import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 서든어택 클라이언트.
 *
 * 포털 스펙: `specs/openapi/suddenattack/` (https://openapi.nexon.com/ko/game/suddenattack/)
 */
export class SuddenAttackClient extends AbstractGameClient {
  protected readonly pathPrefix = 'suddenattack';
}
