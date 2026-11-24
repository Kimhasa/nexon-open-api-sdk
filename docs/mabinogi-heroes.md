# 마비노기 영웅전 API 레퍼런스

> SDK 지원 API 19개 — `client.mabinogiHeroes`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 19개를 모두 지원합니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
const basic = await client.mabinogiHeroes.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level} (${basic.character_class_name})`);
```

sub-path로 가져올 수도 있습니다.

```ts
import type { HeroesOCID, HeroesCharacterBasic } from 'nexon-open-api/mabinogi-heroes';
```

> - Path prefix: **`heroes`** (`mabinogiheroes` 아님)
> - API 버전: 공지는 **V1** (`/heroes/v1/...`), 캐릭터·메타·거래소·랭킹은 **V2** (`/heroes/v2/...`)
> - 일시 필드는 모두 **UTC0** (`2023-12-14T08:28:35Z`)
> - 게임 데이터 반영: 평균 10분 소요
> - 데이터 제공 범위: 2022년 1월 1일 이후
> - 게임 콘텐츠 변경으로 ocid가 바뀔 수 있습니다. 저장해 둔 ocid로 조회가 실패하면 `getOcid()` 로 다시 받습니다.
> - `HeroesOCID` 는 메이플스토리의 `OCID` 와 다른 브랜드 타입이라 서로 섞어 쓸 수 없습니다.

## 카테고리 요약

| 카테고리  | 접근자                              | 개수 | API 버전 |
| --------- | ----------------------------------- | ---- | -------- |
| OCID 조회 | `client.mabinogiHeroes.getOcid()`   | 1    | V2       |
| 캐릭터    | `client.mabinogiHeroes.character`   | 6    | V2       |
| 메타      | `client.mabinogiHeroes.meta`        | 1    | V2       |
| 공지      | `client.mabinogiHeroes.notice`      | 6    | V1       |
| 거래소    | `client.mabinogiHeroes.marketplace` | 3    | V2       |
| 랭킹      | `client.mabinogiHeroes.ranking`     | 2    | V2       |

## OCID 조회 (1개)

| 메서드                   | 경로                | 반환                  |
| ------------------------ | ------------------- | --------------------- |
| `getOcid(characterName)` | `GET /heroes/v2/id` | `Promise<HeroesOCID>` |

```ts
const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
```

## 캐릭터 (6개)

| 메서드                        | 경로                                       | 반환                            |
| ----------------------------- | ------------------------------------------ | ------------------------------- |
| `getBasic({ ocid })`          | `GET /heroes/v2/character/basic`           | `HeroesCharacterBasic`          |
| `getTitle({ ocid })`          | `GET /heroes/v2/character/title`           | `HeroesCharacterTitle`          |
| `getTitleEquipment({ ocid })` | `GET /heroes/v2/character/title-equipment` | `HeroesCharacterTitleEquipment` |
| `getItemEquipment({ ocid })`  | `GET /heroes/v2/character/item-equipment`  | `HeroesCharacterItemEquipment`  |
| `getStat({ ocid })`           | `GET /heroes/v2/character/stat`            | `HeroesCharacterStat`           |
| `getGuild({ ocid })`          | `GET /heroes/v2/character/guild`           | `HeroesCharacterGuild`          |

```ts
const char = client.mabinogiHeroes.character;

await char.getBasic({ ocid }); // 기본 정보
await char.getTitle({ ocid }); // 타이틀/문양 보유 정보
await char.getTitleEquipment({ ocid }); // 장착 타이틀/문양
await char.getItemEquipment({ ocid }); // 장착 아이템
await char.getStat({ ocid }); // 능력치
await char.getGuild({ ocid }); // 가입/신청한 길드
```

- `access_flag` 는 `"true"` / `"false"` 문자열입니다 (boolean 아님).
- `title_type` 은 `"title"`(타이틀) / `"pattern"`(문양)이며, 2023년 11월 23일 이후 획득·장착한 것만 조회됩니다.
- `item_equipment_page` 는 `"Bag"`(장착소지품) / `"Cash"`(캐시소지품)입니다.
- `item_option` 의 필드는 아이템 종류에 따라 `null` 일 수 있습니다.

