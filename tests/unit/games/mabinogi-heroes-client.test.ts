import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server.js';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import type { HttpClientConfig } from '../../../src/core/http/http-types.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonNotFoundError } from '../../../src/core/errors/NexonNotFoundError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { MabinogiHeroesClient } from '../../../src/games/mabinogi-heroes/MabinogiHeroesClient.js';
import { MabinogiHeroesCharacterClient } from '../../../src/games/mabinogi-heroes/character/MabinogiHeroesCharacterClient.js';
import { MabinogiHeroesMetaClient } from '../../../src/games/mabinogi-heroes/meta/MabinogiHeroesMetaClient.js';
import { MabinogiHeroesNoticeClient } from '../../../src/games/mabinogi-heroes/notice/MabinogiHeroesNoticeClient.js';
import { MabinogiHeroesMarketplaceClient } from '../../../src/games/mabinogi-heroes/marketplace/MabinogiHeroesMarketplaceClient.js';
import { MabinogiHeroesRankingClient } from '../../../src/games/mabinogi-heroes/ranking/MabinogiHeroesRankingClient.js';
import type { HeroesOCID } from '../../../src/games/mabinogi-heroes/types.js';
import type { HeroesEnchantType } from '../../../src/games/mabinogi-heroes/meta/types.js';
import type { HeroesRankingType } from '../../../src/games/mabinogi-heroes/ranking/types.js';
import { heroesOcidFixture } from '../../fixtures/mabinogi-heroes/ocid.fixture.js';
import {
  heroesCharacterBasicFixture,
  heroesCharacterGuildFixture,
  heroesCharacterItemEquipmentFixture,
  heroesCharacterNoGuildFixture,
  heroesCharacterStatFixture,
  heroesCharacterTitleEquipmentFixture,
  heroesCharacterTitleFixture,
} from '../../fixtures/mabinogi-heroes/character.fixture.js';
import { heroesEnchantMetaFixture } from '../../fixtures/mabinogi-heroes/meta.fixture.js';
import {
  heroesEventNoticeDetailFixture,
  heroesEventNoticeListFixture,
  heroesNoticeDetailFixture,
  heroesNoticeListFixture,
  heroesPatchNoticeDetailFixture,
  heroesPatchNoticeListFixture,
} from '../../fixtures/mabinogi-heroes/notice.fixture.js';
import {
  HEROES_MARKET_NEXT_CURSOR,
  heroesGoldMarketBuyTop30Fixture,
  heroesGoldMarketSellTop30Fixture,
  heroesMarketHistoryFixture,
  heroesMarketHistoryLastPageFixture,
} from '../../fixtures/mabinogi-heroes/marketplace.fixture.js';
import {
  heroesHallOfHonorRankingFixture,
  heroesRealTimeRankingFixture,
} from '../../fixtures/mabinogi-heroes/ranking.fixture.js';

const TEST_API_KEY = 'test-api-key';
const V1 = 'https://open.api.nexon.com/heroes/v1';
const V2 = 'https://open.api.nexon.com/heroes/v2';
const TEST_OCID = heroesOcidFixture.ocid as HeroesOCID;

interface Harness {
  readonly client: MabinogiHeroesClient;
  /** SDK가 실제로 보낸 요청 URL (쿼리 포함) */
  readonly requests: URL[];
  /** responseValidation 이 보고한 shape 불일치 */
  readonly mismatches: ShapeMismatch[];
}

const createHarness = (config: Partial<HttpClientConfig> = {}): Harness => {
  const requests: URL[] = [];
  const mismatches: ShapeMismatch[] = [];
  const httpClient = new HttpClient({
    apiKey: TEST_API_KEY,
    responseValidation: true,
    logger: {
      onRequest: (info) => requests.push(new URL(info.url)),
      onResponseShapeMismatch: (mismatch) => mismatches.push(mismatch),
    },
    ...config,
  });
  return { client: new MabinogiHeroesClient(httpClient), requests, mismatches };
};

/** 마지막 요청의 경로와 쿼리가 스펙과 같은지 확인한다 */
const expectRequest = (harness: Harness, url: string, query: Record<string, string> = {}): void => {
  const last = harness.requests.at(-1);
  expect(last).toBeDefined();
  expect(`${last?.origin}${last?.pathname}`).toBe(url);
  expect(Object.fromEntries(last?.searchParams ?? [])).toEqual(query);
  expect(harness.mismatches).toEqual([]);
};

