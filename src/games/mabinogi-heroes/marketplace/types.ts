import type { HeroesStatValue } from '../types.js';

// ─── GET /heroes/v2/marketplace/market-history ──────────────────────────────

/** 아이템 거래 기록 조회 요청 파라미터 */
export interface HeroesMarketHistoryRequest {
  /**
   * 아이템 명.
   *
   * 인챈트 스크롤은 `"인챈트 스크롤"` 또는 `"인챈트 스크롤 (무기한)"` 으로 검색한 뒤
   * `item_option.prefix_enchant_preset_1` / `suffix_enchant_preset_1` 로 종류를 구분한다.
   */
  readonly item_name: string;
  /** 페이징 cursor. 직전 응답의 `next_cursor` 를 그대로 넘긴다 (페이지당 500개) */
  readonly cursor?: string | undefined;
}

/** 팔찌 보석 장착 정보 */
export interface HeroesBraceletGem {
  /** 장착 보석 명 */
  readonly item_name: string;
  /** 능력치 */
  readonly stat: readonly HeroesStatValue[];
}

/**
 * 거래 아이템 옵션 정보.
 *
 * 아이템에 해당하는 옵션만 내려온다. 해당하지 않는 옵션은 필드 자체가 없어서 모든 필드가 선택이다
 * (2026-11-24 실측: 인챈트 스크롤 거래 기록은 접두 또는 접미 인챈트 명 하나만 온다).
 * 스펙에는 nullable 표기가 없지만 null도 허용한다.
 */
export interface HeroesMarketItemOption {
  /** 강화 단계 */
  readonly enhancement_level?: number | null | undefined;
  /** 아이템 연마 능력치 */
  readonly tuning_stat?: readonly HeroesStatValue[] | null | undefined;
  /** 장비에 부여된 어빌리티 명 */
  readonly ability_name?: string | null | undefined;
  /** 1번 프리셋 접두 인챈트 명 */
  readonly prefix_enchant_preset_1?: string | null | undefined;
  /** 1번 프리셋 접미 인챈트 명 */
  readonly suffix_enchant_preset_1?: string | null | undefined;
  /** 2번 프리셋 접두 인챈트 명 */
  readonly prefix_enchant_preset_2?: string | null | undefined;
  /** 2번 프리셋 접미 인챈트 명 */
  readonly suffix_enchant_preset_2?: string | null | undefined;
  /** 1번 프리셋 정령합성 능력치 */
  readonly power_infusion_preset_1?: readonly HeroesStatValue[] | null | undefined;
  /** 2번 프리셋 정령합성 능력치 */
  readonly power_infusion_preset_2?: readonly HeroesStatValue[] | null | undefined;
  /**
   * 아이템 귀속 해제 제한 횟수.
   * 스펙 타입은 string이고 example이 날짜 문자열(`"2023-12-14T08:28:35Z"`)로 적혀 있어 실제 형식이 불확실하다.
   */
  readonly bind_release_limit?: string | null | undefined;
  /** 매혹의 룬 (변경한 외형의 아이템 명) */
  readonly item_shape_name?: string | null | undefined;
  /** 아이템 품질 */
  readonly item_quality?: string | null | undefined;
  /** 팔찌 보석 장착 정보 */
  readonly bracelet_gem_composite?: readonly HeroesBraceletGem[] | null | undefined;
  /** 기타 아이템 속성 */
  readonly value?: string | null | undefined;
}

/** 거래 기록 한 건 (갱신 시점별 집계) */
export interface HeroesMarketHistoryItem {
  /** 갱신 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly date_update: string;
  /** 아이템 명 */
  readonly item_name: string;
  /** 평균 거래가. 골드 거래소 내역은 100만 골드당 가격 */
  readonly average_price: number;
  /** 최소 거래가 */
  readonly min_price: number;
  /** 최대 거래가 */
  readonly max_price: number;
  /** 아이템 옵션 정보 */
  readonly item_option: HeroesMarketItemOption | null;
}

/**
 * 최근 1주 아이템 거래 기록 응답.
 *
 * 최근 24시간 내 10건 이상 거래된 아이템만 조회된다.
 * 현재 평균가는 마지막으로 갱신된 기록의 `average_price` 로 확인한다.
 */
export interface HeroesMarketHistory {
  /** 같은 아이템의 다음 거래 기록 페이지를 열 때 cursor에 넣는 값. 마지막 페이지에서는 null이다. */
  readonly next_cursor: string | null;
  /** 거래 아이템 정보 */
  readonly item: readonly HeroesMarketHistoryItem[];
}

// ─── GET /heroes/v2/marketplace/gold-market-buy-top-30 ──────────────────────

/** 골드 구매 상위 유저 */
export interface HeroesGoldBuyer {
  /** 카르제 이름 */
  readonly cairde_name: string;
  /** 골드 거래소에서 최근 1주간 구매한 골드 총량. 실제 응답의 필드. 포털 스펙에는 `total_buy_gold` 로 적혀 있다 */
  readonly buy_gold?: number | undefined;
  /** 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 `buy_gold` 로 온다 */
  readonly total_buy_gold?: number | undefined;
}

/** 최근 1주 골드 구매 상위 30명 응답 */
export interface HeroesGoldMarketBuyTop30 {
  /** 최근 1주 골드 거래소의 골드 구매 상위 30명 유저의 구매량 정보 */
  readonly buy_gold: readonly HeroesGoldBuyer[];
}

// ─── GET /heroes/v2/marketplace/gold-market-sell-top-30 ─────────────────────

/** 골드 판매 상위 유저 */
export interface HeroesGoldSeller {
  /** 카르제 이름 */
  readonly cairde_name: string;
  /** 골드 거래소에서 최근 1주간 판매한 골드 총량. 실제 응답의 필드. 포털 스펙에는 `total_sell_gold` 로 적혀 있다 */
  readonly sell_gold?: number | undefined;
  /** 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 `sell_gold` 로 온다 */
  readonly total_sell_gold?: number | undefined;
}

/** 최근 1주 골드 판매 상위 30명 응답 */
export interface HeroesGoldMarketSellTop30 {
  /** 최근 1주 골드 거래소의 골드 판매 상위 30명 유저의 판매량 정보 */
  readonly sell_gold: readonly HeroesGoldSeller[];
}
