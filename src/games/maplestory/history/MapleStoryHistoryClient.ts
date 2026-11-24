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
 * 내 계정의 강화 기록: 스타포스 강화, 큐브 사용, 잠재능력 재설정, 소울 잠재능력 재설정.
 *
 * API 키를 발급받은 계정의 기록을 조회합니다.
 * 첫 페이지는 `date` 로, 다음 페이지는 응답의 `next_cursor` 를 `cursor` 에 넣어 조회합니다.
 *
 * @example
 * ```ts
 * const sf = await client.maplestory.history.getStarforce({ count: 100, date: '2026-11-01' });
 * for (const item of sf.starforce_history) {
 *   console.log(`${item.target_item}: ${item.before_starforce_count}→${item.after_starforce_count}`);
 * }
 * // 다음 페이지 (마지막 페이지면 next_cursor 가 null)
 * if (sf.next_cursor) {
 *   await client.maplestory.history.getStarforce({ count: 100, cursor: sf.next_cursor });
 * }
 * ```
 */
export class MapleStoryHistoryClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 내 계정의 스타포스 강화 기록(강화 전후 별 수, 결과, 스타 캐치·찬스 타임 여부)을 조회한다.
   *
   * 2023년 12월 27일 데이터부터 조회 가능하며, 최대 2년간의 데이터만 제공됩니다.
   * 스타포스 확률 정보는 최대 5분 후 확인 가능합니다.
   *
   * @param params.count - 한 번에 가져올 기록 수 (10~1000)
   * @param params.date - 기록을 볼 날짜 (한국 시간, YYYY-MM-DD). 첫 페이지를 볼 때 넣는다. `date` 와 `cursor` 중 하나는 꼭 넣는다
   * @param params.cursor - 다음 페이지를 볼 때 넣는 값. 이전 응답의 `next_cursor` 를 그대로 넣는다
   *
   * @example
   * ```ts
   * const sf = await client.maplestory.history.getStarforce({ count: 100, date: '2026-11-01' });
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
   * 내 계정의 잠재능력 재설정 이용 기록(재설정 전후 잠재능력·에디셔널 잠재능력 옵션)을 조회한다.
   *
   * 2024년 01월 25일 데이터부터 조회 가능하며, 최대 2년간의 데이터만 제공됩니다.
   * 잠재능력 재설정 정보는 최대 30분 후 확인 가능합니다.
   *
   * @param params.count - 한 번에 가져올 기록 수 (10~1000)
   * @param params.date - 기록을 볼 날짜 (한국 시간, YYYY-MM-DD). 첫 페이지를 볼 때 넣는다. `date` 와 `cursor` 중 하나는 꼭 넣는다
   * @param params.cursor - 다음 페이지를 볼 때 넣는 값. 이전 응답의 `next_cursor` 를 그대로 넣는다
   *
   * @example
   * ```ts
   * const pot = await client.maplestory.history.getPotential({ count: 100, date: '2026-11-01' });
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
   * 내 계정의 큐브 사용 기록(사용한 큐브, 사용 전후 잠재능력 옵션, 등급 상승 여부)을 조회한다.
   *
   * 최근 2년 데이터만 조회 가능합니다.
   * 큐브 확률 정보는 최대 30분 후 확인 가능합니다.
   *
   * @param params.count - 한 번에 가져올 기록 수 (10~1000)
   * @param params.date - 기록을 볼 날짜 (한국 시간, YYYY-MM-DD). 첫 페이지를 볼 때 넣는다. `date` 와 `cursor` 중 하나는 꼭 넣는다
   * @param params.cursor - 다음 페이지를 볼 때 넣는 값. 이전 응답의 `next_cursor` 를 그대로 넣는다
   *
   * @example
   * ```ts
   * const cube = await client.maplestory.history.getCube({ count: 100, date: '2026-11-01' });
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
   * 내 계정의 소울 잠재능력 재설정 이용 기록을 한 페이지 조회한다.
   *
   * 최근 2년 데이터만 조회 가능합니다.
   * 소울 잠재능력 재설정 이용 정보는 최대 30분 후 확인 가능합니다.
   *
   * @param params.count - 한 번에 가져올 기록 수 (10~1000)
   * @param params.date - 기록을 볼 날짜 (한국 시간, YYYY-MM-DD). 첫 페이지를 볼 때 넣는다. `date` 와 `cursor` 중 하나는 꼭 넣는다
   * @param params.cursor - 다음 페이지를 볼 때 넣는 값. 이전 응답의 `next_cursor` 를 그대로 넣는다
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
