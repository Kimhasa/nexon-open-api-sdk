# 퍼스트 디센던트 (The First Descendant) API 레퍼런스

> SDK 지원 API 42개 — `client.firstDescendant`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 42개를 모두 지원합니다.

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ouid = await client.firstDescendant.getOuid('닉네임#1234');
const basic = await client.firstDescendant.user.getBasic({ ouid });
console.log(`${basic.user_name} 마스터리 랭크 ${basic.mastery_rank_level}`);

// 응답의 id는 메타데이터로 이름을 찾는다
const equipped = await client.firstDescendant.user.getDescendant({ ouid });
const descendants = await client.firstDescendant.meta.getDescendant('ko');
const name = descendants.find((d) => d.descendant_id === equipped.descendant_id)?.descendant_name;
```

sub-path로도 가져올 수 있다.

```ts
import type { TfdUserBasic, TfdDescendantMeta } from 'nexon-open-api/first-descendant';
```

> - 게임 데이터 반영: 평균 10분 뒤. 리더보드는 평균 1시간 단위로 갱신
> - 닉네임은 **대소문자를 구분**하고 `#` 뒤 태그까지 포함한다 (`닉네임#1234`)
> - 게임 콘텐츠 변경으로 **ouid가 바뀔 수 있다.** 오래 보관한 ouid는 다시 조회한다
> - 6개월 이상 접속하지 않은 계정은 조회되지 않을 수 있다
> - 계승자·무기·모듈 등 응답의 각종 id는 `meta` 로 해석한다

## 구조와 설계 이유

| 접근 경로                               | 포털 카테고리         | 메서드 수 |
| --------------------------------------- | --------------------- | --------- |
| `client.firstDescendant.getOuid()`      | 계정 정보 조회        | 1         |
| `client.firstDescendant.user`           | 계정 정보 조회        | 6         |
| `client.firstDescendant.meta`           | 메타 데이터 정보 조회 | 32        |
| `client.firstDescendant.recommendation` | 추천 모듈 조회        | 1         |
| `client.firstDescendant.leaderboard`    | 리더보드 정보 조회    | 2         |

- **포털 카테고리 4개 = sub-client 4개.** 42개를 한 클래스에 두면 IntelliSense 목록에서 계정 API 7개가
  메타데이터 32개에 묻힌다. sub-client는 lazy getter라 쓰지 않으면 할당되지 않는다.
- **sub-client 이름은 URL 경로 조각을 따른다** (`/tfd/v1/user/...`, `/static/tfd/meta/...`,
  `/tfd/v1/recommendation/...`, `/tfd/v1/leaderboard/...`). 그래서 메서드 이름에서 컨텍스트를 뺄 수 있다:
  `user.getBasic()` (`getUserBasic` 아님), `leaderboard.getVoidInterceptBattle()`.
- **`getOuid()` 는 루트 메서드다.** 다른 게임의 `getOcid()` / `getOuid()` 와 같은 자리이고, 모든 계정 조회의 출발점이다.
- **`meta` 메서드는 스펙의 파일 이름과 1:1이다** (`descendant.json` → `getDescendant()`,
  `arche-tuning-board-group.json` → `getArcheTuningBoardGroup()`). 응답이 배열이지만 복수형으로 바꾸지 않았다.
  `research`, `stat`, `adapt-level` 처럼 복수형이 어색한 이름이 섞여 있어, 포털 문서의 파일 이름에서 메서드
  이름을 기계적으로 떠올릴 수 있는 쪽을 택했다. `user.getDescendant()` (장착 정보)와 `meta.getDescendant()`
  (메타데이터)는 sub-client가 문맥을 구분한다.
- **`listXxx` 를 쓰지 않았다.** 이 SDK에서 `listXxx` 는 `CursorPage` 를 돌려주는 커서 페이지 API의 이름인데,
  퍼스트 디센던트에는 커서 기반 API가 없다. 메타데이터는 파일 전체를 한 번에 내려준다.
