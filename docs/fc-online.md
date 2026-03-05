# EA SPORTS FC Online API 레퍼런스

> 18개 엔드포인트 — `client.fcOnline`

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

const ouid = await fc.getOuid('닉네임');             // OUID 조회
await fc.getBasic(ouid);                              // 기본 정보 (닉네임, 레벨)
await fc.getMaxDivision(ouid);                        // 역대 최고 등급
await fc.getMatchList({ ouid, matchtype: 50 });       // 매치 기록 (매치 ID 목록)
await fc.getTradeList({ ouid, tradetype: 'buy' });    // 이적시장 거래 기록 (본인만)
```

## 매치 (2개)

```ts
await fc.getAllMatchList({ matchtype: 50, limit: 10 });    // 전체 매치 목록
await fc.getMatchDetail('6572d9bbc7331d2a45f3d755');       // 매치 상세 기록
```

## 랭커 (1개)

```ts
await fc.getRankerStats({
  matchtype: 52,
  players: [{ id: 100167680, po: 18 }],    // TOP 10,000 랭커 선수 평균 스탯
});
```

## 메타데이터 (6개)

```ts
await fc.getMatchTypeMeta();       // 매치 종류
await fc.getSpidMeta();            // 선수 고유 식별자 (spid)
await fc.getSeasonIdMeta();        // 시즌/클래스
await fc.getSpPositionMeta();      // 포지션 (GK, CB, ST ...)
await fc.getDivisionMeta();        // 등급 (슈퍼챔피언스 ...)
await fc.getDivisionVoltaMeta();   // 볼타 등급
```

## 이미지 URL (4개)

HTTP 호출 없이 CDN URL만 조립합니다.

```ts
fc.getActionShotUrl(272167135);      // 액션샷 이미지 URL (spid)
fc.getPlayerImageUrl(272167135);     // 선수 이미지 URL (spid)
fc.getActionShotUrlByPid(167135);    // 액션샷 이미지 URL (pid)
fc.getPlayerImageUrlByPid(167135);   // 선수 이미지 URL (pid)
```
