import { assertNonEmptyString } from '../../core/validation/input.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { BaramYeonCharacterClient } from './character/BaramYeonCharacterClient.js';
import { BARAM_YEON_OCID_SHAPE } from './shapes.js';
import type { BaramYeonOCID, BaramYeonServerName } from './types.js';

/**
 * 바람의나라: 연 클라이언트.
 *
 * 포털 스펙: `specs/openapi/baramy/` (https://openapi.nexon.com/ko/game/baramy/)
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
 * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
 * const basic = await client.baramYeon.character.getBasic({ ocid });
 * console.log(`${basic.character_name} Lv.${basic.character_level}`);
 * ```
 */
export class BaramYeonClient extends AbstractGameClient {
  protected readonly pathPrefix = 'baramy';

  private _character: BaramYeonCharacterClient | undefined;

  /** 캐릭터 정보 API (3개 엔드포인트) */
  get character(): BaramYeonCharacterClient {
    this._character ??= new BaramYeonCharacterClient(this.http);
    return this._character;
  }

  /**
   * 캐릭터 명과 서버 명으로 캐릭터 식별자(ocid)를 조회한다.
   *
   * @param characterName - 캐릭터 명
   * @param serverName - 서버 명 (`'연'`, `'무휼'`, `'세류'`, `'해명'`, `'낙랑'`, `'하백'`, `'비류'`, `'온조'`)
   * @throws {NexonBadRequestError} characterName·serverName이 비어 있거나(요청 전 차단) 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
   * console.log(ocid);
   * ```
   */
  async getOcid(characterName: string, serverName: BaramYeonServerName): Promise<BaramYeonOCID> {
    assertNonEmptyString(
      characterName,
      'characterName',
      "client.baramYeon.getOcid('캐릭터명', '연') 처럼 조회할 캐릭터 명을 전달해주세요.",
    );
    assertNonEmptyString(
      serverName,
      'serverName',
      "두 번째 인자로 서버 명('연', '무휼', '세류', '해명', '낙랑', '하백', '비류', '온조')을 전달해주세요.",
    );
    const response = await this.http.get<{ ocid: string }>(
      this.buildUrl('id'),
      { character_name: characterName, server_name: serverName },
      BARAM_YEON_OCID_SHAPE,
    );
    return response.ocid as BaramYeonOCID;
  }
}
