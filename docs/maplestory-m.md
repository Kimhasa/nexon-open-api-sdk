# 메이플스토리M API 레퍼런스

> 36개 엔드포인트 — `client.maplestorym`

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
const basic = await client.maplestorym.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

> 메이플스토리M은 OCID 조회 시 **월드명**이 필요합니다.

## OCID 조회

```ts
// 월드명: 스카니아, 루나, 엘리시움, 크로아, 유니온, 제니스, 아케인
const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
```

## 캐릭터 (17개)

```ts
const char = client.maplestorym.character;

await char.getBasic({ ocid });               // 기본 정보
await char.getStat({ ocid });                // 종합 능력치
await char.getHyperStat({ ocid });           // 하이퍼스탯
await char.getGuild({ ocid });               // 길드 정보
await char.getItemEquipment({ ocid });       // 장착 장비
await char.getCashItemEquipment({ ocid });   // 캐시 장비
await char.getSymbol({ ocid });              // 심볼 (아케인/어센틱)
await char.getSetEffect({ ocid });           // 세트 효과
await char.getAndroidEquipment({ ocid });    // 안드로이드
await char.getJewel({ ocid });               // 보석 장비
await char.getBeautyEquipment({ ocid });     // 헤어/성형/피부
await char.getPetEquipment({ ocid });        // 펫 장비
await char.getSkillEquipment({ ocid });      // 스킬 장비
await char.getLinkSkill({ ocid });           // 링크 스킬
await char.getVMatrix({ ocid });             // V매트릭스
await char.getHexaMatrixSkill({ ocid });     // HEXA 매트릭스 스킬
await char.getHexaMatrixStat({ ocid });      // HEXA 스탯
```

## 유니온 (2개)

```ts
const union = client.maplestorym.union;

await union.get({ ocid });        // 유니온 레벨/등급
await union.getRaider({ ocid });  // 공격대원 효과
```

## 길드 (2개)

```ts
const guild = client.maplestorym.guild;

const guildId = await guild.getId('스카니아', '길드명');
await guild.getBasic({ oguild_id: guildId });
```

## 랭킹 (9개)

```ts
const ranking = client.maplestorym.ranking;

await ranking.getLevel({ date });                    // 레벨 랭킹
await ranking.getDojang({ date });                   // 무릉도장 랭킹
await ranking.getRootOfTime({ date });               // 시간의 근원 랭킹
await ranking.getUnion({ date });                    // 유니온 랭킹
await ranking.getCombatPower({ date });              // 전투력 랭킹
await ranking.getKerningMTower({ date });            // 커닝M타워 랭킹
await ranking.getAchievement({ date });              // 업적 랭킹
await ranking.getSharenianBattlefield({ date });     // 셰레니안 격전지 랭킹
await ranking.getSharenianWaterway({ date });        // 셰레니안 수로 랭킹
```

## 공지사항 (6개)

```ts
const notice = client.maplestorym.notice;

await notice.getList();              // 공지 목록
await notice.getDetail(12345);       // 공지 상세
await notice.getPatchList();         // 패치 노트 목록
await notice.getPatchDetail(12345);  // 패치 노트 상세
await notice.getEventList();         // 이벤트 목록
await notice.getEventDetail(12345);  // 이벤트 상세
```
