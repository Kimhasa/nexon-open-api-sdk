import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import type { Union, UnionArtifact, UnionChampion, UnionRaider } from './types.js';

/**
 * 메이플스토리 유니온 API 클라이언트.
 *
 * @example
 * ```ts
 * const union = await client.maplestory.union.getUnion({ ocid });
 * const raider = await client.maplestory.union.getRaider({ ocid });
 * ```
 */
export class MapleStoryUnionClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 유니온 레벨 및 유니온 등급 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const union = await client.maplestory.union.getUnion({ ocid });
   * console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
   * ```
   *
   */
  async getUnion(params: OcidDateRequest): Promise<Union> {
    return this.http.get<Union>(`${MapleStoryUnionClient.BASE}/user/union`, {
      ocid: params.ocid,
      date: params.date as string | undefined,
    });
  }

  /**
   * 유니온 공격대원 효과 및 공격대 점령 효과 등 상세 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const raider = await client.maplestory.union.getRaider({ ocid });
   * console.log(`프리셋 ${raider.use_preset_no} 사용 중`);
   * for (const stat of raider.union_raider_stat) {
   *   console.log(stat);
   * }
   * ```
   *
   */
  async getRaider(params: OcidDateRequest): Promise<UnionRaider> {
    return this.http.get<UnionRaider>(`${MapleStoryUnionClient.BASE}/user/union-raider`, {
      ocid: params.ocid,
      date: params.date as string | undefined,
    });
  }

  /**
   * 유니온 아티팩트 정보를 조회한다.
   *
   * 2024년 01월 18일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const artifact = await client.maplestory.union.getArtifact({ ocid });
   * for (const effect of artifact.union_artifact_effect) {
   *   console.log(`${effect.name} Lv.${effect.level}`);
   * }
   * ```
   *
   */
  async getArtifact(params: OcidDateRequest): Promise<UnionArtifact> {
    return this.http.get<UnionArtifact>(`${MapleStoryUnionClient.BASE}/user/union-artifact`, {
      ocid: params.ocid,
      date: params.date as string | undefined,
    });
  }

  /**
   * 유니온 챔피언 정보를 조회한다.
   *
   * 2025년 02월 20일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const champion = await client.maplestory.union.getChampion({ ocid });
   * for (const c of champion.union_champion) {
   *   console.log(`${c.champion_name} (${c.champion_class}) - ${c.champion_grade}`);
   * }
   * ```
   *
   */
  async getChampion(params: OcidDateRequest): Promise<UnionChampion> {
    return this.http.get<UnionChampion>(`${MapleStoryUnionClient.BASE}/user/union-champion`, {
      ocid: params.ocid,
      date: params.date as string | undefined,
    });
  }
}
