# 히트2 API 레퍼런스

> SDK 지원 API 2개 — `client.hit2`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 2개를 모두 지원합니다.
>
> 스펙: `specs/openapi/hit2/`

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.hit2.getOcid('캐릭터명');
const basic = await client.hit2.character.getBasic({ ocid });
console.log(`[${basic.server_name}] ${basic.character_name} Lv.${basic.character_level}`);
```

> - 게임 데이터 반영: 평균 10분 소요
> - 데이터 제공 시작일: **2022-08-25**
> - 날짜 필드는 모두 **UTC0** (`"2023-12-14T08:28:35Z"`)
> - 게임 콘텐츠 변경으로 ocid가 바뀔 수 있습니다. ocid를 저장해 쓰면 주기적으로 다시 조회하세요.

## 구조

| 경로 꼴                     | SDK 위치                |
| --------------------------- | ----------------------- |
| `/hit2/v1/id` (식별자 조회) | `client.hit2` 루트      |
| `/hit2/v1/character/...`    | `client.hit2.character` |

판단 기준: 식별자 조회는 루트 메서드, 경로에 카테고리 세그먼트(`character/`)가 있으면 그 이름의 sub-client에 둡니다. 캐릭터 API가 1개뿐이지만 메이플 계열(`client.maplestory.character.getBasic`)과 호출 모양을 맞추고, 포털에 API가 추가돼도 기존 메서드 경로가 바뀌지 않도록 sub-client를 썼습니다.

## OCID 조회 (1개)

| 메서드                   | 경로                             | 응답       |
| ------------------------ | -------------------------------- | ---------- |
| `getOcid(characterName)` | `GET /hit2/v1/id?character_name` | `Hit2OCID` |

```ts
const ocid = await client.hit2.getOcid('캐릭터명');
```

스펙에 서버 파라미터가 없어 캐릭터 명만 받습니다.

## 캐릭터 (1개)

| 메서드                         | 경로                                | 응답                 |
| ------------------------------ | ----------------------------------- | -------------------- |
| `character.getBasic({ ocid })` | `GET /hit2/v1/character/basic?ocid` | `Hit2CharacterBasic` |

```ts
const basic = await client.hit2.character.getBasic({ ocid });
// 서버, 이름, 생성일, 로그인·로그아웃 일시, 직업군·직업, 레벨
```

### 응답에서 주의할 필드

| 필드                                            | 설명                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| `character_date_create`                         | 일 단위 데이터라 시·분·초가 항상 0입니다 (`"2023-12-14T00:00:00Z"`). |
| `character_last_login`, `character_last_logout` | 필드명에 `date_` 가 없습니다 (V4는 `character_date_last_login`).     |

## 입력 검증과 에러

빈 캐릭터 명·`ocid` 는 요청을 보내지 않고 `NexonBadRequestError` (`code: 'OPENAPI00004'`, `nexonMessage: undefined`)를 던집니다.

```ts
import { NexonBadRequestError, NexonRateLimitError } from 'nexon-open-api';

try {
  await client.hit2.getOcid('캐릭터명');
} catch (err) {
  if (err instanceof NexonBadRequestError) console.log('파라미터 확인:', err.message);
  if (err instanceof NexonRateLimitError) console.log('호출 한도 초과');
}
```

## 검증 상태

포털 OpenAPI 스펙(2026-11-24) 기준으로 구현했고, 실 API 키로는 검증하지 않았습니다. 테스트 fixture는 스펙 스키마로 합성한 값입니다.
