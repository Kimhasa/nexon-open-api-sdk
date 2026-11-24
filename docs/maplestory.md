# 메이플스토리 — nexon-open-api

> `client.maplestory` · API 56개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/maplestory/)

캐릭터 이름 하나로 스탯·장비·스킬·유니온·무릉도장 기록까지 가져올 수 있습니다. 캐릭터 검색 사이트, 디스코드 봇의 `!정보 캐릭터명` 명령, 길드 관리 도구, 스타포스·큐브 기록 분석기, 주간 보스 체크리스트 같은 것을 만들 때 씁니다.

## 시작하기

캐릭터 이름으로 **캐릭터 고유 번호(OCID)** 를 먼저 받고, 그 번호로 원하는 정보를 조회합니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

// API 키는 코드에 적지 말고 환경변수로 읽는다
const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수에 메이플스토리 API 키를 넣어 주세요.');

const client = new NexonClient({ apiKey });

try {
  // 1. 캐릭터 이름 → 캐릭터 고유 번호(OCID)
  const ocid = await client.maplestory.getOcid('캐릭터명');

  // 2. 캐릭터 기본 정보와 스탯
  const basic = await client.maplestory.character.getBasic({ ocid });
  const stat = await client.maplestory.character.getStat({ ocid });
  const power = stat.final_stat.find((s) => s.stat_name === '전투력');

  console.log(`${basic.character_name} (${basic.world_name})`);
  console.log(`Lv.${basic.character_level} ${basic.character_class}`);
  console.log(`길드: ${basic.character_guild_name ?? '없음'}`);
  console.log(`전투력: ${power?.stat_value ?? '정보 없음'}`);
  // 출력 예시
  // 캐릭터명 (스카니아)
  // Lv.275 아크메이지(불,독)
  // 길드: 길드명
  // 전투력: 123456789
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.log('그런 캐릭터가 없습니다. 이름을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
```

실행: 위 코드를 `index.mjs` 로 저장하고, 같은 폴더의 `.env` 파일에 `NEXON_API_KEY=발급받은키` 를 적은 뒤 `node --env-file=.env index.mjs` 를 실행합니다 (Node.js 20.6 이상). 맨 바깥에서 `await` 를 쓰려면 파일 확장자가 `.mjs` 여야 합니다.

API 키는 게임마다 따로 발급받습니다. 키 발급과 설치가 처음이면 [시작 가이드](./getting-started.md)를 먼저 보세요.

> 이 문서의 짧은 코드 조각은 위 예제의 `client` 와 `ocid` 가 이미 있다고 가정합니다.

## 게임 용어 ↔ SDK 대응표

메서드 이름 앞의 `client.maplestory.` 는 생략했습니다. 예: `character.getStat({ ocid })` → `client.maplestory.character.getStat({ ocid })`.

### 캐릭터 찾기·내 계정 (4개)

| 게임에서 부르는 이름              | SDK 메서드                   | 주요 응답 필드                                        |
| --------------------------------- | ---------------------------- | ----------------------------------------------------- |
| 캐릭터 고유 번호(OCID) 받기       | `getOcid('캐릭터명')`        | 반환값이 곧 OCID                                      |
| 내 넥슨 계정 고유 번호            | `getOuid()`                  | 반환값이 곧 계정 고유 번호                            |
| 구 개발자센터 키의 계정 고유 번호 | `getLegacyOuid('구 API 키')` | 반환값이 곧 계정 고유 번호                            |
| 내 계정이 달성한 업적             | `getAchievement()`           | `account_list[].achievement_achieve` (업적 이름·설명) |

### 캐릭터 정보 (23개)

| 게임에서 부르는 이름                              | SDK 메서드                                                | 주요 응답 필드                                                                                                                             |
| ------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 내 계정의 캐릭터 목록                             | `character.getList()`                                     | `account_list[].character_list` (이름·월드·직업·레벨·OCID)                                                                                 |
| 캐릭터 기본 정보 (레벨·직업·월드·길드·외형)       | `character.getBasic({ ocid })`                            | `character_level`, `character_class`, `world_name`, `character_guild_name`, `character_image`                                              |
| 인기도                                            | `character.getPopularity({ ocid })`                       | `popularity`                                                                                                                               |
| 캐릭터 정보창 > 스탯 (전투력 포함)                | `character.getStat({ ocid })`                             | `final_stat` (스탯 이름·값 목록), `remain_ap`                                                                                              |
| 하이퍼 스탯                                       | `character.getHyperStat({ ocid })`                        | `use_preset_no`, `hyper_stat_preset_1`~`3` (스탯 종류·레벨·상승량)                                                                         |
| 성향 (카리스마·감성·통찰력·의지·손재주·매력)      | `character.getPropensity({ ocid })`                       | `charisma_level`, `sensibility_level`, `insight_level` 등                                                                                  |
| 어빌리티                                          | `character.getAbility({ ocid })`                          | `ability_grade`, `ability_info` (옵션 3줄), `remain_fame` (명성치)                                                                         |
| 장비창 > 장착 장비 (스타포스·잠재능력·추가 옵션)  | `character.getItemEquipment({ ocid })`                    | `item_equipment` (장비 목록), `item_equipment_preset_1`~`3`, `title` (칭호), `title_preset1`~`3` (칭호 프리셋)                             |
| 캐시 장비 (코디)                                  | `character.getCashItemEquipment({ ocid })`                | `cash_item_equipment_base`, `cash_item_equipment_preset_1`~`3`                                                                             |
| 심볼 (아케인심볼·어센틱심볼)                      | `character.getSymbolEquipment({ ocid })`                  | `symbol` (심볼 이름·레벨·`symbol_force`)                                                                                                   |
| 세트 효과                                         | `character.getSetEffect({ ocid })`                        | `set_effect` (세트 이름·`total_set_count`·옵션)                                                                                            |
| 헤어·성형·피부                                    | `character.getBeautyEquipment({ ocid })`                  | `character_hair`, `character_face`, `character_skin`                                                                                       |
| 안드로이드                                        | `character.getAndroidEquipment({ ocid })`                 | `android_name`, `android_grade`, `android_cash_item_equipment`                                                                             |
| 펫·펫 장비·펫 스킬                                | `character.getPetEquipment({ ocid })`                     | `pet_1_name`, `pet_1_equipment`, `pet_1_auto_skill` (펫 2·3도 같은 꼴), `world_share_pet_equipment_preset` (월드 공유 펫 장비 프리셋 목록) |
| 스킬 (전직 차수별, 하이퍼 스킬 포함)              | `character.getSkill({ ocid, character_skill_grade })`     | `character_skill` (스킬 이름·레벨·효과)                                                                                                    |
| 링크 스킬                                         | `character.getLinkSkill({ ocid })`                        | `character_link_skill` (장착), `character_owned_link_skill` (내가 주는 링크)                                                               |
| V매트릭스 (5차)                                   | `character.getVMatrix({ ocid })`                          | `character_v_core_equipment` (코어 이름·타입·레벨)                                                                                         |
| HEXA 매트릭스 (6차) > HEXA 코어                   | `character.getHexaMatrix({ ocid })`                       | `character_hexa_core_equipment` (코어 이름·레벨·타입)                                                                                      |
| HEXA 매트릭스 > HEXA 스탯                         | `character.getHexaMatrixStat({ ocid })`                   | `character_hexa_stat_core` (메인·서브 스탯 이름과 레벨)                                                                                    |
| 무릉도장 최고 기록                                | `character.getDojang({ ocid })`                           | `dojang_best_floor` (층), `dojang_best_time` (초)                                                                                          |
| 능력치에 영향을 주는 기타 요소                    | `character.getOtherStat({ ocid })`                        | `other_stat[].stat_info` (스탯 이름·값). 기타 능력치가 없으면 `other_stat` 이 `null`                                                       |
| 예비 특수 반지 슬롯의 특수 반지                   | `character.getRingReserveSkillEquipment({ ocid })`        | `special_ring_reserve_name`, `special_ring_reserve_level`                                                                                  |
| 링 익스체인지에 등록한 특수 반지 (2026-03-18까지) | `character.getRingExchangeSkillEquipment({ ocid, date })` | `special_ring_exchange_name`, `special_ring_exchange_level`                                                                                |

### 유니온 (4개)

| 게임에서 부르는 이름                | SDK 메서드                    | 주요 응답 필드                                                          |
| ----------------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| 유니온 레벨·등급                    | `union.getUnion({ ocid })`    | `union_level`, `union_grade`, `union_artifact_level`                    |
| 유니온 공격대 배치 (블록·점령 효과) | `union.getRaider({ ocid })`   | `union_block` (블록 위치), `union_raider_stat`, `union_occupied_stat`   |
| 유니온 아티팩트                     | `union.getArtifact({ ocid })` | `union_artifact_effect`, `union_artifact_crystal`                       |
| 유니온 챔피언                       | `union.getChampion({ ocid })` | `union_champion` (챔피언 캐릭터·등급·휘장), `champion_badge_total_info` |

### 길드 (2개)

| 게임에서 부르는 이름         | SDK 메서드                          | 주요 응답 필드                                                    |
| ---------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| 길드 고유 번호 받기          | `guild.getId('길드명', '스카니아')` | 반환값이 곧 길드 고유 번호                                        |
| 길드 정보 (길드원·길드 스킬) | `guild.getBasic({ oguild_id })`     | `guild_level`, `guild_master_name`, `guild_member`, `guild_skill` |

### 내 강화 기록 (4개)

| 게임에서 부르는 이름      | SDK 메서드                                  | 주요 응답 필드                                                                 |
| ------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| 스타포스 강화 기록        | `history.getStarforce({ count, date })`     | `starforce_history` (`before_starforce_count` → `after_starforce_count`, 결과) |
| 큐브 사용 기록            | `history.getCube({ count, date })`          | `cube_history` (`cube_type`, 사용 전후 잠재능력 옵션)                          |
| 잠재능력 재설정 기록      | `history.getPotential({ count, date })`     | `potential_history` (재설정 전후 옵션, `potential_option_grade`)               |
| 소울 잠재능력 재설정 기록 | `history.getSoulPotential({ count, date })` | `soul_potential_history` (재설정 전후 옵션, `soul_potential_grade`)            |

### 랭킹 (6개)

| 게임에서 부르는 이름                            | SDK 메서드                                 | 주요 응답 필드                                                  |
| ----------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| 종합 랭킹 (레벨 순위)                           | `ranking.getOverall({ date })`             | `ranking[]` (`character_name`, `character_level`, `class_name`) |
| 유니온 랭킹                                     | `ranking.getUnion({ date })`               | `ranking[]` (`union_level`, `union_power`)                      |
| 길드 랭킹 (주간 명성치·플래그 레이스·지하 수로) | `ranking.getGuild({ date, ranking_type })` | `ranking[]` (`guild_name`, `guild_point`, `guild_master_name`)  |
| 무릉도장 랭킹 (일반·통달)                       | `ranking.getDojang({ date, difficulty })`  | `ranking[]` (`dojang_floor`, `dojang_time_record`)              |
| 더 시드 랭킹                                    | `ranking.getTheSeed({ date })`             | `ranking[]` (`theseed_floor`, `theseed_time_record`)            |
| 업적 랭킹                                       | `ranking.getAchievement({ date })`         | `ranking[]` (`trophy_grade`, `trophy_score`)                    |

### 공지 (8개)

| 게임에서 부르는 이름 | SDK 메서드                           | 주요 응답 필드                                                            |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| 공지사항 목록        | `notice.getList()`                   | `notice[]` (`title`, `url`, `notice_id`, `date`)                          |
| 공지사항 본문        | `notice.getDetail(noticeId)`         | `title`, `contents`, `url`                                                |
| 업데이트 목록        | `notice.getUpdateList()`             | `update_notice[]`                                                         |
| 업데이트 본문        | `notice.getUpdateDetail(noticeId)`   | `title`, `contents`, `url`                                                |
| 진행 중 이벤트 목록  | `notice.getEventList()`              | `event_notice[]` (`date_event_start`, `date_event_end`, `thumbnail_url`)  |
| 진행 중 이벤트 본문  | `notice.getEventDetail(noticeId)`    | `contents`, `date_event_start`, `date_event_end`                          |
| 캐시샵 공지 목록     | `notice.getCashshopList()`           | `cashshop_notice[]` (`date_sale_start`, `date_sale_end`, `thumbnail_url`) |
| 캐시샵 공지 본문     | `notice.getCashshopDetail(noticeId)` | `contents`, `ongoing_flag` (상시 판매 여부)                               |

### 연무장 (4개)

| 게임에서 부르는 이름          | SDK 메서드                                       | 주요 응답 필드                                                    |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| 등록한 연무장 리플레이 목록   | `battlePractice.getReplayId({ ocid })`           | `replay_list[]` (`replay_id`, `period_no`, `register_date`)       |
| 연무장 측정 결과 (데미지·DPS) | `battlePractice.getResult({ replay_id })`        | `total_damage`, `total_dps`, `skill_statistic` (스킬별 비중)      |
| 연무장 스킬 사용 내역         | `battlePractice.getSkillTimeline({ replay_id })` | `skill_timeline[]` (`elapse_time`, `skill_name`), `total_page_no` |
| 연무장 입장 당시 캐릭터 정보  | `battlePractice.getCharacterInfo({ replay_id })` | `basic_object`, `stat_object`, `item_object` 등                   |

### 스케줄러 (1개)

| 게임에서 부르는 이름                       | SDK 메서드                              | 주요 응답 필드                                                                  |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------- |
| 스케줄러 (일일·주간·보스 콘텐츠 수행 현황) | `scheduler.getCharacterState({ ocid })` | `daily_contents`, `weekly_contents`, `boss_contents`, `weekly_boss_clear_count` |

## 알아두기

### 고유 번호

- **OCID — 캐릭터 고유 번호.** 캐릭터마다 붙는 번호입니다. `getOcid('캐릭터명')` 으로 먼저 받아 두고, 캐릭터·유니온·연무장·스케줄러 정보를 조회할 때 넣습니다. 넥슨은 게임 콘텐츠가 바뀌면 OCID가 바뀔 수 있다고 안내합니다. 오래 저장해 둔 OCID로 조회가 실패하면 이름으로 다시 받으세요.
- **길드 고유 번호(`oguild_id`).** 길드 이름과 월드 이름으로 `guild.getId()` 에서 받습니다.
- **연무장 리플레이 고유 번호(`replay_id`).** `battlePractice.getReplayId()` 로 받습니다.
- **계정 고유 번호(`ouid`).** API 키를 발급받은 넥슨 계정의 번호입니다. 캐릭터 조회에는 쓰지 않습니다.

### 내 계정만 조회되는 것

다음은 **API 키를 발급받은 계정**의 정보만 조회합니다. 다른 유저의 정보는 볼 수 없습니다.

- 캐릭터 목록 `character.getList()`, 업적 `getAchievement()`, 계정 고유 번호 `getOuid()`
- 강화 기록 `history.*` (스타포스·큐브·잠재능력 재설정·소울 잠재능력 재설정)
- 스케줄러 `scheduler.getCharacterState()` (내 계정의 캐릭터만)

그 밖의 캐릭터·유니온·길드·랭킹 정보는 캐릭터 이름이나 길드 이름만 알면 누구 것이든 조회할 수 있습니다.

### 데이터가 언제 반영되나

- 게임에서 바뀐 내용은 **평균 15분 뒤**에 조회됩니다.
- `date` 에 날짜를 넣으면 **그날 하루(0시~24시, 한국 시간)** 의 데이터를 받습니다. 지난 날짜의 데이터는 **다음날 오전 2시부터** 조회됩니다 (어제 데이터는 오늘 오전 2시부터).
- `date` 를 생략하면 **가장 최근 데이터**를 받습니다. 이때 응답의 `date` 필드는 `null` 입니다. 스케줄러도 생략하면 오늘 기준입니다.
- 캐릭터·유니온·길드 정보는 **2023년 12월 21일** 데이터부터 있습니다. 더 늦게 시작한 것: 유니온 아티팩트(2024-01-18), 유니온 챔피언(2025-02-20), 기타 능력치 영향 요소(2025-08-21).
- 랭킹은 2023년 12월 22일부터, 최근 2년 데이터만 조회됩니다. **오늘 랭킹은 오전 9시 30분경부터** 나옵니다.
- 강화 기록은 최근 2년 데이터만 조회됩니다. 스타포스는 강화 후 최대 5분, 큐브·잠재능력 재설정은 최대 30분 뒤에 조회됩니다.
- 스케줄러는 조회일 기준 14일 전까지 볼 수 있습니다. 보스·무릉도장·길드 콘텐츠·에픽던전은 완료할 때, 나머지는 접속 중과 접속 종료 때 갱신됩니다. 그날 접속하지 않은 캐릭터는 결과가 없을 수 있습니다.
- 공지는 수정될 수 있으므로 필요할 때마다 다시 조회하거나 하루에 한 번 이상 갱신하는 것을 넥슨이 권장합니다.

### 넣는 값

- **날짜:** 한국 시간 기준 `'YYYY-MM-DD'` 문자열. `Date` 객체로 만들려면 `toNexonDate()` 를 씁니다.

  ```js
  import { toNexonDate } from 'nexon-open-api';

  // 한국 시간(UTC+9 = 540분) 기준 어제 날짜
  const yesterday = toNexonDate(new Date(Date.now() - 24 * 60 * 60 * 1000), 540);
  ```

- **월드 이름:** 게임 이름 그대로. 스카니아, 베라, 루나, 제니스, 크로아, 유니온, 엘리시움, 이노시스, 레드, 오로라, 아케인, 노바, 에오스, 핼리오스, 챌린저스, 챌린저스2, 챌린저스3, 챌린저스4. (리부트·리부트2는 2024년 12월 19일에 에오스·핼리오스로 바뀌었습니다.)
- **스킬 차수(`character_skill_grade`):** `'0'`(0차·제로 공용), `'1'`, `'1.5'`, `'2'`, `'2.5'`, `'3'`, `'4'`(제로 알파/베타 포함), `'hyperpassive'`(하이퍼 패시브), `'hyperactive'`(하이퍼 액티브), `'5'`(5차), `'6'`(6차).
- **길드 랭킹 종류(`ranking_type`):** `0` 주간 명성치, `1` 플래그 레이스, `2` 지하 수로.
- **무릉도장 구간(`difficulty`):** `0` 일반, `1` 통달.
- **종합 랭킹의 월드 종류(`world_type`):** `0` 일반 월드, `1` 에오스·핼리오스. `world_name` 을 넣으면 무시됩니다.
- **직업(`class`):** `'전사-히어로'`, `'마법사-비숍'`, `'궁수-전체 전직'` 처럼 `직업 계열-전직 이름` 형식입니다.
- **강화 기록의 `count`:** 10~1000. 첫 페이지는 `date`, 다음 페이지는 `cursor` 를 넣습니다.

### 주의할 점

- **숫자와 참/거짓이 문자열로 올 때가 많습니다.** 스타포스(`starforce: "22"`), 스탯 값(`stat_value: "43.75"`), 최근 7일 접속 여부(`access_flag: "true"`) 등은 문자열입니다. 계산하려면 `Number()` 로 바꾸고, 참/거짓은 `=== 'true'` 로 비교하세요.
- **스탯은 이름으로 찾습니다.** `getStat()` 의 `final_stat` 은 `{ stat_name, stat_value }` 목록이므로 `find((s) => s.stat_name === '전투력')` 처럼 꺼냅니다.
- **필수 값이 비어 있으면 요청을 보내지 않습니다.** 빈 캐릭터 이름, 빈 `ocid`·`replay_id`, 범위를 벗어난 `count` 등은 넥슨 서버에 가기 전에 `NexonBadRequestError` 로 알려 줍니다. 에러 메시지에 고치는 방법이 들어 있습니다.
- **더 이상 권장하지 않는 것**
  - `character.getRingExchangeSkillEquipment()` — 2025-08-21 ~ 2026-03-18 데이터만 있습니다. 그 뒤 날짜는 `character.getRingReserveSkillEquipment()` 를 쓰세요.
  - `ranking.getGuild()` 의 `ocid` — 넥슨이 지원을 끝냈습니다. 넣으면 경고를 한 번 띄우고 무시합니다. 특정 길드는 `guild_name` 으로 찾으세요.
  - 캐시 장비의 `cash_item_skills` — `skills` 를 쓰세요.
  - V매트릭스의 `slot_level`, `v_core_skill_1`~`3` — 2025년 12월 18일 점검 뒤로는 값이 채워지지 않습니다 (`0` / `null`).
  - 에반 드래곤 장비(`dragon_equipment`)·메카닉 장비(`mechanic_equipment`)의 잠재능력·소울 잠재능력 필드 — 넥슨 문서에 없는 필드라 값이 없을 수 있습니다.

## 카테고리별 사용법

### 캐릭터 기본 정보·스탯

```js
// 캐릭터 검색 사이트의 프로필 카드
const basic = await client.maplestory.character.getBasic({ ocid });
const popularity = await client.maplestory.character.getPopularity({ ocid });

console.log(basic.character_image); // 캐릭터 외형 이미지 주소 — <img> 에 그대로 넣는다
console.log(`${basic.character_class} / ${basic.character_class_level}차`);
console.log(`경험치 ${basic.character_exp_rate}%`, `인기도 ${popularity.popularity}`);
if (basic.liberation_quest_clear === '1') console.log('제네시스 해방 완료');
```

자주 쓰는 필드 (`getBasic`):

- `character_level`, `character_exp_rate` — 레벨과 현재 레벨의 경험치 퍼센트(문자열)
- `character_class`, `character_class_level` — 직업과 전직 차수
- `character_guild_name` — 소속 길드 이름
- `character_image` — 캐릭터 외형 이미지 주소. 넥슨 안내에 따르면 주소 뒤에 쿼리 파라미터를 붙여 동작·감정표현을 바꿀 수 있습니다.
- `access_flag` — 최근 7일 안에 접속했는지 (`"true"` / `"false"`)
- `liberation_quest_clear` — 해방 퀘스트. `"0"` 미완료, `"1"` 제네시스 해방, `"2"` 데스티니 1차 해방

과거 날짜의 기록을 보려면 `date` 를 넣습니다. 레벨 변화 그래프를 그릴 때 씁니다.

```js
const past = await client.maplestory.character.getBasic({ ocid, date: '2026-11-01' });
console.log(`11월 1일 레벨: ${past.character_level}`);
```

### 장비·스타포스·잠재능력

```js
// 스펙 검색기: 부위별 장비와 스타포스, 잠재능력 3줄
const equip = await client.maplestory.character.getItemEquipment({ ocid });

for (const item of equip.item_equipment) {
  console.log(`[${item.item_equipment_part}] ${item.item_name} ★${item.starforce}`);
  console.log(`  잠재능력(${item.potential_option_grade}): ${item.potential_option_1}`);
  console.log(`  주스탯 합계 STR ${item.item_total_option.str}`);
}
// 출력 예시
// [모자] 아이템 이름 ★22
//   잠재능력(레전드리): STR : +12%
//   주스탯 합계 STR 150
```

자주 쓰는 필드 (`item_equipment[]`):

- `item_equipment_part`, `item_equipment_slot` — 장비 부위와 슬롯 (반지 1~4처럼 같은 부위가 여러 개일 때 슬롯으로 구분)
- `starforce` — 스타포스 별 개수 (문자열). `starforce_scroll_flag` 가 `"1"` 이면 놀라운 장비강화 주문서를 쓴 장비
- `potential_option_grade`, `potential_option_1`~`3` — 잠재능력 등급과 옵션 3줄. 잠재능력이 없는 장비는 `null`
- `additional_potential_option_grade`, `additional_potential_option_1`~`3` — 에디셔널 잠재능력
- `item_total_option` — 모든 강화를 더한 최종 옵션. 세부 내역은 `item_base_option`(기본), `item_add_option`(추가 옵션), `item_etc_option`(주문서), `item_starforce_option`(스타포스)
- `scroll_upgrade`, `scroll_upgradeable_count` — 주문서 강화 횟수와 남은 업그레이드 가능 횟수 (문자열 숫자)
- `soul_name`, `soul_option` — 무기에 장착한 소울. 소울이 없으면 `null`

`preset_no` 는 지금 쓰는 장비 프리셋 번호이고, `item_equipment_preset_1`~`3` 에 프리셋별 장비가 들어 있습니다. 프리셋 장비의 장착 슬롯도 `item_equipment_slot` 입니다. 칭호는 `title`, 칭호 프리셋 1~3번은 `title_preset1`~`3` (빈 프리셋은 `title_name` 이 `null`), 에반의 드래곤 장비는 `dragon_equipment`, 메카닉 장비는 `mechanic_equipment` 입니다.

### 스킬·링크 스킬·V매트릭스·HEXA 매트릭스

```js
// 6차 스킬(HEXA) 강화 현황
const hexa = await client.maplestory.character.getHexaMatrix({ ocid });
for (const core of hexa.character_hexa_core_equipment) {
  console.log(`${core.hexa_core_type} | ${core.hexa_core_name} Lv.${core.hexa_core_level}`);
}

// 4차 스킬 목록
const skill = await client.maplestory.character.getSkill({ ocid, character_skill_grade: '4' });
console.log(skill.character_skill.map((s) => `${s.skill_name} Lv.${s.skill_level}`));
```

- `getSkill()` 은 차수를 하나씩 조회합니다. 5차 스킬은 `'5'`, 6차 스킬은 `'6'` 입니다.
- `getLinkSkill()` 의 `character_link_skill` 은 이 캐릭터가 **장착한** 링크 스킬, `character_owned_link_skill` 은 이 캐릭터가 **다른 캐릭터에게 주는** 링크 스킬입니다.
- `getHexaMatrixStat()` 의 `character_hexa_stat_core`, `_2`, `_3` 은 각각 HEXA 스탯 I, II, III 입니다. `main_stat_name`·`main_stat_level` 이 메인 스탯입니다.
- 심볼은 `getSymbolEquipment()` 의 `symbol[]` 에 아케인심볼과 어센틱심볼이 함께 들어 있습니다. `symbol_force` 는 심볼로 오르는 포스(아케인포스 등)입니다.

### 유니온

```js
// 유니온 배치도 그리기: 블록이 차지한 칸 좌표
const raider = await client.maplestory.union.getRaider({ ocid });

for (const block of raider.union_block) {
  console.log(block.block_class, `Lv.${block.block_level}`, block.block_position);
}
console.log('공격대원 효과:', raider.union_raider_stat);
console.log('점령 효과:', raider.union_occupied_stat);
```

자주 쓰는 필드:

- `union_block[]` — 블록 하나(캐릭터 하나). `block_type` 은 블록 모양(전사·마법사·궁수·도적·해적·메이플M·하이브리드), `block_position` 은 차지한 칸의 좌표 목록
- 좌표는 중앙 4칸 중 오른쪽 아래 칸이 `x: 0, y: 0` 입니다. 오른쪽으로 갈수록 `x` 가, 위로 갈수록 `y` 가 커집니다.
- `union_inner_stat[]` — 안쪽 8구역의 배치. `stat_field_id` 는 11시 방향부터 시계 방향으로 0~7
- `union_raider_stat` — 공격대원 효과, `union_occupied_stat` — 공격대 점령 효과 (문장 그대로의 문자열 목록)
- `use_preset_no`, `union_raider_preset_1`~`5` — 유니온 프리셋

유니온 레벨·등급은 `union.getUnion()`, 아티팩트는 `union.getArtifact()`, 챔피언은 `union.getChampion()` 입니다.

### 길드

```js
// 길드 소개 페이지
const guildId = await client.maplestory.guild.getId('길드명', '스카니아');
const guild = await client.maplestory.guild.getBasic({ oguild_id: guildId });

console.log(`${guild.guild_name} Lv.${guild.guild_level} — 마스터 ${guild.guild_master_name}`);
console.log(`길드원 ${guild.guild_member_count}명:`, guild.guild_member.join(', '));
```

- `guild_member` — 길드원 캐릭터 이름 목록. 각 길드원의 레벨·직업은 이름으로 `getOcid()` → `character.getBasic()` 을 다시 조회해야 합니다.
- `guild_fame` 명성치, `guild_point` 길드 포인트(GP)
- `guild_skill` 길드 스킬, `guild_noblesse_skill` 노블레스 스킬

### 내 강화 기록 (스타포스·큐브)

API 키를 발급받은 내 계정의 기록입니다.

```js
// 하루 동안의 스타포스 결과 모두 모으기
let page = await client.maplestory.history.getStarforce({ count: 1000, date: '2026-11-01' });
const all = [...page.starforce_history];
while (page.next_cursor) {
  page = await client.maplestory.history.getStarforce({ count: 1000, cursor: page.next_cursor });
  all.push(...page.starforce_history);
}

for (const h of all) {
  console.log(
    `${h.target_item}: ${h.before_starforce_count}성 → ${h.after_starforce_count}성 (${h.item_upgrade_result})`,
  );
}
```

- 한 번에 `count` 개(10~1000)까지 받고, 더 있으면 응답의 `next_cursor` 를 `cursor` 에 넣어 이어서 받습니다. `next_cursor` 가 `null` 이면 끝입니다.
- 스타포스: `item_upgrade_result` 강화 결과, `starcatch_result` 스타 캐치, `chance_time` 찬스 타임, `destroy_defence` 파괴 방지, `starforce_event_list` 당시 진행 중이던 스타포스 이벤트
- 큐브·잠재능력 재설정: `cube_type` 사용한 큐브, `potential_type` 대상(잠재능력 / 에디셔널 잠재능력), `before_potential_option` → `after_potential_option` 전후 옵션, `item_upgrade_result` 결과, `miracle_time_flag` 미라클 타임
- `upgrade_guarantee` 는 천장에 도달해 등급이 확정 상승했는지, `upgrade_guarantee_count` 는 지금까지 쌓인 횟수입니다.
- 옵션 재설정을 3회 진행한 결과가 섞여 있으면 `count` 보다 적게 올 수 있습니다 (넥슨 안내).

### 랭킹

```js
// 스카니아 종합 랭킹 1페이지
const overall = await client.maplestory.ranking.getOverall({
  date: '2026-11-23',
  world_name: '스카니아',
});
for (const r of overall.ranking.slice(0, 5)) {
  console.log(`${r.ranking}위 ${r.character_name} Lv.${r.character_level} (${r.class_name})`);
}

// 특정 캐릭터의 순위만 보기
const mine = await client.maplestory.ranking.getOverall({ date: '2026-11-23', ocid });
console.log(mine.ranking[0]?.ranking);
```

- 모든 랭킹은 `date` 가 필수입니다. 다음 순위는 `page` 를 2, 3… 으로 올려 조회합니다.
- `ocid` 를 넣으면 그 캐릭터의 순위만 받습니다 (길드 랭킹 제외).
- 무릉도장·더 시드의 `dojang_time_record`, `theseed_time_record` 는 초 단위 클리어 시간입니다.

### 공지

```js
// 디스코드 봇: 진행 중 이벤트 알림
const events = await client.maplestory.notice.getEventList();
for (const e of events.event_notice) {
  console.log(`${e.title} (${e.date_event_start} ~ ${e.date_event_end})\n${e.url}`);
}
```

목록은 최근 20개입니다. 본문(`contents`)이 필요하면 목록의 `notice_id` 를 `getDetail()` 계열에 넣습니다. 캐시샵 공지의 `ongoing_flag` 가 `"true"` 면 상시 판매입니다.

### 연무장

리플레이를 등록한 캐릭터만 조회할 수 있습니다. 먼저 리플레이 고유 번호를 받고, 그 번호로 나머지를 조회합니다.

```js
// 스킬별 데미지 비중 표
const { replay_list } = await client.maplestory.battlePractice.getReplayId({ ocid });
const replayId = replay_list[0]?.replay_id;

if (replayId) {
  const result = await client.maplestory.battlePractice.getResult({ replay_id: replayId });
  console.log(`총 데미지 ${result.total_damage}, DPS ${result.total_dps}`);
  for (const s of result.skill_statistic) {
    console.log(`${s.skill_name}: ${s.damage_percent}% (${s.use_count}회 사용)`);
  }

  // 스킬 사용 순서 (여러 페이지)
  const first = await client.maplestory.battlePractice.getSkillTimeline({ replay_id: replayId });
  for (let page = 2; page <= first.total_page_no; page++) {
    await client.maplestory.battlePractice.getSkillTimeline({ replay_id: replayId, page_no: page });
  }
}
```

- `total_play_time`, `elapse_time` 은 밀리초(ms)입니다.
- `end_type` — `"1"` 자동 종료, `"2"` 수동 종료, `"3"` 시간 초과, `"9"` 기타
- `period_no` — 연무장이 초기화될 때마다 1씩 늘어나는 기간 번호
- `getCharacterInfo()` 는 연무장 입장 당시의 스탯·장비·스킬·유니온 정보를 한 번에 줍니다. 최상위 키는 모두 `basic_object`, `stat_object`, `item_object` 처럼 `_object` 로 끝납니다. 여기서는 장비의 남은 업그레이드 횟수 필드 이름이 `scroll_upgrade_able_count` 입니다 (캐릭터 장비 조회에서는 `scroll_upgradeable_count`). 리플레이에는 장비의 소울 잠재능력(`soul_potential_*`, `soul_pad`, `soul_mad`, `soul_active`), 월드 공유 펫(`world_share_pet_*`), 월드 공유 마스터라벨, `union_state_stat` 이 들어 있지 않을 수 있으니 값이 있는지 확인하고 씁니다.

### 스케줄러 (일일·주간·보스)

```js
// 주간 보스 체크리스트 — 내 계정의 캐릭터만 조회된다
const state = await client.maplestory.scheduler.getCharacterState({ ocid });

console.log(`주간 보스 ${state.weekly_boss_clear_count}/${state.weekly_boss_clear_limit_count}`);
for (const boss of state.boss_contents) {
  const done = boss.complete_flag === 'true' ? '완료' : '미완료';
  console.log(`${boss.difficulty} ${boss.content_name}: ${done}`);
}
```

- `daily_contents`, `weekly_contents` — `now_count` / `max_count` 로 진행도를 봅니다. 퀘스트면 `quest_state` 가 `"1"` 진행 중, `"2"` 완료, `"0"` 기타입니다.
- `registration_flag`, `complete_flag` 는 문자열 `"true"` / `"false"` 입니다.

### 내 계정·구 API 키

```js
const ouid = await client.maplestory.getOuid(); // 지금 쓰는 API 키의 계정
const list = await client.maplestory.character.getList(); // 내 캐릭터 전체
console.log(list.account_list.flatMap((a) => a.character_list.map((c) => c.character_name)));
```

`getLegacyOuid('구 API 키')` 는 예전 개발자센터에서 발급받은 키의 계정 고유 번호를 조회합니다. `NexonClient` 에 넣은 키가 아니라 인자로 넘긴 구 키로 인증합니다. 재시도 횟수·제한 시간 같은 `NexonClient` 설정은 똑같이 적용됩니다.

<details><summary>넥슨 API 경로</summary>

모든 경로 앞에 `https://open.api.nexon.com` 이 붙습니다.

| SDK 메서드                                | 경로                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| `getOcid`                                 | `GET /maplestory/v1/id`                                      |
| `getOuid`                                 | `GET /maplestory/v1/ouid`                                    |
| `getLegacyOuid`                           | `GET /maplestory/legacy/ouid`                                |
| `getAchievement`                          | `GET /maplestory/v1/user/achievement`                        |
| `character.getList`                       | `GET /maplestory/v1/character/list`                          |
| `character.getBasic`                      | `GET /maplestory/v1/character/basic`                         |
| `character.getPopularity`                 | `GET /maplestory/v1/character/popularity`                    |
| `character.getStat`                       | `GET /maplestory/v1/character/stat`                          |
| `character.getHyperStat`                  | `GET /maplestory/v1/character/hyper-stat`                    |
| `character.getPropensity`                 | `GET /maplestory/v1/character/propensity`                    |
| `character.getAbility`                    | `GET /maplestory/v1/character/ability`                       |
| `character.getItemEquipment`              | `GET /maplestory/v1/character/item-equipment`                |
| `character.getCashItemEquipment`          | `GET /maplestory/v1/character/cashitem-equipment`            |
| `character.getSymbolEquipment`            | `GET /maplestory/v1/character/symbol-equipment`              |
| `character.getSetEffect`                  | `GET /maplestory/v1/character/set-effect`                    |
| `character.getBeautyEquipment`            | `GET /maplestory/v1/character/beauty-equipment`              |
| `character.getAndroidEquipment`           | `GET /maplestory/v1/character/android-equipment`             |
| `character.getPetEquipment`               | `GET /maplestory/v1/character/pet-equipment`                 |
| `character.getSkill`                      | `GET /maplestory/v1/character/skill`                         |
| `character.getLinkSkill`                  | `GET /maplestory/v1/character/link-skill`                    |
| `character.getVMatrix`                    | `GET /maplestory/v1/character/vmatrix`                       |
| `character.getHexaMatrix`                 | `GET /maplestory/v1/character/hexamatrix`                    |
| `character.getHexaMatrixStat`             | `GET /maplestory/v1/character/hexamatrix-stat`               |
| `character.getDojang`                     | `GET /maplestory/v1/character/dojang`                        |
| `character.getOtherStat`                  | `GET /maplestory/v1/character/other-stat`                    |
| `character.getRingExchangeSkillEquipment` | `GET /maplestory/v1/character/ring-exchange-skill-equipment` |
| `character.getRingReserveSkillEquipment`  | `GET /maplestory/v1/character/ring-reserve-skill-equipment`  |
| `union.getUnion`                          | `GET /maplestory/v1/user/union`                              |
| `union.getRaider`                         | `GET /maplestory/v1/user/union-raider`                       |
| `union.getArtifact`                       | `GET /maplestory/v1/user/union-artifact`                     |
| `union.getChampion`                       | `GET /maplestory/v1/user/union-champion`                     |
| `guild.getId`                             | `GET /maplestory/v1/guild/id`                                |
| `guild.getBasic`                          | `GET /maplestory/v1/guild/basic`                             |
| `history.getStarforce`                    | `GET /maplestory/v1/history/starforce`                       |
| `history.getPotential`                    | `GET /maplestory/v1/history/potential`                       |
| `history.getCube`                         | `GET /maplestory/v1/history/cube`                            |
| `history.getSoulPotential`                | `GET /maplestory/v1/history/soul-potential`                  |
| `ranking.getOverall`                      | `GET /maplestory/v1/ranking/overall`                         |
| `ranking.getUnion`                        | `GET /maplestory/v1/ranking/union`                           |
| `ranking.getGuild`                        | `GET /maplestory/v1/ranking/guild`                           |
| `ranking.getDojang`                       | `GET /maplestory/v1/ranking/dojang`                          |
| `ranking.getTheSeed`                      | `GET /maplestory/v1/ranking/theseed`                         |
| `ranking.getAchievement`                  | `GET /maplestory/v1/ranking/achievement`                     |
| `notice.getList`                          | `GET /maplestory/v1/notice`                                  |
| `notice.getDetail`                        | `GET /maplestory/v1/notice/detail`                           |
| `notice.getUpdateList`                    | `GET /maplestory/v1/notice-update`                           |
| `notice.getUpdateDetail`                  | `GET /maplestory/v1/notice-update/detail`                    |
| `notice.getEventList`                     | `GET /maplestory/v1/notice-event`                            |
| `notice.getEventDetail`                   | `GET /maplestory/v1/notice-event/detail`                     |
| `notice.getCashshopList`                  | `GET /maplestory/v1/notice-cashshop`                         |
| `notice.getCashshopDetail`                | `GET /maplestory/v1/notice-cashshop/detail`                  |
| `battlePractice.getReplayId`              | `GET /maplestory/v1/battle-practice/replay-id`               |
| `battlePractice.getResult`                | `GET /maplestory/v1/battle-practice/result`                  |
| `battlePractice.getSkillTimeline`         | `GET /maplestory/v1/battle-practice/skill-timeline`          |
| `battlePractice.getCharacterInfo`         | `GET /maplestory/v1/battle-practice/character-info`          |
| `scheduler.getCharacterState`             | `GET /maplestory/v1/scheduler/character-state`               |

</details>

응답의 나머지 필드는 에디터 자동완성에서 확인하세요. 필드마다 게임 용어로 된 설명이 함께 나옵니다.

## 만들기 예제

### 1. 디스코드 봇 응답용 캐릭터 요약

`!정보 캐릭터명` 명령에 답할 한 덩어리의 텍스트를 만듭니다. 서로 상관없는 조회는 `Promise.all` 로 한꺼번에 보냅니다.

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

async function summarize(characterName) {
  try {
    const ocid = await client.maplestory.getOcid(characterName);
    const [basic, stat, union, dojang] = await Promise.all([
      client.maplestory.character.getBasic({ ocid }),
      client.maplestory.character.getStat({ ocid }),
      client.maplestory.union.getUnion({ ocid }),
      client.maplestory.character.getDojang({ ocid }),
    ]);
    const power = stat.final_stat.find((s) => s.stat_name === '전투력')?.stat_value ?? '-';

    return [
      `**${basic.character_name}** (${basic.world_name})`,
      `Lv.${basic.character_level} ${basic.character_class}`,
      `전투력 ${Number(power).toLocaleString('ko-KR')}`,
      `유니온 Lv.${union.union_level} (${union.union_grade})`,
      `무릉도장 ${dojang.dojang_best_floor}층`,
    ].join('\n');
  } catch (err) {
    if (err instanceof NexonNotFoundError) return `'${characterName}' 캐릭터를 찾지 못했습니다.`;
    throw err;
  }
}

console.log(await summarize('캐릭터명'));
// 출력 예시
// **캐릭터명** (스카니아)
// Lv.275 아크메이지(불,독)
// 전투력 123,456,789
// 유니온 Lv.8500 (그랜드 마스터 유니온 3)
// 무릉도장 60층
```

### 2. 길드원 레벨표

길드원 이름 목록을 받아 한 명씩 레벨과 직업을 조회합니다. 길드원이 많으면 조회 횟수도 많아지므로 차례로 하나씩 보냅니다.

```js
import { NexonClient, NexonError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

const guildId = await client.maplestory.guild.getId('길드명', '스카니아');
const guild = await client.maplestory.guild.getBasic({ oguild_id: guildId });

const rows = [];
for (const name of guild.guild_member) {
  try {
    const ocid = await client.maplestory.getOcid(name);
    const basic = await client.maplestory.character.getBasic({ ocid });
    rows.push({ name, level: basic.character_level, job: basic.character_class });
  } catch (err) {
    // 조회에 실패한 길드원은 건너뛴다
    if (!(err instanceof NexonError)) throw err;
  }
}

rows.sort((a, b) => b.level - a.level);
for (const r of rows) console.log(`Lv.${r.level} ${r.name} (${r.job})`);
// 출력 예시
// Lv.280 길드원1 (히어로)
// Lv.275 길드원2 (비숍)
```

### 3. 무릉도장 통달 랭킹 TOP 10

```js
import { NexonClient, toNexonDate } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) throw new Error('NEXON_API_KEY 환경변수를 설정해 주세요.');
const client = new NexonClient({ apiKey });

// 오늘 랭킹은 오전 9시 30분경부터 나오므로 어제 날짜를 쓴다
const yesterday = toNexonDate(new Date(Date.now() - 24 * 60 * 60 * 1000), 540);

const { ranking } = await client.maplestory.ranking.getDojang({
  date: yesterday,
  difficulty: 1, // 0: 일반, 1: 통달
  world_name: '스카니아',
});

for (const r of ranking.slice(0, 10)) {
  const min = Math.floor(r.dojang_time_record / 60);
  const sec = r.dojang_time_record % 60;
  console.log(`${r.ranking}위 ${r.character_name} — ${r.dojang_floor}층 (${min}분 ${sec}초)`);
}
// 출력 예시
// 1위 캐릭터명 — 95층 (12분 34초)
```

세 예제 모두 `index.mjs` 로 저장하고 `node --env-file=.env index.mjs` 로 실행합니다. 더 많은 예제는 [examples](../examples/README.md)에 있습니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 해외 서버와 모바일: [메이플스토리M](./maplestory-m.md), [MapleStory SEA](./maplestory-sea.md), [MapleStory Taiwan](./maplestory-tw.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
