import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  M_NOTICE_LIST_SHAPE,
  M_NOTICE_DETAIL_SHAPE,
  M_PATCH_NOTICE_LIST_SHAPE,
  M_EVENT_NOTICE_LIST_SHAPE,
  M_EVENT_NOTICE_DETAIL_SHAPE,
} from '../shapes.js';
import type {
  MNoticeList,
  MNoticeDetail,
  MPatchNoticeList,
  MEventNoticeList,
  MEventNoticeDetail,
} from './types.js';

/**
 * 메이플스토리M 공지사항 API 클라이언트.
 *
 * 각 목록 API는 최근 등록된 게시글 20개를 반환합니다.
 *
 * @example
 * ```ts
 * const notices = await client.maplestorym.notice.getList();
 * const events = await client.maplestorym.notice.getEventList();
 * ```
 */
export class MapleStoryMNoticeClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorym/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 공지사항 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestorym.notice.getList();
   * for (const n of list.notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   */
  async getList(): Promise<MNoticeList> {
    return this.http.get<MNoticeList>(
      `${MapleStoryMNoticeClient.BASE}/notice`,
      undefined,
      M_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 공지사항 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestorym.notice.getDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getDetail(noticeId: number): Promise<MNoticeDetail> {
    return this.http.get<MNoticeDetail>(
      `${MapleStoryMNoticeClient.BASE}/notice/detail`,
      { notice_id: noticeId },
      M_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 패치노트 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestorym.notice.getPatchList();
   * for (const n of list.patch_notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   */
  async getPatchList(): Promise<MPatchNoticeList> {
    return this.http.get<MPatchNoticeList>(
      `${MapleStoryMNoticeClient.BASE}/notice-patch`,
      undefined,
      M_PATCH_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 패치노트 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestorym.notice.getPatchDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getPatchDetail(noticeId: number): Promise<MNoticeDetail> {
    return this.http.get<MNoticeDetail>(
      `${MapleStoryMNoticeClient.BASE}/notice-patch/detail`,
      { notice_id: noticeId },
      M_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 진행 중 이벤트 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestorym.notice.getEventList();
   * for (const e of list.event_notice) {
   *   console.log(`${e.title} (${e.date_event_start} ~ ${e.date_event_end})`);
   * }
   * ```
   */
  async getEventList(): Promise<MEventNoticeList> {
    return this.http.get<MEventNoticeList>(
      `${MapleStoryMNoticeClient.BASE}/notice-event`,
      undefined,
      M_EVENT_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 진행 중 이벤트 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestorym.notice.getEventDetail(12345);
   * console.log(detail.title, detail.date_event_start, detail.date_event_end);
   * ```
   */
  async getEventDetail(noticeId: number): Promise<MEventNoticeDetail> {
    return this.http.get<MEventNoticeDetail>(
      `${MapleStoryMNoticeClient.BASE}/notice-event/detail`,
      { notice_id: noticeId },
      M_EVENT_NOTICE_DETAIL_SHAPE,
    );
  }
}
