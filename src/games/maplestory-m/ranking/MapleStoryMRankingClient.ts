import type { HttpClient } from '../../../core/http/HttpClient.js';
import { M_RANKING_SHAPE } from '../shapes.js';
import type {
  MLevelRanking,
  MLevelRankingRequest,
  MDojangRanking,
  MDojangRankingRequest,
  MRootOfTimeRanking,
  MRootOfTimeRankingRequest,
  MUnionRanking,
  MUnionRankingRequest,
  MCombatPowerRanking,
  MCombatPowerRankingRequest,
  MKerningMTowerRanking,
  MKerningMTowerRankingRequest,
  MAchievementRanking,
  MAchievementRankingRequest,
  MSharenianBattlefieldRanking,
  MSharenianBattlefieldRankingRequest,
  MSharenianWaterwayRanking,
  MSharenianWaterwayRankingRequest,
} from './types.js';

/**
 * 메이플스토리M 랭킹 API 클라이언트.
 *
 * @example
 * ```ts
 * const level = await client.maplestorym.ranking.getLevel({ date: '2024-01-01' });
 * const dojang = await client.maplestorym.ranking.getDojang({ date: '2024-01-01' });
 * ```
 */
export class MapleStoryMRankingClient {
  private static readonly BASE = 'https://open.api.nexon.com/maplestorym/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 레벨 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const level = await client.maplestorym.ranking.getLevel({ date: '2024-01-01' });
   * for (const r of level.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} Lv.${r.character_level}`);
   * }
   * ```
   */
  async getLevel(params: MLevelRankingRequest): Promise<MLevelRanking> {
    return this.http.get<MLevelRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/level`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 무릉도장 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const dojang = await client.maplestorym.ranking.getDojang({ date: '2024-01-01' });
   * for (const r of dojang.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.dojang_floor}층`);
   * }
   * ```
   */
  async getDojang(params: MDojangRankingRequest): Promise<MDojangRanking> {
    return this.http.get<MDojangRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/dojang`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 시간의 근원 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const rot = await client.maplestorym.ranking.getRootOfTime({ date: '2024-01-01' });
   * for (const r of rot.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 최대데미지:${r.max_damage}`);
   * }
   * ```
   */
  async getRootOfTime(params: MRootOfTimeRankingRequest): Promise<MRootOfTimeRanking> {
    return this.http.get<MRootOfTimeRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/root-of-time`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 유니온 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const union = await client.maplestorym.ranking.getUnion({ date: '2024-01-01' });
   * for (const r of union.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 유니온Lv.${r.union_level}`);
   * }
   * ```
   */
  async getUnion(params: MUnionRankingRequest): Promise<MUnionRanking> {
    return this.http.get<MUnionRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/union`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 전투력 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const cp = await client.maplestorym.ranking.getCombatPower({ date: '2024-01-01' });
   * for (const r of cp.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 전투력:${r.character_combat_power}`);
   * }
   * ```
   */
  async getCombatPower(params: MCombatPowerRankingRequest): Promise<MCombatPowerRanking> {
    return this.http.get<MCombatPowerRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/combat-power`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 커닝M타워 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const tower = await client.maplestorym.ranking.getKerningMTower({ date: '2024-01-01' });
   * for (const r of tower.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.tower_floor}층`);
   * }
   * ```
   */
  async getKerningMTower(params: MKerningMTowerRankingRequest): Promise<MKerningMTowerRanking> {
    return this.http.get<MKerningMTowerRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/kerning-m-tower`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 업적 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const achievement = await client.maplestorym.ranking.getAchievement({ date: '2024-01-01' });
   * for (const r of achievement.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.achievement_grade_name} ${r.achievement_score}점`);
   * }
   * ```
   */
  async getAchievement(params: MAchievementRankingRequest): Promise<MAchievementRanking> {
    return this.http.get<MAchievementRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/achievement`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 샤레니안의 전장 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const bf = await client.maplestorym.ranking.getSharenianBattlefield({ date: '2024-01-01' });
   * for (const r of bf.ranking) {
   *   console.log(`#${r.ranking} ${r.guild_name} ${r.season_score}점`);
   * }
   * ```
   */
  async getSharenianBattlefield(
    params: MSharenianBattlefieldRankingRequest,
  ): Promise<MSharenianBattlefieldRanking> {
    return this.http.get<MSharenianBattlefieldRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/sharenian-battlefield`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  /**
   * 샤레니안의 지하수로 랭킹 정보를 조회한다.
   *
   * @example
   * ```ts
   * const ww = await client.maplestorym.ranking.getSharenianWaterway({ date: '2024-01-01' });
   * for (const r of ww.ranking) {
   *   console.log(`#${r.ranking} ${r.guild_name} ${r.season_score}점`);
   * }
   * ```
   */
  async getSharenianWaterway(
    params: MSharenianWaterwayRankingRequest,
  ): Promise<MSharenianWaterwayRanking> {
    return this.http.get<MSharenianWaterwayRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/sharenian-waterway`,
      {
        date: params.date as string,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }
}
