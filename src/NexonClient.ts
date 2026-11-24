import { HttpClient } from './core/http/HttpClient.js';
import type { HttpClientConfig } from './core/http/http-types.js';
import { MapleStoryClient } from './games/maplestory/MapleStoryClient.js';
import { FcOnlineClient } from './games/fc-online/FcOnlineClient.js';
import { MapleStoryMClient } from './games/maplestory-m/MapleStoryMClient.js';
import { MapleStorySEAClient } from './games/maplestory-sea/MapleStorySEAClient.js';
import { MapleStoryTWClient } from './games/maplestory-tw/MapleStoryTWClient.js';
import { FirstDescendantClient } from './games/first-descendant/FirstDescendantClient.js';
import { MabinogiHeroesClient } from './games/mabinogi-heroes/MabinogiHeroesClient.js';
import { SuddenAttackClient } from './games/sudden-attack/SuddenAttackClient.js';
import { KartriderClient } from './games/kartrider/KartriderClient.js';
import { BaramClient } from './games/baram/BaramClient.js';
import { MabinogiClient } from './games/mabinogi/MabinogiClient.js';
import { BaramYeonClient } from './games/baram-yeon/BaramYeonClient.js';
import { V4Client } from './games/v4/V4Client.js';
import { Hit2Client } from './games/hit2/Hit2Client.js';
import { PlatformClient } from './games/platform/PlatformClient.js';

/**
 * NexonClient 생성 옵션.
 */
export type NexonClientOptions = HttpClientConfig;

/**
 * Nexon Open API SDK 메인 진입점.
 *
 * 각 게임 클라이언트는 처음 접근 시 lazy하게 생성됩니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * ```
 */
export class NexonClient {
  private readonly http: HttpClient;

  private _maplestory: MapleStoryClient | undefined;
  private _fcOnline: FcOnlineClient | undefined;
  private _maplestorym: MapleStoryMClient | undefined;
  private _maplestorySEA: MapleStorySEAClient | undefined;
  private _maplestoryTW: MapleStoryTWClient | undefined;
  private _firstDescendant: FirstDescendantClient | undefined;
  private _mabinogiHeroes: MabinogiHeroesClient | undefined;
  private _suddenAttack: SuddenAttackClient | undefined;
  private _kartrider: KartriderClient | undefined;
  private _baram: BaramClient | undefined;
  private _mabinogi: MabinogiClient | undefined;
  private _baramYeon: BaramYeonClient | undefined;
  private _v4: V4Client | undefined;
  private _hit2: Hit2Client | undefined;
  private _platform: PlatformClient | undefined;

  constructor(options: NexonClientOptions) {
    if (!options.apiKey) {
      throw new Error(
        'API 키가 필요합니다.\n→ https://openapi.nexon.com/ 에서 API 키를 발급받으세요.',
      );
    }
    this.http = new HttpClient(options);
  }

  /**
   * 메이플스토리 KMS (한국) 클라이언트.
   * Timezone: UTC+9 (KST)
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('캐릭터명');
   * const basic = await client.maplestory.character.getBasic({ ocid });
   * const state = await client.maplestory.scheduler.getCharacterState({ ocid });
   * const replays = await client.maplestory.battlePractice.getReplayId({ ocid });
   * ```
   */
  get maplestory(): MapleStoryClient {
    this._maplestory ??= new MapleStoryClient(this.http);
    return this._maplestory;
  }

  /**
   * EA SPORTS FC Online 클라이언트.
   *
   * @example
   * ```ts
   * const ouid = await client.fcOnline.getOuid('닉네임');
   * const basic = await client.fcOnline.getBasic(ouid);
   * ```
   */
  get fcOnline(): FcOnlineClient {
    this._fcOnline ??= new FcOnlineClient(this.http);
    return this._fcOnline;
  }

  /**
   * 메이플스토리M 클라이언트.
   * Timezone: UTC+9 (KST)
   */
  get maplestorym(): MapleStoryMClient {
    this._maplestorym ??= new MapleStoryMClient(this.http);
    return this._maplestorym;
  }

  /**
   * MapleStory SEA 클라이언트.
   * Timezone: UTC+8 (SGT)
   *
   * @example
   * ```ts
   * const ocid = await client.maplestorySEA.getOcid('CharacterName');
   * const basic = await client.maplestorySEA.character.getBasic({ ocid });
   * ```
   */
  get maplestorySEA(): MapleStorySEAClient {
    this._maplestorySEA ??= new MapleStorySEAClient(this.http);
    return this._maplestorySEA;
  }

