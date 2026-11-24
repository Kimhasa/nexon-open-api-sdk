import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';
import { heroesOcidFixture } from '../../fixtures/mabinogi-heroes/ocid.fixture.js';
import {
  heroesCharacterBasicFixture,
  heroesCharacterGuildFixture,
  heroesCharacterItemEquipmentFixture,
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

// 공지는 V1, 그 밖(캐릭터·메타·거래소·랭킹)은 V2다 (specs/openapi/heroes/*.yaml)
const V1 = 'https://open.api.nexon.com/heroes/v1';
const V2 = 'https://open.api.nexon.com/heroes/v2';

type JsonResponse = ReturnType<typeof HttpResponse.json>;

const badRequest = (): JsonResponse =>
  HttpResponse.json(
    { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
    { status: 400 },
  );

/**
 * API 키와 필수 쿼리 파라미터를 확인하고, 스펙에 없는 쿼리 파라미터가 오면 400을 돌려준다.
 * SDK가 파라미터 이름을 스펙과 다르게 보내면 기본 성공 테스트가 실패하도록 하기 위한 장치다.
 */
const guard = (
  request: Request,
  required: readonly string[],
  optional: readonly string[] = [],
): JsonResponse | null => {
  if (!request.headers.get('x-nxopen-api-key')) {
    return HttpResponse.json(
      { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
      { status: 403 },
    );
  }
  const params = new URL(request.url).searchParams;
  for (const name of required) {
    if (!params.get(name)) return badRequest();
  }
  for (const name of params.keys()) {
    if (!required.includes(name) && !optional.includes(name)) return badRequest();
  }
  return null;
};

const ocidHandler = (path: string, body: object): RequestHandler =>
  http.get(`${V2}/${path}`, ({ request }) => {
    return guard(request, ['ocid']) ?? HttpResponse.json(body);
  });

const noParamHandler = (url: string, body: object): RequestHandler =>
  http.get(url, ({ request }) => {
    return guard(request, []) ?? HttpResponse.json(body);
  });

const noticeDetailHandler = (path: string, body: object): RequestHandler =>
  http.get(`${V1}/${path}`, ({ request }) => {
    return guard(request, ['notice_id']) ?? HttpResponse.json(body);
  });

const isRankingType = (value: string | null): boolean => value === '0' || value === '1';

/** 마비노기 영웅전 MSW 핸들러 */
export const mabinogiHeroesHandlers: RequestHandler[] = [
  // ID
  http.get(`${V2}/id`, ({ request }) => {
    return guard(request, ['character_name']) ?? HttpResponse.json(heroesOcidFixture);
  }),

  // Character
  ocidHandler('character/basic', heroesCharacterBasicFixture),
  ocidHandler('character/title', heroesCharacterTitleFixture),
  ocidHandler('character/title-equipment', heroesCharacterTitleEquipmentFixture),
  ocidHandler('character/item-equipment', heroesCharacterItemEquipmentFixture),
  ocidHandler('character/stat', heroesCharacterStatFixture),
  ocidHandler('character/guild', heroesCharacterGuildFixture),

  // Meta
  http.get(`${V2}/meta/enchant`, ({ request }) => {
    const error = guard(request, ['enchant_type', 'enchant_name']);
    if (error) return error;
    const type = new URL(request.url).searchParams.get('enchant_type');
    if (type !== '0' && type !== '1') return badRequest();
    return HttpResponse.json(heroesEnchantMetaFixture);
  }),

  // Notice
  noParamHandler(`${V1}/notice`, heroesNoticeListFixture),
  noticeDetailHandler('notice/detail', heroesNoticeDetailFixture),
  noParamHandler(`${V1}/notice-patch`, heroesPatchNoticeListFixture),
  noticeDetailHandler('notice-patch/detail', heroesPatchNoticeDetailFixture),
  noParamHandler(`${V1}/notice-event`, heroesEventNoticeListFixture),
  noticeDetailHandler('notice-event/detail', heroesEventNoticeDetailFixture),

  // Marketplace
  http.get(`${V2}/marketplace/market-history`, ({ request }) => {
    const error = guard(request, ['item_name'], ['cursor']);
    if (error) return error;
    const cursor = new URL(request.url).searchParams.get('cursor');
    if (cursor === null) return HttpResponse.json(heroesMarketHistoryFixture);
    if (cursor !== HEROES_MARKET_NEXT_CURSOR) return badRequest();
    return HttpResponse.json(heroesMarketHistoryLastPageFixture);
  }),
  noParamHandler(`${V2}/marketplace/gold-market-buy-top-30`, heroesGoldMarketBuyTop30Fixture),
  noParamHandler(`${V2}/marketplace/gold-market-sell-top-30`, heroesGoldMarketSellTop30Fixture),

  // Ranking
  http.get(`${V2}/ranking/hall-of-honor`, ({ request }) => {
    const error = guard(request, ['ranking_type']);
    if (error) return error;
    if (!isRankingType(new URL(request.url).searchParams.get('ranking_type'))) return badRequest();
    return HttpResponse.json(heroesHallOfHonorRankingFixture);
  }),
  http.get(`${V2}/ranking/real-time`, ({ request }) => {
    const error = guard(request, ['ranking_type', 'page_no']);
    if (error) return error;
    const params = new URL(request.url).searchParams;
    if (!isRankingType(params.get('ranking_type'))) return badRequest();
    if (!/^[1-9]\d*$/.test(params.get('page_no') ?? '')) return badRequest();
    return HttpResponse.json(heroesRealTimeRankingFixture);
  }),
];
