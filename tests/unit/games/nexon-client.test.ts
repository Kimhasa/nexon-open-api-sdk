import { describe, it, expect } from 'vitest';
import { NexonClient } from '../../../src/NexonClient.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { MapleStoryClient } from '../../../src/games/maplestory/MapleStoryClient.js';
import { MapleStoryMClient } from '../../../src/games/maplestory-m/MapleStoryMClient.js';
import { MapleStorySEAClient } from '../../../src/games/maplestory-sea/MapleStorySEAClient.js';
import { FcOnlineClient } from '../../../src/games/fc-online/FcOnlineClient.js';
import { MapleStoryTWClient } from '../../../src/games/maplestory-tw/MapleStoryTWClient.js';
import { FirstDescendantClient } from '../../../src/games/first-descendant/FirstDescendantClient.js';
import { MabinogiHeroesClient } from '../../../src/games/mabinogi-heroes/MabinogiHeroesClient.js';
import { SuddenAttackClient } from '../../../src/games/sudden-attack/SuddenAttackClient.js';
import { KartriderClient } from '../../../src/games/kartrider/KartriderClient.js';
import { BaramClient } from '../../../src/games/baram/BaramClient.js';
import { MabinogiClient } from '../../../src/games/mabinogi/MabinogiClient.js';
import { BaramYeonClient } from '../../../src/games/baram-yeon/BaramYeonClient.js';
import { V4Client } from '../../../src/games/v4/V4Client.js';
import { Hit2Client } from '../../../src/games/hit2/Hit2Client.js';
import { PlatformClient } from '../../../src/games/platform/PlatformClient.js';

const GAME_GETTERS = [
  { property: 'maplestory', ClientClass: MapleStoryClient },
  { property: 'maplestorym', ClientClass: MapleStoryMClient },
  { property: 'maplestorySEA', ClientClass: MapleStorySEAClient },
  { property: 'fcOnline', ClientClass: FcOnlineClient },
  { property: 'maplestoryTW', ClientClass: MapleStoryTWClient },
  { property: 'firstDescendant', ClientClass: FirstDescendantClient },
  { property: 'mabinogiHeroes', ClientClass: MabinogiHeroesClient },
  { property: 'suddenAttack', ClientClass: SuddenAttackClient },
  { property: 'kartrider', ClientClass: KartriderClient },
  { property: 'baram', ClientClass: BaramClient },
  { property: 'mabinogi', ClientClass: MabinogiClient },
  { property: 'baramYeon', ClientClass: BaramYeonClient },
  { property: 'v4', ClientClass: V4Client },
  { property: 'hit2', ClientClass: Hit2Client },
  { property: 'platform', ClientClass: PlatformClient },
] as const;

describe('NexonClient', () => {
  it('API 키 없이 생성하면 에러를 던진다', () => {
    expect(() => new NexonClient({ apiKey: '' })).toThrow('API 키가 비어 있습니다');
    expect(() => new NexonClient({ apiKey: '' })).toThrow(Error);
  });

  it.each([
    ['누락 (undefined)', undefined],
    ['빈 문자열', ''],
    ['공백뿐인 문자열', '   '],
  ])('apiKey 가 %s 이면 NexonBadRequestError(OPENAPI00004)를 던진다', (_label, apiKey) => {
    let caught: unknown;
    try {
      new NexonClient({ apiKey: apiKey as string });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(NexonBadRequestError);
    expect(caught).toBeInstanceOf(Error);
    expect((caught as NexonBadRequestError).code).toBe('OPENAPI00004');
    // 고치는 방법을 안내한다
    expect((caught as NexonBadRequestError).message).toContain('.env');
    expect((caught as NexonBadRequestError).message).toContain('--env-file=.env');
    expect((caught as NexonBadRequestError).message).toContain('https://openapi.nexon.com/');
  });

  it('유효한 API 키로 생성할 수 있다', () => {
    const client = new NexonClient({ apiKey: 'test-key' });
    expect(client).toBeInstanceOf(NexonClient);
  });

  describe.each(GAME_GETTERS)('$property getter', ({ property, ClientClass }) => {
    it('게임 클라이언트 인스턴스를 반환한다', () => {
      const client = new NexonClient({ apiKey: 'test-key' });
      expect(client[property]).toBeInstanceOf(ClientClass);
    });

    it('같은 인스턴스를 반환한다 (lazy singleton)', () => {
      const client = new NexonClient({ apiKey: 'test-key' });
      expect(client[property]).toBe(client[property]);
    });
  });
});
