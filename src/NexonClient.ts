import { HttpClient } from './core/http/HttpClient.js';
import type { HttpClientConfig } from './core/http/http-types.js';
import { MapleStoryClient } from './games/maplestory/MapleStoryClient.js';
import { FcOnlineClient } from './games/fc-online/FcOnlineClient.js';

/**
 * NexonClient 생성 옵션.
 */
export type NexonClientOptions = HttpClientConfig;

/**
 * Nexon Open API SDK 메인 진입점.
 *
 * 각 게임 클라이언트는 처음 접근 시 lazy하게 생성됩니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * ```
 */
export class NexonClient {
  private readonly http: HttpClient;

  private _maplestory: MapleStoryClient | undefined;
  private _fcOnline: FcOnlineClient | undefined;

  constructor(options: NexonClientOptions) {
    if (!options.apiKey) {
      throw new Error(
        'API 키가 필요합니다.\n→ https://openapi.nexon.com/ 에서 API 키를 발급받으세요.',
      );
    }
    this.http = new HttpClient(options);
  }

  /**
   * 메이플스토리 KMS (한국) 클라이언트.
   * Timezone: UTC+9 (KST)
   */
  get maplestory(): MapleStoryClient {
    this._maplestory ??= new MapleStoryClient(this.http);
    return this._maplestory;
  }

  /**
   * EA SPORTS FC Online 클라이언트.
   *
   * @example
   * ```ts
   * const ouid = await client.fcOnline.getOuid('닉네임');
   * const basic = await client.fcOnline.getBasic(ouid);
   * ```
   */
  get fcOnline(): FcOnlineClient {
    this._fcOnline ??= new FcOnlineClient(this.http);
    return this._fcOnline;
  }
}
