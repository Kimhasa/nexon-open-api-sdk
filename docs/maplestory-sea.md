# MapleStory SEA — nexon-open-api

> `client.maplestorySEA` · API 26개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/maplestorysea/)

동남아 서버(MapleStory SEA) 캐릭터의 스탯·장비·스킬·유니온과 길드 정보를 가져옵니다. SEA 유저를 위한 캐릭터 검색 사이트, 길드 디스코드 봇, 장비 비교 도구 같은 것을 만들 때 씁니다.

## 시작하기

캐릭터 이름으로 **캐릭터 고유 번호(OCID)** 를 먼저 받고, 그 번호로 원하는 정보를 조회합니다. 사용법은 [한국 메이플스토리](./maplestory.md)와 같습니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

// API 키는 코드에 적지 말고 환경변수로 읽는다
const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수에 MapleStory SEA API 키를 넣어 주세요.');

const client = new NexonClient({ apiKey });

try {
  // 1. 캐릭터 이름 → 캐릭터 고유 번호(OCID)
  const ocid = await client.maplestorySEA.getOcid('CharacterName');

  // 2. 기본 정보와 무릉도장(Mu Lung Garden) 최고 기록
  const basic = await client.maplestorySEA.character.getBasic({ ocid });
  const dojang = await client.maplestorySEA.character.getDojang({ ocid });

  console.log(`${basic.character_name} (${basic.world_name})`);
  console.log(`Lv.${basic.character_level} ${basic.character_class}`);
  console.log(`Mu Lung Garden: ${dojang.dojang_best_floor}F`);
  // 출력 예시
  // CharacterName (Aquila)
  // Lv.270 Night Lord
  // Mu Lung Garden: 55F
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.log('그런 캐릭터가 없습니다. 이름을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
```

실행: 위 코드를 `index.mjs` 로 저장하고, 같은 폴더의 `.env` 파일에 `NEXON_API_KEY=발급받은키` 를 적은 뒤 `node --env-file=.env index.mjs` 를 실행합니다 (Node.js 20.6 이상). 맨 바깥에서 `await` 를 쓰려면 파일 확장자가 `.mjs` 여야 합니다.

API 키는 게임마다 따로 발급받습니다. 한국 메이플스토리 키로는 SEA 서버를 조회할 수 없습니다. 처음이면 [시작 가이드](./getting-started.md)를 먼저 보세요.

> 이 문서의 짧은 코드 조각은 위 예제의 `client` 와 `ocid` 가 이미 있다고 가정합니다.

## 한국 메이플스토리와 다른 점

| 항목              | 한국 메이플스토리      | MapleStory SEA                                                                  |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------- |
| 날짜 기준         | 한국 시간 (KST, UTC+9) | **싱가포르 시간 (SGT, UTC+8)**                                                  |
| 데이터 제공 시작  | 2023년 12월 21일       | **2025년 4월 20일** (유니온 챔피언은 2025년 12월 18일)                          |
| 월드 이름         | 스카니아, 루나 …       | Aquila, Bootes, Cassiopeia, Draco, Burning                                      |
| 응답의 값         | 한국 서버 표기         | SEA 서버 표기 (직업·옵션 이름 등이 SEA 서버에서 쓰는 이름으로 옴)               |
| 조회할 수 있는 것 | 56개                   | 캐릭터 19개 · 유니온 4개 · 길드 2개 · 캐릭터 찾기 1개                           |
| SEA에 없는 것     | —                      | 내 캐릭터 목록, 강화 기록, 랭킹, 공지, 연무장, 스케줄러, 기타 능력치, 특수 반지 |

메서드 이름과 응답 필드 이름은 한국 메이플스토리와 같습니다. 필드 설명은 [메이플스토리 문서](./maplestory.md#카테고리별-사용법)를 함께 보세요.

## 게임 용어 ↔ SDK 대응표

메서드 이름 앞의 `client.maplestorySEA.` 는 생략했습니다. SEA 명칭은 넥슨 공식 문서의 표기입니다.

### 캐릭터 찾기 (1개)

| 게임에서 부르는 이름        | SEA 명칭             | SDK 메서드                 | 주요 응답 필드   |
| --------------------------- | -------------------- | -------------------------- | ---------------- |
| 캐릭터 고유 번호(OCID) 받기 | Character identifier | `getOcid('CharacterName')` | 반환값이 곧 OCID |

### 캐릭터 정보 (19개)

| 게임에서 부르는 이름            | SEA 명칭             | SDK 메서드                                            | 주요 응답 필드                                                        |
| ------------------------------- | -------------------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| 캐릭터 기본 정보                | Basic information    | `character.getBasic({ ocid })`                        | `character_level`, `character_class`, `world_name`, `character_image` |
| 인기도                          | Popularity           | `character.getPopularity({ ocid })`                   | `popularity`                                                          |
| 스탯 (종합 능력치)              | Comprehensive stats  | `character.getStat({ ocid })`                         | `final_stat` (스탯 이름·값 목록), `mentorship_stat`                   |
| 하이퍼 스탯                     | Hyper Stat           | `character.getHyperStat({ ocid })`                    | `use_preset_no`, `hyper_stat_preset_1`~`3`                            |
| 성향                            | Traits               | `character.getPropensity({ ocid })`                   | `charisma_level`, `insight_level` 등 6종                              |
| 어빌리티                        | Ability              | `character.getAbility({ ocid })`                      | `ability_grade`, `ability_info`                                       |
| 장착 장비 (스타포스·잠재능력)   | Equipment            | `character.getItemEquipment({ ocid })`                | `item_equipment`, `item_equipment_preset_1`~`3`, `title`              |
| 캐시 장비                       | Cash items           | `character.getCashItemEquipment({ ocid })`            | `cash_item_equipment_base`                                            |
| 심볼                            | Symbols              | `character.getSymbolEquipment({ ocid })`              | `symbol` (이름·레벨·`symbol_force`)                                   |
| 세트 효과                       | Set item effects     | `character.getSetEffect({ ocid })`                    | `set_effect`                                                          |
| 헤어·성형·피부                  | Hair, face, and skin | `character.getBeautyEquipment({ ocid })`              | `character_hair`, `character_face`, `character_skin`                  |
| 안드로이드                      | Android              | `character.getAndroidEquipment({ ocid })`             | `android_name`, `android_cash_item_equipment`                         |
| 펫                              | Pets                 | `character.getPetEquipment({ ocid })`                 | `pet_1_name`, `pet_1_equipment`                                       |
| 스킬 (전직 차수별)              | Skills, Hyper Skills | `character.getSkill({ ocid, character_skill_grade })` | `character_skill`                                                     |
| 링크 스킬                       | Link Skills          | `character.getLinkSkill({ ocid })`                    | `character_link_skill`, `character_owned_link_skill`                  |
| V매트릭스 (5차)                 | V Matrix, Nodes      | `character.getVMatrix({ ocid })`                      | `character_v_core_equipment`                                          |
| HEXA 매트릭스 (6차) > HEXA 코어 | HEXA Nodes           | `character.getHexaMatrix({ ocid })`                   | `character_hexa_core_equipment`                                       |
| HEXA 매트릭스 > HEXA 스탯       | HEXA Stats           | `character.getHexaMatrixStat({ ocid })`               | `character_hexa_stat_core`                                            |
| 무릉도장 최고 기록              | Mu Lung Garden       | `character.getDojang({ ocid })`                       | `dojang_best_floor`, `dojang_best_time` (초)                          |

### 유니온 (4개)

| 게임에서 부르는 이름 | SEA 명칭       | SDK 메서드                    | 주요 응답 필드                                            |
| -------------------- | -------------- | ----------------------------- | --------------------------------------------------------- |
| 유니온 레벨·등급     | Union          | `union.getUnion({ ocid })`    | `union_level`, `union_grade`                              |
| 유니온 공격대 배치   | Union Raider   | `union.getRaider({ ocid })`   | `union_block`, `union_raider_stat`, `union_occupied_stat` |
| 유니온 아티팩트      | Union Artifact | `union.getArtifact({ ocid })` | `union_artifact_effect`, `union_artifact_crystal`         |
| 유니온 챔피언        | Union Champion | `union.getChampion({ ocid })` | `union_champion`, `champion_badge_total_info`             |

### 길드 (2개)

| 게임에서 부르는 이름 | SEA 명칭          | SDK 메서드                           | 주요 응답 필드                                     |
| -------------------- | ----------------- | ------------------------------------ | -------------------------------------------------- |
| 길드 고유 번호 받기  | Guild identifier  | `guild.getId('GuildName', 'Aquila')` | 반환값이 곧 길드 고유 번호                         |
| 길드 정보            | Guild information | `guild.getBasic({ oguild_id })`      | `guild_level`, `guild_master_name`, `guild_member` |

## 알아두기

- **OCID — 캐릭터 고유 번호.** `getOcid('CharacterName')` 으로 받습니다. 넥슨은 게임 콘텐츠가 바뀌면 OCID가 바뀔 수 있다고 안내합니다. 저장해 둔 OCID로 조회가 실패하면 이름으로 다시 받으세요.
- **길드 고유 번호(`oguild_id`).** 길드 이름과 월드 이름으로 `guild.getId()` 에서 받습니다.
- **날짜는 싱가포르 시간(UTC+8) 기준** `'YYYY-MM-DD'` 문자열입니다. `Date` 객체로 만들려면 `toNexonDate(new Date(), 480)` 처럼 480분(UTC+8)을 넣습니다.
- **데이터 반영:** 게임에서 바뀐 내용은 약 15분 뒤에 조회됩니다. `date` 를 생략하면 가장 최근 데이터를 받습니다. 날짜를 넣으면 그날 하루(0시~24시)의 데이터이고, 지난 날짜의 데이터는 다음날 오전 2시(SGT)부터 조회됩니다.
- **응답의 기준일:** 캐릭터와 유니온의 최신 데이터에서 `date` 는 `null` 일 수 있습니다.
- **2025년 4월 20일 이전 날짜는 조회할 수 없습니다.** 유니온 챔피언은 2025년 12월 18일 데이터부터 있습니다.
- **월드 이름:** Aquila, Bootes, Cassiopeia, Draco, Burning (넥슨 공식 문서 기준). `guild.getId()` 의 두 번째 인자로 넣습니다.
- **스킬 차수(`character_skill_grade`):** `'0'`, `'1'`, `'1.5'`, `'2'`, `'2.5'`, `'3'`, `'4'`, `'hyperpassive'`, `'hyperactive'`, `'5'`, `'6'`
- **숫자와 참/거짓이 문자열로 올 때가 많습니다.** 스타포스(`starforce`), 스탯 값(`stat_value`) 등은 문자열이라 계산하려면 `Number()` 로 바꿉니다.
- **더 이상 권장하지 않는 필드**
  - 캐시 장비의 `skills` — 스킬 이름과 레벨은 `skill_info` 에서 읽으세요.
  - 드래곤(Evan)·메카닉 장비의 잠재능력 필드와 `item_exceptional_option.exceptional_upgrade` — 넥슨 문서에 없는 필드라 값이 없을 수 있습니다.
- 스탯의 `mentorship_stat` 과 캐시 장비의 `skill_info` 는 넥슨이 값을 줄 때만 들어 있습니다.
- 응답 모양이 넥슨 문서와 달라졌는지 확인하고 싶으면 `new NexonClient({ apiKey, responseValidation: true })` 로 만들어 보세요. 다른 점이 있으면 경고로 알려 줍니다 (요청은 그대로 성공합니다).

## 카테고리별 사용법

### 캐릭터 장비·스탯

```js
// 장비 비교 도구: 부위별 장비와 Star Force, Potential
const equip = await client.maplestorySEA.character.getItemEquipment({ ocid });
for (const item of equip.item_equipment) {
  console.log(`[${item.item_equipment_part}] ${item.item_name} ★${item.starforce}`);
  if (item.potential_option_1 !== null) {
    console.log(`  Potential (${item.potential_option_grade ?? '-'}): ${item.potential_option_1}`);
  }
}

// 특정 날짜의 스탯 (싱가포르 시간 기준)
const stat = await client.maplestorySEA.character.getStat({ ocid, date: '2026-11-01' });
for (const s of stat.final_stat) console.log(`${s.stat_name}: ${s.stat_value}`);
```

- `item_equipment[]` — `starforce` 스타포스, `potential_option_1`~`3` 잠재능력, `additional_potential_option_1`~`3` 에디셔널 잠재능력, `item_total_option` 최종 옵션. 잠재능력 줄에 값이 없으면 `null` 입니다.
- 업그레이드 가능 횟수 — `scroll_upgradeable_count` (`string | undefined`). 장착 장비와 프리셋 장비에 쓰입니다.
- 프리셋 장비 슬롯 — `item_equipment_slot` (`string | undefined`). 프리셋 장비에는 잠재능력 봉인 상태 `potential_option_flag`, `additional_potential_option_flag` (`string | undefined`)도 올 수 있습니다.
- `final_stat[]` — `{ stat_name, stat_value }` 목록. 원하는 스탯은 이름으로 찾습니다.
- 6차 스킬은 `character.getSkill({ ocid, character_skill_grade: '6' })`, HEXA 코어는 `character.getHexaMatrix({ ocid })` 로 조회합니다.

### 유니온

```js
// 유니온 요약
const union = await client.maplestorySEA.union.getUnion({ ocid });
const raider = await client.maplestorySEA.union.getRaider({ ocid });

console.log(`Union Lv.${union.union_level} (${union.union_grade})`);
console.log(raider.union_raider_stat); // 공격대원 효과
console.log(raider.union_occupied_stat); // 공격대 점령 효과
```

블록 좌표(`union_block[].block_position`)의 읽는 법은 [메이플스토리 문서의 유니온](./maplestory.md#유니온)과 같습니다.

### 길드

```js
// 길드 소개
const guildId = await client.maplestorySEA.guild.getId('GuildName', 'Aquila');
const guild = await client.maplestorySEA.guild.getBasic({ oguild_id: guildId });

console.log(`${guild.guild_name} Lv.${guild.guild_level} — Master: ${guild.guild_master_name}`);
console.log(`${guild.guild_member_count} members:`, guild.guild_member.join(', '));
```

`guild_member` 는 길드원 캐릭터 이름 목록입니다. 길드원의 레벨·직업은 이름마다 `getOcid()` → `character.getBasic()` 을 다시 조회합니다.

<details><summary>넥슨 API 경로</summary>

모든 경로 앞에 `https://open.api.nexon.com` 이 붙습니다.

| SDK 메서드                       | 경로                                                 |
| -------------------------------- | ---------------------------------------------------- |
| `getOcid`                        | `GET /maplestorysea/v1/id`                           |
| `character.getBasic`             | `GET /maplestorysea/v1/character/basic`              |
| `character.getPopularity`        | `GET /maplestorysea/v1/character/popularity`         |
| `character.getStat`              | `GET /maplestorysea/v1/character/stat`               |
| `character.getHyperStat`         | `GET /maplestorysea/v1/character/hyper-stat`         |
| `character.getPropensity`        | `GET /maplestorysea/v1/character/propensity`         |
| `character.getAbility`           | `GET /maplestorysea/v1/character/ability`            |
| `character.getItemEquipment`     | `GET /maplestorysea/v1/character/item-equipment`     |
| `character.getCashItemEquipment` | `GET /maplestorysea/v1/character/cashitem-equipment` |
| `character.getSymbolEquipment`   | `GET /maplestorysea/v1/character/symbol-equipment`   |
| `character.getSetEffect`         | `GET /maplestorysea/v1/character/set-effect`         |
| `character.getBeautyEquipment`   | `GET /maplestorysea/v1/character/beauty-equipment`   |
| `character.getAndroidEquipment`  | `GET /maplestorysea/v1/character/android-equipment`  |
| `character.getPetEquipment`      | `GET /maplestorysea/v1/character/pet-equipment`      |
| `character.getSkill`             | `GET /maplestorysea/v1/character/skill`              |
| `character.getLinkSkill`         | `GET /maplestorysea/v1/character/link-skill`         |
| `character.getVMatrix`           | `GET /maplestorysea/v1/character/vmatrix`            |
| `character.getHexaMatrix`        | `GET /maplestorysea/v1/character/hexamatrix`         |
| `character.getHexaMatrixStat`    | `GET /maplestorysea/v1/character/hexamatrix-stat`    |
| `character.getDojang`            | `GET /maplestorysea/v1/character/dojang`             |
| `union.getUnion`                 | `GET /maplestorysea/v1/user/union`                   |
| `union.getRaider`                | `GET /maplestorysea/v1/user/union-raider`            |
| `union.getArtifact`              | `GET /maplestorysea/v1/user/union-artifact`          |
| `union.getChampion`              | `GET /maplestorysea/v1/user/union-champion`          |
| `guild.getId`                    | `GET /maplestorysea/v1/guild/id`                     |
| `guild.getBasic`                 | `GET /maplestorysea/v1/guild/basic`                  |

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
    const ocid = await client.maplestorySEA.getOcid(characterName);
    const [basic, union, dojang] = await Promise.all([
      client.maplestorySEA.character.getBasic({ ocid }),
      client.maplestorySEA.union.getUnion({ ocid }),
      client.maplestorySEA.character.getDojang({ ocid }),
    ]);
    return [
      `**${basic.character_name}** (${basic.world_name})`,
      `Lv.${basic.character_level} ${basic.character_class}`,
      `Guild: ${basic.character_guild_name || '-'}`,
      `Union Lv.${union.union_level} (${union.union_grade})`,
      `Mu Lung Garden: ${dojang.dojang_best_floor}F`,
    ].join('\n');
  } catch (err) {
    if (err instanceof NexonNotFoundError) return `Character '${characterName}' not found.`;
    throw err;
  }
}