```ts
const { item_equipment } = await char.getItemEquipment({ ocid });
for (const item of item_equipment) {
  const option = item.item_option;
  console.log(
    `[${item.item_equipment_slot_name}] ${item.item_name} +${option?.enhancement_level ?? 0}`,
    option?.prefix_enchant_preset_1,
    option?.suffix_enchant_preset_1,
  );
}
```

## 메타 (1개)

| 메서드                                       | 경로                          | 반환                |
| -------------------------------------------- | ----------------------------- | ------------------- |
| `getEnchant({ enchant_type, enchant_name })` | `GET /heroes/v2/meta/enchant` | `HeroesEnchantMeta` |

```ts
const enchant = await client.mabinogiHeroes.meta.getEnchant({
  enchant_type: '0',
  enchant_name: '용맹한',
});
console.log(enchant.enchant_grade, enchant.enchant_available_slot_name, enchant.enchant_stat);
```

`enchant_type` 값 (숫자가 아닌 문자열):

| 값    | 설명        |
| ----- | ----------- |
| `"0"` | 접두 인챈트 |
| `"1"` | 접미 인챈트 |

## 공지 (6개)

| 메서드                     | 경로                                 | 반환                      |
| -------------------------- | ------------------------------------ | ------------------------- |
| `getList()`                | `GET /heroes/v1/notice`              | `HeroesNoticeList`        |
| `getDetail(noticeId)`      | `GET /heroes/v1/notice/detail`       | `HeroesNoticeDetail`      |
| `getPatchList()`           | `GET /heroes/v1/notice-patch`        | `HeroesPatchNoticeList`   |
| `getPatchDetail(noticeId)` | `GET /heroes/v1/notice-patch/detail` | `HeroesPatchNoticeDetail` |
| `getEventList()`           | `GET /heroes/v1/notice-event`        | `HeroesEventNoticeList`   |
| `getEventDetail(noticeId)` | `GET /heroes/v1/notice-event/detail` | `HeroesEventNoticeDetail` |

```ts
const notice = client.mabinogiHeroes.notice;

const list = await notice.getList(); // 공지사항 (최근 20개)
const first = list.notice[0];
if (first) {
  const detail = await notice.getDetail(first.notice_id);
  console.log(detail.title, detail.contents);
}

await notice.getPatchList(); // 패치노트 (최근 20개) → patch_notice[]
await notice.getEventList(); // 이벤트&샵 (최근 20개) → event_notice[]
```

- 목록 API는 최근 등록된 게시글 20개를 반환합니다.
- 이벤트&샵의 `ongoing_flag` 는 `"true"` 이면 상시 판매입니다 (문자열).
- 공지는 수정될 수 있으므로 실시간 조회 또는 최소 일배치 갱신을 권장합니다.

## 거래소 (3개)

| 메서드                               | 경로                                                 | 반환                        |
| ------------------------------------ | ---------------------------------------------------- | --------------------------- |
| `getHistory({ item_name, cursor? })` | `GET /heroes/v2/marketplace/market-history`          | `HeroesMarketHistory`       |
| `getGoldBuyTop30()`                  | `GET /heroes/v2/marketplace/gold-market-buy-top-30`  | `HeroesGoldMarketBuyTop30`  |
| `getGoldSellTop30()`                 | `GET /heroes/v2/marketplace/gold-market-sell-top-30` | `HeroesGoldMarketSellTop30` |

```ts
const market = client.mabinogiHeroes.marketplace;

// 최근 1주 거래 기록 (페이지당 500개)
const first = await market.getHistory({ item_name: '인챈트 스크롤' });
for (const record of first.item) {
  console.log(record.date_update, record.average_price, record.min_price, record.max_price);
}

// 다음 페이지: next_cursor 를 cursor 로 넘긴다
if (first.next_cursor) {
  const next = await market.getHistory({ item_name: '인챈트 스크롤', cursor: first.next_cursor });
  console.log(next.item.length);
}

await market.getGoldBuyTop30(); // 최근 1주 골드 구매 상위 30명 → buy_gold[]
await market.getGoldSellTop30(); // 최근 1주 골드 판매 상위 30명 → sell_gold[]
```

