import type { HttpClient } from '../../../core/http/HttpClient.js';
import {
  TFD_USER_ARCHE_TUNING_SHAPE,
  TFD_USER_BASIC_SHAPE,
  TFD_USER_DESCENDANT_SHAPE,
  TFD_USER_EXTERNAL_COMPONENT_SHAPE,
  TFD_USER_REACTOR_SHAPE,
  TFD_USER_WEAPON_SHAPE,
} from '../shapes.js';
import { assertLanguageCode, assertNonEmpty } from '../validate.js';
import type {
  TfdUserArcheTuning,
  TfdUserArcheTuningRequest,
  TfdUserBasic,
  TfdUserDescendant,
  TfdUserExternalComponent,
  TfdUserLocalizedRequest,
  TfdUserReactor,
  TfdUserRequest,
  TfdUserWeapon,
} from './types.js';

const OUID_HINT =
  "client.firstDescendant.getOuid('닉네임#1234') 로 얻은 ouid를 { ouid } 형태로 넘기세요.";

/**
 * 퍼스트 디센던트 계정 정보 조회 클라이언트.
 *
 * 게임 데이터는 평균 10분 뒤 반영된다. 6개월 이상 접속하지 않은 계정은 조회되지 않을 수 있다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
 * const basic = await client.firstDescendant.user.getBasic({ ouid });
 * const weapon = await client.firstDescendant.user.getWeapon({ ouid, language_code: 'ko' });
 * ```
 */
export class FirstDescendantUserClient {
  private static readonly BASE = 'https://open.api.nexon.com/tfd/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 계정 기본 정보를 조회한다.
   *
   * @param params - `ouid` (계정 식별자)
   * @throws {NexonError} ouid가 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const basic = await client.firstDescendant.user.getBasic({ ouid });
   * console.log(basic.user_name, basic.mastery_rank_level);
   * ```
   */
  async getBasic(params: TfdUserRequest): Promise<TfdUserBasic> {
    assertNonEmpty(params.ouid, 'ouid', OUID_HINT);
    return this.http.get<TfdUserBasic>(
      `${FirstDescendantUserClient.BASE}/user/basic`,
      { ouid: params.ouid },
      TFD_USER_BASIC_SHAPE,
    );
  }

  /**
   * 장착한 계승자 정보를 조회한다.
   *
   * 장착 모듈·커스터마이징 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
   *
   * @param params - `ouid` (계정 식별자)
   * @throws {NexonError} ouid가 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const descendant = await client.firstDescendant.user.getDescendant({ ouid });
   * console.log(descendant.descendant_id, descendant.module.length);
   * ```
   */
  async getDescendant(params: TfdUserRequest): Promise<TfdUserDescendant> {
    assertNonEmpty(params.ouid, 'ouid', OUID_HINT);
    return this.http.get<TfdUserDescendant>(
      `${FirstDescendantUserClient.BASE}/user/descendant`,
      { ouid: params.ouid },
      TFD_USER_DESCENDANT_SHAPE,
    );
  }

  /**
   * 장착한 모든 슬롯의 무기 정보를 조회한다.
   *
   * 장착 모듈 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
   *
   * @param params - `ouid` (계정 식별자), `language_code` (옵션 이름의 언어, 기본값 `'ko'`)
   * @throws {NexonError} ouid가 비어 있거나 language_code가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const { weapon } = await client.firstDescendant.user.getWeapon({ ouid, language_code: 'en' });
   * for (const w of weapon) console.log(w.weapon_id, w.weapon_level);
   * ```
   */
  async getWeapon(params: TfdUserLocalizedRequest): Promise<TfdUserWeapon> {
    assertNonEmpty(params.ouid, 'ouid', OUID_HINT);
    const languageCode = assertLanguageCode(params.language_code ?? 'ko');
    return this.http.get<TfdUserWeapon>(
      `${FirstDescendantUserClient.BASE}/user/weapon`,
      { language_code: languageCode, ouid: params.ouid },
      TFD_USER_WEAPON_SHAPE,
    );
  }

  /**
   * 장착한 반응로 정보를 조회한다.
   *
   * @param params - `ouid` (계정 식별자), `language_code` (옵션 이름의 언어, 기본값 `'ko'`)
   * @throws {NexonError} ouid가 비어 있거나 language_code가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const reactor = await client.firstDescendant.user.getReactor({ ouid });
   * console.log(reactor.reactor_id, reactor.reactor_additional_stat);
   * ```
   */
  async getReactor(params: TfdUserLocalizedRequest): Promise<TfdUserReactor> {
    assertNonEmpty(params.ouid, 'ouid', OUID_HINT);
    const languageCode = assertLanguageCode(params.language_code ?? 'ko');
    return this.http.get<TfdUserReactor>(
      `${FirstDescendantUserClient.BASE}/user/reactor`,
      { language_code: languageCode, ouid: params.ouid },
      TFD_USER_REACTOR_SHAPE,
    );
  }

  /**
   * 장착한 모든 슬롯의 외장 부품 정보를 조회한다.
   *
   * @param params - `ouid` (계정 식별자), `language_code` (옵션 이름의 언어, 기본값 `'ko'`)
   * @throws {NexonError} ouid가 비어 있거나 language_code가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const result = await client.firstDescendant.user.getExternalComponent({ ouid });
   * for (const part of result.external_component) console.log(part.external_component_id);
   * ```
   */
  async getExternalComponent(params: TfdUserLocalizedRequest): Promise<TfdUserExternalComponent> {
    assertNonEmpty(params.ouid, 'ouid', OUID_HINT);
    const languageCode = assertLanguageCode(params.language_code ?? 'ko');
    return this.http.get<TfdUserExternalComponent>(
      `${FirstDescendantUserClient.BASE}/user/external-component`,
      { language_code: languageCode, ouid: params.ouid },
      TFD_USER_EXTERNAL_COMPONENT_SHAPE,
    );
  }

  /**
   * 아르케 조율 정보를 조회한다. 계승자 그룹별로 활성화한 노드와 좌표가 내려온다.
   *
   * @param params - `ouid` (계정 식별자), `descendant_group_id` (계승자 그룹 식별자)
   * @throws {NexonError} ouid 또는 descendant_group_id가 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} 파라미터가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const groups = await client.firstDescendant.meta.getDescendantGroup('ko');
   * const groupId = groups[0]?.descendant_group_id;
   * if (groupId !== undefined) {
   *   const tuning = await client.firstDescendant.user.getArcheTuning({
   *     ouid,
   *     descendant_group_id: groupId,
   *   });
   *   console.log(tuning.arche_tuning.length);
   * }
   * ```
   */
  async getArcheTuning(params: TfdUserArcheTuningRequest): Promise<TfdUserArcheTuning> {
    assertNonEmpty(params.ouid, 'ouid', OUID_HINT);
    assertNonEmpty(
      params.descendant_group_id,
      'descendant_group_id',
      'client.firstDescendant.meta.getDescendantGroup() 응답의 descendant_group_id를 넘기세요.',
    );
    return this.http.get<TfdUserArcheTuning>(
      `${FirstDescendantUserClient.BASE}/user/arche-tuning`,
      { ouid: params.ouid, descendant_group_id: params.descendant_group_id },
      TFD_USER_ARCHE_TUNING_SHAPE,
    );
  }
}
