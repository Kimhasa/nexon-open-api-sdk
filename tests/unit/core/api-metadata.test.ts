import { describe, it, expect } from 'vitest';
import { API_METADATA, getApiMetadata } from '../../../src/core/metadata/api-metadata.js';

describe('api-metadata', () => {
  it('API_METADATA에 maplestory 엔트리가 존재한다', () => {
    expect(API_METADATA['maplestory']).toBeDefined();
    expect(API_METADATA['maplestory']!.game).toBe('MapleStory KMS');
    expect(API_METADATA['maplestory']!.endpointCount).toBe(48);
  });

  it('구현된 4개 게임이 모두 등록되어 있고 키와 pathPrefix가 일치한다', () => {
    expect(Object.keys(API_METADATA).sort()).toEqual([
      'fconline',
      'maplestory',
      'maplestorym',
      'maplestorysea',
    ]);
    for (const [key, meta] of Object.entries(API_METADATA)) {
      expect(meta.pathPrefix, `${key}.pathPrefix`).toBe(key);
    }
  });

  it('endpointCount가 게임 클라이언트의 public API 메서드 수와 일치한다', () => {
    expect(API_METADATA['maplestorym']!.endpointCount).toBe(37);
    expect(API_METADATA['maplestorysea']!.endpointCount).toBe(26);
    expect(API_METADATA['fconline']!.endpointCount).toBe(16);
  });

  it('getApiMetadata()로 게임 메타데이터를 조회할 수 있다', () => {
    const meta = getApiMetadata('maplestory');
    expect(meta).toBeDefined();
    expect(meta!.pathPrefix).toBe('maplestory');
    expect(meta!.lastVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(meta!.sdkVersionAtVerification).toBe('0.1.0');
  });

  it('존재하지 않는 게임은 undefined를 반환한다', () => {
    expect(getApiMetadata('nonexistent')).toBeUndefined();
  });

  it('모든 메타데이터 엔트리가 필수 필드를 가진다', () => {
    for (const [key, meta] of Object.entries(API_METADATA)) {
      expect(meta.game, `${key}.game`).toBeTruthy();
      expect(meta.pathPrefix, `${key}.pathPrefix`).toBeTruthy();
      expect(meta.lastVerifiedAt, `${key}.lastVerifiedAt`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(meta.sdkVersionAtVerification, `${key}.sdkVersionAtVerification`).toMatch(
        /^\d+\.\d+\.\d+$/,
      );
      expect(meta.endpointCount, `${key}.endpointCount`).toBeGreaterThan(0);
    }
  });
});
