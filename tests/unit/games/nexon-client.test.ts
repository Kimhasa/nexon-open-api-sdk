import { describe, it, expect } from 'vitest';
import { NexonClient } from '../../../src/NexonClient.js';
import { MapleStoryClient } from '../../../src/games/maplestory/MapleStoryClient.js';

describe('NexonClient', () => {
  it('API 키 없이 생성하면 에러를 던진다', () => {
    expect(() => new NexonClient({ apiKey: '' })).toThrow('API 키가 필요합니다');
  });

  it('유효한 API 키로 생성할 수 있다', () => {
    const client = new NexonClient({ apiKey: 'test-key' });
    expect(client).toBeInstanceOf(NexonClient);
  });

  it('maplestory getter가 MapleStoryClient를 반환한다', () => {
    const client = new NexonClient({ apiKey: 'test-key' });
    expect(client.maplestory).toBeInstanceOf(MapleStoryClient);
  });

  it('maplestory getter는 같은 인스턴스를 반환한다 (lazy singleton)', () => {
    const client = new NexonClient({ apiKey: 'test-key' });
    const first = client.maplestory;
    const second = client.maplestory;
    expect(first).toBe(second);
  });
});