- **언어 코드는 선택 인자이고 기본값은 `'ko'` 다.** 스펙에서는 필수지만 매 호출마다 쓰게 하지 않았다.
  경로에 들어가는 `meta` 는 위치 인자(`getWeapon('en')`), 쿼리로 가는 `user` 는 요청 객체의 `language_code` 다.
- **요청 객체의 필드명은 스펙의 쿼리 파라미터 이름 그대로다** (`descendant_group_id`, `squad_user_count`).
- **리더보드 요청은 유니온 타입이다.** `leaderboard_type: 'Solo'` 면 `descendant_id`, `'Squad'` 면
  `squad_user_count` 만 쓸 수 있고, 섞으면 컴파일 에러가 난다. JavaScript에서 호출해도 요청 전에 걸러진다.
- **ouid는 `TfdOuid` branded type이다.** 닉네임이나 다른 게임의 식별자를 실수로 넘기는 것을 컴파일 타임에 막는다.
  저장해 둔 문자열을 쓸 때는 `value as TfdOuid` 로 단언한다.

## 계정 식별자 조회 (1개)

```ts
const ouid = await client.firstDescendant.getOuid('닉네임#1234');
```

| 메서드              | 설명                   | 경로 (쿼리)                |
| ------------------- | ---------------------- | -------------------------- |
| `getOuid(userName)` | 계정 식별자(ouid) 조회 | `/tfd/v1/id` (`user_name`) |

## 계정 정보 — `user` (6개)

```ts
const user = client.firstDescendant.user;

await user.getBasic({ ouid }); // 기본 정보
await user.getDescendant({ ouid }); // 장착 계승자 (모듈, 커스터마이징)
await user.getWeapon({ ouid, language_code: 'ko' }); // 장착 무기 (모든 슬롯)
await user.getReactor({ ouid, language_code: 'ko' }); // 장착 반응로
await user.getExternalComponent({ ouid, language_code: 'ko' }); // 장착 외장 부품 (모든 슬롯)
await user.getArcheTuning({ ouid, descendant_group_id: '101200001' }); // 아르케 조율
```

| 메서드                              | 설명                | 경로 (쿼리)                                                 |
| ----------------------------------- | ------------------- | ----------------------------------------------------------- |
| `user.getBasic(params)`             | 기본 정보           | `/tfd/v1/user/basic` (`ouid`)                               |
| `user.getDescendant(params)`        | 장착 계승자 정보    | `/tfd/v1/user/descendant` (`ouid`)                          |
| `user.getWeapon(params)`            | 장착 무기 정보      | `/tfd/v1/user/weapon` (`language_code`, `ouid`)             |
| `user.getReactor(params)`           | 장착 반응로 정보    | `/tfd/v1/user/reactor` (`language_code`, `ouid`)            |
| `user.getExternalComponent(params)` | 장착 외장 부품 정보 | `/tfd/v1/user/external-component` (`language_code`, `ouid`) |
| `user.getArcheTuning(params)`       | 아르케 조율 정보    | `/tfd/v1/user/arche-tuning` (`ouid`, `descendant_group_id`) |

- `language_code` 를 생략하면 `'ko'` 다. 랜덤 옵션·코어 옵션의 **이름**이 그 언어로 내려온다.
- `core_unlock_flag` 는 boolean이 아니라 문자열이다 (`"0"`: 잠금, `"1"`: 개방).
- `additional_stat_value`, `core_option_value`, `position_row`, `position_column` 도 숫자가 아닌 문자열이다.
- 장착 모듈·커스터마이징 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
- `descendant_group_id` 는 `meta.getDescendantGroup()` 에서 얻는다.

## 메타데이터 — `meta` (32개)

`https://open.api.nexon.com/static/tfd/meta/...` 의 정적 JSON이다. 응답은 모두 **배열**이다.

