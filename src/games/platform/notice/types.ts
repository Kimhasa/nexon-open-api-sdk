// ─── GET /platform/openapi/v1/notice ─────────────────────────────────────────

/**
 * 공지 대상 게임 명 (`game_name` 쿼리 값).
 *
 * 스펙의 enum 값을 자동완성으로 제공하고, 포털에 게임이 추가될 때를 대비해 임의 문자열도 받습니다.
 */
export type PlatformGameName =
  | '공통'
  | '메이플스토리'
  | 'EA SPORTS FC 온라인'
  | '바람의나라'
  | '바람의나라:연'
  | '카트라이더 러쉬플러스'
  | '히트2'
  | 'V4'
  | '마비노기 영웅전'
  | '메이플스토리M'
  | '크레이지 아케이드'
  | '플랫폼'
  | (string & {});

/** NEXON Open API 공지 조회 요청 파라미터 */
export interface PlatformNoticeRequest {
  /**
   * 특정 게임의 NEXON Open API 공지만 조회할 때 지정한다.
   * 생략하거나 빈 문자열이면 전체 공지를 조회한다.
   */
  readonly game_name?: PlatformGameName | undefined;
}

/** NEXON Open API 공지 항목 */
export interface PlatformNoticeItem {
  /** 공지 대상 게임 */
  readonly game_name: string;
  /** 공지 제목 */
  readonly title: string;
  /** 공지 링크 */
  readonly url: string;
  /** 글 목록에서 함께 제공하는 NEXON Open API 공지 본문 */
  readonly contents: string;
  /** 공지 등록일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly date: string;
  /** 설정된 공지 태그. 태그가 없는 공지면 null */
  readonly notice_tag: readonly string[] | null;
}

/** NEXON Open API 공지 목록 응답 */
export interface PlatformNoticeList {
  /** 최근 등록된 NEXON Open API 공지 최대 10개 */
  readonly notice: readonly PlatformNoticeItem[];
}
