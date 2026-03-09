import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStorySEACharacterClient } from './character/MapleStorySEACharacterClient.js';
import { MapleStorySEAUnionClient } from './union/MapleStorySEAUnionClient.js';
import { MapleStorySEAGuildClient } from './guild/MapleStorySEAGuildClient.js';

/**
 * MapleStory SEA 클라이언트.
 *
 * - 타임존: UTC+8 (SGT)
 * - 데이터 제공 시작일: 2025-04-20
 * - 전일 데이터 갱신 시각: 익일 오전 2시 (SGT)
 * - 게임 데이터 반영: 업데이트 후 약 15분 소요
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.maplestorySEA.getOcid('CharacterName');
 * const basic = await client.maplestorySEA.character.getBasic({ ocid });
 * const union = await client.maplestorySEA.union.getUnion({ ocid });
 * ```
 */
export class MapleStorySEAClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestorysea';
  protected readonly timezoneOffset = 480; // UTC+8 (SGT)

  private _character: MapleStorySEACharacterClient | undefined;
  private _union: MapleStorySEAUnionClient | undefined;
  private _guild: MapleStorySEAGuildClient | undefined;

  // ─── Sub-clients ────────────────────────────────────────────────────────

  /** Character API (19 endpoints) */
  get character(): MapleStorySEACharacterClient {
    this._character ??= new MapleStorySEACharacterClient(this.http);
    return this._character;
  }

  /** Union API (4 endpoints) */
  get union(): MapleStorySEAUnionClient {
    this._union ??= new MapleStorySEAUnionClient(this.http);
    return this._union;
  }

  /** Guild API (2 endpoints) */
  get guild(): MapleStorySEAGuildClient {
    this._guild ??= new MapleStorySEAGuildClient(this.http);
    return this._guild;
  }

  // ─── OCID ───────────────────────────────────────────────────────────────

  /**
   * Retrieve character identifier (ocid).
   *
   * GET /maplestorysea/v1/id
   *
   * @param characterName - Character name to look up
   * @throws {NexonNotFoundError} Character not found
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    const url = this.buildUrl('id');
    const response = await this.http.get<{ ocid: string }>(url, {
      character_name: characterName,
    });
    return response.ocid as OCID;
  }
}
