# 메이플스토리 장비 분석 도구 — 환산 계산기의 재료 모으기

> [레시피 목록](./README.md) · [메이플스토리 문서](../maplestory.md)

환산 주스탯 계산기, 스펙 비교 사이트, "보스 데미지 몇 퍼센트인지" 알려 주는 디스코드 봇은 모두 같은 재료에서 출발합니다. **장비창의 스타포스, 장비 옵션, 잠재능력, 에디셔널 잠재능력**입니다. 이 레시피는 그 재료를 계산하기 좋은 숫자로 모으는 데까지 다룹니다.

## 장비창 ↔ SDK 대응표

장비 한 개는 `character.getItemEquipment({ ocid })` 응답의 `item_equipment[]` 원소입니다.

| 장비창에서 보이는 것            | SDK 필드                            | 값의 모양                                        | 숫자로 바꾸는 도우미                                    |
| ------------------------------- | ----------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| 장착 위치 (반지1, 모자 …)       | `item_equipment_slot`               | 문자열. `item_equipment_part` 는 장비 종류       | —                                                       |
| 스타포스 별 개수                | `starforce`                         | `"22"` (문자열)                                  | `getItemStarforce(item)`                                |
| 최종 옵션 (괄호 밖의 합계 수치) | `item_total_option`                 | `{ str: "150", attack_power: "85", … }` (문자열) | `sumItemTotalOptions(items)`                            |
| 기본 옵션                       | `item_base_option`                  | 위와 같음                                        | `sumItemTotalOptions(items, 'item_base_option')`        |
| 추가 옵션 (환생의 불꽃)         | `item_add_option`                   | 위와 같음                                        | `sumItemTotalOptions(items, 'item_add_option')`         |
| 주문서 강화 옵션                | `item_etc_option`                   | 위와 같음                                        | `sumItemTotalOptions(items, 'item_etc_option')`         |
| 스타포스 강화 옵션              | `item_starforce_option`             | 위와 같음                                        | `sumItemTotalOptions(items, 'item_starforce_option')`   |
| 익셉셔널 강화 옵션              | `item_exceptional_option`           | 위와 같음                                        | `sumItemTotalOptions(items, 'item_exceptional_option')` |
| 잠재능력 등급                   | `potential_option_grade`            | `"레전드리"`, 없으면 `null`                      | —                                                       |
| 잠재능력 3줄                    | `potential_option_1`~`3`            | `"STR +12%"`, 없으면 `null`                      | `parseItemOption(text)`, `summarizeItemOptions(items)`  |
| 에디셔널 잠재능력 3줄           | `additional_potential_option_1`~`3` | `"공격력 +12%"`, 없으면 `null`                   | 위와 같음                                               |
| 소울                            | `soul_name`, `soul_option`          | 문자열, 없으면 `null`                            | —                                                       |

- 장비 프리셋 1~3번은 `item_equipment_preset_1`~`3` 에 같은 모양으로 들어 있습니다. 도우미에 그대로 넣을 수 있습니다.
- 최종 옵션(`item_total_option`)에는 잠재능력이 들어 있지 않습니다. 잠재능력은 따로 합산합니다.

## 잠재능력 한 줄 읽기 — `parseItemOption()`

잠재능력은 `"STR +12%"` 같은 문장으로 옵니다. 계산하려면 이름과 수치를 나눠야 합니다.

```js
import { parseItemOption } from 'nexon-open-api';

console.log(parseItemOption('보스 몬스터 데미지 +40%'));
// { kind: 'stat', raw: '보스 몬스터 데미지 +40%', name: '보스 몬스터 데미지', value: 40, unit: '%' }

console.log(parseItemOption('스킬 재사용 대기시간 -2초'));
// { kind: 'stat', raw: '스킬 재사용 대기시간 -2초', name: '스킬 재사용 대기시간', value: -2, unit: '초' }

console.log(parseItemOption('캐릭터 기준 9레벨 당 STR +2'));
// { kind: 'stat', raw: '캐릭터 기준 9레벨 당 STR +2', name: 'STR', value: 2, unit: '', perLevel: 9 }

console.log(parseItemOption('피격 시 10% 확률로 데미지의 20% 무시'));
// { kind: 'effect', raw: '피격 시 10% 확률로 데미지의 20% 무시', name: undefined, value: undefined, unit: undefined }

console.log(parseItemOption(null));
// null — 잠재능력이 없는 칸
```

