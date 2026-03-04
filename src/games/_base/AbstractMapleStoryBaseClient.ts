import { toNexonDate } from '../../core/types/date.js';
import type { NexonDate } from '../../core/types/branded.js';
import { AbstractGameClient } from './AbstractGameClient.js';

/**
 * 메이플스토리 프랜차이즈(KMS, M, SEA, TW) 공통 추상 기반 클라이언트.
 *
 * `AbstractGameClient`를 상속하고, 메이플 패밀리에만 필요한
 * `timezoneOffset` + `formatDate()`를 추가합니다.
 *
 * @example
 * ```ts
 * class MapleStoryClient extends AbstractMapleBaseClient {
 *   protected readonly pathPrefix = 'maplestory';
 *   protected readonly timezoneOffset = 540; // UTC+9
 * }
 * ```
 */
export abstract class AbstractMapleBaseClient extends AbstractGameClient {
  /**
   * 게임 서버의 timezone offset (분 단위).
   * - KMS / M: 540 (UTC+9, KST)
   * - SEA / TW: 480 (UTC+8, SGT/TST)
   */
  protected abstract readonly timezoneOffset: number;

  /**
   * 날짜를 이 게임의 timezone 기준 Nexon API 날짜 형식(YYYY-MM-DD)으로 변환한다.
   *
   * @param date - `Date` 객체, `'YYYY-MM-DD'` 문자열, 또는 `'today'`
   */
  protected formatDate(date: Date | NexonDate | 'today' | string): NexonDate {
    return toNexonDate(date, this.timezoneOffset);
  }
}

/**
 * @deprecated `AbstractMapleBaseClient`로 이름이 변경되었습니다.
 */
export const AbstractMapleStoryBaseClient = AbstractMapleBaseClient;
