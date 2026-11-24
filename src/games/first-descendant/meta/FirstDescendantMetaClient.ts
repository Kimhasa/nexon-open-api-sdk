import { assertOneOf } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { TFD_LANGUAGE_CODES } from '../types.js';
import type { TfdLanguageCode } from '../types.js';
import type {
  TfdAcquisitionDetailMeta,
  TfdAdaptLevelMeta,
  TfdAmorphousRewardMeta,
  TfdArcheTuningBoardGroupMeta,
  TfdArcheTuningBoardMeta,
  TfdArcheTuningNodeMeta,
  TfdCollectibleItemMeta,
  TfdConsumableMaterialMeta,
  TfdCoreSlotMeta,
  TfdCoreTypeMeta,
  TfdCustomizingItemMeta,
  TfdDescendantGroupMeta,
  TfdDescendantLevelDetailMeta,
  TfdDescendantMeta,
  TfdExternalComponentMeta,
  TfdFellowLevelDetailMeta,
  TfdFellowMeta,
  TfdMasteryRankLevelDetailMeta,
  TfdMedalMeta,
  TfdModuleMeta,
  TfdNodeItemMeta,
  TfdNodeSocketTypeMeta,
  TfdReactorMeta,
  TfdResearchMeta,
  TfdRewardMeta,
  TfdStatMeta,
  TfdTierMeta,
  TfdTitleMeta,
  TfdVehicleMeta,
  TfdVoidBattleMeta,
  TfdWeaponMeta,
  TfdWeaponTypeMeta,
} from './types.js';
import {
  TFD_ACQUISITION_DETAIL_META_SHAPE,
  TFD_ARCHE_TUNING_NODE_META_SHAPE,
  TFD_COLLECTIBLE_ITEM_META_SHAPE,
  TFD_CONSUMABLE_MATERIAL_META_SHAPE,
  TFD_CORE_TYPE_META_SHAPE,
  TFD_CUSTOMIZING_ITEM_META_SHAPE,
  TFD_DESCENDANT_META_SHAPE,
  TFD_DESCENDANT_GROUP_META_SHAPE,
  TFD_EXTERNAL_COMPONENT_META_SHAPE,
  TFD_FELLOW_META_SHAPE,
  TFD_MEDAL_META_SHAPE,
  TFD_MODULE_META_SHAPE,
  TFD_NODE_ITEM_META_SHAPE,
  TFD_NODE_SOCKET_TYPE_META_SHAPE,
  TFD_REACTOR_META_SHAPE,
  TFD_RESEARCH_META_SHAPE,
  TFD_REWARD_META_SHAPE,
  TFD_STAT_META_SHAPE,
  TFD_TIER_META_SHAPE,
  TFD_TITLE_META_SHAPE,
  TFD_VEHICLE_META_SHAPE,
  TFD_VOID_BATTLE_META_SHAPE,
  TFD_WEAPON_META_SHAPE,
  TFD_WEAPON_TYPE_META_SHAPE,
  TFD_ADAPT_LEVEL_META_SHAPE,
  TFD_AMORPHOUS_REWARD_META_SHAPE,
  TFD_ARCHE_TUNING_BOARD_META_SHAPE,
  TFD_ARCHE_TUNING_BOARD_GROUP_META_SHAPE,
  TFD_CORE_SLOT_META_SHAPE,
  TFD_DESCENDANT_LEVEL_DETAIL_META_SHAPE,
  TFD_FELLOW_LEVEL_DETAIL_META_SHAPE,
  TFD_MASTERY_RANK_LEVEL_DETAIL_META_SHAPE,
} from './shapes.js';

const LANGUAGE_CODE_HINT = '언어 코드는 대소문자를 구분합니다.';

/**
 * 계승자·무기·모듈 등 게임 도감의 이름, 이미지, 능력치를 조회한다.
 *
 * 계정 조회에서 받은 ID를 도감의 ID와 연결해 게임 내 이름을 표시한다.
 * 모든 도감은 배열을 반환한다. 일부 도감 파일은 2 MB를 넘으므로 캐시해 재사용한다.
 * 표시 언어를 받는 도감의 기본값은 한국어(`ko`)다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 *
 * const descendants = await client.firstDescendant.meta.getDescendant('en');
 * const byId = new Map(descendants.map((d) => [d.descendant_id, d]));
 * ```
 */
