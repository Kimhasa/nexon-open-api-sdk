import { describe, it, expect } from 'vitest';
import { classifyError } from '../../../src/core/errors/classify-error.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonNotFoundError } from '../../../src/core/errors/NexonNotFoundError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonDataNotReadyError } from '../../../src/core/errors/NexonDataNotReadyError.js';
import { NexonServerError } from '../../../src/core/errors/NexonServerError.js';
import { NexonError } from '../../../src/core/errors/NexonError.js';
import type { NEXON_ERROR_CODES } from '../../../src/core/errors/error-codes.js';

const makePayload = (
  name: string,
  message = 'Test error',
): {
  error: { name: (typeof NEXON_ERROR_CODES)[keyof typeof NEXON_ERROR_CODES]; message: string };
} => ({
  error: { name: name as (typeof NEXON_ERROR_CODES)[keyof typeof NEXON_ERROR_CODES], message },
});

describe('classifyError', () => {
  it('OPENAPI00007 → NexonRateLimitError', () => {
    const err = classifyError(429, makePayload('OPENAPI00007'), 1000);
    expect(err).toBeInstanceOf(NexonRateLimitError);
    expect((err as NexonRateLimitError).retryAfterMs).toBe(1000);
  });

  it('HTTP 429 (코드 없어도) → NexonRateLimitError', () => {
    const err = classifyError(429, undefined);
    expect(err).toBeInstanceOf(NexonRateLimitError);
  });

  it('OPENAPI00002 → NexonAuthError', () => {
    const err = classifyError(403, makePayload('OPENAPI00002'));
    expect(err).toBeInstanceOf(NexonAuthError);
  });

  it('OPENAPI00005 → NexonAuthError', () => {
    const err = classifyError(403, makePayload('OPENAPI00005'));
    expect(err).toBeInstanceOf(NexonAuthError);
  });

  it('OPENAPI00003 → NexonNotFoundError', () => {
    const err = classifyError(400, makePayload('OPENAPI00003'));
    expect(err).toBeInstanceOf(NexonNotFoundError);
  });

  it('OPENAPI00004 → NexonBadRequestError', () => {
    const err = classifyError(400, makePayload('OPENAPI00004'));
    expect(err).toBeInstanceOf(NexonBadRequestError);
  });

  it('OPENAPI00006 → NexonBadRequestError', () => {
    const err = classifyError(400, makePayload('OPENAPI00006'));
    expect(err).toBeInstanceOf(NexonBadRequestError);
  });

  it('OPENAPI00009 → NexonDataNotReadyError', () => {
    const err = classifyError(400, makePayload('OPENAPI00009'));
    expect(err).toBeInstanceOf(NexonDataNotReadyError);
  });

  it('OPENAPI00010 → NexonDataNotReadyError', () => {
    const err = classifyError(400, makePayload('OPENAPI00010'));
    expect(err).toBeInstanceOf(NexonDataNotReadyError);
  });

  it('OPENAPI00001 → NexonServerError', () => {
    const err = classifyError(500, makePayload('OPENAPI00001'));
    expect(err).toBeInstanceOf(NexonServerError);
  });

  it('OPENAPI00008 → NexonServerError', () => {
    const err = classifyError(500, makePayload('OPENAPI00008'));
    expect(err).toBeInstanceOf(NexonServerError);
  });

  it('OPENAPI00011 → NexonServerError', () => {
    const err = classifyError(500, makePayload('OPENAPI00011'));
    expect(err).toBeInstanceOf(NexonServerError);
  });

  it('HTTP 500 (코드 없어도) → NexonServerError', () => {
    const err = classifyError(500, undefined);
    expect(err).toBeInstanceOf(NexonServerError);
  });

  it('알 수 없는 에러 → NexonError (base)', () => {
    const err = classifyError(418, makePayload('UNKNOWN_CODE'));
    expect(err).toBeInstanceOf(NexonError);
    expect(err).not.toBeInstanceOf(NexonRateLimitError);
    expect(err).not.toBeInstanceOf(NexonAuthError);
  });

  it('에러 메시지에 원문 메시지가 포함된다', () => {
    const err = classifyError(403, makePayload('OPENAPI00002', 'Invalid API key'));
    expect(err.message).toContain('Invalid API key');
  });

  it('모든 에러는 NexonError의 instanceof이다', () => {
    const errors = [
      classifyError(429, makePayload('OPENAPI00007')),
      classifyError(403, makePayload('OPENAPI00002')),
      classifyError(400, makePayload('OPENAPI00003')),
      classifyError(400, makePayload('OPENAPI00004')),
      classifyError(400, makePayload('OPENAPI00009')),
      classifyError(500, makePayload('OPENAPI00001')),
    ];
    for (const err of errors) {
      expect(err).toBeInstanceOf(NexonError);
    }
  });
});
