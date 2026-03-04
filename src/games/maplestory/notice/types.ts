// ─── 공통 공지 항목 ─────────────────────────────────────────────────────────

/** 공지 목록 항목 (공지사항 / 업데이트 공유) */
export interface NoticeItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 */
  readonly notice_id: number;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
}

/** 공지 상세 (공지사항 / 업데이트 공유) */
export interface NoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
}

// ─── GET /maplestory/v1/notice ───────────────────────────────────────────────

/** 공지사항 목록 응답 */
export interface NoticeList {
  /** 공지 목록 */
  readonly notice: readonly NoticeItem[];
}

// ─── GET /maplestory/v1/notice-update ────────────────────────────────────────

/** 업데이트 목록 응답 */
export interface UpdateNoticeList {
  /** 공지 목록 */
  readonly update_notice: readonly NoticeItem[];
}

// ─── GET /maplestory/v1/notice-event ─────────────────────────────────────────

/** 이벤트 공지 항목 */
export interface EventNoticeItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 */
  readonly notice_id: number;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
  /** 이벤트 시작일(시) (KST) */
  readonly date_event_start: string;
  /** 이벤트 종료일(시) (KST) */
  readonly date_event_end: string;
}

/** 이벤트 공지 목록 응답 */
export interface EventNoticeList {
  /** 공지 목록 */
  readonly event_notice: readonly EventNoticeItem[];
}

/** 이벤트 공지 상세 */
export interface EventNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
  /** 이벤트 시작일(시) (KST) */
  readonly date_event_start: string;
  /** 이벤트 종료일(시) (KST) */
  readonly date_event_end: string;
}

// ─── GET /maplestory/v1/notice-cashshop ──────────────────────────────────────

/** 캐시샵 공지 항목 */
export interface CashshopNoticeItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 */
  readonly notice_id: number;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
  /** 판매 시작일(시) (KST) */
  readonly date_sale_start: string;
  /** 판매 종료일(시) (KST) */
  readonly date_sale_end: string;
  /** 상시 판매 여부 ("true": 상시) */
  readonly ongoing_flag: string;
}

/** 캐시샵 공지 목록 응답 */
export interface CashshopNoticeList {
  /** 공지 목록 */
  readonly cashshop_notice: readonly CashshopNoticeItem[];
}

/** 캐시샵 공지 상세 */
export interface CashshopNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
  /** 판매 시작일(시) (KST) */
  readonly date_sale_start: string;
  /** 판매 종료일(시) (KST) */
  readonly date_sale_end: string;
  /** 상시 판매 여부 ("true": 상시) */
  readonly ongoing_flag: string;
}
