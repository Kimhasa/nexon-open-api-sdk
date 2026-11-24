# 마비노기 영웅전 — nexon-open-api

> `client.mabinogiHeroes` · API 19개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/heroes/)

타이틀과 장착 장비를 보여 주는 캐릭터 검색기, 인챈트 시세 추적기, 명예의 전당 알림 봇을 만들 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API 키를 발급받고 패키지를 설치하세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { mabinogiHeroes } = client;
  const ocid = await mabinogiHeroes.getOcid(process.argv[2] ?? '캐릭터명');
  const basic = await mabinogiHeroes.character.getBasic({ ocid });
  console.log(
    `${basic.character_name} Lv.${basic.character_level} (${basic.character_class_name})`,
  );
  // 예시 출력: 캐릭터명 Lv.120 (리시타)
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '캐릭터명'`로 실행합니다. 예제의 이름을 실제 조회할 이름으로 바꿔 실행하세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.mabinogiHeroes`에서 호출합니다.

| 게임에서 부르는 이름               | SDK 메서드                                        | 주요 응답 필드                                                                                 |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 캐릭터 이름으로 고유 번호 찾기     | `getOcid(characterName)`                          | `ocid` (SDK가 돌려주는 고유 번호)                                                              |
| 캐릭터 프로필과 타이틀 스탯        | `character.getBasic({ ocid })`                    | `character_class_name` (직업), `character_level` (레벨), `title_stat` (타이틀 능력치)          |
| 보유 타이틀·문양                   | `character.getTitle({ ocid })`                    | `title` (보유 타이틀과 문양)                                                                   |
| 장착 타이틀·문양                   | `character.getTitleEquipment({ ocid })`           | `title_equipment` (장착 타이틀과 문양)                                                         |
| 장착 장비와 프리셋                 | `character.getItemEquipment({ ocid })`            | `item_equipment` (장착소지품·캐시소지품), `item_equipment[].item_option` (강화·인챈트 등 옵션) |
| 캐릭터 능력치                      | `character.getStat({ ocid })`                     | `stat` (능력치 이름과 값)                                                                      |
| 가입·신청한 길드                   | `character.getGuild({ ocid })`                    | `guild_name` (길드 이름)                                                                       |
| 접두·접미 인챈트 효과              | `meta.getEnchant({ enchant_type, enchant_name })` | `enchant_grade` (등급), `enchant_available_slot_name` (적용 부위), `enchant_stat` (능력치)     |
| 공지사항 목록                      | `notice.getList()`                                | `notice` (공지 제목과 게시글 번호)                                                             |
| 공지사항 본문                      | `notice.getDetail(noticeId)`                      | `contents` (공지 본문)                                                                         |
| 패치노트 목록                      | `notice.getPatchList()`                           | `patch_notice` (패치 제목과 게시글 번호)                                                       |
| 패치노트 본문                      | `notice.getPatchDetail(noticeId)`                 | `contents` (패치 본문)                                                                         |
| 이벤트&샵 목록                     | `notice.getEventList()`                           | `event_notice` (이벤트·샵 게시글)                                                              |
| 이벤트&샵 본문                     | `notice.getEventDetail(noticeId)`                 | `contents` (본문), `date_event_end` (종료 시각), `ongoing_flag` (상시 판매 여부)               |
| 거래소의 최근 1주 아이템 거래 기록 | `marketplace.listHistory({ item_name, cursor })`  | `item` (가격 기록), `next_cursor` (다음 페이지 번호표)                                         |
| 골드 거래소 구매 상위 30명         | `marketplace.getGoldBuyTop30()`                   | `buy_gold` (카르제 이름 `cairde_name`, 구매량 `buy_gold`)                                      |
| 골드 거래소 판매 상위 30명         | `marketplace.getGoldSellTop30()`                  | `sell_gold` (카르제 이름 `cairde_name`, 판매량 `sell_gold`)                                    |
| 명예의 전당 순위                   | `ranking.getHallOfHonor({ ranking_type })`        | `ranking` (순위), `character_name` (캐릭터 이름), `score` (공격력 또는 마법 공격력 점수)       |
| 실시간 랭킹                        | `ranking.getRealTime({ ranking_type, page_no })`  | `ranking` (순위), `character_name` (캐릭터 이름), `score` (공격력 또는 마법 공격력 점수)       |

## 알아두기

