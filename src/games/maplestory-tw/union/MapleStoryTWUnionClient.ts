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

/** MapleStory Taiwan Union API client. */
export class MapleStoryTWUnionClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorytw/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly formatDate: TWFormatQueryDate,
  ) {}

  /**
   * Retrieve Union level and grade.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-14 onward.
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.union.getUnion({ ocid });
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
   * Retrieve Union Raider member and grid occupation effects.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-14 onward.
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.union.getRaider({ ocid });
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
   * Retrieve Union Artifact information.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-14 onward.
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.union.getArtifact({ ocid });
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
   * Retrieve Union Champion information.
   *
   * @param params.ocid - Character identifier from getOcid().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-12-18 onward.
   * @throws {NexonBadRequestError} Invalid input. The ocid is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * const result = await client.maplestoryTW.union.getChampion({ ocid });
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
