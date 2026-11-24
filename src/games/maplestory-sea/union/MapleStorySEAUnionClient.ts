import { UTC_PLUS_8_OFFSET_MINUTES, snapshotDate } from '../../_base/maple-date.js';
import { assertNonEmptyString } from '../../../core/validation/input.js';
import {
  SEA_UNION_SHAPE,
  SEA_UNION_RAIDER_SHAPE,
  SEA_UNION_ARTIFACT_SHAPE,
  SEA_UNION_CHAMPION_SHAPE,
} from '../shapes.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import type { SEAUnion, SEAUnionRaider, SEAUnionArtifact, SEAUnionChampion } from './types.js';

const SNAPSHOT = {
  firstDate: '2025-04-20',
  timezoneOffset: UTC_PLUS_8_OFFSET_MINUTES,
  language: 'en',
  apiLabel: 'Union',
} as const;

/**
 * MapleStory SEA 유니온(Union): 레벨·등급, 공격대 배치, 아티팩트, 챔피언.
 *
 * 2025년 4월 20일 데이터부터 조회할 수 있습니다 (유니온 챔피언은 2025년 12월 18일부터).
 *
 * @example
 * ```ts
 * const ocid = await client.maplestorySEA.getOcid('CharacterName');
 * const union = await client.maplestorySEA.union.getUnion({ ocid });
 * const raider = await client.maplestorySEA.union.getRaider({ ocid });
 * ```
 */
export class MapleStorySEAUnionClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorysea/v1';

  constructor(private readonly http: HttpClient) {}

  // ─── GET /maplestorysea/v1/user/union ───────────────────────────────────

  /**
   * 유니온 레벨·등급과 아티팩트 레벨·포인트를 조회한다. SEA 명칭: Union.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const union = await client.maplestorySEA.union.getUnion({ ocid });
   * console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
   * ```
   */
  async getUnion(params: OcidDateRequest): Promise<SEAUnion> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnion>(
      `${MapleStorySEAUnionClient.BASE}/user/union`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, SNAPSHOT),
      },
      SEA_UNION_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/user/union-raider ───────────────────────────

  /**
   * 유니온 공격대 배치(블록 위치, 공격대원 효과, 공격대 점령 효과, 프리셋)를 조회한다. SEA 명칭: Union Raider.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const raider = await client.maplestorySEA.union.getRaider({ ocid });
   * console.log(`프리셋 ${raider.use_preset_no} 사용 중`);
   * for (const stat of raider.union_raider_stat) {
   *   console.log(stat);
   * }
   * ```
   */
  async getRaider(params: OcidDateRequest): Promise<SEAUnionRaider> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnionRaider>(
      `${MapleStorySEAUnionClient.BASE}/user/union-raider`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, SNAPSHOT),
      },
      SEA_UNION_RAIDER_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/user/union-artifact ─────────────────────────

  /**
   * 유니온 아티팩트(효과 레벨과 크리스탈 옵션)를 조회한다. SEA 명칭: Union Artifact.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-04-20 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const artifact = await client.maplestorySEA.union.getArtifact({ ocid });
   * for (const effect of artifact.union_artifact_effect) {
   *   console.log(`${effect.name} Lv.${effect.level}`);
   * }
   * ```
   */
  async getArtifact(params: OcidDateRequest): Promise<SEAUnionArtifact> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnionArtifact>(
      `${MapleStorySEAUnionClient.BASE}/user/union-artifact`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, SNAPSHOT),
      },
      SEA_UNION_ARTIFACT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/user/union-champion ─────────────────────────

  /**
   * 유니온 챔피언(챔피언 캐릭터·등급·휘장 효과)을 조회한다. SEA 명칭: Union Champion.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestorySEA.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-12-18부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank. Use a valid date from 2025-12-18 through yesterday in Singapore time.
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const champion = await client.maplestorySEA.union.getChampion({ ocid });
   * for (const c of champion.union_champion) {
   *   console.log(`${c.champion_name} (${c.champion_class}) - ${c.champion_grade}`);
   * }
   * ```
   */
  async getChampion(params: OcidDateRequest): Promise<SEAUnionChampion> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnionChampion>(
      `${MapleStorySEAUnionClient.BASE}/user/union-champion`,
      {
        ocid: params.ocid,
        date: snapshotDate(params.date, {
          ...SNAPSHOT,
          firstDate: '2025-12-18',
          apiLabel: 'Union Champion',
        }),
      },
      SEA_UNION_CHAMPION_SHAPE,
    );
  }
}
