# 퍼스트 디센던트 — nexon-open-api

> `client.firstDescendant` · API 42개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/tfd/)

계승자 빌드 카드에 모듈과 장비를 표시하거나, 보이드 요격전 공략 사이트에 추천 모듈과 리더보드를 붙일 수 있습니다.

## 시작하기

처음이라면 [시작 가이드](./getting-started.md)를 따라 API 키를 발급받고 패키지를 설치하세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { firstDescendant } = client;
  const ouid = await firstDescendant.getOuid(process.argv[2] ?? '닉네임#1234');
  const [basic, activeDescendant, descendants] = await Promise.all([
    firstDescendant.user.getBasic({ ouid }),
    firstDescendant.user.getDescendant({ ouid }),
    firstDescendant.meta.getDescendant('ko'),
  ]);
  const name = descendants.find(
    (entry) => entry.descendant_id === activeDescendant.descendant_id,
  )?.descendant_name;
  console.log(
    `${basic.user_name} · 마스터리 랭크 ${basic.mastery_rank_level} · ${name ?? activeDescendant.descendant_id}`,
  );
  // 예시 출력: 닉네임#1234 · 마스터리 랭크 20 · 비에사
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs '닉네임#1234'`로 실행합니다. 예제의 이름을 실제 조회할 이름으로 바꿔 실행하세요.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.firstDescendant`에서 호출합니다.