```ts
const meta = client.firstDescendant.meta;

const weapons = await meta.getWeapon('en'); // 언어별
const levels = await meta.getDescendantLevelDetail(); // 공통 (언어 인자 없음)

const weaponById = new Map(weapons.map((w) => [w.weapon_id, w]));
```

> 파일 하나가 수백 KB에서 2 MB를 넘는다 (`reactor`, `module`, `weapon`, `customizing-item` 등).
> 호출할 때마다 내려받지 말고 애플리케이션에서 캐시해 둔다.

### 언어 코드

`ko` (기본값), `en`, `de`, `fr`, `ja`, `zh-CN`, `zh-TW`, `it`, `pl`, `pt`, `ru`, `es` — 대소문자를 구분한다.
목록에 없는 값은 요청 전에 `NexonBadRequestError` (`code: 'OPENAPI00004'`)로 거른다. 런타임 목록은 `TFD_LANGUAGE_CODES`, 타입은 `TfdLanguageCode` 다.

### 언어별 (24개)

| 메서드                                      | 설명                           | 경로                                                        |
| ------------------------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `meta.getAcquisitionDetail(languageCode?)`  | 획득처 정보 메타데이터         | `/static/tfd/meta/{language_code}/acquisition-detail.json`  |
| `meta.getArcheTuningNode(languageCode?)`    | 아르케 조율 노드 메타데이터    | `/static/tfd/meta/{language_code}/arche-tuning-node.json`   |
| `meta.getCollectibleItem(languageCode?)`    | 수집형 아이템 메타데이터       | `/static/tfd/meta/{language_code}/collectible-item.json`    |
| `meta.getConsumableMaterial(languageCode?)` | 소비 아이템 메타데이터         | `/static/tfd/meta/{language_code}/consumable-material.json` |
| `meta.getCoreType(languageCode?)`           | 코어 타입 메타데이터           | `/static/tfd/meta/{language_code}/core-type.json`           |
| `meta.getCustomizingItem(languageCode?)`    | 커스터마이징 아이템 메타데이터 | `/static/tfd/meta/{language_code}/customizing-item.json`    |
| `meta.getDescendant(languageCode?)`         | 계승자 메타데이터              | `/static/tfd/meta/{language_code}/descendant.json`          |
| `meta.getDescendantGroup(languageCode?)`    | 계승자 그룹 메타데이터         | `/static/tfd/meta/{language_code}/descendant-group.json`    |
| `meta.getExternalComponent(languageCode?)`  | 외장 부품 메타데이터           | `/static/tfd/meta/{language_code}/external-component.json`  |
| `meta.getFellow(languageCode?)`             | 조력자 메타데이터              | `/static/tfd/meta/{language_code}/fellow.json`              |
| `meta.getMedal(languageCode?)`              | 훈장 메타데이터                | `/static/tfd/meta/{language_code}/medal.json`               |
| `meta.getModule(languageCode?)`             | 모듈 메타데이터                | `/static/tfd/meta/{language_code}/module.json`              |
| `meta.getNodeItem(languageCode?)`           | 변이 세포 메타데이터           | `/static/tfd/meta/{language_code}/node-item.json`           |
| `meta.getNodeSocketType(languageCode?)`     | 변이 세포 소켓 타입 메타데이터 | `/static/tfd/meta/{language_code}/node-socket-type.json`    |
| `meta.getReactor(languageCode?)`            | 반응로 메타데이터              | `/static/tfd/meta/{language_code}/reactor.json`             |
| `meta.getResearch(languageCode?)`           | 연구 정보 메타데이터           | `/static/tfd/meta/{language_code}/research.json`            |
| `meta.getReward(languageCode?)`             | 난이도 보상 메타데이터         | `/static/tfd/meta/{language_code}/reward.json`              |
| `meta.getStat(languageCode?)`               | 기본 스탯 메타데이터           | `/static/tfd/meta/{language_code}/stat.json`                |
| `meta.getTier(languageCode?)`               | 등급 메타데이터                | `/static/tfd/meta/{language_code}/tier.json`                |
| `meta.getTitle(languageCode?)`              | 타이틀 메타데이터              | `/static/tfd/meta/{language_code}/title.json`               |
| `meta.getVehicle(languageCode?)`            | 탈것 메타데이터                | `/static/tfd/meta/{language_code}/vehicle.json`             |
| `meta.getVoidBattle(languageCode?)`         | 보이드 요격전 메타데이터       | `/static/tfd/meta/{language_code}/void-battle.json`         |
| `meta.getWeapon(languageCode?)`             | 무기 메타데이터                | `/static/tfd/meta/{language_code}/weapon.json`              |
| `meta.getWeaponType(languageCode?)`         | 무기 유형 메타데이터           | `/static/tfd/meta/{language_code}/weapon-type.json`         |

