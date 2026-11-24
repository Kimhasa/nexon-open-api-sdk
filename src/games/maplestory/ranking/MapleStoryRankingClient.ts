import { assertRankingDate } from '../../_base/maple-date.js';
import { emitDeprecation } from '../../../core/deprecation/deprecation.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { RANKING_SHAPE } from '../shapes.js';
import type {
  AchievementRanking,
  DojangRanking,
  DojangRankingRequest,
  GuildRanking,
  GuildRankingRequest,
  OverallRanking,
  OverallRankingRequest,
  RankingBaseRequest,
  TheSeedRanking,
  TheSeedRankingRequest,
  UnionRanking,
  UnionRankingRequest,
} from './types.js';

const FIRST_RANKING_DATE = '2023-12-22';

/**
 * 메이플스토리 랭킹: 종합·유니온·길드·무릉도장·더 시드·업적.
 *
 * 2023년 12월 22일 데이터부터, 최근 2년 데이터만 조회할 수 있습니다.
 * 오늘 랭킹은 오전 9시 30분경부터 조회됩니다 (상황에 따라 더 늦을 수 있음).
 *
 * @example
 * ```ts
 * const overall = await client.maplestory.ranking.getOverall({ date: '2026-11-01' });
 * const union = await client.maplestory.ranking.getUnion({ date: '2026-11-01' });
 * ```
 */
