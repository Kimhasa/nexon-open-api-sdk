import { invalidInput } from '../../core/validation/input.js';
import type { NexonDate } from './maple-base-types.js';

const DATE_HINT = "실제로 존재하는 'YYYY-MM-DD' 날짜, 유효한 Date 객체 또는 'today'를 입력하세요.";
export const KST_OFFSET_MINUTES = 540;
export const UTC_PLUS_8_OFFSET_MINUTES = 480;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 날짜를 NEXON Open API 형식(YYYY-MM-DD)으로 변환한다.
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
      if (!isCalendarDate(calendarDay)) {
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

function isCalendarDate(date: string): boolean {
  if (date.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function requireCalendarDate(date: unknown, apiLabel: string): asserts date is string {
  if (typeof date !== 'string' || !isCalendarDate(date)) {
    invalidInput(
      `${apiLabel} 조회의 date가 빠졌거나 유효한 날짜가 아닙니다.`,
      '실제 달력에 있는 날짜를 YYYY-MM-DD 형식으로 입력하세요.',
    );
  }
}

interface SnapshotDateOptions {
  readonly firstDate: string;
  readonly lastDate?: string;
  readonly timezoneOffset: number;
  readonly apiLabel: string;
  readonly language?: 'en';
}

export function snapshotDate(
  date: string | Date | undefined,
  { firstDate, lastDate, timezoneOffset, apiLabel, language }: SnapshotDateOptions,
): string | undefined {
  if (date === undefined) return undefined;

  const today = toNexonDate('today', timezoneOffset);
  const english = language === 'en';
  let day: unknown = date;
  if (date === 'today') {
    day = today;
  } else if (typeof date !== 'string' && typeof date?.getTime === 'function') {
    const time = date.getTime();
    if (Number.isFinite(time)) day = formatDateWithOffset(time, timezoneOffset);
  }
  if (typeof day !== 'string' || !isCalendarDate(day)) {
    invalidInput(
      english
        ? `${apiLabel} date is invalid.`
        : `${apiLabel} 조회의 date가 유효한 날짜가 아닙니다.`,
      english
        ? 'Enter a valid calendar date in YYYY-MM-DD format.'
        : '실제 달력에 있는 날짜를 YYYY-MM-DD 형식으로 입력하세요.',
    );
  }
  if (day >= today) {
    invalidInput(
      english
        ? `${apiLabel} does not accept today or a future date.`
        : `${apiLabel} 조회에는 오늘이나 미래 날짜를 넣을 수 없습니다.`,
      english
        ? "Omit date for the latest data, or use yesterday or an earlier available date. The previous day's data opens at 2 AM local time."
        : '최신 데이터가 필요하면 date를 생략하세요. 지난 날짜는 어제까지, 전일 데이터는 다음날 오전 2시부터 조회됩니다.',
    );
  }
  if (day < firstDate) {
    invalidInput(
      english
        ? `${apiLabel} data starts on ${firstDate}. Nexon returns empty data (all values null) for earlier dates.`
        : `${apiLabel} 정보는 ${firstDate}부터 있습니다. 그 전 날짜에는 넥슨이 빈 응답(조회 값이 모두 null)을 줍니다.`,
      english
        ? `Enter ${firstDate} or a later available date.`
        : `${firstDate}부터 조회 가능한 날짜를 입력하세요.`,
    );
  }
  if (lastDate !== undefined && day > lastDate) {
    invalidInput(
      english
        ? `${apiLabel} data ends on ${lastDate}.`
        : `${apiLabel} 정보는 ${lastDate}까지만 있습니다.`,
      english
        ? `Enter a date from ${firstDate} through ${lastDate}.`
        : `${firstDate}부터 ${lastDate} 사이의 날짜를 입력하세요.`,
    );
  }
  return day;
}

function twoYearsBefore(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  const month = date.getUTCMonth();
  date.setUTCFullYear(date.getUTCFullYear() - 2);
  if (date.getUTCMonth() !== month) date.setUTCDate(0); // 2월 29일은 평년의 2월 말일로 맞춥니다.
  return date.toISOString().slice(0, 10);
}

function assertRecentDate(date: string, apiLabel: string, firstDate?: string): void {
  const today = toNexonDate('today', KST_OFFSET_MINUTES);
  const cutoff = twoYearsBefore(today);
  const earliest = firstDate === undefined || firstDate < cutoff ? cutoff : firstDate;
  if (date < earliest || date > today) {
    invalidInput(
      `${apiLabel} 조회에 ${date} 날짜를 사용할 수 없습니다.`,
      `${earliest}부터 ${today}까지의 날짜를 입력하세요.`,
    );
  }
}

export function assertRankingDate(date: unknown, firstDate: string): asserts date is string {
  requireCalendarDate(date, '랭킹');
  assertRecentDate(date, '랭킹', firstDate);
}

export function historyDate(
  date: string | undefined,
  cursor: string | undefined,
  firstDate?: string,
): string | undefined {
  if (date === undefined) {
    if (typeof cursor !== 'string' || cursor.trim() === '') {
      invalidInput(
        '강화 기록 조회에는 date 또는 cursor가 필요합니다.',
        '첫 페이지는 YYYY-MM-DD 날짜를, 다음 페이지는 이전 응답의 next_cursor를 넣으세요.',
      );
    }
    return undefined;
  }
  requireCalendarDate(date, '강화 기록');
  assertRecentDate(date, '강화 기록', firstDate);
  return date;
}

export function schedulerDate(date: string | undefined): string | undefined {
  if (date === undefined) return undefined;
  requireCalendarDate(date, '스케줄러');
  const today = toNexonDate('today', KST_OFFSET_MINUTES);
  const midnight = Date.parse(`${today}T00:00:00Z`);
  const earliest = formatDateWithOffset(midnight - 14 * DAY_MS, 0);
  if (date < earliest || date > today) {
    invalidInput(
      `스케줄러 조회에 ${date} 날짜를 사용할 수 없습니다.`,
      `${earliest}부터 ${today}까지의 날짜를 입력하거나, 오늘 수행 현황을 보려면 date를 생략하세요.`,
    );
  }
  return date;
}

/**
 * NEXON Open API 날짜 범위.
 * 시작일과 종료일 모두 포함(inclusive)합니다.
 */
export interface DateRange {
  /** 조회 시작일 */
  readonly startDate: Date | NexonDate | string;
  /** 조회 종료일 */
  readonly endDate: Date | NexonDate | string;
}
