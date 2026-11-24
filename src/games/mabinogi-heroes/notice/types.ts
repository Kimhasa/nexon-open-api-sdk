// ─── GET /heroes/v1/notice, /heroes/v1/notice-patch ─────────────────────────

/** 공지사항·패치노트 목록 항목 */
export interface HeroesNoticeListItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 (상세 조회에 사용) */
  readonly notice_id: number;
  /** 공지 등록일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly date: string;
}

/** 공지사항 목록 응답 (최근 20개) */
export interface HeroesNoticeList {
  /** 공지 목록 */
  readonly notice: readonly HeroesNoticeListItem[];
}

/** 패치노트 목록 응답 (최근 20개) */
export interface HeroesPatchNoticeList {
  /** 공지 목록 */
  readonly patch_notice: readonly HeroesNoticeListItem[];
}

// ─── GET /heroes/v1/notice/detail, /heroes/v1/notice-patch/detail ───────────

/** 공지사항 상세 응답 */
export interface HeroesNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 (HTML) */
  readonly contents: string;
  /** 공지 등록일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly date: string;
}

/** 패치노트 상세 응답 (스펙상 공지사항 상세와 필드가 같다) */
export type HeroesPatchNoticeDetail = HeroesNoticeDetail;

// ─── GET /heroes/v1/notice-event ────────────────────────────────────────────

/** 이벤트&샵 목록 항목 */
export interface HeroesEventNoticeListItem {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 식별자 (상세 조회에 사용) */
  readonly notice_id: number;
  /** 이벤트 시작일(시) (UTC0). 상시 판매 등 기간이 없으면 null일 수 있다 */
  readonly date_event_start: string | null;
  /** 이벤트 종료일(시) (UTC0). 상시 판매 등 기간이 없으면 null일 수 있다 */
  readonly date_event_end: string | null;
  /** 이벤트&샵에서 상시 판매 중이면 문자열 "true"다. 값이 없는 글은 null일 수 있다. */
  readonly ongoing_flag: string | null;
}

/** 이벤트&샵 목록 응답 (최근 20개) */
export interface HeroesEventNoticeList {
  /** 공지 목록 */
  readonly event_notice: readonly HeroesEventNoticeListItem[];
}

// ─── GET /heroes/v1/notice-event/detail ─────────────────────────────────────

/** 이벤트&샵 상세 응답 */
export interface HeroesEventNoticeDetail {
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 공지 본문 (HTML) */
  readonly contents: string;
  /** 이벤트 시작일(시) (UTC0). 상시 판매 등 기간이 없으면 null일 수 있다 */
  readonly date_event_start: string | null;
  /** 이벤트 종료일(시) (UTC0). 상시 판매 등 기간이 없으면 null일 수 있다 */
  readonly date_event_end: string | null;
  /** 이벤트&샵에서 상시 판매 중이면 문자열 "true"다. 값이 없는 글은 null일 수 있다. */
  readonly ongoing_flag: string | null;
}
