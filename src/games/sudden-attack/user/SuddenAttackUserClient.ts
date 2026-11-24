import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { SUDDEN_ATTACK_ENDPOINTS } from '../endpoints.js';
import {
  USER_BASIC_SHAPE,
  USER_RANK_SHAPE,
  USER_TIER_SHAPE,
  USER_RECENT_INFO_SHAPE,
} from '../shapes.js';
import type { SuddenAttackOuid } from '../types.js';
import type {
  SuddenAttackUserBasic,
  SuddenAttackUserRank,
  SuddenAttackUserTier,
  SuddenAttackUserRecentInfo,
} from './types.js';

/** 서든어택 계정 정보 API. */
export class SuddenAttackUserClient {
  constructor(private readonly http: HttpClient) {}

  /**
   * 기본 계정 정보를 조회합니다.
   *
   * @param ouid - getOuid로 얻은 계정 식별자
   * @throws {NexonBadRequestError} ouid가 비어 있을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const result = await client.suddenAttack.user.getBasic(ouid);
   * console.log(result);
   * ```
   */
  async getBasic(ouid: SuddenAttackOuid): Promise<SuddenAttackUserBasic> {
    assertNonEmptyString(
      ouid,
      'ouid',
      'client.suddenAttack.getOuid(닉네임)으로 계정 식별자를 조회하세요.',
    );
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.USER_BASIC, { ouid }, USER_BASIC_SHAPE);
  }

  /**
   * 통합·시즌 계급을 조회합니다. 게임 접속 종료 시 갱신됩니다.
   *
   * @param ouid - getOuid로 얻은 계정 식별자
   * @throws {NexonBadRequestError} ouid가 비어 있을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const result = await client.suddenAttack.user.getRank(ouid);
   * console.log(result);
   * ```
   */
  async getRank(ouid: SuddenAttackOuid): Promise<SuddenAttackUserRank> {
    assertNonEmptyString(
      ouid,
      'ouid',
      'client.suddenAttack.getOuid(닉네임)으로 계정 식별자를 조회하세요.',
    );
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.USER_RANK, { ouid }, USER_RANK_SHAPE);
  }

  /**
   * 솔로·파티 랭크전 티어를 조회합니다. 게임 접속 종료 시 갱신됩니다.
   *
   * @param ouid - getOuid로 얻은 계정 식별자
   * @throws {NexonBadRequestError} ouid가 비어 있을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const result = await client.suddenAttack.user.getTier(ouid);
   * console.log(result);
   * ```
   */
  async getTier(ouid: SuddenAttackOuid): Promise<SuddenAttackUserTier> {
    assertNonEmptyString(
      ouid,
      'ouid',
      'client.suddenAttack.getOuid(닉네임)으로 계정 식별자를 조회하세요.',
    );
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.USER_TIER, { ouid }, USER_TIER_SHAPE);
  }

  /**
   * 최근 승률과 무기별 킬데스 정보를 조회합니다. 매치 종료 시 갱신됩니다.
   *
   * @param ouid - getOuid로 얻은 계정 식별자
   * @throws {NexonBadRequestError} ouid가 비어 있을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const result = await client.suddenAttack.user.getRecentInfo(ouid);
   * console.log(result);
   * ```
   */
  async getRecentInfo(ouid: SuddenAttackOuid): Promise<SuddenAttackUserRecentInfo> {
    assertNonEmptyString(
      ouid,
      'ouid',
      'client.suddenAttack.getOuid(닉네임)으로 계정 식별자를 조회하세요.',
    );
    return this.http.get(
      SUDDEN_ATTACK_ENDPOINTS.USER_RECENT_INFO,
      { ouid },
      USER_RECENT_INFO_SHAPE,
    );
  }
}
