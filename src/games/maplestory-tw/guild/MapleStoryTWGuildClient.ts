import { assertNonEmptyString, assertOneOf } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { TWFormatQueryDate } from '../query-params.js';
import { GUILD_ID_SHAPE, GUILD_BASIC_SHAPE } from '../shapes.js';
import type { TWGuildIdDateRequest } from '../types.js';
import { TW_WORLD_NAMES } from './types.js';
import type { TWGuildIdResponse, TWGuildBasic, TWWorldName } from './types.js';

/** MapleStory Taiwan Guild API client. */
export class MapleStoryTWGuildClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorytw/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly formatDate: TWFormatQueryDate,
  ) {}

  /**
   * Retrieve a guild identifier (oguild_id) by guild and world name.
   *
   * @param guildName - Guild name.
   * @param worldName - Taiwan world name as listed by the portal.
   * @throws {NexonBadRequestError} Invalid input. The guild name is blank. The world name is unsupported.
   * @throws {NexonNotFoundError} The guild was not found.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const guildId = await client.maplestoryTW.guild.getId('GuildName', '艾麗亞');
   * ```
   */
  async getId(guildName: string, worldName: TWWorldName): Promise<GuildId> {
    assertNonEmptyString(guildName, 'guildName', 'Enter a MapleStory Taiwan guild name.');
    assertOneOf(worldName, TW_WORLD_NAMES, 'worldName');
    const response = await this.http.get<TWGuildIdResponse>(
      `${MapleStoryTWGuildClient.BASE}/guild/id`,
      { guild_name: guildName, world_name: worldName },
      GUILD_ID_SHAPE,
    );
    return response.oguild_id;
  }

  /**
   * Retrieve basic guild information.
   *
   * @param params.oguild_id - Guild identifier from guild.getId().
   * @param params.date - Optional snapshot date in Taiwan time, from 2025-10-15 onward.
   * @throws {NexonBadRequestError} Invalid input. The oguild_id is blank. The date is invalid or outside the available range.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const guildId = await client.maplestoryTW.guild.getId('GuildName', '艾麗亞');
   * const result = await client.maplestoryTW.guild.getBasic({ oguild_id: guildId });
   * ```
   */
  async getBasic(params: TWGuildIdDateRequest): Promise<TWGuildBasic> {
    assertNonEmptyString(
      params.oguild_id,
      'oguild_id',
      'Use the identifier returned by guild.getId().',
    );
    const query = { oguild_id: params.oguild_id, date: this.formatDate(params.date, '2025-10-15') };
    return this.http.get<TWGuildBasic>(
      `${MapleStoryTWGuildClient.BASE}/guild/basic`,
      query,
      GUILD_BASIC_SHAPE,
    );
  }
}
