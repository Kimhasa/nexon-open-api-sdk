import type { NexonDate } from './branded.js';

/**
 * 날짜를 Nexon Open API 형식(YYYY-MM-DD)으로 변환한다.
 *
 * `timezoneOffset`을 기준으로 변환하므로 지역별 날짜 기준이 정확합니다.
 * - KMS / M: UTC+9 (540분) → `timezoneOffset: 540`
 * - SEA / TW: UTC+8 (480분) → `timezoneOffset: 480`
 *
 * @example
 * ```ts
 * toNexonDate(new Date(), 540);          // 'YYYY-MM-DD' (KST 기준)
 * toNexonDate('2024-01-15', 540);        // '2024-01-15' (그대로 사용)
 * toNexonDate('today', 540);             // 오늘 날짜 (KST 기준)
 * ```
 */
export function toNexonDate(
  date: Date | NexonDate | 'today' | string,
  timezoneOffset: number,
): NexonDate {
  if (date === 'today') {
    return formatDateWithOffset(new Date(), timezoneOffset);
  }

  if (typeof date === 'string') {
    // 이미 YYYY-MM-DD 형식이면 그대로 반환
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date as NexonDate;
    }
    // 다른 문자열이면 Date로 파싱
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new Error(
        `잘못된 날짜 형식: "${date}"\n→ 올바른 형식: 'YYYY-MM-DD', Date 객체, 또는 'today'`,
      );
    }
    return formatDateWithOffset(parsed, timezoneOffset);
  }

  return formatDateWithOffset(date, timezoneOffset);
}

/**
 * Date 객체를 지정된 timezone offset 기준의 YYYY-MM-DD 문자열로 변환한다.
 */
function formatDateWithOffset(date: Date, timezoneOffset: number): NexonDate {
  // UTC 기준 ms + timezone offset ms
  const localMs = date.getTime() + timezoneOffset * 60 * 1000;
  const localDate = new Date(localMs);

  const yyyy = localDate.getUTCFullYear();
  const mm = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getUTCDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}` as NexonDate;
}

/**
 * Nexon Open API 날짜 범위.
 * 시작일과 종료일 모두 포함(inclusive)합니다.
 */
export interface DateRange {
  /** 조회 시작일 */
  readonly startDate: Date | NexonDate | string;
  /** 조회 종료일 */
  readonly endDate: Date | NexonDate | string;
}
