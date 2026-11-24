# 메이플스토리M API 레퍼런스

> SDK 지원 API 38개 — `client.maplestorym`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 2026-11-24 넥슨 포털 스펙의 38개 경로를 지원합니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
const basic = await client.maplestorym.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

> 메이플스토리M은 OCID 조회 시 **월드명**이 필요합니다.

## OCID 조회 (1개)

| 메서드                              | 응답                |
| ----------------------------------- | ------------------- |
| `getOcid(worldName, characterName)` | 캐릭터 식별자(OCID) |

```ts
// 월드명: 스카니아, 루나, 엘리시움, 크로아, 유니온, 제니스, 아케인, 챌린저스
const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
```

## 캐릭터 (17개)

| 메서드                                     | 응답                   |
| ------------------------------------------ | ---------------------- |
| `character.getBasic({ ocid })`             | 기본 정보              |
| `character.getStat({ ocid })`              | 종합 능력치            |
| `character.getHyperStat({ ocid })`         | 하이퍼 스탯            |
| `character.getGuild({ ocid })`             | 가입 길드              |
| `character.getItemEquipment({ ocid })`     | 장착 장비와 마스터리   |
| `character.getCashItemEquipment({ ocid })` | 캐시 장비              |
| `character.getSymbol({ ocid })`            | 아케인 및 어센틱 심볼  |
| `character.getSetEffect({ ocid })`         | 세트 효과              |
| `character.getAndroidEquipment({ ocid })`  | 안드로이드와 기계 심장 |
| `character.getJewel({ ocid })`             | 쥬얼 장비              |
| `character.getBeautyEquipment({ ocid })`   | 헤어, 성형, 피부       |
| `character.getPetEquipment({ ocid })`      | 펫 장비                |
| `character.getSkillEquipment({ ocid })`    | 장착 스킬              |
| `character.getLinkSkill({ ocid })`         | 링크 스킬              |
| `character.getVMatrix({ ocid })`           | V매트릭스              |
| `character.getHexaMatrixSkill({ ocid })`   | HEXA 매트릭스 스킬     |
| `character.getHexaMatrixStat({ ocid })`    | HEXA 스탯              |

```ts
const char = client.maplestorym.character;
const equipment = await char.getItemEquipment({ ocid });
console.log(equipment.item_equipment[0]?.mastery_info);
```

## 유니온 (3개)

| 메서드                      | 응답                                  |
| --------------------------- | ------------------------------------- |
| `union.get({ ocid })`       | 유니온 레벨과 등급                    |
| `union.getRaider({ ocid })` | 공격대원 효과                         |
| `union.getStat({ ocid })`   | 적용 중인 유니온 스탯과 프리셋별 스탯 |

```ts
const union = client.maplestorym.union;

await union.get({ ocid }); // 유니온 레벨/등급
await union.getRaider({ ocid }); // 공격대원 효과
const stat = await union.getStat({ ocid });
console.log(stat.use_union_stat, stat.union_stat_preset);
```

## 길드 (2개)

| 메서드                              | 응답                   |
| ----------------------------------- | ---------------------- |
| `guild.getId(worldName, guildName)` | 길드 식별자(OGUILD ID) |
| `guild.getBasic({ oguild_id })`     | 길드 기본 정보         |

```ts
const guild = client.maplestorym.guild;

const guildId = await guild.getId('스카니아', '길드명');
await guild.getBasic({ oguild_id: guildId });
```

## 랭킹 (9개)

| 메서드                                      | 응답                     |
| ------------------------------------------- | ------------------------ |
| `ranking.getLevel({ date })`                | 레벨 랭킹                |
| `ranking.getDojang({ date })`               | 무릉도장 랭킹            |
| `ranking.getRootOfTime({ date })`           | 시간의 근원 랭킹         |
| `ranking.getUnion({ date })`                | 유니온 랭킹              |
| `ranking.getCombatPower({ date })`          | 전투력 랭킹              |
| `ranking.getKerningMTower({ date })`        | 커닝M타워 랭킹           |
| `ranking.getAchievement({ date })`          | 업적 랭킹                |
| `ranking.getSharenianBattlefield({ date })` | 샤레니안의 전장 랭킹     |
| `ranking.getSharenianWaterway({ date })`    | 샤레니안의 지하수로 랭킹 |

랭킹 기준일은 KST의 `YYYY-MM-DD` 형식입니다. `world_name`과 `ocid` 중 하나를 지정할 수 있으며, 페이지당 최대 200개 결과가 반환됩니다. 샤레니안 랭킹의 `ocid`는 길드 마스터의 식별자입니다.

```ts
const ranking = client.maplestorym.ranking;
const date = '2026-11-23';

const level = await ranking.getLevel({ date, world_name: '스카니아', page: 1 });
console.log(level.ranking[0]?.character_name);
```

## 공지사항 (6개)

| 메서드                            | 응답           |
| --------------------------------- | -------------- |
| `notice.getList()`                | 공지 목록      |
| `notice.getDetail(noticeId)`      | 공지 상세      |
| `notice.getPatchList()`           | 패치 노트 목록 |
| `notice.getPatchDetail(noticeId)` | 패치 노트 상세 |
| `notice.getEventList()`           | 이벤트 목록    |
| `notice.getEventDetail(noticeId)` | 이벤트 상세    |

```ts
const notice = client.maplestorym.notice;

const list = await notice.getList();
const first = list.notice[0];
if (first) {
  const detail = await notice.getDetail(first.notice_id);
  console.log(detail.title, detail.contents);
}
```
