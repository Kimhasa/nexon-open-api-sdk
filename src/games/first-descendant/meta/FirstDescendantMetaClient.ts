import type { HttpClient } from '../../../core/http/HttpClient.js';
import type { TfdLanguageCode } from '../types.js';
import { assertLanguageCode } from '../validate.js';
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

/**
 * 퍼스트 디센던트 메타데이터 조회 클라이언트.
 *
 * 계정·리더보드 API가 돌려주는 각종 id(계승자, 무기, 모듈 등)를 이름·이미지·수치로 풀어 주는
 * 정적 JSON이다. 응답은 모두 배열이고 파일 하나가 수백 KB~2 MB에 이르므로, 호출 결과를
 * 애플리케이션에서 캐시해 두고 쓰는 것을 권한다.
 *
 * 메서드 이름은 스펙의 파일 이름과 1:1이다 (`descendant.json` → `getDescendant()`).
 *
 * - 이름·설명이 들어가는 24개는 언어 코드를 받는다 (기본값 `'ko'`).
 * - 수치만 있는 8개는 인자가 없다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
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
   * 획득처 정보 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getAcquisitionDetail('ko');
   * console.log(items.length, items[0]?.acquisition_detail_id);
   * ```
   */
  async getAcquisitionDetail(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdAcquisitionDetailMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdAcquisitionDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/acquisition-detail.json`,
    );
  }

  /**
   * 아르케 조율 노드 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getArcheTuningNode('ko');
   * console.log(items.length, items[0]?.node_id);
   * ```
   */
  async getArcheTuningNode(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdArcheTuningNodeMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdArcheTuningNodeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/arche-tuning-node.json`,
    );
  }

  /**
   * 수집형 아이템 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getCollectibleItem('ko');
   * console.log(items.length, items[0]?.collectible_item_id);
   * ```
   */
  async getCollectibleItem(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdCollectibleItemMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdCollectibleItemMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/collectible-item.json`,
    );
  }

  /**
   * 소비 아이템 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getConsumableMaterial('ko');
   * console.log(items.length, items[0]?.consumable_material_id);
   * ```
   */
  async getConsumableMaterial(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdConsumableMaterialMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdConsumableMaterialMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/consumable-material.json`,
    );
  }

  /**
   * 코어 타입 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getCoreType('ko');
   * console.log(items.length, items[0]?.core_type_id);
   * ```
   */
  async getCoreType(languageCode: TfdLanguageCode = 'ko'): Promise<TfdCoreTypeMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdCoreTypeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/core-type.json`,
    );
  }

  /**
   * 커스터마이징 아이템 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getCustomizingItem('ko');
   * console.log(items.length, items[0]?.customizing_item_id);
   * ```
   */
  async getCustomizingItem(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdCustomizingItemMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdCustomizingItemMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/customizing-item.json`,
    );
  }

  /**
   * 계승자 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getDescendant('ko');
   * console.log(items.length, items[0]?.descendant_id);
   * ```
   */
  async getDescendant(languageCode: TfdLanguageCode = 'ko'): Promise<TfdDescendantMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdDescendantMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/descendant.json`,
    );
  }

  /**
   * 계승자 그룹 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getDescendantGroup('ko');
   * console.log(items.length, items[0]?.descendant_group_id);
   * ```
   */
  async getDescendantGroup(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdDescendantGroupMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdDescendantGroupMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/descendant-group.json`,
    );
  }

  /**
   * 외장 부품 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getExternalComponent('ko');
   * console.log(items.length, items[0]?.external_component_id);
   * ```
   */
  async getExternalComponent(
    languageCode: TfdLanguageCode = 'ko',
  ): Promise<TfdExternalComponentMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdExternalComponentMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/external-component.json`,
    );
  }

  /**
   * 조력자 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getFellow('ko');
   * console.log(items.length, items[0]?.fellow_id);
   * ```
   */
  async getFellow(languageCode: TfdLanguageCode = 'ko'): Promise<TfdFellowMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdFellowMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/fellow.json`,
    );
  }

  /**
   * 훈장 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getMedal('ko');
   * console.log(items.length, items[0]?.medal_id);
   * ```
   */
  async getMedal(languageCode: TfdLanguageCode = 'ko'): Promise<TfdMedalMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdMedalMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/medal.json`,
    );
  }

  /**
   * 모듈 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getModule('ko');
   * console.log(items.length, items[0]?.module_name);
   * ```
   */
  async getModule(languageCode: TfdLanguageCode = 'ko'): Promise<TfdModuleMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdModuleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/module.json`,
    );
  }

  /**
   * 변이 세포 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getNodeItem('ko');
   * console.log(items.length, items[0]?.node_item_id);
   * ```
   */
  async getNodeItem(languageCode: TfdLanguageCode = 'ko'): Promise<TfdNodeItemMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdNodeItemMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/node-item.json`,
    );
  }

  /**
   * 변이 세포 소켓 타입 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getNodeSocketType('ko');
   * console.log(items.length, items[0]?.node_item_socket_type);
   * ```
   */
  async getNodeSocketType(languageCode: TfdLanguageCode = 'ko'): Promise<TfdNodeSocketTypeMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdNodeSocketTypeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/node-socket-type.json`,
    );
  }

  /**
   * 반응로 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getReactor('ko');
   * console.log(items.length, items[0]?.reactor_id);
   * ```
   */
  async getReactor(languageCode: TfdLanguageCode = 'ko'): Promise<TfdReactorMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdReactorMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/reactor.json`,
    );
  }

  /**
   * 연구 정보 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getResearch('ko');
   * console.log(items.length, items[0]?.research_id);
   * ```
   */
  async getResearch(languageCode: TfdLanguageCode = 'ko'): Promise<TfdResearchMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdResearchMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/research.json`,
    );
  }

  /**
   * 난이도 보상 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getReward('ko');
   * console.log(items.length, items[0]?.map_id);
   * ```
   */
  async getReward(languageCode: TfdLanguageCode = 'ko'): Promise<TfdRewardMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdRewardMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/reward.json`,
    );
  }

  /**
   * 기본 스탯 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getStat('ko');
   * console.log(items.length, items[0]?.stat_id);
   * ```
   */
  async getStat(languageCode: TfdLanguageCode = 'ko'): Promise<TfdStatMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdStatMeta[]>(`${FirstDescendantMetaClient.BASE}/${language}/stat.json`);
  }

  /**
   * 등급 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getTier('ko');
   * console.log(items.length, items[0]?.tier_id);
   * ```
   */
  async getTier(languageCode: TfdLanguageCode = 'ko'): Promise<TfdTierMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdTierMeta[]>(`${FirstDescendantMetaClient.BASE}/${language}/tier.json`);
  }

  /**
   * 타이틀 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getTitle('ko');
   * console.log(items.length, items[0]?.title_id);
   * ```
   */
  async getTitle(languageCode: TfdLanguageCode = 'ko'): Promise<TfdTitleMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdTitleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/title.json`,
    );
  }

  /**
   * 탈것 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getVehicle('ko');
   * console.log(items.length, items[0]?.vehicle_id);
   * ```
   */
  async getVehicle(languageCode: TfdLanguageCode = 'ko'): Promise<TfdVehicleMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdVehicleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/vehicle.json`,
    );
  }

  /**
   * 보이드 요격전 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getVoidBattle('ko');
   * console.log(items.length, items[0]?.void_battle_id);
   * ```
   */
  async getVoidBattle(languageCode: TfdLanguageCode = 'ko'): Promise<TfdVoidBattleMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdVoidBattleMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/void-battle.json`,
    );
  }

  /**
   * 무기 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getWeapon('ko');
   * console.log(items.length, items[0]?.weapon_name);
   * ```
   */
  async getWeapon(languageCode: TfdLanguageCode = 'ko'): Promise<TfdWeaponMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdWeaponMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/weapon.json`,
    );
  }

  /**
   * 무기 유형 메타데이터를 조회한다.
   *
   * @param languageCode - 언어 코드 (기본값: `'ko'`)
   * @throws {NexonError} languageCode가 지원 목록에 없을 때 (요청 전 SDK 검증)
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getWeaponType('ko');
   * console.log(items.length, items[0]?.weapon_type);
   * ```
   */
  async getWeaponType(languageCode: TfdLanguageCode = 'ko'): Promise<TfdWeaponTypeMeta[]> {
    const language = assertLanguageCode(languageCode);
    return this.http.get<TfdWeaponTypeMeta[]>(
      `${FirstDescendantMetaClient.BASE}/${language}/weapon-type.json`,
    );
  }

  // ─── 공통 메타데이터 (/static/tfd/meta/...) ──────────────────────────────

  /**
   * 적응도 레벨 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getAdaptLevel();
   * console.log(items.length, items[0]?.level);
   * ```
   */
  async getAdaptLevel(): Promise<TfdAdaptLevelMeta[]> {
    return this.http.get<TfdAdaptLevelMeta[]>(`${FirstDescendantMetaClient.BASE}/adapt-level.json`);
  }

  /**
   * 비정형 물질 오픈 보상 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getAmorphousReward();
   * console.log(items.length, items[0]?.amorphous_reward_id);
   * ```
   */
  async getAmorphousReward(): Promise<TfdAmorphousRewardMeta[]> {
    return this.http.get<TfdAmorphousRewardMeta[]>(
      `${FirstDescendantMetaClient.BASE}/amorphous-reward.json`,
    );
  }

  /**
   * 아르케 조율 보드 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getArcheTuningBoard();
   * console.log(items.length, items[0]?.arche_tuning_board_id);
   * ```
   */
  async getArcheTuningBoard(): Promise<TfdArcheTuningBoardMeta[]> {
    return this.http.get<TfdArcheTuningBoardMeta[]>(
      `${FirstDescendantMetaClient.BASE}/arche-tuning-board.json`,
    );
  }

  /**
   * 아르케 조율 보드 그룹 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getArcheTuningBoardGroup();
   * console.log(items.length, items[0]?.arche_tuning_board_group_id);
   * ```
   */
  async getArcheTuningBoardGroup(): Promise<TfdArcheTuningBoardGroupMeta[]> {
    return this.http.get<TfdArcheTuningBoardGroupMeta[]>(
      `${FirstDescendantMetaClient.BASE}/arche-tuning-board-group.json`,
    );
  }

  /**
   * 코어 슬롯 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getCoreSlot();
   * console.log(items.length, items[0]?.core_slot_id);
   * ```
   */
  async getCoreSlot(): Promise<TfdCoreSlotMeta[]> {
    return this.http.get<TfdCoreSlotMeta[]>(`${FirstDescendantMetaClient.BASE}/core-slot.json`);
  }

  /**
   * 계승자 레벨별 경험치 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getDescendantLevelDetail();
   * console.log(items.length, items[0]?.descendant_level);
   * ```
   */
  async getDescendantLevelDetail(): Promise<TfdDescendantLevelDetailMeta[]> {
    return this.http.get<TfdDescendantLevelDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/descendant-level-detail.json`,
    );
  }

  /**
   * 조력자 레벨별 경험치 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getFellowLevelDetail();
   * console.log(items.length, items[0]?.fellow_level);
   * ```
   */
  async getFellowLevelDetail(): Promise<TfdFellowLevelDetailMeta[]> {
    return this.http.get<TfdFellowLevelDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/fellow-level-detail.json`,
    );
  }

  /**
   * 마스터리 랭크별 경험치 메타데이터를 조회한다. 언어와 무관한 공통 데이터다.
   *
   * @throws {NexonServerError} 넥슨 서버 오류일 때
   *
   * @example
   * ```ts
   * const items = await client.firstDescendant.meta.getMasteryRankLevelDetail();
   * console.log(items.length, items[0]?.mastery_rank_level);
   * ```
   */
  async getMasteryRankLevelDetail(): Promise<TfdMasteryRankLevelDetailMeta[]> {
    return this.http.get<TfdMasteryRankLevelDetailMeta[]>(
      `${FirstDescendantMetaClient.BASE}/mastery-rank-level-detail.json`,
    );
  }
}