| 게임에서 부르는 이름                   | SDK 메서드                                                                       | 주요 응답 필드                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 닉네임으로 계정 고유 번호 찾기         | `getOuid(userName)`                                                              | `ouid` (SDK가 돌려주는 고유 번호)                                                                           |
| 프로필의 마스터리 랭크                 | `user.getBasic({ ouid })`                                                        | `user_name` (닉네임), `mastery_rank_level` (마스터리 랭크), `mastery_rank_exp` (마스터리 경험치)            |
| 장착 계승자·모듈·커스터마이징          | `user.getDescendant({ ouid })`                                                   | `descendant_id` (계승자 번호), `module` (장착 모듈), `customizing` (커스터마이징)                           |
| 모든 슬롯의 장착 무기                  | `user.getWeapon({ ouid, language_code })`                                        | `weapon` (장착 무기), `weapon[].module` (무기 모듈)                                                         |
| 장착 반응로                            | `user.getReactor({ ouid, language_code })`                                       | `reactor_id` (반응로 번호), `reactor_additional_stat` (추가 스탯)                                           |
| 모든 슬롯의 장착 외장 부품             | `user.getExternalComponent({ ouid, language_code })`                             | `external_component` (슬롯별 외장 부품)                                                                     |
| 계승자별 아르케 조율                   | `user.getArcheTuning({ ouid, descendant_group_id })`                             | `arche_tuning` (슬롯별 조율 보드와 노드)                                                                    |
| 획득처 도감                            | `meta.getAcquisitionDetail(languageCode?)`                                       | `acquisition_detail_id` (획득처 번호), `acquisition_detail_name` (획득처 안내)                              |
| 아르케 조율 노드 도감                  | `meta.getArcheTuningNode(languageCode?)`                                         | `node_id` (노드 번호), `node_name` (노드 이름)                                                              |
| 수집형 아이템 도감                     | `meta.getCollectibleItem(languageCode?)`                                         | `collectible_item_id` (수집형 아이템 번호), `collectible_item_name` (이름)                                  |
| 소비 아이템 도감                       | `meta.getConsumableMaterial(languageCode?)`                                      | `consumable_material_id` (소비 아이템 번호), `consumable_material_name` (이름)                              |
| 코어 유형 도감                         | `meta.getCoreType(languageCode?)`                                                | `core_type_id` (코어 유형 번호), `core_option` (코어 옵션)                                                  |
| 커스터마이징 아이템 도감               | `meta.getCustomizingItem(languageCode?)`                                         | `customizing_item_id` (꾸미기 아이템 번호), `customizing_item_name` (이름)                                  |
| 계승자 도감                            | `meta.getDescendant(languageCode?)`                                              | `descendant_id` (계승자 번호), `descendant_name` (이름), `descendant_skill` (스킬)                          |
| 계승자 그룹 도감                       | `meta.getDescendantGroup(languageCode?)`                                         | `descendant_group_id` (계승자 그룹 번호), `descendant_group_name` (이름)                                    |
| 외장 부품 도감                         | `meta.getExternalComponent(languageCode?)`                                       | `external_component_id` (외장 부품 번호), `external_component_name` (이름), `set_option_detail` (세트 효과) |
| 조력자 도감                            | `meta.getFellow(languageCode?)`                                                  | `fellow_id` (조력자 번호), `fellow_name` (이름)                                                             |
| 훈장 도감                              | `meta.getMedal(languageCode?)`                                                   | `medal_id` (훈장 번호), `medal_detail` (훈장 단계별 정보)                                                   |
| 모듈 도감                              | `meta.getModule(languageCode?)`                                                  | `module_id` (모듈 번호), `module_name` (이름), `module_stat` (강화 단계별 효과)                             |
| 변이 세포 도감                         | `meta.getNodeItem(languageCode?)`                                                | `node_item_id` (변이 세포 번호), `node_item_name` (이름)                                                    |
| 변이 세포 소켓 유형 도감               | `meta.getNodeSocketType(languageCode?)`                                          | `node_item_socket_type` (소켓 유형), `node_item_socket_name` (이름)                                         |
| 반응로 도감                            | `meta.getReactor(languageCode?)`                                                 | `reactor_id` (반응로 번호), `reactor_name` (이름), `reactor_skill_power` (스킬 위력)                        |
| 연구 도감                              | `meta.getResearch(languageCode?)`                                                | `research_id` (연구 번호), `research_material` (연구 재료)                                                  |
| 난이도 보상 도감                       | `meta.getReward(languageCode?)`                                                  | `map_name` (지역 이름), `battle_zone` (전장별 보상)                                                         |
| 기본 스탯 도감                         | `meta.getStat(languageCode?)`                                                    | `stat_id` (스탯 번호), `stat_name` (이름)                                                                   |
| 등급 도감                              | `meta.getTier(languageCode?)`                                                    | `tier_id` (등급 번호), `tier_name` (이름)                                                                   |
| 타이틀 도감                            | `meta.getTitle(languageCode?)`                                                   | `title_id` (타이틀 번호), `title_name` (이름)                                                               |
| 탈것 도감                              | `meta.getVehicle(languageCode?)`                                                 | `vehicle_id` (탈것 번호), `vehicle_name` (이름)                                                             |
| 보이드 요격전 도감                     | `meta.getVoidBattle(languageCode?)`                                              | `void_battle_id` (요격전 번호), `void_battle_name` (이름)                                                   |
| 무기 도감                              | `meta.getWeapon(languageCode?)`                                                  | `weapon_id` (무기 번호), `weapon_name` (이름), `firearm_atk` (총기 공격력)                                  |
| 무기 유형 도감                         | `meta.getWeaponType(languageCode?)`                                              | `weapon_type` (무기 유형), `weapon_type_name` (이름)                                                        |
| 적응도 레벨                            | `meta.getAdaptLevel()`                                                           | `level` (적응도 레벨), `exp_per_level` (레벨별 경험치)                                                      |
| 비정형 물질 개봉 보상                  | `meta.getAmorphousReward()`                                                      | `amorphous_reward_id` (비정형 물질 보상 번호), `open_reward` (개봉 보상)                                    |
| 아르케 조율 보드                       | `meta.getArcheTuningBoard()`                                                     | `arche_tuning_board_id` (보드 번호), `node` (노드 배치)                                                     |
| 아르케 조율 보드 그룹                  | `meta.getArcheTuningBoardGroup()`                                                | `arche_tuning_board_group_id` (보드 그룹 번호)                                                              |
| 코어 슬롯                              | `meta.getCoreSlot()`                                                             | `core_slot_id` (코어 슬롯 번호), `available_core_type_id` (장착 가능한 코어 유형)                           |
| 계승자 레벨별 경험치                   | `meta.getDescendantLevelDetail()`                                                | `descendant_level` (계승자 레벨), `exp_per_level` (레벨별 경험치)                                           |
| 조력자 레벨별 경험치                   | `meta.getFellowLevelDetail()`                                                    | `fellow_level` (조력자 레벨), `exp_per_level` (레벨별 경험치)                                               |
| 마스터리 랭크별 경험치                 | `meta.getMasteryRankLevelDetail()`                                               | `mastery_level` (마스터리 랭크), `exp_per_level` (랭크별 경험치)                                            |
| 보이드 요격전 성공 기록 기반 추천 모듈 | `recommendation.getModule({ descendant_id, weapon_id, void_battle_id, period })` | `descendant.recommendation` (계승자 모듈), `weapon.recommendation` (무기 모듈)                              |
| 보이드 요격전 리더보드                 | `leaderboard.getVoidInterceptBattle(params)`                                     | `leaderboard` (순위·클리어 타임·참가 멤버)                                                                  |
| 보이드 침식 정화 - 도전 리더보드       | `leaderboard.getVoidErosionPurgeChallenge(params)`                               | `leaderboard` (순위·단계·클리어 타임·참가 멤버)                                                             |

