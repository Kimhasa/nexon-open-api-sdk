import type { HttpClient } from '../../../core/http/HttpClient.js';
import { NPC_SHOP_LIST_SHAPE } from '../shapes.js';
import { validateServer } from '../validation.js';
import { MABINOGI_NPC_NAMES } from './types.js';
import type { MabinogiNpcShopListRequest, MabinogiNpcShopList } from './types.js';

/** 마비노기 NPC 상점 API. */
export class MabinogiNpcShopClient {
  private static readonly BASE = 'https://open.api.nexon.com/mabinogi/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 서버와 채널을 지정해 NPC 상점의 판매 목록을 조회합니다.
   *
   * @param params - NPC 이름, 서버 이름, 채널 번호
   * @throws {TypeError} 지원되지 않는 NPC나 서버를 지정했거나 채널 번호가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const result = await client.mabinogi.npcShop.list({ npc_name: '델', server_name: '류트', channel: 1 });
   * console.log(result.shop);
   * ```
   */
  async list({
    npc_name,
    server_name,
    channel,
  }: MabinogiNpcShopListRequest): Promise<MabinogiNpcShopList> {
    validateServer(server_name);
    if (!MABINOGI_NPC_NAMES.includes(npc_name)) {
      throw new TypeError('npc_name에 지원되는 NPC 이름을 입력하세요. 예시는 델입니다.');
    }
    if (!Number.isSafeInteger(channel) || channel < 1) {
      throw new TypeError('channel에 1 이상의 정수 채널 번호를 입력하세요.');
    }

    return this.http.get(
      `${MabinogiNpcShopClient.BASE}/npcshop/list`,
      { npc_name, server_name, channel },
      NPC_SHOP_LIST_SHAPE,
    );
  }
}
