import type { HttpClient } from '../../core/http/HttpClient.js';

/**
 * 모든 게임 클라이언트의 최상위 추상 기반 클래스.
 *
 * Nexon Open API의 공통 URL 구조(`https://open.api.nexon.com/{pathPrefix}/{version}/{path}`)를
 * 기반으로 `buildUrl()`을 제공합니다.
 *
 * - 메이플스토리 패밀리(KMS, M, SEA, TW)는 `AbstractMapleBaseClient`를 상속
 * - 그 외 게임은 이 클래스를 직접 상속
 *
 * @example
 * ```ts
 * class MabinogiClient extends AbstractGameClient {
 *   protected readonly pathPrefix = 'mabinogi';
 * }
 *
 * class FCOnlineClient extends AbstractGameClient {
 *   protected readonly pathPrefix = 'fconline';
 * }
 * ```
 */
export abstract class AbstractGameClient {
  /** API URL path prefix (예: `'maplestory'`, `'fconline'`, `'mabinogi'`) */
  protected abstract readonly pathPrefix: string;

  constructor(protected readonly http: HttpClient) {}

  /**
   * 게임 API 엔드포인트 URL을 생성한다.
   *
   * @param path - 엔드포인트 경로 (예: `'character/basic'`)
   * @param version - API 버전 (기본값: `'v1'`)
   */
  protected buildUrl(path: string, version: string = 'v1'): string {
    return `https://open.api.nexon.com/${this.pathPrefix}/${version}/${path}`;
  }
}