## 알아두기

- OUID는 계정마다 붙는 고유 번호입니다. 닉네임의 대소문자를 맞추고 `#` 뒤 태그까지 입력합니다. 게임 콘텐츠가 바뀌면 OUID가 달라질 수 있습니다. 저장한 번호로 조회가 실패하면 닉네임으로 다시 찾습니다. 6개월 이상 접속하지 않은 계정은 조회되지 않을 수 있습니다.
- 게임에서 바꾼 정보는 평균 10분 뒤에 볼 수 있습니다. 계승자의 장착 모듈·커스터마이징과 무기의 장착 모듈은 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤 갱신됩니다. 리더보드는 평균 1시간 단위로 갱신됩니다.
- 메타데이터는 계승자·무기·모듈 등이 들어 있는 게임 속 도감입니다. 계정 조회 결과의 ID를 이름으로 바꿀 때 씁니다. 도감은 항목 전체를 배열로 반환합니다. 정적 도감 경로에 직접 요청하면 API 키 없이 받을 수 있습니다. 수백 KB에서 2 MB가 넘는 파일도 있으므로 서비스에서 재사용할 수 있게 캐시합니다.
- 언어 코드는 계승자 이름이나 장비 옵션 이름을 어느 언어로 받을지 정합니다. 생략하면 한국어(`ko`)입니다. 도감은 `meta.getWeapon('en')`처럼 위치 인자로, 장착 무기·반응로·외장 부품은 `{ ouid, language_code: 'en' }`으로 전달합니다. 공통 도감은 언어 인자가 없습니다.
- 지원 언어는 `ko` 한국어, `en` 영어, `de` 독일어, `fr` 프랑스어, `ja` 일본어, `zh-CN` 중국어 간체, `zh-TW` 중국어 번체, `it` 이탈리아어, `pl` 폴란드어, `pt` 포르투갈어, `ru` 러시아어, `es` 스페인어입니다. 대소문자를 구분합니다. TypeScript 타입은 `TfdLanguageCode`, 실행 중 사용할 목록은 `TFD_LANGUAGE_CODES`입니다.
- 필수 ID가 비어 있거나 언어 코드, 추천 기간, 리더보드 조건이 잘못되면 SDK가 요청 전에 `NexonBadRequestError`(`OPENAPI00004`)를 던집니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 에디터 자동완성에서 확인할 수 있습니다.

### 계승자와 장착 장비

시작 예제에서 만든 `client`와 `ouid`를 사용합니다.

```ts
// 빌드 카드에 계승자 레벨과 외장 부품 이름을 표시
const { user, meta } = client.firstDescendant;
const [equipped, gear, catalog] = await Promise.all([
  user.getDescendant({ ouid }),
  user.getExternalComponent({ ouid }),
  meta.getExternalComponent(),
]);
const names = new Map(
  catalog.map((item) => [item.external_component_id, item.external_component_name]),
);
console.log(`계승자 Lv.${equipped.descendant_level}`);
for (const part of gear.external_component) {
  console.log(names.get(part.external_component_id) ?? part.external_component_id);
}
```

- `module`의 `module_id`는 도감의 모듈 번호입니다. `module_enchant_level`은 장착한 모듈의 강화 단계입니다.
- `module_capacity`와 `module_max_capacity`는 실제 적용된 모듈 수용량과 장착 가능한 최대 수용량입니다.
- 장착 무기와 외장 부품의 `core_unlock_flag`는 문자열 `"0"`이면 잠금, `"1"`이면 개방입니다.
- `additional_stat_value`와 `core_option_value`는 문자열입니다. 아르케 조율 노드의 `position_row`, `position_column`도 문자열입니다. `descendant_group_id`는 `meta.getDescendantGroup()`에서 찾습니다.

