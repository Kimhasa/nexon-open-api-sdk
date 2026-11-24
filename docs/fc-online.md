# EA SPORTS FC Online API 레퍼런스

> SDK 공개 메서드 18개. HTTP 메서드 16개와 이미지 URL 헬퍼 2개를 제공합니다.
> 포털 OpenAPI 스펙의 19개 경로를 모두 지원합니다. 이미지 헬퍼 2개가 이미지 경로 4개를 처리합니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
const fc = client.fcOnline;
const ouid = await fc.getOuid('닉네임');
const basic = await fc.getBasic(ouid);
console.log(`${basic.nickname} (Lv.${basic.level})`);
```

## 계정 정보 (5개)

| 메서드           | GET 경로                        |
| ---------------- | ------------------------------- |
| `getOuid`        | `/fconline/v1/id`               |
| `getBasic`       | `/fconline/v1/user/basic`       |
| `getMaxDivision` | `/fconline/v1/user/maxdivision` |
| `getMatchList`   | `/fconline/v1/user/match`       |
| `getTradeList`   | `/fconline/v1/user/trade`       |

```ts
const divisions = await fc.getMaxDivision(ouid);
for (const { matchType, division } of divisions) {
  console.log(matchType, division);
}

const matchIds = await fc.getMatchList({ ouid, matchtype: 50, limit: 10 });
const trades = await fc.getTradeList({ tradetype: 'buy', limit: 10 });
```

`getMaxDivision`은 `readonly FcMaxDivision[]`를 반환합니다. 포털에 명세된 단일 객체 응답도 길이 1인 배열로 변환하므로, 기존에 객체 필드를 바로 읽던 코드는 배열을 순회해야 합니다.
`getTradeList`는 API 키 소유자의 거래 기록을 조회합니다.

## 매치 (2개)

| 메서드            | GET 경로                    |
| ----------------- | --------------------------- |
| `getMatchDetail`  | `/fconline/v1/match-detail` |
| `getAllMatchList` | `/fconline/v1/match`        |

넥슨은 2026년 7월 7일 전체 매치 목록 제공을 종료했습니다. `getAllMatchList`는 호출 시 폐지 경고를 표시합니다. 개별 계정의 매치 ID는 `getMatchList`로 가져올 수 있습니다. [넥슨 공지](https://openapi.nexon.com/support/notice/3495136/)

`getMatchDetail`의 `matchInfo[].division`은 포털이 함께 제공하는 선택적 참가자 등급 ID입니다.

```ts
const matchId = matchIds[0];
if (matchId !== undefined) {
  const detail = await fc.getMatchDetail(matchId);
  console.log(detail.matchDate);
}
```

## 랭커 (1개)

| 메서드           | GET 경로                    |
| ---------------- | --------------------------- |
| `getRankerStats` | `/fconline/v1/ranker-stats` |

```ts
const stats = await fc.getRankerStats({
  matchtype: 52,
  players: [{ id: 100167680, po: 18 }],
});
```

## 메타데이터 (8개)

| 메서드                 | GET 경로                                    |
| ---------------------- | ------------------------------------------- |
| `getMatchTypeMeta`     | `/static/fconline/meta/matchtype.json`      |
| `getSpidMeta`          | `/static/fconline/meta/spid.json`           |
| `getSeasonIdMeta`      | `/static/fconline/meta/seasonid.json`       |
| `getSpPositionMeta`    | `/static/fconline/meta/spposition.json`     |
| `getDivisionMeta`      | `/static/fconline/meta/division.json`       |
| `getDivisionVoltaMeta` | `/static/fconline/meta/division-volta.json` |
| `getSeasonMeta`        | `/static/fconline/meta/season.json`         |
| `getClassMeta`         | `/static/fconline/meta/class.json`          |

`getSeasonMeta`는 공식경기 매치 종류별 최신 시즌을 조회합니다. 실제 `seasonid` 문자열은 포털 계약에 맞춰 `seasonId` 정수로 반환합니다.

넥슨은 `getSeasonIdMeta`가 호출하는 기존 클래스 경로를 클래스 메타데이터로 대체하고 2026년 11월 19일 이후 제공을 종료한다고 공지했습니다. 클래스 식별자와 이미지는 `getClassMeta`로 조회하세요. [넥슨 공지](https://openapi.nexon.com/ko/game/fconline/?id=3)

```ts
const seasons = await fc.getSeasonMeta();
const classes = await fc.getClassMeta();
console.log(seasons.find(({ matchtype }) => matchtype === 50)?.seasonId);
console.log(classes.find((entry) => entry.class === 100)?.classImg);
```

## 이미지 URL (2개)

| 메서드              | CDN 경로                                                         |
| ------------------- | ---------------------------------------------------------------- |
| `getActionShotUrl`  | `/live/externalAssets/common/playersAction/p{spid 또는 pid}.png` |
| `getPlayerImageUrl` | `/live/externalAssets/common/players/p{spid 또는 pid}.png`       |

두 메서드는 `fco.dn.nexoncdn.co.kr`의 URL을 조립합니다. `spid` 또는 앞쪽 0을 뺀 `pid`를 숫자로 전달하세요. 선수에 따라 이미지가 없을 수 있습니다.

선수 이미지는 선수에 따라 `spid` 경로와 `pid` 경로 중 한쪽에만 있습니다. 없는 쪽은 CDN이 HTTP 403(`AccessDenied`)을 돌려줍니다 (2026-11-24 실측: 선수 이미지 5/6, 액션샷 2/6). `spid` URL이 403이면 `pid`(`spid` 의 뒤 6자리)로 다시 시도하고, 둘 다 없으면 대체 이미지를 쓰세요.

```ts
const spid = 101000001;
const pid = spid % 1_000_000; // 1
const candidates = [fc.getPlayerImageUrl(spid), fc.getPlayerImageUrl(pid)];
```

```ts
fc.getActionShotUrl(272167135);
fc.getPlayerImageUrl(167680);
```
