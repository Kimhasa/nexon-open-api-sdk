# 메이플스토리 API 레퍼런스

> SDK 지원 API 48개 — `client.maplestory`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 56개 중 48개를 지원합니다 ([미지원 API](#미지원-api-포털-기준) 참고).

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.maplestory.getOcid('캐릭터명');
const basic = await client.maplestory.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

## 캐릭터 (22개)

```ts
const char = client.maplestory.character;

await char.getList(); // 계정 캐릭터 목록
await char.getBasic({ ocid }); // 기본 정보
await char.getPopularity({ ocid }); // 인기도
await char.getStat({ ocid }); // 종합 능력치
await char.getHyperStat({ ocid }); // 하이퍼스탯
await char.getPropensity({ ocid }); // 성향
await char.getAbility({ ocid }); // 어빌리티
await char.getItemEquipment({ ocid }); // 장착 장비
await char.getCashItemEquipment({ ocid }); // 캐시 장비
await char.getSymbolEquipment({ ocid }); // 심볼
await char.getSetEffect({ ocid }); // 세트 효과
await char.getBeautyEquipment({ ocid }); // 헤어/성형/피부
await char.getAndroidEquipment({ ocid }); // 안드로이드
await char.getPetEquipment({ ocid }); // 펫 장비
await char.getSkill({ ocid, character_skill_grade: '6' }); // 스킬
await char.getLinkSkill({ ocid }); // 링크 스킬
await char.getVMatrix({ ocid }); // V매트릭스
await char.getHexaMatrix({ ocid }); // HEXA 매트릭스
await char.getHexaMatrixStat({ ocid }); // HEXA 스탯
await char.getDojang({ ocid }); // 무릉도장
await char.getOtherStat({ ocid }); // 기타 능력치
await char.getRingExchangeSkillEquipment({ ocid }); // 링 익스체인지
```

## 유니온 (4개)

```ts
const union = client.maplestory.union;

await union.getUnion({ ocid }); // 유니온 레벨/등급
await union.getRaider({ ocid }); // 공격대원 효과
await union.getArtifact({ ocid }); // 아티팩트
await union.getChampion({ ocid }); // 챔피언
```

## 길드 (2개)

```ts
const guild = client.maplestory.guild;

const guildId = await guild.getId('길드명', '스카니아');
await guild.getBasic({ oguild_id: guildId });
```

## 랭킹 (6개)

```ts
const ranking = client.maplestory.ranking;

await ranking.getOverall({ date: '2024-01-01' }); // 종합 랭킹
await ranking.getUnion({ date: '2024-01-01' }); // 유니온 랭킹
await ranking.getGuild({ date: '2024-01-01' }); // 길드 랭킹
await ranking.getDojang({ date: '2024-01-01' }); // 무릉도장 랭킹
await ranking.getTheSeed({ date: '2024-01-01' }); // 더 시드 랭킹
await ranking.getAchievement({ date: '2024-01-01' }); // 업적 랭킹
```

## 확률/이력 (3개)

```ts
const history = client.maplestory.history;

await history.getStarforce({ count: 100, date: '2024-01-01' }); // 스타포스
await history.getPotential({ count: 100, date: '2024-01-01' }); // 잠재능력
await history.getCube({ count: 100, date: '2024-01-01' }); // 큐브
```

## 공지사항 (8개)

```ts
const notice = client.maplestory.notice;

await notice.getList(); // 공지 목록
await notice.getDetail(12345); // 공지 상세
await notice.getUpdateList(); // 업데이트 목록
await notice.getUpdateDetail(12345); // 업데이트 상세
await notice.getEventList(); // 이벤트 목록
await notice.getEventDetail(12345); // 이벤트 상세
await notice.getCashshopList(); // 캐시샵 목록
await notice.getCashshopDetail(12345); // 캐시샵 상세
```

## 식별자·계정 (3개)

```ts
await client.maplestory.getOcid('캐릭터명'); // 캐릭터 식별자 (OCID)
await client.maplestory.getOuid(); // 계정 식별자
await client.maplestory.getAchievement(); // 계정 업적
```

## 미지원 API (포털 기준)

2026-11-24 넥슨 포털 스펙과 대조했을 때 SDK에 아직 없는 8개입니다.

| 카테고리 | 경로                                                    |
| -------- | ------------------------------------------------------- |
| 연무장   | `/maplestory/v1/battle-practice/*` (4개)                |
| 스케줄러 | `/maplestory/v1/scheduler/character-state`              |
| 확률     | `/maplestory/v1/history/soul-potential`                 |
| 캐릭터   | `/maplestory/v1/character/ring-reserve-skill-equipment` |
| 계정     | `/maplestory/legacy/ouid`                               |
