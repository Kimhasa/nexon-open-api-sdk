import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { KARTRIDER_USER_BASIC_SHAPE, KARTRIDER_USER_TITLE_EQUIPMENT_SHAPE } from '../shapes.js';
import type { KartriderOuidRequest } from '../types.js';
import type { KartriderUserBasic, KartriderUserTitleEquipment } from './types.js';

const OUID_HINT =
  'client.kartrider.getOuidInfo(racerName) 응답의 ouid_info[].ouid 를 { ouid } 로 전달해주세요.';

/**
 * 카트라이더 러쉬플러스 계정 정보 API 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
 * const ouid = ouid_info[0]?.ouid;
 * if (ouid) {
 *   const basic = await client.kartrider.user.getBasic({ ouid });
 *   console.log(basic.racer_name, basic.racer_level);
 * }
 * ```
 */
export class KartriderUserClient {
  private static readonly BASE = 'https://open.api.nexon.com/kartrush/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 라이더 프로필의 레벨과 접속 일시를 조회한다.
   *
   * @param params - `ouid`는 `getOuidInfo()`의 후보에서 고른 라이더 계정 식별자
   * @throws {NexonBadRequestError} ouid가 비어 있거나(요청 전 차단) 유효하지 않을 때
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
   * // 라이더 검색 결과에 레벨을 표시할 때
   * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
   * const ouid = ouid_info[0]?.ouid;
   * if (ouid) {
   *   const basic = await client.kartrider.user.getBasic({ ouid });
   *   console.log(`${basic.racer_name} Lv.${basic.racer_level}`);
   * }
   * ```
   */
  async getBasic(params: KartriderOuidRequest): Promise<KartriderUserBasic> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    return this.http.get<KartriderUserBasic>(
      `${KartriderUserClient.BASE}/user/basic`,
      { ouid: params.ouid },
      KARTRIDER_USER_BASIC_SHAPE,
    );
  }

  /**
   * 라이더가 장착한 칭호를 조회한다.
   *
   * @param params - `ouid`는 `getOuidInfo()`의 후보에서 고른 라이더 계정 식별자
   * @throws {NexonBadRequestError} ouid가 비어 있거나(요청 전 차단) 유효하지 않을 때
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
   * // 라이더 카드에 장착 칭호를 표시할 때
   * const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
   * const ouid = ouid_info[0]?.ouid;
   * if (ouid) {
   *   const { title_equipment } = await client.kartrider.user.getTitleEquipment({ ouid });
   *   console.log(title_equipment.map((t) => t.title_name));
   * }
   * ```
   */
  async getTitleEquipment(params: KartriderOuidRequest): Promise<KartriderUserTitleEquipment> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    return this.http.get<KartriderUserTitleEquipment>(
      `${KartriderUserClient.BASE}/user/title-equipment`,
      { ouid: params.ouid },
      KARTRIDER_USER_TITLE_EQUIPMENT_SHAPE,
    );
  }
}
