/**
 * 커서 기반 페이지네이션 응답.
 * Nexon Open API의 목록 엔드포인트는 모두 이 형태로 반환됩니다.
 *
 * @template T - 목록 아이템 타입
 */
export interface CursorPage<T> {
  /** 현재 페이지 아이템 목록 */
  readonly items: T[];
  /** 다음 페이지 커서. `null`이면 마지막 페이지입니다. */
  readonly next_cursor: string | null;
  /** 현재 페이지 아이템 수 */
  readonly count: number;
}

/**
 * 커서 기반 페이지네이션 요청 파라미터.
 */
export interface CursorPageRequest {
  /** 이전 응답의 `next_cursor` 값. 최초 요청 시 생략합니다. */
  readonly cursor?: string;
  /**
   * 페이지당 반환할 최대 아이템 수.
   * API마다 제한이 다를 수 있습니다.
   */
  readonly count?: number;
}

/**
 * 커서 기반 자동 페이지네이션 옵션.
 */
export interface AutoPaginationOptions {
  /**
   * 최대 수집 아이템 수 (`collectXxx` 사용 시).
   * 지정하지 않으면 전체 수집합니다.
   */
  readonly limit?: number;
}
