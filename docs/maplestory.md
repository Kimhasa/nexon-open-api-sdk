# 메이플스토리 API 레퍼런스

> SDK 지원 API 56개 — `client.maplestory`
>
> 개수 기준: SDK public API 메서드 수 (메서드 1개 = 넥슨 API 경로 1개). 넥슨 포털 기준 56개를 모두 지원합니다 (2026-11-24 포털 스펙 대조).

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

const ocid = await client.maplestory.getOcid('캐릭터명');
const basic = await client.maplestory.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

> - 타임존: **UTC+9 (KST)**
> - 게임 데이터 반영: 평균 15분 소요
> - `date` 를 생략하면 전일 데이터를 반환합니다 (스케줄러는 오늘 날짜).

## 카테고리 요약

| 카테고리    | 접근 경로                          | 메서드 수 |
| ----------- | ---------------------------------- | --------- |
| 식별자·계정 | `client.maplestory`                | 4         |
| 캐릭터      | `client.maplestory.character`      | 23        |
| 유니온      | `client.maplestory.union`          | 4         |
| 길드        | `client.maplestory.guild`          | 2         |
| 확률/이력   | `client.maplestory.history`        | 4         |
| 랭킹        | `client.maplestory.ranking`        | 6         |
| 공지사항    | `client.maplestory.notice`         | 8         |
| 연무장      | `client.maplestory.battlePractice` | 4         |
| 스케줄러    | `client.maplestory.scheduler`      | 1         |
| **합계**    |                                    | **56**    |

## 식별자·계정 (4개)

| 메서드                        | 경로                                  | 설명                         |
| ----------------------------- | ------------------------------------- | ---------------------------- |
| `getOcid(characterName)`      | `GET /maplestory/v1/id`               | 캐릭터 식별자 (OCID)         |
| `getOuid()`                   | `GET /maplestory/v1/ouid`             | 계정 식별자                  |
| `getLegacyOuid(legacyApiKey)` | `GET /maplestory/legacy/ouid`         | 구 API 키로 계정 식별자 조회 |
| `getAchievement()`            | `GET /maplestory/v1/user/achievement` | 계정 업적                    |

```ts
await client.maplestory.getOcid('캐릭터명'); // 캐릭터 식별자 (OCID)
await client.maplestory.getOuid(); // 계정 식별자
await client.maplestory.getLegacyOuid('LEGACY_API_KEY'); // 구 개발자센터 키의 계정 식별자
await client.maplestory.getAchievement(); // 계정 업적
```

### `getOuid` 와 `getLegacyOuid`

두 메서드 모두 `{ ouid }` 를 받아 문자열로 반환하지만 인증 방식이 다릅니다.

| 메서드          | 인증 헤더                 | 사용하는 키                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `getOuid`       | `x-nxopen-api-key`        | `new NexonClient({ apiKey })` 의 현재 포털 키 |
| `getLegacyOuid` | `x-nxopen-legacy-api-key` | 인자로 넘긴 구 개발자센터 API 키              |

`timeoutMs`·`maxRetries`·`logger`·인터셉터 등 `NexonClient` 설정은 두 메서드에 똑같이 적용됩니다.

## 캐릭터 (23개)

```ts
const char = client.maplestory.character;

await char.getList(); // 계정 캐릭터 목록
await char.getBasic({ ocid }); // 기본 정보
await char.getPopularity({ ocid }); // 인기도
await char.getStat({ ocid }); // 종합 능력치
await char.getHyperStat({ ocid }); // 하이퍼스탯
await char.getPropensity({ ocid }); // 성향
await char.getAbility({ ocid }); // 어빌리티
await char.getItemEquipment({ ocid }); // 장착 장비
await char.getCashItemEquipment({ ocid }); // 캐시 장비
await char.getSymbolEquipment({ ocid }); // 심볼
await char.getSetEffect({ ocid }); // 세트 효과
await char.getBeautyEquipment({ ocid }); // 헤어/성형/피부
await char.getAndroidEquipment({ ocid }); // 안드로이드
await char.getPetEquipment({ ocid }); // 펫 장비
await char.getSkill({ ocid, character_skill_grade: '6' }); // 스킬
await char.getLinkSkill({ ocid }); // 링크 스킬
await char.getVMatrix({ ocid }); // V매트릭스
await char.getHexaMatrix({ ocid }); // HEXA 매트릭스
await char.getHexaMatrixStat({ ocid }); // HEXA 스탯
await char.getDojang({ ocid }); // 무릉도장
await char.getOtherStat({ ocid }); // 기타 능력치
await char.getRingExchangeSkillEquipment({ ocid }); // 링 익스체인지
await char.getRingReserveSkillEquipment({ ocid }); // 예비 특수 반지
```

