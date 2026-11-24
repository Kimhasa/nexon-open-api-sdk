import type { HttpClient } from '../../../core/http/HttpClient.js';
import { assertNoticeId } from '../input-validation.js';
import {
  KARTRIDER_EVENT_NOTICE_LIST_SHAPE,
  KARTRIDER_NOTICE_DETAIL_SHAPE,
  KARTRIDER_NOTICE_LIST_SHAPE,
  KARTRIDER_SEASON_NOTICE_LIST_SHAPE,
} from '../shapes.js';
import type {
  KartriderEventNoticeList,
  KartriderNoticeDetail,
  KartriderNoticeList,
  KartriderSeasonNoticeList,
} from './types.js';

/**
 * 카트라이더 러쉬플러스 공지사항 API 클라이언트.
 *
 * 각 목록 API는 최근 등록된 게시글 20개를 반환합니다.
 * 공지는 수정될 수 있으므로 실시간 조회 또는 최소 일 단위 갱신을 권장합니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const { notice } = await client.kartrider.notice.getList();
 * const first = notice[0];
 * if (first) {
 *   const detail = await client.kartrider.notice.getDetail(first.notice_id);
 *   console.log(detail.title, detail.contents);
 * }
 * ```
 */
export class KartriderNoticeClient {
  private static readonly BASE = 'https://open.api.nexon.com/kartrush/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 공지사항 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const list = await client.kartrider.notice.getList();
   * for (const n of list.notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   */
  async getList(): Promise<KartriderNoticeList> {
    return this.http.get<KartriderNoticeList>(
      `${KartriderNoticeClient.BASE}/notice`,
      undefined,
      KARTRIDER_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 공지사항 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자 (`getList()` 응답의 `notice[].notice_id`)
   * @throws {NexonBadRequestError} noticeId가 정수가 아니거나(요청 전 차단) 존재하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const detail = await client.kartrider.notice.getDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getDetail(noticeId: number): Promise<KartriderNoticeDetail> {
    assertNoticeId(noticeId, 'client.kartrider.notice.getList() 의 notice[].notice_id 를 쓰세요.');
    return this.http.get<KartriderNoticeDetail>(
      `${KartriderNoticeClient.BASE}/notice/detail`,
      { notice_id: noticeId },
      KARTRIDER_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 시즌 알림판 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const list = await client.kartrider.notice.getSeasonList();
   * for (const n of list.season_notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   */
  async getSeasonList(): Promise<KartriderSeasonNoticeList> {
    return this.http.get<KartriderSeasonNoticeList>(
      `${KartriderNoticeClient.BASE}/notice-season`,
      undefined,
      KARTRIDER_SEASON_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 시즌 알림판 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자 (`getSeasonList()` 응답의 `season_notice[].notice_id`)
   * @throws {NexonBadRequestError} noticeId가 정수가 아니거나(요청 전 차단) 존재하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const detail = await client.kartrider.notice.getSeasonDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getSeasonDetail(noticeId: number): Promise<KartriderNoticeDetail> {
    assertNoticeId(
      noticeId,
      'client.kartrider.notice.getSeasonList() 의 season_notice[].notice_id 를 쓰세요.',
    );
    return this.http.get<KartriderNoticeDetail>(
      `${KartriderNoticeClient.BASE}/notice-season/detail`,
      { notice_id: noticeId },
      KARTRIDER_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 이벤트&대회 공지 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const list = await client.kartrider.notice.getEventList();
   * for (const n of list.event_notice) {
   *   console.log(`[${n.date}] ${n.title}`);
   * }
   * ```
   */
  async getEventList(): Promise<KartriderEventNoticeList> {
    return this.http.get<KartriderEventNoticeList>(
      `${KartriderNoticeClient.BASE}/notice-event`,
      undefined,
      KARTRIDER_EVENT_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 이벤트&대회 공지 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자 (`getEventList()` 응답의 `event_notice[].notice_id`)
   * @throws {NexonBadRequestError} noticeId가 정수가 아니거나(요청 전 차단) 존재하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const detail = await client.kartrider.notice.getEventDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getEventDetail(noticeId: number): Promise<KartriderNoticeDetail> {
    assertNoticeId(
      noticeId,
      'client.kartrider.notice.getEventList() 의 event_notice[].notice_id 를 쓰세요.',
    );
    return this.http.get<KartriderNoticeDetail>(
      `${KartriderNoticeClient.BASE}/notice-event/detail`,
      { notice_id: noticeId },
      KARTRIDER_NOTICE_DETAIL_SHAPE,
    );
  }
}