### 공통 (8개)

| 메서드                             | 설명                              | 경로                                              |
| ---------------------------------- | --------------------------------- | ------------------------------------------------- |
| `meta.getAdaptLevel()`             | 적응도 레벨 메타데이터            | `/static/tfd/meta/adapt-level.json`               |
| `meta.getAmorphousReward()`        | 비정형 물질 오픈 보상 메타데이터  | `/static/tfd/meta/amorphous-reward.json`          |
| `meta.getArcheTuningBoard()`       | 아르케 조율 보드 메타데이터       | `/static/tfd/meta/arche-tuning-board.json`        |
| `meta.getArcheTuningBoardGroup()`  | 아르케 조율 보드 그룹 메타데이터  | `/static/tfd/meta/arche-tuning-board-group.json`  |
| `meta.getCoreSlot()`               | 코어 슬롯 메타데이터              | `/static/tfd/meta/core-slot.json`                 |
| `meta.getDescendantLevelDetail()`  | 계승자 레벨별 경험치 메타데이터   | `/static/tfd/meta/descendant-level-detail.json`   |
| `meta.getFellowLevelDetail()`      | 조력자 레벨별 경험치 메타데이터   | `/static/tfd/meta/fellow-level-detail.json`       |
| `meta.getMasteryRankLevelDetail()` | 마스터리 랭크별 경험치 메타데이터 | `/static/tfd/meta/mastery-rank-level-detail.json` |

### 스펙과 실데이터가 다른 곳

메타데이터 타입은 포털 스펙과 실제 응답(2026-11-24, `ko`)을 대조해 만들었고, 다르면 실데이터를 따랐다.

| 메타데이터                  | 스펙                                           | 실데이터 (SDK 타입)                                       |
| --------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `mastery-rank-level-detail` | `mastery_rank_level`                           | `mastery_level` (`mastery_rank_level` 은 optional로 남김) |
| `core-type`                 | `core_option[].available_item_option`          | `core_option[].detail[].available_item_option`            |
| `core-type`                 | `available_item_option[].option_grade`: string | number                                                    |
| `fellow`                    | `fellow_detail[].stat_effect[].operator_type`  | 필드 없음 (optional로 남김)                               |

스펙은 nullable을 표시하지 않지만 실데이터에는 `null` 이 있다. 관측된 필드는 타입에 `| null` 로 반영했다
(예: `weapon_perk_ability_name`, `module_type`, `arche_type`, `image_url`).

## 추천 모듈 — `recommendation` (1개)

```ts
const result = await client.firstDescendant.recommendation.getModule({
  descendant_id: '101000001', // meta.getDescendant()
  weapon_id: '211011001', // meta.getWeapon()
  void_battle_id: '651000001', // meta.getVoidBattle()
  period: '1',
});

const moduleIds = result.descendant.recommendation.map((item) => item.module_id);
```

| 메서드                             | 설명      | 경로 (쿼리)                                                                                |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `recommendation.getModule(params)` | 모듈 추천 | `/tfd/v1/recommendation/module` (`descendant_id`, `weapon_id`, `void_battle_id`, `period`) |

`period` 값 (숫자가 아닌 문자열):

