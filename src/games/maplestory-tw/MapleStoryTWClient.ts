import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStoryTWCharacterClient } from './character/MapleStoryTWCharacterClient.js';
import { MapleStoryTWGuildClient } from './guild/MapleStoryTWGuildClient.js';
import { requireNonBlank } from './query-params.js';
import { OCID_SHAPE } from './shapes.js';
import type { TWDate, TWOcidResponse } from './types.js';
import { MapleStoryTWUnionClient } from './union/MapleStoryTWUnionClient.js';

const INVALID_DATE = "date must be a valid YYYY-MM-DD, Date, or 'today'.";

/**
 * MapleStory Taiwan API client.
 *
 * - Dates use Taiwan Standard Time (UTC+8).
 * - Character and guild data starts on October 15, 2025. Union data starts on
 *   October 14, 2025, and Union Champion data starts on December 18, 2025.
 * - Game updates take about 15 minutes to appear in the API.
 * - Historical data covers a local calendar day and is available after 2 AM
 *   the following day (TST).
 * - Character identifiers (OCIDs) can change when game content changes.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.maplestoryTW.getOcid('CharacterName');
 * const basic = await client.maplestoryTW.character.getBasic({ ocid });
 * ```
 */
export class MapleStoryTWClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestorytw';
  protected readonly timezoneOffset = 480; // UTC+8 (TST)

  private _character: MapleStoryTWCharacterClient | undefined;
  private _union: MapleStoryTWUnionClient | undefined;
  private _guild: MapleStoryTWGuildClient | undefined;

  /** Character API (20 endpoints). */
  get character(): MapleStoryTWCharacterClient {
    return (this._character ??= new MapleStoryTWCharacterClient(
      this.http,
      this.formatQueryDate.bind(this),
    ));
  }

  /** Union API (4 endpoints). */
  get union(): MapleStoryTWUnionClient {
    return (this._union ??= new MapleStoryTWUnionClient(
      this.http,
      this.formatQueryDate.bind(this),
    ));
  }

  /** Guild API (2 endpoints). */
  get guild(): MapleStoryTWGuildClient {
    return (this._guild ??= new MapleStoryTWGuildClient(
      this.http,
      this.formatQueryDate.bind(this),
    ));
  }

  /**
   * Retrieve the identifier (OCID) for a character.
   *
   * @param characterName - Character name to look up.
   * @throws {TypeError} The character name is blank.
   * @throws {NexonNotFoundError} The character was not found.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    requireNonBlank(characterName, 'characterName', 'Enter a MapleStory Taiwan character name.');
    const response = await this.http.get<TWOcidResponse>(
      this.buildUrl('id'),
      { character_name: characterName },
      OCID_SHAPE,
    );
    return response.ocid;
  }

  private formatQueryDate(date: TWDate | undefined, availableFrom: string): string | undefined {
    if (date === undefined) return undefined;

    let formatted: string;
    try {
      formatted = this.formatDate(date);
    } catch {
      throw new RangeError(INVALID_DATE);
    }

    // formatDate preserves calendar strings verbatim and Date can roll over invalid ISO days.
    const inputDay =
      typeof date === 'string' ? /^\s*(\d{4}-\d{2}-\d{2})(?!\d)/.exec(date)?.[1] : undefined;
    const day = inputDay ?? formatted;
    const parsed = new Date(`${day}T00:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) {
      throw new RangeError(INVALID_DATE);
    }

    const today = this.formatDate('today');
    if (formatted < availableFrom || formatted > today) {
      throw new RangeError(`date must be between ${availableFrom} and ${today} (Taiwan time).`);
    }
    return formatted;
  }
}