| `kind`      | 뜻                                                        | 예                             |
| ----------- | --------------------------------------------------------- | ------------------------------ |
| `'stat'`    | "옵션명 + 수치" 꼴. `name`, `value`, `unit` 이 채워집니다 | `STR +12%`, `방어력 +125`      |
| `'effect'`  | 확률로 발동하는 문장형 효과. 원문(`raw`)만 남깁니다       | `공격 시 7% 확률로 오토스틸`   |
| `'unknown'` | SDK가 모르는 표기. 원문(`raw`)만 남깁니다                 | 게임 업데이트로 새로 생긴 옵션 |

- `unit` 은 `'%'`, `'초'`, 또는 단위가 없을 때 `''` 입니다. `STR +12%` 와 `STR +18` 은 다른 옵션이므로 반드시 `unit` 까지 보고 구분하세요.
- 레벨 비례 옵션은 `perLevel` 이 붙습니다. 250레벨 캐릭터의 `캐릭터 기준 9레벨 당 STR +2` 는 `Math.floor(250 / 9) * 2` 로 계산합니다.
- 모르는 표기가 와도 예외가 나지 않습니다. 새 옵션이 생긴 날에도 앱이 멈추지 않고, `raw` 를 그대로 화면에 보여 줄 수 있습니다.

## 완성 예제: 한 캐릭터의 옵션 합계

`calculator.mjs` 로 저장하고, 같은 폴더의 `.env` 에 `NEXON_API_KEY=발급받은키` 를 적은 뒤 `node --env-file=.env calculator.mjs "캐릭터명"` 으로 실행합니다.

```js
import {
  NexonClient,
  NexonNotFoundError,
  getItemStarforce,
  sumItemTotalOptions,
  summarizeItemOptions,
} from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
const characterName = process.argv[2];
if (!apiKey || !characterName) {
  console.error(
    '사용법: node --env-file=.env calculator.mjs "캐릭터명" (.env 에 NEXON_API_KEY 필요)',
  );
  process.exit(1);
}

const client = new NexonClient({ apiKey });

try {
  // 넥슨 서버 호출은 2번. 합산은 받은 응답 안에서 끝난다
  const ocid = await client.maplestory.getOcid(characterName);
  const equip = await client.maplestory.character.getItemEquipment({ ocid });
  const items = equip.item_equipment;

  // 1. 스타포스 — "22" 같은 문자열을 숫자로 바꿔 더한다
  const stars = items.reduce((sum, item) => sum + getItemStarforce(item), 0);
  console.log(`장착 장비 ${items.length}개 · 스타포스 합계 ${stars}성`);

  // 2. 장비 옵션 합계 (잠재능력 제외)
  const total = sumItemTotalOptions(items);
  const flame = sumItemTotalOptions(items, 'item_add_option');
  console.log(`STR ${total.str} · 공격력 ${total.attack_power} · 올스탯 ${total.all_stat}%`);
  console.log(`보스 데미지 ${total.boss_damage}% · 그중 추가 옵션 올스탯 ${flame.all_stat}%`);

  // 3. 잠재능력·에디셔널 잠재능력 합계
  const { potential, additional, leftovers } = summarizeItemOptions(items);
  const label = (o) => `${o.perLevel ? `${o.perLevel}레벨 당 ` : ''}${o.name} ${o.total}${o.unit}`;
  for (const o of potential) console.log(`잠재능력 ${label(o)}`);
  for (const o of additional) console.log(`에디셔널 ${label(o)}`);

  // 4. 원하는 옵션 하나만 꺼내기 — 이름과 단위로 찾는다
  const strPercent = potential.find((o) => o.name === 'STR' && o.unit === '%' && !o.perLevel);
  console.log(`잠재능력 STR% 합계: ${strPercent?.total ?? 0}%`);

  // 5. 수치로 합칠 수 없는 줄도 버리지 않는다
  for (const { item_name, raw } of leftovers) console.log(`(합산 제외) ${item_name}: ${raw}`);

  console.log('Data based on NEXON Open API');
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.error('그런 캐릭터가 없습니다. 이름을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
// 출력 예시
// 장착 장비 24개 · 스타포스 합계 330성
// STR 2150 · 공격력 1850 · 올스탯 96%
// 보스 데미지 60% · 그중 추가 옵션 올스탯 78%
// 잠재능력 STR 285%
// 잠재능력 9레벨 당 STR 4
// 잠재능력 보스 몬스터 데미지 110%
// 잠재능력 몬스터 방어율 무시 70%
// 에디셔널 공격력 36%
// 에디셔널 공격력 25
// 잠재능력 STR% 합계: 285%
// (합산 제외) 장갑 이름: 공격 시 7% 확률로 오토스틸
// Data based on NEXON Open API
```

