export interface MabinogiHornBugleWorldMessage {
  /** 발화한 유저의 캐릭터명 */
  readonly character_name: string;
  /** 발화한 거대한 외침의 뿔피리 내용 */
  readonly message: string;
  /** 발화한 시각 (UTC0) */
  readonly date_send: string;
}

export interface MabinogiHornBugleWorldHistory {
  /** 거대한 외침의 뿔피리 내역 */
  readonly horn_bugle_world_history: readonly MabinogiHornBugleWorldMessage[];
}
