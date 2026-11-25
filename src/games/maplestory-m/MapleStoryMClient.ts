import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
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
 * PC 메이플스토리와 달리 캐릭터를 찾을 때 월드 이름이 필요하고, 캐릭터·유니온·길드 조회에
 * 날짜를 넣지 않습니다. 날짜는 랭킹에만 씁니다.
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
 * const ranking = await client.maplestorym.ranking.getLevel({ date: '2026-11-23' });
 * ```
 */
export class MapleStoryMClient extends AbstractGameClient {
  protected readonly pathPrefix = 'maplestorym';

  private _character: MapleStoryMCharacterClient | undefined;
  private _union: MapleStoryMUnionClient | undefined;
  private _guild: MapleStoryMGuildClient | undefined;
  private _ranking: MapleStoryMRankingClient | undefined;
  private _notice: MapleStoryMNoticeClient | undefined;

  /** 캐릭터 정보: 스탯·장비·심볼·쥬얼·스킬 등 (17개) */
  get character(): MapleStoryMCharacterClient {
    this._character ??= new MapleStoryMCharacterClient(this.http);
    return this._character;
  }

  /** 유니온: 레벨·등급, 공격대원 효과, 유니온 스탯 (3개) */
  get union(): MapleStoryMUnionClient {
    this._union ??= new MapleStoryMUnionClient(this.http);
    return this._union;
  }

  /** 길드: 길드 식별자와 길드 기본 정보 (2개) */
  get guild(): MapleStoryMGuildClient {
    this._guild ??= new MapleStoryMGuildClient(this.http);
    return this._guild;
  }

  /** 랭킹: 레벨·무릉도장·시간의 근원·유니온·전투력·커닝M타워·업적·샤레니안 (9개) */
  get ranking(): MapleStoryMRankingClient {
    this._ranking ??= new MapleStoryMRankingClient(this.http);
    return this._ranking;
  }

  /** 공지: 공지사항·패치노트·진행 중 이벤트 (6개) */
  get notice(): MapleStoryMNoticeClient {
    this._notice ??= new MapleStoryMNoticeClient(this.http);
    return this._notice;
  }

  /**
   * 월드 이름과 캐릭터 이름으로 캐릭터 식별자(ocid)를 받아 온다. 메이플스토리M은 월드마다 같은 이름이 있을 수 있어 월드 이름이 꼭 필요하다.
   *
   * @param worldName - 캐릭터가 있는 월드 이름 (아케인, 크로아, 엘리시움, 루나, 스카니아, 유니온, 제니스, 챌린저스)
   * @param characterName - 게임에서 쓰는 캐릭터 이름
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   *
   * @throws {NexonBadRequestError} 월드명이나 캐릭터명이 비어 있을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   *
   * const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
   * ```
   */
  async getOcid(worldName: MWorldName, characterName: string): Promise<OCID> {
    assertNonEmptyString(worldName, 'worldName', '스카니아 등 캐릭터가 속한 월드명을 입력하세요.');
    assertNonEmptyString(characterName, 'characterName', '조회할 캐릭터명을 입력하세요.');
    const url = this.buildUrl('id');
    const notFound = {
      message: `${worldName} 월드에서 '${characterName}' 캐릭터를 찾을 수 없습니다.`,
      hint: "월드 이름과 캐릭터 이름을 확인하세요. 메이플스토리M은 월드를 먼저 넣습니다: getOcid('스카니아', '캐릭터명')",
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ ocid: string }>(
          url,
          { world_name: worldName, character_name: characterName },
          M_OCID_SHAPE,
        ),
      notFound,
    );
    return response.ocid as OCID;
  }
}
