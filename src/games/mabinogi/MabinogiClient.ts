import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { MabinogiNpcShopClient } from './npc-shop/MabinogiNpcShopClient.js';
import { MabinogiAuctionClient } from './auction/MabinogiAuctionClient.js';
import { MabinogiHornBugleWorldClient } from './horn-bugle-world/MabinogiHornBugleWorldClient.js';

/** 마비노기 Open API 클라이언트. */
export class MabinogiClient extends AbstractGameClient {
  protected readonly pathPrefix = 'mabinogi';

  private _npcShop: MabinogiNpcShopClient | undefined;
  private _auction: MabinogiAuctionClient | undefined;
  private _hornBugleWorld: MabinogiHornBugleWorldClient | undefined;

  /** 서버와 채널별 NPC 상점. */
  get npcShop(): MabinogiNpcShopClient {
    return (this._npcShop ??= new MabinogiNpcShopClient(this.http));
  }

  /** 판매 중인 매물과 거래 내역을 찾는 경매장. */
  get auction(): MabinogiAuctionClient {
    return (this._auction ??= new MabinogiAuctionClient(this.http));
  }

  /** 거대한 외침의 뿔피리로 보낸 서버별 메시지 내역. */
  get hornBugleWorld(): MabinogiHornBugleWorldClient {
    return (this._hornBugleWorld ??= new MabinogiHornBugleWorldClient(this.http));
  }
}
