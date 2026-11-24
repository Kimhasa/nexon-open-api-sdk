# MapleStory Taiwan — nexon-open-api

> `client.maplestoryTW` · API 27개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/maplestorytw/)

대만 서버(楓之谷) 캐릭터의 스탯·장비·스킬·유니온(戰地)·패밀리어(萌獸)와 길드(公會) 정보를 가져옵니다. 대만 서버 유저를 위한 캐릭터 검색 사이트, 길드 디스코드 봇, 패밀리어 옵션 정리 도구 같은 것을 만들 때 씁니다.

## 시작하기

캐릭터 이름으로 **캐릭터 고유 번호(OCID)** 를 먼저 받고, 그 번호로 원하는 정보를 조회합니다. 사용법은 [한국 메이플스토리](./maplestory.md)와 같습니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

// API 키는 코드에 적지 말고 환경변수로 읽는다
const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수에 MapleStory Taiwan API 키를 넣어 주세요.');

const client = new NexonClient({ apiKey });

try {
  // 1. 캐릭터 이름 → 캐릭터 고유 번호(OCID)
  const ocid = await client.maplestoryTW.getOcid('CharacterName');

  // 2. 기본 정보와 패밀리어(萌獸)
  const basic = await client.maplestoryTW.character.getBasic({ ocid });
  const familiar = await client.maplestoryTW.character.getFamiliar({ ocid });

  console.log(`${basic.character_name} (${basic.world_name})`);
  console.log(`Lv.${basic.character_level} ${basic.character_class}`);
  console.log(`萌獸 ${familiar.familiar_info.length}마리`);
  // 출력 예시
  // CharacterName (艾麗亞)
  // Lv.270 夜使者
  // 萌獸 12마리
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.log('그런 캐릭터가 없습니다. 이름을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
```

실행: 위 코드를 `index.mjs` 로 저장하고, 같은 폴더의 `.env` 파일에 `NEXON_API_KEY=발급받은키` 를 적은 뒤 `node --env-file=.env index.mjs` 를 실행합니다 (Node.js 20.6 이상). 맨 바깥에서 `await` 를 쓰려면 파일 확장자가 `.mjs` 여야 합니다.

API 키는 게임마다 따로 발급받습니다. 한국 메이플스토리 키로는 대만 서버를 조회할 수 없습니다. 처음이면 [시작 가이드](./getting-started.md)를 먼저 보세요.

> 이 문서의 짧은 코드 조각은 위 예제의 `client` 와 `ocid` 가 이미 있다고 가정합니다.

## 한국 메이플스토리와 다른 점

| 항목             | 한국 메이플스토리      | MapleStory Taiwan                                                                   |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| 날짜 기준        | 한국 시간 (KST, UTC+9) | **대만 시간 (TST, UTC+8)**                                                          |
| 날짜 형식        | `'YYYY-MM-DD'` 문자열  | `'YYYY-MM-DD'` 문자열 또는 `Date` 객체                                              |
| 데이터 제공 시작 | 2023년 12월 21일       | 캐릭터·길드 **2025년 10월 15일**, 유니온 **10월 14일**, 유니온 챔피언 **12월 18일** |
| 월드 이름        | 스카니아, 루나 …       | 艾麗亞, 普力特, 琉德, 優依娜, 愛麗西亞, 米特拉, 挑戰者, 殺人鯨, 賽蓮                |
| 대만에만 있는 것 | —                      | **패밀리어(萌獸)** — `character.getFamiliar()`                                      |
| 대만에 없는 것   | —                      | 내 캐릭터 목록, 강화 기록, 랭킹, 공지, 연무장, 스케줄러, 기타 능력치, 특수 반지     |

메서드 이름과 응답 필드 이름은 한국 메이플스토리와 같습니다. 필드 설명은 [메이플스토리 문서](./maplestory.md#카테고리별-사용법)를 함께 보세요.

## 게임 용어 ↔ SDK 대응표

메서드 이름 앞의 `client.maplestoryTW.` 는 생략했습니다. 대만 명칭은 넥슨 공식 문서의 표기입니다.

### 캐릭터 찾기 (1개)

| 게임에서 부르는 이름        | 대만 명칭         | SDK 메서드                 | 주요 응답 필드   |
| --------------------------- | ----------------- | -------------------------- | ---------------- |
| 캐릭터 고유 번호(OCID) 받기 | 角色辨識器 (OCID) | `getOcid('CharacterName')` | 반환값이 곧 OCID |

### 캐릭터 정보 (20개)

| 게임에서 부르는 이름            | 대만 명칭        | SDK 메서드                                            | 주요 응답 필드                                                        |
| ------------------------------- | ---------------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| 캐릭터 기본 정보                | 基本資訊         | `character.getBasic({ ocid })`                        | `character_level`, `character_class`, `world_name`, `character_image` |
| 인기도                          | 名聲             | `character.getPopularity({ ocid })`                   | `popularity`                                                          |
| 스탯 (종합 능력치)              | 綜合能力值       | `character.getStat({ ocid })`                         | `final_stat` (스탯 이름·값 목록)                                      |
| 하이퍼 스탯                     | 極限屬性         | `character.getHyperStat({ ocid })`                    | `use_preset_no`, `hyper_stat_preset_1`~`3`                            |
| 성향                            | 性向             | `character.getPropensity({ ocid })`                   | `charisma_level`, `insight_level` 등 6종                              |
| 어빌리티                        | 能力             | `character.getAbility({ ocid })`                      | `ability_grade`, `ability_info`                                       |
| 장착 장비 (스타포스·잠재능력)   | 已裝備道具       | `character.getItemEquipment({ ocid })`                | `item_equipment`, `item_equipment_preset_1`~`3`, `title`              |
| 캐시 장비                       | 已裝備現金道具   | `character.getCashItemEquipment({ ocid })`            | `cash_item_equipment_base`                                            |
| 심볼                            | 符文             | `character.getSymbolEquipment({ ocid })`              | `symbol` (이름·레벨·`symbol_force`)                                   |
| 세트 효과                       | 套裝效果         | `character.getSetEffect({ ocid })`                    | `set_effect`                                                          |
| 헤어·성형·피부                  | 髮型、臉型與膚色 | `character.getBeautyEquipment({ ocid })`              | `character_hair`, `character_face`, `character_skin`                  |
| 안드로이드                      | 機器人           | `character.getAndroidEquipment({ ocid })`             | `android_name`, `android_cash_item_equipment`                         |
| 펫                              | 寵物             | `character.getPetEquipment({ ocid })`                 | `pet_1_name`, `pet_1_equipment`                                       |
| 스킬 (전직 차수별)              | 技能、超技能     | `character.getSkill({ ocid, character_skill_grade })` | `character_skill`                                                     |
| 링크 스킬                       | 連結技能         | `character.getLinkSkill({ ocid })`                    | `character_link_skill`, `character_owned_link_skill`                  |
| V매트릭스 (5차)                 | V 矩陣、V 核心   | `character.getVMatrix({ ocid })`                      | `character_v_core_equipment`                                          |
| HEXA 매트릭스 (6차) > HEXA 코어 | HEXA 核心        | `character.getHexaMatrix({ ocid })`                   | `character_hexa_core_equipment`                                       |
| HEXA 매트릭스 > HEXA 스탯       | HEXA 屬性        | `character.getHexaMatrixStat({ ocid })`               | `character_hexa_stat_core`                                            |
| 무릉도장 최고 기록              | 武陵道場         | `character.getDojang({ ocid })`                       | `dojang_best_floor`, `dojang_best_time` (초)                          |
| 패밀리어                        | 萌獸             | `character.getFamiliar({ ocid })`                     | `familiar_info` (패밀리어 목록), `familiar_link_slot`                 |

### 유니온 (4개)

| 게임에서 부르는 이름 | 대만 명칭  | SDK 메서드                    | 주요 응답 필드                                            |
| -------------------- | ---------- | ----------------------------- | --------------------------------------------------------- |
| 유니온 레벨·등급     | 戰地       | `union.getUnion({ ocid })`    | `union_level`, `union_grade`                              |
| 유니온 공격대 배치   | 戰地攻擊隊 | `union.getRaider({ ocid })`   | `union_block`, `union_raider_stat`, `union_occupied_stat` |
| 유니온 아티팩트      | 戰地神器   | `union.getArtifact({ ocid })` | `union_artifact_effect`, `union_artifact_crystal`         |
| 유니온 챔피언        | 聯盟冠軍   | `union.getChampion({ ocid })` | `union_champion`, `champion_badge_total_info`             |

### 길드 (2개)

| 게임에서 부르는 이름 | 대만 명칭    | SDK 메서드                           | 주요 응답 필드                                     |
| -------------------- | ------------ | ------------------------------------ | -------------------------------------------------- |
| 길드 고유 번호 받기  | 公會識別碼   | `guild.getId('GuildName', '艾麗亞')` | 반환값이 곧 길드 고유 번호                         |
| 길드 정보            | 公會基本資訊 | `guild.getBasic({ oguild_id })`      | `guild_level`, `guild_master_name`, `guild_member` |

## 알아두기

- **OCID — 캐릭터 고유 번호.** `getOcid('CharacterName')` 으로 받습니다. 넥슨은 게임 콘텐츠가 바뀌면 OCID가 바뀔 수 있다고 안내합니다. 저장해 둔 OCID로 조회가 실패하면 이름으로 다시 받으세요.
- **길드 고유 번호(`oguild_id`).** 길드 이름과 월드 이름으로 `guild.getId()` 에서 받습니다.
- **날짜는 대만 시간(UTC+8) 기준입니다.** `date` 에 `'2026-11-01'` 같은 날짜 문자열이나 `Date` 객체를 넣을 수 있습니다. SDK는 `Date` 객체를 대만 시간의 달력 날짜로 바꿔 보냅니다.
- **조회할 수 없는 날짜는 요청 전에 걸러 줍니다.** 캐릭터·길드는 2025-10-15부터, 유니온은 2025-10-14부터, 유니온 챔피언은 2025-12-18부터 어제까지 조회할 수 있습니다. 형식이 잘못되었거나 조회 범위를 벗어난 날짜는 SDK가 요청 전에 `NexonBadRequestError` (`OPENAPI00004`)로 알려줍니다.
- **데이터 반영:** 게임에서 바뀐 내용은 약 15분 뒤에 조회됩니다. `date` 를 생략하면 가장 최근 데이터를 받습니다. 날짜를 넣으면 그날 하루(0시~24시)의 데이터이고, 지난 날짜의 데이터는 다음날 오전 2시(대만 시간)부터 조회됩니다.
- **응답의 기준일:** 캐릭터·유니온·길드의 최신 데이터에서 `date` 는 `null` 일 수 있습니다.
- **월드 이름:** 艾麗亞, 普力特, 琉德, 優依娜, 愛麗西亞, 米特拉, 挑戰者, 殺人鯨, 賽蓮. `guild.getId()` 는 이 이름만 받습니다.
- **스킬 차수(`character_skill_grade`):** `'0'`(0차·제로 공용), `'1'`, `'1.5'`, `'2'`, `'2.5'`, `'3'`, `'4'`(제로 알파/베타 포함), `'5'`, `'6'`, `'hyperpassive'`, `'hyperactive'`
- **숫자와 참/거짓이 문자열로 올 때가 많습니다.** 스타포스(`starforce`), 스탯 값(`stat_value`), 패밀리어 연결 슬롯의 `active_flag`(`"true"` / `"false"`) 등은 문자열입니다.

## 카테고리별 사용법

### 패밀리어 (萌獸)

대만 서버에만 있는 조회입니다.

```js
// 패밀리어 옵션 정리: 소환 중인 패밀리어와 옵션
const familiar = await client.maplestoryTW.character.getFamiliar({ ocid });

for (const f of familiar.familiar_info) {
  console.log(`${f.familiar_name} Lv.${f.familiar_level} (${f.familiar_grade ?? '-'})`);
  for (const opt of f.option) console.log(`  ${opt.option_name} ${opt.option_value}`);
}

// 연결 슬롯 (1, 2, 3, vip)
for (const slot of familiar.familiar_link_slot) {
  console.log(`슬롯 ${slot.slot_id}: ${slot.familiar_name ?? '비어 있음'}`);
}
```

- `familiar_info[]` — 패밀리어 한 마리. `familiar_grade` 등급, `familiar_level` 레벨, `skill_name` 배운 스킬, `option[]` 옵션 목록. 등급이나 배운 스킬에 값이 없으면 `null` 입니다.
- `familiar_info[].slot_id` — 연결된 슬롯 (`"1"`, `"2"`, `"3"`, `"vip"`). 연결되지 않았으면 `"not link"`
- `familiar_link_slot[]` — 연결 슬롯. `familiar_name` 이 `null` 이면 빈 슬롯, `active_flag` 가 `"true"` 면 활성화된 슬롯

### 캐릭터 장비·스탯·스킬

```js
// 장비 요약
const equip = await client.maplestoryTW.character.getItemEquipment({ ocid });
for (const item of equip.item_equipment) {
  console.log(`[${item.item_equipment_part}] ${item.item_name} ★${item.starforce}`);
}

// 대만 시간 기준 어제의 종합 능력치
const yesterday = new Date(Date.now() - 86_400_000);
const stat = await client.maplestoryTW.character.getStat({ ocid, date: yesterday });
for (const s of stat.final_stat) console.log(`${s.stat_name}: ${s.stat_value}`);

// 2.5차 스킬
const skill = await client.maplestoryTW.character.getSkill({ ocid, character_skill_grade: '2.5' });
console.log(skill.character_skill.map((s) => s.skill_name));
```

- `item_equipment[]` — `starforce` 스타포스, `potential_option_1`~`3` 잠재능력, `additional_potential_option_1`~`3` 에디셔널 잠재능력, `item_total_option` 최종 옵션. 잠재능력 줄에 값이 없으면 `null` 입니다.
- 장착한 칭호가 없으면 `title` 값은 `null` 입니다. 훈장 외형 정보가 없으면 `medal_shape` 값도 `null` 일 수 있습니다.
- 업그레이드 가능 횟수 — `scroll_upgradeable_count` (`string | undefined`). 장착 장비와 프리셋 장비에 쓰입니다.
- 프리셋 장비 슬롯 — `item_equipment_slot` (`string | undefined`). 프리셋 장비에는 잠재능력 봉인 상태 `potential_option_flag`, `additional_potential_option_flag` (`string | undefined`)도 올 수 있습니다.
- 펫 잠재능력 증가량 — `pet_1_potential`~`pet_3_potential` 원소의 `potential_increase1`, `potential_increase2` (`string | null | undefined`).
- HEXA 코어 — `character_hexa_core_equipment` 값이 `null` 이면 표시할 코어 정보가 없습니다. HEXA 스탯의 코어 II·III 배열도 각각 `null` 일 수 있습니다.
- `final_stat[]` — `{ stat_name, stat_value }` 목록. 원하는 스탯은 이름으로 찾습니다.
- `getBasic()` 의 `character_image` 는 캐릭터 외형 이미지 주소입니다. 넥슨 안내에 따르면 주소 뒤에 쿼리 파라미터를 붙여 동작·감정표현을 바꿀 수 있습니다.

### 유니온 (戰地)

```js
// 유니온 챔피언은 2025-12-18 데이터부터 있다
const champion = await client.maplestoryTW.union.getChampion({ ocid, date: '2025-12-18' });
for (const c of champion.union_champion) {
  console.log(`${c.champion_name} (${c.champion_class}) — ${c.champion_grade}`);
}

const union = await client.maplestoryTW.union.getUnion({ ocid });
console.log(`戰地 Lv.${union.union_level} (${union.union_grade})`);
```

블록 좌표(`union_block[].block_position`)의 읽는 법은 [메이플스토리 문서의 유니온](./maplestory.md#유니온)과 같습니다.

### 길드 (公會)

```js
// 길드 소개
const guildId = await client.maplestoryTW.guild.getId('GuildName', '艾麗亞');
const guild = await client.maplestoryTW.guild.getBasic({ oguild_id: guildId });

console.log(`${guild.guild_name} Lv.${guild.guild_level} — ${guild.guild_master_name}`);
console.log(guild.guild_member.join(', '));
```

`guild_member` 는 길드원 캐릭터 이름 목록입니다. 길드원의 레벨·직업은 이름마다 `getOcid()` → `character.getBasic()` 을 다시 조회합니다.

<details><summary>넥슨 API 경로</summary>

모든 경로 앞에 `https://open.api.nexon.com` 이 붙습니다.

| SDK 메서드                       | 경로                                                |
| -------------------------------- | --------------------------------------------------- |
| `getOcid`                        | `GET /maplestorytw/v1/id`                           |
| `character.getBasic`             | `GET /maplestorytw/v1/character/basic`              |
| `character.getPopularity`        | `GET /maplestorytw/v1/character/popularity`         |
| `character.getStat`              | `GET /maplestorytw/v1/character/stat`               |
| `character.getHyperStat`         | `GET /maplestorytw/v1/character/hyper-stat`         |
| `character.getPropensity`        | `GET /maplestorytw/v1/character/propensity`         |
| `character.getAbility`           | `GET /maplestorytw/v1/character/ability`            |
| `character.getItemEquipment`     | `GET /maplestorytw/v1/character/item-equipment`     |
| `character.getCashItemEquipment` | `GET /maplestorytw/v1/character/cashitem-equipment` |
| `character.getSymbolEquipment`   | `GET /maplestorytw/v1/character/symbol-equipment`   |
| `character.getSetEffect`         | `GET /maplestorytw/v1/character/set-effect`         |
| `character.getBeautyEquipment`   | `GET /maplestorytw/v1/character/beauty-equipment`   |
| `character.getAndroidEquipment`  | `GET /maplestorytw/v1/character/android-equipment`  |
| `character.getPetEquipment`      | `GET /maplestorytw/v1/character/pet-equipment`      |
| `character.getSkill`             | `GET /maplestorytw/v1/character/skill`              |
| `character.getLinkSkill`         | `GET /maplestorytw/v1/character/link-skill`         |
| `character.getVMatrix`           | `GET /maplestorytw/v1/character/vmatrix`            |
| `character.getHexaMatrix`        | `GET /maplestorytw/v1/character/hexamatrix`         |
| `character.getHexaMatrixStat`    | `GET /maplestorytw/v1/character/hexamatrix-stat`    |
| `character.getDojang`            | `GET /maplestorytw/v1/character/dojang`             |
| `character.getFamiliar`          | `GET /maplestorytw/v1/character/familiar`           |
| `union.getUnion`                 | `GET /maplestorytw/v1/user/union`                   |
| `union.getRaider`                | `GET /maplestorytw/v1/user/union-raider`            |
| `union.getArtifact`              | `GET /maplestorytw/v1/user/union-artifact`          |
| `union.getChampion`              | `GET /maplestorytw/v1/user/union-champion`          |
| `guild.getId`                    | `GET /maplestorytw/v1/guild/id`                     |
| `guild.getBasic`                 | `GET /maplestorytw/v1/guild/basic`                  |

</details>

응답의 나머지 필드는 에디터 자동완성에서 확인하세요.

## 만들기 예제

### 1. 디스코드 봇 응답용 캐릭터 요약

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

async function summarize(characterName) {
  try {
    const ocid = await client.maplestoryTW.getOcid(characterName);
    const [basic, union, dojang] = await Promise.all([
      client.maplestoryTW.character.getBasic({ ocid }),
      client.maplestoryTW.union.getUnion({ ocid }),
      client.maplestoryTW.character.getDojang({ ocid }),
    ]);
    return [
      `**${basic.character_name}** (${basic.world_name})`,
      `Lv.${basic.character_level} ${basic.character_class}`,
      `公會: ${basic.character_guild_name ?? '-'}`,
      `戰地 Lv.${union.union_level} (${union.union_grade})`,
      `武陵道場: ${dojang.dojang_best_floor}F`,
    ].join('\n');
  } catch (err) {
    if (err instanceof NexonNotFoundError) return `'${characterName}' 캐릭터를 찾지 못했습니다.`;
    throw err;
  }
}

console.log(await summarize('CharacterName'));
// 출력 예시
// **CharacterName** (艾麗亞)
// Lv.270 夜使者
// 公會: GuildName
// 戰地 Lv.8000 (...)
// 武陵道場: 55F
```

### 2. 길드원 레벨표

```js
import { NexonClient, NexonError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

const guildId = await client.maplestoryTW.guild.getId('GuildName', '艾麗亞');
const guild = await client.maplestoryTW.guild.getBasic({ oguild_id: guildId });

for (const name of guild.guild_member) {
  try {
    const ocid = await client.maplestoryTW.getOcid(name);
    const basic = await client.maplestoryTW.character.getBasic({ ocid });
    console.log(`Lv.${basic.character_level} ${name} (${basic.character_class})`);
  } catch (err) {
    // 조회에 실패한 길드원은 건너뛴다
    if (!(err instanceof NexonError)) throw err;
  }
}
// 출력 예시
// Lv.275 Member1 (夜使者)
// Lv.270 Member2 (主教)
```

두 예제 모두 `index.mjs` 로 저장하고 `node --env-file=.env index.mjs` 로 실행합니다. 더 많은 예제는 [examples](../examples/README.md)에 있습니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 필드 설명이 더 자세한 기준 문서: [메이플스토리](./maplestory.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
