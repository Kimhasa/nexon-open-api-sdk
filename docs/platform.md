# 넥슨 Open API 플랫폼 API 레퍼런스

> SDK 지원 API 1개 — `client.platform`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 1개를 모두 지원합니다.
>
> 스펙: `specs/openapi/platform/`

게임 데이터가 아니라 **NEXON Open API 자체의 공지**(점검, API 변경 안내 등)를 조회합니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const { notice } = await client.platform.getNoticeList();
for (const n of notice) {
  console.log(`[${n.game_name}] ${n.title} (${n.date})`);
}
```

> - 최근 등록된 공지 **10개**를 반환합니다.
> - 날짜 필드는 **UTC0** (`"2023-12-14T08:28:35Z"`)

## 구조

API가 1개뿐이고 식별자 조회도 없어서 sub-client 없이 `client.platform` 루트에 메서드를 둡니다.

판단 기준: 다른 게임은 경로의 카테고리 세그먼트(`character/`, `user/`)마다 sub-client를 두지만, 플랫폼은 경로가 `notice` 하나라 나눌 카테고리가 없습니다. 카테고리가 2개 이상으로 늘면 sub-client로 옮깁니다.

경로가 `{prefix}/v1/{path}` 꼴이 아니라 `/platform/openapi/v1/notice` 입니다. SDK는 `buildUrl('notice', 'openapi/v1')` 로 조립하고, 단위 테스트가 결과 URL이 스펙과 글자 그대로 같은지 확인합니다.

## 공지 (1개)

| 메서드                         | 경로                                        | 응답                 |
| ------------------------------ | ------------------------------------------- | -------------------- |
| `getNoticeList({ game_name })` | `GET /platform/openapi/v1/notice?game_name` | `PlatformNoticeList` |

```ts
await client.platform.getNoticeList(); // 전체 공지
await client.platform.getNoticeList({ game_name: '메이플스토리' }); // 특정 게임 공지만
```

- `game_name` 은 선택입니다. 생략하거나 빈 문자열이면 전체 공지를 조회합니다 (빈 문자열은 SDK가 쿼리에서 뺍니다).
- 게임 공지 API와 달리 상세 API가 없고, 목록 항목에 본문(`contents`)이 함께 옵니다.

### `game_name` 값

공통, 메이플스토리, EA SPORTS FC 온라인, 바람의나라, 바람의나라:연, 카트라이더 러쉬플러스, 히트2, V4, 마비노기 영웅전, 메이플스토리M, 크레이지 아케이드, 플랫폼

`PlatformGameName` 타입이 위 값(스펙 enum)을 자동완성으로 제공합니다. 스펙 enum은 포털의 현재 게임 목록과 다를 수 있어 다른 문자열도 받습니다.

## 에러

```ts
import { NexonAuthError, NexonRateLimitError } from 'nexon-open-api';

try {
  await client.platform.getNoticeList();
} catch (err) {
  if (err instanceof NexonAuthError) console.log('API 키 확인:', err.message);
  if (err instanceof NexonRateLimitError) console.log('호출 한도 초과');
}
```

필수 파라미터가 없어서 SDK가 요청 전에 막는 입력 검증은 없습니다.

## 검증 상태

포털 OpenAPI 스펙(2026-11-24) 기준으로 구현했고, 실 API 키로는 검증하지 않았습니다. 테스트 fixture는 스펙 스키마로 합성한 값입니다.
