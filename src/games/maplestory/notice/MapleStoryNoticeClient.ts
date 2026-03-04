import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  NOTICE_LIST_SHAPE,
  NOTICE_DETAIL_SHAPE,
  UPDATE_NOTICE_LIST_SHAPE,
  EVENT_NOTICE_LIST_SHAPE,
  EVENT_NOTICE_DETAIL_SHAPE,
  CASHSHOP_NOTICE_LIST_SHAPE,
  CASHSHOP_NOTICE_DETAIL_SHAPE,
} from '../shapes.js';
import type {
  CashshopNoticeDetail,
  CashshopNoticeList,
  EventNoticeDetail,
  EventNoticeList,
  NoticeDetail,
  NoticeList,
  UpdateNoticeList,
} from './types.js';

/**
 * 메이플스토리 공지사항 API 클라이언트.
 *
 * 각 목록 API는 최근 등록된 게시글 20개를 반환합니다.
 *
 * @example
 * ```ts
 * const notices = await client.maplestory.notice.getList();
 * const events = await client.maplestory.notice.getEventList();
 * ```
 */
export class MapleStoryNoticeClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 공지사항 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestory.notice.getList();
   * for (const n of list.notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   *
   */
  async getList(): Promise<NoticeList> {
    return this.http.get<NoticeList>(
      `${MapleStoryNoticeClient.BASE}/notice`,
      undefined,
      NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 공지사항 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestory.notice.getDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   *
   */
  async getDetail(noticeId: number): Promise<NoticeDetail> {
    return this.http.get<NoticeDetail>(
      `${MapleStoryNoticeClient.BASE}/notice/detail`,
      { notice_id: noticeId },
      NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 업데이트 공지 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestory.notice.getUpdateList();
   * for (const n of list.update_notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   *
   */
  async getUpdateList(): Promise<UpdateNoticeList> {
    return this.http.get<UpdateNoticeList>(
      `${MapleStoryNoticeClient.BASE}/notice-update`,
      undefined,
      UPDATE_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 업데이트 공지 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestory.notice.getUpdateDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   *
   */
  async getUpdateDetail(noticeId: number): Promise<NoticeDetail> {
    return this.http.get<NoticeDetail>(
      `${MapleStoryNoticeClient.BASE}/notice-update/detail`,
      { notice_id: noticeId },
      NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 진행 중 이벤트 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestory.notice.getEventList();
   * for (const e of list.event_notice) {
   *   console.log(`${e.title} (${e.date_event_start} ~ ${e.date_event_end})`);
   * }
   * ```
   *
   */
  async getEventList(): Promise<EventNoticeList> {
    return this.http.get<EventNoticeList>(
      `${MapleStoryNoticeClient.BASE}/notice-event`,
      undefined,
      EVENT_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 진행 중 이벤트 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestory.notice.getEventDetail(12345);
   * console.log(detail.title, detail.date_event_start, detail.date_event_end);
   * ```
   *
   */
  async getEventDetail(noticeId: number): Promise<EventNoticeDetail> {
    return this.http.get<EventNoticeDetail>(
      `${MapleStoryNoticeClient.BASE}/notice-event/detail`,
      { notice_id: noticeId },
      EVENT_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 캐시샵 공지 목록을 조회한다 (최근 20개).
   *
   * @example
   * ```ts
   * const list = await client.maplestory.notice.getCashshopList();
   * for (const c of list.cashshop_notice) {
   *   console.log(`${c.title} (${c.date_sale_start} ~ ${c.date_sale_end})`);
   * }
   * ```
   *
   */
  async getCashshopList(): Promise<CashshopNoticeList> {
    return this.http.get<CashshopNoticeList>(
      `${MapleStoryNoticeClient.BASE}/notice-cashshop`,
      undefined,
      CASHSHOP_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 캐시샵 공지 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자
   *
   * @example
   * ```ts
   * const detail = await client.maplestory.notice.getCashshopDetail(12345);
   * console.log(detail.title, detail.ongoing_flag);
   * ```
   *
   */
  async getCashshopDetail(noticeId: number): Promise<CashshopNoticeDetail> {
    return this.http.get<CashshopNoticeDetail>(
      `${MapleStoryNoticeClient.BASE}/notice-cashshop/detail`,
      { notice_id: noticeId },
      CASHSHOP_NOTICE_DETAIL_SHAPE,
    );
  }
}
