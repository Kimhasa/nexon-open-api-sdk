import { assertNonEmptyString, assertOneOf, invalidInput } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  TFD_LEADERBOARD_VOID_EROSION_PURGE_CHALLENGE_SHAPE,
  TFD_LEADERBOARD_VOID_INTERCEPT_BATTLE_SHAPE,
} from '../shapes.js';
import type {
  TfdLeaderboardVoidErosionPurgeChallenge,
  TfdLeaderboardVoidErosionPurgeChallengeRequest,
  TfdLeaderboardVoidInterceptBattle,
  TfdLeaderboardVoidInterceptBattleRequest,
} from './types.js';

const PLATFORM_TYPES: readonly string[] = ['All', 'Pc', 'PlayStation', 'Xbox'];
const SQUAD_USER_COUNTS: readonly number[] = [2, 3, 4];

interface LeaderboardFilterQuery {
  readonly leaderboard_type: string;
  readonly descendant_id: string | undefined;
  readonly squad_user_count: number | undefined;
  readonly platform_type: string;
}

/**
 * 리더보드 공통 조건을 검증하고 쿼리로 바꾼다.
 *
 * 타입이 이미 막는 조합이지만 JavaScript 호출이나 `as` 캐스팅으로 들어온 값은
 * 서버 400의 뭉뚱그린 메시지 대신 여기서 원인을 짚어 준다.
 */
function toFilterQuery(params: {
  readonly leaderboard_type: string;
  readonly descendant_id?: string | undefined;
  readonly squad_user_count?: number | undefined;
  readonly platform_type?: string | undefined;
}): LeaderboardFilterQuery {
  const { leaderboard_type, descendant_id, squad_user_count } = params;
  const platform_type = params.platform_type ?? 'All';

  assertOneOf(leaderboard_type, ['Solo', 'Squad'], 'leaderboard_type');
  assertOneOf(platform_type, PLATFORM_TYPES, 'platform_type', "생략하면 'All'입니다.");
  if (leaderboard_type === 'Solo' && squad_user_count !== undefined) {
    invalidInput(
      "leaderboard_type이 'Solo' 인데 squad_user_count가 들어왔습니다.",
      "squad_user_count를 빼거나 leaderboard_type을 'Squad' 로 바꾸세요. 솔로는 descendant_id로 거릅니다.",
    );
  }
  if (leaderboard_type === 'Squad' && descendant_id !== undefined) {
    invalidInput(
      "leaderboard_type이 'Squad' 인데 descendant_id가 들어왔습니다.",
      "descendant_id를 빼거나 leaderboard_type을 'Solo' 로 바꾸세요. 스쿼드는 squad_user_count로 거릅니다.",
    );
  }
  if (squad_user_count !== undefined) {
    assertOneOf(squad_user_count, SQUAD_USER_COUNTS, 'squad_user_count');
  }
  if (descendant_id !== undefined) {
    assertNonEmptyString(
      descendant_id,
      'descendant_id',
      'client.firstDescendant.meta.getDescendant() 응답의 descendant_id를 넘기거나 필드를 빼세요.',
    );
  }

  return { leaderboard_type, descendant_id, squad_user_count, platform_type };
}

/**
 * 퍼스트 디센던트 리더보드 조회 클라이언트.
 *
 * 리더보드 데이터는 평균 1시간 단위로 갱신된다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const solo = await client.firstDescendant.leaderboard.getVoidInterceptBattle({
 *   leaderboard_type: 'Solo',
 *   descendant_id: '101000001',
 * });
 * const squad = await client.firstDescendant.leaderboard.getVoidErosionPurgeChallenge({
 *   leaderboard_type: 'Squad',
 *   squad_user_count: 4,
 *   platform_type: 'Pc',
 * });
 * ```
 */
export class FirstDescendantLeaderboardClient {
  private static readonly BASE = 'https://open.api.nexon.com/tfd/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 보이드 요격전 리더보드를 조회한다.
   *
   * @param params - `leaderboard_type` (`'Solo'` | `'Squad'`), 솔로면 `descendant_id`, 스쿼드면 `squad_user_count` (2 | 3 | 4),
   *   `platform_type` (기본값 `'All'`), `contents_type` (기본값 `'RiskMode'`)
   * @throws {NexonBadRequestError} 조건 조합이나 값이 올바르지 않을 때 (요청 전 SDK 검증)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const result = await client.firstDescendant.leaderboard.getVoidInterceptBattle({
   *   leaderboard_type: 'Solo',
   *   descendant_id: '101000001',
   *   platform_type: 'All',
   * });
   * for (const entry of result.leaderboard ?? []) {
   *   console.log(entry.ranking, entry.score, entry.member[0]?.user_name);
   * }
   * ```
   */
  async getVoidInterceptBattle(
    params: TfdLeaderboardVoidInterceptBattleRequest,
  ): Promise<TfdLeaderboardVoidInterceptBattle> {
    const filter = toFilterQuery(params);
    const contentsType = params.contents_type ?? 'RiskMode';
    assertOneOf(contentsType, ['RiskMode'], 'contents_type', "생략하면 'RiskMode'입니다.");
    return this.http.get<TfdLeaderboardVoidInterceptBattle>(
      `${FirstDescendantLeaderboardClient.BASE}/leaderboard/void-intercept-battle`,
      {
        leaderboard_type: filter.leaderboard_type,
        descendant_id: filter.descendant_id,
        squad_user_count: filter.squad_user_count,
        contents_type: contentsType,
        platform_type: filter.platform_type,
      },
      TFD_LEADERBOARD_VOID_INTERCEPT_BATTLE_SHAPE,
    );
  }

  /**
   * 보이드 침식 정화 - 도전 리더보드를 조회한다.
   *
   * @param params - `leaderboard_type` (`'Solo'` | `'Squad'`), 솔로면 `descendant_id`, 스쿼드면 `squad_user_count` (2 | 3 | 4),
   *   `platform_type` (기본값 `'All'`)
   * @throws {NexonBadRequestError} 조건 조합이나 값이 올바르지 않을 때 (요청 전 SDK 검증)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const result = await client.firstDescendant.leaderboard.getVoidErosionPurgeChallenge({
   *   leaderboard_type: 'Squad',
   *   squad_user_count: 4,
   * });
   * for (const entry of result.leaderboard) {
   *   console.log(entry.ranking, entry.stage, entry.score);
   * }
   * ```
   */
  async getVoidErosionPurgeChallenge(
    params: TfdLeaderboardVoidErosionPurgeChallengeRequest,
  ): Promise<TfdLeaderboardVoidErosionPurgeChallenge> {
    const filter = toFilterQuery(params);
    return this.http.get<TfdLeaderboardVoidErosionPurgeChallenge>(
      `${FirstDescendantLeaderboardClient.BASE}/leaderboard/void-erosion-purge-challenge`,
      {
        leaderboard_type: filter.leaderboard_type,
        descendant_id: filter.descendant_id,
        squad_user_count: filter.squad_user_count,
        platform_type: filter.platform_type,
      },
      TFD_LEADERBOARD_VOID_EROSION_PURGE_CHALLENGE_SHAPE,
    );
  }
}
