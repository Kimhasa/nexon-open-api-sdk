import type { MabinogiItemOption } from '../types.js';

export const MABINOGI_AUCTION_ITEM_CATEGORIES = [
  '개조석',
  '검',
  '경갑옷',
  '기타',
  '기타 소모품',
  '기타 스크롤',
  '기타 장비',
  '기타 재료',
  '꼬리',
  '날개',
  '낭만농장/달빛섬',
  '너클',
  '던전 통행증',
  '도끼',
  '도면',
  '둔기',
  '듀얼건',
  '랜스',
  '로브',
  '마기그래프',
  '마기그래프 도안',
  '마도서',
  '마리오네트',
  '마법가루',
  '마비노벨',
  '마족 스크롤',
  '말풍선 스티커',
  '매직 크래프트',
  '모자/가발',
  '방패',
  '변신 메달',
  '보석',
  '분양 메달',
  '불타래',
  '뷰티 쿠폰',
  '생활 도구',
  '석궁',
  '수리검',
  '스케치',
  '스태프',
  '신발',
  '실린더',
  '아틀라틀',
  '악기',
  '알반 훈련석',
  '액세서리',
  '양손 장비',
  '얼굴 장식',
  '에이도스',
  '에코스톤',
  '염색 앰플',
  '오브',
  '옷본',
  '원거리 소모품',
  '원드',
  '음식',
  '의자/사물',
  '인챈트 스크롤',
  '장갑',
  '제련/블랙스미스',
  '제스처',
  '주머니',
  '중갑옷',
  '책',
  '천옷',
  '천옷/방직',
  '체인 블레이드',
  '토템',
  '팔리아스 유물',
  '퍼퓸',
  '페이지',
  '포션',
  '피니 펫',
  '핀즈비즈',
  '한손 장비',
  '핸들',
  '허브',
  '활',
  '힐웬 공학',
] as const;

export type MabinogiAuctionItemCategory = (typeof MABINOGI_AUCTION_ITEM_CATEGORIES)[number];

export interface MabinogiAuctionFilters {
  /** 아이템 카테고리 */
  readonly auction_item_category?: MabinogiAuctionItemCategory | undefined;
  /** 아이템 이름 */
  readonly item_name?: string | undefined;
  /** 최초 요청 시 생략합니다. 이후에는 같은 검색에서 반환된 next_cursor를 전달합니다. */
  readonly cursor?: string | undefined;
}

export interface MabinogiAuctionKeywordSearchRequest {
  /** 쉼표로 구분한 검색어 1~10개. 검색어가 아이템 이름의 단어와 정확히 일치해야 합니다. */
  readonly keyword: string;
  /** 최초 요청 시 생략합니다. 이후에는 같은 검색에서 반환된 next_cursor를 전달합니다. */
  readonly cursor?: string | undefined;
}

/** 현재 경매장에 올라온 매물 한 건의 수량과 개당 가격. */
export interface MabinogiAuctionItem {
  /** 해당 아이템의 이름 */
  readonly item_name: string;
  /** 아이템 전체 이름 */
  readonly item_display_name: string;
  /** 해당 아이템의 판매 수량 */
  readonly item_count: number;
  /** 해당 아이템의 카테고리 */
  readonly auction_item_category: string;
  /** 해당 아이템의 개당 판매 가격 */
  readonly auction_price_per_unit: number;
  /** 만료 기한 (해당 아이템의 판매가 종료되는 일시) (UTC0) */
  readonly date_auction_expire: string;
  /** 경매장 매물의 옵션 목록 */
  readonly item_option: readonly MabinogiItemOption[];
}

/** 판매 중인 경매장 매물 한 페이지. 다음 페이지를 조회할 수 있다. */
export interface MabinogiAuctionList {
  /** 현재 판매중인 아이템 목록 */
  readonly auction_item: readonly MabinogiAuctionItem[];
  /** 같은 검색 조건에서 다음 매물 페이지를 열 때 cursor에 넣는 값. 마지막 페이지에서는 null이다. */
  readonly next_cursor: string | null;
}

/** 경매장 거래 한 건의 수량, 개당 가격과 거래 시각. */
export interface MabinogiAuctionTransaction {
  /** 해당 아이템의 이름 */
  readonly item_name: string;
  /** 아이템 전체 이름 */
  readonly item_display_name: string;
  /** 해당 아이템의 거래 수량 */
  readonly item_count: number;
  /** 해당 아이템의 카테고리 */
  readonly auction_item_category: string;
  /** 해당 아이템의 개당 판매 가격 */
  readonly auction_price_per_unit: number;
  /** 해당 아이템이 거래된 일시 (UTC0) */
  readonly date_auction_buy: string;
  /** 해당 아이템의 거래 식별 정보 */
  readonly auction_buy_id: string;
  /** 거래된 아이템의 옵션 목록 */
  readonly item_option: readonly MabinogiItemOption[];
}

/** 최근 1시간 경매장 거래 기록 한 페이지. */
export interface MabinogiAuctionHistory {
  /** 거래 목록 */
  readonly auction_history: readonly MabinogiAuctionTransaction[];
  /** 같은 검색 조건에서 다음 거래 내역 페이지를 열 때 cursor에 넣는 값. 마지막 페이지에서는 null이다. */
  readonly next_cursor: string | null;
}
