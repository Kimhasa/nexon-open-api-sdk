import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { MOcidRequest } from '../types.js';
import { M_UNION_SHAPE, M_UNION_RAIDER_SHAPE, M_UNION_STAT_SHAPE } from '../shapes.js';
import type { MUnion, MUnionRaider, MUnionStat } from './types.js';
import { assertOcid } from '../validation.js';

/**
 * 메이플스토리M 유니온 API 클라이언트.
 *
 * @example
 * ```ts
 * const union = await client.maplestorym.union.get({ ocid });
 * const raider = await client.maplestorym.union.getRaider({ ocid });
 * ```
 */
export class MapleStoryMUnionClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorym/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 유니온 정보를 조회한다.
   *
   * @param params - 캐릭터 식별자(`ocid`)
   * @throws {TypeError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const union = await client.maplestorym.union.get({ ocid });
   * console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
   * ```
   */
  async get(params: MOcidRequest): Promise<MUnion> {
    assertOcid(params.ocid);
    return this.http.get<MUnion>(
      `${MapleStoryMUnionClient.BASE}/user/union`,
      { ocid: params.ocid },
      M_UNION_SHAPE,
    );
  }

  /**
   * 유니온 공격대 정보를 조회한다.
   *
   * @param params - 캐릭터 식별자(`ocid`)
   * @throws {TypeError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const raider = await client.maplestorym.union.getRaider({ ocid });
   * for (const stat of raider.use_union_raider_option) {
   *   console.log(stat);
   * }
   * ```
   */
  async getRaider(params: MOcidRequest): Promise<MUnionRaider> {
    assertOcid(params.ocid);
    return this.http.get<MUnionRaider>(
      `${MapleStoryMUnionClient.BASE}/user/union-raider`,
      { ocid: params.ocid },
      M_UNION_RAIDER_SHAPE,
    );
  }

  /**
   * 유니온 스탯과 프리셋 정보를 조회한다.
   *
   * @param params - 캐릭터 식별자(`ocid`)
   * @throws {TypeError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   *
   * const stat = await client.maplestorym.union.getStat({ ocid });
   * for (const option of stat.use_union_stat) {
   *   console.log(option.stat_name, option.stat_point, option.stat_value);
   * }
   * ```
   */
  async getStat(params: MOcidRequest): Promise<MUnionStat> {
    assertOcid(params.ocid);
    return this.http.get<MUnionStat>(
      `${MapleStoryMUnionClient.BASE}/user/union-stat`,
      { ocid: params.ocid },
      M_UNION_STAT_SHAPE,
    );
  }
}
