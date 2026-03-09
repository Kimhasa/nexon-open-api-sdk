import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStoryCharacterClient } from './character/MapleStoryCharacterClient.js';
import { MapleStoryUnionClient } from './union/MapleStoryUnionClient.js';
import { MapleStoryGuildClient } from './guild/MapleStoryGuildClient.js';
import { MapleStoryHistoryClient } from './history/MapleStoryHistoryClient.js';
import { MapleStoryRankingClient } from './ranking/MapleStoryRankingClient.js';
import { MapleStoryNoticeClient } from './notice/MapleStoryNoticeClient.js';
import { OCID_SHAPE, OUID_SHAPE, ACHIEVEMENT_SHAPE } from './shapes.js';
import type { Achievement } from './user-types.js';

/**
 * 메이플스토리 (KMS) 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * const union = await client.maplestory.union.get({ ocid });
 * const ranking = await client.maplestory.ranking.getOverall({ date });
 * ```
 */
export class MapleStoryClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestory';
  protected readonly timezoneOffset = 540; // UTC+9 (KST)

  private _character: MapleStoryCharacterClient | undefined;
  private _union: MapleStoryUnionClient | undefined;
  private _guild: MapleStoryGuildClient | undefined;
  private _history: MapleStoryHistoryClient | undefined;
  private _ranking: MapleStoryRankingClient | undefined;
  private _notice: MapleStoryNoticeClient | undefined;

  /** 캐릭터 관련 API (22개 엔드포인트) */
  get character(): MapleStoryCharacterClient {
    this._character ??= new MapleStoryCharacterClient(this.http);
    return this._character;
  }

  /** 유니온 관련 API (4개 엔드포인트) */
  get union(): MapleStoryUnionClient {
    this._union ??= new MapleStoryUnionClient(this.http);
    return this._union;
  }

  /** 길드 관련 API (2개 엔드포인트) */
  get guild(): MapleStoryGuildClient {
    this._guild ??= new MapleStoryGuildClient(this.http);
    return this._guild;
  }

  /** 확률/이력 관련 API (3개 엔드포인트) */
  get history(): MapleStoryHistoryClient {
    this._history ??= new MapleStoryHistoryClient(this.http);
    return this._history;
  }

  /** 랭킹 관련 API (6개 엔드포인트) */
  get ranking(): MapleStoryRankingClient {
    this._ranking ??= new MapleStoryRankingClient(this.http);
    return this._ranking;
  }

  /** 공지사항 관련 API (8개 엔드포인트) */
  get notice(): MapleStoryNoticeClient {
    this._notice ??= new MapleStoryNoticeClient(this.http);
    return this._notice;
  }

  /**
   * 캐릭터명으로 OCID를 조회한다.
   *
   * @param characterName - 조회할 캐릭터명
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('Arturia');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    const url = this.buildUrl('id');
    const response = await this.http.get<{ ocid: string }>(
      url,
      { character_name: characterName },
      OCID_SHAPE,
    );
    return response.ocid as OCID;
  }

  /**
   * 계정 식별자(ouid)를 조회한다.
   *
   * API 키에 연결된 계정의 ouid를 반환합니다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const ouid = await client.maplestory.getOuid();
   * ```
   */
  async getOuid(): Promise<string> {
    const url = this.buildUrl('ouid');
    const response = await this.http.get<{ ouid: string }>(url, undefined, OUID_SHAPE);
    return response.ouid;
  }

  /**
   * 계정의 업적 정보를 조회한다.
   *
   * API 키에 연결된 계정의 달성 업적 목록을 반환합니다.
   * 파라미터 없이 API 키만으로 식별됩니다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const achievement = await client.maplestory.getAchievement();
   * for (const account of achievement.account_list) {
   *   for (const a of account.achievement_achieve) {
   *     console.log(`${a.achievement_name}: ${a.achievement_description}`);
   *   }
   * }
   * ```
   *
   */
  async getAchievement(): Promise<Achievement> {
    const url = this.buildUrl('user/achievement');
    return this.http.get<Achievement>(url, undefined, ACHIEVEMENT_SHAPE);
  }
}
