import { invalidInput } from '../../core/validation/input.js';
import type { NexonDate } from './maple-base-types.js';

const DATE_HINT = "실제로 존재하는 'YYYY-MM-DD' 날짜, 유효한 Date 객체 또는 'today'를 입력하세요.";

/**
 * 날짜를 Nexon Open API 형식(YYYY-MM-DD)으로 변환한다.
 *
 * `timezoneOffset`을 기준으로 변환하므로 지역별 날짜 기준이 정확합니다.
 * - KMS / M: UTC+9 (540분) → `timezoneOffset: 540`
 * - SEA / TW: UTC+8 (480분) → `timezoneOffset: 480`
 *
 * @throws {NexonBadRequestError} 날짜를 파싱할 수 없거나 달력에 없는 날짜일 때
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
    return formatDateWithOffset(Date.now(), timezoneOffset);
  }

  let time: number;
  if (typeof date === 'string') {
    // Date의 ISO 파서가 일부 잘못된 날짜를 다음 달로 넘겨 처리하므로 원래 날짜를 검사합니다.
    const calendarDay = /^\s*(\d{4}-\d{2}-\d{2})(?!\d)/.exec(date)?.[1];
    if (calendarDay !== undefined) {
      const parsedDay = new Date(`${calendarDay}T00:00:00Z`);
      if (
        !Number.isFinite(parsedDay.getTime()) ||
        parsedDay.toISOString().slice(0, 10) !== calendarDay
      ) {
        invalidInput(`date 값 "${calendarDay}"은 달력에 없는 날짜입니다.`, DATE_HINT);
      }
      if (calendarDay === date) return date as NexonDate;
    }
    time = Date.parse(date);
  } else {
    time = typeof date?.getTime === 'function' ? date.getTime() : NaN;
  }

  if (!Number.isFinite(time)) {
    const problem =
      typeof date === 'string'
        ? `date 값 "${date}"을 날짜로 해석할 수 없습니다.`
        : 'date 값이 유효한 Date 객체가 아닙니다.';
    invalidInput(problem, DATE_HINT);
  }
  return formatDateWithOffset(time, timezoneOffset);
}

function formatDateWithOffset(time: number, timezoneOffset: number): NexonDate {
  const localMs = time + timezoneOffset * 60 * 1000;
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
