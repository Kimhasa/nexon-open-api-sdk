export const MABINOGI_SERVERS = ['류트', '만돌린', '하프', '울프'] as const;

export type MabinogiServerName = (typeof MABINOGI_SERVERS)[number];

export interface MabinogiItemOption {
  /** 아이템 옵션 유형 */
  readonly option_type: string;
  /** 아이템 옵션 하위 유형 */
  readonly option_sub_type: string;
  /** 아이템 옵션 값 */
  readonly option_value: string;
  /** 아이템 옵션 값 2 */
  readonly option_value2: string;
  /** 아이템 옵션 부가 정보 */
  readonly option_desc: string;
}
