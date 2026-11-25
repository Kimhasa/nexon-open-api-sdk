# 서든어택 — nexon-open-api

> `client.suddenAttack` · API 11개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/suddenattack/)

클랜원 계급을 보여 주는 디스코드 봇, 폭파미션 전적 검색기, 맵별 전적 대시보드를 만들 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API Key를 발급받고 패키지를 설치해 주세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { suddenAttack } = client;
  const ouid = await suddenAttack.getOuid(process.argv[2] ?? '닉네임');
  const [basic, rank] = await Promise.all([
    suddenAttack.user.getBasic(ouid),
    suddenAttack.user.getRank(ouid),
  ]);
  console.log(
    `${basic.user_name} · 클랜 ${basic.clan_name || '없음'} · 시즌 계급 ${rank.season_grade}`,
  );
  // 예시 출력: 닉네임 · 클랜 없음 · 시즌 계급 훈련병
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '닉네임'`로 실행합니다. 예제의 이름을 조회할 이름으로 바꾼 뒤 실행해 주세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.suddenAttack`에서 호출합니다.

| 게임에서 부르는 이름              | SDK 메서드                                        | 주요 응답 필드                                                                           |
| --------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 닉네임으로 계정 식별자(ouid) 조회 | `getOuid(userName)`                               | `ouid` (계정 식별자)                                                                     |
| 프로필의 칭호·클랜·매너 등급      | `user.getBasic(ouid)`                             | `title_name` (칭호), `clan_name` (클랜), `manner_grade` (매너 등급)                      |
| 통합 계급·시즌 계급               | `user.getRank(ouid)`                              | `grade` (통합 계급), `season_grade` (시즌 계급), `season_grade_ranking` (시즌 계급 순위) |
| 솔로·파티 랭크전 티어             | `user.getTier(ouid)`                              | `solo_rank_match_tier` (솔로 티어), `party_rank_match_tier` (파티 티어)                  |
| 최근 승률·무기별 킬데스           | `user.getRecentInfo(ouid)`                        | `recent_win_rate` (최근 승률), `recent_kill_death_rate` (최근 킬데스)                    |
| 모드별 최근 매치                  | `match.getList({ ouid, match_mode, match_type })` | `match` (매치 번호·승패·킬·데스·어시스트)                                                |
| 매치의 맵·참가자별 기록           | `match.getDetail(matchId)`                        | `match_map` (맵), `match_detail` (팀·참가자별 전적)                                      |
| 서든어택 로고                     | `metadata.getLogo()`                              | `logo_image` (로고 이미지 주소)                                                          |
| 통합 계급 배지                    | `metadata.getGrade()`                             | `grade` (통합 계급), `grade_image` (배지 이미지 주소)                                    |
| 시즌 계급 배지                    | `metadata.getSeasonGrade()`                       | `season_grade` (시즌 계급), `season_grade_image` (배지 이미지 주소)                      |
| 랭크전 티어 배지                  | `metadata.getTier()`                              | `tier` (티어 이름), `tier_image` (배지 이미지 주소)                                      |

## 알아두기

- 서든어택 계정마다 식별자(ouid)가 부여됩니다. 닉네임으로 찾고 프로필이나 매치 목록을 조회할 때 사용합니다. 콘텐츠 변경 후 저장된 식별자로 조회가 실패하면 다시 조회합니다.
- 2025년 1월 24일 이후 데이터를 조회할 수 있습니다. 게임 데이터는 평균 10분 뒤에 볼 수 있고, 날짜와 시각은 UTC 기준입니다.
- 통합·시즌 계급과 랭크전 티어는 게임 접속 종료 시, 최근 동향은 매치 종료 시 갱신됩니다.
- 매치 모드(`match_mode`)는 `개인전`, `데스매치`, `폭파미션`, `진짜를 모아라` 중 하나를 넣습니다.
- 매치 유형(`match_type`)은 선택값입니다. `일반전`, `클랜전`, `퀵매치 클랜전`, `클랜 랭크전`, `랭크전 솔로`, `랭크전 파티`, `토너먼트`를 쓸 수 있습니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 편집기의 자동완성으로 확인할 수 있습니다.

### 프로필·계급·티어

시작 예제에서 만든 `client`와 `ouid`를 사용합니다.

```ts
// 클랜원 카드에 매너 등급과 솔로 랭크전 티어 표시
const { user } = client.suddenAttack;
const [profile, tier] = await Promise.all([user.getBasic(ouid), user.getTier(ouid)]);
console.log(profile.manner_grade, tier.solo_rank_match_tier, tier.solo_rank_match_score);
```