console.log(await summarize('CharacterName'));
// 출력 예시
// **CharacterName** (Aquila)
// Lv.270 Night Lord
// Guild: GuildName
// Union Lv.8000 (Grand Master Union III)
// Mu Lung Garden: 55F
```

### 2. 일주일 레벨 변화 기록

과거 날짜를 넣어 하루씩 조회하면 성장 그래프를 그릴 수 있습니다.

```js
import { NexonClient, toNexonDate } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

const ocid = await client.maplestorySEA.getOcid('CharacterName');
const DAY = 24 * 60 * 60 * 1000;

for (let i = 7; i >= 1; i--) {
  // 480 = 싱가포르 시간(UTC+8)
  const date = toNexonDate(new Date(Date.now() - i * DAY), 480);
  const basic = await client.maplestorySEA.character.getBasic({ ocid, date });
  console.log(`${date}: Lv.${basic.character_level} (${basic.character_exp_rate}%)`);
}
// 출력 예시
// 2026-11-17: Lv.270 (12.345%)
// 2026-11-18: Lv.270 (15.678%)
```

두 예제 모두 `index.mjs` 로 저장하고 `node --env-file=.env index.mjs` 로 실행합니다. 더 많은 예제는 [examples](../examples/README.md)에 있습니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 필드 설명이 더 자세한 기준 문서: [메이플스토리](./maplestory.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
