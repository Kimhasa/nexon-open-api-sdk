import { KST_OFFSET_MINUTES, snapshotDate } from '../../_base/maple-date.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import {
  UNION_SHAPE,
  UNION_RAIDER_SHAPE,
  UNION_ARTIFACT_SHAPE,
  UNION_CHAMPION_SHAPE,
} from '../shapes.js';
import type { Union, UnionArtifact, UnionChampion, UnionRaider } from './types.js';

const SNAPSHOT = {
  firstDate: '2023-12-21',
  timezoneOffset: KST_OFFSET_MINUTES,
  apiLabel: '유니온',
} as const;

/**
 * 메이플스토리 유니온: 레벨·등급, 공격대 배치, 아티팩트, 챔피언.
 *
 * 유니온 정보도 캐릭터 고유 번호(`ocid`)로 조회합니다.
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
   * 유니온 레벨·등급과 아티팩트 레벨·포인트를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 2023-12-21부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @throws {NexonBadRequestError} 날짜 형식이 잘못되었거나 2023-12-21부터 어제까지의 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * const union = await client.maplestory.union.getUnion({ ocid });
   * console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
   * ```
   *
   */
  async getUnion(params: OcidDateRequest): Promise<Union> {
    return this.http.get<Union>(
      `${MapleStoryUnionClient.BASE}/user/union`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      UNION_SHAPE,
    );
  }

  /**
   * 유니온 공격대 배치(블록 위치, 공격대원 효과, 공격대 점령 효과, 프리셋)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 2023-12-21부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @throws {NexonBadRequestError} 날짜 형식이 잘못되었거나 2023-12-21부터 어제까지의 범위를 벗어났을 때.
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
    return this.http.get<UnionRaider>(
      `${MapleStoryUnionClient.BASE}/user/union-raider`,
      { ocid: params.ocid, date: snapshotDate(params.date, SNAPSHOT) },
      UNION_RAIDER_SHAPE,
    );
  }

  /**
   * 유니온 아티팩트(효과 레벨과 크리스탈 옵션)를 조회한다.
   *
   * 2024년 01월 18일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 2024-01-18부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @throws {NexonBadRequestError} 날짜 형식이 잘못되었거나 2024-01-18부터 어제까지의 범위를 벗어났을 때.
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
    return this.http.get<UnionArtifact>(
      `${MapleStoryUnionClient.BASE}/user/union-artifact`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, {
          ...SNAPSHOT,
          firstDate: '2024-01-18',
          apiLabel: '유니온 아티팩트',
        }),
      },
      UNION_ARTIFACT_SHAPE,
    );
  }

  /**
   * 유니온 챔피언(챔피언 캐릭터·등급·휘장 효과)을 조회한다.
   *
   * 2025년 02월 20일 데이터부터 조회할 수 있습니다.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestory.getOcid('캐릭터명')` 으로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 2025-02-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @throws {NexonBadRequestError} 날짜 형식이 잘못되었거나 2025-02-20부터 어제까지의 범위를 벗어났을 때.
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
    return this.http.get<UnionChampion>(
      `${MapleStoryUnionClient.BASE}/user/union-champion`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, {
          ...SNAPSHOT,
          firstDate: '2025-02-20',
          apiLabel: '유니온 챔피언',
        }),
      },
      UNION_CHAMPION_SHAPE,
    );
  }
}
