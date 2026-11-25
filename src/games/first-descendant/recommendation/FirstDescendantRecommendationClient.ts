import { assertNonEmptyString, assertOneOf } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { TFD_RECOMMENDATION_MODULE_SHAPE } from '../shapes.js';
import type { TfdRecommendationModule, TfdRecommendationModuleRequest } from './types.js';

const PERIODS: readonly string[] = ['0', '1', '2'];

/**
 * 퍼스트 디센던트 추천 모듈 조회 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 *
 * const result = await client.firstDescendant.recommendation.getModule({
 *   descendant_id: '101000001',
 *   weapon_id: '211011001',
 *   void_battle_id: '151000001',
 *   period: '1',
 * });
 * ```
 */
export class FirstDescendantRecommendationClient {
  private static readonly BASE = 'https://open.api.nexon.com/tfd/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 보이드 요격전 성공 기록에서 계승자와 무기의 추천 모듈을 조회한다.
   *
   * 보이드 요격전 성공 기록을 바탕으로 하므로, 조건에 맞는 기록이 부족하면 추천이 비어 있을 수 있다.
   *
   * @param params - 도감에서 찾은 계승자·무기·보이드 요격전 번호와 추천 기간. `period`의 `'0'`은 7일, `'1'`은 30일, `'2'`는 전체다.
   * @throws {NexonBadRequestError} 식별자가 비어 있거나 period가 `'0'`·`'1'`·`'2'` 가 아닐 때 (요청 전 SDK 검증)
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
   * // 보이드 요격전 공략 페이지에 추천 모듈을 표시할 때
   * const result = await client.firstDescendant.recommendation.getModule({
   *   descendant_id: '101000001',
   *   weapon_id: '211011001',
   *   void_battle_id: '151000001',
   *   period: '0',
   * });
   * const moduleIds = result.descendant.recommendation.map((item) => item.module_id);
   * ```
   */
  async getModule(params: TfdRecommendationModuleRequest): Promise<TfdRecommendationModule> {
    assertNonEmptyString(
      params.descendant_id,
      'descendant_id',
      'client.firstDescendant.meta.getDescendant() 응답의 descendant_id를 넘기세요.',
    );
    assertNonEmptyString(
      params.weapon_id,
      'weapon_id',
      'client.firstDescendant.meta.getWeapon() 응답의 weapon_id를 넘기세요.',
    );
    assertNonEmptyString(
      params.void_battle_id,
      'void_battle_id',
      'client.firstDescendant.meta.getVoidBattle() 응답의 void_battle_id를 넘기세요.',
    );
    assertOneOf(
      params.period,
      PERIODS,
      'period',
      "'0'은 최근 7일, '1'은 최근 30일, '2'는 전체입니다.",
    );
    return this.http.get<TfdRecommendationModule>(
      `${FirstDescendantRecommendationClient.BASE}/recommendation/module`,
      {
        descendant_id: params.descendant_id,
        weapon_id: params.weapon_id,
        void_battle_id: params.void_battle_id,
        period: params.period,
      },
      TFD_RECOMMENDATION_MODULE_SHAPE,
    );
  }
}
