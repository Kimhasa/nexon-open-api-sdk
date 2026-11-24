import type {
  HeroesGoldMarketBuyTop30,
  HeroesGoldMarketSellTop30,
  HeroesMarketHistory,
} from '../../../src/games/mabinogi-heroes/marketplace/types.js';

// 포털 스펙(specs/openapi/heroes/30.yaml) 스키마로 합성한 값이다. 실 API 응답이 아니다.
// 필드 구성은 2026-11-24 실제 응답을 따른다: item_option은 해당하는 옵션만 있고, 골드 상위 목록은 buy_gold·sell_gold로 온다.

export const HEROES_MARKET_NEXT_CURSOR = 'heroes-test-cursor-page-2';

export const heroesMarketHistoryFixture: HeroesMarketHistory = {
  next_cursor: HEROES_MARKET_NEXT_CURSOR,
  item: [
    {
      date_update: '2023-12-14T08:28:35Z',
      item_name: '인챈트 스크롤',
      average_price: 1500000,
      min_price: 1200000,
      max_price: 1900000,
      item_option: { prefix_enchant_preset_1: '용맹한' },
    },
    {
      date_update: '2023-12-14T08:28:35Z',
      item_name: '인챈트 스크롤',
      average_price: 980000,
      min_price: 900000,
      max_price: 1100000,
      item_option: { suffix_enchant_preset_1: '심판' },
    },
  ],
};

/** cursor를 넘겼을 때 내려가는 마지막 페이지 */
export const heroesMarketHistoryLastPageFixture: HeroesMarketHistory = {
  next_cursor: null,
  item: [
    {
      date_update: '2023-12-13T08:28:35Z',
      item_name: '테스트 팔찌',
      average_price: 52000000,
      min_price: 48000000,
      max_price: 60000000,
      item_option: {
        enhancement_level: 10,
        tuning_stat: [{ stat_name: '공격력', stat_value: '120' }],
        ability_name: '테스트 어빌리티',
        prefix_enchant_preset_1: '날카로운',
        suffix_enchant_preset_1: '열정',
        prefix_enchant_preset_2: '용맹한',
        suffix_enchant_preset_2: '심판',
        power_infusion_preset_1: [{ stat_name: '공격력', stat_value: '50' }],
        power_infusion_preset_2: [{ stat_name: '크리티컬', stat_value: '3' }],
        bind_release_limit: '2',
        item_shape_name: '테스트 외형 팔찌',
        item_quality: '5',
        bracelet_gem_composite: [
          {
            item_name: '테스트 루비',
            stat: [{ stat_name: '힘', stat_value: '40' }],
          },
        ],
        value: '기타 속성',
      },
    },
  ],
};

export const heroesGoldMarketBuyTop30Fixture: HeroesGoldMarketBuyTop30 = {
  buy_gold: [
    { cairde_name: '테스트카르제A', buy_gold: 5200000000 },
    { cairde_name: '테스트카르제B', buy_gold: 4100000000 },
  ],
};

export const heroesGoldMarketSellTop30Fixture: HeroesGoldMarketSellTop30 = {
  sell_gold: [
    { cairde_name: '테스트카르제C', sell_gold: 6300000000 },
    { cairde_name: '테스트카르제D', sell_gold: 3900000000 },
  ],
};