| 값    | 설명      |
| ----- | --------- |
| `"0"` | 최근 7일  |
| `"1"` | 최근 30일 |
| `"2"` | 전체      |

보이드 요격전 성공 기록을 바탕으로 하므로, 조건에 맞는 기록이 부족하면 추천이 비어 있을 수 있다.

## 리더보드 — `leaderboard` (2개)

```ts
const leaderboard = client.firstDescendant.leaderboard;

// 솔로: 계승자별
const solo = await leaderboard.getVoidInterceptBattle({
  leaderboard_type: 'Solo',
  descendant_id: '101000001',
});

// 스쿼드: 인원 수별
const squad = await leaderboard.getVoidErosionPurgeChallenge({
  leaderboard_type: 'Squad',
  squad_user_count: 4,
  platform_type: 'Pc',
});

for (const entry of solo.leaderboard ?? []) {
  console.log(entry.ranking, entry.score, entry.member[0]?.user_name);
}
```

| 메서드                                             | 설명                             | 경로                                               |
| -------------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| `leaderboard.getVoidInterceptBattle(params)`       | 보이드 요격전 리더보드           | `/tfd/v1/leaderboard/void-intercept-battle`        |
| `leaderboard.getVoidErosionPurgeChallenge(params)` | 보이드 침식 정화 - 도전 리더보드 | `/tfd/v1/leaderboard/void-erosion-purge-challenge` |

| 파라미터           | 값                                               | 비고                                   |
| ------------------ | ------------------------------------------------ | -------------------------------------- |
| `leaderboard_type` | `'Solo'` \| `'Squad'`                            | 필수                                   |
| `descendant_id`    | 계승자 식별자                                    | `'Solo'` 일 때만                       |
| `squad_user_count` | `2` \| `3` \| `4`                                | `'Squad'` 일 때만                      |
| `platform_type`    | `'All'` \| `'Pc'` \| `'PlayStation'` \| `'Xbox'` | 생략하면 `'All'`                       |
| `contents_type`    | `'RiskMode'`                                     | 보이드 요격전만. 생략하면 `'RiskMode'` |

- 보이드 요격전의 `leaderboard` 는 `null` 일 수 있다 (`?? []` 로 처리). `ranking`, `score` 와 멤버 필드도 nullable이다.
- `score` (클리어 타임)와 `stage` 는 숫자가 아닌 문자열이다.

## 에러 처리

```ts
import { NexonError, NexonAuthError, NexonRateLimitError } from 'nexon-open-api';

try {
  const ouid = await client.firstDescendant.getOuid('닉네임#1234');
} catch (err) {
  if (err instanceof NexonRateLimitError) {
    // 429 — SDK가 자동 재시도한 뒤에도 실패
  } else if (err instanceof NexonAuthError) {
    // OPENAPI00002·00005 — API 키 확인 (퍼스트 디센던트용 키여야 한다)
  } else if (err instanceof NexonError) {
    console.error(err.message);
  }
}
```

다음 입력은 요청 전에 검증한다. 검증에 실패하면 `NexonBadRequestError` (`code: 'OPENAPI00004'`)가 발생하고 메시지에 고치는 방법이 들어 있다.

- 빈 `userName`, `ouid`, `descendant_group_id`, `descendant_id`, `weapon_id`, `void_battle_id`
- 지원 목록에 없는 언어 코드
- `'0'` · `'1'` · `'2'` 가 아닌 `period`
- 리더보드의 모순된 조건 (`'Solo'` + `squad_user_count`, `'Squad'` + `descendant_id`), 범위 밖 값

## 검증 상태

- 메타데이터 32개: 실제 응답으로 타입과 fixture를 확인했다 (2026-11-24, 키 불필요).
- 계정·추천 모듈·리더보드 10개: 포털 스펙 기준이며 실 API 키로는 검증하지 못했다.
- E2E 스크립트: `scripts/test-first-descendant.ts` (`NEXON_TFD_API_KEY`, `TFD_USER_NAME`). 키가 없으면 메타데이터만 확인한다.
