import { KST_OFFSET_MINUTES, snapshotDate } from '../../_base/maple-date.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { GuildIdDateRequest } from '../../_base/maple-base-types.js';
import { GUILD_ID_SHAPE, GUILD_BASIC_SHAPE } from '../shapes.js';
import type { GuildBasic, WorldName } from './types.js';
import { lookupByName, requireFoundId } from '../../../core/errors/name-lookup.js';
import { assertNonEmptyString } from '../../../core/validation/input.js';

const SNAPSHOT = {
  firstDate: '2023-12-21',
  timezoneOffset: KST_OFFSET_MINUTES,
  apiLabel: '길드',
} as const;

/**
 * 메이플스토리 길드: 길드 이름으로 길드 고유 번호를 받아 길드 정보를 조회합니다.
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
   * 길드 이름과 월드 이름으로 길드 고유 번호(oguild_id)를 받아 온다. 길드 정보를 조회할 때 이 값을 넣는다.
   *
   * @param guildName - 길드 이름
   * @param worldName - 길드가 있는 월드 이름 (예: '스카니아')
   *
   * @throws {NexonNotFoundError} 길드를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const guildId = await client.maplestory.guild.getId('길드명', '스카니아');
   * ```
   *
   */
  async getId(guildName: string, worldName: WorldName | (string & {})): Promise<GuildId> {
    assertNonEmptyString(
      guildName,
      'guildName',
      "조회할 길드명을 넣으세요. 예: guild.getId('길드명', '스카니아')",
    );
    assertNonEmptyString(worldName, 'worldName', "길드가 있는 월드명을 넣으세요. 예: '스카니아'");
    const notFound = {
      message: `${worldName} 월드에서 '${guildName}' 길드를 찾을 수 없습니다.`,
      hint: '길드 이름과 월드 이름을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ oguild_id: string | null }>(
          `${MapleStoryGuildClient.BASE}/guild/id`,
          { guild_name: guildName, world_name: worldName },
          GUILD_ID_SHAPE,
        ),
      notFound,
    );
    return requireFoundId(response.oguild_id, notFound) as GuildId;
  }

  /**
   * 길드 기본 정보(레벨·명성치·길드 마스터·길드원 목록·길드 스킬·노블레스 스킬)를 조회한다.
   *
   * 2023년 12월 21일 데이터부터 조회할 수 있습니다.
   *
   * @param params.oguild_id - 길드 고유 번호. `client.maplestory.guild.getId()` 로 얻는다
   * @param params.date - 조회 기준일 (한국 시간, YYYY-MM-DD). 2023-12-21부터 어제까지. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @throws {NexonBadRequestError} 날짜 형식이 잘못되었거나 2023-12-21부터 어제까지의 범위를 벗어났을 때.
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
      { oguild_id: params.oguild_id, date: snapshotDate(params.date, SNAPSHOT) },
      GUILD_BASIC_SHAPE,
    );
  }
}