- `getHistory` 는 단일 페이지 메서드입니다. 자동 순회(`iterate`/`collect`)는 제공하지 않습니다.
- 최근 24시간 내 10건 이상 거래된 아이템만 조회됩니다.
- 현재 평균가는 마지막으로 갱신된 기록의 `average_price` 입니다.
- 인챈트 스크롤은 `"인챈트 스크롤"` / `"인챈트 스크롤 (무기한)"` 으로 검색한 뒤 `item_option.prefix_enchant_preset_1` / `suffix_enchant_preset_1` 로 종류를 구분합니다.
- 골드 거래소 내역도 포함되며 100만 골드당 가격 기준입니다.

## 랭킹 (2개)

| 메서드                                   | 경로                                   | 반환                   |
| ---------------------------------------- | -------------------------------------- | ---------------------- |
| `getHallOfHonor({ ranking_type })`       | `GET /heroes/v2/ranking/hall-of-honor` | `HeroesRankingEntry[]` |
| `getRealTime({ ranking_type, page_no })` | `GET /heroes/v2/ranking/real-time`     | `HeroesRankingEntry[]` |

```ts
const ranking = client.mabinogiHeroes.ranking;

const honor = await ranking.getHallOfHonor({ ranking_type: '0' });
const realTime = await ranking.getRealTime({ ranking_type: '0', page_no: 1 });

for (const entry of honor.slice(0, 10)) {
  console.log(`${entry.ranking}위 ${entry.character_name} (${entry.score})`);
}
```

`ranking_type` 값 (숫자가 아닌 문자열):

| 값    | 설명             | 명예의 전당 | 실시간               |
| ----- | ---------------- | ----------- | -------------------- |
| `"0"` | 공격력 기준 순위 | 200위까지   | 4000위까지 (8페이지) |
| `"1"` | 마법 공격력 기준 | 100위까지   | 2000위까지 (4페이지) |

- 두 API 모두 응답이 객체가 아니라 **배열**입니다. 그래서 `responseValidation` 의 shape 검증 대상이 아닙니다.
- 명예의 전당은 매일 오전 9시 실시간 랭킹 순위를 기준으로 반영됩니다.
- 실시간 랭킹은 1시간마다 반영되며 `page_no` 는 1부터, 한 페이지당 최대 500개입니다.

## 입력 검증과 에러

SDK는 서버 400 응답을 기다리지 않고 요청 전에 `NexonBadRequestError` 를 던집니다.

| 대상                                             | 조건                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| `getOcid(characterName)`                         | 빈 문자열·공백                                                           |
| `character.*({ ocid })`                          | 빈 `ocid`                                                                |
| `meta.getEnchant`                                | `enchant_type` 이 `'0'`/`'1'` 이 아님, 빈 `enchant_name`                 |
| `notice.get*Detail(noticeId)`                    | 1 이상의 정수가 아님                                                     |
| `marketplace.getHistory`                         | 빈 `item_name`                                                           |
| `ranking.getHallOfHonor` / `ranking.getRealTime` | `ranking_type` 이 `'0'`/`'1'` 이 아님, `page_no` 가 1 이상의 정수가 아님 |

```ts
import { NexonBadRequestError, NexonNotFoundError, NexonRateLimitError } from 'nexon-open-api';

try {
  const ocid = await client.mabinogiHeroes.getOcid('캐릭터명');
  await client.mabinogiHeroes.character.getBasic({ ocid });
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.log('캐릭터를 찾을 수 없습니다.');
  } else if (err instanceof NexonBadRequestError) {
    console.log('요청 파라미터를 확인하세요:', err.message);
  } else if (err instanceof NexonRateLimitError) {
    console.log('호출 한도를 초과했습니다.');
  } else {
    throw err;
  }
}
```

## 검증 상태

타입과 fixture는 포털 OpenAPI 스펙(`specs/openapi/heroes/`, 2026-11-24)을 기준으로 만들었고 **실 API 키로는 검증하지 않았습니다.**
스펙에는 nullable 표기가 없지만, 값이 없을 수 있는 필드(`guild_name`, `cairde_name`, `title_type`, `item_option` 하위 필드, 이벤트 기간, `next_cursor` 등)는 SDK 타입에서 `| null` 로 열어 두었습니다.
