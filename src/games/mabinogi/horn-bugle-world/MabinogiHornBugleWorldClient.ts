import { assertOneOf } from '../../../core/validation/input.js';
import { MABINOGI_SERVERS } from '../types.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { HORN_BUGLE_WORLD_HISTORY_SHAPE } from '../shapes.js';
import type { MabinogiServerName } from '../types.js';
import type { MabinogiHornBugleWorldHistory } from './types.js';

/** 마비노기 거대한 외침의 뿔피리 API. */
export class MabinogiHornBugleWorldClient {
  private static readonly BASE = 'https://open.api.nexon.com/mabinogi/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 서버의 모든 채널에 전송된 거대한 외침의 뿔피리 메시지를 조회한다.
   *
   * @param serverName - 조회할 서버 이름
   * @throws {NexonBadRequestError} 지원되지 않는 서버를 지정했을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 류트 서버 소식판에 뿔피리 대화를 표시할 때
   * const result = await client.mabinogi.hornBugleWorld.getHistory('류트');
   * console.log(result.horn_bugle_world_history);
   * ```
   */
  async getHistory(serverName: MabinogiServerName): Promise<MabinogiHornBugleWorldHistory> {
    assertOneOf(serverName, MABINOGI_SERVERS, 'server_name');
    return this.http.get(
      `${MabinogiHornBugleWorldClient.BASE}/horn-bugle-world/history`,
      { server_name: serverName },
      HORN_BUGLE_WORLD_HISTORY_SHAPE,
    );
  }
}
