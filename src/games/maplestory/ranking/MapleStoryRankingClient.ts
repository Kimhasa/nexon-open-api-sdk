import type { HttpClient } from '../../../core/http/HttpClient.js';
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

/**
 * 메이플스토리 랭킹 API 클라이언트.
 *
 * 모든 랭킹 정보는 최근 2년 데이터만 조회 가능합니다.
 *
 * @example
 * ```ts
 * const overall = await client.maplestory.ranking.getOverall({ date: '2024-01-01' });
 * const union = await client.maplestory.ranking.getUnion({ date: '2024-01-01' });
 * ```
 */
export class MapleStoryRankingClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestory/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 종합 랭킹 정보를 조회한다.
   *
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD)
   * @param params.world_name - 월드 명 (선택)
   * @param params.world_type - 월드 타입 (0: 일반, 1: 에오스/핼리오스). world_name 입력 시 미반영
   * @param params.class - 직업 및 전직 (선택)
   * @param params.ocid - 특정 캐릭터 랭킹 조회 시 (선택)
   * @param params.page - 페이지 번호 (선택)
   *
   * @example
   * ```ts
   * const overall = await client.maplestory.ranking.getOverall({ date: '2024-01-01' });
   * for (const r of overall.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} Lv.${r.character_level}`);
   * }
   * ```
   *
   */
  async getOverall(params: OverallRankingRequest): Promise<OverallRanking> {
    return this.http.get<OverallRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/overall`,
      {
        date: params.date as string,
        world_name: params.world_name,
        world_type: params.world_type,
        class: params.class,
        ocid: params.ocid,
        page: params.page,
      },
    );
  }

  /**
   * 유니온 랭킹 정보를 조회한다.
   *
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD)
   * @param params.world_name - 월드 명 (선택)
   * @param params.ocid - 특정 캐릭터 랭킹 조회 시 (선택)
   * @param params.page - 페이지 번호 (선택)
   *
   * @example
   * ```ts
   * const union = await client.maplestory.ranking.getUnion({ date: '2024-01-01' });
   * for (const r of union.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 유니온Lv.${r.union_level}`);
   * }
   * ```
   *
   */
  async getUnion(params: UnionRankingRequest): Promise<UnionRanking> {
    return this.http.get<UnionRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/union`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
    );
  }

  /**
   * 길드 랭킹 정보를 조회한다.
   *
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD)
   * @param params.world_name - 월드 명 (선택)
   * @param params.ranking_type - 랭킹 타입 (0: 주간 명성치, 1: 플래그 레이스, 2: 지하 수로)
   * @param params.guild_name - 길드 명 (선택)
   * @param params.page - 페이지 번호 (선택)
   *
   * @example
   * ```ts
   * const guild = await client.maplestory.ranking.getGuild({ date: '2024-01-01' });
   * for (const r of guild.ranking) {
   *   console.log(`#${r.ranking} ${r.guild_name} Lv.${r.guild_level}`);
   * }
   * ```
   *
   */
  async getGuild(params: GuildRankingRequest): Promise<GuildRanking> {
    return this.http.get<GuildRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/guild`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ranking_type: params.ranking_type,
        guild_name: params.guild_name,
        ocid: params.ocid,
        page: params.page,
      },
    );
  }

  /**
   * 무릉도장 랭킹 정보를 조회한다.
   *
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD)
   * @param params.world_name - 월드 명 (선택)
   * @param params.difficulty - 구간 (0: 일반, 1: 통달)
   * @param params.class - 직업 및 전직 (선택)
   * @param params.ocid - 특정 캐릭터 랭킹 조회 시 (선택)
   * @param params.page - 페이지 번호 (선택)
   *
   * @example
   * ```ts
   * const dojang = await client.maplestory.ranking.getDojang({ date: '2024-01-01' });
   * for (const r of dojang.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.dojang_floor}층 (${r.dojang_time_record}초)`);
   * }
   * ```
   *
   */
  async getDojang(params: DojangRankingRequest): Promise<DojangRanking> {
    return this.http.get<DojangRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/dojang`,
      {
        date: params.date as string,
        world_name: params.world_name,
        difficulty: params.difficulty,
        class: params.class,
        ocid: params.ocid,
        page: params.page,
      },
    );
  }

  /**
   * 더 시드 랭킹 정보를 조회한다.
   *
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD)
   * @param params.world_name - 월드 명 (선택)
   * @param params.ocid - 특정 캐릭터 랭킹 조회 시 (선택)
   * @param params.page - 페이지 번호 (선택)
   *
   * @example
   * ```ts
   * const seed = await client.maplestory.ranking.getTheSeed({ date: '2024-01-01' });
   * for (const r of seed.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.theseed_floor}층 (${r.theseed_time_record}초)`);
   * }
   * ```
   *
   */
  async getTheSeed(params: TheSeedRankingRequest): Promise<TheSeedRanking> {
    return this.http.get<TheSeedRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/theseed`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
    );
  }

  /**
   * 업적 랭킹 정보를 조회한다.
   *
   * @param params.date - 조회 기준일 (KST, YYYY-MM-DD)
   * @param params.ocid - 특정 캐릭터 랭킹 조회 시 (선택)
   * @param params.page - 페이지 번호 (선택)
   *
   * @example
   * ```ts
   * const achievement = await client.maplestory.ranking.getAchievement({ date: '2024-01-01' });
   * for (const r of achievement.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.trophy_grade} (${r.trophy_score}점)`);
   * }
   * ```
   *
   */
  async getAchievement(params: RankingBaseRequest): Promise<AchievementRanking> {
    return this.http.get<AchievementRanking>(
      `${MapleStoryRankingClient.BASE}/ranking/achievement`,
      {
        date: params.date as string,
        ocid: params.ocid,
        page: params.page,
      },
    );
  }
}
