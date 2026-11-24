import type { HttpClient } from '../../../core/http/HttpClient.js';
import { assertNonEmpty } from '../input-validation.js';
import { HIT2_CHARACTER_BASIC_SHAPE } from '../shapes.js';
import type { Hit2OcidRequest } from '../types.js';
import type { Hit2CharacterBasic } from './types.js';

/**
 * 히트2 캐릭터 API 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 * const ocid = await client.hit2.getOcid('캐릭터명');
 * const basic = await client.hit2.character.getBasic({ ocid });
 * ```
 */
export class Hit2CharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/hit2/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 기본 정보를 조회한다.
   *
   * `character_date_create` 는 일 단위라 시·분·초가 항상 0이다.
   * 로그인·로그아웃 필드명은 `character_last_login` / `character_last_logout` 이다 (`date_` 없음).
   *
   * @param params - `{ ocid }` 캐릭터 식별자
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.hit2.getOcid('캐릭터명');
   * const basic = await client.hit2.character.getBasic({ ocid });
   * console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
   * ```
   */
  async getBasic(params: Hit2OcidRequest): Promise<Hit2CharacterBasic> {
    assertNonEmpty(
      params.ocid,
      'ocid',
      'client.hit2.getOcid(characterName) 로 얻은 값을 { ocid } 로 전달해주세요.',
    );
    return this.http.get<Hit2CharacterBasic>(
      `${Hit2CharacterClient.BASE}/character/basic`,
      { ocid: params.ocid },
      HIT2_CHARACTER_BASIC_SHAPE,
    );
  }
}
