import { assertNonEmptyString, assertOneOf } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { TFD_LANGUAGE_CODES } from '../types.js';
import {
  TFD_USER_ARCHE_TUNING_SHAPE,
  TFD_USER_BASIC_SHAPE,
  TFD_USER_DESCENDANT_SHAPE,
  TFD_USER_EXTERNAL_COMPONENT_SHAPE,
  TFD_USER_REACTOR_SHAPE,
  TFD_USER_WEAPON_SHAPE,
} from '../shapes.js';
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
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
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
   * 프로필의 마스터리 랭크와 타이틀·훈장 정보를 조회한다.
   *
   * @param params - `ouid`는 `getOuid()`로 찾은 계정 고유 번호
   * @throws {NexonBadRequestError} ouid가 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
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
   * // 프로필 카드에 마스터리 랭크를 표시할 때
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const basic = await client.firstDescendant.user.getBasic({ ouid });
   * console.log(basic.user_name, basic.mastery_rank_level);
   * ```
   */
  async getBasic(params: TfdUserRequest): Promise<TfdUserBasic> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    return this.http.get<TfdUserBasic>(
      `${FirstDescendantUserClient.BASE}/user/basic`,
      { ouid: params.ouid },
      TFD_USER_BASIC_SHAPE,
    );
  }

  /**
   * 장착한 계승자의 레벨·모듈·커스터마이징을 조회한다.
   *
   * 장착 모듈·커스터마이징 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
   *
   * @param params - `ouid`는 `getOuid()`로 찾은 계정 고유 번호
   * @throws {NexonBadRequestError} ouid가 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
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
   * // 빌드 카드에 계승자와 장착 모듈 수를 표시할 때
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const descendant = await client.firstDescendant.user.getDescendant({ ouid });
   * console.log(descendant.descendant_id, descendant.module.length);
   * ```
   */
  async getDescendant(params: TfdUserRequest): Promise<TfdUserDescendant> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    return this.http.get<TfdUserDescendant>(
      `${FirstDescendantUserClient.BASE}/user/descendant`,
      { ouid: params.ouid },
      TFD_USER_DESCENDANT_SHAPE,
    );
  }

  /**
   * 모든 슬롯의 장착 무기와 무기 모듈을 조회한다.
   *
   * 장착 모듈 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
   *
   * @param params - `ouid`는 `getOuid()`로 찾은 계정 고유 번호, `language_code`는 옵션 이름의 언어(기본값 `'ko'`)
   * @throws {NexonBadRequestError} ouid가 비어 있거나 language_code가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
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
   * // 영문 무기 빌드 카드에 슬롯별 무기 레벨을 표시할 때
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const { weapon } = await client.firstDescendant.user.getWeapon({ ouid, language_code: 'en' });
   * for (const w of weapon) console.log(w.weapon_id, w.weapon_level);
   * ```
   */
  async getWeapon(params: TfdUserLocalizedRequest): Promise<TfdUserWeapon> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    const languageCode = params.language_code ?? 'ko';
    assertOneOf(
      languageCode,
      TFD_LANGUAGE_CODES,
      'language_code',
      '언어 코드는 대소문자를 구분합니다.',
    );
    return this.http.get<TfdUserWeapon>(
      `${FirstDescendantUserClient.BASE}/user/weapon`,
      { language_code: languageCode, ouid: params.ouid },
      TFD_USER_WEAPON_SHAPE,
    );
  }

  /**
   * 장착 반응로의 레벨·강화 단계·랜덤 옵션을 조회한다.
   *
   * @param params - `ouid`는 `getOuid()`로 찾은 계정 고유 번호, `language_code`는 옵션 이름의 언어(기본값 `'ko'`)
   * @throws {NexonBadRequestError} ouid가 비어 있거나 language_code가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
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
   * // 반응로 비교 카드에 장착 반응로의 옵션을 표시할 때
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const reactor = await client.firstDescendant.user.getReactor({ ouid });
   * console.log(reactor.reactor_id, reactor.reactor_additional_stat);
   * ```
   */
  async getReactor(params: TfdUserLocalizedRequest): Promise<TfdUserReactor> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    const languageCode = params.language_code ?? 'ko';
    assertOneOf(
      languageCode,
      TFD_LANGUAGE_CODES,
      'language_code',
      '언어 코드는 대소문자를 구분합니다.',
    );
    return this.http.get<TfdUserReactor>(
      `${FirstDescendantUserClient.BASE}/user/reactor`,
      { language_code: languageCode, ouid: params.ouid },
      TFD_USER_REACTOR_SHAPE,
    );
  }

  /**
   * 모든 슬롯의 장착 외장 부품과 코어 옵션을 조회한다.
   *
   * @param params - `ouid`는 `getOuid()`로 찾은 계정 고유 번호, `language_code`는 옵션 이름의 언어(기본값 `'ko'`)
   * @throws {NexonBadRequestError} ouid가 비어 있거나 language_code가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
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
   * // 외장 부품 세트 구성을 표시할 때
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const result = await client.firstDescendant.user.getExternalComponent({ ouid });
   * for (const part of result.external_component) console.log(part.external_component_id);
   * ```
   */
  async getExternalComponent(params: TfdUserLocalizedRequest): Promise<TfdUserExternalComponent> {
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    const languageCode = params.language_code ?? 'ko';
    assertOneOf(
      languageCode,
      TFD_LANGUAGE_CODES,
      'language_code',
      '언어 코드는 대소문자를 구분합니다.',
    );
    return this.http.get<TfdUserExternalComponent>(
      `${FirstDescendantUserClient.BASE}/user/external-component`,
      { language_code: languageCode, ouid: params.ouid },
      TFD_USER_EXTERNAL_COMPONENT_SHAPE,
    );
  }

  /**
   * 계승자 그룹별 아르케 조율 보드와 활성화한 노드를 조회한다.
   *
   * @param params - `ouid`는 `getOuid()`로 찾은 계정 고유 번호, `descendant_group_id`는 `meta.getDescendantGroup()`에서 찾은 계승자 그룹 번호
   * @throws {NexonBadRequestError} ouid 또는 descendant_group_id가 비어 있을 때 (요청 전 SDK 검증)
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
   * // 빌드 공유 화면에 아르케 조율 슬롯을 표시할 때
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
    assertNonEmptyString(params.ouid, 'ouid', OUID_HINT);
    assertNonEmptyString(
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
