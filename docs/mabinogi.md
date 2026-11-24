# 마비노기 API 레퍼런스

`client.mabinogi`에서 넥슨 Open API 5개 경로를 사용할 수 있습니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
const { mabinogi } = client;
const { shop } = await mabinogi.npcShop.getList({
  npc_name: '델',
  server_name: '류트',
  channel: 1,
});
console.log(shop);
```

## NPC 상점 (1개)

| 메서드                                                         | 설명                                   |
| -------------------------------------------------------------- | -------------------------------------- |
| `mabinogi.npcShop.getList({ npc_name, server_name, channel })` | 서버 및 채널의 NPC 상점 판매 목록 조회 |

`server_name`은 `류트`, `만돌린`, `하프`, `울프` 중 하나입니다. 서버와 NPC 이름은 각각 `MabinogiServerName`과 `MabinogiNpcName`으로 확인할 수 있습니다. 상점 조회 시각과 다음 갱신 시각은 UTC 기준입니다.

## 경매장 (3개)

| 메서드                                                                          | 설명                                         |
| ------------------------------------------------------------------------------- | -------------------------------------------- |
| `mabinogi.auction.listItems({ auction_item_category?, item_name?, cursor? })`   | 현재 판매 중인 매물 검색                     |
| `mabinogi.auction.listHistory({ auction_item_category?, item_name?, cursor? })` | 최근 1시간 거래 내역 조회                    |
| `mabinogi.auction.listByKeyword({ keyword, cursor? })`                          | 아이템 이름에 검색어가 모두 포함된 매물 검색 |

세 메서드는 한 번에 최대 500개의 결과가 담긴 한 페이지를 반환합니다. 처음에는 `cursor`를 생략합니다. 다음 페이지는 같은 검색 조건에 `next_cursor`를 `cursor`로 전달해 조회합니다. `next_cursor`가 `null`이면 마지막 페이지입니다.

```ts
const filters = { auction_item_category: '검', item_name: '숏 소드' } as const;
const first = await mabinogi.auction.listItems(filters);
console.log(first.auction_item);

if (first.next_cursor !== null) {
  const second = await mabinogi.auction.listItems({ ...filters, cursor: first.next_cursor });
  console.log(second.auction_item);
}

const byKeyword = await mabinogi.auction.listByKeyword({ keyword: '숏,소드' });
console.log(byKeyword.auction_item);
```

키워드는 한글, 영문, 숫자로 구성된 단어 1~10개를 쉼표로 구분해 보냅니다. 서버는 공백과 특수 문자를 구분자로 처리하며, 각 검색어는 아이템 이름 속 단어와 정확히 일치해야 합니다.

## 거대한 외침의 뿔피리 (1개)

| 메서드                                           | 설명                                                     |
| ------------------------------------------------ | -------------------------------------------------------- |
| `mabinogi.hornBugleWorld.getHistory(serverName)` | 지정한 서버의 모든 채널에 전송된 뿔피리 메시지 내역 조회 |

```ts
const { horn_bugle_world_history } = await mabinogi.hornBugleWorld.getHistory('울프');
console.log(horn_bugle_world_history);
```

테스트 fixture는 포털 OpenAPI 스펙을 바탕으로 합성했습니다.

[넥슨 Open API 마비노기](https://openapi.nexon.com/ko/game/mabinogi/)