- OCID는 캐릭터마다 붙는 고유 번호입니다. 이름으로 받고 타이틀, 장비, 길드 조회에 사용합니다. 게임 콘텐츠 변경 후 저장한 OCID로 조회가 실패하면 이름으로 다시 받습니다.
- 캐릭터·인챈트·거래소·랭킹은 v2, 공지사항·패치노트·이벤트&샵은 v1을 사용합니다. SDK가 각 버전으로 요청합니다.
- 게임 데이터는 평균 10분 뒤에 볼 수 있고, 2022년 1월 1일 이후 데이터가 제공됩니다. 버프나 아이템 효과로 경험치와 레벨이 게임 화면의 값과 다를 수 있습니다. 응답 일시는 UTC 기준입니다. 장비 프리셋은 장비를 장착하거나 재접속할 때 갱신됩니다.
- 캐릭터 이름, 인챈트 이름, 거래소 검색 이름은 비울 수 없습니다. 공지 번호와 실시간 랭킹 페이지는 1 이상의 정수입니다. 입력이 잘못되면 SDK가 요청 전에 `NexonBadRequestError`를 던집니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 에디터 자동완성에서 확인할 수 있습니다.

### 캐릭터·타이틀·장비·길드

시작 예제에서 만든 `client`와 `ocid`를 사용합니다.

```ts
// 길드 모집 게시판에서 장착 장비와 강화 단계를 표시
const { character } = client.mabinogiHeroes;
const [gear, guild] = await Promise.all([
  character.getItemEquipment({ ocid }),
  character.getGuild({ ocid }),
]);
console.log(guild.guild_name ?? '길드 정보 없음');
for (const item of gear.item_equipment) {
  const level = item.item_option?.enhancement_level;
  console.log(item.item_equipment_slot_name, item.item_name, level == null ? '' : `+${level}`);
}
```

- `access_flag`는 최근 7일 동안 캐릭터가 접속했는지 나타내며 문자열 `"true"` 또는 `"false"`입니다.
- `title_type`은 `"title"` 타이틀 또는 `"pattern"` 문양입니다. 보유·장착 타이틀의 유형은 2023년 11월 23일 이후 획득·장착한 항목에 제공됩니다.
- `item_equipment_page`의 `"Bag"`은 장착소지품, `"Cash"`는 캐시소지품입니다.
- `item_option`에는 강화 단계, 인챈트와 프리셋 등이 들어옵니다. 장비 종류에 따라 비는 값은 `null`일 수 있습니다. 정령합성 능력치 `power_infusion_preset_1`·`power_infusion_preset_2`는 배열이 아니라 `{ stat_name, stat_value }` 객체 하나이고, 정령합성을 하지 않은 아이템은 `null`입니다.
- `guild_name`은 가입하거나 가입 신청한 길드 이름, `cairde_name`은 카르제 이름입니다. 값이 없으면 `null`일 수 있습니다.

### 접두·접미 인챈트

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 장비 계산기의 인챈트 선택 화면에서 적용 부위 표시
const enchant = await client.mabinogiHeroes.meta.getEnchant({
  enchant_type: '0',
  enchant_name: '용맹한',
});
console.log(enchant.enchant_grade, enchant.enchant_available_slot_name, enchant.enchant_stat);
```

- `enchant_type`의 문자열 `"0"`은 접두, `"1"`은 접미입니다.
- `enchant_grade`는 인챈트 등급(숫자가 아닌 문자열), `enchant_available_slot_name`은 적용 부위, `enchant_stat`은 인챈트 능력치입니다.

### 아이템 거래소·골드 거래소

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 인챈트 스크롤 시세 차트에서 첫 두 페이지의 가격 기록을 모으기
const { marketplace } = client.mabinogiHeroes;
const first = await marketplace.listHistory({ item_name: '인챈트 스크롤' });
const next = first.next_cursor
  ? await marketplace.listHistory({ item_name: '인챈트 스크롤', cursor: first.next_cursor })
  : undefined;
for (const record of [...first.item, ...(next?.item ?? [])]) {
  console.log(record.date_update, record.average_price, record.min_price, record.max_price);
}
```

- `item`은 최근 1주 거래 기록입니다. 최근 24시간에 10건 이상 거래된 아이템이 대상입니다. 한 페이지에 최대 500개이므로 다음 페이지는 `next_cursor`를 같은 검색의 `cursor`에 넣습니다.
- `date_update`는 갱신 시각입니다. 마지막으로 갱신된 기록의 `average_price`가 현재 평균가이며 `min_price`, `max_price`는 최저가와 최고가입니다.
- `인챈트 스크롤` 또는 `인챈트 스크롤 (무기한)`을 검색하고 `item_option.prefix_enchant_preset_1`과 `item_option.suffix_enchant_preset_1`로 스크롤 종류를 구분합니다. `item_option`에는 그 아이템에 해당하는 옵션만 들어 있어서, 접두 스크롤에는 `suffix_enchant_preset_1`이 아예 없습니다.
- 골드 거래소의 거래가는 100만 골드 기준입니다. `buy_gold`와 `sell_gold`는 최근 1주간 구매량·판매량이 많은 상위 30명의 내역입니다. 각 항목의 골드 총량은 목록과 같은 이름의 `buy_gold`, `sell_gold` 필드(숫자)에 들어 있습니다.

