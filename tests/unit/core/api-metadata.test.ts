import { describe, it, expect } from 'vitest';
import { API_METADATA, getApiMetadata } from '../../../src/core/metadata/api-metadata.js';

/** SDK 범위의 넥슨 Open API path prefix (= 포털 slug, specs/openapi/index.json) */
const KNOWN_PREFIXES = [
  'maplestory',
  'maplestorym',
  'maplestorysea',
  'fconline',
  'maplestorytw',
  'tfd',
  'heroes',
  'suddenattack',
  'kartrush',
  'baram',
  'mabinogi',
  'baramy',
  'v4',
  'hit2',
  'platform',
];

describe('api-metadata', () => {
  it('기존 4개 게임이 등록되어 있다', () => {
    expect(Object.keys(API_METADATA)).toEqual(
      expect.arrayContaining(['maplestory', 'maplestorym', 'maplestorysea', 'fconline']),
    );
  });

  it('모든 키는 SDK 범위의 path prefix이고 pathPrefix 필드와 같다', () => {
    for (const [key, meta] of Object.entries(API_METADATA)) {
      expect(KNOWN_PREFIXES, key).toContain(key);
      expect(meta.pathPrefix, `${key}.pathPrefix`).toBe(key);
    }
  });

  it('모든 메타데이터 엔트리가 필수 필드를 가진다', () => {
    for (const [key, meta] of Object.entries(API_METADATA)) {
      expect(meta.game, `${key}.game`).toBeTruthy();
      expect(meta.lastVerifiedAt, `${key}.lastVerifiedAt`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(meta.sdkVersionAtVerification, `${key}.sdkVersionAtVerification`).toMatch(
        /^\d+\.\d+\.\d+$/,
      );
      expect(meta.endpointCount, `${key}.endpointCount`).toBeGreaterThan(0);
    }
  });

  it('getApiMetadata()로 게임 메타데이터를 조회할 수 있다', () => {
    const meta = getApiMetadata('maplestory');
    expect(meta).toBeDefined();
    expect(meta!.pathPrefix).toBe('maplestory');
  });

  it('존재하지 않는 게임은 undefined를 반환한다', () => {
    expect(getApiMetadata('nonexistent')).toBeUndefined();
  });
});
