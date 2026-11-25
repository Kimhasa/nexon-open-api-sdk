import { assertInteger, assertOneOf } from '../../../core/validation/input.js';
import { MABINOGI_SERVERS } from '../types.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { NPC_SHOP_LIST_SHAPE } from '../shapes.js';
import { MABINOGI_NPC_NAMES } from './types.js';
import type { MabinogiNpcShopListRequest, MabinogiNpcShopList } from './types.js';

/** 마비노기 NPC 상점 API. */
export class MabinogiNpcShopClient {
  private static readonly BASE = 'https://open.api.nexon.com/mabinogi/v1';

  constructor(private readonly http: HttpClient) {}

  /**
   * 서버와 채널을 골라 NPC 상점의 탭별 판매 목록을 조회한다.
   *
   * @param params - 상점을 열 NPC 이름과 서버 이름, 채널 번호
   * @throws {NexonBadRequestError} 지원되지 않는 NPC나 서버를 지정했거나 채널 번호가 유효하지 않을 때
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
   * // 류트 1채널의 델 상점 목록을 알림으로 보여 줄 때
   * const result = await client.mabinogi.npcShop.getList({ npc_name: '델', server_name: '류트', channel: 1 });
   * console.log(result.shop);
   * ```
   */
  async getList({
    npc_name,
    server_name,
    channel,
  }: MabinogiNpcShopListRequest): Promise<MabinogiNpcShopList> {
    assertOneOf(server_name, MABINOGI_SERVERS, 'server_name');
    assertOneOf(npc_name, MABINOGI_NPC_NAMES, 'npc_name', '예시는 델입니다.');
    assertInteger(channel, 'channel', { min: 1, safe: true });

    return this.http.get(
      `${MabinogiNpcShopClient.BASE}/npcshop/list`,
      { npc_name, server_name, channel },
      NPC_SHOP_LIST_SHAPE,
    );
  }
}
