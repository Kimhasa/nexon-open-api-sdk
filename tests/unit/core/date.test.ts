import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { describe, it, expect } from 'vitest';
import { toNexonDate } from '../../../src/games/_base/maple-date.js';
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