같은 내용을 바로 실행할 수 있는 파일은 [examples/maplestory-equipment-summary.mjs](../../examples/maplestory-equipment-summary.mjs)입니다.

### 합계를 읽을 때 주의할 점

- **`total` 은 단순 합입니다.** 몬스터 방어율 무시는 게임에서 단순 합으로 적용되지 않습니다. 이런 옵션은 합치기 전 수치 목록 `values` (예: `[40, 30]`)로 직접 계산하세요. `sumItemTotalOptions()` 의 `ignore_monster_armor` 도 같은 이유로 표시용 값입니다.
- **같은 이름이라도 단위가 다르면 다른 줄입니다.** `STR %`, `STR`(고정 수치), `9레벨 당 STR` 은 각각 따로 합산됩니다.
- **장착 중인 장비만 셉니다.** 칭호(`title`), 펫 장비, 심볼, 세트 효과는 다른 응답에 있습니다 (아래 "재료를 더 모으려면").

## 환산 공식은 왜 SDK에 없나요

환산 주스탯은 "보스 데미지 1%가 주스탯 몇에 해당하는가" 처럼 **만드는 사람이 정한 가정**으로 계산합니다. 직업, 무기, 기준 스펙에 따라 계수가 달라지고 커뮤니티와 사이트마다 공식이 다르며, 게임 패치로 바뀌기도 합니다. SDK가 한 가지 공식을 넣으면 다른 사이트의 수치와 맞지 않는 값이 "공식 값"처럼 보이게 됩니다.

그래서 SDK는 공식이 달라도 변하지 않는 부분만 맡습니다.

- 넥슨이 준 문자열을 정확한 숫자로 바꾸기
- 같은 옵션끼리 빠짐없이 모으기
- 계산에 넣지 못한 줄을 숨기지 않고 알려 주기

공식은 이 숫자들 위에 직접 얹으세요.

## 재료를 더 모으려면

환산 계산기는 장비 말고도 여러 정보를 씁니다. 아래는 자주 쓰는 재료와 조회 메서드입니다 (`client.maplestory.` 생략).

| 재료                        | SDK 메서드                               |
| --------------------------- | ---------------------------------------- |
| 캐릭터 정보창의 스탯·전투력 | `character.getStat({ ocid })`            |
| 심볼 (아케인·어센틱)        | `character.getSymbolEquipment({ ocid })` |
| 세트 효과                   | `character.getSetEffect({ ocid })`       |
| 하이퍼 스탯                 | `character.getHyperStat({ ocid })`       |
| 어빌리티                    | `character.getAbility({ ocid })`         |
| 링크 스킬                   | `character.getLinkSkill({ ocid })`       |
| HEXA 스탯                   | `character.getHexaMatrixStat({ ocid })`  |
| 유니온 공격대 (점령 효과)   | `union.getRaider({ ocid })`              |
| 유니온 아티팩트             | `union.getArtifact({ ocid })`            |

## 호출 수를 먼저 세고 시작하기

개발 단계 키의 한도는 **1초에 5건, 하루 1,000건**입니다(넥슨 안내, 2026-11-24). 서비스 단계 키는 1초에 500건, 하루 20,000,000건입니다.

