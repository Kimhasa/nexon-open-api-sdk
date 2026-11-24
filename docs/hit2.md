# 히트2 — nexon-open-api

> `client.hit2` · API 2개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/hit2/)

서버·직업·레벨을 보여 주는 캐릭터 검색기나 게임 커뮤니티의 프로필 카드를 만들 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API 키를 발급받고 패키지를 설치하세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { hit2 } = client;
  const ocid = await hit2.getOcid(process.argv[2] ?? '캐릭터명');
  const basic = await hit2.character.getBasic({ ocid });
  console.log(
    `[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level} ${basic.character_class_name}`,
  );
  // 예시 출력: [서버명] 캐릭터명 Lv.60 직업명
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '캐릭터명'`로 실행합니다. 예제의 이름을 실제 조회할 이름으로 바꿔 실행하세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.hit2`에서 호출합니다.

| 게임에서 부르는 이름           | SDK 메서드                     | 주요 응답 필드                                                                |
| ------------------------------ | ------------------------------ | ----------------------------------------------------------------------------- |
| 캐릭터 이름으로 고유 번호 찾기 | `getOcid(characterName)`       | `ocid` (SDK가 돌려주는 고유 번호)                                             |
| 캐릭터 프로필                  | `character.getBasic({ ocid })` | `server_name` (서버), `character_class_name` (직업), `character_level` (레벨) |

## 알아두기

- OCID는 캐릭터마다 붙는 고유 번호입니다. 캐릭터 이름만으로 조회합니다. 콘텐츠 변경 후 저장한 번호로 조회가 실패하면 이름으로 다시 받습니다.
- 게임 데이터는 평균 10분 뒤에 보이며 2022년 8월 25일 이후 데이터가 제공됩니다. 응답 일시는 UTC 기준입니다.
- 빈 캐릭터 이름이나 OCID에는 SDK가 요청 전에 `NexonBadRequestError`(`OPENAPI00004`)를 던집니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 에디터 자동완성에서 확인할 수 있습니다.

### 캐릭터 직업·레벨·접속 시각

시작 예제에서 만든 `client`와 `ocid`를 사용합니다.

```ts
// 커뮤니티 프로필 카드에 직업군과 마지막 접속 시각 표시
const profile = await client.hit2.character.getBasic({ ocid });
console.log(profile.character_class_group_name, profile.character_last_login);
```

- `character_class_group_name`은 직업군, `character_class_name`은 직업, `character_level`은 레벨입니다.
- `character_date_create`는 UTC 날짜 단위 데이터로 시·분·초가 모두 0입니다.
- `character_last_login`과 `character_last_logout`은 마지막 접속과 종료 시각입니다.

<details>
<summary>넥슨 API 경로</summary>

| SDK 메서드           | 넥슨 API 경로                  |
| -------------------- | ------------------------------ |
| `getOcid`            | `GET /hit2/v1/id`              |
| `character.getBasic` | `GET /hit2/v1/character/basic` |

</details>

## 만들기 예제

- **캐릭터 프로필 카드** · 이름으로 조회한 서버·직업·레벨을 한 줄에 보여 줍니다.
- **명단 보기** · 등록된 캐릭터의 직업군과 레벨을 조회해 목록에서 정렬합니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
