import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  HEROES_GOLD_MARKET_BUY_TOP_30_SHAPE,
  HEROES_GOLD_MARKET_SELL_TOP_30_SHAPE,
  HEROES_MARKET_HISTORY_SHAPE,
} from '../shapes.js';
import type {
  HeroesGoldMarketBuyTop30,
  HeroesGoldMarketSellTop30,
  HeroesMarketHistory,
  HeroesMarketHistoryRequest,
} from './types.js';

/**
 * 마비노기 영웅전 거래소 API 클라이언트 (V2).
 *
 * 최근 1주 데이터만 제공합니다. 게임 데이터는 평균 10분 뒤 반영됩니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const history = await client.mabinogiHeroes.marketplace.listHistory({ item_name: '인챈트 스크롤' });
 * const buyers = await client.mabinogiHeroes.marketplace.getGoldBuyTop30();
 * ```
 */
export class MabinogiHeroesMarketplaceClient {
  private static readonly BASE = 'https://open.api.nexon.com/heroes/v2';

  constructor(private readonly http: HttpClient) {}

  /**
   * 아이템의 최근 1주 거래 기록을 한 페이지 조회한다 (페이지당 500개).
   *
   * - 최근 24시간 내 10건 이상 거래된 아이템만 조회됩니다.
   * - 현재 평균가는 마지막으로 갱신된 기록의 `average_price` 입니다.
   * - 골드 거래소 내역도 포함되며 100만 골드당 가격 기준입니다.
   * - 다음 페이지는 응답의 `next_cursor` 를 `cursor` 로 넘겨 조회합니다 (자동 순회 없음).
   *
   * @param params.item_name - 아이템 명. 인챈트 스크롤은 `'인챈트 스크롤'` / `'인챈트 스크롤 (무기한)'` 으로 검색
   * @param params.cursor - 페이징 cursor (직전 응답의 `next_cursor`). 첫 페이지는 생략
   * @throws {NexonBadRequestError} item_name이 비어 있을 때 (요청 전에 SDK가 throw) 또는 cursor가 잘못됐을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const first = await client.mabinogiHeroes.marketplace.listHistory({ item_name: '인챈트 스크롤' });
   * for (const record of first.item) {
   *   console.log(record.date_update, record.average_price, record.item_option?.prefix_enchant_preset_1);
   * }
   *
   * // 다음 페이지
   * if (first.next_cursor) {
   *   const next = await client.mabinogiHeroes.marketplace.listHistory({
   *     item_name: '인챈트 스크롤',
   *     cursor: first.next_cursor,
   *   });
   *   console.log(next.item.length);
   * }
   * ```
   */
  async listHistory(params: HeroesMarketHistoryRequest): Promise<HeroesMarketHistory> {
    assertNonEmptyString(
      (params as HeroesMarketHistoryRequest | undefined)?.item_name,
      'item_name',
      "조회할 아이템 명을 넘겨주세요 (예: { item_name: '인챈트 스크롤' }).",
    );
    return this.http.get<HeroesMarketHistory>(
      `${MabinogiHeroesMarketplaceClient.BASE}/marketplace/market-history`,
      { item_name: params.item_name, cursor: params.cursor },
      HEROES_MARKET_HISTORY_SHAPE,
    );
  }

  /**
   * 최근 1주 동안 골드 거래소에서 골드를 가장 많이 구매한 상위 30명의 구매량을 조회한다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const { buy_gold } = await client.mabinogiHeroes.marketplace.getGoldBuyTop30();
   * for (const [index, buyer] of buy_gold.entries()) {
   *   console.log(`${index + 1}. ${buyer.cairde_name}: ${buyer.total_buy_gold}`);
   * }
   * ```
   */
  async getGoldBuyTop30(): Promise<HeroesGoldMarketBuyTop30> {
    return this.http.get<HeroesGoldMarketBuyTop30>(
      `${MabinogiHeroesMarketplaceClient.BASE}/marketplace/gold-market-buy-top-30`,
      undefined,
      HEROES_GOLD_MARKET_BUY_TOP_30_SHAPE,
    );
  }

  /**
   * 최근 1주 동안 골드 거래소에서 골드를 가장 많이 판매한 상위 30명의 판매량을 조회한다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const { sell_gold } = await client.mabinogiHeroes.marketplace.getGoldSellTop30();
   * for (const [index, seller] of sell_gold.entries()) {
   *   console.log(`${index + 1}. ${seller.cairde_name}: ${seller.total_sell_gold}`);
   * }
   * ```
   */
  async getGoldSellTop30(): Promise<HeroesGoldMarketSellTop30> {
    return this.http.get<HeroesGoldMarketSellTop30>(
      `${MabinogiHeroesMarketplaceClient.BASE}/marketplace/gold-market-sell-top-30`,
      undefined,
      HEROES_GOLD_MARKET_SELL_TOP_30_SHAPE,
    );
  }
}
