# 카트라이더 러쉬플러스 API 레퍼런스

> SDK 지원 API 9개 — `client.kartrider`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 9개를 모두 지원합니다.
>
> 포털 slug(path prefix)는 `kartrush` 입니다. 스펙: `specs/openapi/kartrush/`

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
const ouid = ouid_info[0]?.ouid;
if (ouid) {
  const basic = await client.kartrider.user.getBasic({ ouid });
  console.log(`${basic.racer_name} Lv.${basic.racer_level}`);
}
```

> - 게임 데이터 반영: 평균 10분 소요
> - 데이터 제공 시작일: **2022-01-01**
> - 날짜 필드는 모두 **UTC0** (`"2023-12-14T08:28:35Z"`)
> - 게임 콘텐츠 변경으로 ouid가 바뀔 수 있습니다. ouid를 저장해 쓰면 주기적으로 다시 조회하세요.

## 구조

카테고리가 2개(계정, 공지)라서 sub-client로 나눴습니다.

| 경로 꼴                             | SDK 위치                  |
| ----------------------------------- | ------------------------- |
| `/kartrush/v1/id` (식별자 조회)     | `client.kartrider` 루트   |
| `/kartrush/v1/user/...`             | `client.kartrider.user`   |
| `/kartrush/v1/notice...` (공지 3종) | `client.kartrider.notice` |

판단 기준: 식별자 조회는 루트 메서드, 경로에 카테고리 세그먼트(`user/`, `notice`)가 있으면 그 이름의 sub-client에 둡니다.

## 계정 식별자 조회 (1개)

| 메서드                   | 경로                             | 응답                  |
| ------------------------ | -------------------------------- | --------------------- |
| `getOuidInfo(racerName)` | `GET /kartrush/v1/id?racer_name` | `KartriderOuidLookup` |

```ts
const { ouid_info } = await client.kartrider.getOuidInfo('라이더명');
for (const info of ouid_info) {
  console.log(info.ouid, info.racer_level, info.racer_date_create);
}
```

- 응답이 배열(`ouid_info`)입니다. 다른 게임의 `getOcid()` 처럼 식별자 하나를 돌려주지 않으므로 원하는 항목의 `ouid` 를 골라 씁니다.
- `ouid_info[].racer_level` 은 **문자열**입니다 (`user.getBasic()` 의 `racer_level` 은 숫자).
- 라이더 명의 `|` 는 SDK가 `_` 로 바꿔 보냅니다 (넥슨 API 규칙: `|카러플라이더|` → `_카러플라이더_`).

## 계정 정보 (2개)

| 메서드                             | 경로                                         | 응답                          |
| ---------------------------------- | -------------------------------------------- | ----------------------------- |
| `user.getBasic({ ouid })`          | `GET /kartrush/v1/user/basic?ouid`           | `KartriderUserBasic`          |
| `user.getTitleEquipment({ ouid })` | `GET /kartrush/v1/user/title-equipment?ouid` | `KartriderUserTitleEquipment` |

```ts
const user = client.kartrider.user;

await user.getBasic({ ouid }); // 라이더 명, 생성·로그인·로그아웃 일시, 레벨
await user.getTitleEquipment({ ouid }); // 장착 칭호
```

## 공지 (6개)

| 메서드                             | 경로                                              | 응답                        |
| ---------------------------------- | ------------------------------------------------- | --------------------------- |
| `notice.getList()`                 | `GET /kartrush/v1/notice`                         | `KartriderNoticeList`       |
| `notice.getDetail(noticeId)`       | `GET /kartrush/v1/notice/detail?notice_id`        | `KartriderNoticeDetail`     |
| `notice.getSeasonList()`           | `GET /kartrush/v1/notice-season`                  | `KartriderSeasonNoticeList` |
| `notice.getSeasonDetail(noticeId)` | `GET /kartrush/v1/notice-season/detail?notice_id` | `KartriderNoticeDetail`     |
| `notice.getEventList()`            | `GET /kartrush/v1/notice-event`                   | `KartriderEventNoticeList`  |
| `notice.getEventDetail(noticeId)`  | `GET /kartrush/v1/notice-event/detail?notice_id`  | `KartriderNoticeDetail`     |

```ts
const notice = client.kartrider.notice;

const { notice: items } = await notice.getList(); // 공지사항 (최근 20개)
const first = items[0];
if (first) {
  const detail = await notice.getDetail(first.notice_id);
  console.log(detail.title, detail.contents);
}

await notice.getSeasonList(); // 시즌 알림판 → season_notice[]
await notice.getEventList(); // 이벤트&대회 → event_notice[]
```

- 목록 응답의 배열 키가 종류마다 다릅니다: `notice`, `season_notice`, `event_notice`.
- 공지는 수정될 수 있으므로 실시간 조회 또는 최소 일 단위 갱신을 권장합니다.

## 입력 검증과 에러

빈 라이더 명·빈 `ouid`·정수가 아닌 `noticeId` 는 요청을 보내지 않고 `NexonBadRequestError` (`code: 'OPENAPI00004'`, `nexonMessage: undefined`)를 던집니다.

```ts
import { NexonBadRequestError, NexonRateLimitError } from 'nexon-open-api';

try {
  await client.kartrider.getOuidInfo('라이더명');
} catch (err) {
  if (err instanceof NexonBadRequestError) console.log('파라미터 확인:', err.message);
  if (err instanceof NexonRateLimitError) console.log('호출 한도 초과');
}
```

## 검증 상태

포털 OpenAPI 스펙(2026-11-24) 기준으로 구현했고, 실 API 키로는 검증하지 않았습니다. 테스트 fixture는 스펙 스키마로 합성한 값입니다.