export class MapleStoryRankingClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 종합 랭킹(레벨·경험치 순위)을 조회한다.
   *
   * @param params.date - 랭킹 기준일 (한국 시간, YYYY-MM-DD, 필수). 2023-12-22부터 오늘까지의 날짜 중 최근 2년 이내. 오늘의 랭킹은 집계가 끝난 뒤 조회할 수 있다.
   * @param params.world_name - 월드 이름 (선택, 예: '스카니아')
   * @param params.world_type - 월드 종류 (0: 일반 월드, 1: 에오스·핼리오스). `world_name` 을 넣으면 무시된다
   * @param params.class - 직업 및 전직 (선택, 예: '전사-히어로')
   * @param params.ocid - 특정 캐릭터의 순위만 볼 때 넣는 캐릭터 고유 번호 (선택)
   * @param params.page - 페이지 번호 (선택)
   * @throws {NexonBadRequestError} 랭킹 기준일이 빠졌거나 형식이 잘못되었거나, 최근 2년의 조회 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * const overall = await client.maplestory.ranking.getOverall({ date: '2026-11-01' });
   * for (const r of overall.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} Lv.${r.character_level}`);
   * }
   * ```
   *
   */
  async getOverall(params: OverallRankingRequest): Promise<OverallRanking> {
    assertRankingDate(params?.date, FIRST_RANKING_DATE);
    return this.http.get<OverallRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/overall`,
      {
        date: params.date,
        world_name: params.world_name,
        world_type: params.world_type,
        class: params.class,
        ocid: params.ocid,
        page: params.page,
      },
      RANKING_SHAPE,
    );
  }

  /**
   * 유니온 랭킹(유니온 레벨·유니온 파워 순위)을 조회한다.
   *
   * @param params.date - 랭킹 기준일 (한국 시간, YYYY-MM-DD, 필수). 2023-12-22부터 오늘까지의 날짜 중 최근 2년 이내. 오늘의 랭킹은 집계가 끝난 뒤 조회할 수 있다.
   * @param params.world_name - 월드 이름 (선택, 예: '스카니아')
   * @param params.ocid - 특정 캐릭터의 순위만 볼 때 넣는 캐릭터 고유 번호 (선택)
   * @param params.page - 페이지 번호 (선택)
   * @throws {NexonBadRequestError} 랭킹 기준일이 빠졌거나 형식이 잘못되었거나, 최근 2년의 조회 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * const union = await client.maplestory.ranking.getUnion({ date: '2026-11-01' });
   * for (const r of union.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 유니온Lv.${r.union_level}`);
   * }
   * ```
   *
   */
  async getUnion(params: UnionRankingRequest): Promise<UnionRanking> {
    assertRankingDate(params?.date, FIRST_RANKING_DATE);
    return this.http.get<UnionRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/union`,
      {
        date: params.date,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      RANKING_SHAPE,
    );
  }

  /**
   * 길드 랭킹(주간 명성치·플래그 레이스·지하 수로)을 조회한다.
   *
   * @param params.date - 랭킹 기준일 (한국 시간, YYYY-MM-DD, 필수). 2023-12-22부터 오늘까지의 날짜 중 최근 2년 이내. 오늘의 랭킹은 집계가 끝난 뒤 조회할 수 있다.
   * @param params.world_name - 월드 이름 (선택, 예: '스카니아')
   * @param params.ranking_type - 길드 랭킹 종류 (0: 주간 명성치, 1: 플래그 레이스, 2: 지하 수로)
   * @param params.guild_name - 길드 이름 (선택)
   * @param params.ocid - 지원 종료된 파라미터로, 입력 시 기존 호출 호환을 위해 경고만 출력합니다.
   * @param params.page - 페이지 번호 (선택)
   * @throws {NexonBadRequestError} 랭킹 기준일이 빠졌거나 형식이 잘못되었거나, 최근 2년의 조회 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * // 주간 명성치 기준 길드 순위표
   * const guild = await client.maplestory.ranking.getGuild({ date: '2026-11-01', ranking_type: 0 });
   * for (const r of guild.ranking) {
   *   console.log(`#${r.ranking} ${r.guild_name} Lv.${r.guild_level}`);
   * }
   * ```
   *
   */
  async getGuild(params: GuildRankingRequest): Promise<GuildRanking> {
    assertRankingDate(params?.date, FIRST_RANKING_DATE);
    if (params.ocid !== undefined) {
      emitDeprecation(
        'GuildRankingRequest.ocid',
        '길드 랭킹에서 ocid 지원이 종료되었습니다. 특정 길드는 guild_name으로 조회하세요.',
      );
    }
    return this.http.get<GuildRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/guild`,
      {
        date: params.date,
        world_name: params.world_name,
        ranking_type: params.ranking_type,
        guild_name: params.guild_name,
        page: params.page,
      },
      RANKING_SHAPE,
    );
  }

  /**
   * 무릉도장 랭킹(일반·통달 구간별 층수와 클리어 시간)을 조회한다.
   *
   * @param params.date - 랭킹 기준일 (한국 시간, YYYY-MM-DD, 필수). 2023-12-22부터 오늘까지의 날짜 중 최근 2년 이내. 오늘의 랭킹은 집계가 끝난 뒤 조회할 수 있다.
   * @param params.world_name - 월드 이름 (선택, 예: '스카니아')
   * @param params.difficulty - 무릉도장 구간 (0: 일반, 1: 통달)
   * @param params.class - 직업 및 전직 (선택, 예: '전사-히어로')
   * @param params.ocid - 특정 캐릭터의 순위만 볼 때 넣는 캐릭터 고유 번호 (선택)
   * @param params.page - 페이지 번호 (선택)
   * @throws {NexonBadRequestError} 랭킹 기준일이 빠졌거나 형식이 잘못되었거나, 최근 2년의 조회 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * // 통달 구간 무릉도장 순위표
   * const dojang = await client.maplestory.ranking.getDojang({ date: '2026-11-01', difficulty: 1 });
   * for (const r of dojang.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.dojang_floor}층 (${r.dojang_time_record}초)`);
   * }
   * ```
   *
   */
  async getDojang(params: DojangRankingRequest): Promise<DojangRanking> {
    assertRankingDate(params?.date, FIRST_RANKING_DATE);
    return this.http.get<DojangRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/dojang`,
      {
        date: params.date,
        world_name: params.world_name,
        difficulty: params.difficulty,
        class: params.class,
        ocid: params.ocid,
        page: params.page,
      },
      RANKING_SHAPE,
    );
  }

  /**
   * 더 시드 랭킹(도달 층과 클리어 시간)을 조회한다.
   *
   * @param params.date - 랭킹 기준일 (한국 시간, YYYY-MM-DD, 필수). 2023-12-22부터 오늘까지의 날짜 중 최근 2년 이내. 오늘의 랭킹은 집계가 끝난 뒤 조회할 수 있다.
   * @param params.world_name - 월드 이름 (선택, 예: '스카니아')
   * @param params.ocid - 특정 캐릭터의 순위만 볼 때 넣는 캐릭터 고유 번호 (선택)
   * @param params.page - 페이지 번호 (선택)
   * @throws {NexonBadRequestError} 랭킹 기준일이 빠졌거나 형식이 잘못되었거나, 최근 2년의 조회 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * const seed = await client.maplestory.ranking.getTheSeed({ date: '2026-11-01' });
   * for (const r of seed.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.theseed_floor}층 (${r.theseed_time_record}초)`);
   * }
   * ```
   *
   */
  async getTheSeed(params: TheSeedRankingRequest): Promise<TheSeedRanking> {
    assertRankingDate(params?.date, FIRST_RANKING_DATE);
    return this.http.get<TheSeedRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/theseed`,
      {
        date: params.date,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      RANKING_SHAPE,
    );
  }

  /**
   * 업적 랭킹(업적 등급·업적 점수)을 조회한다.
   *
   * @param params.date - 랭킹 기준일 (한국 시간, YYYY-MM-DD, 필수). 2023-12-22부터 오늘까지의 날짜 중 최근 2년 이내. 오늘의 랭킹은 집계가 끝난 뒤 조회할 수 있다.
   * @param params.ocid - 특정 캐릭터의 순위만 볼 때 넣는 캐릭터 고유 번호 (선택)
   * @param params.page - 페이지 번호 (선택)
   * @throws {NexonBadRequestError} 랭킹 기준일이 빠졌거나 형식이 잘못되었거나, 최근 2년의 조회 범위를 벗어났을 때.
   *
   * @example
   * ```ts
   * const achievement = await client.maplestory.ranking.getAchievement({ date: '2026-11-01' });
   * for (const r of achievement.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.trophy_grade} (${r.trophy_score}점)`);
   * }
   * ```
   *
   */
  async getAchievement(params: RankingBaseRequest): Promise<AchievementRanking> {
    assertRankingDate(params?.date, FIRST_RANKING_DATE);
    return this.http.get<AchievementRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/achievement`,
      {
        date: params.date,
        ocid: params.ocid,
        page: params.page,
      },
      RANKING_SHAPE,
    );
  }
}
