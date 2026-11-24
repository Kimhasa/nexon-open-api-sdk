import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { assertNonEmpty } from './input-validation.js';
import { KartriderNoticeClient } from './notice/KartriderNoticeClient.js';
import { KARTRIDER_OUID_LOOKUP_SHAPE } from './shapes.js';
import { KartriderUserClient } from './user/KartriderUserClient.js';
import type { KartriderOuidLookup } from './user/types.js';

/**
 * 카트라이더 러쉬플러스 클라이언트.
 *
 * 포털 스펙: `specs/openapi/kartrush/` (https://openapi.nexon.com/ko/game/kartrush/)
 *
 * - 게임 데이터는 평균 10분 후 확인 가능합니다.
 * - 2022년 1월 1일 이후 데이터를 조회할 수 있습니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
 * const ouid = ouid_info[0]?.ouid;
 * if (ouid) {
 *   const basic = await client.kartrider.user.getBasic({ ouid });
 *   console.log(`${basic.racer_name} Lv.${basic.racer_level}`);
 * }
 * const notices = await client.kartrider.notice.getList();
 * ```
 */
export class KartriderClient extends AbstractGameClient {
  protected readonly pathPrefix = 'kartrush';

  private _user: KartriderUserClient | undefined;
  private _notice: KartriderNoticeClient | undefined;

  /** 계정 정보 API (2개 엔드포인트) */
  get user(): KartriderUserClient {
    this._user ??= new KartriderUserClient(this.http);
    return this._user;
  }

  /** 공지사항 API (6개 엔드포인트) */
  get notice(): KartriderNoticeClient {
    this._notice ??= new KartriderNoticeClient(this.http);
    return this._notice;
  }

  /**
   * 라이더(계정) 명으로 계정 식별자(ouid) 정보를 조회한다.
   *
   * 다른 게임의 `getOcid()` 와 달리 응답이 배열(`ouid_info`)이라 식별자 하나로 줄이지 않고
   * 응답을 그대로 돌려준다. 항목이 여러 개면 `racer_date_create`·`racer_level` 로 골라 쓴다.
   *
   * 라이더 명의 `|` 는 넥슨 API 규칙에 따라 SDK가 `_` 로 바꿔 보낸다
   * (예: `|카러플라이더|` → `_카러플라이더_`).
   *
   * @param racerName - 라이더(계정) 명
   * @throws {NexonBadRequestError} racerName이 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
   * for (const info of ouid_info) {
   *   console.log(info.ouid, info.racer_level, info.racer_date_create);
   * }
   * ```
   */
  async getOuidInfo(racerName: string): Promise<KartriderOuidLookup> {
    assertNonEmpty(
      racerName,
      'racerName',
      "client.kartrider.getOuidInfo('라이더명') 처럼 조회할 라이더(계정) 명을 전달해주세요.",
    );
    return this.http.get<KartriderOuidLookup>(
      this.buildUrl('id'),
      // 스펙: 라이더 명의 '|' 는 '_' 로 바꿔 입력해야 조회된다
      { racer_name: racerName.replaceAll('|', '_') },
      KARTRIDER_OUID_LOOKUP_SHAPE,
    );
  }
}
