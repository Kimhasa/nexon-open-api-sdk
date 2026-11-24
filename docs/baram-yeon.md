# 바람의나라: 연 API 레퍼런스

> SDK 지원 API 4개 — `client.baramYeon`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 4개를 모두 지원합니다.
>
> 포털 slug(path prefix)는 `baramy` 입니다. 스펙: `specs/openapi/baramy/`

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
const basic = await client.baramYeon.character.getBasic({ ocid });
console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
```

> - 게임 데이터 반영: 평균 10분 소요
> - 데이터 제공 시작일: **2022-01-01**
> - 날짜 필드는 모두 **UTC0** (`"2023-12-14T08:28:35Z"`)
> - 게임 콘텐츠 변경으로 ocid가 바뀔 수 있습니다. ocid를 저장해 쓰면 주기적으로 다시 조회하세요.

## 구조

| 경로 꼴                       | SDK 위치                     |
| ----------------------------- | ---------------------------- |
| `/baramy/v1/id` (식별자 조회) | `client.baramYeon` 루트      |
| `/baramy/v1/character/...`    | `client.baramYeon.character` |

판단 기준: 식별자 조회는 루트 메서드, 경로에 카테고리 세그먼트(`character/`)가 있으면 그 이름의 sub-client에 둡니다. 카테고리가 하나뿐이지만 메이플 계열(`client.maplestory.character.getBasic`)과 호출 모양을 맞추고, 포털에 카테고리가 추가돼도 기존 메서드 경로가 바뀌지 않도록 sub-client를 썼습니다.

## OCID 조회 (1개)

| 메서드                               | 경로                                           | 응답            |
| ------------------------------------ | ---------------------------------------------- | --------------- |
| `getOcid(characterName, serverName)` | `GET /baramy/v1/id?character_name&server_name` | `BaramYeonOCID` |

```ts
const ocid = await client.baramYeon.getOcid('캐릭터명', '연');
```

### 서버 목록

연, 무휼, 세류, 해명, 낙랑, 하백, 비류, 온조

`BaramYeonServerName` 타입이 위 값을 자동완성으로 제공합니다. 서버가 추가될 때를 대비해 다른 문자열도 받습니다.

## 캐릭터 (3개)

| 메서드                                  | 경로                                            | 응답                               |
| --------------------------------------- | ----------------------------------------------- | ---------------------------------- |
| `character.getBasic({ ocid })`          | `GET /baramy/v1/character/basic?ocid`           | `BaramYeonCharacterBasic`          |
| `character.getTitle({ ocid })`          | `GET /baramy/v1/character/title?ocid`           | `BaramYeonCharacterTitle`          |
| `character.getTitleEquipment({ ocid })` | `GET /baramy/v1/character/title-equipment?ocid` | `BaramYeonCharacterTitleEquipment` |

```ts
const char = client.baramYeon.character;

await char.getBasic({ ocid }); // 서버, 이름, 직업군·직업, 국적, 성별, 경험치, 레벨
await char.getTitle({ ocid }); // 보유 칭호
await char.getTitleEquipment({ ocid }); // 장착 칭호
```

### 응답에서 주의할 필드

| 필드                                     | 설명                                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `title_equipment[].title_equipment_type` | 문자열 코드입니다. `"1"`: 장착 칭호, `"2"`: 표시 칭호                                                           |
| `title_type_name`                        | 2022-03-18 이후 획득(장착)한 칭호만 제공됩니다. SDK 타입은 `string \| null` 입니다 (스펙에 nullable 표시 없음). |

## 입력 검증과 에러

빈 캐릭터 명·서버 명·`ocid` 는 요청을 보내지 않고 `NexonBadRequestError` (`code: 'OPENAPI00004'`, `nexonMessage: undefined`)를 던집니다.

```ts
import { NexonBadRequestError, NexonRateLimitError } from 'nexon-open-api';

try {
  await client.baramYeon.getOcid('캐릭터명', '연');
} catch (err) {
  if (err instanceof NexonBadRequestError) console.log('파라미터 확인:', err.message);
  if (err instanceof NexonRateLimitError) console.log('호출 한도 초과');
}
```

## 검증 상태

포털 OpenAPI 스펙(2026-11-24) 기준으로 구현했고, 실 API 키로는 검증하지 않았습니다. 테스트 fixture는 스펙 스키마로 합성한 값입니다.
