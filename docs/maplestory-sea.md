# MapleStorySEA API 레퍼런스

> SDK 지원 API 26개 — `client.maplestorySEA`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 26개를 모두 지원합니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY', responseValidation: true });

const ocid = await client.maplestorySEA.getOcid('CharacterName');
const basic = await client.maplestorySEA.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

`responseValidation: true`로 26개 응답의 최상위 필드를 검증할 수 있습니다. 결과는 `logger.onResponseShapeMismatch` 또는 `debug: true`를 통해 확인할 수 있습니다.

> - 타임존: **UTC+8 (SGT)**
> - 데이터 제공 시작일: **2025-04-20**
> - 전일 데이터 갱신: 익일 오전 2시 (SGT)
> - 게임 데이터 반영: 업데이트 후 약 15분 소요

## OCID 조회 (1개)

| 메서드    | GET 경로               |
| --------- | ---------------------- |
| `getOcid` | `/maplestorysea/v1/id` |

```ts
const ocid = await client.maplestorySEA.getOcid('CharacterName');
```

## 캐릭터 (19개)

| 메서드                           | GET 경로                                         |
| -------------------------------- | ------------------------------------------------ |
| `character.getBasic`             | `/maplestorysea/v1/character/basic`              |
| `character.getPopularity`        | `/maplestorysea/v1/character/popularity`         |
| `character.getStat`              | `/maplestorysea/v1/character/stat`               |
| `character.getHyperStat`         | `/maplestorysea/v1/character/hyper-stat`         |
| `character.getPropensity`        | `/maplestorysea/v1/character/propensity`         |
| `character.getAbility`           | `/maplestorysea/v1/character/ability`            |
| `character.getItemEquipment`     | `/maplestorysea/v1/character/item-equipment`     |
| `character.getCashItemEquipment` | `/maplestorysea/v1/character/cashitem-equipment` |
| `character.getSymbolEquipment`   | `/maplestorysea/v1/character/symbol-equipment`   |
| `character.getSetEffect`         | `/maplestorysea/v1/character/set-effect`         |
| `character.getBeautyEquipment`   | `/maplestorysea/v1/character/beauty-equipment`   |
| `character.getAndroidEquipment`  | `/maplestorysea/v1/character/android-equipment`  |
| `character.getPetEquipment`      | `/maplestorysea/v1/character/pet-equipment`      |
| `character.getSkill`             | `/maplestorysea/v1/character/skill`              |
| `character.getLinkSkill`         | `/maplestorysea/v1/character/link-skill`         |
| `character.getVMatrix`           | `/maplestorysea/v1/character/vmatrix`            |
| `character.getHexaMatrix`        | `/maplestorysea/v1/character/hexamatrix`         |
| `character.getHexaMatrixStat`    | `/maplestorysea/v1/character/hexamatrix-stat`    |
| `character.getDojang`            | `/maplestorysea/v1/character/dojang`             |

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

`character.getStat()`의 `mentorship_stat`과 캐시 장비의 `skill_info`는 제공될 때 읽을 수 있습니다.
캐시 장비 스킬의 이름과 레벨은 `skill_info`에서 조회하세요. 기존 `skills`에는 폐지 예정 표시가 붙었습니다.
Dragon 및 Mechanic 장비의 잠재능력 필드는 포털에서 명세하지 않아 SDK 타입에서 optional로 제공하며 deprecated로 표시합니다.

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

| 메서드              | GET 경로                                |
| ------------------- | --------------------------------------- |
| `union.getUnion`    | `/maplestorysea/v1/user/union`          |
| `union.getRaider`   | `/maplestorysea/v1/user/union-raider`   |
| `union.getArtifact` | `/maplestorysea/v1/user/union-artifact` |
| `union.getChampion` | `/maplestorysea/v1/user/union-champion` |

```ts
const union = client.maplestorySEA.union;

await union.getUnion({ ocid }); // Union level/grade
await union.getRaider({ ocid }); // Union Raider (Legion)
await union.getArtifact({ ocid }); // Union Artifact
await union.getChampion({ ocid }); // Union Champion
```

## 길드 (2개)

| 메서드           | GET 경로                        |
| ---------------- | ------------------------------- |
| `guild.getId`    | `/maplestorysea/v1/guild/id`    |
| `guild.getBasic` | `/maplestorysea/v1/guild/basic` |

```ts
const guild = client.maplestorySEA.guild;

const guildId = await guild.getId('GuildName', 'Aquila');
await guild.getBasic({ oguild_id: guildId });
```

### 월드 목록

Aquila, Bootes, Cassiopeia, Draco, Elysium, Luna
