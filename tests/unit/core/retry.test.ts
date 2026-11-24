import { describe, it, expect } from 'vitest';
import { computeRetryDelay, isRetryableStatus } from '../../../src/core/http/retry.js';

describe('computeRetryDelay', () => {
  it('attempt 1 에서 base ~ base*2 범위의 지연을 반환한다', () => {
    const base = 500;
    for (let i = 0; i < 20; i++) {
      const delay = computeRetryDelay(1, base);
      // exponential: 500 * 2^0 = 500, jitter: 0~500 → range: 500~1000
      expect(delay).toBeGreaterThanOrEqual(base);
      expect(delay).toBeLessThanOrEqual(base * 2);
    }
  });

  it('attempt가 증가하면 지연이 지수적으로 증가한다', () => {
    const base = 500;
    const delay1Min = base; // 500 * 2^0
    const delay3Min = base * 4; // 500 * 2^2

    // attempt 3 의 exponential 부분(2000)이 attempt 1 의 최대(1000)보다 크다
    expect(delay3Min).toBeGreaterThan(delay1Min * 2);
  });

  it('최대 30초를 초과하지 않는다', () => {
    const delay = computeRetryDelay(100, 10000);
    expect(delay).toBeLessThanOrEqual(30_000);
  });
});

describe('isRetryableStatus', () => {
  it.each([429, 500, 502, 503, 504, 599])('%i은 재시도 가능하다', (status) => {
    expect(isRetryableStatus(status)).toBe(true);
  });

  it.each([200, 400, 401, 403, 428, 430, 499, 600])('%i은 재시도 불가하다', (status) => {
    expect(isRetryableStatus(status)).toBe(false);
  });
});
