import { assertOneOf, invalidInput } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { AUCTION_LIST_SHAPE, AUCTION_HISTORY_SHAPE } from '../shapes.js';
import { MABINOGI_AUCTION_ITEM_CATEGORIES } from './types.js';
import type {
  MabinogiAuctionItemCategory,
  MabinogiAuctionList,
  MabinogiAuctionHistory,
  MabinogiAuctionFilters,
  MabinogiAuctionKeywordSearchRequest,
} from './types.js';

/** 마비노기 경매장 API. */
export class MabinogiAuctionClient {
  private static readonly BASE = 'https://open.api.nexon.com/mabinogi/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 경매장에서 판매 중인 매물을 한 페이지 조회한다.
   *
   * @param params - 경매장 분류·아이템 이름, 다음 페이지를 열 때 쓰는 `cursor`
   * @throws {NexonBadRequestError} 지원되지 않는 카테고리를 지정했을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 경매장 시세표에 검 매물을 보여 줄 때
   * const page = await client.mabinogi.auction.listItems({ auction_item_category: '검' });
   * console.log(page.auction_item);
   * ```
   */
  async listItems({
    auction_item_category,
    item_name,
    cursor,
  }: MabinogiAuctionFilters = {}): Promise<MabinogiAuctionList> {
    validateCategory(auction_item_category);
    return this.http.get(
      `${MabinogiAuctionClient.BASE}/auction/list`,
      { auction_item_category, item_name, cursor },
      AUCTION_LIST_SHAPE,
    );
  }

  /**
   * 경매장에서 최근 1시간 동안 거래된 아이템 내역을 한 페이지 조회한다.
   *
   * @param params - 경매장 분류·아이템 이름, 다음 페이지를 열 때 쓰는 `cursor`
   * @throws {NexonBadRequestError} 지원되지 않는 카테고리를 지정했을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 시세 조사에서 최근 거래가를 모을 때
   * const page = await client.mabinogi.auction.listHistory({ auction_item_category: '검' });
   * console.log(page.auction_history);
   * ```
   */
  async listHistory({
    auction_item_category,
    item_name,
    cursor,
  }: MabinogiAuctionFilters = {}): Promise<MabinogiAuctionHistory> {
    validateCategory(auction_item_category);
    return this.http.get(
      `${MabinogiAuctionClient.BASE}/auction/history`,
      { auction_item_category, item_name, cursor },
      AUCTION_HISTORY_SHAPE,
    );
  }

  /**
   * 경매장에서 이름에 검색어가 모두 일치하는 매물을 한 페이지 조회한다.
   *
   * @param params - 쉼표로 나눈 검색어 1~10개와 다음 페이지를 열 때 쓰는 `cursor`
   * @throws {NexonBadRequestError} 검색어 개수가 1~10개 범위를 벗어날 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 상세 검색에서 이름 속 두 단어가 모두 일치하는 매물을 보여 줄 때
   * const page = await client.mabinogi.auction.listByKeyword({ keyword: '숏,소드' });
   * console.log(page.auction_item);
   * ```
   */
  async listByKeyword({
    keyword,
    cursor,
  }: MabinogiAuctionKeywordSearchRequest): Promise<MabinogiAuctionList> {
    // 서버는 쉼표, 공백 및 특수 문자로 검색어를 구분합니다.
    const keywordCount =
      typeof keyword === 'string'
        ? (keyword.match(/[\p{Script=Hangul}a-zA-Z0-9]+/gu)?.length ?? 0)
        : 0;
    if (keywordCount < 1 || keywordCount > 10) {
      invalidInput(
        'keyword 검색어 개수가 허용 범위를 벗어났습니다.',
        '한글, 영문 또는 숫자로 된 검색어를 쉼표로 구분해 1~10개 입력하세요.',
      );
    }

    return this.http.get(
      `${MabinogiAuctionClient.BASE}/auction/keyword-search`,
      { keyword, cursor },
      AUCTION_LIST_SHAPE,
    );
  }
}

function validateCategory(category: MabinogiAuctionItemCategory | undefined): void {
  if (category !== undefined) {
    assertOneOf(
      category,
      MABINOGI_AUCTION_ITEM_CATEGORIES,
      'auction_item_category',
      '예시는 검입니다.',
    );
  }
}
