import { describe, it, expect } from 'vitest';
import { HttpClient as RootHttpClient } from '../../../src/index.js';
import * as maplestory from '../../../src/games/maplestory/index.js';
import * as maplestoryM from '../../../src/games/maplestory-m/index.js';
import * as maplestorySEA from '../../../src/games/maplestory-sea/index.js';
import * as maplestoryTW from '../../../src/games/maplestory-tw/index.js';
import * as fcOnline from '../../../src/games/fc-online/index.js';
import * as firstDescendant from '../../../src/games/first-descendant/index.js';
import * as mabinogiHeroes from '../../../src/games/mabinogi-heroes/index.js';
import * as suddenAttack from '../../../src/games/sudden-attack/index.js';
import * as kartrider from '../../../src/games/kartrider/index.js';
import * as baram from '../../../src/games/baram/index.js';
import * as mabinogi from '../../../src/games/mabinogi/index.js';
import * as baramYeon from '../../../src/games/baram-yeon/index.js';
import * as v4 from '../../../src/games/v4/index.js';
import * as hit2 from '../../../src/games/hit2/index.js';
import * as platform from '../../../src/games/platform/index.js';

// sub-path 이름은 package.json 의 exports 키와 같다
const SUB_PATHS = [
  { subPath: 'maplestory', entry: maplestory, ClientClass: maplestory.MapleStoryClient },
  { subPath: 'maplestory-m', entry: maplestoryM, ClientClass: maplestoryM.MapleStoryMClient },
  {
    subPath: 'maplestory-sea',
    entry: maplestorySEA,
    ClientClass: maplestorySEA.MapleStorySEAClient,
  },
  { subPath: 'maplestory-tw', entry: maplestoryTW, ClientClass: maplestoryTW.MapleStoryTWClient },
  { subPath: 'fconline', entry: fcOnline, ClientClass: fcOnline.FcOnlineClient },
  {
    subPath: 'first-descendant',
    entry: firstDescendant,
    ClientClass: firstDescendant.FirstDescendantClient,
  },
  {
    subPath: 'mabinogi-heroes',
    entry: mabinogiHeroes,
    ClientClass: mabinogiHeroes.MabinogiHeroesClient,
  },
  { subPath: 'sudden-attack', entry: suddenAttack, ClientClass: suddenAttack.SuddenAttackClient },
  { subPath: 'kartrider', entry: kartrider, ClientClass: kartrider.KartriderClient },
  { subPath: 'baram', entry: baram, ClientClass: baram.BaramClient },
  { subPath: 'mabinogi', entry: mabinogi, ClientClass: mabinogi.MabinogiClient },
  { subPath: 'baram-yeon', entry: baramYeon, ClientClass: baramYeon.BaramYeonClient },
  { subPath: 'v4', entry: v4, ClientClass: v4.V4Client },
  { subPath: 'hit2', entry: hit2, ClientClass: hit2.Hit2Client },
  { subPath: 'platform', entry: platform, ClientClass: platform.PlatformClient },
] as const;

describe('게임 sub-path 진입점의 HttpClient export', () => {
  it('sub-path 15개를 모두 검사한다', () => {
    expect(SUB_PATHS).toHaveLength(15);
  });

  describe.each(SUB_PATHS)('nexon-open-api/$subPath', ({ entry, ClientClass }) => {
    it('HttpClient 를 export하고 루트의 HttpClient 와 같은 클래스다', () => {
      expect(entry.HttpClient).toBeTypeOf('function');
      expect(entry.HttpClient).toBe(RootHttpClient);
    });

    it('sub-path의 HttpClient 로 게임 Client를 생성한다', () => {
      const config: maplestory.HttpClientConfig = { apiKey: 'test-api-key' };
      const client = new ClientClass(new entry.HttpClient(config));

      expect(client).toBeInstanceOf(ClientClass);
    });
  });
});
