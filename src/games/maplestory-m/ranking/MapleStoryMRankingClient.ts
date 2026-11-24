import type { HttpClient } from '../../../core/http/HttpClient.js';
import { M_RANKING_SHAPE } from '../shapes.js';
import type {
  MRankingBaseRequest,
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
import { assertNonBlank } from '../validation.js';

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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const level = await client.maplestorym.ranking.getLevel({ date: '2026-11-23' });
   * for (const r of level.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} Lv.${r.character_level}`);
   * }
   * ```
   */
  async getLevel(params: MLevelRankingRequest): Promise<MLevelRanking> {
    this.validateParams(params);
    return this.http.get<MLevelRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/level`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const dojang = await client.maplestorym.ranking.getDojang({ date: '2026-11-23' });
   * for (const r of dojang.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.dojang_floor}층`);
   * }
   * ```
   */
  async getDojang(params: MDojangRankingRequest): Promise<MDojangRanking> {
    this.validateParams(params);
    return this.http.get<MDojangRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/dojang`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const rot = await client.maplestorym.ranking.getRootOfTime({ date: '2026-11-23' });
   * for (const r of rot.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 최대데미지:${r.max_damage}`);
   * }
   * ```
   */
  async getRootOfTime(params: MRootOfTimeRankingRequest): Promise<MRootOfTimeRanking> {
    this.validateParams(params);
    return this.http.get<MRootOfTimeRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/root-of-time`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const union = await client.maplestorym.ranking.getUnion({ date: '2026-11-23' });
   * for (const r of union.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 유니온Lv.${r.union_level}`);
   * }
   * ```
   */
  async getUnion(params: MUnionRankingRequest): Promise<MUnionRanking> {
    this.validateParams(params);
    return this.http.get<MUnionRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/union`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const cp = await client.maplestorym.ranking.getCombatPower({ date: '2026-11-23' });
   * for (const r of cp.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} 전투력:${r.character_combat_power}`);
   * }
   * ```
   */
  async getCombatPower(params: MCombatPowerRankingRequest): Promise<MCombatPowerRanking> {
    this.validateParams(params);
    return this.http.get<MCombatPowerRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/combat-power`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const tower = await client.maplestorym.ranking.getKerningMTower({ date: '2026-11-23' });
   * for (const r of tower.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.tower_floor}층`);
   * }
   * ```
   */
  async getKerningMTower(params: MKerningMTowerRankingRequest): Promise<MKerningMTowerRanking> {
    this.validateParams(params);
    return this.http.get<MKerningMTowerRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/kerning-m-tower`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const achievement = await client.maplestorym.ranking.getAchievement({ date: '2026-11-23' });
   * for (const r of achievement.ranking) {
   *   console.log(`#${r.ranking} ${r.character_name} ${r.achievement_grade_name} ${r.achievement_score}점`);
   * }
   * ```
   */
  async getAchievement(params: MAchievementRankingRequest): Promise<MAchievementRanking> {
    this.validateParams(params);
    return this.http.get<MAchievementRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/achievement`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const bf = await client.maplestorym.ranking.getSharenianBattlefield({ date: '2026-11-23' });
   * for (const r of bf.ranking) {
   *   console.log(`#${r.ranking} ${r.guild_name} ${r.season_score}점`);
   * }
   * ```
   */
  async getSharenianBattlefield(
    params: MSharenianBattlefieldRankingRequest,
  ): Promise<MSharenianBattlefieldRanking> {
    this.validateParams(params);
    return this.http.get<MSharenianBattlefieldRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/sharenian-battlefield`,
      {
        date: params.date,
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
   * @param params - 조회 기준일(KST), 월드명 또는 캐릭터 식별자, 페이지 번호
   * @throws {TypeError} 기준일 또는 식별자가 비어 있거나, 월드명과 캐릭터 식별자를 함께 지정하거나, 페이지가 정수가 아닐 때
   * @throws {NexonError} 넥슨 Open API 요청이 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const ww = await client.maplestorym.ranking.getSharenianWaterway({ date: '2026-11-23' });
   * for (const r of ww.ranking) {
   *   console.log(`#${r.ranking} ${r.guild_name} ${r.season_score}점`);
   * }
   * ```
   */
  async getSharenianWaterway(
    params: MSharenianWaterwayRankingRequest,
  ): Promise<MSharenianWaterwayRanking> {
    this.validateParams(params);
    return this.http.get<MSharenianWaterwayRanking>(
      `${MapleStoryMRankingClient.BASE}/ranking/sharenian-waterway`,
      {
        date: params.date,
        world_name: params.world_name,
        ocid: params.ocid,
        page: params.page,
      },
      M_RANKING_SHAPE,
    );
  }

  private validateParams(
    params: MRankingBaseRequest & { readonly world_name?: string | undefined },
  ): void {
    assertNonBlank(
      params.date,
      'date가 비어 있습니다. 조회 기준일을 YYYY-MM-DD 형식으로 입력하세요.',
    );
    if (params.world_name !== undefined && params.ocid !== undefined) {
      throw new TypeError('world_name과 ocid 중 하나만 입력하세요.');
    }
    if (params.world_name !== undefined) {
      assertNonBlank(
        params.world_name,
        'world_name이 비어 있습니다. 조회할 월드명을 입력하거나 생략하세요.',
      );
    }
    if (params.ocid !== undefined) {
      assertNonBlank(
        params.ocid,
        'ocid가 비어 있습니다. maplestorym.getOcid()로 캐릭터 식별자를 조회하거나 생략하세요.',
      );
    }
    if (params.page !== undefined && !Number.isInteger(params.page)) {
      throw new TypeError('page는 정수로 입력하세요.');
    }
  }
}
