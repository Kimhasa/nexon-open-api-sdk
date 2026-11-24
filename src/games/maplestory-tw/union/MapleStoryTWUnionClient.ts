import type { HttpClient } from '../../../core/http/HttpClient.js';
import { ocidDateParams } from '../query-params.js';
import type { TWFormatQueryDate } from '../query-params.js';
import {
  USER_UNION_SHAPE,
  USER_UNION_RAIDER_SHAPE,
  USER_UNION_ARTIFACT_SHAPE,
  USER_UNION_CHAMPION_SHAPE,
} from '../shapes.js';
import type { TWOcidDateRequest } from '../types.js';
import type { TWUnion, TWUnionRaider, TWUnionArtifact, TWUnionChampion } from './types.js';

const FIRST_SNAPSHOT_DATE = '2025-10-14';

/** MapleStory Taiwan 유니온(戰地): 레벨·등급, 공격대 배치, 아티팩트, 챔피언. 2025-10-14 데이터부터 있다 (챔피언은 2025-12-18부터). */
export class MapleStoryTWUnionClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorytw/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly formatDate: TWFormatQueryDate,
  ) {}

  /**
   * 유니온 레벨·등급과 아티팩트 레벨·포인트를 조회한다. 대만 명칭: 戰地.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-14 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const union = await client.maplestoryTW.union.getUnion({ ocid });
   * console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
   * ```
   */
  async getUnion(params: TWOcidDateRequest): Promise<TWUnion> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWUnion>(
      `${MapleStoryTWUnionClient.BASE}/user/union`,
      query,
      USER_UNION_SHAPE,
    );
  }

  /**
   * 유니온 공격대 배치(블록 위치, 공격대원 효과, 공격대 점령 효과, 프리셋)를 조회한다. 대만 명칭: 戰地攻擊隊.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-14 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const raider = await client.maplestoryTW.union.getRaider({ ocid });
   * console.log(`프리셋 ${raider.use_preset_no} 사용 중`);
   * for (const stat of raider.union_raider_stat) {
   *   console.log(stat);
   * }
   * ```
   */
  async getRaider(params: TWOcidDateRequest): Promise<TWUnionRaider> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWUnionRaider>(
      `${MapleStoryTWUnionClient.BASE}/user/union-raider`,
      query,
      USER_UNION_RAIDER_SHAPE,
    );
  }

  /**
   * 유니온 아티팩트(효과 레벨과 크리스탈 옵션)를 조회한다. 대만 명칭: 戰地神器.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-10-14 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const artifact = await client.maplestoryTW.union.getArtifact({ ocid });
   * for (const effect of artifact.union_artifact_effect) {
   *   console.log(`${effect.name} Lv.${effect.level}`);
   * }
   * ```
   */
  async getArtifact(params: TWOcidDateRequest): Promise<TWUnionArtifact> {
    const query = ocidDateParams(params, this.formatDate, FIRST_SNAPSHOT_DATE);
    return this.http.get<TWUnionArtifact>(
      `${MapleStoryTWUnionClient.BASE}/user/union-artifact`,
      query,
      USER_UNION_ARTIFACT_SHAPE,
    );
  }

  /**
   * 유니온 챔피언(챔피언 캐릭터·등급·휘장 효과)을 조회한다. 대만 명칭: 聯盟冠軍.
   *
   * @param params.ocid - 캐릭터 고유 번호(OCID). `client.maplestoryTW.getOcid('CharacterName')` 으로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 'YYYY-MM-DD' 문자열, Date, 'today' 를 받는다. 2025-12-18 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const champion = await client.maplestoryTW.union.getChampion({ ocid });
   * for (const c of champion.union_champion) {
   *   console.log(`${c.champion_name} (${c.champion_class}) - ${c.champion_grade}`);
   * }
   * ```
   */
  async getChampion(params: TWOcidDateRequest): Promise<TWUnionChampion> {
    const query = ocidDateParams(params, this.formatDate, '2025-12-18');
    return this.http.get<TWUnionChampion>(
      `${MapleStoryTWUnionClient.BASE}/user/union-champion`,
      query,
      USER_UNION_CHAMPION_SHAPE,
    );
  }
}