### 명예의 전당·실시간 랭킹

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 명예의 전당 공격력 상위 10명과 실시간 1위 표시
const { ranking } = client.mabinogiHeroes;
const honor = await ranking.getHallOfHonor({ ranking_type: '0' });
const live = await ranking.getRealTime({ ranking_type: '0', page_no: 1 });
for (const entry of honor.slice(0, 10)) {
  console.log(`${entry.ranking}위 ${entry.character_name} (${entry.score})`);
}
console.log('실시간 1위', live[0]?.character_name);
```

- `ranking_type`의 문자열 `"0"`은 공격력으로 명예의 전당 200위·실시간 4,000위(8페이지)까지, `"1"`은 마법 공격력으로 명예의 전당 100위·실시간 2,000위(4페이지)까지 조회합니다.
- `ranking`은 순위, `character_name`은 캐릭터 이름, `score`는 선택한 공격력 기준의 점수입니다. 두 메서드 모두 순위 항목 배열을 반환합니다. 넥슨 서버는 `{ ranking: [...] }` 형태로 응답하지만 SDK가 `ranking` 배열만 꺼내 돌려주므로 `honor.length`, `live[0]`처럼 바로 씁니다.
- 명예의 전당은 매일 오전 9시 실시간 랭킹 순위를 기준으로 반영됩니다. 실시간 랭킹은 1시간마다 반영되며 `page_no`는 1부터 시작합니다. 한 페이지당 최대 500개입니다.

### 공지사항·패치노트·이벤트&샵

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 디스코드 공지 채널에 최신 패치노트 본문과 링크 표시
const { notice } = client.mabinogiHeroes;
const { patch_notice } = await notice.getPatchList();
const latest = patch_notice[0];
if (latest) {
  const patch = await notice.getPatchDetail(latest.notice_id);
  console.log(patch.title, patch.url, patch.contents);
}
```

- `notice`, `patch_notice`, `event_notice`는 각 게시판의 최근 등록 글 20개를 담습니다. 게시글이 수정될 수 있으므로 조회 시 가져오거나 하루에 한 번 이상 갱신합니다.
- `notice_id`는 같은 게시판에서 본문(`contents`)을 읽을 때 사용하는 게시글 번호입니다.
- `date_event_start`와 `date_event_end`는 이벤트 기간입니다. `ongoing_flag`의 문자열 `"true"`는 상시 판매를 뜻합니다. 기간이나 상시 판매 표시가 없는 글에는 `null`이 올 수 있습니다.

<details>
<summary>넥슨 API 경로</summary>

| SDK 메서드                     | 넥슨 API 경로                                        |
| ------------------------------ | ---------------------------------------------------- |
| `getOcid`                      | `GET /heroes/v2/id`                                  |
| `character.getBasic`           | `GET /heroes/v2/character/basic`                     |
| `character.getTitle`           | `GET /heroes/v2/character/title`                     |
| `character.getTitleEquipment`  | `GET /heroes/v2/character/title-equipment`           |
| `character.getItemEquipment`   | `GET /heroes/v2/character/item-equipment`            |
| `character.getStat`            | `GET /heroes/v2/character/stat`                      |
| `character.getGuild`           | `GET /heroes/v2/character/guild`                     |
| `meta.getEnchant`              | `GET /heroes/v2/meta/enchant`                        |
| `notice.getList`               | `GET /heroes/v1/notice`                              |
| `notice.getDetail`             | `GET /heroes/v1/notice/detail`                       |
| `notice.getPatchList`          | `GET /heroes/v1/notice-patch`                        |
| `notice.getPatchDetail`        | `GET /heroes/v1/notice-patch/detail`                 |
| `notice.getEventList`          | `GET /heroes/v1/notice-event`                        |
| `notice.getEventDetail`        | `GET /heroes/v1/notice-event/detail`                 |
| `marketplace.listHistory`      | `GET /heroes/v2/marketplace/market-history`          |
| `marketplace.getGoldBuyTop30`  | `GET /heroes/v2/marketplace/gold-market-buy-top-30`  |
| `marketplace.getGoldSellTop30` | `GET /heroes/v2/marketplace/gold-market-sell-top-30` |
| `ranking.getHallOfHonor`       | `GET /heroes/v2/ranking/hall-of-honor`               |
| `ranking.getRealTime`          | `GET /heroes/v2/ranking/real-time`                   |

</details>

## 만들기 예제

- **길드 모집 카드** · 캐릭터의 직업·레벨과 현재 장착한 장비의 강화 단계를 표시하고, 가입하거나 신청한 길드를 함께 보여 줍니다.
- **인챈트 시세 추적기** · 스크롤 거래 기록에 접두·접미 이름을 붙이고 갱신 시각별 평균가를 그립니다.
- **명예의 전당 알림** · 매일 명예의 전당 상위 10명의 순위와 점수를 읽어 디스코드에 표시합니다.

## 참고

- 마비노기 영웅전 타입만 가져올 때는 `nexon-open-api/mabinogi-heroes`를 사용합니다. `HeroesOCID`는 마비노기 영웅전 전용입니다.
- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
