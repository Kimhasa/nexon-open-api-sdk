# 메이플스토리 코디 카드 만들기

> [레시피 목록](./README.md) · [메이플스토리 문서](../maplestory.md)

캐릭터의 외형 이미지와 입고 있는 캐시 장비, 헤어·성형·피부, 안드로이드를 한 장에 모아 보여 주는 **코디 카드**를 만듭니다. 코디 공유 사이트, 디스코드 봇의 `!코디 캐릭터명`, 길드 홈페이지의 길드원 프로필에 씁니다.

## 코디 카드 ↔ SDK 대응표

`client.maplestory.`는 생략했습니다.

| 카드에 넣는 것                         | SDK 메서드                                 | 주요 응답 필드                                                                               |
| -------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 캐릭터 외형 이미지                     | `character.getBasic({ ocid })`             | `character_image` (이미지 주소)                                                              |
| 외형 이미지의 동작·표정·무기 모션 변경 | `characterImageUrl(주소, 설정)`            | API 호출 없이 이미지 주소 생성                                                               |
| 장착 중인 캐시 장비                    | `character.getCashItemEquipment({ ocid })` | `cash_item_equipment_base[]` (`cash_item_equipment_slot`, `cash_item_name`)                  |
| 코디 프리셋 1~3번                      | 위와 같음                                  | `cash_item_equipment_preset_1`~`3`, `preset_no` (적용 중인 프리셋 번호)                      |
| 컬러링프리즘                           | 위와 같음                                  | `cash_item_coloring_prism` (`color_range`, `hue`, `saturation`, `value`)                     |
| 헤어·성형·피부와 색                    | `character.getBeautyEquipment({ ocid })`   | `character_hair`, `character_face` (`base_color`, `mix_color`, `mix_rate`), `character_skin` |
| 안드로이드                             | `character.getAndroidEquipment({ ocid })`  | `android_name`, `android_hair`, `android_face`, `android_cash_item_equipment[]`              |

## 외형 이미지에 동작과 표정 입히기 — `characterImageUrl()`

`character_image`는 캐릭터가 서 있는 기본 모습의 이미지 주소입니다. 넥슨 안내에 따르면 이 주소 뒤에 값을 붙여 동작, 감정표현, 무기 모션을 바꿀 수 있습니다. `characterImageUrl()`이 그 주소를 만들어 줍니다. 이미지 주소를 만드는 과정에는 API 호출이 발생하지 않습니다.

```js
import { NexonClient, characterImageUrl } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
const ocid = await client.maplestory.getOcid('캐릭터명');
const basic = await client.maplestory.character.getBasic({ ocid });

// 웃으며 점프하는 모습
console.log(characterImageUrl(basic.character_image, { action: 'A06', emotion: 'E02' }));
// https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG?action=A06&emotion=E02

// 무기를 뺀 모습 — 옷이 무기에 가려질 때
console.log(characterImageUrl(basic.character_image, { wmotion: 'W04' }));

// 걷기 1(A02)의 프레임 0~3 → 차례로 보여 주면 걷는 애니메이션
const walkFrames = [0, 1, 2, 3].map((actionFrame) =>
  characterImageUrl(basic.character_image, { action: 'A02', actionFrame }),
);
console.log(walkFrames[2]);
// https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG?action=A02.2
```

| 설정           | 뜻                            | 값                                                                      |
| -------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `action`       | 동작                          | `'A00'` ~ `'A41'`. 예: `'A00'` 서 있기 1, `'A06'` 점프, `'A07'` 앉기    |
| `actionFrame`  | 동작의 몇 번째 프레임인지     | 0부터 시작. 동작별 범위 적용(서 있기 1은 0~2, 점프는 0)                 |
| `emotion`      | 감정표현                      | `'E00'` ~ `'E24'`. 예: `'E01'` 윙크, `'E02'` 웃음, `'E03'` 울음         |
| `emotionFrame` | 감정표현의 몇 번째 프레임인지 | 0부터. 눈 깜빡임(`'E06'`)은 0~2, 대부분은 0 하나                        |
| `wmotion`      | 무기 모션                     | `'W00'` 기본, `'W01'` 한손, `'W02'` 두손, `'W03'` 건, `'W04'` 무기 제외 |

