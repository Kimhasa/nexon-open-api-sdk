# 바람의나라: 연 — nexon-open-api

> `client.baramYeon` · API 4개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/baramy/)

서버별 캐릭터 검색 페이지나 보유 칭호를 보여 주는 디스코드 봇을 만들 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API Key를 발급받고 패키지를 설치해 주세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { baramYeon } = client;
  const ocid = await baramYeon.getOcid(process.argv[2] ?? '캐릭터명', process.argv[3] ?? '연');
  const basic = await baramYeon.character.getBasic({ ocid });
  console.log(
    `[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level} ${basic.character_class_name}`,
  );
  // 예시 출력: [연] 캐릭터명 Lv.500 도사
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '캐릭터명' '연'`로 실행합니다. 예제의 이름과 서버를 조회할 값으로 바꾼 뒤 실행해 주세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.baramYeon`에서 호출합니다.

| 게임에서 부르는 이름                            | SDK 메서드                              | 주요 응답 필드                                                                        |
| ----------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| 서버와 캐릭터 이름으로 캐릭터 식별자(ocid) 조회 | `getOcid(characterName, serverName)`    | `ocid` (캐릭터 식별자)                                                                |
| 캐릭터 프로필                                   | `character.getBasic({ ocid })`          | `server_name` (서버), `character_class_group_name` (직업군), `character_level` (레벨) |
| 보유 칭호                                       | `character.getTitle({ ocid })`          | `title` (보유 칭호 목록)                                                              |
| 장착·표시 칭호                                  | `character.getTitleEquipment({ ocid })` | `title_equipment` (장착 칭호와 표시 칭호)                                             |

## 알아두기

- 캐릭터마다 식별자(ocid)가 부여됩니다. 캐릭터 이름과 서버 이름을 함께 입력합니다. 콘텐츠 변경 후 저장한 식별자로 조회가 실패하면 다시 조회합니다.
- 서버 이름은 `연`, `무휼`, `세류`, `해명`, `낙랑`, `하백`, `비류`, `온조`입니다. `BaramYeonServerName`은 이 값을 자동완성하고 추가 서버 이름도 문자열로 받습니다.
- 게임 데이터는 평균 10분 뒤에 보이며 2022년 1월 1일 이후 데이터가 제공됩니다. 응답 일시는 UTC 기준입니다.
- 빈 캐릭터 이름, 서버 이름, OCID에는 SDK가 요청 전에 `NexonBadRequestError`(`OPENAPI00004`)를 던집니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 편집기의 자동완성으로 확인할 수 있습니다.

### 캐릭터·보유 칭호·표시 칭호

시작 예제에서 만든 `client`와 `ocid`를 사용합니다.

```ts
// 프로필 카드에 캐릭터가 표시 중인 칭호 붙이기
const { title_equipment } = await client.baramYeon.character.getTitleEquipment({ ocid });
const displayed = title_equipment.find((title) => title.title_equipment_type === '2');
console.log(displayed?.title_name ?? '표시 칭호 없음');
```

- 캐릭터 프로필의 `character_class_group_name`과 `character_class_name`은 직업군과 직업입니다. `character_nation`은 국적입니다.
- `title_equipment_type`의 문자열 `"1"`은 장착 칭호, `"2"`는 표시 칭호입니다.
- `title_type_name`은 2022년 3월 18일 이후 획득하거나 장착한 칭호에 제공됩니다. SDK 타입은 `null`을 허용합니다.

<details>
<summary>NEXON Open API 경로</summary>

| SDK 메서드                    | NEXON Open API 경로                        |
| ----------------------------- | ------------------------------------------ |
| `getOcid`                     | `GET /baramy/v1/id`                        |
| `character.getBasic`          | `GET /baramy/v1/character/basic`           |
| `character.getTitle`          | `GET /baramy/v1/character/title`           |
| `character.getTitleEquipment` | `GET /baramy/v1/character/title-equipment` |

</details>

## 만들기 예제

- **캐릭터 카드** · 서버·직업·레벨에 표시 칭호를 붙여 보여 줍니다.
- **칭호 모음** · 보유 칭호를 칭호 유형별로 모아 검색할 수 있게 합니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 NEXON Open API 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
