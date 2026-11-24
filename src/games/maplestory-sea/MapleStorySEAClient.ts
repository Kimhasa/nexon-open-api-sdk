import { UTC_PLUS_8_OFFSET_MINUTES } from '../_base/maple-date.js';
import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
import { SEA_OCID_SHAPE } from './shapes.js';
import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStorySEACharacterClient } from './character/MapleStorySEACharacterClient.js';
import { MapleStorySEAUnionClient } from './union/MapleStorySEAUnionClient.js';
import { MapleStorySEAGuildClient } from './guild/MapleStorySEAGuildClient.js';

/**
 * MapleStory SEA(동남아 서버) 클라이언트.
 *
 * 사용법은 한국 메이플스토리와 같고, 날짜 기준과 월드 이름이 다릅니다.
 *
 * - 날짜 기준: 싱가포르 시간 (SGT, UTC+8)
 * - 데이터 제공 시작일: 2025-04-20
 * - 어제 날짜의 데이터: 오늘 오전 2시(SGT)부터 조회 가능
 * - 게임에서 바뀐 내용: 약 15분 뒤 조회 가능
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.maplestorySEA.getOcid('CharacterName');
 * const basic = await client.maplestorySEA.character.getBasic({ ocid });
 * const union = await client.maplestorySEA.union.getUnion({ ocid });
 * ```
 */
export class MapleStorySEAClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestorysea';
  protected readonly timezoneOffset = UTC_PLUS_8_OFFSET_MINUTES; // UTC+8 (SGT)

  private _character: MapleStorySEACharacterClient | undefined;
  private _union: MapleStorySEAUnionClient | undefined;
  private _guild: MapleStorySEAGuildClient | undefined;

  // ─── Sub-clients ────────────────────────────────────────────────────────

  /** 캐릭터 정보: 스탯·장비·스킬·심볼·무릉도장(Mu Lung Garden) 등 (19개) */
  get character(): MapleStorySEACharacterClient {
    this._character ??= new MapleStorySEACharacterClient(this.http);
    return this._character;
  }

  /** 유니온(Union): 레벨·등급, 공격대 배치, 아티팩트, 챔피언 (4개) */
  get union(): MapleStorySEAUnionClient {
    this._union ??= new MapleStorySEAUnionClient(this.http);
    return this._union;
  }

  /** 길드: 길드 고유 번호와 길드 기본 정보 (2개) */
  get guild(): MapleStorySEAGuildClient {
    this._guild ??= new MapleStorySEAGuildClient(this.http);
    return this._guild;
  }

  // ─── OCID ───────────────────────────────────────────────────────────────

  /**
   * 캐릭터 이름으로 캐릭터 고유 번호(OCID)를 받아 온다. 캐릭터 정보를 조회하는 메서드에 이 값을 넣는다.
   *
   * GET /maplestorysea/v1/id
   *
   * @param characterName - 게임에서 쓰는 캐릭터 이름
   * @throws {NexonBadRequestError} A required identifier or parameter is blank
   * @throws {NexonNotFoundError} Character not found
   * @throws {NexonAuthError} Invalid API key
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    assertNonEmptyString(characterName, 'characterName', undefined, 'trim-truthy');
    const url = this.buildUrl('id');
    const notFound = {
      message: `'${characterName}' 캐릭터를 찾을 수 없습니다.`,
      hint: 'MapleStory SEA 캐릭터 이름(대소문자)을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ ocid: string }>(
          url,
          {
            character_name: characterName,
          },
          SEA_OCID_SHAPE,
        ),
      notFound,
    );
    return response.ocid as OCID;
  }
}
