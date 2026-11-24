# 메이플스토리M — nexon-open-api

> `client.maplestorym` · API 38개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/maplestorym/)

월드 이름과 캐릭터 이름으로 메이플스토리M 캐릭터의 스탯·장비·쥬얼·스킬·유니온을 가져오고, 전투력·무릉도장·샤레니안 랭킹을 조회합니다. 캐릭터 검색 사이트, 길드원 활동량 정리 봇, 월드별 전투력 순위표 같은 것을 만들 때 씁니다.

## 시작하기

메이플스토리M은 캐릭터를 찾을 때 **월드 이름이 꼭 필요합니다.** 월드 이름과 캐릭터 이름으로 **캐릭터 고유 번호(OCID)** 를 받고, 그 번호로 정보를 조회합니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

// API 키는 코드에 적지 말고 환경변수로 읽는다
const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수에 메이플스토리M API 키를 넣어 주세요.');

const client = new NexonClient({ apiKey });

try {
  // 1. 월드 이름 + 캐릭터 이름 → 캐릭터 고유 번호(OCID)
  const ocid = await client.maplestorym.getOcid('스카니아', '캐릭터명');

  // 2. 기본 정보와 가입 길드
  const basic = await client.maplestorym.character.getBasic({ ocid });
  const guild = await client.maplestorym.character.getGuild({ ocid });

  console.log(`${basic.character_name} (${basic.world_name})`);
  console.log(`Lv.${basic.character_level} ${basic.character_class}`);
  console.log(`길드: ${guild.guild_name ?? '없음'}`);
  // 출력 예시
  // 캐릭터명 (스카니아)
  // Lv.250 나이트로드
  // 길드: 길드명
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.log('그런 캐릭터가 없습니다. 월드와 이름을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
```

실행: 위 코드를 `index.mjs` 로 저장하고, 같은 폴더의 `.env` 파일에 `NEXON_API_KEY=발급받은키` 를 적은 뒤 `node --env-file=.env index.mjs` 를 실행합니다 (Node.js 20.6 이상). 맨 바깥에서 `await` 를 쓰려면 파일 확장자가 `.mjs` 여야 합니다.

API 키는 게임마다 따로 발급받습니다. PC 메이플스토리 키로는 메이플스토리M을 조회할 수 없습니다. 처음이면 [시작 가이드](./getting-started.md)를 먼저 보세요.

> 이 문서의 짧은 코드 조각은 위 예제의 `client` 와 `ocid` 가 이미 있다고 가정합니다.

## PC 메이플스토리와 다른 점

[메이플스토리(PC)](./maplestory.md) 문서를 본 적이 있다면 이것만 기억하면 됩니다.

| 항목           | 메이플스토리 (PC)                    | 메이플스토리M                                                   |
| -------------- | ------------------------------------ | --------------------------------------------------------------- |
| 캐릭터 찾기    | `getOcid('캐릭터명')`                | `getOcid('월드명', '캐릭터명')` — **월드 이름이 먼저**          |
| 날짜           | `date` 로 과거 날짜 조회 가능        | 캐릭터·유니온·길드는 **날짜가 없음** (현재 데이터). 랭킹만 날짜 |
| 길드 번호 받기 | `guild.getId('길드명', '월드명')`    | `guild.getId('월드명', '길드명')` — 순서가 반대                 |
| 유니온 레벨    | `union.getUnion()`                   | `union.get()`                                                   |
| 심볼           | `character.getSymbolEquipment()`     | `character.getSymbol()` — 아케인·어센틱이 따로 나뉘어 옴        |
| 스킬           | `character.getSkill()` (차수별)      | `character.getSkillEquipment()` (장착 스킬)                     |
| M에만 있는 것  | —                                    | 쥬얼, 가입 길드, 유니온 스탯, 전투력·커닝M타워·샤레니안 랭킹    |
| M에 없는 것    | 강화 기록, 연무장, 스케줄러, 성향 등 | —                                                               |

## 게임 용어 ↔ SDK 대응표

메서드 이름 앞의 `client.maplestorym.` 는 생략했습니다.

### 캐릭터 찾기 (1개)

| 게임에서 부르는 이름        | SDK 메서드                        | 주요 응답 필드   |
| --------------------------- | --------------------------------- | ---------------- |
| 캐릭터 고유 번호(OCID) 받기 | `getOcid('스카니아', '캐릭터명')` | 반환값이 곧 OCID |

### 캐릭터 정보 (17개)

| 게임에서 부르는 이름                        | SDK 메서드                                 | 주요 응답 필드                                                                       |
| ------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| 캐릭터 기본 정보 (레벨·직업·최근 접속)      | `character.getBasic({ ocid })`             | `character_level`, `character_class`, `character_date_last_login`, `character_image` |
| 스탯                                        | `character.getStat({ ocid })`              | `stat` (스탯 이름·값 목록)                                                           |
| 하이퍼 스탯                                 | `character.getHyperStat({ ocid })`         | `use_preset_no`, `hyper_stat[].hyper_stat_info`                                      |
| 가입한 길드                                 | `character.getGuild({ ocid })`             | `guild_name`                                                                         |
| 장착 장비 (스타포스·잠재능력·소울·마스터리) | `character.getItemEquipment({ ocid })`     | `item_equipment` (장비 목록), `equipment_preset`, `soul_set_option`                  |
| 캐시 아이템 (코디)                          | `character.getCashItemEquipment({ ocid })` | `cash_item_equipment`                                                                |
| 심볼 (아케인심볼·어센틱심볼)                | `character.getSymbol({ ocid })`            | `arcane_symbol`, `authentic_symbol`                                                  |
| 세트 효과                                   | `character.getSetEffect({ ocid })`         | `set_info`                                                                           |
| 안드로이드                                  | `character.getAndroidEquipment({ ocid })`  | `android_equipment` (안드로이드), `heart_equipment` (기계 심장)                      |
| 쥬얼                                        | `character.getJewel({ ocid })`             | `use_jewel_page_no`, `use_jewel_set_option`, `jewel_equipment`                       |
| 헤어·성형·피부                              | `character.getBeautyEquipment({ ocid })`   | `character_hair`, `character_face`, `character_skin_name`                            |
| 펫                                          | `character.getPetEquipment({ ocid })`      | `pet_1_name`, `pet_1_pet_type` (값이 없으면 `null`), `pet_set_option`                |
| 장착 스킬                                   | `character.getSkillEquipment({ ocid })`    | `skill.equipment_skill`, `skill.preset`                                              |
| 링크 스킬                                   | `character.getLinkSkill({ ocid })`         | `use_prest_no`, `link_skill[].link_skill_info`                                       |
| V매트릭스                                   | `character.getVMatrix({ ocid })`           | `character_v_core_equipment`, `vmatrix_total_score`                                  |
| HEXA매트릭스 > 스킬                         | `character.getHexaMatrixSkill({ ocid })`   | `hexamatrix_skill` (슬롯 레벨·스킬 이름), `hexamatrix_total_score`                   |
| HEXA매트릭스 > HEXA 스탯                    | `character.getHexaMatrixStat({ ocid })`    | `hexamatrix_stat[].stat_info` (메인·서브 스탯과 강화 레벨)                           |

### 유니온 (3개)

| 게임에서 부르는 이름      | SDK 메서드                  | 주요 응답 필드                                           |
| ------------------------- | --------------------------- | -------------------------------------------------------- |
| 유니온 레벨·등급          | `union.get({ ocid })`       | `union_level`, `union_grade`, `union_level_total_option` |
| 유니온 공격대원 효과      | `union.getRaider({ ocid })` | `use_union_raider_option` (옵션 이름·값)                 |
| 유니온 스탯 (포인트 분배) | `union.getStat({ ocid })`   | `use_union_stat`, `union_stat_preset`                    |

### 길드 (2개)

| 게임에서 부르는 이름           | SDK 메서드                          | 주요 응답 필드                                                                         |
| ------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------- |
| 길드 고유 번호 받기            | `guild.getId('스카니아', '길드명')` | 반환값이 곧 길드 고유 번호                                                             |
| 길드 정보 (창설일·길드원·스킬) | `guild.getBasic({ oguild_id })`     | `guild_create_date`, `guild_level`, `guild_master_name`, `guild_member`, `guild_skill` |

### 랭킹 (9개)

| 게임에서 부르는 이름            | SDK 메서드                                  | 주요 응답 필드                                              |
| ------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| 레벨 랭킹                       | `ranking.getLevel({ date })`                | `ranking[]` (`character_name`, `character_level`)           |
| 무릉도장 랭킹                   | `ranking.getDojang({ date })`               | `ranking[]` (`dojang_floor`)                                |
| 시간의 근원 랭킹                | `ranking.getRootOfTime({ date })`           | `ranking[]` (`max_damage`)                                  |
| 유니온 랭킹                     | `ranking.getUnion({ date })`                | `ranking[]` (`union_grade`, `union_level`)                  |
| 전투력 랭킹                     | `ranking.getCombatPower({ date })`          | `ranking[]` (`character_combat_power`)                      |
| 커닝M타워 랭킹                  | `ranking.getKerningMTower({ date })`        | `ranking[]` (`tower_floor`)                                 |
| 업적 랭킹                       | `ranking.getAchievement({ date })`          | `ranking[]` (`achievement_score`, `achievement_grade_name`) |
| 샤레니안의 전장 랭킹 (길드)     | `ranking.getSharenianBattlefield({ date })` | `ranking[]` (`guild_name`, `season_score`)                  |
| 샤레니안의 지하수로 랭킹 (길드) | `ranking.getSharenianWaterway({ date })`    | `ranking[]` (`guild_name`, `season_score`)                  |

### 공지 (6개)

| 게임에서 부르는 이름 | SDK 메서드                        | 주요 응답 필드                                   |
| -------------------- | --------------------------------- | ------------------------------------------------ |
| 공지사항 목록        | `notice.getList()`                | `notice[]` (`title`, `url`, `notice_id`, `date`) |
| 공지사항 본문        | `notice.getDetail(noticeId)`      | `title`, `contents`, `url`                       |
| 패치노트 목록        | `notice.getPatchList()`           | `patch_notice[]`                                 |
| 패치노트 본문        | `notice.getPatchDetail(noticeId)` | `title`, `contents`, `url`                       |
| 진행 중 이벤트 목록  | `notice.getEventList()`           | `event_notice[]`                                 |
| 진행 중 이벤트 본문  | `notice.getEventDetail(noticeId)` | `title`, `contents`, `url`                       |

## 알아두기

### 고유 번호

- **OCID — 캐릭터 고유 번호.** `getOcid('월드명', '캐릭터명')` 으로 받습니다. 넥슨은 게임 콘텐츠가 바뀌면 OCID가 바뀔 수 있다고 안내합니다. 저장해 둔 OCID로 조회가 실패하면 다시 받으세요.
- **길드 고유 번호(`oguild_id`).** `guild.getId('월드명', '길드명')` 으로 받습니다.

### 데이터가 언제 반영되나

- 캐릭터·유니온 정보는 날짜 없이 **현재 데이터**를 조회합니다. 게임에서 바뀐 내용은 **평균 10분 뒤**(길드는 평균 15분 뒤)에 조회됩니다.
- 값이 게임과 다르거나 조회되지 않으면 **게임에 다시 접속한 뒤** 조회하세요 (넥슨 안내). 장비·캐시 아이템·안드로이드의 프리셋 정보가 비어 있으면, 게임에서 그 프리셋을 한 번 선택했다가 다른 프리셋으로 바꾸면 채워집니다.
- 버프·아이템 효과 때문에 레벨·경험치·스탯 값이 게임 화면과 다를 수 있습니다.
- 조회할 수 있는 기간: 캐릭터 정보는 2022년 1월 1일 이후, 헤어·성형·피부는 2024년 5월 2일 이후, 유니온은 2025년 10월 30일 이후, 유니온 스탯은 2026년 10월 15일 이후, V매트릭스는 2026년 7월 9일 이후 데이터입니다.
- **랭킹**은 매일 오전 2시 30분경에 하루 한 번 집계됩니다. 2025-11-27부터 오늘까지의 날짜 중 최근 2년 이내를 조회할 수 있습니다. 오늘 랭킹은 집계가 끝난 뒤 열리며, 전체 월드 기준 1만 등까지 제공됩니다.
- 공지는 수정될 수 있으므로 필요할 때마다 다시 조회하거나 하루에 한 번 이상 갱신하는 것을 넥슨이 권장합니다.

### 넣는 값

- **월드 이름:** 아케인, 크로아, 엘리시움, 루나, 스카니아, 유니온, 제니스, 챌린저스
- **랭킹 날짜(`date`):** 한국 시간 기준 `'YYYY-MM-DD'` 문자열입니다. 날짜가 빠졌거나 형식 또는 범위가 잘못되면 SDK가 요청 전에 `NexonBadRequestError` (`OPENAPI00004`)로 알려줍니다.
- **랭킹 범위:** `world_name`(월드 랭킹) 또는 `ocid`(특정 캐릭터의 순위) 중 **하나만** 넣을 수 있습니다. 둘 다 생략하면 전체 월드 랭킹입니다. 한 페이지에 200개씩이며 `page` 로 다음 페이지를 봅니다.
- **샤레니안 랭킹의 `ocid`:** 길드 랭킹이므로 **길드 마스터**의 캐릭터 고유 번호를 넣습니다.

### 주의할 점

- **시각은 UTC 기준입니다.** 캐릭터 생성일·최근 접속 시각(`character_date_last_login`)과 공지 등록일은 UTC(한국 시간보다 9시간 늦음)로 옵니다. 랭킹의 `date` 만 한국 시간입니다.
- 잠재능력 등급(`item_potential_option_grade`)은 `"1"` 레어, `"2"` 에픽, `"3"` 유니크, `"4"` 레전더리이고, 추가 옵션 등급(`item_additional_option_grade`)은 `"1"`·`"4"` 파란색, `"2"` 보라색, `"3"` 주황색입니다. 해당 옵션이 없으면 `null`이 옵니다.
- 안드로이드의 캐시 아이템 장착 가능 성별은 `cash_item_gender` 문자열로 옵니다. 캐릭터의 캐시 아이템도 같은 필드에 문자열로 제공됩니다.
- 장착 스킬 세팅 번호(`skill.equipment_skill[].equipment_skill_set`)와 링크 스킬 레벨(`link_skill[].link_skill_info[].skill_level`)은 숫자입니다.
- **필수 값이 비어 있으면 요청을 보내지 않습니다.** 빈 월드 이름·캐릭터 이름·`ocid`, 랭킹에서 `world_name` 과 `ocid` 를 함께 넣은 경우 등은 `NexonBadRequestError` 로 바로 알려 줍니다.
- **더 이상 권장하지 않는 필드**
  - 기본 정보의 `character_job_name` → `character_class` 를 쓰세요.
  - 장비의 `item_option` → `item_basic_option` 을 쓰세요.
  - V매트릭스의 `vcore_skill_name_1`~`3` → `vcore_skill_name1`~`4` 를 쓰세요. `slot_id`, `slot_level`, `vcore_name` 도 넥슨 문서에서 빠졌습니다.
  - 유니온 공격대의 `use_preset_no`, `use_union_occupied_option`, `battle_map` 은 넥슨 문서에서 빠졌습니다. 유니온 스탯 프리셋은 `union.getStat()` 에서 봅니다.

## 카테고리별 사용법

### 캐릭터 기본 정보·스탯

```js
// 캐릭터 검색 사이트의 프로필 카드
const basic = await client.maplestorym.character.getBasic({ ocid });
const { stat } = await client.maplestorym.character.getStat({ ocid });

console.log(basic.character_image); // 캐릭터 외형 이미지 주소
console.log(`Lv.${basic.character_level} (${basic.character_exp_rate}%)`);
console.log(`마지막 접속(UTC): ${basic.character_date_last_login}`);
for (const s of stat) console.log(`${s.stat_name}: ${s.stat_value}`);
```

- `character_class` — 직업 이름
- `character_date_last_login`, `character_date_last_logout` — 마지막 접속·종료 시각 (UTC)
- `stat[]` — `{ stat_name, stat_value }` 목록. 원하는 스탯은 이름으로 찾습니다.

### 장비·스타포스·잠재능력

```js
// 장비 요약: 부위, 이름, 스타포스, 잠재능력 등급
const GRADE = new Map([
  ['1', '레어'],
  ['2', '에픽'],
  ['3', '유니크'],
  ['4', '레전더리'],
]);
const equip = await client.maplestorym.character.getItemEquipment({ ocid });

for (const item of equip.item_equipment) {
  const grade = GRADE.get(item.item_potential_option_grade ?? '') ?? '없음';
  const starforce = item.starforce_upgrade === null ? '' : ` ★${item.starforce_upgrade}`;
  console.log(`[${item.item_equipment_slot_name}] ${item.item_name}${starforce}`);
  console.log(`  잠재능력 ${grade}, 장비 전투력 ${item.item_combat_power ?? '없음'}`);
  for (const opt of item.item_potential_option) {
    console.log(`  - ${opt.option_name} ${opt.option_value}`);
  }
}
```

자주 쓰는 필드 (`item_equipment[]`):

- `item_equipment_slot_name`, `item_equipment_page_name` — 슬롯 위치와 부위
- `item_grade` — 아이템 등급, `item_combat_power` — 장비 전투력 (`number | null`)
- `starforce_upgrade` — 스타포스 강화 단계 (`string | null`)
- `item_basic_option`, `item_additional_option`, `item_potential_option`, `item_additional_potential_option` — 기본 옵션, 추가 옵션, 잠재능력, 에디셔널 잠재능력 (각각 `option_name`·`option_value` 목록)
- `soul_equipment_flag` — 소울 장착 여부 (`"0"` 미장착, `"1"` 장착)
- `emblem_info.emblem_level` — 문장 레벨 (`number`). 문장이 없으면 `emblem_info`는 `null`
- `mastery_info` — 마스터리 레벨과 옵션별 보너스 포인트. 정보가 없으면 `null` 또는 생략

`use_preset_no` 가 지금 쓰는 프리셋이고 `equipment_preset[]` 에 프리셋별 장비가 있습니다.

### 심볼·쥬얼·스킬

```js
// 심볼 성장 현황
const symbol = await client.maplestorym.character.getSymbol({ ocid });
for (const s of [...symbol.arcane_symbol, ...symbol.authentic_symbol]) {
  console.log(`${s.symbol_name} Lv.${s.symbol_level} — ${s.symbol_option}`);
}

// 쥬얼: 지금 쓰는 페이지의 쥬얼과 세트 옵션
const jewel = await client.maplestorym.character.getJewel({ ocid });
const page = jewel.jewel_equipment.find((p) => p.jewel_page_no === jewel.use_jewel_page_no);
console.log(jewel.use_jewel_set_option);
console.log(page?.jewel_info.map((j) => `${j.jewel_name}(${j.jewel_grade})`));
```

- 심볼은 `arcane_symbol`(아케인심볼)과 `authentic_symbol`(어센틱심볼)로 나뉘어 옵니다.
- V매트릭스의 `vcore_equipment_flag` 는 `"1"` 장착, `"0"` 미장착이고, `vcore_expire_flag` 는 `"1"` 기간제입니다. `vmatrix_total_score` 가 V매트릭스 합산 점수입니다.
- HEXA 스탯은 `hexamatrix_stat[].stat_info[]` 에 페이지별로 들어 있고, `activate_flag` 로 활성화된 페이지를 구분합니다.

### 유니온

```js
// 유니온 요약
const union = await client.maplestorym.union.get({ ocid });
const raider = await client.maplestorym.union.getRaider({ ocid });
const unionStat = await client.maplestorym.union.getStat({ ocid });

console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
for (const o of raider.use_union_raider_option) console.log(`${o.option_name} ${o.option_value}`);
for (const s of unionStat.use_union_stat) console.log(`${s.stat_name}: ${s.stat_point}포인트`);
```

- `union_level_total_option` — 레벨 총합 누적 효과
- `use_union_raider_option` — 적용 중인 공격대원 효과
- `use_union_stat` — 적용 중인 유니온 스탯. `stat_point` 가 그 스탯에 분배한 유니온 포인트입니다. 프리셋별 분배는 `union_stat_preset` 에 있습니다.

### 길드

```js
// 길드 관리 봇: 길드원을 활동량 순으로
const guildId = await client.maplestorym.guild.getId('스카니아', '길드명');
const guild = await client.maplestorym.guild.getBasic({ oguild_id: guildId });

const members = [...guild.guild_member].sort((a, b) => b.guild_activity - a.guild_activity);
for (const m of members) {
  console.log(`${m.character_name} Lv.${m.character_level} — 활동량 ${m.guild_activity}`);
}
```

PC 메이플스토리와 달리 길드원마다 레벨(`character_level`)과 길드 활동량(`guild_activity`)이 함께 옵니다. `guild_building` 은 길드 시설물, `guild_ability` 는 길드 어빌리티입니다.

### 랭킹

```js
// 스카니아 전투력 TOP 5
const power = await client.maplestorym.ranking.getCombatPower({
  date: '2026-11-23',
  world_name: '스카니아',
});
for (const r of power.ranking.slice(0, 5)) {
  console.log(`${r.world_ranking}위 ${r.character_name} — 전투력 ${r.character_combat_power}`);
}

// 내 캐릭터의 레벨 순위
const mine = await client.maplestorym.ranking.getLevel({ date: '2026-11-23', ocid });
console.log(mine.ranking[0]?.ranking);
```

- `ranking` 은 전체 월드 순위, `world_ranking` 은 그 캐릭터가 속한 월드 안의 순위입니다.
- 무릉도장·시간의 근원·유니온·전투력·커닝M타워는 길드에 가입하지 않은 캐릭터의 `guild_name`이 `null`입니다.
- 샤레니안의 전장·지하수로는 길드 랭킹이라 `guild_name`, `guild_master_name`, `season_score`가 옵니다. 시즌 점수는 전장에서 문자열, 지하수로에서 숫자입니다.

### 공지

```js
// 최신 패치노트 제목과 링크
const patch = await client.maplestorym.notice.getPatchList();
const latest = patch.patch_notice[0];
if (latest) {
  const detail = await client.maplestorym.notice.getPatchDetail(latest.notice_id);
  console.log(detail.title, detail.url);
}
```

목록은 최근 20개입니다. 본문(`contents`)은 목록의 `notice_id` 로 상세를 조회해 받습니다.

<details><summary>넥슨 API 경로</summary>

모든 경로 앞에 `https://open.api.nexon.com` 이 붙습니다.

| SDK 메서드                        | 경로                                                |
| --------------------------------- | --------------------------------------------------- |
| `getOcid`                         | `GET /maplestorym/v1/id`                            |
| `character.getBasic`              | `GET /maplestorym/v1/character/basic`               |
| `character.getStat`               | `GET /maplestorym/v1/character/stat`                |
| `character.getHyperStat`          | `GET /maplestorym/v1/character/hyper-stat`          |
| `character.getGuild`              | `GET /maplestorym/v1/character/guild`               |
| `character.getItemEquipment`      | `GET /maplestorym/v1/character/item-equipment`      |
| `character.getCashItemEquipment`  | `GET /maplestorym/v1/character/cashitem-equipment`  |
| `character.getSymbol`             | `GET /maplestorym/v1/character/symbol`              |
| `character.getSetEffect`          | `GET /maplestorym/v1/character/set-effect`          |
| `character.getAndroidEquipment`   | `GET /maplestorym/v1/character/android-equipment`   |
| `character.getJewel`              | `GET /maplestorym/v1/character/jewel`               |
| `character.getBeautyEquipment`    | `GET /maplestorym/v1/character/beauty-equipment`    |
| `character.getPetEquipment`       | `GET /maplestorym/v1/character/pet-equipment`       |
| `character.getSkillEquipment`     | `GET /maplestorym/v1/character/skill-equipment`     |
| `character.getLinkSkill`          | `GET /maplestorym/v1/character/link-skill`          |
| `character.getVMatrix`            | `GET /maplestorym/v1/character/vmatrix`             |
| `character.getHexaMatrixSkill`    | `GET /maplestorym/v1/character/hexamatrix-skill`    |
| `character.getHexaMatrixStat`     | `GET /maplestorym/v1/character/hexamatrix-stat`     |
| `union.get`                       | `GET /maplestorym/v1/user/union`                    |
| `union.getRaider`                 | `GET /maplestorym/v1/user/union-raider`             |
| `union.getStat`                   | `GET /maplestorym/v1/user/union-stat`               |
| `guild.getId`                     | `GET /maplestorym/v1/guild/id`                      |
| `guild.getBasic`                  | `GET /maplestorym/v1/guild/basic`                   |
| `ranking.getLevel`                | `GET /maplestorym/v1/ranking/level`                 |
| `ranking.getDojang`               | `GET /maplestorym/v1/ranking/dojang`                |
| `ranking.getRootOfTime`           | `GET /maplestorym/v1/ranking/root-of-time`          |
| `ranking.getUnion`                | `GET /maplestorym/v1/ranking/union`                 |
| `ranking.getCombatPower`          | `GET /maplestorym/v1/ranking/combat-power`          |
| `ranking.getKerningMTower`        | `GET /maplestorym/v1/ranking/kerning-m-tower`       |
| `ranking.getAchievement`          | `GET /maplestorym/v1/ranking/achievement`           |
| `ranking.getSharenianBattlefield` | `GET /maplestorym/v1/ranking/sharenian-battlefield` |
| `ranking.getSharenianWaterway`    | `GET /maplestorym/v1/ranking/sharenian-waterway`    |
| `notice.getList`                  | `GET /maplestorym/v1/notice`                        |
| `notice.getDetail`                | `GET /maplestorym/v1/notice/detail`                 |
| `notice.getPatchList`             | `GET /maplestorym/v1/notice-patch`                  |
| `notice.getPatchDetail`           | `GET /maplestorym/v1/notice-patch/detail`           |
| `notice.getEventList`             | `GET /maplestorym/v1/notice-event`                  |
| `notice.getEventDetail`           | `GET /maplestorym/v1/notice-event/detail`           |

</details>

응답의 나머지 필드는 에디터 자동완성에서 확인하세요.

## 만들기 예제

### 1. 디스코드 봇 응답용 캐릭터 요약

`!엠정보 스카니아 캐릭터명` 같은 명령에 답할 텍스트를 만듭니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

async function summarize(worldName, characterName) {
  try {
    const ocid = await client.maplestorym.getOcid(worldName, characterName);
    const [basic, guild, union] = await Promise.all([
      client.maplestorym.character.getBasic({ ocid }),
      client.maplestorym.character.getGuild({ ocid }),
      client.maplestorym.union.get({ ocid }),
    ]);
    return [
      `**${basic.character_name}** (${basic.world_name})`,
      `Lv.${basic.character_level} ${basic.character_class}`,
      `길드: ${guild.guild_name || '없음'}`,
      `유니온 Lv.${union.union_level} (${union.union_grade})`,
    ].join('\n');
  } catch (err) {
    if (err instanceof NexonNotFoundError) {
      return `'${worldName}' 월드에서 '${characterName}' 캐릭터를 찾지 못했습니다.`;
    }
    throw err;
  }
}

console.log(await summarize('스카니아', '캐릭터명'));
// 출력 예시
// **캐릭터명** (스카니아)
// Lv.250 나이트로드
// 길드: 길드명
// 유니온 Lv.5000 (마스터 유니온 1)
```

### 2. 월드별 전투력 1위 모아 보기

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

const WORLDS = ['아케인', '크로아', '엘리시움', '루나', '스카니아', '유니온', '제니스', '챌린저스'];
const date = '2026-11-23'; // 랭킹은 매일 오전 2시 30분경 집계된다

for (const world of WORLDS) {
  const { ranking } = await client.maplestorym.ranking.getCombatPower({ date, world_name: world });
  const top = ranking[0];
  if (top) console.log(`${world}: ${top.character_name} (전투력 ${top.character_combat_power})`);
}
// 출력 예시
// 아케인: 캐릭터명 (전투력 1234567890)
// 크로아: 캐릭터명 (전투력 1234567890)
```

두 예제 모두 `index.mjs` 로 저장하고 `node --env-file=.env index.mjs` 로 실행합니다. 더 많은 예제는 [examples](../examples/README.md)에 있습니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- PC 메이플스토리: [메이플스토리](./maplestory.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
