import { AbstractGameClient } from '../_base/AbstractGameClient.js';

/**
 * 바람의나라 클라이언트.
 *
 * 포털 스펙: `specs/openapi/baram/` (https://openapi.nexon.com/ko/game/baram/)
 */
export class BaramClient extends AbstractGameClient {
  protected readonly pathPrefix = 'baram';
}