- **범위를 벗어나면 바로 알려 줍니다.** 점프(`'A06'`)에 `actionFrame: 1`을 넣으면, 깨진 이미지가 나오기 전에 `NexonBadRequestError`가 "이 코드는 프레임이 0 하나뿐입니다" 라고 알려 줍니다.
- **편집기 자동완성에서 동작 코드를 선택할 수 있습니다.** `action:` 뒤에서 자동완성을 열면 `'A00'`~`'A41'`이 나옵니다.
- **이벤트 캐릭터인 사이타마는 기본 모션만 제공됩니다** (넥슨 안내). 값을 붙여도 모습이 바뀌지 않습니다.
- **이펙트형 장비의 이펙트는 이미지에 나오지 않습니다** (넥슨 안내). 외형만 적용됩니다.

### 동작·표정 고르는 화면 만들기

전체 목록은 상수로 들어 있습니다. 항목마다 코드(`code`), 영어 이름(`name`), 한국어 설명(`label`), 마지막 프레임 번호(`maxFrame`)가 있어서 선택 상자를 바로 만들 수 있습니다.

```js
import {
  MAPLE_CHARACTER_ACTIONS,
  MAPLE_CHARACTER_EMOTIONS,
  MAPLE_WEAPON_MOTIONS,
} from 'nexon-open-api';

for (const { code, name, label, maxFrame } of MAPLE_CHARACTER_ACTIONS.slice(0, 3)) {
  console.log(`${code} ${label} (${name}) 프레임 0~${maxFrame}`);
}
// A00 서 있기 1 (기본) (stand1) 프레임 0~2
// A01 서 있기 2 (stand2) 프레임 0~2
// A02 걷기 1 (walk1) 프레임 0~3

console.log(
  `동작 ${MAPLE_CHARACTER_ACTIONS.length}종, 감정표현 ${MAPLE_CHARACTER_EMOTIONS.length}종`,
);
// 동작 42종, 감정표현 25종
console.log(MAPLE_WEAPON_MOTIONS.map(({ code, label }) => `${code} ${label}`).join(' / '));
```

코드, 영어 이름, 프레임 범위는 넥슨 안내 그대로입니다. 한국어 설명(`label`)은 넥슨이 영어 이름만 제공하는 항목을 SDK가 풀어 쓴 것이므로, 화면 문구는 서비스에 맞게 바꿔 써도 됩니다.

## 캐시 장비와 코디 프리셋

```js
const cash = await client.maplestory.character.getCashItemEquipment({ ocid });

console.log(`적용 중인 코디 프리셋: ${cash.preset_no}번`);
for (const item of cash.cash_item_equipment_base) {
  console.log(`${item.cash_item_equipment_slot}: ${item.cash_item_name}`);

  const prism = item.cash_item_coloring_prism;
  if (prism) {
    console.log(
      `  컬러링프리즘 ${prism.color_range} · 색조 ${prism.hue} · 채도 ${prism.saturation} · 명도 ${prism.value}`,
    );
  }
}
// 출력 예시
// 적용 중인 코디 프리셋: 1번
// 모자: 캐시 모자 이름
//   컬러링프리즘 전체 계열 · 색조 120 · 채도 0 · 명도 10
// 한벌옷: 캐시 한벌옷 이름
```

- **장착 위치는 `cash_item_equipment_slot`으로 구분합니다.** `cash_item_equipment_part`는 아이템 종류라서, 반지처럼 여러 칸에 끼는 장비는 값이 겹칩니다.
- **지금 입고 있는 것은 `cash_item_equipment_base`**이고, 저장해 둔 코디 프리셋은 `cash_item_equipment_preset_1`~`3` 입니다. 프리셋 비교 화면도 이 응답 한 번으로 만들 수 있습니다.
- **제로와 엔젤릭버스터는 모습이 둘입니다.** 제로의 베타, 엔젤릭버스터의 드레스 업 모드 코디는 `additional_cash_item_equipment_base`와 `additional_cash_item_equipment_preset_1`~`3`에 있습니다. `character_look_mode`가 `"1"`이면 지금 그 모습입니다.
- **새 슬롯이 생겨도 그대로 보여 줍니다.** 슬롯 이름을 정해 둔 목록과 비교해 걸러 내면, 게임 업데이트로 슬롯이 추가됐을 때 그 장비가 카드에서 조용히 사라집니다. 모르는 슬롯은 뒤에 붙여서 보여 주세요.

