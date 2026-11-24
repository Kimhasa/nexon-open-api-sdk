import type {
  MabinogiAuctionHistory,
  MabinogiAuctionList,
  MabinogiHornBugleWorldHistory,
  MabinogiItemOption,
  MabinogiNpcShopList,
} from '../../../src/games/mabinogi/index.js';

const itemOption: MabinogiItemOption = {
  option_type: '공격',
  option_sub_type: '기본',
  option_value: '20',
  option_value2: '40',
  option_desc: '최소·최대 공격력',
};

/** 하위 유형·둘째 값·부가 정보가 없는 옵션 */
const sparseItemOption: MabinogiItemOption = {
  option_type: '내구력',
  option_sub_type: null,
  option_value: null,
  option_value2: null,
  option_desc: null,
};

export const mabinogiNpcShopFixture: MabinogiNpcShopList = {
  shop_tab_count: 1,
  shop: [
    {
      tab_name: '잡화',
      item: [
        {
          item_display_name: '테스트 상품',
          item_count: 1,
          item_option: [itemOption],
          price: [{ price_type: '골드', price_value: 1000 }],
          limit_type: '주간',
          limit_value: 3,
          image_url: 'https://example.com/shop-item.png',
        },
        {
          item_display_name: '테스트 상시 상품',
          item_count: 1,
          item_option: [sparseItemOption],
          price: [{ price_type: '골드', price_value: 500 }],
          limit_type: null,
          limit_value: null,
          image_url: 'https://example.com/shop-item-2.png',
        },
      ],
    },
  ],
  date_inquire: '2024-09-01T00:00:000Z',
  date_shop_next_update: '2024-09-01T00:36:000Z',
};

export const mabinogiAuctionListFixture: MabinogiAuctionList = {
  auction_item: [
    {
      item_name: '숏 소드',
      item_display_name: '테스트 숏 소드',
      item_count: 1,
      auction_item_category: '검',
      auction_price_per_unit: 1500,
      date_auction_expire: '2024-09-01T08:28:35Z',
      item_option: [itemOption, sparseItemOption],
    },
    {
      item_name: '테스트 재료',
      item_display_name: '테스트 재료',
      item_count: 10,
      auction_item_category: '기타',
      auction_price_per_unit: 100,
      date_auction_expire: '2024-09-01T09:00:00Z',
      item_option: null,
    },
  ],
  next_cursor: 'test-auction-next+page/=',
};

export const mabinogiAuctionHistoryFixture: MabinogiAuctionHistory = {
  auction_history: [
    {
      item_name: '숏 소드',
      item_display_name: '테스트 숏 소드',
      item_count: 1,
      auction_item_category: '검',
      auction_price_per_unit: 1000,
      date_auction_buy: '2024-09-01T08:28:350Z',
      auction_buy_id: 'test-auction-buy-id',
      item_option: [itemOption],
    },
  ],
  next_cursor: null,
};

export const mabinogiHornBugleWorldFixture: MabinogiHornBugleWorldHistory = {
  horn_bugle_world_history: [
    {
      character_name: '합성테스트캐릭터',
      message: '뿔피리 테스트 메시지',
      date_send: '2024-09-01T08:28:350Z',
    },
  ],
};
