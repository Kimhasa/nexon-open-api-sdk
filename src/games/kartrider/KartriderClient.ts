import { assertNonEmptyString } from '../../core/validation/input.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
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
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
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

  /** 라이더 레벨과 장착 칭호를 조회하는 메뉴. */
  get user(): KartriderUserClient {
    this._user ??= new KartriderUserClient(this.http);
    return this._user;
  }

  /** 공지사항·시즌 알림판·이벤트&대회 게시판. */
  get notice(): KartriderNoticeClient {
    this._notice ??= new KartriderNoticeClient(this.http);
    return this._notice;
  }

  /**
   * 라이더명으로 계정 후보의 고유 번호·레벨·생성 시각을 조회한다.
   *
   * 같은 라이더명에 계정이 여러 개 대응할 수 있어 `ouid_info` 배열을 반환한다.
   * 후보가 여러 건이면 생성 시각과 레벨을 비교해 조회할 계정을 고른다.
   *
   * 라이더 명의 `|` 는 넥슨 API 규칙에 따라 SDK가 `_` 로 바꿔 보낸다
   * (예: `|카러플라이더|` → `_카러플라이더_`).
   *
   * @param racerName - 조회할 라이더명. SDK가 `|`를 `_`로 바꿔 조회한다.
   * @throws {NexonBadRequestError} racerName이 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 라이더 검색에서 동명이인 계정 후보를 보여 줄 때
   * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
   * for (const info of ouid_info) {
   *   console.log(info.ouid, info.racer_level, info.racer_date_create);
   * }
   * ```
   */
  async getOuidInfo(racerName: string): Promise<KartriderOuidLookup> {
    assertNonEmptyString(
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
