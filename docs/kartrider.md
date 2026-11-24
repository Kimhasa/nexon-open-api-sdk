# 카트라이더 러쉬플러스 — nexon-open-api

> `client.kartrider` · API 9개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/kartrush/)

라이더 레벨과 장착 칭호를 보여 주는 검색기나 시즌 알림판·이벤트&대회를 모아 보는 알림 봇을 만들 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API 키를 발급받고 패키지를 설치하세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { kartrider } = client;
  const { ouid_info } = await kartrider.getOuidInfo(process.argv[2] ?? '라이더명');
  const rider = ouid_info[0];
  if (ouid_info.length === 1 && rider) {
    const basic = await kartrider.user.getBasic({ ouid: rider.ouid });
    console.log(`${basic.racer_name} Lv.${basic.racer_level}`);
    // 예시 출력: 라이더명 Lv.30
  } else if (ouid_info.length > 1) {
    console.table(ouid_info);
  } else {
    console.log('라이더를 찾을 수 없습니다.');
  }
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '라이더명'`로 실행합니다. 예제의 이름을 실제 조회할 이름으로 바꿔 실행하세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.kartrider`에서 호출합니다.

| 게임에서 부르는 이름        | SDK 메서드                         | 주요 응답 필드                                                                         |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| 라이더명으로 계정 후보 찾기 | `getOuidInfo(racerName)`           | `ouid_info` (계정 후보별 번호·레벨·생성 시각)                                          |
| 라이더 프로필               | `user.getBasic({ ouid })`          | `racer_name` (라이더명), `racer_level` (레벨), `racer_date_last_login` (마지막 로그인) |
| 라이더의 장착 칭호          | `user.getTitleEquipment({ ouid })` | `title_equipment` (장착 칭호)                                                          |
| 공지사항 목록               | `notice.getList()`                 | `notice` (공지 제목과 게시글 번호)                                                     |
| 공지사항 본문               | `notice.getDetail(noticeId)`       | `contents` (공지 본문)                                                                 |
| 시즌 알림판 목록            | `notice.getSeasonList()`           | `season_notice` (시즌 알림판 게시글)                                                   |
| 시즌 알림판 본문            | `notice.getSeasonDetail(noticeId)` | `contents` (시즌 알림판 본문)                                                          |
| 이벤트&대회 목록            | `notice.getEventList()`            | `event_notice` (이벤트·대회 게시글)                                                    |
| 이벤트&대회 본문            | `notice.getEventDetail(noticeId)`  | `contents` (이벤트·대회 본문)                                                          |

## 알아두기

- OUID는 라이더 계정의 고유 번호입니다. 같은 라이더명에 계정이 여러 개 대응할 수 있어서 `getOuidInfo`는 `ouid_info` 배열을 돌려줍니다. 여러 건이면 레벨과 생성 시각을 비교해 조회할 계정을 고릅니다.
- 라이더명의 `|`는 SDK가 `_`로 바꿔 보냅니다. 예를 들어 `|카러플라이더|`를 입력하면 `_카러플라이더_`로 조회합니다.
- 게임 데이터는 평균 10분 뒤에 확인할 수 있습니다. 2022년 1월 1일 이후 데이터가 제공되며, 날짜와 시각은 UTC 기준입니다.
- 게임 콘텐츠 변경 후 저장한 OUID로 조회가 실패하면 라이더명으로 다시 조회합니다.
- 빈 라이더명이나 OUID, 안전한 정수 범위를 벗어나거나 정수가 아닌 공지 번호에는 SDK가 요청 전에 `NexonBadRequestError`(`OPENAPI00004`)를 던집니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 에디터 자동완성에서 확인할 수 있습니다.

### 라이더 레벨·장착 칭호

시작 예제에서 만든 `client`, `ouid_info`, `rider`를 사용합니다. 후보가 하나일 때 실행합니다.

```ts
// 라이더 프로필 카드에 현재 장착한 칭호 표시
if (ouid_info.length === 1 && rider) {
  const { title_equipment } = await client.kartrider.user.getTitleEquipment({ ouid: rider.ouid });
  console.log(title_equipment.map((title) => title.title_name).join(', '));
}
```

- `racer_date_create`는 계정 생성 시각입니다. `racer_date_last_login`과 `racer_date_last_logout`은 마지막 접속과 종료 시각입니다.
- `racer_level`은 계정 후보에서 문자열, 라이더 프로필에서는 숫자입니다.
- `title_equipment[].title_name`은 장착 칭호 이름입니다.

### 공지사항·시즌 알림판·이벤트&대회

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 시즌 알림판 위젯에 최근 게시글의 제목과 본문 표시
const { notice } = client.kartrider;
const { season_notice } = await notice.getSeasonList();
const latest = season_notice[0];
if (latest) {
  const detail = await notice.getSeasonDetail(latest.notice_id);
  console.log(detail.title, detail.contents);
}
```

- 목록 배열은 게시판별로 `notice`(공지사항), `season_notice`(시즌 알림판), `event_notice`(이벤트&대회)입니다. 각각 최근 등록 글 20개를 제공합니다.
- `notice_id`를 같은 게시판의 상세 메서드에 넣으면 `contents`로 본문을 받습니다. `notice_tag`는 게시글에 붙은 태그입니다.
- 공지는 게시 뒤 수정될 수 있으므로 조회 시 새로 받거나 하루에 한 번 이상 갱신합니다.

<details>
<summary>넥슨 API 경로</summary>

| SDK 메서드               | 넥슨 API 경로                           |
| ------------------------ | --------------------------------------- |
| `getOuidInfo`            | `GET /kartrush/v1/id`                   |
| `user.getBasic`          | `GET /kartrush/v1/user/basic`           |
| `user.getTitleEquipment` | `GET /kartrush/v1/user/title-equipment` |
| `notice.getList`         | `GET /kartrush/v1/notice`               |
| `notice.getDetail`       | `GET /kartrush/v1/notice/detail`        |
| `notice.getSeasonList`   | `GET /kartrush/v1/notice-season`        |
| `notice.getSeasonDetail` | `GET /kartrush/v1/notice-season/detail` |
| `notice.getEventList`    | `GET /kartrush/v1/notice-event`         |
| `notice.getEventDetail`  | `GET /kartrush/v1/notice-event/detail`  |

</details>

## 만들기 예제

- **라이더 검색기** · 같은 이름으로 조회된 계정의 레벨과 생성 시각을 먼저 보여 주고, 선택한 라이더의 장착 칭호를 표시합니다.
- **시즌 소식 봇** · 시즌 알림판과 이벤트&대회의 게시글 번호를 각각 기억하고 새 글의 제목과 링크를 표시합니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
