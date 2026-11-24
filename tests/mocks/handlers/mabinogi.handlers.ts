import { http, HttpResponse } from 'msw';
import {
  mabinogiAuctionHistoryFixture,
  mabinogiAuctionListFixture,
  mabinogiHornBugleWorldFixture,
  mabinogiNpcShopFixture,
} from '../../fixtures/mabinogi/fixtures.fixture.js';

const BASE = 'https://open.api.nexon.com/mabinogi/v1';

export const mabinogiHandlers = [
  http.get(`${BASE}/npcshop/list`, () => HttpResponse.json(mabinogiNpcShopFixture)),
  http.get(`${BASE}/auction/list`, ({ request }) => {
    const cursor = new URL(request.url).searchParams.get('cursor');
    return HttpResponse.json(
      cursor === mabinogiAuctionListFixture.next_cursor
        ? { auction_item: [], next_cursor: null }
        : mabinogiAuctionListFixture,
    );
  }),
  http.get(`${BASE}/auction/history`, () => HttpResponse.json(mabinogiAuctionHistoryFixture)),
  http.get(`${BASE}/auction/keyword-search`, () => HttpResponse.json(mabinogiAuctionListFixture)),
  http.get(`${BASE}/horn-bugle-world/history`, () =>
    HttpResponse.json(mabinogiHornBugleWorldFixture),
  ),
];
