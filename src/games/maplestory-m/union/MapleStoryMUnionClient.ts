import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { MOcidRequest } from '../types.js';
import { M_UNION_SHAPE, M_UNION_RAIDER_SHAPE, M_UNION_STAT_SHAPE } from '../shapes.js';
import type { MUnion, MUnionRaider, MUnionStat } from './types.js';

const OCID_HINT = 'maplestorym.getOcid()로 캐릭터 식별자를 조회하세요.';

/**
 * 메이플스토리M 유니온: 레벨·등급, 공격대원 효과, 유니온 스탯.
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
   * 유니온 레벨·등급과 레벨 총합 누적 효과를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
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
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MUnion>(
      `${MapleStoryMUnionClient.BASE}/user/union`,
      { ocid: params.ocid },
      M_UNION_SHAPE,
    );
  }

  /**
   * 유니온에 배치된 공격대원 효과를 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
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
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MUnionRaider>(
      `${MapleStoryMUnionClient.BASE}/user/union-raider`,
      { ocid: params.ocid },
      M_UNION_RAIDER_SHAPE,
    );
  }

  /**
   * 유니온 스탯(적용 중인 스탯과 프리셋별 포인트 분배)을 조회한다.
   *
   * @param params.ocid - 캐릭터 식별자(ocid). `client.maplestorym.getOcid('월드명', '캐릭터명')` 으로 얻는다
   * @throws {NexonBadRequestError} 캐릭터 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
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
    assertNonEmptyString(params.ocid, 'ocid', OCID_HINT);
    return this.http.get<MUnionStat>(
      `${MapleStoryMUnionClient.BASE}/user/union-stat`,
      { ocid: params.ocid },
      M_UNION_STAT_SHAPE,
    );
  }
}
