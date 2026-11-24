import { assertDateInRange, assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStoryTWCharacterClient } from './character/MapleStoryTWCharacterClient.js';
import { MapleStoryTWGuildClient } from './guild/MapleStoryTWGuildClient.js';
import { OCID_SHAPE } from './shapes.js';
import type { TWDate, TWOcidResponse } from './types.js';
import { MapleStoryTWUnionClient } from './union/MapleStoryTWUnionClient.js';

/**
 * MapleStory Taiwan(대만 서버, 楓之谷) 클라이언트.
 *
 * 사용법은 한국 메이플스토리와 같고, 날짜 기준과 월드 이름이 다르며 패밀리어(萌獸) 조회가 더 있습니다.
 * 날짜는 대만 시간(UTC+8) 기준이고 `'YYYY-MM-DD'` 문자열, `Date`, `'today'` 를 받습니다.
 *
 * - Dates use Taiwan Standard Time (UTC+8).
 * - Character and guild data starts on October 15, 2025. Union data starts on
 *   October 14, 2025, and Union Champion data starts on December 18, 2025.
 * - Game updates take about 15 minutes to appear in the API.
 * - Historical data covers a local calendar day and is available after 2 AM
 *   the following day (TST).
 * - Character identifiers (OCIDs) can change when game content changes.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.maplestoryTW.getOcid('CharacterName');
 * const basic = await client.maplestoryTW.character.getBasic({ ocid });
 * ```
 */
export class MapleStoryTWClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestorytw';
  protected readonly timezoneOffset = 480; // UTC+8 (TST)

  private _character: MapleStoryTWCharacterClient | undefined;
  private _union: MapleStoryTWUnionClient | undefined;
  private _guild: MapleStoryTWGuildClient | undefined;

  /** 캐릭터 정보: 스탯·장비·스킬·심볼·무릉도장(武陵道場)·패밀리어(萌獸) 등 (20개) */
  get character(): MapleStoryTWCharacterClient {
    return (this._character ??= new MapleStoryTWCharacterClient(
      this.http,
      this.formatQueryDate.bind(this),
    ));
  }

  /** 유니온(戰地): 레벨·등급, 공격대 배치, 아티팩트, 챔피언 (4개) */
  get union(): MapleStoryTWUnionClient {
    return (this._union ??= new MapleStoryTWUnionClient(
      this.http,
      this.formatQueryDate.bind(this),
    ));
  }

  /** 길드(公會): 길드 고유 번호와 길드 기본 정보 (2개) */
  get guild(): MapleStoryTWGuildClient {
    return (this._guild ??= new MapleStoryTWGuildClient(
      this.http,
      this.formatQueryDate.bind(this),
    ));
  }

  /**
   * 캐릭터 이름으로 캐릭터 고유 번호(OCID)를 받아 온다. 캐릭터 정보를 조회하는 메서드에 이 값을 넣는다.
   *
   * @param characterName - 게임에서 쓰는 캐릭터 이름
   * @throws {NexonBadRequestError} The character name is blank.
   * @throws {NexonNotFoundError} The character was not found.
   * @throws {NexonAuthError} The API key is invalid.
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.maplestoryTW.getOcid('CharacterName');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    assertNonEmptyString(
      characterName,
      'characterName',
      'Enter a MapleStory Taiwan character name.',
    );
    const notFound = {
      message: `'${characterName}' 캐릭터를 찾을 수 없습니다.`,
      hint: 'MapleStory Taiwan 캐릭터 이름을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<TWOcidResponse>(
          this.buildUrl('id'),
          { character_name: characterName },
          OCID_SHAPE,
        ),
      notFound,
    );
    return response.ocid;
  }

  private formatQueryDate(date: TWDate | undefined, availableFrom: string): string | undefined {
    if (date === undefined) return undefined;

    const formatted = this.formatDate(date);
    const today = this.formatDate('today');
    assertDateInRange(formatted, availableFrom, today, 'Use a date in Taiwan time.');
    return formatted;
  }
}
