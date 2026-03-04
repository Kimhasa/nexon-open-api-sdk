import { describe, it, expect } from 'vitest';
import { toNexonDate } from '../../../src/core/types/date.js';
import type { NexonDate } from '../../../src/core/types/branded.js';

describe('toNexonDate', () => {
  it('YYYY-MM-DD 문자열은 그대로 반환한다', () => {
    const result = toNexonDate('2024-01-15', 540);
    expect(result).toBe('2024-01-15');
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

  it('잘못된 날짜 문자열은 에러를 던진다', () => {
    expect(() => toNexonDate('not-a-date', 540)).toThrow('잘못된 날짜 형식');
  });

  it('ISO 문자열을 파싱하여 변환한다', () => {
    const result = toNexonDate('2024-01-15T12:00:00Z', 540);
    expect(result).toBe('2024-01-15');
  });
});