  /**
   * MapleStory Taiwan (메이플스토리 대만) 클라이언트.
   * Timezone: UTC+8 (TST)
   */
  get maplestoryTW(): MapleStoryTWClient {
    this._maplestoryTW ??= new MapleStoryTWClient(this.http);
    return this._maplestoryTW;
  }

  /**
   * 퍼스트 디센던트 (The First Descendant) 클라이언트.
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const basic = await client.firstDescendant.user.getBasic({ ouid });
   * const descendants = await client.firstDescendant.meta.getDescendant('ko');
   * ```
   */
  get firstDescendant(): FirstDescendantClient {
    this._firstDescendant ??= new FirstDescendantClient(this.http);
    return this._firstDescendant;
  }

  /**
   * 마비노기 영웅전 클라이언트.
   *
   * @example
   * ```ts
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const basic = await client.mabinogiHeroes.character.getBasic({ ocid });
   * const ranking = await client.mabinogiHeroes.ranking.getHallOfHonor({ ranking_type: '0' });
   * const history = await client.mabinogiHeroes.marketplace.listHistory({ item_name: '인챈트 스크롤' });
   * ```
   */
  get mabinogiHeroes(): MabinogiHeroesClient {
    this._mabinogiHeroes ??= new MabinogiHeroesClient(this.http);
    return this._mabinogiHeroes;
  }

  /**
   * 서든어택 클라이언트.
   *
   * @example
   * ```ts
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * const matches = await client.suddenAttack.match.getList({ ouid, match_mode: '폭파미션' });
   * ```
   */
  get suddenAttack(): SuddenAttackClient {
    this._suddenAttack ??= new SuddenAttackClient(this.http);
    return this._suddenAttack;
  }

  /**
   * 카트라이더 러쉬플러스 클라이언트.
   *
   * @example
   * ```ts
   * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
   * const notices = await client.kartrider.notice.getList();
   * ```
   */
  get kartrider(): KartriderClient {
    this._kartrider ??= new KartriderClient(this.http);
    return this._kartrider;
  }

  /**
   * 바람의나라 클라이언트.
   *
   * @example
   * ```ts
   * const ocid = await client.baram.getOcid('캐릭터명', '연');
   * const basic = await client.baram.character.getBasic({ ocid });
   * ```
   */
  get baram(): BaramClient {
    this._baram ??= new BaramClient(this.http);
    return this._baram;
  }

  /**
   * 마비노기 클라이언트.
   *
   * @example
   * ```ts
   * const shop = await client.mabinogi.npcShop.getList({ npc_name: '델', server_name: '류트', channel: 1 });
   * const items = await client.mabinogi.auction.listItems({ auction_item_category: '검' });
   * ```
   */
  get mabinogi(): MabinogiClient {
    this._mabinogi ??= new MabinogiClient(this.http);
    return this._mabinogi;
  }

  /**
   * 바람의나라: 연 클라이언트.
   *
   * @example
   * ```ts
   * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
   * const basic = await client.baramYeon.character.getBasic({ ocid });
   * ```
   */
  get baramYeon(): BaramYeonClient {
    this._baramYeon ??= new BaramYeonClient(this.http);
    return this._baramYeon;
  }

  /**
   * V4 클라이언트.
   *
   * @example
   * ```ts
   * const ocid = await client.v4.getOcid('캐릭터명');
   * const basic = await client.v4.character.getBasic({ ocid });
   * ```
   */
  get v4(): V4Client {
    this._v4 ??= new V4Client(this.http);
    return this._v4;
  }

  /**
   * 히트2 클라이언트.
   *
   * @example
   * ```ts
   * const ocid = await client.hit2.getOcid('캐릭터명');
   * const basic = await client.hit2.character.getBasic({ ocid });
   * ```
   */
  get hit2(): Hit2Client {
    this._hit2 ??= new Hit2Client(this.http);
    return this._hit2;
  }

  /**
   * 넥슨 Open API 플랫폼 (Open API 공지) 클라이언트.
   *
   * @example
   * ```ts
   * const { notice } = await client.platform.getNoticeList();
   * ```
   */
  get platform(): PlatformClient {
    this._platform ??= new PlatformClient(this.http);
    return this._platform;
  }
}
