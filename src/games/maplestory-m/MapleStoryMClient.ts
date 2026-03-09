import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import type { MWorldName } from './guild/types.js';
import { MapleStoryMCharacterClient } from './character/MapleStoryMCharacterClient.js';
import { MapleStoryMUnionClient } from './union/MapleStoryMUnionClient.js';
import { MapleStoryMGuildClient } from './guild/MapleStoryMGuildClient.js';
import { MapleStoryMRankingClient } from './ranking/MapleStoryMRankingClient.js';
import { MapleStoryMNoticeClient } from './notice/MapleStoryMNoticeClient.js';
import { M_OCID_SHAPE } from './shapes.js';

/**
 * 메이플스토리M 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
 * const basic = await client.maplestorym.character.getBasic({ ocid });
 * const union = await client.maplestorym.union.get({ ocid });
 * const ranking = await client.maplestorym.ranking.getLevel({ date });
 * ```
 */
export class MapleStoryMClient extends AbstractGameClient {
  protected readonly pathPrefix = 'maplestorym';

  private _character: MapleStoryMCharacterClient | undefined;
  private _union: MapleStoryMUnionClient | undefined;
  private _guild: MapleStoryMGuildClient | undefined;
  private _ranking: MapleStoryMRankingClient | undefined;
  private _notice: MapleStoryMNoticeClient | undefined;

  /** 캐릭터 관련 API (17개 엔드포인트) */
  get character(): MapleStoryMCharacterClient {
    this._character ??= new MapleStoryMCharacterClient(this.http);
    return this._character;
  }

  /** 유니온 관련 API (2개 엔드포인트) */
  get union(): MapleStoryMUnionClient {
    this._union ??= new MapleStoryMUnionClient(this.http);
    return this._union;
  }

  /** 길드 관련 API (2개 엔드포인트) */
  get guild(): MapleStoryMGuildClient {
    this._guild ??= new MapleStoryMGuildClient(this.http);
    return this._guild;
  }

  /** 랭킹 관련 API (9개 엔드포인트) */
  get ranking(): MapleStoryMRankingClient {
    this._ranking ??= new MapleStoryMRankingClient(this.http);
    return this._ranking;
  }

  /** 공지사항 관련 API (6개 엔드포인트) */
  get notice(): MapleStoryMNoticeClient {
    this._notice ??= new MapleStoryMNoticeClient(this.http);
    return this._notice;
  }

  /**
   * 캐릭터명과 월드명으로 OCID를 조회한다.
   *
   * @param worldName - 월드 명 (아케인, 크로아, 엘리시움, 루나, 스카니아, 유니온, 제니스)
   * @param characterName - 조회할 캐릭터명
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   * ```
   */
  async getOcid(worldName: MWorldName, characterName: string): Promise<OCID> {
    const url = this.buildUrl('id');
    const response = await this.http.get<{ ocid: string }>(
      url,
      { world_name: worldName as string, character_name: characterName },
      M_OCID_SHAPE,
    );
    return response.ocid as OCID;
  }
}
