import { schedulerDate } from '../../_base/maple-date.js';
import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { SCHEDULER_CHARACTER_STATE_SHAPE } from '../shapes.js';
import type { SchedulerCharacterState, SchedulerCharacterStateRequest } from './types.js';

/**
 * 메이플스토리 스케줄러: 인게임 스케줄러의 일일·주간·보스 콘텐츠 수행 현황.
 *
 * 내 계정(API Key를 발급받은 계정)의 캐릭터만 조회할 수 있습니다.
 *
 * @example
 * ```ts
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 *
 * const state = await client.maplestory.scheduler.getCharacterState({ ocid });
 * console.log(`주간 보스 ${state.weekly_boss_clear_count}/${state.weekly_boss_clear_limit_count}`);
 * ```
 */
export class MapleStorySchedulerClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 인게임 스케줄러의 일일·주간·보스 콘텐츠 수행 현황(주간 보스 처치 횟수 등)을 조회한다.
   *
   * - 실시간 조회와 이전 일자 조회가 가능하며, 조회 요청일 기준 최대 14일 전까지만 조회할 수 있습니다.
   * - 길드 콘텐츠·에픽던전·무릉도장·보스 정보는 각 콘텐츠 완료 시, 그 외 콘텐츠·퀘스트 정보는
   *   캐릭터 접속 중 및 접속 종료 시 갱신됩니다.
   * - 캐릭터가 기준일에 접속하지 않았다면 응답 결과가 없을 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). 내 계정(API Key를 발급받은 계정)의 캐릭터만 조회할 수 있다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 조회일 기준 14일 전부터 오늘까지. 생략하면 오늘의 수행 현황을 조회한다
   *
   * @throws {NexonBadRequestError} ocid가 비어 있거나 날짜 형식이 잘못되었거나 14일 전부터 오늘까지의 범위를 벗어났을 때
   * @throws {NexonAuthError} API Key가 유효하지 않거나 다른 계정의 캐릭터일 때
   * @throws {NexonRateLimitError} 호출 허용량 초과 시
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('캐릭터명');
   * const state = await client.maplestory.scheduler.getCharacterState({ ocid });
   * for (const boss of state.boss_contents) {
   *   if (boss.complete_flag === 'true') console.log(`${boss.difficulty} ${boss.content_name} 완료`);
   * }
   * ```
   */
  async getCharacterState(
    params: SchedulerCharacterStateRequest,
  ): Promise<SchedulerCharacterState> {
    assertNonEmptyString(
      params.ocid,
      'ocid',
      "client.maplestory.getOcid('캐릭터명') 으로 얻은 값을 전달하세요.",
    );
    return this.http.get<SchedulerCharacterState>(
      `${MapleStorySchedulerClient.BASE}/scheduler/character-state`,
      { ocid: params.ocid, date: schedulerDate(params.date) },
      SCHEDULER_CHARACTER_STATE_SHAPE,
    );
  }
}