- `clan_name`과 `manner_grade`는 소속 클랜과 매너 등급입니다.
- `grade`와 `season_grade`는 통합 계급과 시즌 계급입니다. 각 계급의 경험치와 랭킹도 함께 조회됩니다.
- `solo_rank_match_tier`와 `party_rank_match_tier`는 솔로·파티 랭크전 티어이며 숫자가 아닌 문자열입니다. 배지 목록의 `tier`는 `BRONZE I` 같은 이름입니다.

### 폭파미션·매치 전적

시작 예제에서 만든 `client`와 `ouid`를 사용합니다.

```ts
// 전적 검색기에서 최근 폭파미션 일반전의 맵과 참가자 기록 표시
const { match } = client.suddenAttack;
const list = await match.getList({ ouid, match_mode: '폭파미션', match_type: '일반전' });
const latest = list.match[0];
if (latest) {
  const detail = await match.getDetail(latest.match_id);
  console.log(detail.match_map);
  for (const player of detail.match_detail) {
    console.log(player.user_name, player.kill, player.death, player.assist);
  }
}
```

- `match`는 한 번에 최대 1,000개를 돌려줍니다. 각 `match_id`로 매치의 맵과 세부 전적을 조회합니다.
- `match_result`의 문자열 `"1"`은 승리, `"2"`는 패배, `"3"`은 무승부입니다. 진짜를 모아라 모드는 승패를 기록하지 않습니다. 개인전과 진짜를 모아라 순위는 킬이 많은 순, 킬이 같으면 데스가 적은 순입니다.
- `match_detail`은 참가자별 닉네임과 팀, 킬·데스·어시스트 등을 담습니다. `clan_name`은 클랜전, 퀵매치 클랜전, 클랜 랭크전에서만 제공됩니다.

### 로고·계급·티어 이미지

시작 예제에서 만든 `client`를 사용합니다. 정적 이미지 목록은 포털에 나온 경로에 직접 요청하면 API Key 없이 받을 수 있습니다.

```ts
// 클랜 디스코드에서 시즌 계급 이름으로 배지 주소 찾기
const { metadata } = client.suddenAttack;
const [logo, grades] = await Promise.all([metadata.getLogo(), metadata.getSeasonGrade()]);
const badgeByGrade = new Map(grades.map((row) => [row.season_grade, row.season_grade_image]));
console.log(logo.logo_image, badgeByGrade.size);
```

- `logo_image`는 게임 로고 주소입니다.
- `grade_image`와 `season_grade_image`는 각각 통합·시즌 계급 배지 주소입니다.
- `tier_image`는 솔로·파티 랭크전 티어를 표시할 때 사용할 배지 주소입니다.

<details>
<summary>NEXON Open API 경로</summary>

| SDK 메서드                | NEXON Open API 경로                          |
| ------------------------- | -------------------------------------------- |
| `getOuid`                 | `GET /suddenattack/v1/id`                    |
| `user.getBasic`           | `GET /suddenattack/v1/user/basic`            |
| `user.getRank`            | `GET /suddenattack/v1/user/rank`             |
| `user.getTier`            | `GET /suddenattack/v1/user/tier`             |
| `user.getRecentInfo`      | `GET /suddenattack/v1/user/recent-info`      |
| `match.getList`           | `GET /suddenattack/v1/match`                 |
| `match.getDetail`         | `GET /suddenattack/v1/match-detail`          |
| `metadata.getLogo`        | `GET /static/suddenattack/meta/logo`         |
| `metadata.getGrade`       | `GET /static/suddenattack/meta/grade`        |
| `metadata.getSeasonGrade` | `GET /static/suddenattack/meta/season_grade` |
| `metadata.getTier`        | `GET /static/suddenattack/meta/tier`         |

</details>

## 만들기 예제

- **클랜원 프로필** · 닉네임으로 계급·클랜·매너 등급을 조회하고 시즌 계급 배지를 붙입니다.
- **폭파미션 전적표** · 매치 목록을 유형별로 조회한 뒤, 선택한 매치의 맵과 참가자별 킬·데스를 표시합니다.
- **최근 동향 카드** · 매치가 끝난 뒤 승률과 돌격소총·저격소총·특수총 킬데스를 읽어 보여 줍니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 NEXON Open API 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
