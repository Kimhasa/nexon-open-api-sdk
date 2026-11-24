# MapleStory Taiwan API reference

The SDK supports all 27 portal endpoints through `client.maplestoryTW`. The base path for the endpoints below is `/maplestorytw/v1`.

## Quick start

```ts
import { NexonClient } from 'nexon-open-api';

const tw = new NexonClient({ apiKey: 'YOUR_API_KEY' }).maplestoryTW;
const ocid = await tw.getOcid('CharacterName');
const basic = await tw.character.getBasic({ ocid });
const familiars = await tw.character.getFamiliar({ ocid, date: '2026-06-22' });
console.log(basic.character_level, familiars.familiar_info);
```

## Snapshot dates

- Requests accept a `YYYY-MM-DD` string, a `Date`, or `'today'`. The SDK resolves dates in Taiwan Standard Time (UTC+8). Omit `date` to use the API's default.
- Character and guild data starts on **2025-10-15**. Union data starts on **2025-10-14**, and Union Champion data starts on **2025-12-18**.
- A historical snapshot covers one local calendar day and is available from 2 AM the following day. Game updates take about 15 minutes to appear.

## Character identifier (1)

| Method                   | GET path | Result                      |
| ------------------------ | -------- | --------------------------- |
| `getOcid(characterName)` | `/id`    | Character identifier (OCID) |

The OCID can change when game content changes.

## Character (20)

| Method                           | GET path                        | Result                                   |
| -------------------------------- | ------------------------------- | ---------------------------------------- |
| `character.getBasic`             | `/character/basic`              | Basic character information              |
| `character.getPopularity`        | `/character/popularity`         | Popularity information                   |
| `character.getStat`              | `/character/stat`               | Comprehensive character stats            |
| `character.getHyperStat`         | `/character/hyper-stat`         | Hyper Stat information                   |
| `character.getPropensity`        | `/character/propensity`         | Character traits                         |
| `character.getAbility`           | `/character/ability`            | Ability information                      |
| `character.getItemEquipment`     | `/character/item-equipment`     | Equipped items, excluding cash items     |
| `character.getCashItemEquipment` | `/character/cashitem-equipment` | Equipped cash items                      |
| `character.getSymbolEquipment`   | `/character/symbol-equipment`   | Equipped symbols                         |
| `character.getSetEffect`         | `/character/set-effect`         | Active set effects                       |
| `character.getBeautyEquipment`   | `/character/beauty-equipment`   | Equipped hair, face, and skin            |
| `character.getAndroidEquipment`  | `/character/android-equipment`  | Equipped android information             |
| `character.getPetEquipment`      | `/character/pet-equipment`      | Equipped pets, pet skills, and pet items |
| `character.getSkill`             | `/character/skill`              | Character skills and Hyper Skills        |
| `character.getLinkSkill`         | `/character/link-skill`         | Equipped Link Skills                     |
| `character.getVMatrix`           | `/character/vmatrix`            | V Matrix slots and equipped V Nodes      |
| `character.getHexaMatrix`        | `/character/hexamatrix`         | Equipped HEXA Nodes                      |
| `character.getHexaMatrixStat`    | `/character/hexamatrix-stat`    | Configured HEXA Stats                    |
| `character.getDojang`            | `/character/dojang`             | Highest Mu Lung Dojo record              |
| `character.getFamiliar`          | `/character/familiar`           | Familiar details and link slots          |

```ts
const skill = await tw.character.getSkill({ ocid, character_skill_grade: '2.5' });
```

The supported skill grades are `'0'`, `'1'`, `'1.5'`, `'2'`, `'2.5'`, `'3'`, `'4'`, `'5'`, `'6'`, `'hyperpassive'`, and `'hyperactive'`. Grade `'0'` includes Zero's shared skills, and grade `'4'` includes Zero's Alpha and Beta skills.

## Union (4)

| Method              | GET path               | Result                                          |
| ------------------- | ---------------------- | ----------------------------------------------- |
| `union.getUnion`    | `/user/union`          | Union level and grade                           |
| `union.getRaider`   | `/user/union-raider`   | Union Raider member and grid occupation effects |
| `union.getArtifact` | `/user/union-artifact` | Union Artifact information                      |
| `union.getChampion` | `/user/union-champion` | Union Champion information                      |

```ts
const champion = await tw.union.getChampion({ ocid, date: '2025-12-18' });
```

## Guild (2)

| Method           | GET path       | Result                  |
| ---------------- | -------------- | ----------------------- |
| `guild.getId`    | `/guild/id`    | Guild identifier        |
| `guild.getBasic` | `/guild/basic` | Basic guild information |

```ts
const guildId = await tw.guild.getId('GuildName', '艾麗亞');
const guild = await tw.guild.getBasic({ oguild_id: guildId });
```

The guild lookup accepts these world names: 艾麗亞, 普力特, 琉德, 優依娜, 愛麗西亞, 米特拉, 挑戰者, 殺人鯨, 賽蓮.
