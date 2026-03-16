import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateShape } from '../../../src/core/validation/response-shape.js';
import type { ShapeDescriptor } from '../../../src/core/validation/response-shape.js';
import { _resetDeprecationWarnings } from '../../../src/core/deprecation/deprecation.js';

const TEST_URL = 'https://open.api.nexon.com/maplestory/v1/character/basic';

const basicShape: ShapeDescriptor = {
  expectedKeys: {
    character_name: 'string',
    character_level: 'number',
    world_name: 'string',
    guild_name: 'optional',
    character_skills: 'array',
    extra_info: 'object',
  },
};

describe('validateShape', () => {
  beforeEach(() => {
    _resetDeprecationWarnings();
    vi.restoreAllMocks();
  });

  it('shape가 완전히 일치하면 null을 반환한다', () => {
    const data = {
      character_name: '테스트',
      character_level: 250,
      world_name: '스카니아',
      character_skills: ['스킬1'],
      extra_info: { key: 'value' },
    };
    expect(validateShape(TEST_URL, data, basicShape)).toBeNull();
  });

  it('optional 키가 없어도 null을 반환한다', () => {
    const data = {
      character_name: '테스트',
      character_level: 250,
      world_name: '스카니아',
      character_skills: [],
      extra_info: {},
    };
    // guild_name은 optional이므로 없어도 OK
    expect(validateShape(TEST_URL, data, basicShape)).toBeNull();
  });

  it('필수 키가 누락되면 missingKeys에 포함된다', () => {
    const data = {
      character_name: '테스트',
      // character_level 누락
      world_name: '스카니아',
      character_skills: [],
      extra_info: {},
    };
    const result = validateShape(TEST_URL, data, basicShape);
    expect(result).not.toBeNull();
    expect(result!.missingKeys).toContain('character_level');
  });

  it('예상에 없는 키가 있으면 unexpectedKeys에 포함된다', () => {
    const data = {
      character_name: '테스트',
      character_level: 250,
      world_name: '스카니아',
      character_skills: [],
      extra_info: {},
      new_nexon_field: 'surprise',
    };
    const result = validateShape(TEST_URL, data, basicShape);
    expect(result).not.toBeNull();
    expect(result!.unexpectedKeys).toContain('new_nexon_field');
  });

  it('타입이 다르면 typeMismatches에 포함된다', () => {
    const data = {
      character_name: '테스트',
      character_level: '250', // string이지만 number 예상
      world_name: '스카니아',
      character_skills: [],
      extra_info: {},
    };
    const result = validateShape(TEST_URL, data, basicShape);
    expect(result).not.toBeNull();
    expect(result!.typeMismatches).toEqual([
      { key: 'character_level', expected: 'number', actual: 'string' },
    ]);
  });

  it('array 타입을 정확히 감지한다', () => {
    const data = {
      character_name: '테스트',
      character_level: 250,
      world_name: '스카니아',
      character_skills: 'not-an-array', // string이지만 array 예상
      extra_info: {},
    };
    const result = validateShape(TEST_URL, data, basicShape);
    expect(result).not.toBeNull();
    expect(result!.typeMismatches).toEqual([
      { key: 'character_skills', expected: 'array', actual: 'string' },
    ]);
  });

  it('null 값은 object로 허용한다', () => {
    const data = {
      character_name: '테스트',
      character_level: 250,
      world_name: '스카니아',
      character_skills: [],
      extra_info: null, // null이지만 object 예상 → OK
    };
    expect(validateShape(TEST_URL, data, basicShape)).toBeNull();
  });

  it('data가 null이면 전체 missingKeys를 반환한다', () => {
    const result = validateShape(TEST_URL, null, basicShape);
    expect(result).not.toBeNull();
    expect(result!.typeMismatches).toEqual([
      { key: '(root)', expected: 'object', actual: 'object' },
    ]);
  });

  it('data가 primitive이면 root type mismatch를 반환한다', () => {
    const result = validateShape(TEST_URL, 'string-response', basicShape);
    expect(result).not.toBeNull();
    expect(result!.typeMismatches[0]!.key).toBe('(root)');
    expect(result!.typeMismatches[0]!.actual).toBe('string');
  });

  it('any 타입은 키 존재만 확인한다', () => {
    const shape: ShapeDescriptor = {
      expectedKeys: { flexible_field: 'any' },
    };
    const data = { flexible_field: 42 };
    expect(validateShape(TEST_URL, data, shape)).toBeNull();

    const data2 = { flexible_field: [1, 2, 3] };
    expect(validateShape(TEST_URL, data2, shape)).toBeNull();
  });

  it('deprecated 키가 존재하면 emitDeprecation을 호출한다', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const shape: ShapeDescriptor = {
      expectedKeys: { name: 'string' },
      deprecatedKeys: { old_field: 'old_field는 제거 예정입니다.' },
    };
    const data = { name: '테스트', old_field: 'value' };
    const result = validateShape(TEST_URL, data, shape);
    // old_field는 deprecated이므로 unexpectedKeys에 포함되지 않음
    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledWith('[nexon-sdk] DEPRECATED: old_field는 제거 예정입니다.');
  });

  it('url 필드가 결과에 포함된다', () => {
    const shape: ShapeDescriptor = { expectedKeys: { a: 'string' } };
    const result = validateShape(TEST_URL, {}, shape);
    expect(result).not.toBeNull();
    expect(result!.url).toBe(TEST_URL);
  });

  it('복합 불일치를 모두 감지한다', () => {
    const data = {
      character_name: 123, // type mismatch
      // character_level 누락
      world_name: '스카니아',
      character_skills: [],
      extra_info: {},
      bonus: true, // unexpected
    };
    const result = validateShape(TEST_URL, data, basicShape);
    expect(result).not.toBeNull();
    expect(result!.missingKeys).toContain('character_level');
    expect(result!.typeMismatches).toEqual([
      { key: 'character_name', expected: 'string', actual: 'number' },
    ]);
    expect(result!.unexpectedKeys).toContain('bonus');
  });
});
