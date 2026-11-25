# 마비노기 — nexon-open-api

> `client.mabinogi` · API 5개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/mabinogi/)

에린의 경매장 시세표, 채널별 NPC 상점 알림 봇, 서버별 거대한 외침의 뿔피리 소식판을 만들 수 있습니다.

## 시작하기

NPC 이름, 서버, 채널로 바로 상점 판매 목록을 조회합니다.

처음이라면 [시작 가이드](./getting-started.md)를 따라 API Key를 발급받고 패키지를 설치해 주세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const result = await client.mabinogi.npcShop.getList({
    npc_name: '델',
    server_name: '류트',
    channel: 1,
  });
  console.log(`[류트 1채널] 델 상점 탭 ${result.shop_tab_count}개`);
  // 예시 출력: [류트 1채널] 델 상점 탭 2개
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs`로 실행합니다.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.mabinogi`에서 호출합니다.

| 게임에서 부르는 이름        | SDK 메서드                                                          | 주요 응답 필드                                                                   |
| --------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 채널별 NPC 상점 판매 목록   | `npcShop.getList({ npc_name, server_name, channel })`               | `shop` (상점 탭별 매물), `date_shop_next_update` (다음 갱신 시각)                |
| 경매장 판매 중인 매물       | `auction.listItems({ auction_item_category, item_name, cursor })`   | `auction_item` (매물), `next_cursor` (다음 페이지 번호표)                        |
| 경매장 최근 1시간 거래 내역 | `auction.listHistory({ auction_item_category, item_name, cursor })` | `auction_history` (판매가와 거래 시각), `next_cursor` (다음 페이지 번호표)       |
| 경매장 키워드 검색          | `auction.listByKeyword({ keyword, cursor })`                        | `auction_item` (검색어가 모두 일치하는 매물), `next_cursor` (다음 페이지 번호표) |
| 거대한 외침의 뿔피리 기록   | `hornBugleWorld.getHistory(serverName)`                             | `horn_bugle_world_history` (서버의 모든 채널에 보낸 메시지)                      |

## 알아두기

- NPC 상점은 NPC 이름(`npc_name`), 서버 이름(`server_name`), 채널 번호(`channel`)가 필요합니다. 채널은 1 이상의 정수입니다. 서버는 `류트`, `만돌린`, `하프`, `울프`이며, 지원하는 NPC와 서버 이름은 `MabinogiNpcName`과 `MabinogiServerName`에서 확인할 수 있습니다.
- 게임 데이터는 평균 10분 뒤에 볼 수 있습니다. NPC 상점은 36분마다 바뀌며, 조회 시각과 다음 갱신 시각은 UTC 기준입니다.
- 경매장 검색어(`keyword`)는 한글·영문·숫자로 구성된 단어 1~10개를 쉼표로 구분합니다. 서버는 공백과 특수 문자도 구분자로 처리합니다. 모든 검색어가 아이템 이름 속 단어와 정확히 일치해야 합니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 편집기의 자동완성으로 확인할 수 있습니다.

### NPC 상점

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 채널별 상점 알림에서 다음 갱신 시각과 판매 목록을 표시
const { shop, date_shop_next_update } = await client.mabinogi.npcShop.getList({
  npc_name: '델',
  server_name: '류트',
  channel: 1,
});
for (const tab of shop)
  console.log(
    tab.tab_name,
    tab.item.map((item) => item.item_display_name),
  );
console.log('다음 갱신', date_shop_next_update);
```

- `shop[].tab_name`은 상점 탭 이름이고 `shop[].item`은 해당 탭의 판매 목록입니다.
- 아이템의 `price`에는 화폐 종류와 가격이, `limit_type`과 `limit_value`에는 판매 제한 종류와 수량이 들어 있습니다. 판매 제한이 없는 상품은 둘 다 `null`입니다.
- `date_shop_next_update`는 다음 상점 갱신 시각입니다.

### 경매장 매물·거래 내역

시작 예제에서 만든 `client`를 사용합니다. 세 메서드 모두 한 페이지에 최대 500개를 반환합니다. 첫 페이지에는 `cursor`를 생략합니다. 같은 검색 조건에 받은 `next_cursor`를 `cursor`로 넣으면 다음 페이지를 받습니다. `next_cursor`가 `null`이면 마지막 페이지입니다.

```ts
// 시세 도구에서 동일 조건의 첫 두 페이지를 읽어 개당 가격 표시
const { auction } = client.mabinogi;
const filters = { auction_item_category: '검', item_name: '숏 소드' } as const;
const first = await auction.listItems(filters);
const second =
  first.next_cursor === null
    ? undefined
    : await auction.listItems({ ...filters, cursor: first.next_cursor });
for (const item of [...first.auction_item, ...(second?.auction_item ?? [])]) {
  console.log(item.item_display_name, item.item_count, item.auction_price_per_unit);
}
const byKeyword = await auction.listByKeyword({ keyword: '숏,소드' });
console.log(byKeyword.auction_item.length);
```

- `auction_item`은 판매 중인 매물입니다. `item_count`는 수량, `auction_price_per_unit`은 개당 판매가입니다.
- `auction_history`는 최근 1시간 거래 내역입니다. `date_auction_buy`로 거래 시각을 확인합니다.
- `next_cursor`는 조회한 검색의 다음 페이지를 불러오는 값입니다.

### 거대한 외침의 뿔피리

시작 예제에서 만든 `client`를 사용합니다. 서버의 모든 채널에서 최근 1시간 동안 전송된 메시지를 최대 1,000개 조회합니다.

```ts
// 울프 서버 소식판에 뿔피리 메시지를 시간과 함께 표시
const { horn_bugle_world_history } = await client.mabinogi.hornBugleWorld.getHistory('울프');
for (const entry of horn_bugle_world_history) {
  console.log(entry.date_send, entry.character_name, entry.message);
}
```

- `character_name`은 메시지를 보낸 캐릭터입니다.
- `message`는 뿔피리 내용입니다. 넥슨은 큰따옴표와 역슬래시를 제거한 뒤 제공합니다.
- `date_send`는 외친 시각(UTC)입니다.

<details>
<summary>NEXON Open API 경로</summary>

| SDK 메서드                  | NEXON Open API 경로                         |
| --------------------------- | ------------------------------------------- |
| `npcShop.getList`           | `GET /mabinogi/v1/npcshop/list`             |
| `auction.listItems`         | `GET /mabinogi/v1/auction/list`             |
| `auction.listHistory`       | `GET /mabinogi/v1/auction/history`          |
| `auction.listByKeyword`     | `GET /mabinogi/v1/auction/keyword-search`   |
| `hornBugleWorld.getHistory` | `GET /mabinogi/v1/horn-bugle-world/history` |

</details>

## 만들기 예제

- **에린 시세표** · 매물의 개당 가격과 최근 1시간 거래가를 함께 표시합니다.
- **채널 상점 알림** · 서버와 채널을 골라 판매 목록을 표시하고, 다음 갱신 시각에 새로 가져옵니다.
- **서버 소식판** · 거대한 외침의 뿔피리 메시지를 서버별로 시간순 정렬합니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 NEXON Open API 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
