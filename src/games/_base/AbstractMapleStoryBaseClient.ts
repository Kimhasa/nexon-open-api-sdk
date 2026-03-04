import type { HttpClient } from '../../core/http/HttpClient.js';
import { toNexonDate } from '../../core/types/date.js';
import type { NexonDate } from '../../core/types/branded.js';

/**
 * 메이플스토리 프랜차이즈 공통 추상 기반 클라이언트.
 *
 * `pathPrefix`와 `timezoneOffset`을 abstract로 강제하여
 * 각 게임 클라이언트가 올바른 값을 반드시 제공하도록 합니다.
 *
 * @example
 * ```ts
 * class MapleStoryClient extends AbstractMapleStoryBaseClient {
 *   protected readonly pathPrefix = 'maplestory';
 *   protected readonly timezoneOffset = 540; // UTC+9
 * }
 * ```
 */
export abstract class AbstractMapleStoryBaseClient {
  /** API URL path prefix (예: `'maplestory'`, `'maplestorym'`) */
  protected abstract readonly pathPrefix: string;

  /**
   * 게임 서버의 timezone offset (분 단위).
   * - KMS / M: 540 (UTC+9, KST)
   * - SEA / TW: 480 (UTC+8, SGT/TST)
   */
  protected abstract readonly timezoneOffset: number;

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

  /**
   * 날짜를 이 게임의 timezone 기준 Nexon API 날짜 형식(YYYY-MM-DD)으로 변환한다.
   *
   * @param date - `Date` 객체, `'YYYY-MM-DD'` 문자열, 또는 `'today'`
   */
  protected formatDate(date: Date | NexonDate | 'today' | string): NexonDate {
    return toNexonDate(date, this.timezoneOffset);
  }
}
