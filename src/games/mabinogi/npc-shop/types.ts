import type { MabinogiItemOption, MabinogiServerName } from '../types.js';

export const MABINOGI_NPC_NAMES = [
  '델',
  '델렌',
  '상인 라누',
  '상인 피루',
  '모락',
  '상인 아루',
  '리나',
  '상인 누누',
  '상인 메루',
  '켄',
  '귀넥',
  '얼리',
  '데위',
  '테일로',
  '상인 세누',
  '상인 베루',
  '상인 에루',
  '상인 네루',
  '카디',
  '인장 상인',
  '피오나트',
] as const;

export type MabinogiNpcName = (typeof MABINOGI_NPC_NAMES)[number];

export interface MabinogiNpcShopListRequest {
  /** NPC 이름 */
  readonly npc_name: MabinogiNpcName;
  /** 서버 이름 */
  readonly server_name: MabinogiServerName;
  /** 채널 번호 */
  readonly channel: number;
}

export interface MabinogiNpcShopPrice {
  /** 화폐 종류 */
  readonly price_type: string;
  /** 화폐 수량 */
  readonly price_value: number;
}

export interface MabinogiNpcShopItem {
  /** 아이템 이름 */
  readonly item_display_name: string;
  /** 아이템 수량 */
  readonly item_count: number;
  /** 아이템 옵션 정보 */
  readonly item_option: readonly MabinogiItemOption[];
  /** 아이템 판매 가격 정보 */
  readonly price: readonly MabinogiNpcShopPrice[];
  /** 판매 제한 종류 (주간/월간/이벤트 등). 판매 제한이 없는 상품이면 null */
  readonly limit_type: string | null;
  /** 판매 제한 수량. 판매 제한이 없는 상품이면 null */
  readonly limit_value: number | null;
  /** 아이템 이미지 */
  readonly image_url: string;
}

export interface MabinogiNpcShopTab {
  /** 상점 탭 이름 */
  readonly tab_name: string;
  /** NPC 상점 아이템 목록 */
  readonly item: readonly MabinogiNpcShopItem[];
}

/** 선택한 서버와 채널에서 NPC가 판매하는 아이템과 다음 상점 갱신 시각. */
export interface MabinogiNpcShopList {
  /** NPC 상점의 탭 개수 */
  readonly shop_tab_count: number;
  /** 조회한 서버·채널에 있는 NPC 상점의 탭별 판매 목록 */
  readonly shop: readonly MabinogiNpcShopTab[];
  /** 데이터를 조회한 일시 (UTC0) */
  readonly date_inquire: string;
  /** NPC 상점의 다음 판매 목록 갱신 시각(UTC) */
  readonly date_shop_next_update: string;
}