`getList()` 를 뺀 모든 메서드는 `{ ocid, date? }` 를 받습니다. `getSkill` 은 `character_skill_grade` 가 추가로 필요합니다
(`'0'` `'1'` `'1.5'` `'2'` `'2.5'` `'3'` `'4'` `'hyperpassive'` `'hyperactive'` `'5'` `'6'`).

## 유니온 (4개)

```ts
const union = client.maplestory.union;

await union.getUnion({ ocid }); // 유니온 레벨/등급
await union.getRaider({ ocid }); // 공격대원 효과
await union.getArtifact({ ocid }); // 아티팩트
await union.getChampion({ ocid }); // 챔피언
```

## 길드 (2개)

```ts
const guild = client.maplestory.guild;

const guildId = await guild.getId('길드명', '스카니아');
await guild.getBasic({ oguild_id: guildId });
```

## 확률/이력 (4개)

```ts
const history = client.maplestory.history;

await history.getStarforce({ count: 100, date: '2026-11-01' }); // 스타포스
await history.getPotential({ count: 100, date: '2026-11-01' }); // 잠재능력 재설정
await history.getCube({ count: 100, date: '2026-11-01' }); // 큐브
await history.getSoulPotential({ count: 100, date: '2026-11-01' }); // 소울 잠재능력 재설정
```

커서 기반 단일 페이지 조회입니다. `count` 는 10~1000이고, `date` 와 `cursor` 중 1개 이상이 필요합니다.

```ts
const first = await history.getSoulPotential({ count: 100, date: '2026-11-01' });
if (first.next_cursor) {
  const next = await history.getSoulPotential({ count: 100, cursor: first.next_cursor });
}
```

## 랭킹 (6개)

```ts
const ranking = client.maplestory.ranking;

await ranking.getOverall({ date: '2026-11-01' }); // 종합 랭킹
await ranking.getUnion({ date: '2026-11-01' }); // 유니온 랭킹
await ranking.getGuild({ date: '2026-11-01', ranking_type: 0 }); // 길드 랭킹 (0: 주간 명성치, 1: 플래그 레이스, 2: 지하 수로)
await ranking.getDojang({ date: '2026-11-01', difficulty: 1 }); // 무릉도장 랭킹 (0: 일반, 1: 통달)
await ranking.getTheSeed({ date: '2026-11-01' }); // 더 시드 랭킹
await ranking.getAchievement({ date: '2026-11-01' }); // 업적 랭킹
```

## 공지사항 (8개)

```ts
const notice = client.maplestory.notice;

await notice.getList(); // 공지 목록
await notice.getDetail(12345); // 공지 상세
await notice.getUpdateList(); // 업데이트 목록
await notice.getUpdateDetail(12345); // 업데이트 상세
await notice.getEventList(); // 이벤트 목록
await notice.getEventDetail(12345); // 이벤트 상세
await notice.getCashshopList(); // 캐시샵 목록
await notice.getCashshopDetail(12345); // 캐시샵 상세
```

## 연무장 (4개)

| 메서드                                      | 경로                                                | 설명                    |
| ------------------------------------------- | --------------------------------------------------- | ----------------------- |
| `getReplayId({ ocid })`                     | `GET /maplestory/v1/battle-practice/replay-id`      | 리플레이 식별자 목록    |
| `getResult({ replay_id })`                  | `GET /maplestory/v1/battle-practice/result`         | 측정 결과               |
| `getSkillTimeline({ replay_id, page_no? })` | `GET /maplestory/v1/battle-practice/skill-timeline` | 스킬 사용 내역 (페이지) |
| `getCharacterInfo({ replay_id })`           | `GET /maplestory/v1/battle-practice/character-info` | 측정 당시 캐릭터 정보   |

