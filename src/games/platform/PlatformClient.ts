import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { PLATFORM_NOTICE_LIST_SHAPE } from './shapes.js';
import type { PlatformNoticeList, PlatformNoticeRequest } from './notice/types.js';

/**
 * NEXON Open API 공지 클라이언트.
 *
 * 포털 스펙: `specs/openapi/platform/` (https://openapi.nexon.com/ko/game/platform/)
 *
 * 게임 데이터가 아니라 NEXON Open API 자체의 공지(점검, API 변경 안내 등)를 조회합니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 *
 * const { notice } = await client.platform.getNoticeList();
 * for (const n of notice) {
 *   console.log(`[${n.game_name}] ${n.title} (${n.date})`);
 * }
 * ```
 */
export class PlatformClient extends AbstractGameClient {
  protected readonly pathPrefix = 'platform';

  /**
   * NEXON Open API의 최근 공지 10개와 본문을 조회한다.
   *
   * 게임 공지 API와 달리 상세 API가 없고, 목록 항목에 본문(`contents`)이 함께 온다.
   *
   * @param params - `game_name`은 공지를 볼 게임 이름. 생략하거나 비우면 전체 공지를 조회한다.
   * @throws {NexonBadRequestError} game_name이 유효하지 않을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 허용량을 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 서비스 상태 페이지에 전체 공지와 특정 게임 공지를 표시할 때
   * const all = await client.platform.getNoticeList();
   * const maple = await client.platform.getNoticeList({ game_name: '메이플스토리' });
   * console.log(all.notice.length, maple.notice[0]?.title);
   * ```
   */
  async getNoticeList(params: PlatformNoticeRequest = {}): Promise<PlatformNoticeList> {
    return this.http.get<PlatformNoticeList>(
      // 경로가 `/platform/openapi/v1/notice` 라서 version 자리에 `openapi/v1` 을 넣는다
      this.buildUrl('notice', 'openapi/v1'),
      // 스펙: 빈 값이면 전체 공지. 빈 문자열은 쿼리에서 빼서 생략과 같게 만든다
      { game_name: params.game_name === '' ? undefined : params.game_name },
      PLATFORM_NOTICE_LIST_SHAPE,
    );
  }
}
