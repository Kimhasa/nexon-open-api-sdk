# EA SPORTS FC Online API 레퍼런스

> SDK 지원 API 16개 — `client.fcOnline`
>
> 개수 기준: SDK public API 메서드 수 (HTTP 호출 14개 + 이미지 URL 헬퍼 2개).
> 넥슨 포털 기준 19개 경로 중 17개를 지원합니다 ([포털과의 차이](#포털과의-차이) 참고).

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ouid = await client.fcOnline.getOuid('닉네임');
const basic = await client.fcOnline.getBasic(ouid);
console.log(`${basic.nickname} (Lv.${basic.level})`);
```

## 계정 정보 (5개)

```ts
const fc = client.fcOnline;

const ouid = await fc.getOuid('닉네임'); // OUID 조회
await fc.getBasic(ouid); // 기본 정보 (닉네임, 레벨)
await fc.getMaxDivision(ouid); // 역대 최고 등급
await fc.getMatchList({ ouid, matchtype: 50 }); // 매치 기록 (매치 ID 목록)
await fc.getTradeList({ ouid, tradetype: 'buy' }); // 이적시장 거래 기록 (본인만)
```

## 매치 (2개)

```ts
await fc.getAllMatchList({ matchtype: 50, limit: 10 }); // 전체 매치 목록 (현재 포털 스펙에 없음)
await fc.getMatchDetail('6572d9bbc7331d2a45f3d755'); // 매치 상세 기록
```

## 랭커 (1개)

```ts
await fc.getRankerStats({
  matchtype: 52,
  players: [{ id: 100167680, po: 18 }], // TOP 10,000 랭커 선수 평균 스탯
});
```

## 메타데이터 (6개)

```ts
await fc.getMatchTypeMeta(); // 매치 종류
await fc.getSpidMeta(); // 선수 고유 식별자 (spid)
await fc.getSeasonIdMeta(); // 시즌/클래스
await fc.getSpPositionMeta(); // 포지션 (GK, CB, ST ...)
await fc.getDivisionMeta(); // 등급 (슈퍼챔피언스 ...)
await fc.getDivisionVoltaMeta(); // 볼타 등급
```

## 이미지 URL (2개)

HTTP 호출 없이 CDN URL만 조립합니다.

```ts
fc.getActionShotUrl(272167135); // 액션샷 이미지 URL
fc.getPlayerImageUrl(272167135); // 선수 이미지 URL
```

> 포털의 이미지 경로는 `p{spid}.png` 와 `p{pid}.png` 두 형태(총 4개)인데 URL 모양이 같습니다.
> pid 전용 메서드는 없으며, 위 두 메서드에 pid를 넘기면 pid 경로 URL이 만들어집니다.

## 포털과의 차이

2026-11-24 넥슨 포털 스펙과 대조한 결과입니다.

| 구분                 | 경로                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| SDK 미지원 (2개)     | `/static/fconline/meta/season.json`, `/static/fconline/meta/class.json`       |
| 포털에 없는 SDK 경로 | `/fconline/v1/match` (`getAllMatchList`) — 폐지 여부 미확인, 실 API 확인 필요 |
