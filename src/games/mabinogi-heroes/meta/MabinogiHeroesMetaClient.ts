import type { HttpClient } from '../../../core/http/HttpClient.js';
import { assertNonEmptyString, assertOneOf } from '../validation.js';
import { HEROES_ENCHANT_META_SHAPE } from '../shapes.js';
import type { HeroesEnchantMeta, HeroesEnchantMetaRequest } from './types.js';

/**
 * 마비노기 영웅전 메타데이터 API 클라이언트 (V2).
 *
 * 정적 파일(`/static/...`)이 아니라 API 키가 필요한 일반 API입니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const enchant = await client.mabinogiHeroes.meta.getEnchant({
 *   enchant_type: '0',
 *   enchant_name: '용맹한',
 * });
 * ```
 */
export class MabinogiHeroesMetaClient {
  private static readonly BASE = 'https://open.api.nexon.com/heroes/v2';

  constructor(private readonly http: HttpClient) {}

  /**
   * 인챈트 명으로 인챈트 등급, 장착 가능 부위, 능력치를 조회한다.
   *
   * 인챈트 명은 `character.getItemEquipment()` 의 `item_option.prefix_enchant_preset_1` 등에서 얻습니다.
   *
   * @param params.enchant_type - 접두/접미 타입. `'0'`: 접두 인챈트, `'1'`: 접미 인챈트 (문자열)
   * @param params.enchant_name - 인챈트 명
   * @throws {NexonBadRequestError} enchant_type이 `'0'`/`'1'` 이 아니거나 enchant_name이 비어 있을 때 (요청 전에 SDK가 throw)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * const enchant = await client.mabinogiHeroes.meta.getEnchant({
   *   enchant_type: '0',
   *   enchant_name: '용맹한',
   * });
   * console.log(`${enchant.enchant_grade}등급`, enchant.enchant_available_slot_name);
   * for (const stat of enchant.enchant_stat) {
   *   console.log(stat);
   * }
   * ```
   */
  async getEnchant(params: HeroesEnchantMetaRequest): Promise<HeroesEnchantMeta> {
    const request = params as HeroesEnchantMetaRequest | undefined;
    assertOneOf(
      request?.enchant_type,
      ['0', '1'],
      'enchant_type',
      "'0' 은 접두 인챈트, '1' 은 접미 인챈트입니다.",
    );
    assertNonEmptyString(
      request?.enchant_name,
      'enchant_name',
      "조회할 인챈트 명을 넘겨주세요 (예: { enchant_type: '0', enchant_name: '용맹한' }).",
    );
    return this.http.get<HeroesEnchantMeta>(
      `${MabinogiHeroesMetaClient.BASE}/meta/enchant`,
      { enchant_type: params.enchant_type, enchant_name: params.enchant_name },
      HEROES_ENCHANT_META_SHAPE,
    );
  }
}