### 계승자·무기·모듈 도감

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 영문 장비 검색기에 무기 ID와 영문 이름을 연결
const { meta } = client.firstDescendant;
const weapons = await meta.getWeapon('en');
const weaponById = new Map(weapons.map((weapon) => [weapon.weapon_id, weapon.weapon_name]));
const levels = await meta.getDescendantLevelDetail();
console.log(weaponById.size, levels[0]?.exp_per_level);
```

- `weapon_id`와 `weapon_name`은 장착 정보와 무기 도감을 연결하는 번호와 표시 이름입니다.
- `image_url`은 장비 등의 이미지 주소입니다. 값이 없는 도감 항목은 `null`일 수 있습니다. `weapon_perk_ability_name`, `module_type`, `arche_type`도 비어 있을 수 있습니다.
- 마스터리 랭크 도감은 실응답의 `mastery_level`을 제공합니다. 공식 스펙의 `mastery_rank_level`은 타입에서 선택 필드로 남아 있습니다.
- 코어 옵션의 후보는 `core_option[].detail[].available_item_option`에 있고 `option_grade`는 숫자입니다. 조력자 효과의 `operator_type`은 응답에서 빠질 수 있습니다.

### 보이드 요격전 추천 모듈

시작 예제에서 만든 `client`를 사용합니다. 조회할 계승자·무기·보이드 요격전 번호는 각각 `meta.getDescendant()`, `meta.getWeapon()`, `meta.getVoidBattle()`에서 찾습니다.

```ts
// 공략 페이지에 최근 30일의 계승자 추천 모듈 이름 표시
const { meta, recommendation } = client.firstDescendant;
const [build, modules] = await Promise.all([
  recommendation.getModule({
    descendant_id: '101000001',
    weapon_id: '211011001',
    void_battle_id: '651000001',
    period: '1',
  }),
  meta.getModule(),
]);
const names = new Map(modules.map((module) => [module.module_id, module.module_name]));
console.log(
  build.descendant.recommendation.map(({ module_id }) => names.get(module_id) ?? module_id),
);
```

- `period`는 문자열입니다. `"0"`은 최근 7일, `"1"`은 최근 30일, `"2"`는 전체입니다.
- `descendant.recommendation`과 `weapon.recommendation`은 계승자와 무기 각각의 추천 목록입니다. 조건에 맞는 성공 기록이 부족하면 비어 있을 수 있습니다.
- `module_id`는 추천된 모듈의 도감 번호입니다.

### 보이드 요격전·보이드 침식 정화 리더보드

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 공략 사이트에 계승자별 솔로 기록과 PC 4인 스쿼드 도전 기록 표시
const { leaderboard } = client.firstDescendant;
const solo = await leaderboard.getVoidInterceptBattle({
  leaderboard_type: 'Solo',
  descendant_id: '101000001',
});
const squad = await leaderboard.getVoidErosionPurgeChallenge({
  leaderboard_type: 'Squad',
  squad_user_count: 4,
  platform_type: 'Pc',
});
for (const entry of (solo.leaderboard ?? []).slice(0, 10)) {
  console.log(entry.ranking, entry.score, entry.member[0]?.user_name);
}
console.log(squad.leaderboard[0]?.stage);
```

- `leaderboard_type`은 필수입니다. `'Solo'`에는 계승자 번호(`descendant_id`), `'Squad'`에는 인원수(`squad_user_count`, 숫자 `2`·`3`·`4`)를 선택해서 넣을 수 있습니다.
- `platform_type`은 `'All'`(기본값), `'Pc'`, `'PlayStation'`, `'Xbox'`입니다. 보이드 요격전의 `contents_type`은 `'RiskMode'`만 받으며 생략해도 같은 값이 적용됩니다.
- `ranking`은 순위, `score`는 클리어 타임, `stage`는 도전 단계입니다. `score`와 `stage`는 문자열입니다.
- `member`는 참가자 목록입니다. 보이드 요격전의 `leaderboard`, 각 기록의 `ranking`과 `score`, 멤버의 일부 필드는 `null`일 수 있습니다.

<details>
<summary>넥슨 API 경로</summary>

