// ─── GET /maplestorym/v1/notice ──────────────────────────────────────────────

/** 공지사항 항목 */
export interface MNoticeItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 */
  readonly notice_id: number;
  /** 공지 등록일(시) (UTC0) */
  readonly date: string;
}

/** GET /maplestorym/v1/notice 응답 */
export interface MNoticeList {
  /** 공지 목록 */
  readonly notice: MNoticeItem[];
}

// ─── GET /maplestorym/v1/notice/detail ──────────────────────────────────────

/** GET /maplestorym/v1/notice/detail 응답 */
export interface MNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (UTC0) */
  readonly date: string;
}

// ─── GET /maplestorym/v1/notice-patch ───────────────────────────────────────

/** GET /maplestorym/v1/notice-patch 응답 */
export interface MPatchNoticeList {
  /** 패치노트 목록 */
  readonly patch_notice: MNoticeItem[];
}

// ─── GET /maplestorym/v1/notice-event ────────────────────────────────────────

/** GET /maplestorym/v1/notice-event 응답 */
export interface MEventNoticeList {
  /** 이벤트 공지 목록 */
  readonly event_notice: MNoticeItem[];
}

// ─── GET /maplestorym/v1/notice-event/detail ────────────────────────────────

/** GET /maplestorym/v1/notice-event/detail 응답 (MNoticeDetail과 동일) */
export type MEventNoticeDetail = MNoticeDetail;
