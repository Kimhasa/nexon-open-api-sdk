import { assertInteger } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
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
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
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
   * 최근 등록된 공지사항 20개를 조회한다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 디스코드 알림에서 공지사항의 새 글을 찾을 때
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
   * 공지사항에서 게시글 번호로 본문을 조회한다.
   *
   * @param noticeId - 게시글 번호 (`getList()` 응답의 `notice[].notice_id`)
   * @throws {NexonBadRequestError} noticeId가 정수가 아니거나(요청 전 차단) 존재하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 공지사항 위젯에서 선택한 글의 본문을 표시할 때
   * const detail = await client.kartrider.notice.getDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getDetail(noticeId: number): Promise<KartriderNoticeDetail> {
    assertInteger(noticeId, 'noticeId', {
      safe: true,
      hint: 'client.kartrider.notice.getList() 의 notice[].notice_id 를 쓰세요.',
    });
    return this.http.get<KartriderNoticeDetail>(
      `${KartriderNoticeClient.BASE}/notice/detail`,
      { notice_id: noticeId },
      KARTRIDER_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 최근 등록된 시즌 알림판 20개를 조회한다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 디스코드 알림에서 시즌 알림판의 새 글을 찾을 때
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
   * 시즌 알림판에서 게시글 번호로 본문을 조회한다.
   *
   * @param noticeId - 게시글 번호 (`getSeasonList()` 응답의 `season_notice[].notice_id`)
   * @throws {NexonBadRequestError} noticeId가 정수가 아니거나(요청 전 차단) 존재하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 시즌 알림판 위젯에서 선택한 글의 본문을 표시할 때
   * const detail = await client.kartrider.notice.getSeasonDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getSeasonDetail(noticeId: number): Promise<KartriderNoticeDetail> {
    assertInteger(noticeId, 'noticeId', {
      safe: true,
      hint: 'client.kartrider.notice.getSeasonList() 의 season_notice[].notice_id 를 쓰세요.',
    });
    return this.http.get<KartriderNoticeDetail>(
      `${KartriderNoticeClient.BASE}/notice-season/detail`,
      { notice_id: noticeId },
      KARTRIDER_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 최근 등록된 이벤트&대회 20개를 조회한다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 디스코드 알림에서 이벤트&대회의 새 글을 찾을 때
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
   * 이벤트&대회에서 게시글 번호로 본문을 조회한다.
   *
   * @param noticeId - 게시글 번호 (`getEventList()` 응답의 `event_notice[].notice_id`)
   * @throws {NexonBadRequestError} noticeId가 정수가 아니거나(요청 전 차단) 존재하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 이벤트&대회 위젯에서 선택한 글의 본문을 표시할 때
   * const detail = await client.kartrider.notice.getEventDetail(12345);
   * console.log(detail.title, detail.contents);
   * ```
   */
  async getEventDetail(noticeId: number): Promise<KartriderNoticeDetail> {
    assertInteger(noticeId, 'noticeId', {
      safe: true,
      hint: 'client.kartrider.notice.getEventList() 의 event_notice[].notice_id 를 쓰세요.',
    });
    return this.http.get<KartriderNoticeDetail>(
      `${KartriderNoticeClient.BASE}/notice-event/detail`,
      { notice_id: noticeId },
      KARTRIDER_NOTICE_DETAIL_SHAPE,
    );
  }
}