리플레이를 등록한 캐릭터만 조회할 수 있습니다. 먼저 `replay_id` 를 얻고, 그 값으로 나머지 3개를 호출합니다.

```ts
const bp = client.maplestory.battlePractice;

const { replay_list } = await bp.getReplayId({ ocid });
const replayId = replay_list[0]?.replay_id;

if (replayId) {
  const result = await bp.getResult({ replay_id: replayId });
  console.log(`총 데미지 ${result.total_damage}, DPS ${result.total_dps}`);

  // 페이지 번호 기반 단일 페이지 조회 (1부터 시작)
  const first = await bp.getSkillTimeline({ replay_id: replayId });
  for (let page = 2; page <= first.total_page_no; page++) {
    await bp.getSkillTimeline({ replay_id: replayId, page_no: page });
  }

  const info = await bp.getCharacterInfo({ replay_id: replayId });
  console.log(info.basic_object.character_name);
}
```

`getCharacterInfo` 응답의 최상위 키는 모두 `*_object` 래퍼입니다 (`basic_object`, `stat_object`, `item_object`, `pet_object`, `hexa_matrix_object` 등 17개).
장비의 주문서 잔여 횟수 필드는 캐릭터 API(`scroll_upgradable_count`)와 달리 `scroll_upgrade_able_count` 입니다.

## 스케줄러 (1개)

| 메서드                               | 경로                                           | 설명                                 |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------ |
| `getCharacterState({ ocid, date? })` | `GET /maplestory/v1/scheduler/character-state` | 일일·주간·보스 콘텐츠 수행 현황 조회 |

```ts
const state = await client.maplestory.scheduler.getCharacterState({ ocid });

console.log(`주간 보스 ${state.weekly_boss_clear_count}/${state.weekly_boss_clear_limit_count}`);
for (const boss of state.boss_contents) {
  // registration_flag, complete_flag 는 boolean이 아닌 문자열 "true" | "false"
  if (boss.complete_flag === 'true') console.log(`${boss.difficulty} ${boss.content_name}`);
}
```

- 자신의 계정에 속한 캐릭터만 조회할 수 있습니다.
- `date` 생략 시 오늘 날짜이며, 조회 요청일 기준 최대 14일 전까지 조회할 수 있습니다.
- 캐릭터가 기준일에 접속하지 않았다면 응답 결과가 없을 수 있습니다.

## 입력 검증

0.2.0에서 추가된 메서드와 `getOcid` 는 필수 값이 비어 있으면 요청을 보내지 않고 `NexonBadRequestError` (`code: 'OPENAPI00004'`) 를 던집니다.

| 메서드                                                                  | 검증 내용                                    |
| ----------------------------------------------------------------------- | -------------------------------------------- |
| `getOcid`, `getLegacyOuid`                                              | 빈 문자열 인자                               |
| `character.getRingReserveSkillEquipment`, `scheduler.getCharacterState` | 빈 `ocid`                                    |
| `battlePractice.getReplayId`                                            | 빈 `ocid`                                    |
| `battlePractice.getResult` / `getSkillTimeline` / `getCharacterInfo`    | 빈 `replay_id`, `page_no` 는 1 이상의 정수   |
| `history.getSoulPotential`                                              | `count` 10~1000 정수, `date`·`cursor` 중 1개 |

## 포털 스펙 대비 알려진 차이

- `character.getItemEquipment`의 `dragon_equipment`·`mechanic_equipment`는 직업 전용 장비 타입을 사용합니다. 잠재능력 등급·옵션, 소울 잠재능력 필드와 `item_exceptional_option.exceptional_upgrade`는 optional이며 deprecated로 표시합니다. 연무장 드래곤·메카닉 장비의 `exceptional_upgrade`도 같은 규칙을 따릅니다.
- `CashItemEquipmentItem.cash_item_skills` 는 포털 스펙에서 사라져 `@deprecated` + optional 이 됐습니다. `skills` 를 사용하세요.
- `ranking.getGuild`에서 지원이 종료된 `ocid`를 넘기면 한 번 경고하고 해당 값을 요청에서 제외합니다. 특정 길드는 `guild_name`으로 조회하세요.
