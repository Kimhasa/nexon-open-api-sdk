import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 바람의나라: 연 클라이언트.
 *
 * 포털 스펙: `specs/openapi/baramy/` (https://openapi.nexon.com/ko/game/baramy/)
 */
export class BaramYeonClient extends AbstractGameClient {
  protected readonly pathPrefix = 'baramy';
}