const nexonError = (name: string, status: number): ReturnType<typeof HttpResponse.json> =>
  HttpResponse.json({ error: { name, message: 'mocked error' } }, { status });

describe('MabinogiHeroesClient', () => {
  describe('lazy getters', () => {
    it('sub-client getter는 각 클라이언트 인스턴스를 반환한다', () => {
      const { client } = createHarness();
      expect(client.character).toBeInstanceOf(MabinogiHeroesCharacterClient);
      expect(client.meta).toBeInstanceOf(MabinogiHeroesMetaClient);
      expect(client.notice).toBeInstanceOf(MabinogiHeroesNoticeClient);
      expect(client.marketplace).toBeInstanceOf(MabinogiHeroesMarketplaceClient);
      expect(client.ranking).toBeInstanceOf(MabinogiHeroesRankingClient);
    });

    it('같은 getter는 같은 인스턴스를 반환한다', () => {
      const { client } = createHarness();
      expect(client.character).toBe(client.character);
      expect(client.meta).toBe(client.meta);
      expect(client.notice).toBe(client.notice);
      expect(client.marketplace).toBe(client.marketplace);
      expect(client.ranking).toBe(client.ranking);
    });
  });

  describe('getOcid', () => {
    it('캐릭터명으로 ocid를 조회한다 (GET /heroes/v2/id)', async () => {
      const harness = createHarness();
      const ocid = await harness.client.getOcid('테스트영웅');

      expect(ocid).toBe(heroesOcidFixture.ocid);
      expectRequest(harness, `${V2}/id`, { character_name: '테스트영웅' });
    });

    it.each(['', '   '])('빈 캐릭터명(%j)은 요청 없이 NexonBadRequestError', async (name) => {
      const harness = createHarness();

      await expect(harness.client.getOcid(name)).rejects.toThrow(NexonBadRequestError);
      await expect(harness.client.getOcid(name)).rejects.toThrow(/characterName/);
      expect(harness.requests).toHaveLength(0);
    });

    it('캐릭터가 없으면 NexonNotFoundError (400 / OPENAPI00003)', async () => {
      server.use(http.get(`${V2}/id`, () => nexonError('OPENAPI00003', 400)));
      const { client } = createHarness();

      await expect(client.getOcid('없는영웅')).rejects.toThrow(NexonNotFoundError);
    });

    it('API 키가 거부되면 NexonAuthError (403 / OPENAPI00002)', async () => {
      server.use(http.get(`${V2}/id`, () => nexonError('OPENAPI00002', 403)));
      const { client } = createHarness();

      await expect(client.getOcid('테스트영웅')).rejects.toThrow(NexonAuthError);
    });
  });

  describe('character', () => {
    it('getBasic — GET /heroes/v2/character/basic', async () => {
      const harness = createHarness();
      const result = await harness.client.character.getBasic({ ocid: TEST_OCID });

      expect(result).toEqual(heroesCharacterBasicFixture);
      expectRequest(harness, `${V2}/character/basic`, { ocid: TEST_OCID });
    });

    it('getTitle — GET /heroes/v2/character/title', async () => {
      const harness = createHarness();
      const result = await harness.client.character.getTitle({ ocid: TEST_OCID });

      expect(result).toEqual(heroesCharacterTitleFixture);
      expect(result.title[2]?.title_type).toBeNull();
      expectRequest(harness, `${V2}/character/title`, { ocid: TEST_OCID });
    });

    it('getTitleEquipment — GET /heroes/v2/character/title-equipment', async () => {
      const harness = createHarness();
      const result = await harness.client.character.getTitleEquipment({ ocid: TEST_OCID });

      expect(result).toEqual(heroesCharacterTitleEquipmentFixture);
      expectRequest(harness, `${V2}/character/title-equipment`, { ocid: TEST_OCID });
    });

    it('getItemEquipment — GET /heroes/v2/character/item-equipment', async () => {
      const harness = createHarness();
      const result = await harness.client.character.getItemEquipment({ ocid: TEST_OCID });

      expect(result).toEqual(heroesCharacterItemEquipmentFixture);
      expect(result.item_equipment[0]?.item_option?.enhancement_level).toBe(15);
      expect(result.item_equipment[1]?.item_option?.enhancement_level).toBeNull();
      expectRequest(harness, `${V2}/character/item-equipment`, { ocid: TEST_OCID });
    });

    it('getStat — GET /heroes/v2/character/stat', async () => {
      const harness = createHarness();
      const result = await harness.client.character.getStat({ ocid: TEST_OCID });

      expect(result).toEqual(heroesCharacterStatFixture);
      expectRequest(harness, `${V2}/character/stat`, { ocid: TEST_OCID });
    });

    it('getGuild — GET /heroes/v2/character/guild', async () => {
      const harness = createHarness();
      const result = await harness.client.character.getGuild({ ocid: TEST_OCID });

      expect(result).toEqual(heroesCharacterGuildFixture);
      expectRequest(harness, `${V2}/character/guild`, { ocid: TEST_OCID });
    });

    it('getGuild — 길드가 없어 guild_name이 null이어도 shape 불일치가 아니다', async () => {
      server.use(
        http.get(`${V2}/character/guild`, () => HttpResponse.json(heroesCharacterNoGuildFixture)),
      );
      const harness = createHarness();
      const result = await harness.client.character.getGuild({ ocid: TEST_OCID });

      expect(result.guild_name).toBeNull();
      expect(harness.mismatches).toEqual([]);
    });

    it('빈 ocid는 모든 메서드에서 요청 없이 NexonBadRequestError', async () => {
      const harness = createHarness();
      const { character } = harness.client;
      const params = { ocid: '' as HeroesOCID };

      for (const call of [
        () => character.getBasic(params),
        () => character.getTitle(params),
        () => character.getTitleEquipment(params),
        () => character.getItemEquipment(params),
        () => character.getStat(params),
        () => character.getGuild(params),
      ]) {
        await expect(call()).rejects.toThrow(NexonBadRequestError);
        await expect(call()).rejects.toThrow(/getOcid/);
      }
      expect(harness.requests).toHaveLength(0);
    });

    it('호출 한도를 넘기면 NexonRateLimitError (429 / OPENAPI00007)', async () => {
      server.use(http.get(`${V2}/character/basic`, () => nexonError('OPENAPI00007', 429)));
      const { client } = createHarness({ maxRetries: 0 });

      await expect(client.character.getBasic({ ocid: TEST_OCID })).rejects.toThrow(
        NexonRateLimitError,
      );
    });
  });

  describe('meta', () => {
    it('getEnchant — GET /heroes/v2/meta/enchant', async () => {
      const harness = createHarness();
      const result = await harness.client.meta.getEnchant({
        enchant_type: '0',
        enchant_name: '용맹한',
      });

      expect(result).toEqual(heroesEnchantMetaFixture);
      expect(typeof result.enchant_grade).toBe('string');
      expectRequest(harness, `${V2}/meta/enchant`, { enchant_type: '0', enchant_name: '용맹한' });
    });

    it('잘못된 enchant_type / 빈 enchant_name은 요청 없이 NexonBadRequestError', async () => {
      const harness = createHarness();
      const { meta } = harness.client;

      await expect(
        meta.getEnchant({ enchant_type: '2' as HeroesEnchantType, enchant_name: '용맹한' }),
      ).rejects.toThrow(/enchant_type/);
      await expect(
        // JS 호출자가 숫자를 넘기는 실수를 재현한다
        meta.getEnchant({
          enchant_type: 0 as unknown as HeroesEnchantType,
          enchant_name: '용맹한',
        }),
      ).rejects.toThrow(NexonBadRequestError);
      await expect(meta.getEnchant({ enchant_type: '1', enchant_name: ' ' })).rejects.toThrow(
        /enchant_name/,
      );
      expect(harness.requests).toHaveLength(0);
    });
  });

  describe('notice', () => {
    it('getList — GET /heroes/v1/notice', async () => {
      const harness = createHarness();
      const result = await harness.client.notice.getList();

      expect(result).toEqual(heroesNoticeListFixture);
      expectRequest(harness, `${V1}/notice`);
    });

    it('getDetail — GET /heroes/v1/notice/detail', async () => {
      const harness = createHarness();
      const result = await harness.client.notice.getDetail(2001);

      expect(result).toEqual(heroesNoticeDetailFixture);
      expectRequest(harness, `${V1}/notice/detail`, { notice_id: '2001' });
    });

    it('getPatchList — GET /heroes/v1/notice-patch', async () => {
      const harness = createHarness();
      const result = await harness.client.notice.getPatchList();

      expect(result).toEqual(heroesPatchNoticeListFixture);
      expectRequest(harness, `${V1}/notice-patch`);
    });

    it('getPatchDetail — GET /heroes/v1/notice-patch/detail', async () => {
      const harness = createHarness();
      const result = await harness.client.notice.getPatchDetail(3001);

      expect(result).toEqual(heroesPatchNoticeDetailFixture);
      expectRequest(harness, `${V1}/notice-patch/detail`, { notice_id: '3001' });
    });

    it('getEventList — GET /heroes/v1/notice-event', async () => {
      const harness = createHarness();
      const result = await harness.client.notice.getEventList();

      expect(result).toEqual(heroesEventNoticeListFixture);
      expect(result.event_notice[1]?.date_event_end).toBeNull();
      expectRequest(harness, `${V1}/notice-event`);
    });

    it('getEventDetail — GET /heroes/v1/notice-event/detail', async () => {
      const harness = createHarness();
      const result = await harness.client.notice.getEventDetail(4001);

      expect(result).toEqual(heroesEventNoticeDetailFixture);
      expectRequest(harness, `${V1}/notice-event/detail`, { notice_id: '4001' });
    });

    it.each([0, -1, 1.5, Number.NaN])(
      '잘못된 noticeId(%s)는 요청 없이 NexonBadRequestError',
      async (noticeId) => {
        const harness = createHarness();
        const { notice } = harness.client;

        await expect(notice.getDetail(noticeId)).rejects.toThrow(NexonBadRequestError);
        await expect(notice.getPatchDetail(noticeId)).rejects.toThrow(/getPatchList/);
        await expect(notice.getEventDetail(noticeId)).rejects.toThrow(/getEventList/);
        expect(harness.requests).toHaveLength(0);
      },
    );
  });

  describe('marketplace', () => {
    it('listHistory — GET /heroes/v2/marketplace/market-history (첫 페이지, cursor 생략)', async () => {
      const harness = createHarness();
      const result = await harness.client.marketplace.listHistory({ item_name: '인챈트 스크롤' });

      expect(result).toEqual(heroesMarketHistoryFixture);
      expect(result.next_cursor).toBe(HEROES_MARKET_NEXT_CURSOR);
      expectRequest(harness, `${V2}/marketplace/market-history`, { item_name: '인챈트 스크롤' });
    });

    it('listHistory — next_cursor를 cursor로 넘겨 다음 페이지를 조회한다', async () => {
      const harness = createHarness();
      const { marketplace } = harness.client;
      const first = await marketplace.listHistory({ item_name: '테스트 팔찌' });
      const next = await marketplace.listHistory({
        item_name: '테스트 팔찌',
        cursor: first.next_cursor ?? undefined,
      });

      expect(next).toEqual(heroesMarketHistoryLastPageFixture);
      expect(next.next_cursor).toBeNull();
      expectRequest(harness, `${V2}/marketplace/market-history`, {
        item_name: '테스트 팔찌',
        cursor: HEROES_MARKET_NEXT_CURSOR,
      });
    });

    it('listHistory — 빈 item_name은 요청 없이 NexonBadRequestError', async () => {
      const harness = createHarness();

      await expect(harness.client.marketplace.listHistory({ item_name: '' })).rejects.toThrow(
        NexonBadRequestError,
      );
      await expect(harness.client.marketplace.listHistory({ item_name: '' })).rejects.toThrow(
        /item_name/,
      );
      expect(harness.requests).toHaveLength(0);
    });

    it('listHistory — 서버가 cursor를 거부하면 NexonBadRequestError (400 / OPENAPI00004)', async () => {
      const { client } = createHarness();

      await expect(
        client.marketplace.listHistory({ item_name: '인챈트 스크롤', cursor: 'invalid-cursor' }),
      ).rejects.toThrow(NexonBadRequestError);
    });

    it('getGoldBuyTop30 — GET /heroes/v2/marketplace/gold-market-buy-top-30', async () => {
      const harness = createHarness();
      const result = await harness.client.marketplace.getGoldBuyTop30();

      expect(result).toEqual(heroesGoldMarketBuyTop30Fixture);
      expect(result.buy_gold[0]?.buy_gold).toBe(5200000000);
      expectRequest(harness, `${V2}/marketplace/gold-market-buy-top-30`);
    });

    it('getGoldSellTop30 — GET /heroes/v2/marketplace/gold-market-sell-top-30', async () => {
      const harness = createHarness();
      const result = await harness.client.marketplace.getGoldSellTop30();

      expect(result).toEqual(heroesGoldMarketSellTop30Fixture);
      expect(result.sell_gold[0]?.sell_gold).toBe(6300000000);
      expectRequest(harness, `${V2}/marketplace/gold-market-sell-top-30`);
    });
  });

  describe('ranking', () => {
    it('getHallOfHonor — GET /heroes/v2/ranking/hall-of-honor ({ ranking: [...] } 응답에서 배열을 꺼낸다)', async () => {
      const harness = createHarness();
      const result = await harness.client.ranking.getHallOfHonor({ ranking_type: '0' });

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(heroesHallOfHonorRankingFixture.ranking);
      expect(result).toHaveLength(2);
      expect(result[0]?.character_name).toBe('테스트랭커1');
      expectRequest(harness, `${V2}/ranking/hall-of-honor`, { ranking_type: '0' });
    });

    it('getRealTime — GET /heroes/v2/ranking/real-time ({ ranking: [...] } 응답에서 배열을 꺼낸다)', async () => {
      const harness = createHarness();
      const result = await harness.client.ranking.getRealTime({ ranking_type: '1', page_no: 2 });

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(heroesRealTimeRankingFixture.ranking);
      expect(result[0]?.ranking).toBe(501);
      expectRequest(harness, `${V2}/ranking/real-time`, { ranking_type: '1', page_no: '2' });
    });

    it('포털 스펙 형태(최상위 배열)가 와도 두 메서드 모두 그 배열을 그대로 돌려준다', async () => {
      const harness = createHarness();
      const honorUrl = `${V2}/ranking/hall-of-honor`;
      const realTimeUrl = `${V2}/ranking/real-time`;
      server.use(
        http.get(honorUrl, () => HttpResponse.json(heroesHallOfHonorRankingFixture.ranking)),
        http.get(realTimeUrl, () => HttpResponse.json(heroesRealTimeRankingFixture.ranking)),
      );

      await expect(harness.client.ranking.getHallOfHonor({ ranking_type: '0' })).resolves.toEqual(
        heroesHallOfHonorRankingFixture.ranking,
      );
      await expect(
        harness.client.ranking.getRealTime({ ranking_type: '1', page_no: 2 }),
      ).resolves.toEqual(heroesRealTimeRankingFixture.ranking);
      // shape는 실제 응답(객체)을 기준으로 하므로 스펙 형태는 불일치로 보고된다
      expect(harness.mismatches).toEqual([
        expect.objectContaining({ url: `${honorUrl}?ranking_type=0`, missingKeys: ['ranking'] }),
        expect.objectContaining({
          url: `${realTimeUrl}?ranking_type=1&page_no=2`,
          missingKeys: ['ranking'],
        }),
      ]);
    });

    it('ranking 배열이 빠진 객체 응답은 불일치를 보고하고 빈 배열을 돌려준다', async () => {
      const harness = createHarness();
      const url = `${V2}/ranking/hall-of-honor`;
      server.use(http.get(url, () => HttpResponse.json({})));

      await expect(harness.client.ranking.getHallOfHonor({ ranking_type: '0' })).resolves.toEqual(
        [],
      );
      expect(harness.mismatches).toEqual([
        expect.objectContaining({ url: `${url}?ranking_type=0`, missingKeys: ['ranking'] }),
      ]);
    });

    it('잘못된 ranking_type / page_no는 요청 없이 NexonBadRequestError', async () => {
      const harness = createHarness();
      const { ranking } = harness.client;
      const badType = 'attack' as HeroesRankingType;

      await expect(ranking.getHallOfHonor({ ranking_type: badType })).rejects.toThrow(
        NexonBadRequestError,
      );
      await expect(ranking.getRealTime({ ranking_type: badType, page_no: 1 })).rejects.toThrow(
        /ranking_type/,
      );
      await expect(ranking.getRealTime({ ranking_type: '0', page_no: 0 })).rejects.toThrow(
        /page_no/,
      );
      await expect(ranking.getRealTime({ ranking_type: '0', page_no: 1.5 })).rejects.toThrow(
        NexonBadRequestError,
      );
      expect(harness.requests).toHaveLength(0);
    });
  });
});
