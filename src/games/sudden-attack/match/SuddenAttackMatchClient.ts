import { assertNonEmptyString, assertOneOf } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { SUDDEN_ATTACK_ENDPOINTS } from '../endpoints.js';
import { MATCH_LIST_SHAPE, MATCH_DETAIL_SHAPE } from '../shapes.js';
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
   * 최근 매치 목록을 모드와 유형으로 골라 조회한다.
   *
   * @param params - `getOuid()`로 찾은 계정 고유 번호, 폭파미션 등 모드, 일반전·클랜전 등 선택 매치 유형
   * @throws {NexonBadRequestError} ouid가 비어 있거나 모드 또는 유형이 유효하지 않을 때
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
   * // 폭파미션 일반전 전적을 모아 볼 때
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const page = await client.suddenAttack.match.getList({ ouid, match_mode: '폭파미션' });
   * console.log(page.match);
   * ```
   */
  async getList({
    ouid,
    match_mode,
    match_type,
  }: SuddenAttackMatchListRequest): Promise<SuddenAttackMatchList> {
    assertNonEmptyString(
      ouid,
      'ouid',
      'client.suddenAttack.getOuid(닉네임)으로 계정 식별자를 조회하세요.',
    );
    assertOneOf(match_mode, SUDDEN_ATTACK_MATCH_MODES, 'match_mode', '예시는 폭파미션입니다.');
    if (match_type !== undefined) {
      assertOneOf(match_type, SUDDEN_ATTACK_MATCH_TYPES, 'match_type', '예시는 일반전입니다.');
    }

    return this.http.get(
      SUDDEN_ATTACK_ENDPOINTS.MATCH,
      { ouid, match_mode, match_type },
      MATCH_LIST_SHAPE,
    );
  }

  /**
   * 한 매치의 맵과 참가 유저의 킬·데스 등 전적을 조회한다.
   *
   * @param matchId - `match.getList()`로 조회한 매치의 고유 번호(`match_id`)
   * @throws {NexonBadRequestError} 매치 식별자가 비어 있을 때
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
   * // 전적표에서 선택한 매치의 참가자 기록을 표시할 때
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const { match } = await client.suddenAttack.match.getList({ ouid, match_mode: '폭파미션' });
   * const firstMatch = match[0];
   * if (firstMatch) console.log(await client.suddenAttack.match.getDetail(firstMatch.match_id));
   * ```
   */
  async getDetail(matchId: string): Promise<SuddenAttackMatchDetail> {
    assertNonEmptyString(matchId, 'matchId', '매치 목록에서 match_id를 확인하세요.');

    return this.http.get(
      SUDDEN_ATTACK_ENDPOINTS.MATCH_DETAIL,
      { match_id: matchId },
      MATCH_DETAIL_SHAPE,
    );
  }
}
