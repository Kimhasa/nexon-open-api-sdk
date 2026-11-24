import { assertInteger, invalidInput } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  STARFORCE_HISTORY_SHAPE,
  POTENTIAL_HISTORY_SHAPE,
  CUBE_HISTORY_SHAPE,
  SOUL_POTENTIAL_HISTORY_SHAPE,
} from '../shapes.js';
import type {
  CubeHistory,
  HistoryRequest,
  PotentialHistory,
  SoulPotentialHistory,
  StarforceHistory,
} from './types.js';

/**
 * 메이플스토리 확률/이력 API 클라이언트.
 *
 * 커서 기반 페이지네이션을 사용합니다.
 * `date`와 `cursor` 중 1개 이상은 필수 입력입니다.
 *
 * @example
 * ```ts
 * const sf = await client.maplestory.history.getStarforce({ count: 100, date: '2024-01-01' });
 * for (const item of sf.starforce_history) {
 *   console.log(`${item.target_item}: ${item.before_starforce_count}→${item.after_starforce_count}`);
 * }
 * // 다음 페이지
 * const next = await client.maplestory.history.getStarforce({ count: 100, cursor: sf.next_cursor });
 * ```
 */
export class MapleStoryHistoryClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 스타포스 강화 결과를 조회한다.
   *
   * 2023년 12월 27일 데이터부터 조회 가능하며, 최대 2년간의 데이터만 제공됩니다.
   * 스타포스 확률 정보는 최대 5분 후 확인 가능합니다.
   *
   * @param params.count - 한번에 가져올 결과 수 (최소 10, 최대 1000)
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). date와 cursor 중 1개 이상 필수
   * @param params.cursor - 페이징 cursor. date와 cursor 중 1개 이상 필수
   *
   * @example
   * ```ts
   * const sf = await client.maplestory.history.getStarforce({ count: 100, date: '2024-01-01' });
   * console.log(`${sf.count}건 조회됨`);
   * ```
   *
   */
  async getStarforce(params: HistoryRequest): Promise<StarforceHistory> {
    return this.http.get<StarforceHistory>(
      `${MapleStoryHistoryClient.BASE}/history/starforce`,
      {
        count: params.count,
        date: params.date as string | undefined,
        cursor: params.cursor,
      },
      STARFORCE_HISTORY_SHAPE,
    );
  }

  /**
   * 잠재능력 재설정 이용 결과를 조회한다.
   *
   * 2024년 01월 25일 데이터부터 조회 가능하며, 최대 2년간의 데이터만 제공됩니다.
   * 잠재능력 재설정 정보는 최대 30분 후 확인 가능합니다.
   *
   * @param params.count - 한번에 가져올 결과 수 (최소 10, 최대 1000)
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). date와 cursor 중 1개 이상 필수
   * @param params.cursor - 페이징 cursor. date와 cursor 중 1개 이상 필수
   *
   * @example
   * ```ts
   * const pot = await client.maplestory.history.getPotential({ count: 100, date: '2024-02-01' });
   * for (const item of pot.potential_history) {
   *   console.log(`${item.target_item}: ${item.potential_option_grade}`);
   * }
   * ```
   *
   */
  async getPotential(params: HistoryRequest): Promise<PotentialHistory> {
    return this.http.get<PotentialHistory>(
      `${MapleStoryHistoryClient.BASE}/history/potential`,
      {
        count: params.count,
        date: params.date as string | undefined,
        cursor: params.cursor,
      },
      POTENTIAL_HISTORY_SHAPE,
    );
  }

  /**
   * 큐브 사용 결과를 조회한다.
   *
   * 최근 2년 데이터만 조회 가능합니다.
   * 큐브 확률 정보는 최대 30분 후 확인 가능합니다.
   *
   * @param params.count - 한번에 가져올 결과 수 (최소 10, 최대 1000)
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). date와 cursor 중 1개 이상 필수
   * @param params.cursor - 페이징 cursor. date와 cursor 중 1개 이상 필수
   *
   * @example
   * ```ts
   * const cube = await client.maplestory.history.getCube({ count: 100, date: '2024-01-01' });
   * for (const item of cube.cube_history) {
   *   console.log(`${item.cube_type} → ${item.target_item}: ${item.item_upgrade_result}`);
   * }
   * ```
   *
   */
  async getCube(params: HistoryRequest): Promise<CubeHistory> {
    return this.http.get<CubeHistory>(
      `${MapleStoryHistoryClient.BASE}/history/cube`,
      {
        count: params.count,
        date: params.date as string | undefined,
        cursor: params.cursor,
      },
      CUBE_HISTORY_SHAPE,
    );
  }

  /**
   * 소울 잠재능력 재설정 이용 결과를 조회한다 (단일 페이지).
   *
   * 최근 2년 데이터만 조회 가능합니다.
   * 소울 잠재능력 재설정 이용 정보는 최대 30분 후 확인 가능합니다.
   *
   * @param params.count - 한번에 가져올 결과 수 (최소 10, 최대 1000)
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). date와 cursor 중 1개 이상 필수
   * @param params.cursor - 페이징 cursor. date와 cursor 중 1개 이상 필수
   *
   * @throws {NexonBadRequestError} count가 10~1000 사이의 정수가 아니거나 date·cursor가 모두 없을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const soul = await client.maplestory.history.getSoulPotential({ count: 100, date: '2026-11-01' });
   * for (const item of soul.soul_potential_history) {
   *   console.log(`${item.target_item}: ${item.soul_potential_grade} (${item.item_upgrade_result})`);
   * }
   * // 다음 페이지
   * if (soul.next_cursor) {
   *   await client.maplestory.history.getSoulPotential({ count: 100, cursor: soul.next_cursor });
   * }
   * ```
   */
  async getSoulPotential(params: HistoryRequest): Promise<SoulPotentialHistory> {
    assertInteger(params.count, 'count', { min: 10, max: 1000 });
    if (params.date === undefined && params.cursor === undefined) {
      invalidInput(
        'date와 cursor가 모두 빠졌습니다. date와 cursor 중 1개 이상을 입력하세요.',
        "첫 페이지는 { count: 100, date: 'YYYY-MM-DD' }, 다음 페이지는 { count: 100, cursor: next_cursor } 로 조회하세요.",
      );
    }
    return this.http.get<SoulPotentialHistory>(
      `${MapleStoryHistoryClient.BASE}/history/soul-potential`,
      {
        count: params.count,
        date: params.date as string | undefined,
        cursor: params.cursor,
      },
      SOUL_POTENTIAL_HISTORY_SHAPE,
    );
  }
}
