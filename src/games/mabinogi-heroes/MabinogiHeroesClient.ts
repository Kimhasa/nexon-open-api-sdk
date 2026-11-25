import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { MabinogiHeroesCharacterClient } from './character/MabinogiHeroesCharacterClient.js';
import { MabinogiHeroesMarketplaceClient } from './marketplace/MabinogiHeroesMarketplaceClient.js';
import { MabinogiHeroesMetaClient } from './meta/MabinogiHeroesMetaClient.js';
import { MabinogiHeroesNoticeClient } from './notice/MabinogiHeroesNoticeClient.js';
import { MabinogiHeroesRankingClient } from './ranking/MabinogiHeroesRankingClient.js';
import { HEROES_OCID_SHAPE } from './shapes.js';
import type { HeroesOCID } from './types.js';

/**
 * 마비노기 영웅전 클라이언트.
 *
 * 포털 스펙: `specs/openapi/heroes/` (https://openapi.nexon.com/ko/game/heroes/)
 *
 * - 캐릭터·메타·거래소·랭킹 API는 V2(`/heroes/v2/...`), 공지 API는 V1(`/heroes/v1/...`) 입니다.
 * - 게임 데이터는 평균 10분 뒤 반영되며, 2022년 1월 1일 이후 데이터를 조회할 수 있습니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 *
 * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
 * const basic = await client.mabinogiHeroes.character.getBasic({ ocid });
 * const ranking = await client.mabinogiHeroes.ranking.getHallOfHonor({ ranking_type: '0' });
 * const notices = await client.mabinogiHeroes.notice.getList();
 * ```
 */
export class MabinogiHeroesClient extends AbstractGameClient {
  protected readonly pathPrefix = 'heroes';

  private _character: MabinogiHeroesCharacterClient | undefined;
  private _meta: MabinogiHeroesMetaClient | undefined;
  private _notice: MabinogiHeroesNoticeClient | undefined;
  private _marketplace: MabinogiHeroesMarketplaceClient | undefined;
  private _ranking: MabinogiHeroesRankingClient | undefined;

  /** 영웅의 프로필·타이틀·장비·길드를 조회하는 캐릭터 메뉴. */
  get character(): MabinogiHeroesCharacterClient {
    this._character ??= new MabinogiHeroesCharacterClient(this.http);
    return this._character;
  }

  /** 접두·접미 인챈트의 효과와 적용 부위를 조회하는 메뉴. */
  get meta(): MabinogiHeroesMetaClient {
    this._meta ??= new MabinogiHeroesMetaClient(this.http);
    return this._meta;
  }

  /** 공지사항·패치노트·이벤트&샵 게시판. */
  get notice(): MabinogiHeroesNoticeClient {
    this._notice ??= new MabinogiHeroesNoticeClient(this.http);
    return this._notice;
  }

  /** 아이템 거래 기록과 골드 거래 상위권을 보는 거래소. */
  get marketplace(): MabinogiHeroesMarketplaceClient {
    this._marketplace ??= new MabinogiHeroesMarketplaceClient(this.http);
    return this._marketplace;
  }

  /** 명예의 전당과 실시간 랭킹. */
  get ranking(): MabinogiHeroesRankingClient {
    this._ranking ??= new MabinogiHeroesRankingClient(this.http);
    return this._ranking;
  }

  /**
   * 영웅 이름으로 캐릭터 식별자를 조회한다.
   *
   * 게임 콘텐츠 변경으로 ocid가 바뀔 수 있으므로, 저장해 둔 ocid로 조회가 실패하면 다시 조회합니다.
   *
   * @param characterName - 조회할 캐릭터 이름
   * @throws {NexonBadRequestError} characterName이 비어 있을 때 (요청 전에 SDK가 throw)
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 허용량을 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 캐릭터 검색에서 이름을 식별자로 바꿀 때
   * const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
   * const basic = await client.mabinogiHeroes.character.getBasic({ ocid });
   * ```
   */
  async getOcid(characterName: string): Promise<HeroesOCID> {
    assertNonEmptyString(
      characterName,
      'characterName',
      "조회할 영웅(캐릭터) 명을 넘겨주세요 (예: client.mabinogiHeroes.getOcid('캐릭터명')).",
    );
    const notFound = {
      message: `'${characterName}' 캐릭터를 찾을 수 없습니다.`,
      hint: '마비노기 영웅전 캐릭터 이름을 확인하세요.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ ocid: string }>(
          this.buildUrl('id', 'v2'),
          { character_name: characterName },
          HEROES_OCID_SHAPE,
        ),
      notFound,
    );
    return response.ocid as HeroesOCID;
  }
}
