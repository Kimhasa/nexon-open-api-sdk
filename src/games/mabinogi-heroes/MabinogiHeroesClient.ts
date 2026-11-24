import { assertNonEmptyString } from '../../core/validation/input.js';
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
 * const client = new NexonClient({ apiKey: 'your-api-key' });
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

  /** 캐릭터 관련 API (6개 엔드포인트) */
  get character(): MabinogiHeroesCharacterClient {
    this._character ??= new MabinogiHeroesCharacterClient(this.http);
    return this._character;
  }

  /** 메타데이터 관련 API (1개 엔드포인트) */
  get meta(): MabinogiHeroesMetaClient {
    this._meta ??= new MabinogiHeroesMetaClient(this.http);
    return this._meta;
  }

  /** 공지 관련 API (6개 엔드포인트) */
  get notice(): MabinogiHeroesNoticeClient {
    this._notice ??= new MabinogiHeroesNoticeClient(this.http);
    return this._notice;
  }

  /** 거래소 관련 API (3개 엔드포인트) */
  get marketplace(): MabinogiHeroesMarketplaceClient {
    this._marketplace ??= new MabinogiHeroesMarketplaceClient(this.http);
    return this._marketplace;
  }

  /** 랭킹 관련 API (2개 엔드포인트) */
  get ranking(): MabinogiHeroesRankingClient {
    this._ranking ??= new MabinogiHeroesRankingClient(this.http);
    return this._ranking;
  }

  /**
   * 영웅(캐릭터) 명으로 캐릭터 식별자(ocid)를 조회한다.
   *
   * 게임 콘텐츠 변경으로 ocid가 바뀔 수 있으므로, 저장해 둔 ocid로 조회가 실패하면 다시 조회합니다.
   *
   * @param characterName - 영웅(캐릭터) 명
   * @throws {NexonBadRequestError} characterName이 비어 있을 때 (요청 전에 SDK가 throw)
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
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
    const response = await this.http.get<{ ocid: string }>(
      this.buildUrl('id', 'v2'),
      { character_name: characterName },
      HEROES_OCID_SHAPE,
    );
    return response.ocid as HeroesOCID;
  }
}
