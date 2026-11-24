import { describe, expect, it } from 'vitest';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import {
  assertDateInRange,
  assertInteger,
  assertNonEmptyString,
  assertOneOf,
  invalidInput,
} from '../../../src/core/validation/input.js';

function expectBadRequest(validate: () => void, message: RegExp): void {
  expect(validate).toThrow(NexonBadRequestError);
  expect(validate).toThrow(expect.objectContaining({ status: 400, code: 'OPENAPI00004' }));
  expect(validate).toThrow(message);
}

describe('SDK input validation', () => {
  it.each(['', ' \t', null, 1])('rejects non-string or blank input %s', (value) => {
    expectBadRequest(() => assertNonEmptyString(value, 'ocid', 'Use getOcid().'), /ocid.*getOcid/);
  });

  it('accepts a string containing whitespace and non-whitespace characters', () => {
    expect(() => assertNonEmptyString(' name ', 'characterName')).not.toThrow();
  });

  it('compares allowed values without case folding or coercion', () => {
    expect(() => assertOneOf('ko', ['ko', 'en'], 'language')).not.toThrow();
    expectBadRequest(() => assertOneOf('KO', ['ko', 'en'], 'language'), /language.*ko.*en/);
    expectBadRequest(() => assertOneOf('2', [2, 3, 4], 'size'), /size.*2.*3.*4/);
  });

  it('enforces inclusive integer bounds only when provided', () => {
    const bounds = { min: 1, max: 3 };
    expect(() => assertInteger(1, 'count', bounds)).not.toThrow();
    expect(() => assertInteger(3, 'count', bounds)).not.toThrow();
    expect(() => assertInteger(-1, 'id')).not.toThrow();
    for (const value of [0, 4, 1.5, '2', NaN, Infinity]) {
      expectBadRequest(() => assertInteger(value, 'count', bounds), /count.*1 이상 3 이하/);
    }
  });

  it('checks safe integers when requested', () => {
    expect(() => assertInteger(Number.MAX_SAFE_INTEGER, 'id', { safe: true })).not.toThrow();
    const largeInteger = Number.MAX_SAFE_INTEGER + 1;
    expect(() => assertInteger(largeInteger, 'id')).not.toThrow();
    expectBadRequest(() => assertInteger(largeInteger, 'id', { safe: true }), /id.*안전한 정수/);
  });

  it('checks inclusive calendar dates against the supplied range', () => {
    const min = '2025-10-14';
    const max = '2026-01-01';
    for (const date of [min, max]) {
      expect(() => assertDateInRange(date, min, max)).not.toThrow();
    }
    for (const date of ['2025-10-13', '2026-01-02']) {
      expectBadRequest(() => assertDateInRange(date, min, max), /2025-10-14.*2026-01-01/);
    }
  });

  it('combines the problem with guidance for game-specific rules', () => {
    expectBadRequest(
      () => invalidInput('Both filters were provided.', 'Choose one filter.'),
      /Both filters were provided\. Choose one filter\./,
    );
  });
});
