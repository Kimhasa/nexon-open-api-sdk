export const MABINOGI_SERVERS = ['류트', '만돌린', '하프', '울프'] as const;

export type MabinogiServerName = (typeof MABINOGI_SERVERS)[number];

export interface MabinogiItemOption {
  /** 아이템 옵션 유형 */
  readonly option_type: string;
  /** 아이템 옵션 하위 유형. 하위 유형이 없는 옵션이면 null */
  readonly option_sub_type: string | null;
  /** 아이템 옵션 값. 값이 없으면 null */
  readonly option_value: string | null;
  /** 아이템 옵션 값 2. 값이 하나뿐인 옵션이면 null */
  readonly option_value2: string | null;
  /** 아이템 옵션 부가 정보. 부가 정보가 없는 옵션이면 null */
  readonly option_desc: string | null;
}
