import { assertDateInRange, assertNonEmptyString } from '../../core/validation/input.js';
import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStoryTWCharacterClient } from './character/MapleStoryTWCharacterClient.js';
import { MapleStoryTWGuildClient } from './guild/MapleStoryTWGuildClient.js';
import { OCID_SHAPE } from './shapes.js';
import type { TWDate, TWOcidResponse } from './types.js';
import { MapleStoryTWUnionClient } from './union/MapleStoryTWUnionClient.js';

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
   * @throws {NexonBadRequestError} The character name is blank.
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
    assertNonEmptyString(
      characterName,
      'characterName',
      'Enter a MapleStory Taiwan character name.',
    );
    const response = await this.http.get<TWOcidResponse>(
      this.buildUrl('id'),
      { character_name: characterName },
      OCID_SHAPE,
    );
    return response.ocid;
  }

  private formatQueryDate(date: TWDate | undefined, availableFrom: string): string | undefined {
    if (date === undefined) return undefined;

    const formatted = this.formatDate(date);
    const today = this.formatDate('today');
    assertDateInRange(formatted, availableFrom, today, 'Use a date in Taiwan time.');
    return formatted;
  }
}