## 헤어·성형·피부 색

```js
const beauty = await client.maplestory.character.getBeautyEquipment({ ocid });
const { character_hair: hair, character_face: face, character_skin: skin } = beauty;

// 믹스 염색을 했으면 "베이스 + 믹스 비율", 아니면 베이스 컬러만
const color = (info) =>
  info.mix_color ? `${info.base_color} + ${info.mix_color} ${info.mix_rate}%` : info.base_color;

console.log(`헤어 ${hair.hair_name} (${color(hair)})`);
console.log(`성형 ${face.face_name} (${color(face)})`);
console.log(`피부 ${skin.skin_name}`);
// 출력 예시
// 헤어 헤어 이름 (검은색 + 빨간색 30%)
// 성형 성형 이름 (갈색)
// 피부 피부 이름
```

- `mix_color`는 믹스 염색을 하지 않았으면 `null` 입니다. `mix_rate`는 믹스 컬러의 염색 비율이고 `"30"` 같은 문자열입니다.
- 피부 색을 따로 조정하지 않았으면 `character_skin`의 `color_style`, `hue`, `saturation`, `brightness`가 `null` 입니다.
- 제로의 베타, 엔젤릭버스터의 드레스 업 모드는 `additional_character_hair`, `additional_character_face`, `additional_character_skin`에 있습니다. 다른 직업은 `null` 입니다.

## 안드로이드

```js
const android = await client.maplestory.character.getAndroidEquipment({ ocid });

if (android.android_name) {
  console.log(`${android.android_name} · ${android.android_nickname}`);
  console.log(`헤어 ${android.android_hair.hair_name} · 성형 ${android.android_face.face_name}`);
  for (const item of android.android_cash_item_equipment) {
    console.log(`${item.cash_item_equipment_slot}: ${item.cash_item_name}`);
  }
}
```

- 안드로이드의 헤어·성형·피부는 캐릭터와 같은 모양(`android_hair`, `android_face`, `android_skin`)입니다. 위의 색 표시 코드를 그대로 쓸 수 있습니다.
- 안드로이드 프리셋 1~3번은 `android_preset_1`~`3`에 있고, 빈 프리셋은 `null` 입니다.
- `android_icon`은 안드로이드 아이템의 아이콘 주소입니다. `characterImageUrl()`은 캐릭터 외형 이미지(`character_image`) 주소에만 씁니다.

## 완성 예제: 코디 카드 한 장

`coordi.mjs`로 저장하고, 같은 폴더의 `.env`에 `NEXON_API_KEY=발급받은키`를 적은 뒤 `node --env-file=.env coordi.mjs "캐릭터명"`으로 실행합니다.

