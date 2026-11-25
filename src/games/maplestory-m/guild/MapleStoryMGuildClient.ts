import { assertNonEmptyString } from '../../../core/validation/input.js';
import { lookupByName, requireFoundId } from '../../../core/errors/name-lookup.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { MGuildIdRequest } from '../types.js';
import { M_GUILD_ID_SHAPE, M_GUILD_BASIC_SHAPE } from '../shapes.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { MGuildIdResponse, MGuildBasic, MWorldName } from './types.js';

/**
 * 메이플스토리M 길드: 월드 이름과 길드 이름으로 길드 식별자를 받아 길드 정보를 조회합니다.
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
   * 월드 이름과 길드 이름으로 길드 식별자(oguild_id)를 받아 온다.
   *
   * @param worldName - 길드가 있는 월드 이름 (예: '스카니아')
   * @param guildName - 길드 이름
   *
   * @throws {NexonBadRequestError} 월드명이나 길드명이 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const guildId = await client.maplestorym.guild.getId('스카니아', '길드명');
   * ```
   */
  async getId(worldName: MWorldName, guildName: string): Promise<GuildId> {
    assertNonEmptyString(worldName, 'worldName', '스카니아 등 길드가 속한 월드명을 입력하세요.');
    assertNonEmptyString(guildName, 'guildName', '조회할 길드명을 입력하세요.');
    const notFound = {
      message: `${worldName} 월드에서 '${guildName}' 길드를 찾을 수 없습니다.`,
      hint: "월드 이름과 길드 이름을 확인하세요. 월드를 먼저 넣습니다: guild.getId('스카니아', '길드명')",
    };
    const response = await lookupByName(
      () =>
        this.http.get<MGuildIdResponse>(
          `${MapleStoryMGuildClient.BASE}/guild/id`,
          { world_name: worldName, guild_name: guildName },
          M_GUILD_ID_SHAPE,
        ),
      notFound,
    );
    return requireFoundId(response.oguild_id, notFound);
  }

  /**
   * 길드 기본 정보(레벨·길드 마스터·길드원별 레벨과 활동량·길드 스킬·시설물)를 조회한다.
   *
   * @param params.oguild_id - 길드 식별자. `client.maplestorym.guild.getId()` 로 얻는다
   * @throws {NexonBadRequestError} 길드 식별자가 비어 있을 때
   * @throws {NexonError} NEXON Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const guildId = await client.maplestorym.guild.getId('스카니아', '길드명');
   *
   * const basic = await client.maplestorym.guild.getBasic({ oguild_id: guildId });
   * console.log(`${basic.guild_name} Lv.${basic.guild_level} (${basic.guild_member_count}명)`);
   * ```
   */
  async getBasic(params: MGuildIdRequest): Promise<MGuildBasic> {
    assertNonEmptyString(
      params.oguild_id,
      'oguild_id',
      'guild.getId()로 길드 식별자를 조회하세요.',
    );
    return this.http.get<MGuildBasic>(
      `${MapleStoryMGuildClient.BASE}/guild/basic`,
      { oguild_id: params.oguild_id },
      M_GUILD_BASIC_SHAPE,
    );
  }
}
