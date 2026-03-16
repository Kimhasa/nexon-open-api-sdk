# MapleStorySEA API 레퍼런스

> 26개 엔드포인트 — `client.maplestorySEA`

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.maplestorySEA.getOcid('CharacterName');
const basic = await client.maplestorySEA.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

> - 타임존: **UTC+8 (SGT)**
> - 데이터 제공 시작일: **2025-04-20**
> - 전일 데이터 갱신: 익일 오전 2시 (SGT)
> - 게임 데이터 반영: 업데이트 후 약 15분 소요

## OCID 조회

```ts
const ocid = await client.maplestorySEA.getOcid('CharacterName');
```

## 캐릭터 (19개)

```ts
const char = client.maplestorySEA.character;

await char.getBasic({ ocid }); // Basic information
await char.getPopularity({ ocid }); // Popularity
await char.getStat({ ocid }); // Comprehensive stats
await char.getHyperStat({ ocid }); // Hyper Stat
await char.getPropensity({ ocid }); // Traits (Propensity)
await char.getAbility({ ocid }); // Ability
await char.getItemEquipment({ ocid }); // Equipped items
await char.getCashItemEquipment({ ocid }); // Cash items
await char.getSymbolEquipment({ ocid }); // Symbols (Arcane/Authentic)
await char.getSetEffect({ ocid }); // Set effects
await char.getBeautyEquipment({ ocid }); // Hair/Face/Skin
await char.getAndroidEquipment({ ocid }); // Android
await char.getPetEquipment({ ocid }); // Pet equipment
await char.getSkill({ ocid, character_skill_grade: '6' }); // Skills
await char.getLinkSkill({ ocid }); // Link Skills
await char.getVMatrix({ ocid }); // V Matrix
await char.getHexaMatrix({ ocid }); // HEXA Matrix
await char.getHexaMatrixStat({ ocid }); // HEXA Stats
await char.getDojang({ ocid }); // Mu Lung Dojang
```

### Skill 조회 파라미터

`character_skill_grade` 값:

| 값               | 설명          |
| ---------------- | ------------- |
| `"0"`            | 0차           |
| `"1"`            | 1차           |
| `"1.5"`          | 1.5차         |
| `"2"`            | 2차           |
| `"2.5"`          | 2.5차         |
| `"3"`            | 3차           |
| `"4"`            | 4차           |
| `"hyperpassive"` | Hyper Passive |
| `"hyperactive"`  | Hyper Active  |
| `"5"`            | 5차           |
| `"6"`            | 6차           |

## 유니온 (4개)

```ts
const union = client.maplestorySEA.union;

await union.getUnion({ ocid }); // Union level/grade
await union.getRaider({ ocid }); // Union Raider (Legion)
await union.getArtifact({ ocid }); // Union Artifact
await union.getChampion({ ocid }); // Union Champion
```

## 길드 (2개)

```ts
const guild = client.maplestorySEA.guild;

const guildId = await guild.getId('GuildName', 'Aquila');
await guild.getBasic({ oguild_id: guildId });
```

### 월드 목록

Aquila, Bootes, Cassiopeia, Draco, Elysium, Luna
