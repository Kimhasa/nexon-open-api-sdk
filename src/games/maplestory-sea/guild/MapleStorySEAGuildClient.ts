import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { GuildIdDateRequest } from '../../_base/maple-base-types.js';
import type { SEAGuildBasic } from './types.js';

/**
 * MapleStory SEA Guild API client.
 *
 * Data available starting from April 20, 2025.
 *
 * @example
 * ```ts
 * const guildId = await client.maplestorySEA.guild.getId('GuildName', 'Aquila');
 * const basic = await client.maplestorySEA.guild.getBasic({ oguild_id: guildId });
 * ```
 */
export class MapleStorySEAGuildClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorysea/v1';

  constructor(private readonly http: HttpClient) {}

  // ─── GET /maplestorysea/v1/guild/id ─────────────────────────────────────

  /**
   * Retrieve guild identifier (oguild_id) information.
   *
   * @param guildName - Guild name
   * @param worldName - World name
   * @throws {NexonNotFoundError} Guild not found
   * @throws {NexonAuthError} Invalid API key
   */
  async getId(guildName: string, worldName: string): Promise<GuildId> {
    const response = await this.http.get<{ oguild_id: string }>(
      `${MapleStorySEAGuildClient.BASE}/guild/id`,
      { guild_name: guildName, world_name: worldName },
    );
    return response.oguild_id as GuildId;
  }

  // ─── GET /maplestorysea/v1/guild/basic ──────────────────────────────────

  /**
   * Retrieve basic guild information.
   *
   * @param params.oguild_id - Guild identifier
   * @param params.date - Query date (SGT, YYYY-MM-DD). Defaults to previous day
   */
  async getBasic(params: GuildIdDateRequest): Promise<SEAGuildBasic> {
    return this.http.get<SEAGuildBasic>(`${MapleStorySEAGuildClient.BASE}/guild/basic`, {
      oguild_id: params.oguild_id,
      date: params.date as string | undefined,
    });
  }
}
