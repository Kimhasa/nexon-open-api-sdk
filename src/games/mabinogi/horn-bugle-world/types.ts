/** 거대한 외침의 뿔피리 메시지 한 건과 캐릭터 이름, 전송 시각. */
export interface MabinogiHornBugleWorldMessage {
  /** 발화한 유저의 캐릭터명 */
  readonly character_name: string;
  /** 거대한 외침의 뿔피리로 보낸 문구. 큰따옴표와 역슬래시는 제거되어 제공된다. */
  readonly message: string;
  /** 발화한 시각 (UTC0) */
  readonly date_send: string;
}

/** 선택한 서버에서 최근 1시간 동안 전송된 뿔피리 메시지 목록. */
export interface MabinogiHornBugleWorldHistory {
  /** 선택한 서버의 모든 채널에 보낸 최근 1시간의 뿔피리 메시지. 최대 1,000개다. */
  readonly horn_bugle_world_history: readonly MabinogiHornBugleWorldMessage[];
}
