import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { OcidDateRequest } from '../../_base/maple-base-types.js';
import type {
  SEAUnion,
  SEAUnionRaider,
  SEAUnionArtifact,
  SEAUnionChampion,
} from './types.js';

/**
 * MapleStory SEA Union API client.
 *
 * Data available starting from April 20, 2025.
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
   * Retrieve Union information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getUnion(params: OcidDateRequest): Promise<SEAUnion> {
    return this.http.get<SEAUnion>(
      `${MapleStorySEAUnionClient.BASE}/user/union`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/user/union-raider ───────────────────────────

  /**
   * Retrieve Union Raider information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getRaider(params: OcidDateRequest): Promise<SEAUnionRaider> {
    return this.http.get<SEAUnionRaider>(
      `${MapleStorySEAUnionClient.BASE}/user/union-raider`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/user/union-artifact ─────────────────────────

  /**
   * Retrieve Union Artifact information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getArtifact(params: OcidDateRequest): Promise<SEAUnionArtifact> {
    return this.http.get<SEAUnionArtifact>(
      `${MapleStorySEAUnionClient.BASE}/user/union-artifact`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }

  // ─── GET /maplestorysea/v1/user/union-champion ─────────────────────────

  /**
   * Retrieve Union Champion information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getChampion(params: OcidDateRequest): Promise<SEAUnionChampion> {
    return this.http.get<SEAUnionChampion>(
      `${MapleStorySEAUnionClient.BASE}/user/union-champion`,
      { ocid: params.ocid, date: params.date as string | undefined },
    );
  }
}