| SDK 메서드                                 | 넥슨 API 경로                                                   |
| ------------------------------------------ | --------------------------------------------------------------- |
| `getOuid`                                  | `GET /tfd/v1/id`                                                |
| `user.getBasic`                            | `GET /tfd/v1/user/basic`                                        |
| `user.getDescendant`                       | `GET /tfd/v1/user/descendant`                                   |
| `user.getWeapon`                           | `GET /tfd/v1/user/weapon`                                       |
| `user.getReactor`                          | `GET /tfd/v1/user/reactor`                                      |
| `user.getExternalComponent`                | `GET /tfd/v1/user/external-component`                           |
| `user.getArcheTuning`                      | `GET /tfd/v1/user/arche-tuning`                                 |
| `meta.getAcquisitionDetail`                | `GET /static/tfd/meta/{language_code}/acquisition-detail.json`  |
| `meta.getArcheTuningNode`                  | `GET /static/tfd/meta/{language_code}/arche-tuning-node.json`   |
| `meta.getCollectibleItem`                  | `GET /static/tfd/meta/{language_code}/collectible-item.json`    |
| `meta.getConsumableMaterial`               | `GET /static/tfd/meta/{language_code}/consumable-material.json` |
| `meta.getCoreType`                         | `GET /static/tfd/meta/{language_code}/core-type.json`           |
| `meta.getCustomizingItem`                  | `GET /static/tfd/meta/{language_code}/customizing-item.json`    |
| `meta.getDescendant`                       | `GET /static/tfd/meta/{language_code}/descendant.json`          |
| `meta.getDescendantGroup`                  | `GET /static/tfd/meta/{language_code}/descendant-group.json`    |
| `meta.getExternalComponent`                | `GET /static/tfd/meta/{language_code}/external-component.json`  |
| `meta.getFellow`                           | `GET /static/tfd/meta/{language_code}/fellow.json`              |
| `meta.getMedal`                            | `GET /static/tfd/meta/{language_code}/medal.json`               |
| `meta.getModule`                           | `GET /static/tfd/meta/{language_code}/module.json`              |
| `meta.getNodeItem`                         | `GET /static/tfd/meta/{language_code}/node-item.json`           |
| `meta.getNodeSocketType`                   | `GET /static/tfd/meta/{language_code}/node-socket-type.json`    |
| `meta.getReactor`                          | `GET /static/tfd/meta/{language_code}/reactor.json`             |
| `meta.getResearch`                         | `GET /static/tfd/meta/{language_code}/research.json`            |
| `meta.getReward`                           | `GET /static/tfd/meta/{language_code}/reward.json`              |
| `meta.getStat`                             | `GET /static/tfd/meta/{language_code}/stat.json`                |
| `meta.getTier`                             | `GET /static/tfd/meta/{language_code}/tier.json`                |
| `meta.getTitle`                            | `GET /static/tfd/meta/{language_code}/title.json`               |
| `meta.getVehicle`                          | `GET /static/tfd/meta/{language_code}/vehicle.json`             |
| `meta.getVoidBattle`                       | `GET /static/tfd/meta/{language_code}/void-battle.json`         |
| `meta.getWeapon`                           | `GET /static/tfd/meta/{language_code}/weapon.json`              |
| `meta.getWeaponType`                       | `GET /static/tfd/meta/{language_code}/weapon-type.json`         |
| `meta.getAdaptLevel`                       | `GET /static/tfd/meta/adapt-level.json`                         |
| `meta.getAmorphousReward`                  | `GET /static/tfd/meta/amorphous-reward.json`                    |
| `meta.getArcheTuningBoard`                 | `GET /static/tfd/meta/arche-tuning-board.json`                  |
| `meta.getArcheTuningBoardGroup`            | `GET /static/tfd/meta/arche-tuning-board-group.json`            |
| `meta.getCoreSlot`                         | `GET /static/tfd/meta/core-slot.json`                           |
| `meta.getDescendantLevelDetail`            | `GET /static/tfd/meta/descendant-level-detail.json`             |
| `meta.getFellowLevelDetail`                | `GET /static/tfd/meta/fellow-level-detail.json`                 |
| `meta.getMasteryRankLevelDetail`           | `GET /static/tfd/meta/mastery-rank-level-detail.json`           |
| `recommendation.getModule`                 | `GET /tfd/v1/recommendation/module`                             |
| `leaderboard.getVoidInterceptBattle`       | `GET /tfd/v1/leaderboard/void-intercept-battle`                 |
| `leaderboard.getVoidErosionPurgeChallenge` | `GET /tfd/v1/leaderboard/void-erosion-purge-challenge`          |

</details>

## 만들기 예제

- **파티용 빌드 카드** · 장착 계승자와 무기 정보를 받아 도감의 번호와 대조하고, 모듈 이름과 강화 단계를 슬롯 순서대로 표시합니다.
- **요격전 준비 도우미** · 공략에서 선택한 계승자와 무기, 보이드 요격전으로 추천 모듈을 조회해 계승자용과 무기용을 각각 보여 줍니다.
- **기록 전광판** · 리더보드의 첫 10개 기록에 순위·클리어 타임·멤버를 표시하고, 솔로와 스쿼드 필터를 제공합니다.

## 참고

- 퍼스트 디센던트 타입만 가져올 때는 `nexon-open-api/first-descendant`를 사용할 수 있습니다. TypeScript에서 저장한 OUID 문자열을 다시 읽었다면 `TfdOuid` 타입으로 지정해 사용합니다.
- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
