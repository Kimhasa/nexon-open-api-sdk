import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NexonClient, NexonBadRequestError } from '../../../src/index.js';
import type {
  MabinogiAuctionItemCategory,
  MabinogiClient,
  MabinogiNpcName,
  MabinogiServerName,
} from '../../../src/index.js';
import {
  mabinogiAuctionHistoryFixture,
  mabinogiAuctionListFixture,
  mabinogiHornBugleWorldFixture,
  mabinogiNpcShopFixture,
} from '../../fixtures/mabinogi/fixtures.fixture.js';
import { server } from '../../mocks/server.js';

const onRequest = vi.fn<({ url }: { url: string }) => void>();
const onResponseShapeMismatch = vi.fn();
let game: MabinogiClient;

function expectRequest(path: string, query: Record<string, string> = {}): void {
  const request = onRequest.mock.lastCall?.[0];
  expect(request).toBeDefined();
  const url = new URL(request!.url);
  expect(url.origin).toBe('https://open.api.nexon.com');
  expect(url.pathname).toBe(`/mabinogi/v1/${path}`);
  expect(Object.fromEntries(url.searchParams)).toEqual(query);
  expect(onResponseShapeMismatch).not.toHaveBeenCalled();
}

beforeEach(() => {
  onRequest.mockClear();
  onResponseShapeMismatch.mockClear();
  game = new NexonClient({
    apiKey: 'test-api-key',
    responseValidation: true,
    logger: { onRequest, onResponseShapeMismatch },
  }).mabinogi;
});

describe('MabinogiClient', () => {
  it('sub-client 인스턴스를 재사용한다', () => {
    expect(game.npcShop).toBe(game.npcShop);
    expect(game.auction).toBe(game.auction);
    expect(game.hornBugleWorld).toBe(game.hornBugleWorld);
  });

  it('NPC, 서버 및 채널로 상점 목록을 조회한다', async () => {
    await expect(
      game.npcShop.list({ npc_name: '상인 라누', server_name: '류트', channel: 1 }),
    ).resolves.toEqual(mabinogiNpcShopFixture);
    expectRequest('npcshop/list', { npc_name: '상인 라누', server_name: '류트', channel: '1' });
  });

  it('경매장 매물을 한 페이지씩 조회하고 다음 커서를 그대로 전달한다', async () => {
    const filters = { auction_item_category: '검', item_name: '숏 소드' } as const;
    const firstPage = await game.auction.list(filters);
    expect(firstPage).toEqual(mabinogiAuctionListFixture);
    expectRequest('auction/list', filters);
    expect(onRequest).toHaveBeenCalledTimes(1);

    const cursor = firstPage.next_cursor!;
    await expect(game.auction.list({ ...filters, cursor })).resolves.toEqual({
      auction_item: [],
      next_cursor: null,
    });
    expectRequest('auction/list', { ...filters, cursor });
    expect(onRequest).toHaveBeenCalledTimes(2);
  });

  it('선택 필터를 생략할 수 있다', async () => {
    await expect(game.auction.list()).resolves.toEqual(mabinogiAuctionListFixture);
    expectRequest('auction/list');
    await expect(game.auction.listHistory()).resolves.toEqual(mabinogiAuctionHistoryFixture);
    expectRequest('auction/history');
  });

  it('경매장 거래 내역을 한 페이지 조회한다', async () => {
    const filters = {
      auction_item_category: '검',
      item_name: '숏 소드',
      cursor: 'history+cursor=',
    } as const;
    await expect(game.auction.listHistory(filters)).resolves.toEqual(mabinogiAuctionHistoryFixture);
    expectRequest('auction/history', filters);
  });

  it('경매장 매물을 키워드로 한 페이지 조회한다', async () => {
    const params = { keyword: '숏,소드', cursor: 'keyword+cursor=' };
    await expect(game.auction.listByKeyword(params)).resolves.toEqual(mabinogiAuctionListFixture);
    expectRequest('auction/keyword-search', params);
  });

  it('키워드 구분자는 서버가 정규화할 수 있도록 그대로 전송한다', async () => {
    const params = { keyword: '숏 + 소드' };
    await expect(game.auction.listByKeyword(params)).resolves.toEqual(mabinogiAuctionListFixture);
    expectRequest('auction/keyword-search', params);
  });

  it('서버의 거대한 외침의 뿔피리 내역을 조회한다', async () => {
    await expect(game.hornBugleWorld.getHistory('울프')).resolves.toEqual(
      mabinogiHornBugleWorldFixture,
    );
    expectRequest('horn-bugle-world/history', { server_name: '울프' });
  });

  it('400 응답을 NexonBadRequestError로 분류한다', async () => {
    server.use(
      http.get('https://open.api.nexon.com/mabinogi/v1/npcshop/list', () =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00004', message: 'Invalid channel' } },
          { status: 400 },
        ),
      ),
    );
    await expect(
      game.npcShop.list({ npc_name: '델', server_name: '류트', channel: 999 }),
    ).rejects.toBeInstanceOf(NexonBadRequestError);
  });

  it('NPC, 서버 및 채널 입력을 요청 전에 검증한다', async () => {
    await expect(
      game.npcShop.list({
        npc_name: '알 수 없음' as MabinogiNpcName,
        server_name: '류트',
        channel: 1,
      }),
    ).rejects.toThrow(/npc_name/);
    await expect(
      game.npcShop.list({ npc_name: '델', server_name: '류트', channel: 1.5 }),
    ).rejects.toThrow(/channel/);
    await expect(game.hornBugleWorld.getHistory('' as MabinogiServerName)).rejects.toThrow(
      /server_name/,
    );
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('경매장 카테고리 및 검색어 개수를 요청 전에 검증한다', async () => {
    await expect(
      game.auction.list({ auction_item_category: '알 수 없음' as MabinogiAuctionItemCategory }),
    ).rejects.toThrow(/auction_item_category/);
    await expect(game.auction.listByKeyword({ keyword: ' , +' })).rejects.toThrow(/keyword/);
    await expect(
      game.auction.listByKeyword({ keyword: '1,2,3,4,5,6,7,8,9,10,11' }),
    ).rejects.toThrow(/keyword/);
    expect(onRequest).not.toHaveBeenCalled();
  });
});
