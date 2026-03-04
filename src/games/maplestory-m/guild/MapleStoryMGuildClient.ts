import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildIdDateRequest } from '../../_base/maple-base-types.js';
import { M_GUILD_ID_SHAPE, M_GUILD_BASIC_SHAPE } from '../shapes.js';
import type { GuildId } from '../../../core/types/branded.js';
import type { MGuildIdResponse, MGuildBasic, MWorldName } from './types.js';

/**
 * 메이플스토리M 길드 API 클라이언트.
 *
 * @example
 * ```ts
 * const guildId = await client.maplestorym.guild.getId('스카니아', '길드명');
 * const basic = await client.maplestorym.guild.getBasic({ oguild_id: guildId });
 * ```
 */
export class MapleStoryMGuildClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorym/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 길드 식별자(oguild_id)를 조회한다.
   *
   * @param worldName - 월드 명
   * @param guildName - 길드 명
   *
   * @example
   * ```ts
   * const guildId = await client.maplestorym.guild.getId('스카니아', '길드명');
   * ```
   */
  async getId(worldName: MWorldName, guildName: string): Promise<GuildId> {
    const response = await this.http.get<MGuildIdResponse>(
      `${MapleStoryMGuildClient.BASE}/guild/id`,
      { world_name: worldName as string, guild_name: guildName },
      M_GUILD_ID_SHAPE,
    );
    return response.oguild_id;
  }

  /**
   * 길드 기본 정보를 조회한다.
   *
   * @example
   * ```ts
   * const basic = await client.maplestorym.guild.getBasic({ oguild_id: guildId });
   * console.log(`${basic.guild_name} Lv.${basic.guild_level} (${basic.guild_member_count}명)`);
   * ```
   */
  async getBasic(params: GuildIdDateRequest): Promise<MGuildBasic> {
    return this.http.get<MGuildBasic>(
      `${MapleStoryMGuildClient.BASE}/guild/basic`,
      {
        oguild_id: params.oguild_id,
        date: params.date as string | undefined,
      },
      M_GUILD_BASIC_SHAPE,
    );
  }
}
