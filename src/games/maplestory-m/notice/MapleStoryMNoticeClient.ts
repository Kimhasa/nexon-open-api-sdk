import { assertInteger } from '../../../core/validation/input.js';
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
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
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
   * @throws {NexonBadRequestError} 공지 식별자가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const list = await client.maplestorym.notice.getList();
   * const first = list.notice[0];
   * if (first) {
   *   const detail = await client.maplestorym.notice.getDetail(first.notice_id);
   *   console.log(detail.title, detail.contents);
   * }
   * ```
   */
  async getDetail(noticeId: number): Promise<MNoticeDetail> {
    assertInteger(noticeId, 'noticeId', { hint: '해당 공지 목록에서 notice_id를 확인하세요.' });
    return this.http.get<MNoticeDetail>(
      `${MapleStoryMNoticeClient.BASE}/notice/detail`,
      { notice_id: noticeId },
      M_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 패치노트 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
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
   * @throws {NexonBadRequestError} 공지 식별자가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const list = await client.maplestorym.notice.getPatchList();
   * const first = list.patch_notice[0];
   * if (first) {
   *   const detail = await client.maplestorym.notice.getPatchDetail(first.notice_id);
   *   console.log(detail.title, detail.contents);
   * }
   * ```
   */
  async getPatchDetail(noticeId: number): Promise<MNoticeDetail> {
    assertInteger(noticeId, 'noticeId', { hint: '해당 공지 목록에서 notice_id를 확인하세요.' });
    return this.http.get<MNoticeDetail>(
      `${MapleStoryMNoticeClient.BASE}/notice-patch/detail`,
      { notice_id: noticeId },
      M_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 진행 중 이벤트 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const list = await client.maplestorym.notice.getEventList();
   * for (const e of list.event_notice) {
   *   console.log(`[${e.date}] ${e.title}`);
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
   * @throws {NexonBadRequestError} 공지 식별자가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const list = await client.maplestorym.notice.getEventList();
   * const first = list.event_notice[0];
   * if (first) {
   *   const detail = await client.maplestorym.notice.getEventDetail(first.notice_id);
   *   console.log(detail.title, detail.contents);
   * }
   * ```
   */
  async getEventDetail(noticeId: number): Promise<MEventNoticeDetail> {
    assertInteger(noticeId, 'noticeId', { hint: '해당 공지 목록에서 notice_id를 확인하세요.' });
    return this.http.get<MEventNoticeDetail>(
      `${MapleStoryMNoticeClient.BASE}/notice-event/detail`,
      { notice_id: noticeId },
      M_EVENT_NOTICE_DETAIL_SHAPE,
    );
  }
}