export class FirstDescendantMetaClient {
  private static readonly BASE = 'https://open.api.nexon.com/static/tfd/meta';

  constructor(private readonly http: HttpClient) {}

  // ─── 언어별 메타데이터 (/static/tfd/meta/{language_code}/...) ────────────

  /**
   * 도감의 획득처 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 재료 획득처 검색에 도감의 설명을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getAcquisitionDetail('ko');
   * if (entry) console.log(entry.acquisition_detail_id, entry.acquisition_detail_name);
   * ```
   */
  async getAcquisitionDetail(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdAcquisitionDetailMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdAcquisitionDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/acquisition-detail.json`,
      undefined,
      TFD_ACQUISITION_DETAIL_META_SHAPE,
    );
  }

  /**
   * 도감의 아르케 조율 노드 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 아르케 조율 계산기에서 노드 효과를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getArcheTuningNode('ko');
   * if (entry) console.log(entry.node_name, entry.node_effect);
   * ```
   */
  async getArcheTuningNode(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdArcheTuningNodeMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdArcheTuningNodeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/arche-tuning-node.json`,
      undefined,
      TFD_ARCHE_TUNING_NODE_META_SHAPE,
    );
  }

  /**
   * 도감의 수집형 아이템 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 수집 도감에 아이템 이름과 설명을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getCollectibleItem('ko');
   * if (entry) console.log(entry.collectible_item_name, entry.collectible_item_description);
   * ```
   */
  async getCollectibleItem(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdCollectibleItemMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdCollectibleItemMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/collectible-item.json`,
      undefined,
      TFD_COLLECTIBLE_ITEM_META_SHAPE,
    );
  }

  /**
   * 도감의 소비 아이템 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 연구 재료 검색에서 소비 아이템을 이름으로 표시할 때
   * const [entry] = await client.firstDescendant.meta.getConsumableMaterial('ko');
   * if (entry) console.log(entry.consumable_material_id, entry.consumable_material_name);
   * ```
   */
  async getConsumableMaterial(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdConsumableMaterialMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdConsumableMaterialMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/consumable-material.json`,
      undefined,
      TFD_CONSUMABLE_MATERIAL_META_SHAPE,
    );
  }

  /**
   * 도감의 코어 유형 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 코어 계산기에서 코어 유형별 옵션을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getCoreType('ko');
   * if (entry) console.log(entry.core_type_id, entry.core_option);
   * ```
   */
  async getCoreType(languageCode: TfdLanguageCode = 'ko'): Promise<TfdCoreTypeMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdCoreTypeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/core-type.json`,
      undefined,
      TFD_CORE_TYPE_META_SHAPE,
    );
  }

  /**
   * 도감의 커스터마이징 아이템 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 외형 공유 페이지에서 꾸미기 아이템의 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getCustomizingItem('ko');
   * if (entry) console.log(entry.customizing_item_id, entry.customizing_item_name);
   * ```
   */
  async getCustomizingItem(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdCustomizingItemMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdCustomizingItemMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/customizing-item.json`,
      undefined,
      TFD_CUSTOMIZING_ITEM_META_SHAPE,
    );
  }

  /**
   * 도감의 계승자 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 빌드 카드의 계승자 번호를 게임 내 이름으로 표시할 때
   * const [entry] = await client.firstDescendant.meta.getDescendant('ko');
   * if (entry) console.log(entry.descendant_id, entry.descendant_name);
   * ```
   */
  async getDescendant(languageCode: TfdLanguageCode = 'ko'): Promise<TfdDescendantMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdDescendantMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/descendant.json`,
      undefined,
      TFD_DESCENDANT_META_SHAPE,
    );
  }

  /**
   * 도감의 계승자 그룹 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 계승자 그룹 이름으로 아르케 조율 대상을 고를 때
   * const [entry] = await client.firstDescendant.meta.getDescendantGroup('ko');
   * if (entry) console.log(entry.descendant_group_id, entry.descendant_group_name);
   * ```
   */
  async getDescendantGroup(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdDescendantGroupMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdDescendantGroupMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/descendant-group.json`,
      undefined,
      TFD_DESCENDANT_GROUP_META_SHAPE,
    );
  }

  /**
   * 도감의 외장 부품 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 외장 부품 세트의 이름과 효과를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getExternalComponent('ko');
   * if (entry) console.log(entry.external_component_name, entry.set_option_detail);
   * ```
   */
  async getExternalComponent(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdExternalComponentMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdExternalComponentMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/external-component.json`,
      undefined,
      TFD_EXTERNAL_COMPONENT_META_SHAPE,
    );
  }

  /**
   * 도감의 조력자 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 조력자 도감에 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getFellow('ko');
   * if (entry) console.log(entry.fellow_id, entry.fellow_name);
   * ```
   */
  async getFellow(languageCode: TfdLanguageCode = 'ko'): Promise<TfdFellowMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdFellowMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/fellow.json`,
      undefined,
      TFD_FELLOW_META_SHAPE,
    );
  }

  /**
   * 도감의 훈장 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 유저 프로필에 훈장 단계별 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getMedal('ko');
   * if (entry) console.log(entry.medal_id, entry.medal_detail);
   * ```
   */
  async getMedal(languageCode: TfdLanguageCode = 'ko'): Promise<TfdMedalMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdMedalMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/medal.json`,
      undefined,
      TFD_MEDAL_META_SHAPE,
    );
  }

  /**
   * 도감의 모듈 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 빌드 카드의 장착 모듈 번호를 이름으로 표시할 때
   * const [entry] = await client.firstDescendant.meta.getModule('ko');
   * if (entry) console.log(entry.module_id, entry.module_name);
   * ```
   */
  async getModule(languageCode: TfdLanguageCode = 'ko'): Promise<TfdModuleMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdModuleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/module.json`,
      undefined,
      TFD_MODULE_META_SHAPE,
    );
  }

  /**
   * 도감의 변이 세포 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 아르케 조율 페이지에서 변이 세포 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getNodeItem('ko');
   * if (entry) console.log(entry.node_item_id, entry.node_item_name);
   * ```
   */
  async getNodeItem(languageCode: TfdLanguageCode = 'ko'): Promise<TfdNodeItemMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdNodeItemMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/node-item.json`,
      undefined,
      TFD_NODE_ITEM_META_SHAPE,
    );
  }

  /**
   * 도감의 변이 세포 소켓 유형 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 변이 세포 도감에서 장착할 소켓 유형을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getNodeSocketType('ko');
   * if (entry) console.log(entry.node_item_socket_type, entry.node_item_socket_name);
   * ```
   */
  async getNodeSocketType(languageCode: TfdLanguageCode = 'ko'): Promise<TfdNodeSocketTypeMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdNodeSocketTypeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/node-socket-type.json`,
      undefined,
      TFD_NODE_SOCKET_TYPE_META_SHAPE,
    );
  }

  /**
   * 도감의 반응로 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 반응로 검색에서 이름과 스킬 위력을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getReactor('ko');
   * if (entry) console.log(entry.reactor_name, entry.reactor_skill_power);
   * ```
   */
  async getReactor(languageCode: TfdLanguageCode = 'ko'): Promise<TfdReactorMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdReactorMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/reactor.json`,
      undefined,
      TFD_REACTOR_META_SHAPE,
    );
  }

  /**
   * 도감의 연구 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 연구 계획표에 필요한 재료를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getResearch('ko');
   * if (entry) console.log(entry.research_name, entry.research_material);
   * ```
   */
  async getResearch(languageCode: TfdLanguageCode = 'ko'): Promise<TfdResearchMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdResearchMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/research.json`,
      undefined,
      TFD_RESEARCH_META_SHAPE,
    );
  }

  /**
   * 도감의 난이도 보상 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 난이도 보상 검색에서 지역과 전장별 보상을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getReward('ko');
   * if (entry) console.log(entry.map_name, entry.battle_zone);
   * ```
   */
  async getReward(languageCode: TfdLanguageCode = 'ko'): Promise<TfdRewardMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdRewardMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/reward.json`,
      undefined,
      TFD_REWARD_META_SHAPE,
    );
  }

  /**
   * 도감의 기본 스탯 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 빌드 계산기에서 스탯 번호를 표시 이름으로 바꿀 때
   * const [entry] = await client.firstDescendant.meta.getStat('ko');
   * if (entry) console.log(entry.stat_id, entry.stat_name);
   * ```
   */
  async getStat(languageCode: TfdLanguageCode = 'ko'): Promise<TfdStatMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdStatMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/stat.json`,
      undefined,
      TFD_STAT_META_SHAPE,
    );
  }

  /**
   * 도감의 등급 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 장비 검색 필터에 알맞은 등급 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getTier('ko');
   * if (entry) console.log(entry.tier_id, entry.tier_name);
   * ```
   */
  async getTier(languageCode: TfdLanguageCode = 'ko'): Promise<TfdTierMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdTierMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/tier.json`,
      undefined,
      TFD_TIER_META_SHAPE,
    );
  }

  /**
   * 도감의 타이틀 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 프로필 타이틀 번호를 표시 이름으로 바꿀 때
   * const [entry] = await client.firstDescendant.meta.getTitle('ko');
   * if (entry) console.log(entry.title_id, entry.title_name);
   * ```
   */
  async getTitle(languageCode: TfdLanguageCode = 'ko'): Promise<TfdTitleMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdTitleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/title.json`,
      undefined,
      TFD_TITLE_META_SHAPE,
    );
  }

  /**
   * 도감의 탈것 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 탈것 도감에 모델별 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getVehicle('ko');
   * if (entry) console.log(entry.vehicle_id, entry.vehicle_name);
   * ```
   */
  async getVehicle(languageCode: TfdLanguageCode = 'ko'): Promise<TfdVehicleMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdVehicleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/vehicle.json`,
      undefined,
      TFD_VEHICLE_META_SHAPE,
    );
  }

  /**
   * 도감의 보이드 요격전 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 보이드 요격전 공략에 요격전 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getVoidBattle('ko');
   * if (entry) console.log(entry.void_battle_id, entry.void_battle_name);
   * ```
   */
  async getVoidBattle(languageCode: TfdLanguageCode = 'ko'): Promise<TfdVoidBattleMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdVoidBattleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/void-battle.json`,
      undefined,
      TFD_VOID_BATTLE_META_SHAPE,
    );
  }

  /**
   * 도감의 무기 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 빌드 카드에서 장착 무기 번호를 이름으로 바꿀 때
   * const [entry] = await client.firstDescendant.meta.getWeapon('ko');
   * if (entry) console.log(entry.weapon_id, entry.weapon_name);
   * ```
   */
  async getWeapon(languageCode: TfdLanguageCode = 'ko'): Promise<TfdWeaponMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdWeaponMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/weapon.json`,
      undefined,
      TFD_WEAPON_META_SHAPE,
    );
  }

  /**
   * 도감의 무기 유형 정보를 조회한다.
   *
   * @param languageCode - 도감의 이름과 설명을 받을 언어 코드. 기본값은 한국어('ko')다.
   * @throws {NexonBadRequestError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 무기 검색 필터에 무기 유형 이름을 표시할 때
   * const [entry] = await client.firstDescendant.meta.getWeaponType('ko');
   * if (entry) console.log(entry.weapon_type, entry.weapon_type_name);
   * ```
   */
  async getWeaponType(languageCode: TfdLanguageCode = 'ko'): Promise<TfdWeaponTypeMeta[]> {
    assertOneOf(languageCode, TFD_LANGUAGE_CODES, 'languageCode', LANGUAGE_CODE_HINT);
    return this.http.get<TfdWeaponTypeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${languageCode}/weapon-type.json`,
      undefined,
      TFD_WEAPON_TYPE_META_SHAPE,
    );
  }

  // ─── 공통 메타데이터 (/static/tfd/meta/...) ──────────────────────────────

  /**
   * 적응도 레벨 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 성장 계산기에서 적응도 레벨별 경험치를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getAdaptLevel();
   * if (entry) console.log(entry.level, entry.exp_per_level);
   * ```
   */
  async getAdaptLevel(): Promise<TfdAdaptLevelMeta[]> {
    return this.http.get<TfdAdaptLevelMeta[]>(
      `${FirstDescendantMetaClient.BASE}/adapt-level.json`,
      undefined,
      TFD_ADAPT_LEVEL_META_SHAPE,
    );
  }

  /**
   * 비정형 물질 개봉 보상 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 비정형 물질 보상표에서 개봉 보상 후보를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getAmorphousReward();
   * if (entry) console.log(entry.amorphous_reward_id, entry.open_reward);
   * ```
   */
  async getAmorphousReward(): Promise<TfdAmorphousRewardMeta[]> {
    return this.http.get<TfdAmorphousRewardMeta[]>(
      `${FirstDescendantMetaClient.BASE}/amorphous-reward.json`,
      undefined,
      TFD_AMORPHOUS_REWARD_META_SHAPE,
    );
  }

  /**
   * 아르케 조율 보드 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 아르케 조율 보드의 모양과 노드 배치를 그릴 때
   * const [entry] = await client.firstDescendant.meta.getArcheTuningBoard();
   * if (entry) console.log(entry.row_size, entry.column_size, entry.node);
   * ```
   */
  async getArcheTuningBoard(): Promise<TfdArcheTuningBoardMeta[]> {
    return this.http.get<TfdArcheTuningBoardMeta[]>(
      `${FirstDescendantMetaClient.BASE}/arche-tuning-board.json`,
      undefined,
      TFD_ARCHE_TUNING_BOARD_META_SHAPE,
    );
  }

  /**
   * 아르케 조율 보드 그룹 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 계승자 그룹에 맞는 아르케 조율 보드를 찾을 때
   * const [entry] = await client.firstDescendant.meta.getArcheTuningBoardGroup();
   * if (entry) console.log(entry.descendant_group_id, entry.arche_tuning_board_id);
   * ```
   */
  async getArcheTuningBoardGroup(): Promise<TfdArcheTuningBoardGroupMeta[]> {
    return this.http.get<TfdArcheTuningBoardGroupMeta[]>(
      `${FirstDescendantMetaClient.BASE}/arche-tuning-board-group.json`,
      undefined,
      TFD_ARCHE_TUNING_BOARD_GROUP_META_SHAPE,
    );
  }

  /**
   * 코어 슬롯 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 장비 계산기에서 슬롯별 장착 가능한 코어 유형을 찾을 때
   * const [entry] = await client.firstDescendant.meta.getCoreSlot();
   * if (entry) console.log(entry.core_slot_id, entry.available_core_type_id);
   * ```
   */
  async getCoreSlot(): Promise<TfdCoreSlotMeta[]> {
    return this.http.get<TfdCoreSlotMeta[]>(
      `${FirstDescendantMetaClient.BASE}/core-slot.json`,
      undefined,
      TFD_CORE_SLOT_META_SHAPE,
    );
  }

  /**
   * 계승자 레벨별 경험치 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 계승자 성장 계산기에서 레벨별 경험치를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getDescendantLevelDetail();
   * if (entry) console.log(entry.descendant_level, entry.exp_per_level);
   * ```
   */
  async getDescendantLevelDetail(): Promise<TfdDescendantLevelDetailMeta[]> {
    return this.http.get<TfdDescendantLevelDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/descendant-level-detail.json`,
      undefined,
      TFD_DESCENDANT_LEVEL_DETAIL_META_SHAPE,
    );
  }

  /**
   * 조력자 레벨별 경험치 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 조력자 성장 계산기에 레벨별 경험치를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getFellowLevelDetail();
   * if (entry) console.log(entry.fellow_level, entry.exp_per_level);
   * ```
   */
  async getFellowLevelDetail(): Promise<TfdFellowLevelDetailMeta[]> {
    return this.http.get<TfdFellowLevelDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/fellow-level-detail.json`,
      undefined,
      TFD_FELLOW_LEVEL_DETAIL_META_SHAPE,
    );
  }

  /**
   * 마스터리 랭크별 경험치 정보를 조회한다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 마스터리 성장 계산기에서 랭크별 경험치를 표시할 때
   * const [entry] = await client.firstDescendant.meta.getMasteryRankLevelDetail();
   * if (entry) console.log(entry.mastery_level, entry.exp_per_level);
   * ```
   */
  async getMasteryRankLevelDetail(): Promise<TfdMasteryRankLevelDetailMeta[]> {
    return this.http.get<TfdMasteryRankLevelDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/mastery-rank-level-detail.json`,
      undefined,
      TFD_MASTERY_RANK_LEVEL_DETAIL_META_SHAPE,
    );
  }
}
