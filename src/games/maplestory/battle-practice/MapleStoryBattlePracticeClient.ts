import { assertInteger, assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  BATTLE_PRACTICE_REPLAY_ID_SHAPE,
  BATTLE_PRACTICE_RESULT_SHAPE,
  BATTLE_PRACTICE_SKILL_TIMELINE_SHAPE,
  BATTLE_PRACTICE_CHARACTER_INFO_SHAPE,
} from '../shapes.js';
import type {
  BattlePracticeCharacterInfo,
  BattlePracticeReplayId,
  BattlePracticeReplayIdRequest,
  BattlePracticeReplayRequest,
  BattlePracticeResult,
  BattlePracticeSkillTimeline,
  BattlePracticeSkillTimelineRequest,
} from './types.js';

const REPLAY_ID_HINT =
  'client.maplestory.battlePractice.getReplayId({ ocid }) 의 replay_list[].replay_id 를 전달하세요.';

/**
 * 메이플스토리 연무장: 리플레이별 측정 결과(데미지·DPS), 스킬 사용 내역, 입장 당시 캐릭터 정보.
 *
 * 리플레이 고유 번호(`replay_id`)를 먼저 조회한 뒤, 그 번호로 나머지를 조회합니다.
 * 리플레이를 등록한 캐릭터만 조회할 수 있습니다.
 *
 * @example
 * ```ts
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 *
 * const { replay_list } = await client.maplestory.battlePractice.getReplayId({ ocid });
 * const replayId = replay_list[0]?.replay_id;
 * if (replayId) {
 *   const result = await client.maplestory.battlePractice.getResult({ replay_id: replayId });
 *   console.log(`총 데미지 ${result.total_damage}, DPS ${result.total_dps}`);
 * }
 * ```
 */
export class MapleStoryBattlePracticeClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 캐릭터가 등록한 연무장 리플레이 목록(리플레이 고유 번호)을 조회한다.
   *
   * 리플레이를 등록한 캐릭터에 대해서만 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   *
   * @throws {NexonBadRequestError} ocid가 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('캐릭터명');
   * const { replay_list } = await client.maplestory.battlePractice.getReplayId({ ocid });
   * for (const replay of replay_list) {
   *   console.log(`${replay.period_no}기: ${replay.replay_id} (${replay.register_date})`);
   * }
   * ```
   */
  async getReplayId(params: BattlePracticeReplayIdRequest): Promise<BattlePracticeReplayId> {
    assertNonEmptyString(
      params.ocid,
      'ocid',
      "client.maplestory.getOcid('캐릭터명') 으로 얻은 값을 전달하세요.",
    );
    return this.http.get<BattlePracticeReplayId>(
      `${MapleStoryBattlePracticeClient.BASE}/battle-practice/replay-id`,
      { ocid: params.ocid },
      BATTLE_PRACTICE_REPLAY_ID_SHAPE,
    );
  }

  /**
   * 연무장 측정 결과(총 데미지, DPS, 스킬별 데미지 비중)를 조회한다.
   *
   * @param params.replay_id - 연무장 리플레이 고유 번호. `getReplayId()` 응답의 `replay_list[].replay_id`
   *
   * @throws {NexonBadRequestError} replay_id가 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const { replay_list } = await client.maplestory.battlePractice.getReplayId({ ocid });
   * const replayId = replay_list[0]?.replay_id;
   * if (replayId) {
   *   const result = await client.maplestory.battlePractice.getResult({ replay_id: replayId });
   *   for (const skill of result.skill_statistic) {
   *     console.log(`${skill.skill_name}: ${skill.damage_percent}%`);
   *   }
   * }
   * ```
   */
  async getResult(params: BattlePracticeReplayRequest): Promise<BattlePracticeResult> {
    assertNonEmptyString(params.replay_id, 'replay_id', REPLAY_ID_HINT);
    return this.http.get<BattlePracticeResult>(
      `${MapleStoryBattlePracticeClient.BASE}/battle-practice/result`,
      { replay_id: params.replay_id },
      BATTLE_PRACTICE_RESULT_SHAPE,
    );
  }

  /**
   * 연무장 측정 중 스킬 사용 내역(타임라인)을 한 페이지 조회한다.
   *
   * 응답의 `total_page_no` 까지 `page_no` 를 1씩 올려 다음 페이지를 조회합니다.
   *
   * @param params.replay_id - 연무장 리플레이 고유 번호. `getReplayId()` 응답의 `replay_list[].replay_id`
   * @param params.page_no - 페이지 번호 (1부터 시작, 생략 시 1페이지)
   *
   * @throws {NexonBadRequestError} replay_id가 비어 있거나 page_no가 1 이상의 정수가 아닐 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const { replay_list } = await client.maplestory.battlePractice.getReplayId({ ocid });
   * const replayId = replay_list[0]?.replay_id;
   * if (replayId) {
   *   const first = await client.maplestory.battlePractice.getSkillTimeline({ replay_id: replayId });
   *   for (const use of first.skill_timeline) {
   *     console.log(`${use.elapse_time}ms ${use.skill_name}`);
   *   }
   *   if (first.total_page_no > 1) {
   *     await client.maplestory.battlePractice.getSkillTimeline({ replay_id: replayId, page_no: 2 });
   *   }
   * }
   * ```
   */
  async getSkillTimeline(
    params: BattlePracticeSkillTimelineRequest,
  ): Promise<BattlePracticeSkillTimeline> {
    assertNonEmptyString(params.replay_id, 'replay_id', REPLAY_ID_HINT);
    if (params.page_no !== undefined) assertInteger(params.page_no, 'page_no', { min: 1 });
    return this.http.get<BattlePracticeSkillTimeline>(
      `${MapleStoryBattlePracticeClient.BASE}/battle-practice/skill-timeline`,
      { replay_id: params.replay_id, page_no: params.page_no },
      BATTLE_PRACTICE_SKILL_TIMELINE_SHAPE,
    );
  }

  /**
   * 연무장 입장 당시의 캐릭터 정보(스탯·장비·스킬·유니온 등)를 한 번에 조회한다.
   *
   * 스탯·장비·펫·스킬·유니온·길드 정보가 `*_object` 키 아래에 한 번에 담겨 옵니다.
   *
   * @param params.replay_id - 연무장 리플레이 고유 번호. `getReplayId()` 응답의 `replay_list[].replay_id`
   *
   * @throws {NexonBadRequestError} replay_id가 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const { replay_list } = await client.maplestory.battlePractice.getReplayId({ ocid });
   * const replayId = replay_list[0]?.replay_id;
   * if (replayId) {
   *   const info = await client.maplestory.battlePractice.getCharacterInfo({ replay_id: replayId });
   *   console.log(info.basic_object.character_name, info.basic_object.character_level);
   *   console.log(info.item_object.item_equipment_object.item_equipment.length);
   * }
   * ```
   */
  async getCharacterInfo(
    params: BattlePracticeReplayRequest,
  ): Promise<BattlePracticeCharacterInfo> {
    assertNonEmptyString(params.replay_id, 'replay_id', REPLAY_ID_HINT);
    return this.http.get<BattlePracticeCharacterInfo>(
      `${MapleStoryBattlePracticeClient.BASE}/battle-practice/character-info`,
      { replay_id: params.replay_id },
      BATTLE_PRACTICE_CHARACTER_INFO_SHAPE,
    );
  }
}
