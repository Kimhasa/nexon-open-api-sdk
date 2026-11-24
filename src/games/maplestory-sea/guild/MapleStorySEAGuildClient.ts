import { assertNonEmptyString } from '../../../core/validation/input.js';
import { lookupByName, requireFoundId } from '../../../core/errors/name-lookup.js';
import { SEA_GUILD_ID_SHAPE, SEA_GUILD_BASIC_SHAPE } from '../shapes.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { GuildIdDateRequest } from '../../_base/maple-base-types.js';
import type { SEAGuildBasic } from './types.js';

/**
 * MapleStory SEA 길드: 길드 이름과 월드 이름으로 길드 고유 번호를 받아 길드 정보를 조회합니다.
 *
 * 2025년 4월 20일 데이터부터 조회할 수 있습니다.
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
   * 길드 이름과 월드 이름으로 길드 고유 번호(oguild_id)를 받아 온다. 길드 정보를 조회할 때 이 값을 넣는다. SEA 명칭: Guild identifier.
   *
   * @param guildName - 길드 이름
   * @param worldName - 길드가 있는 월드 이름 (예: 'Aquila')
   * @throws {NexonNotFoundError} Guild not found
   * @throws {NexonAuthError} Invalid API key
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const result = await client.maplestorySEA.guild.getId('GuildName', 'Aquila');
   * ```
   */
  async getId(guildName: string, worldName: string): Promise<GuildId> {
    assertNonEmptyString(guildName, 'guildName', undefined, 'trim-truthy');
    assertNonEmptyString(worldName, 'worldName', undefined, 'trim-truthy');
    const notFound = {
      message: `${worldName} 월드에서 '${guildName}' 길드를 찾을 수 없습니다.`,
      hint: '길드 이름과 월드 이름(Aquila 등)을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ oguild_id: string | null }>(
          `${MapleStorySEAGuildClient.BASE}/guild/id`,
          { guild_name: guildName, world_name: worldName },
          SEA_GUILD_ID_SHAPE,
        ),
      notFound,
    );
    return requireFoundId(response.oguild_id, notFound) as GuildId;
  }

  // ─── GET /maplestorysea/v1/guild/basic ──────────────────────────────────

  /**
   * 길드 기본 정보(레벨·길드 마스터·길드원 목록·길드 스킬)를 조회한다. SEA 명칭: Guild basic information.
   *
   * @param params.oguild_id - 길드 고유 번호. `client.maplestorySEA.guild.getId()` 로 얻는다
   * @param params.date - 조회 기준일 (싱가포르 시간 UTC+8, YYYY-MM-DD). 2025-04-20 데이터부터 있다. 생략하면 가장 최근 데이터(약 15분 뒤 반영). 날짜를 넣으면 그날 하루치이며, 지난 날짜는 다음날 오전 2시(UTC+8)부터 조회할 수 있다
   *
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const guildId = await client.maplestorySEA.guild.getId('GuildName', 'Aquila');
   * const result = await client.maplestorySEA.guild.getBasic({ oguild_id: guildId });
   * ```
   */
  async getBasic(params: GuildIdDateRequest): Promise<SEAGuildBasic> {
    assertNonEmptyString(params.oguild_id, 'oguild_id', undefined, 'trim-truthy');
    return this.http.get<SEAGuildBasic>(
      `${MapleStorySEAGuildClient.BASE}/guild/basic`,
      {
        oguild_id: params.oguild_id,
        date: params.date as string | undefined,
      },
      SEA_GUILD_BASIC_SHAPE,
    );
  }
}
