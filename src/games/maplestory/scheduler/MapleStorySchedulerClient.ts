import type { HttpClient } from '../../../core/http/HttpClient.js';
import { SCHEDULER_CHARACTER_STATE_SHAPE } from '../shapes.js';
import { assertNonEmptyString } from '../validation.js';
import type { SchedulerCharacterState, SchedulerCharacterStateRequest } from './types.js';

/**
 * 메이플스토리 스케줄러 API 클라이언트.
 *
 * 인게임 스케줄러의 일일·주간·보스 콘텐츠 수행 현황을 조회합니다.
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
   * 캐릭터의 스케줄러 수행 현황 정보를 조회한다.
   *
   * - 실시간 조회와 이전 일자 조회가 가능하며, 조회 요청일 기준 최대 14일 전까지만 조회할 수 있습니다.
   * - 길드 콘텐츠·에픽던전·무릉도장·보스 정보는 각 콘텐츠 완료 시, 그 외 콘텐츠·퀘스트 정보는
   *   캐릭터 접속 중 및 접속 종료 시 갱신됩니다.
   * - 캐릭터가 기준일에 접속하지 않았다면 응답 결과가 없을 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자. 자신의 계정에 속한 캐릭터만 조회할 수 있습니다
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 오늘 날짜
   *
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않거나 다른 계정의 캐릭터일 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
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
      { ocid: params.ocid, date: params.date as string | undefined },
      SCHEDULER_CHARACTER_STATE_SHAPE,
    );
  }
}
