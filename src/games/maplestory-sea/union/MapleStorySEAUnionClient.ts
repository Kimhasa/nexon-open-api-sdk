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
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.union.getUnion({ ocid });
   * ```
   */
  async getUnion(params: OcidDateRequest): Promise<SEAUnion> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnion>(
      `${MapleStorySEAUnionClient.BASE}/user/union`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
      },
      SEA_UNION_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/user/union-raider ───────────────────────────

  /**
   * Retrieve Union Raider information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.union.getRaider({ ocid });
   * ```
   */
  async getRaider(params: OcidDateRequest): Promise<SEAUnionRaider> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnionRaider>(
      `${MapleStorySEAUnionClient.BASE}/user/union-raider`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
      },
      SEA_UNION_RAIDER_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/user/union-artifact ─────────────────────────

  /**
   * Retrieve Union Artifact information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.union.getArtifact({ ocid });
   * ```
   */
  async getArtifact(params: OcidDateRequest): Promise<SEAUnionArtifact> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnionArtifact>(
      `${MapleStorySEAUnionClient.BASE}/user/union-artifact`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
      },
      SEA_UNION_ARTIFACT_SHAPE,
    );
  }

  // ─── GET /maplestorysea/v1/user/union-champion ─────────────────────────

  /**
   * Retrieve Union Champion information.
   *
   * @param params.ocid - Character identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.union.getChampion({ ocid });
   * ```
   */
  async getChampion(params: OcidDateRequest): Promise<SEAUnionChampion> {
    assertNonEmptyString(params.ocid, 'ocid', undefined, 'trim-truthy');
    return this.http.get<SEAUnionChampion>(
      `${MapleStorySEAUnionClient.BASE}/user/union-champion`,
      {
        ocid: params.ocid,
        date: params.date as string | undefined,
      },
      SEA_UNION_CHAMPION_SHAPE,
    );
  }
}
