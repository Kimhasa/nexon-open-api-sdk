// ─── 공통 공지 항목 ─────────────────────────────────────────────────────────

/** 공지 목록 항목 */
export interface MNoticeItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 */
  readonly notice_id: number;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
}

/** 공지 상세 */
export interface MNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (KST) */
  readonly date: string;
}

// ─── GET /maplestorym/v1/notice ──────────────────────────────────────────────

/** 공지사항 목록 응답 */
export interface MNoticeList {
  /** 공지 목록 */
  readonly notice: readonly MNoticeItem[];
}

// ─── GET /maplestorym/v1/notice-patch ────────────────────────────────────────

/** 패치노트 목록 응답 */
export interface MPatchNoticeList {
  /** 패치노트 목록 */
  readonly patch_notice: readonly MNoticeItem[];
}

// ─── GET /maplestorym/v1/notice-event ────────────────────────────────────────

/** 이벤트 공지 항목 */
export interface MEventNoticeItem {
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
export interface MEventNoticeList {
  /** 공지 목록 */
  readonly event_notice: readonly MEventNoticeItem[];
}

/** 이벤트 공지 상세 */
export interface MEventNoticeDetail {
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
