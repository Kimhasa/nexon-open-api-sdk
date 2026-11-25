# 바람의나라 — nexon-open-api

> `client.baram` · API 7개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/baram/)

서버별 캐릭터 검색기를 만들거나 문파 디스코드에서 캐릭터의 장비·능력치·문파를 한 장에 보여 줄 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API Key를 발급받고 패키지를 설치해 주세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { baram } = client;
  const serverName = process.argv[3] ?? '연';
  const ocid = await baram.getOcid(process.argv[2] ?? '캐릭터명', serverName);
  const basic = await baram.character.getBasic({ ocid });
  console.log(
    `[${serverName}] ${basic.character_name} Lv.${basic.character_level} ${basic.character_class_name}`,
  );
  // 예시 출력: [연] 캐릭터명 Lv.800 도사
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '캐릭터명' '연'`로 실행합니다. 예제의 이름과 서버를 조회할 값으로 바꾼 뒤 실행해 주세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.baram`에서 호출합니다.

| 게임에서 부르는 이름                            | SDK 메서드                              | 주요 응답 필드                                                                          |
| ----------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| 서버와 캐릭터 이름으로 캐릭터 식별자(ocid) 조회 | `getOcid(characterName, serverName)`    | `ocid` (캐릭터 식별자)                                                                  |
| 캐릭터 프로필                                   | `character.getBasic({ ocid })`          | `character_class_name` (직업), `character_nation_name` (국가), `character_level` (레벨) |
| 보유 칭호                                       | `character.getTitle({ ocid })`          | `title` (보유 칭호와 만료 일시)                                                         |
| 장착 칭호                                       | `character.getTitleEquipment({ ocid })` | `title_equipment` (장착 칭호와 만료 일시)                                               |
| 장착 장비                                       | `character.getItemEquipment({ ocid })`  | `item_equipment` (장착 부위와 아이템)                                                   |
| 캐릭터 능력치                                   | `character.getStat({ ocid })`           | `stat` (능력치 이름과 값)                                                               |
| 가입한 문파                                     | `character.getGuild({ ocid })`          | `guild_name` (문파 이름)                                                                |

## 알아두기

- 캐릭터마다 식별자(ocid)가 부여됩니다. 캐릭터 이름과 서버 이름을 함께 입력해 받습니다. 콘텐츠 변경 후 저장한 식별자로 조회가 실패하면 이름과 서버로 다시 받습니다.
- 서버 이름은 `연`, `무휼`, `유리`, `진`, `하자`, `호동`입니다. `BaramServerName`은 이 값을 자동완성하고 추가 서버 이름도 문자열로 받습니다.
- 게임 데이터는 평균 10분 뒤에 볼 수 있고, 2022년 1월 1일 이후 데이터가 제공됩니다. 응답의 일시는 UTC 기준입니다.
- 빈 캐릭터 이름, 서버 이름, OCID에는 SDK가 요청 전에 `NexonBadRequestError`(`OPENAPI00004`)를 던집니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 편집기의 자동완성으로 확인할 수 있습니다.

### 캐릭터·칭호·장비·능력치·문파

시작 예제에서 만든 `client`와 `ocid`를 사용합니다.

```ts
// 문파 디스코드에서 캐릭터의 문파, 장착 장비와 능력치 표시
const { character } = client.baram;
const [guild, gear, stats] = await Promise.all([
  character.getGuild({ ocid }),
  character.getItemEquipment({ ocid }),
  character.getStat({ ocid }),
]);
console.log(guild.guild_name ?? '문파 정보 없음');
for (const item of gear.item_equipment) console.log(item.item_equipment_slot_name, item.item_id);
for (const stat of stats.stat) console.log(stat.stat_name, stat.stat_value);
```

- 장착·보유 칭호의 `title_id`와 장비의 `item_id`는 포털 설명에서 각각 칭호 이름과 아이템 이름으로 안내합니다. 아이템을 장착하지 않은 슬롯의 `item_id`는 `null`입니다. 칭호의 `date_expire`는 만료 시각으로 SDK 타입에서 `null`을 허용합니다.
- `stat[].stat_value`는 문자열로 오는 능력치 값입니다.
- `guild_name`은 가입한 문파 이름으로 SDK 타입에서 `null`을 허용합니다.
- `character_exp`와 `character_level`은 경험치와 레벨입니다. 버프나 아이템 효과로 게임 화면의 값과 다를 수 있습니다.

<details>
<summary>NEXON Open API 경로</summary>

| SDK 메서드                    | NEXON Open API 경로                       |
| ----------------------------- | ----------------------------------------- |
| `getOcid`                     | `GET /baram/v1/id`                        |
| `character.getBasic`          | `GET /baram/v1/character/basic`           |
| `character.getTitle`          | `GET /baram/v1/character/title`           |
| `character.getTitleEquipment` | `GET /baram/v1/character/title-equipment` |
| `character.getItemEquipment`  | `GET /baram/v1/character/item-equipment`  |
| `character.getStat`           | `GET /baram/v1/character/stat`            |
| `character.getGuild`          | `GET /baram/v1/character/guild`           |

</details>

## 만들기 예제

- **장비 비교 페이지** · 각 캐릭터의 서버와 이름으로 식별자를 받은 다음 장착 부위를 기준으로 두 장비 목록을 비교합니다.
- **문파 디스코드 프로필** · 문파 이름, 직업, 레벨을 카드에 표시하고 보유·장착 칭호를 함께 보여 줍니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 NEXON Open API 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
