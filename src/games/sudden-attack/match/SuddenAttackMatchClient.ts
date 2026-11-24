import type { HttpClient } from '../../../core/http/HttpClient.js';
import { SUDDEN_ATTACK_ENDPOINTS } from '../endpoints.js';
import { MATCH_LIST_SHAPE, MATCH_DETAIL_SHAPE } from '../shapes.js';
import { validateOuid } from '../validation.js';
import { SUDDEN_ATTACK_MATCH_MODES, SUDDEN_ATTACK_MATCH_TYPES } from './types.js';
import type {
  SuddenAttackMatchListRequest,
  SuddenAttackMatchList,
  SuddenAttackMatchDetail,
} from './types.js';

/** 서든어택 매치 API. */
export class SuddenAttackMatchClient {
  constructor(private readonly http: HttpClient) {}

  /**
   * 유저의 최근 매치를 최대 1,000개 조회합니다.
   *
   * @param params - 계정 식별자, 게임 모드, 선택 매치 유형
   * @throws {TypeError} ouid가 비어 있거나 모드 또는 유형이 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const page = await client.suddenAttack.match.list({ ouid, match_mode: '폭파미션' });
   * console.log(page.match);
   * ```
   */
  async list({
    ouid,
    match_mode,
    match_type,
  }: SuddenAttackMatchListRequest): Promise<SuddenAttackMatchList> {
    validateOuid(ouid);
    if (!SUDDEN_ATTACK_MATCH_MODES.includes(match_mode)) {
      throw new TypeError('match_mode에 지원되는 게임 모드를 입력하세요. 예시는 폭파미션입니다.');
    }
    if (match_type !== undefined && !SUDDEN_ATTACK_MATCH_TYPES.includes(match_type)) {
      throw new TypeError('match_type에 지원되는 매치 유형을 입력하세요. 예시는 일반전입니다.');
    }

    return this.http.get(
      SUDDEN_ATTACK_ENDPOINTS.MATCH,
      { ouid, match_mode, match_type },
      MATCH_LIST_SHAPE,
    );
  }

  /**
   * 매치 식별자로 맵과 참여 유저의 기록을 조회합니다.
   *
   * @param matchId - 매치 목록의 match_id
   * @throws {TypeError} 매치 식별자가 비어 있을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const { match } = await client.suddenAttack.match.list({ ouid, match_mode: '폭파미션' });
   * const firstMatch = match[0];
   * if (firstMatch) console.log(await client.suddenAttack.match.getDetail(firstMatch.match_id));
   * ```
   */
  async getDetail(matchId: string): Promise<SuddenAttackMatchDetail> {
    if (typeof matchId !== 'string' || matchId.trim() === '') {
      throw new TypeError('matchId가 비어 있습니다. 매치 목록에서 match_id를 확인하세요.');
    }

    return this.http.get(
      SUDDEN_ATTACK_ENDPOINTS.MATCH_DETAIL,
      { match_id: matchId },
      MATCH_DETAIL_SHAPE,
    );
  }
}
