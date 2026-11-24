# EA SPORTS FC 온라인 — nexon-open-api

> `client.fcOnline` · API 18개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/fconline/)

구단주 닉네임 하나로 역대 최고 등급, 공식경기·감독모드·볼타 경기 기록, 경기별 상세 통계를 가져오고, 선수 카드 이미지와 TOP 랭커의 선수 기록까지 조회합니다. 전적 검색 사이트, 디스코드 봇의 `!전적 닉네임` 명령, 이적시장 거래 가계부, 랭커 스쿼드 분석 도구 같은 것을 만들 때 씁니다.

## 시작하기

구단주 닉네임으로 **계정 고유 번호(ouid)** 를 먼저 받고, 그 번호로 정보를 조회합니다. 등급과 매치 종류는 숫자로 오기 때문에 이름표(메타데이터)를 함께 받아 이름으로 바꿉니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

// API 키는 코드에 적지 말고 환경변수로 읽는다
const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수에 FC 온라인 API 키를 넣어 주세요.');

const client = new NexonClient({ apiKey });
const fc = client.fcOnline;

try {
  // 1. 구단주 닉네임 → 계정 고유 번호(ouid)
  const ouid = await fc.getOuid('닉네임');

  // 2. 구단주 정보와 역대 최고 등급
  const basic = await fc.getBasic(ouid);
  const maxDivisions = await fc.getMaxDivision(ouid);

  // 3. 숫자를 이름으로 바꿀 이름표
  const [matchTypes, divisions] = await Promise.all([fc.getMatchTypeMeta(), fc.getDivisionMeta()]);
  const matchName = new Map(matchTypes.map((m) => [m.matchtype, m.desc]));
  const divisionName = new Map(divisions.map((d) => [d.divisionId, d.divisionName]));

  console.log(`${basic.nickname} (Lv.${basic.level})`);
  for (const d of maxDivisions) {
    const match = matchName.get(d.matchType) ?? `매치 ${d.matchType}`;
    const division = divisionName.get(d.division) ?? `등급 ${d.division}`;
    console.log(`${match} 최고 등급: ${division} (${d.achievementDate.slice(0, 10)})`);
  }
  // 출력 예시
  // 닉네임 (Lv.1500)
  // 공식경기 최고 등급: 월드클래스1 (2026-08-15)
  // 감독모드 최고 등급: 프로1 (2026-05-02)
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.log('그런 구단주가 없습니다. 닉네임을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
```

실행: 위 코드를 `index.mjs` 로 저장하고, 같은 폴더의 `.env` 파일에 `NEXON_API_KEY=발급받은키` 를 적은 뒤 `node --env-file=.env index.mjs` 를 실행합니다 (Node.js 20.6 이상). 맨 바깥에서 `await` 를 쓰려면 파일 확장자가 `.mjs` 여야 합니다.

API 키는 게임마다 따로 발급받습니다. 처음이면 [시작 가이드](./getting-started.md)를 먼저 보세요.

> 이 문서의 짧은 코드 조각은 위 예제의 `client` 와 `ouid` 가 이미 있다고 가정합니다.

## 게임 용어 ↔ SDK 대응표

메서드 이름 앞의 `client.fcOnline.` 는 생략했습니다. 예: `getBasic(ouid)` → `client.fcOnline.getBasic(ouid)`.

### 구단주 정보와 기록 (7개)

| 게임에서 부르는 이름                       | SDK 메서드                               | 주요 응답 필드                                                           |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------ |
| 계정 고유 번호(ouid) 받기                  | `getOuid('닉네임')`                      | 반환값이 곧 ouid                                                         |
| 구단주 정보 (닉네임·레벨)                  | `getBasic(ouid)`                         | `nickname`, `level`                                                      |
| 역대 최고 등급 (매치 종류별)               | `getMaxDivision(ouid)`                   | 배열. `matchType`, `division` (등급 번호), `achievementDate`             |
| 경기 기록 목록 (공식경기·감독모드·볼타 등) | `getMatchList({ ouid, matchtype })`      | 매치 번호 문자열 배열 (최근 경기부터)                                    |
| 경기 한 판의 상세 기록                     | `getMatchDetail(matchId)`                | `matchDate`, `matchInfo[]` (구단주별 승패·슛·패스·수비·출전 선수)        |
| 내 이적시장 거래 기록 (구입·판매)          | `getTradeList({ tradetype })`            | 배열. `spid` (선수 카드), `grade` (강화 등급), `value` (BP), `tradeDate` |
| TOP 10,000 랭커의 선수별 평균 기록         | `getRankerStats({ matchtype, players })` | 배열. `spId`, `spPosition`, `status` (골·어시스트·패스 등 20경기 평균)   |

### 숫자를 이름으로 바꾸는 이름표 (7개)

API 키가 올바르지 않아도 받을 수 있는 공개 목록입니다.

| 게임에서 부르는 이름                   | SDK 메서드               | 주요 응답 필드                     |
| -------------------------------------- | ------------------------ | ---------------------------------- |
| 매치 종류 (공식경기, 감독모드, 볼타 …) | `getMatchTypeMeta()`     | `matchtype` (번호), `desc` (이름)  |
| 공식경기 등급 (슈퍼 챔피언스 …)        | `getDivisionMeta()`      | `divisionId`, `divisionName`       |
| 볼타 공식경기 등급 (월드 스타 …)       | `getDivisionVoltaMeta()` | `divisionId`, `divisionName`       |
| 선수 카드 (선수 이름)                  | `getSpidMeta()`          | `id` (선수 카드 번호 spid), `name` |
| 선수 클래스 (시즌 카드 종류)           | `getClassMeta()`         | `class`, `className`, `classImg`   |
| 포지션 (GK, ST …)                      | `getSpPositionMeta()`    | `spposition` (번호), `desc` (이름) |
| 공식경기의 현재 시즌                   | `getSeasonMeta()`        | `matchtype`, `seasonId`            |

### 선수 이미지 (2개)

| 게임에서 부르는 이름 | SDK 메서드                | 주요 응답 필드               |
| -------------------- | ------------------------- | ---------------------------- |
| 선수 얼굴 이미지     | `getPlayerImageUrl(spid)` | 반환값이 곧 이미지 주소(URL) |
| 선수 액션샷 이미지   | `getActionShotUrl(spid)`  | 반환값이 곧 이미지 주소(URL) |

### 더 이상 권장하지 않는 것 (2개)

| 게임에서 부르는 이름         | SDK 메서드          | 대신 쓸 것                                                 |
| ---------------------------- | ------------------- | ---------------------------------------------------------- |
| 모든 구단주의 경기 기록 목록 | `getAllMatchList()` | 넥슨이 제공을 끝냈습니다. 구단주별로 `getMatchList()` 사용 |
| 선수 클래스 목록 (예전 형식) | `getSeasonIdMeta()` | `getClassMeta()`                                           |

## 알아두기

### 고유 번호

- **ouid — 계정 고유 번호.** 구단주 닉네임으로 `getOuid()` 에서 받아 두고 정보를 조회할 때 넣습니다. 넥슨은 게임 콘텐츠가 바뀌면 ouid가 바뀔 수 있다고 안내합니다. 저장해 둔 ouid로 조회가 실패하면 닉네임으로 다시 받으세요.
- **매치 번호(`matchId`).** 경기 한 판마다 붙는 번호입니다. `getMatchList()` 로 받아 `getMatchDetail()` 에 넣습니다.
- **선수 카드 번호(spid)와 선수 번호(pid).** FC 온라인의 선수 카드는 같은 선수라도 클래스(시즌 카드)마다 다릅니다.
  - `spid` = **클래스 번호 3자리 + 선수 번호(pid) 6자리.** 예: `100167680` → 클래스 `100`, 선수 `167680`
  - `pid` = 클래스와 상관없는 선수 자체의 번호 (spid의 뒤 6자리). 코드로는 `spid % 1_000_000`
  - 클래스 번호 = `Math.floor(spid / 1_000_000)`. `getClassMeta()` 로 클래스 이름과 아이콘을 찾습니다.

### 숫자를 이름으로 바꾸기

경기 기록의 매치 종류·등급·선수·포지션은 모두 숫자로 옵니다. 이름표를 한 번 받아 `Map` 으로 만들어 두고 계속 쓰세요.

매치 종류 번호 (2026-11-24 `getMatchTypeMeta()` 기준):

| 번호 | 이름        | 번호  | 이름        |
| ---- | ----------- | ----- | ----------- |
| `30` | 리그 친선   | `204` | 볼타 친선   |
| `40` | 클래식 1on1 | `214` | 볼타 공식   |
| `50` | 공식경기    | `224` | 볼타 AI대전 |
| `52` | 감독모드    | `234` | 볼타 커스텀 |
| `60` | 공식 친선   |       |             |

- 등급(디비전)은 공식경기·감독모드면 `getDivisionMeta()` (예: `800` 슈퍼 챔피언스, `900` 챔피언스), 볼타면 `getDivisionVoltaMeta()` (예: `1100` 월드 스타)에서 찾습니다. 같은 번호라도 볼타와 공식경기의 이름이 다르니 매치 종류에 맞는 이름표를 쓰세요.
- 이름표는 게임 업데이트로 바뀔 수 있습니다. 서비스를 시작할 때 한 번 받고, 하루에 한 번 정도 다시 받으면 충분합니다. `getSpidMeta()` 는 모든 선수 카드가 들어 있어 응답이 큽니다.

### 역대 최고 등급이 배열인 이유

최고 등급은 **매치 종류마다 따로** 있습니다. 공식경기 최고 등급과 감독모드 최고 등급, 볼타 공식 최고 등급이 각각 다릅니다. 그래서 `getMaxDivision()` 은 항상 배열을 돌려주고, 항목마다 `matchType` 으로 어느 매치의 기록인지 알려 줍니다. 한 종류만 플레이한 구단주도 길이 1인 배열로 옵니다. 값 하나만 꺼내려면 이렇게 합니다.

```js
const maxDivisions = await client.fcOnline.getMaxDivision(ouid);
const official = maxDivisions.find((d) => d.matchType === 50); // 50 = 공식경기
console.log(official?.division); // 등급 번호. 기록이 없으면 undefined
```

### 데이터가 언제 반영되나

- **매시 정각에 두 시간 전까지의 경기 데이터가 갱신됩니다.** 예를 들어 오후 3시 5분에 조회하면 오후 1시까지의 기록이 나옵니다. 방금 끝난 경기는 바로 보이지 않습니다.
- **시각은 모두 UTC입니다.** `matchDate`, `tradeDate`, `achievementDate` 는 한국 시간보다 9시간 늦게 표시되므로 화면에 보여 줄 때 한국 시간으로 바꾸세요.

### 주의할 점

- **이적시장 거래 기록은 내 것만 조회됩니다.** `getTradeList()` 는 닉네임이나 ouid를 받지 않고, API 키를 발급받은 계정의 거래만 돌려줍니다.
- **한 번에 100개까지.** `getMatchList()`, `getTradeList()` 는 `limit`(최대 100)과 `offset`(건너뛸 개수)으로 나눠 받습니다. 다음 100개는 `offset: 100` 입니다.
- **상대 기록이 없을 수 있습니다.** 매치 통계가 만들어지기 전에 상대가 경기를 종료하면 `matchInfo` 에 상대 구단주가 빠질 수 있습니다.
- **랭커 기록은 한 번에 50명 이내로.** `getRankerStats()` 에 선수를 너무 많이 넣으면 넥슨 서버가 요청을 거절할 수 있습니다.
- **선수 이미지는 없는 선수도 있습니다.** 아래 [선수 이미지](#선수-이미지) 참고.
- **현재 시즌 번호는 숫자로 드립니다.** 넥슨은 `getSeasonMeta()` 의 시즌 번호를 문자열(`"202606"`)로 주지만, 경기 기록의 `seasonId` 와 바로 비교할 수 있도록 SDK가 숫자(`202606`)로 바꿔 `seasonId` 에 담습니다. 경기 기록의 `seasonId` 가 이 목록에 없으면 EA 리그 경기로 구분할 수 있습니다.
- **필수 값이 비어 있으면 요청을 보내지 않습니다.** 빈 닉네임, 잘못된 `tradetype` 등은 `NexonBadRequestError` 로 바로 알려 줍니다.

### 더 이상 권장하지 않는 메서드

- **`getAllMatchList()` — 쓸 수 없습니다.** 모든 구단주의 경기 목록을 주던 기능으로, 넥슨이 2026년 7월 7일에 제공을 끝냈습니다 ([넥슨 공지](https://openapi.nexon.com/support/notice/3495136/)). 호출하면 경고가 뜨고 넥슨 서버가 오류를 돌려줍니다. 구단주별 경기 목록은 `getMatchList({ ouid, matchtype })` 로 받으세요.
- **`getSeasonIdMeta()` — `getClassMeta()` 로 바꾸세요.** 이름과 달리 공식경기 시즌이 아니라 선수 클래스 목록을 예전 형식으로 주던 기능입니다. 넥슨이 2026년 11월 19일 이후 제공을 끝낸다고 공지했습니다 ([넥슨 공지](https://openapi.nexon.com/ko/game/fconline/?id=3)). 클래스 이름과 아이콘은 `getClassMeta()`, 공식경기의 현재 시즌은 `getSeasonMeta()` 입니다.

## 카테고리별 사용법

### 경기 기록 (공식경기·감독모드·볼타)

```js
// 전적 검색: 공식경기 최근 5경기의 결과
const matchIds = await client.fcOnline.getMatchList({ ouid, matchtype: 50, limit: 5 });

for (const matchId of matchIds) {
  const detail = await client.fcOnline.getMatchDetail(matchId);
  const me = detail.matchInfo.find((info) => info.ouid === ouid);
  const opponent = detail.matchInfo.find((info) => info.ouid !== ouid);
  if (!me) continue;

  const score = `${me.shoot.goalTotalDisplay} : ${opponent?.shoot.goalTotalDisplay ?? '?'}`;
  console.log(
    `${me.matchDetail.matchResult} ${score} vs ${opponent?.nickname ?? '(상대 정보 없음)'}`,
  );
}
// 출력 예시
// 승 3 : 1 vs 상대닉네임
// 패 0 : 2 vs 상대닉네임
```

`matchInfo[]` 에는 경기에 참여한 구단주마다 항목이 하나씩 들어 있습니다. 자주 쓰는 필드:

- `matchDetail.matchResult` — `"승"`, `"무"`, `"패"`
- `matchDetail.matchEndType` — `0` 정상 종료, `1` 몰수승, `2` 몰수패
- `matchDetail.possession` 점유율, `matchDetail.averageRating` 경기 평점, `matchDetail.controller` 조작 방식(`"keyboard"`, `"pad"` 등)
- `shoot.goalTotalDisplay` — 경기 결과 화면에 표시되는 골 수. `shoot.shootTotal`, `shoot.effectiveShootTotal` 은 슛·유효슛 수
- `pass.passTry` / `pass.passSuccess`, `defence.tackleTry` / `defence.tackleSuccess` — 패스·태클 시도와 성공
- `player[]` — 출전 선수. `spId` 선수 카드 번호, `spPosition` 포지션 번호, `spGrade` 강화 등급, `status.spRating` 평점, `status.goal`·`status.assist`
- `shootDetail[]` — 슛 하나하나의 위치(`x`, `y`)와 결과(`result`: `1` 유효슛, `2` 빗나감, `3` 골). 슛 차트를 그릴 때 씁니다. 슛 시각 `goalTime` 은 전·후반이 섞인 값이라 에디터의 필드 설명에 있는 규칙대로 풀어야 합니다.
- `division` — 경기 당시 등급 번호 (없을 수 있음)

### 이적시장 거래 기록

```js
// 거래 가계부: 최근 구입 10건을 선수 이름과 함께
const [trades, players] = await Promise.all([
  client.fcOnline.getTradeList({ tradetype: 'buy', limit: 10 }),
  client.fcOnline.getSpidMeta(),
]);
const playerName = new Map(players.map((p) => [p.id, p.name]));

for (const t of trades) {
  const name = playerName.get(t.spid) ?? `선수 카드 ${t.spid}`;
  console.log(
    `${t.tradeDate.slice(0, 10)} ${name} +${t.grade} — ${t.value.toLocaleString('ko-KR')} BP`,
  );
}
// 출력 예시
// 2026-11-20 선수이름 +5 — 1,250,000,000 BP
```

- `tradetype` — `'buy'` 구입, `'sell'` 판매
- `spid` 선수 카드 번호, `grade` 강화 등급, `value` 거래 가격(BP)
- `tradeDate` — 구입은 등록 시점, 판매는 거래 완료 시점 (UTC)
- `saleSn` — 거래마다 붙는 고유 번호. 중복 저장을 막을 때 씁니다.

### TOP 랭커의 선수 기록

TOP 10,000 랭커가 그 선수 카드를 그 포지션에 썼을 때의 20경기 평균 기록입니다.

```js
// 내 스쿼드 선수와 랭커 평균 비교
const stats = await client.fcOnline.getRankerStats({
  matchtype: 50, // 공식경기
  players: [
    { id: 100167680, po: 18 }, // 선수 카드 번호(spid), 포지션 번호
    { id: 277205401, po: 28 },
  ],
});

for (const s of stats) {
  console.log(
    `선수 카드 ${s.spId}: 평균 ${s.status.goal}골 ${s.status.assist}도움 (${s.status.matchCount}경기)`,
  );
}
```

- `status.goal`, `status.assist`, `status.shoot`, `status.effectiveShoot` — 평균 골·어시스트·슛·유효슛
- `status.passTry` / `status.passSuccess`, `status.dribbleTry` / `status.dribbleSuccess` — 평균 패스·드리블 시도와 성공
- `status.block`, `status.tackle` — 평균 블락·태클 성공
- `status.matchCount` — 그 포지션으로 뛴 경기 수
- 포지션 번호는 `getSpPositionMeta()` 에서 찾습니다 (예: `0` = GK).

### 이름표 (메타데이터)

```js
// 선수 카드 번호 하나를 사람이 읽을 수 있게 풀기
const [players, classes, positions] = await Promise.all([
  client.fcOnline.getSpidMeta(),
  client.fcOnline.getClassMeta(),
  client.fcOnline.getSpPositionMeta(),
]);

const spid = 100167680;
const player = players.find((p) => p.id === spid);
const cls = classes.find((c) => c.class === Math.floor(spid / 1_000_000));
console.log(player?.name, cls?.className, cls?.classImg);
console.log(positions.find((p) => p.spposition === 0)?.desc); // "GK"

// 공식경기의 현재 시즌
const seasons = await client.fcOnline.getSeasonMeta();
console.log(seasons.find((s) => s.matchtype === 50)?.seasonId); // 예: 202606
```

### 선수 이미지

`getPlayerImageUrl()` 과 `getActionShotUrl()` 은 서버에 요청하지 않고 이미지 주소만 만들어 줍니다. 선수 카드 번호(spid)나 선수 번호(pid) 어느 쪽이든 넣을 수 있습니다.

```js
client.fcOnline.getPlayerImageUrl(100167680); // spid 로 만든 주소
client.fcOnline.getPlayerImageUrl(167680); // pid 로 만든 주소
client.fcOnline.getActionShotUrl(272167135); // 액션샷
```

**이미지는 선수에 따라 spid 주소와 pid 주소 중 한쪽에만 있습니다.** 없는 쪽은 넥슨 이미지 서버가 403(AccessDenied)을 돌려줍니다 (2026-11-24 확인: 6명 중 얼굴 이미지 5명, 액션샷 2명만 존재). 그래서 spid 주소를 먼저 시도하고, 안 되면 pid 주소로, 그것도 없으면 기본 이미지로 바꾸세요.

```js
// 열리는 이미지 주소를 찾는다. 둘 다 없으면 null
async function findPlayerImage(spid) {
  const pid = spid % 1_000_000; // spid 의 뒤 6자리. 숫자로 계산하면 앞쪽 0 은 자동으로 빠진다
  const candidates = [
    client.fcOnline.getPlayerImageUrl(spid),
    client.fcOnline.getPlayerImageUrl(pid),
  ];
  for (const url of candidates) {
    const res = await fetch(url);
    if (res.ok) return url;
  }
  return null;
}

console.log((await findPlayerImage(101000001)) ?? '기본 이미지 사용');
```

웹 페이지에서는 `<img>` 의 `onerror` 에서 pid 주소로 바꿔 끼우는 방법도 같은 효과입니다. pid를 문자열로 다룬다면 `"000401"` 처럼 앞에 붙은 0을 모두 떼고 `401` 로 넣어야 합니다.

<details><summary>넥슨 API 경로</summary>

경기·구단주 정보와 이름표는 `https://open.api.nexon.com`, 선수 이미지는 `https://fco.dn.nexoncdn.co.kr` 에서 받습니다.

| SDK 메서드             | 경로                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| `getOuid`              | `GET /fconline/v1/id`                                            |
| `getBasic`             | `GET /fconline/v1/user/basic`                                    |
| `getMaxDivision`       | `GET /fconline/v1/user/maxdivision`                              |
| `getMatchList`         | `GET /fconline/v1/user/match`                                    |
| `getTradeList`         | `GET /fconline/v1/user/trade`                                    |
| `getMatchDetail`       | `GET /fconline/v1/match-detail`                                  |
| `getAllMatchList`      | `GET /fconline/v1/match` (제공 종료)                             |
| `getRankerStats`       | `GET /fconline/v1/ranker-stats`                                  |
| `getMatchTypeMeta`     | `GET /static/fconline/meta/matchtype.json`                       |
| `getSpidMeta`          | `GET /static/fconline/meta/spid.json`                            |
| `getSeasonIdMeta`      | `GET /static/fconline/meta/seasonid.json` (제공 종료 예고)       |
| `getSpPositionMeta`    | `GET /static/fconline/meta/spposition.json`                      |
| `getDivisionMeta`      | `GET /static/fconline/meta/division.json`                        |
| `getDivisionVoltaMeta` | `GET /static/fconline/meta/division-volta.json`                  |
| `getSeasonMeta`        | `GET /static/fconline/meta/season.json`                          |
| `getClassMeta`         | `GET /static/fconline/meta/class.json`                           |
| `getActionShotUrl`     | `/live/externalAssets/common/playersAction/p{spid 또는 pid}.png` |
| `getPlayerImageUrl`    | `/live/externalAssets/common/players/p{spid 또는 pid}.png`       |

메서드는 18개이고, 이미지 메서드 2개가 넥슨 문서의 이미지 경로 4개(spid용·pid용)를 함께 맡습니다.

</details>

응답의 나머지 필드는 에디터 자동완성에서 확인하세요.

## 만들기 예제

### 1. 디스코드 봇 `!전적 닉네임` — 최근 10경기 승무패

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const fc = new NexonClient({ apiKey }).fcOnline;

async function recentRecord(nickname) {
  try {
    const ouid = await fc.getOuid(nickname);
    const matchIds = await fc.getMatchList({ ouid, matchtype: 50, limit: 10 }); // 50 = 공식경기
    const details = await Promise.all(matchIds.map((id) => fc.getMatchDetail(id)));

    const record = { 승: 0, 무: 0, 패: 0 };
    let goals = 0;
    for (const detail of details) {
      const me = detail.matchInfo.find((info) => info.ouid === ouid);
      if (!me) continue;
      const result = me.matchDetail.matchResult;
      if (result === '승' || result === '무' || result === '패') record[result]++;
      goals += me.shoot.goalTotalDisplay;
    }
    return `${nickname} 공식경기 최근 ${details.length}경기: ${record.승}승 ${record.무}무 ${record.패}패, ${goals}골`;
  } catch (err) {
    if (err instanceof NexonNotFoundError) return `'${nickname}' 구단주를 찾지 못했습니다.`;
    throw err;
  }
}

console.log(await recentRecord('닉네임'));
// 출력 예시
// 닉네임 공식경기 최근 10경기: 6승 1무 3패, 17골
```

### 2. 경기에서 가장 잘한 내 선수 (선수 이름·이미지 포함)

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const fc = new NexonClient({ apiKey }).fcOnline;

const ouid = await fc.getOuid('닉네임');
const [matchId] = await fc.getMatchList({ ouid, matchtype: 50, limit: 1 });
if (!matchId) throw new Error('공식경기 기록이 없습니다.');

const [detail, players, positions] = await Promise.all([
  fc.getMatchDetail(matchId),
  fc.getSpidMeta(),
  fc.getSpPositionMeta(),
]);
const playerName = new Map(players.map((p) => [p.id, p.name]));
const positionName = new Map(positions.map((p) => [p.spposition, p.desc]));

const me = detail.matchInfo.find((info) => info.ouid === ouid);
const best = [...(me?.player ?? [])].sort((a, b) => b.status.spRating - a.status.spRating)[0];

if (best) {
  console.log(
    `MVP: ${playerName.get(best.spId) ?? best.spId} (${positionName.get(best.spPosition)})`,
  );
  console.log(`평점 ${best.status.spRating}, ${best.status.goal}골 ${best.status.assist}도움`);
  console.log(fc.getPlayerImageUrl(best.spId)); // 안 열리면 best.spId % 1_000_000 으로 다시 시도
}
// 출력 예시
// MVP: 선수이름 (ST)
// 평점 8.7, 2골 1도움
// https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p100167680.png
```

### 3. 내 이적시장 수지 계산

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const fc = new NexonClient({ apiKey }).fcOnline;

// API 키를 발급받은 내 계정의 최근 거래 100건씩
const [bought, sold] = await Promise.all([
  fc.getTradeList({ tradetype: 'buy', limit: 100 }),
  fc.getTradeList({ tradetype: 'sell', limit: 100 }),
]);

const spent = bought.reduce((sum, t) => sum + t.value, 0);
const earned = sold.reduce((sum, t) => sum + t.value, 0);
console.log(`구입 ${bought.length}건: ${spent.toLocaleString('ko-KR')} BP`);
console.log(`판매 ${sold.length}건: ${earned.toLocaleString('ko-KR')} BP`);
// 출력 예시
// 구입 42건: 12,345,000,000 BP
// 판매 37건: 10,987,000,000 BP
```

세 예제 모두 `index.mjs` 로 저장하고 `node --env-file=.env index.mjs` 로 실행합니다. 더 많은 예제는 [examples](../examples/README.md)에 있습니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
