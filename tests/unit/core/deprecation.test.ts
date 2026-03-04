import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  emitDeprecation,
  deprecated,
  _resetDeprecationWarnings,
} from '../../../src/core/deprecation/deprecation.js';

describe('deprecation', () => {
  beforeEach(() => {
    _resetDeprecationWarnings();
    vi.restoreAllMocks();
  });

  describe('emitDeprecation', () => {
    it('첫 호출 시 console.warn을 출력한다', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      emitDeprecation('test.field', 'test.field는 제거 예정입니다.');
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('[nexon-sdk] DEPRECATED: test.field는 제거 예정입니다.');
    });

    it('같은 id로 두 번 호출하면 경고가 한 번만 출력된다', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      emitDeprecation('dup.id', 'msg');
      emitDeprecation('dup.id', 'msg');
      emitDeprecation('dup.id', 'msg');
      expect(spy).toHaveBeenCalledOnce();
    });

    it('다른 id는 각각 경고를 출력한다', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      emitDeprecation('id.a', 'msg a');
      emitDeprecation('id.b', 'msg b');
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('_resetDeprecationWarnings() 후 같은 id로 다시 경고할 수 있다', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      emitDeprecation('reset.test', 'msg');
      _resetDeprecationWarnings();
      emitDeprecation('reset.test', 'msg');
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deprecated', () => {
    it('원본 함수를 위임 호출한다', () => {
      const fn = vi.fn((a: number, b: number) => a + b);
      const wrapped = deprecated('test.fn', 'deprecated', fn);
      const result = wrapped(2, 3);
      expect(result).toBe(5);
      expect(fn).toHaveBeenCalledWith(2, 3);
    });

    it('첫 호출 시 deprecation 경고를 출력한다', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapped = deprecated('dep.method', 'Use newMethod()', () => {});
      wrapped();
      expect(spy).toHaveBeenCalledWith('[nexon-sdk] DEPRECATED: Use newMethod()');
    });

    it('두 번째 호출부터는 경고 없이 동작한다', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const fn = vi.fn(() => 42);
      const wrapped = deprecated('dep.once', 'msg', fn);
      wrapped();
      wrapped();
      wrapped();
      expect(spy).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
