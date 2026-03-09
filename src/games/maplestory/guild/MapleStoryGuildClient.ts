import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { GuildIdDateRequest } from '../../_base/maple-base-types.js';
import { GUILD_ID_SHAPE, GUILD_BASIC_SHAPE } from '../shapes.js';
import type { GuildBasic, WorldName } from './types.js';

/**
 * 메이플스토리 길드 API 클라이언트.
 *
 * @example
 * ```ts
 * const guildId = await client.maplestory.guild.getId('길드명', '스카니아');
 * const basic = await client.maplestory.guild.getBasic({ oguild_id: guildId });
 * ```
 */
export class MapleStoryGuildClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 길드명과 월드명으로 길드 식별자(oguild_id)를 조회한다.
   *
   * @param guildName - 길드 명
   * @param worldName - 월드 명
   *
   * @throws {NexonNotFoundError} 길드를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const guildId = await client.maplestory.guild.getId('아르테미스', '스카니아');
   * ```
   *
   */
  async getId(guildName: string, worldName: WorldName | (string & {})): Promise<GuildId> {
    const response = await this.http.get<{ oguild_id: string }>(
      `${MapleStoryGuildClient.BASE}/guild/id`,
      { guild_name: guildName, world_name: worldName },
      GUILD_ID_SHAPE,
    );
    return response.oguild_id as GuildId;
  }

  /**
   * 길드 기본 정보를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.oguild_id - 길드 식별자
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD). 생략 시 전일
   *
   * @example
   * ```ts
   * const basic = await client.maplestory.guild.getBasic({ oguild_id: guildId });
   * console.log(`${basic.guild_name} Lv.${basic.guild_level} (${basic.guild_member_count}명)`);
   * ```
   *
   */
  async getBasic(params: GuildIdDateRequest): Promise<GuildBasic> {
    return this.http.get<GuildBasic>(
      `${MapleStoryGuildClient.BASE}/guild/basic`,
      { oguild_id: params.oguild_id, date: params.date as string | undefined },
      GUILD_BASIC_SHAPE,
    );
  }
}
