import { assertNonEmptyString, assertOneOf } from '../../../core/validation/input.js';
import { lookupByName, requireFoundId } from '../../../core/errors/name-lookup.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { GuildId } from '../../_base/maple-base-types.js';
import type { TWFormatQueryDate } from '../query-params.js';
import { GUILD_ID_SHAPE, GUILD_BASIC_SHAPE } from '../shapes.js';
import type { TWGuildIdDateRequest } from '../types.js';
import { TW_WORLD_NAMES } from './types.js';
import type { TWGuildIdResponse, TWGuildBasic, TWWorldName } from './types.js';

/** MapleStory Taiwan 길드(公會): 길드 이름과 월드 이름으로 길드 고유 번호를 받아 길드 정보를 조회한다. */
export class MapleStoryTWGuildClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorytw/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly formatDate: TWFormatQueryDate,
  ) {}

  /**
   * 길드 이름과 월드 이름으로 길드 고유 번호(oguild_id)를 받아 온다. 길드 정보를 조회할 때 이 값을 넣는다. 대만 명칭: 公會識別碼.
   *
   * @param guildName - 길드 이름
   * @param worldName - 길드가 있는 월드 이름 (예: '艾麗亞'). 포털에 있는 이름만 받는다
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
    const notFound = {
      message: `${worldName} 월드에서 '${guildName}' 길드를 찾을 수 없습니다.`,
      hint: '길드 이름과 월드 이름(艾麗亞 등)을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<TWGuildIdResponse>(
          `${MapleStoryTWGuildClient.BASE}/guild/id`,
          { guild_name: guildName, world_name: worldName },
          GUILD_ID_SHAPE,
        ),
      notFound,
    );
    return requireFoundId(response.oguild_id, notFound);
  }

  /**
   * 길드 기본 정보(레벨·길드 마스터·길드원 목록·길드 스킬)를 조회한다. 대만 명칭: 公會基本資訊.
   *
   * @param params.oguild_id - 길드 고유 번호. `client.maplestoryTW.guild.getId()` 로 얻는다
   * @param params.date - 조회 기준일 (대만 시간 UTC+8). 2025-10-15부터 어제까지 YYYY-MM-DD 문자열이나 Date를 받는다. 생략하면 최신 데이터(평균 15분 뒤 반영)를 조회한다. 지난 날짜는 다음날 오전 2시부터 조회할 수 있다.
   * @throws {NexonBadRequestError} Invalid input. The oguild_id is blank. The date is invalid or outside 2025-10-15 through yesterday in Taiwan time.
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
