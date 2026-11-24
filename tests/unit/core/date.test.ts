import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import {
  assertRankingDate,
  historyDate,
  schedulerDate,
  snapshotDate,
  toNexonDate,
} from '../../../src/games/_base/maple-date.js';
import type { NexonDate } from '../../../src/games/_base/maple-base-types.js';

describe('toNexonDate', () => {
  it('YYYY-MM-DD 문자열은 그대로 반환한다', () => {
    const result = toNexonDate('2024-01-15', 540);
    expect(result).toBe('2024-01-15');
  });

  it('윤년의 2월 29일은 타임존에 관계없이 달력 날짜 그대로 반환한다', () => {
    expect(toNexonDate('2024-02-29', -480)).toBe('2024-02-29');
  });

  it('"today" 문자열은 현재 날짜를 반환한다', () => {
    const result = toNexonDate('today', 540);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('Date 객체를 KST 기준으로 변환한다', () => {
    // 2024-01-15 00:00 UTC → KST(UTC+9) = 2024-01-15 09:00 → 날짜: 2024-01-15
    const date = new Date('2024-01-15T00:00:00Z');
    const result = toNexonDate(date, 540);
    expect(result).toBe('2024-01-15');
  });

  it('UTC+9 기준으로 날짜 경계를 올바르게 처리한다', () => {
    // 2024-01-14 23:00 UTC → KST = 2024-01-15 08:00 → 날짜: 2024-01-15
    const date = new Date('2024-01-14T23:00:00Z');
    const result = toNexonDate(date, 540);
    expect(result).toBe('2024-01-15');
  });

  it('UTC+8 (SEA/TW) timezone offset도 처리한다', () => {
    // 2024-01-14 23:00 UTC → SGT(UTC+8) = 2024-01-15 07:00 → 날짜: 2024-01-15
    const date = new Date('2024-01-14T23:00:00Z');
    const result = toNexonDate(date, 480);
    expect(result).toBe('2024-01-15');
  });

  it('NexonDate 브랜드 타입도 그대로 반환한다', () => {
    const branded = '2024-06-01' as NexonDate;
    const result = toNexonDate(branded, 540);
    expect(result).toBe('2024-06-01');
  });

  it.each([
    ['파싱할 수 없는 문자열', 'not-a-date', /날짜로 해석할 수 없습니다/],
    ['잘못된 Date 객체', new Date(NaN), /유효한 Date 객체가 아닙니다/],
    ['평년의 2월 29일', '2025-02-29', /달력에 없는 날짜/],
    ['2월 30일', '2026-02-30', /달력에 없는 날짜/],
    ['13월 1일', '2026-13-01', /달력에 없는 날짜/],
    ['잘못된 날짜가 포함된 ISO 문자열', '2026-02-30T00:00:00Z', /달력에 없는 날짜/],
  ] as const)('%s은(는) 입력 오류를 던진다', (_, date, problem) => {
    const parseInvalidDate = (): NexonDate => toNexonDate(date, 540);
    expect(parseInvalidDate).toThrow(NexonBadRequestError);
    expect(parseInvalidDate).toThrow(expect.objectContaining({ code: 'OPENAPI00004' }));
    expect(parseInvalidDate).toThrow(problem);
    expect(parseInvalidDate).toThrow(/YYYY-MM-DD/);
  });

  it('ISO 문자열을 파싱하여 변환한다', () => {
    const instant = '2024-02-29T15:30:00Z';
    expect(toNexonDate(instant, 540)).toBe('2024-03-01');
    expect(toNexonDate(instant, 480)).toBe('2024-02-29');
  });
});

describe('메이플스토리 조회 날짜', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-24T15:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it.each(['2026-11-25', '2026-11-26'])('스냅숏은 %s 날짜를 거부한다', (date) => {
    const options = { firstDate: '2023-12-21', timezoneOffset: 540, apiLabel: '캐릭터' };
    expect(() => snapshotDate(date, options)).toThrow(NexonBadRequestError);
    expect(() => snapshotDate(date, options)).toThrow(/date를 생략하세요/);
  });

  it.each(['2026-2-01', '2026-02-29', '2026-11-23T00:00:00Z', '2026-11-23\n'])(
    'YYYY-MM-DD 형식의 실제 날짜만 받는다 (%j)',
    (date) => {
      const options = { firstDate: '2023-12-21', timezoneOffset: 540, apiLabel: '캐릭터' };
      expect(() => snapshotDate(date, options)).toThrow(/YYYY-MM-DD/);
      expect(() => assertRankingDate(date, '2023-12-22')).toThrow(/YYYY-MM-DD/);
    },
  );

  it('랭킹은 2년 전부터 오늘까지 받는다', () => {
    expect(() => assertRankingDate('2024-11-24', '2023-12-22')).toThrow(/2024-11-25/);
    expect(() => assertRankingDate('2024-11-25', '2023-12-22')).not.toThrow();
    expect(() => assertRankingDate('2026-11-25', '2023-12-22')).not.toThrow();
    expect(() => assertRankingDate('2026-11-26', '2023-12-22')).toThrow(/2026-11-25까지/);
  });

  it('최근 2년을 셀 때 2월 29일은 평년 2월 말일에 맞춘다', () => {
    vi.setSystemTime(new Date('2028-02-28T15:00:00Z'));
    expect(() => assertRankingDate('2026-02-27', '2025-11-27')).toThrow(/2026-02-28/);
    expect(() => assertRankingDate('2026-02-28', '2025-11-27')).not.toThrow();
  });

  it.each(['2023-12-27', '2024-01-25'])('강화 기록의 첫 조회 가능 날짜 %s를 포함한다', (first) => {
    vi.setSystemTime(new Date('2024-02-01T00:00:00Z'));
    const previous = first === '2023-12-27' ? '2023-12-26' : '2024-01-24';
    expect(() => historyDate(previous, undefined, first)).toThrow(first);
    expect(historyDate(first, undefined, first)).toBe(first);
  });

  it('강화 기록은 오늘, 2년 전, 커서를 받는다', () => {
    expect(historyDate('2024-11-25', undefined)).toBe('2024-11-25');
    expect(historyDate('2026-11-25', undefined)).toBe('2026-11-25');
    expect(historyDate(undefined, 'next-page')).toBeUndefined();
    expect(() => historyDate('2024-11-24', undefined)).toThrow(/2024-11-25/);
    expect(() => historyDate('2026-11-26', undefined)).toThrow(/2026-11-25까지/);
    expect(() => historyDate(undefined, ' ')).toThrow(/next_cursor/);
  });

  it('스케줄러는 날짜 생략과 14일 전부터 오늘까지 받는다', () => {
    expect(schedulerDate(undefined)).toBeUndefined();
    expect(schedulerDate('2026-11-25')).toBe('2026-11-25');
    expect(schedulerDate('2026-11-11')).toBe('2026-11-11');
    expect(() => schedulerDate('2026-11-10')).toThrow(/2026-11-11/);
    expect(() => schedulerDate('2026-11-26')).toThrow(/2026-11-25까지/);
  });
});