```js
import { NexonClient, NexonNotFoundError, characterImageUrl } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
const characterName = process.argv[2];
if (!apiKey || !characterName) {
  console.error('사용법: node --env-file=.env coordi.mjs "캐릭터명" (.env 에 NEXON_API_KEY 필요)');
  process.exit(1);
}

const client = new NexonClient({ apiKey });

/** 코디 카드에 필요한 정보를 한 덩어리로 모은다. 넥슨 서버 호출 5번 */
async function getCoordiCard(name) {
  const ocid = await client.maplestory.getOcid(name);
  // 4건을 함께 부른다 — 개발 단계의 1초 5건 안에 들어온다
  const [basic, cash, beauty, android] = await Promise.all([
    client.maplestory.character.getBasic({ ocid }),
    client.maplestory.character.getCashItemEquipment({ ocid }),
    client.maplestory.character.getBeautyEquipment({ ocid }),
    client.maplestory.character.getAndroidEquipment({ ocid }),
  ]);

  // 카드에는 화면에 보여 줄 값만 담는다. 캐릭터 식별자(ocid)는 넣지 않는다
  return {
    name: basic.character_name,
    world: basic.world_name,
    job: basic.character_class,
    images: {
      stand: basic.character_image,
      smile: characterImageUrl(basic.character_image, { emotion: 'E02' }),
      jump: characterImageUrl(basic.character_image, { action: 'A06', emotion: 'E02' }),
      noWeapon: characterImageUrl(basic.character_image, { wmotion: 'W04' }),
    },
    coordi: cash.cash_item_equipment_base.map((item) => ({
      slot: item.cash_item_equipment_slot,
      name: item.cash_item_name,
      icon: item.cash_item_icon,
      prism: item.cash_item_coloring_prism,
    })),
    hair: beauty.character_hair,
    face: beauty.character_face,
    skin: beauty.character_skin,
    android: android.android_name ? android.android_name : null,
    source: 'Data based on NEXON Open API',
  };
}

try {
  const card = await getCoordiCard(characterName);
  console.log(`${card.name} · ${card.world} · ${card.job}`);
  console.log(`점프 이미지: ${card.images.jump}`);
  for (const item of card.coordi) console.log(`${item.slot}: ${item.name}`);
  console.log(
    `헤어: ${card.hair.hair_name} · 성형: ${card.face.face_name} · 피부: ${card.skin.skin_name}`,
  );
  console.log(`안드로이드: ${card.android ?? '없음'}`);
  console.log(card.source);
} catch (err) {
  if (err instanceof NexonNotFoundError) {
    console.error('그런 캐릭터가 없습니다. 이름을 다시 확인해 주세요.');
  } else {
    throw err;
  }
}
// 출력 예시
// 캐릭터명 · 스카니아 · 아크메이지(불,독)
// 점프 이미지: https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG?action=A06&emotion=E02
// 모자: 캐시 모자 이름
// 한벌옷: 캐시 한벌옷 이름
// 헤어: 헤어 이름 · 성형: 성형 이름 · 피부: 피부 이름
// 안드로이드: 안드로이드 이름
// Data based on NEXON Open API
```

같은 내용을 바로 실행할 수 있는 파일은 [examples/maplestory-coordi-card.mjs](../../examples/maplestory-coordi-card.mjs)입니다.

## 호출량과 캐시

| 화면                                            | NEXON Open API 호출량                                               |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| 외형 이미지만 (동작·표정을 몇 개로 바꾸든 같음) | 2 (캐릭터 식별자(ocid) 1건 + 기본 정보 1)                           |
| 코디 카드 한 장 (위 완성 예제)                  | 5 (캐릭터 식별자(ocid) 1건 + 기본 정보·캐시 장비·헤어·안드로이드 4) |

개발 단계의 호출 허용량은 **초당 5건, 1일 1,000건**입니다(2026년 11월 24일 넥슨 안내 기준). 카드 한 장이 5건이므로 하루 200장이고, 두 장을 동시에 만들면 초당 호출 허용량을 넘습니다.

- **완성한 코디 카드를 캐시합니다.** 게임에서 바뀐 내용은 평균 15분 뒤에 조회되므로, 같은 캐릭터의 카드를 15분 동안 다시 쓰면 호출이 크게 줄어듭니다. 캐시 키는 캐릭터 이름으로 하고, 캐릭터 식별자(ocid)는 캐시 키·파일 이름·로그에 넣지 않습니다.
- **여러 캐릭터는 한 명씩 차례로 만듭니다.** 길드원 30명의 카드를 `Promise.all`로 한꺼번에 만들지 않습니다.
- **동작을 바꿀 때는 같은 이미지 주소를 사용합니다.** 조회한 `character_image`를 `characterImageUrl()`에 전달하면 추가 API 호출 없이 동작을 바꿀 수 있습니다.
- **웹사이트라면 카드는 서버에서 만듭니다.** API Key와 캐릭터 식별자(ocid)는 방문자의 브라우저로 보내지 않고, 위 예제의 `card`처럼 화면에 필요한 값만 내려 줍니다.
- **오래 저장한 카드는 30일 안에 다시 받습니다** (넥슨의 데이터 갱신 의무). 받은 시각을 함께 저장해 두세요.
- **화면에 `Data based on NEXON Open API`를 적습니다.**

## 참고

- 캐릭터 정보의 모든 메서드: [메이플스토리 문서](../maplestory.md)
- 에러와 호출 허용량: [FAQ](../faq.md)
- 다른 레시피: [장비 분석 도구의 재료 모으기](./maplestory-equipment-calculator.md)
