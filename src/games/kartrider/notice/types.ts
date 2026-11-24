// ─── 공통 공지 항목 ─────────────────────────────────────────────────────────

/** 공지 목록 항목 (공지사항 / 시즌 알림판 / 이벤트&대회 공유) */
export interface KartriderNoticeItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 */
  readonly notice_id: number;
  /** 공지 등록일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly date: string;
  /** 설정된 공지 태그 */
  readonly notice_tag: readonly string[];
}

/** 공지 상세 (공지사항 / 시즌 알림판 / 이벤트&대회 공유 — 스펙의 세 상세 스키마가 동일) */
export interface KartriderNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (UTC0) */
  readonly date: string;
  /** 설정된 공지 태그 */
  readonly notice_tag: readonly string[];
}

// ─── GET /kartrush/v1/notice ─────────────────────────────────────────────────

/** 공지사항 목록 응답 */
export interface KartriderNoticeList {
  /** 공지 목록 */
  readonly notice: readonly KartriderNoticeItem[];
}

// ─── GET /kartrush/v1/notice-season ──────────────────────────────────────────

/** 시즌 알림판 목록 응답 */
export interface KartriderSeasonNoticeList {
  /** 공지 목록 */
  readonly season_notice: readonly KartriderNoticeItem[];
}

// ─── GET /kartrush/v1/notice-event ───────────────────────────────────────────

/** 이벤트&대회 공지 목록 응답 */
export interface KartriderEventNoticeList {
  /** 공지 목록 */
  readonly event_notice: readonly KartriderNoticeItem[];
}
