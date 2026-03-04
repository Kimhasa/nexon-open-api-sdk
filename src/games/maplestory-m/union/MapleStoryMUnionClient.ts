import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidRequest } from '../../_base/maple-base-types.js';
import { M_UNION_SHAPE, M_UNION_RAIDER_SHAPE } from '../shapes.js';
import type { MUnion, MUnionRaider } from './types.js';

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
   * @example
   * ```ts
   * const union = await client.maplestorym.union.get({ ocid });
   * console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
   * ```
   */
  async get(params: OcidRequest): Promise<MUnion> {
    return this.http.get<MUnion>(
      `${MapleStoryMUnionClient.BASE}/user/union`,
      { ocid: params.ocid },
      M_UNION_SHAPE,
    );
  }

  /**
   * 유니온 공격대 정보를 조회한다.
   *
   * @example
   * ```ts
   * const raider = await client.maplestorym.union.getRaider({ ocid });
   * for (const stat of raider.union_raider_stat) {
   *   console.log(stat);
   * }
   * ```
   */
  async getRaider(params: OcidRequest): Promise<MUnionRaider> {
    return this.http.get<MUnionRaider>(
      `${MapleStoryMUnionClient.BASE}/user/union-raider`,
      { ocid: params.ocid },
      M_UNION_RAIDER_SHAPE,
    );
  }
}