| 화면                            | 넥슨 서버 호출 수                  | 개발 단계 키로 하루에 볼 수 있는 캐릭터 |
| ------------------------------- | ---------------------------------- | --------------------------------------- |
| 장비 옵션 합계만 (위 완성 예제) | 2 (고유 번호 1 + 장비 1)           | 500명                                   |
| 위 표의 재료 9종까지 모두       | 11 (고유 번호 1 + 장비 1 + 재료 9) | 약 90명                                 |

도우미 함수(`parseItemOption`, `summarizeItemOptions`, `sumItemTotalOptions`, `getItemStarforce`)는 서버를 부르지 않으므로 호출 수에 들어가지 않습니다. 프리셋 1~3번도 장비 응답 한 번에 함께 오므로, 프리셋끼리 비교하는 데 호출이 더 들지 않습니다.

### 한도에 맞게 설계하기

- **캐시를 먼저 만듭니다.** 메이플스토리 데이터는 게임에서 바뀐 뒤 평균 15분 뒤에 조회되므로, 같은 캐릭터를 15분 안에 다시 조회해도 대부분 같은 답이 옵니다.
- **한꺼번에 5건 넘게 부르지 않습니다.** 재료 11종을 `Promise.all` 하나로 부르면 1초 한도를 넘습니다. 아래 예제처럼 몇 개씩 나눠 부릅니다.
- **없는 캐릭터는 다시 조회하지 않습니다.** `NexonNotFoundError` 는 다시 불러도 결과가 같습니다. 호출량 초과는 SDK가 간격을 두고 자동으로 다시 시도한 뒤에도 실패할 때만 `NexonRateLimitError` 로 알려 줍니다.
- **캐릭터 고유 번호(OCID)를 드러내지 않습니다.** 캐시 키, 파일 이름, 로그, 웹페이지 주소에 OCID 원문을 넣지 않습니다. 아래 예제는 캐릭터 이름을 캐시 키로 씁니다.
- **파일이나 DB에 오래 저장한다면 받은 시각을 함께 남기고 30일 안에 다시 받습니다** (넥슨의 데이터 갱신 의무).

```js
import { NexonClient, summarizeItemOptions, sumItemTotalOptions } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

const cache = new Map();
const CACHE_MS = 15 * 60 * 1000; // 게임 데이터가 평균 15분 뒤에 반영된다

/** 캐릭터 한 명의 계산 재료. 15분 안에 다시 물으면 넥슨에 다시 묻지 않는다 */
async function getMaterials(characterName) {
  const saved = cache.get(characterName);
  if (saved && Date.now() - saved.savedAt < CACHE_MS) return saved.materials;

  const ocid = await client.maplestory.getOcid(characterName);

  // 1초에 5건을 넘지 않게 두 묶음으로 나눠 부른다
  const [equip, stat, symbol, setEffect] = await Promise.all([
    client.maplestory.character.getItemEquipment({ ocid }),
    client.maplestory.character.getStat({ ocid }),
    client.maplestory.character.getSymbolEquipment({ ocid }),
    client.maplestory.character.getSetEffect({ ocid }),
  ]);
  const [hyperStat, ability, raider] = await Promise.all([
    client.maplestory.character.getHyperStat({ ocid }),
    client.maplestory.character.getAbility({ ocid }),
    client.maplestory.union.getRaider({ ocid }),
  ]);

  const materials = {
    equipmentTotal: sumItemTotalOptions(equip.item_equipment),
    potential: summarizeItemOptions(equip.item_equipment),
    stat,
    symbol,
    setEffect,
    hyperStat,
    ability,
    raider,
  };
  cache.set(characterName, { materials, savedAt: Date.now() });
  return materials;
}

const materials = await getMaterials('캐릭터명');
console.log(`장비 공격력 ${materials.equipmentTotal.attack_power}`);
console.log('Data based on NEXON Open API');
```

## 참고

- 장비 응답의 모든 필드: [메이플스토리 문서 — 장비·스타포스·잠재능력](../maplestory.md#장비스타포스잠재능력)
- 에러와 호출 한도: [FAQ](../faq.md)
- 다른 레시피: [코디 카드 만들기](./maplestory-coordi-card.md)
