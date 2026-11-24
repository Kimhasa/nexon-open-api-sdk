import type { HttpClient } from '../../../core/http/HttpClient.js';
import { assertPositiveInteger } from '../validation.js';
import {
  HEROES_EVENT_NOTICE_DETAIL_SHAPE,
  HEROES_EVENT_NOTICE_LIST_SHAPE,
  HEROES_NOTICE_DETAIL_SHAPE,
  HEROES_NOTICE_LIST_SHAPE,
  HEROES_PATCH_NOTICE_LIST_SHAPE,
} from '../shapes.js';
import type {
  HeroesEventNoticeDetail,
  HeroesEventNoticeList,
  HeroesNoticeDetail,
  HeroesNoticeList,
  HeroesPatchNoticeDetail,
  HeroesPatchNoticeList,
} from './types.js';

/**
 * 마비노기 영웅전 공지 API 클라이언트 (V1).
 *
 * 각 목록 API는 최근 등록된 게시글 20개를 반환합니다.
 * 공지는 수정될 수 있으므로 실시간 조회 또는 최소 일배치 갱신을 권장합니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const notices = await client.mabinogiHeroes.notice.getList();
 * const events = await client.mabinogiHeroes.notice.getEventList();
 * ```
 */
export class MabinogiHeroesNoticeClient {
  private static readonly BASE = 'https://open.api.nexon.com/heroes/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 공지사항 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const list = await client.mabinogiHeroes.notice.getList();
   * for (const n of list.notice) {
   *   console.log(`[${n.date}] ${n.title} (${n.notice_id})`);
   * }
   * ```
   */
  async getList(): Promise<HeroesNoticeList> {
    return this.http.get<HeroesNoticeList>(
      `${MabinogiHeroesNoticeClient.BASE}/notice`,
      undefined,
      HEROES_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 공지사항 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자 (`getList()` 응답의 `notice_id`)
   * @throws {NexonBadRequestError} noticeId가 1 이상의 정수가 아닐 때 (요청 전에 SDK가 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const list = await client.mabinogiHeroes.notice.getList();
   * const first = list.notice[0];
   * if (first) {
   *   const detail = await client.mabinogiHeroes.notice.getDetail(first.notice_id);
   *   console.log(detail.title, detail.contents);
   * }
   * ```
   */
  async getDetail(noticeId: number): Promise<HeroesNoticeDetail> {
    assertNoticeId(noticeId, 'getList()', 'notice');
    return this.http.get<HeroesNoticeDetail>(
      `${MabinogiHeroesNoticeClient.BASE}/notice/detail`,
      { notice_id: noticeId },
      HEROES_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 패치노트 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const list = await client.mabinogiHeroes.notice.getPatchList();
   * for (const n of list.patch_notice) {
   *   console.log(`[${n.date}] ${n.title} (${n.notice_id})`);
   * }
   * ```
   */
  async getPatchList(): Promise<HeroesPatchNoticeList> {
    return this.http.get<HeroesPatchNoticeList>(
      `${MabinogiHeroesNoticeClient.BASE}/notice-patch`,
      undefined,
      HEROES_PATCH_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 패치노트 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자 (`getPatchList()` 응답의 `notice_id`)
   * @throws {NexonBadRequestError} noticeId가 1 이상의 정수가 아닐 때 (요청 전에 SDK가 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const list = await client.mabinogiHeroes.notice.getPatchList();
   * const first = list.patch_notice[0];
   * if (first) {
   *   const detail = await client.mabinogiHeroes.notice.getPatchDetail(first.notice_id);
   *   console.log(detail.title, detail.contents);
   * }
   * ```
   */
  async getPatchDetail(noticeId: number): Promise<HeroesPatchNoticeDetail> {
    assertNoticeId(noticeId, 'getPatchList()', 'patch_notice');
    return this.http.get<HeroesPatchNoticeDetail>(
      `${MabinogiHeroesNoticeClient.BASE}/notice-patch/detail`,
      { notice_id: noticeId },
      HEROES_NOTICE_DETAIL_SHAPE,
    );
  }

  /**
   * 이벤트&샵 목록을 조회한다 (최근 20개).
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const list = await client.mabinogiHeroes.notice.getEventList();
   * for (const e of list.event_notice) {
   *   const period = e.ongoing_flag === 'true' ? '상시' : `${e.date_event_start} ~ ${e.date_event_end}`;
   *   console.log(`${e.title} (${period})`);
   * }
   * ```
   */
  async getEventList(): Promise<HeroesEventNoticeList> {
    return this.http.get<HeroesEventNoticeList>(
      `${MabinogiHeroesNoticeClient.BASE}/notice-event`,
      undefined,
      HEROES_EVENT_NOTICE_LIST_SHAPE,
    );
  }

  /**
   * 이벤트&샵 상세를 조회한다.
   *
   * @param noticeId - 공지 식별자 (`getEventList()` 응답의 `notice_id`)
   * @throws {NexonBadRequestError} noticeId가 1 이상의 정수가 아닐 때 (요청 전에 SDK가 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const list = await client.mabinogiHeroes.notice.getEventList();
   * const first = list.event_notice[0];
   * if (first) {
   *   const detail = await client.mabinogiHeroes.notice.getEventDetail(first.notice_id);
   *   console.log(detail.title, detail.date_event_start, detail.date_event_end);
   * }
   * ```
   */
  async getEventDetail(noticeId: number): Promise<HeroesEventNoticeDetail> {
    assertNoticeId(noticeId, 'getEventList()', 'event_notice');
    return this.http.get<HeroesEventNoticeDetail>(
      `${MabinogiHeroesNoticeClient.BASE}/notice-event/detail`,
      { notice_id: noticeId },
      HEROES_EVENT_NOTICE_DETAIL_SHAPE,
    );
  }
}

function assertNoticeId(noticeId: unknown, listMethod: string, listKey: string): void {
  assertPositiveInteger(
    noticeId,
    'noticeId',
    `client.mabinogiHeroes.notice.${listMethod} 응답의 ${listKey}[].notice_id 를 넘겨주세요.`,
  );
}
