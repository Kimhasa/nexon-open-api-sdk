import { assertNonEmptyString } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
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
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 * const ocid = await client.hit2.getOcid('캐릭터명');
 * const basic = await client.hit2.character.getBasic({ ocid });
 * ```
 */
export class Hit2CharacterClient {
  private static readonly BASE = 'https://open.api.nexon.com/hit2/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 캐릭터 프로필의 서버·직업군·레벨과 접속 시각을 조회한다.
   *
   * `character_date_create` 는 일 단위라 시·분·초가 항상 0이다.
   * 로그인·로그아웃 시각은 `character_date_last_login` / `character_date_last_logout` 으로 온다 (포털 스펙에는 `date_` 없이 적혀 있다).
   *
   * @param params - `ocid`는 `getOcid()`로 찾은 캐릭터 고유 번호
   * @throws {NexonBadRequestError} ocid가 비어 있거나(요청 전 차단) 유효하지 않을 때
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
   * // 커뮤니티 프로필에 서버와 직업, 레벨을 표시할 때
   * const ocid = await client.hit2.getOcid('캐릭터명');
   * const basic = await client.hit2.character.getBasic({ ocid });
   * console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
   * ```
   */
  async getBasic(params: Hit2OcidRequest): Promise<Hit2CharacterBasic> {
    assertNonEmptyString(
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
