# 서든어택 API 레퍼런스

`client.suddenAttack`에서 넥슨 Open API 11개 경로를 사용할 수 있습니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
const { suddenAttack } = client;
const ouid = await suddenAttack.getOuid('닉네임');
const basic = await suddenAttack.user.getBasic(ouid);
console.log(basic.user_name, basic.user_date_create);
```

## 계정 (5개)

| 메서드                                  | 설명                                               |
| --------------------------------------- | -------------------------------------------------- |
| `suddenAttack.getOuid(userName)`        | 닉네임으로 계정 식별자 조회                        |
| `suddenAttack.user.getBasic(ouid)`      | 닉네임, 계정 생성 일시, 칭호, 클랜, 매너 등급 조회 |
| `suddenAttack.user.getRank(ouid)`       | 통합·시즌 계급, 경험치, 랭킹 조회                  |
| `suddenAttack.user.getTier(ouid)`       | 솔로·파티 랭크전 티어와 점수 조회                  |
| `suddenAttack.user.getRecentInfo(ouid)` | 최근 승률과 무기별 킬데스 조회                     |

계급과 티어는 게임 접속 종료 시, 최근 동향은 매치 종료 시 갱신됩니다. 날짜 문자열은 UTC 기준입니다.

## 매치 (2개)

| 메서드                                                          | 설명                                    |
| --------------------------------------------------------------- | --------------------------------------- |
| `suddenAttack.match.getList({ ouid, match_mode, match_type? })` | 특정 모드의 최근 매치 최대 1,000개 조회 |
| `suddenAttack.match.getDetail(matchId)`                         | 매치 ID로 맵과 참여 유저의 기록 조회    |

- `match_mode` 값은 `개인전`, `데스매치`, `폭파미션`, `진짜를 모아라`입니다.
- 선택 파라미터인 `match_type` 값은 `일반전`, `클랜전`, `퀵매치 클랜전`, `클랜 랭크전`, `랭크전 솔로`, `랭크전 파티`, `토너먼트`입니다.

```ts
const { match } = await suddenAttack.match.getList({
  ouid,
  match_mode: '폭파미션',
  match_type: '일반전',
});

const firstMatch = match[0];
if (firstMatch) {
  const detail = await suddenAttack.match.getDetail(firstMatch.match_id);
  console.log(detail.match_map, detail.match_detail);
}
```

## 정적 메타데이터 (4개)

| 메서드                                   | 설명                          |
| ---------------------------------------- | ----------------------------- |
| `suddenAttack.metadata.getLogo()`        | 서든어택 로고 이미지 URL      |
| `suddenAttack.metadata.getGrade()`       | 통합 계급과 이미지 URL 배열   |
| `suddenAttack.metadata.getSeasonGrade()` | 시즌 계급과 이미지 URL 배열   |
| `suddenAttack.metadata.getTier()`        | 랭크전 티어와 이미지 URL 배열 |

```ts
const { logo_image } = await suddenAttack.metadata.getLogo();
const tiers = await suddenAttack.metadata.getTier();
console.log(logo_image, tiers[0]?.tier_image);
```

정적 경로는 직접 호출할 경우 API 키 없이 응답합니다. 테스트 fixture에는 공식 정적 응답의 일부를 사용했습니다. 계정 및 매치 fixture는 포털 스펙을 바탕으로 합성했습니다.

[넥슨 Open API 서든어택](https://openapi.nexon.com/ko/game/suddenattack/)
