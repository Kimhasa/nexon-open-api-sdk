# 라이브러리 기능 및 비교

"NEXON Open API는 주소에 요청만 보내면 되는데, 그냥 `fetch`로 부르거나 AI에게 짜 달라고 하면 되지 않나요?" 라는 질문에 답하는 문서입니다.

NEXON Open API 포털 스펙과 실제 응답 사이에 차이가 있을 수 있습니다. 넥슨은 [AI 에이전트 가이드](https://openapi.nexon.com/ko/guide/ai-agent/)에서 실제 응답과 대조하도록 안내합니다.

> 응답 스키마도 실제와 다를 수 있습니다. (…) 파싱 코드를 쓰기 전에 엔드포인트마다 실제 응답 한 건을 스키마와 대조하고, 다른 곳은 실제를 따르세요.

이 라이브러리는 14개 게임의 실제 응답을 대조한 결과를 반영해 개발자와 AI 코딩 도구가 참고할 수 있는 타입과 사용 예제를 제공합니다.

- [조회 코드 비교](#조회-코드-비교)
- [NEXON Open API AI 에이전트 가이드와 이 라이브러리](#nexon-open-api-ai-에이전트-가이드와-이-라이브러리)
- [AI 코딩 도구 사용 안내](#ai-코딩-도구-사용-안내)
- [다른 라이브러리와 비교](#다른-라이브러리와-비교)
- [실서버 검증 내용](#실서버-검증-내용)

## 조회 코드 비교

아래 예제는 메이플스토리 캐릭터 카드에 표시할 레벨, 무기의 남은 업그레이드 횟수, 펫 장비 이름을 조회합니다.

### NEXON Open API 직접 호출 코드

문법 오류도 없고 넥슨 문서의 필드 이름도 그대로 썼습니다. 그런데 실제 서버에서는 ①~⑥이 어긋납니다. 모두 2026-11-24에 실제 응답으로 확인한 내용입니다.

```js
const BASE = 'https://open.api.nexon.com/maplestory/v1';
const headers = { 'x-nxopen-api-key': process.env.NEXON_API_KEY ?? '' };

async function get(path, params) {
  const res = await fetch(`${BASE}${path}?${new URLSearchParams(params)}`, { headers });
  const body = await res.json();
  // ① 없는 캐릭터 이름에도 넥슨은 "Please input valid parameter" 를 준다.
  //    그대로 보여 주면 방문자는 오타가 아니라 서비스 고장으로 읽는다
  if (!res.ok) throw new Error(body.error.message);
  return body;
}

const { ocid } = await get('/id', { character_name: '캐릭터명' });

// ② 오늘 날짜를 넣으면 400 이 온다. 게다가 이 식은 한국 시간이 아니라 UTC 날짜다
const today = new Date().toISOString().slice(0, 10);
const basic = await get('/character/basic', { ocid, date: today });
console.log(`${basic.character_name} Lv.${basic.character_level}`);

const equip = await get('/character/item-equipment', { ocid });
const weapon = equip.item_equipment.find((item) => item.item_equipment_slot === '무기');
// ③ 문서의 이름은 scroll_upgradable_count, 실제 응답은 scroll_upgradeable_count → undefined
console.log(`남은 업그레이드 ${weapon?.scroll_upgradable_count}`);

// ④ 프리셋 장비의 문서상 이름은 equipment_slot, 실제는 item_equipment_slot → 항상 못 찾는다
const presetWeapon = equip.item_equipment_preset_1.find((item) => item.equipment_slot === '무기');
console.log(`1번 프리셋 무기 ${presetWeapon?.item_name}`);

const pet = await get('/character/pet-equipment', { ocid });
// ⑤ 펫 장비를 안 낀 캐릭터는 item_name 이 null → 내 캐릭터로는 되다가 남의 캐릭터에서 멈춘다
console.log(`펫 장비 ${pet.pet_1_equipment.item_name.trim()}`);

// ⑥ 넥슨은 식별자(ocid)를 로그에 그대로 남기지 말라고 안내한다
console.log(`[debug] ocid=${ocid}`);
```

③과 ④가 까다로운 이유는 **에러가 나지 않기 때문**입니다. 화면에 `undefined`가 찍히거나 값이 빈 채로 넘어갑니다. ⑤는 테스트한 캐릭터가 펫 장비를 끼고 있으면 공개한 뒤에야 드러납니다.

### 라이브러리를 사용한 코드

```js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

try {
  const ocid = await client.maplestory.getOcid('캐릭터명');

  // 날짜를 생략하면 가장 최근 데이터다
  const basic = await client.maplestory.character.getBasic({ ocid });
  console.log(`${basic.character_name} Lv.${basic.character_level}`);

  const equip = await client.maplestory.character.getItemEquipment({ ocid });
  const weapon = equip.item_equipment.find((item) => item.item_equipment_slot === '무기');
  // 실제 응답의 이름이 자동완성에 나온다
  console.log(`남은 업그레이드 ${weapon?.scroll_upgradeable_count ?? '-'}`);

  const presetWeapon = equip.item_equipment_preset_1.find(
    (item) => item.item_equipment_slot === '무기',
  );
  console.log(`1번 프리셋 무기 ${presetWeapon?.item_name ?? '없음'}`);

  const pet = await client.maplestory.character.getPetEquipment({ ocid });
  // item_name 이 null 일 수 있다고 타입에 적혀 있어, 처리를 빼먹으면 에디터가 알려 준다
  console.log(`펫 장비 ${pet.pet_1_equipment.item_name ?? '없음'}`);
} catch (err) {
  // 없는 캐릭터는 "파라미터 오류"가 아니라 NexonNotFoundError 로 온다
  if (err instanceof NexonNotFoundError) console.log('캐릭터를 찾을 수 없어요.');
  else throw err;
}
```

| 직접 호출하는 코드에서 확인한 차이 | 이 라이브러리에서는                                                                             |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| ① 없는 캐릭터에 "파라미터 오류"    | `NexonNotFoundError`를 던집니다. 14개 게임의 이름 조회가 모두 같습니다                          |
| ② 오늘 날짜, 시간대                | 날짜를 생략하면 최신입니다. 메이플스토리 계열은 오늘·미래 날짜를 넥슨에 보내기 전에 알려 줍니다 |
| ③ ④ 문서와 다른 필드 이름          | 타입은 실제 응답의 필드 이름을 따릅니다. 일치하지 않는 이름은 편집기에서 확인할 수 있습니다.    |
| ⑤ 예상하지 못한 `null`             | 실제로 `null`이 오는 필드는 타입에 `null`이 적혀 있습니다                                       |
| ⑥ 로그에 남는 식별자               | `debug: true`의 로그는 식별자를 가려서 출력합니다                                               |

다른 게임에서 확인한 차이도 타입에 반영했습니다.

- **EA SPORTS FC 온라인** — 문서의 `OffsideCount`는 실제로 `offsideCount`, `spId`는 `spid`로 옵니다.
- **히트2** — 문서의 `character_last_login`은 실제로 `character_date_last_login`으로 옵니다.
- **마비노기 영웅전 랭킹** — 문서에는 목록(배열)이라고 되어 있지만 실제로는 `{ ranking: [...] }`로 옵니다. 문서대로 `list[0]`을 읽으면 `undefined` 입니다. 이 라이브러리는 목록으로 풀어서 돌려줍니다.
- **서든어택** — 랭크전 티어는 숫자가 아니라 문자열로 옵니다.

## NEXON Open API AI 에이전트 가이드와 이 라이브러리

[NEXON Open API AI 에이전트 가이드](https://openapi.nexon.com/ko/guide/ai-agent/)는 API를 자동으로 호출할 때 확인할 사항을 안내합니다. 아래 표는 가이드의 항목별 적용 범위입니다. 서비스에서 구현할 내용은 [서비스 공개 체크리스트](service-checklist.md)에서 확인할 수 있습니다.

### 반드시 지킬 것

| NEXON Open API 가이드                                                 | 이 라이브러리가 하는 일                                                                                                                                  | 더 보기                                                        |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1. 서버에서만 API Key 관리                                            | 키가 비어 있으면 `new NexonClient()`에서 바로 알려 줍니다. 키를 어디에 두는지는 **창작자 몫**입니다                                                      | [체크리스트](service-checklist.md#1-api-key는-서버에만-둡니다) |
| 2. 날짜는 필요한 경우에만 지정하고 필수인 조회에서는 항상 지정        | 날짜를 생략하면 최신 데이터를 조회합니다. 메이플스토리 계열은 조회할 수 없는 날짜를 요청 전에 막습니다 ([아래](#날짜-규칙))                              | [FAQ](faq.md#오늘-데이터가-안-나와요--예전-장비가-나와요)      |
| 3. 호출량 초과(429)·서버 오류(5xx)·점검 상황에서만 간격을 두고 재시도 | 429와 5xx만 자동으로 다시 시도합니다. 간격은 시도마다 두 배로 늘리고 무작위 시간을 더해 요청이 몰리지 않게 합니다 ([아래](#에러-처리))                   | [설정 옵션](../README.md#설정-옵션)                            |
| 4. HTTP 200 응답에서도 핵심 필드의 `null` 여부 확인                   | 메이플스토리 계열의 서비스 개시 이전 날짜는 요청 전에 막습니다. 그 밖에 `null`이 올 수 있는 필드는 타입에 적혀 있어 에디터가 확인을 요구합니다           | [조회 코드 비교](#조회-코드-비교)                              |
| 5. 응답 캐시                                                          | **하지 않습니다.** 무엇을 얼마나 저장할지는 서비스마다 달라서 **창작자 몫**입니다                                                                        | [체크리스트](service-checklist.md#4-응답을-저장할-때)          |
| 6. 화면에 출처 표기                                                   | **하지 않습니다.** 화면은 **창작자 몫**입니다                                                                                                            | [체크리스트](service-checklist.md#4-응답을-저장할-때)          |
| 7. 저장한 데이터는 30일 이내에 갱신                                   | **하지 않습니다.** **창작자 몫**입니다                                                                                                                   | [체크리스트](service-checklist.md#4-응답을-저장할-때)          |
| 8. 호출량이 호출 허용량을 초과하는지 확인                             | 빈 이름 등 유효하지 않은 값은 요청 전에 검사합니다. 화면별 호출량은 서비스에서 정합니다.                                                                 | [체크리스트](service-checklist.md#3-호출량을-확인합니다)       |
| 9. 허용된 필터 값 사용                                                | 넥슨은 정해진 값 밖의 필터를 에러 없이 무시하고 전체 결과를 줍니다. 이 라이브러리는 허용값을 자동완성으로 보여 주고, 다른 값은 요청 전에 에러로 알립니다 | [FAQ](faq.md#입력이-잘못됐다고-나와요-nexonbadrequesterror)    |

### 하지 말 것

| NEXON Open API 가이드                                              | 이 라이브러리가 하는 일                                                                                                                                     | 더 보기                                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1. 식별자 원문을 로그·파일명·URL에 남기지 않습니다.                | `debug: true`의 로그는 식별자(ocid·ouid·oguild_id)를 가립니다. 직접 남기는 로그에는 `maskIdentifier()`를 쓸 수 있습니다. 파일명과 URL은 **창작자 몫**입니다 | [체크리스트](service-checklist.md#5-식별자를-외부에-공개하지-않습니다) |
| 2. 다시 요청해도 결과가 같은 에러는 재시도하지 않습니다.           | 대상이 없거나 입력값이 유효하지 않거나 다른 게임의 API Key를 사용한 경우에는 자동 재시도 없이 에러를 발생시킵니다.                                          | [에러 처리](#에러-처리)                                                |
| 3. 식별자를 받은 것만으로 "찾았습니다"라고 안내하지 않습니다.      | 식별자로 정보를 조회하다 실패해도 같은 `NexonNotFoundError`로 옵니다. "찾았습니다"는 정보 조회까지 완료한 뒤에 표시합니다. 표시 시점은 **창작자 몫**입니다  | [FAQ](faq.md#캐릭터를-못-찾아요)                                       |
| 4. NEXON Open API의 에러 설명을 화면에 그대로 표시하지 않습니다.   | 상황마다 에러 종류가 달라서, 종류별로 알맞은 문구를 붙일 수 있습니다                                                                                        | [README](../README.md#에러-처리)                                       |
| 5. 표본 범위 없이 집계 결과를 전체 통계처럼 표시하지 않습니다.     | **하지 않습니다.** 집계와 표기는 **창작자 몫**입니다                                                                                                        | —                                                                      |
| 6. 개별 캐릭터의 순위를 찾기 위해 랭킹 페이지를 순회하지 않습니다. | 메이플스토리 랭킹처럼 넥슨이 지원하는 조회에는 `ocid`를 넣을 수 있습니다. 넣으면 그 캐릭터의 순위만 옵니다                                                  | [메이플스토리 문서](maplestory.md)                                     |

### 에러 처리

넥슨의 에러 코드를 외울 필요가 없도록 상황별 에러 종류로 나눕니다.

| 넥슨 코드                | NEXON Open API 가이드의 설명                  | 이 라이브러리                                                            | 자동 재시도 |
| ------------------------ | --------------------------------------------- | ------------------------------------------------------------------------ | ----------- |
| `OPENAPI00001`, HTTP 5xx | 서버 내부 오류                                | `NexonServerError`                                                       | 예          |
| `OPENAPI00002`           | 권한 없음                                     | `NexonAuthError`                                                         | 아니오      |
| `OPENAPI00003`           | 유효하지 않은 식별자                          | `NexonNotFoundError`                                                     | 아니오      |
| `OPENAPI00004`           | 파라미터 누락, **또는 대상 없음**             | 이름 조회에서는 `NexonNotFoundError`, 그 밖에는 `NexonBadRequestError`   | 아니오      |
| `OPENAPI00005`           | 유효하지 않은 API Key                         | `NexonAuthError`                                                         | 아니오      |
| `OPENAPI00006`           | API Key에 등록되지 않은 게임 또는 잘못된 경로 | `NexonAuthError`. 필요한 API Key의 발급 대상 게임을 메시지에 표시합니다. | 아니오      |
| `OPENAPI00007`, HTTP 429 | 호출량 초과                                   | `NexonRateLimitError`                                                    | 예          |
| `OPENAPI00009`           | 데이터 준비 중                                | `NexonDataNotReadyError`                                                 | 아니오      |
| `OPENAPI00010`           | 게임 점검 중                                  | `NexonMaintenanceError`                                                  | 아니오      |
| `OPENAPI00011`           | API 점검 중                                   | `NexonMaintenanceError`                                                  | 예          |

- 가이드는 데이터 준비 중(`OPENAPI00009`)과 게임 점검 중(`OPENAPI00010`)도 재시도할 수 있다고 적습니다. 이 라이브러리는 이 둘을 **자동으로 재시도하지 않습니다.** 점검은 몇 초 안에 끝나지 않고, 데이터 준비 중은 날짜를 잘못 넣었을 때도 오기 때문입니다. 에러를 받아 "점검 중이에요", "아직 데이터가 없어요"라고 안내하는 편이 낫습니다.
- `OPENAPI00006`은 가이드가 "가장 자주 걸리는 지점"으로 꼽은 코드입니다. 메이플스토리용 API Key로 EA SPORTS FC 온라인을 조회하면 이 코드가 반환됩니다. 넥슨의 에러 설명에는 잘못된 주소도 원인으로 포함됩니다.

### 날짜 규칙

| NEXON Open API 가이드                                                                                                    | 이 라이브러리가 하는 일                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 날짜가 선택인 조회에서 오늘이나 미래 날짜를 지정하면 HTTP 400 "파라미터 오류"가 반환됩니다.                              | 메이플스토리 계열(메이플스토리, 메이플스토리M, MapleStorySEA, MapleStoryTaiwan)은 요청 전에 막고, 어떤 날짜부터 조회할 수 있는지 알려 줍니다 |
| 서비스 개시 이전 날짜는 HTTP 200으로 응답하며, 날짜 외의 모든 필드는 `null`입니다.                                       | 메이플스토리 계열은 요청 전에 막습니다. 빈 값을 정상 응답으로 저장하는 일이 없습니다                                                         |
| 랭킹처럼 날짜가 필수인 조회에는 오늘 날짜를 지정할 수 있습니다. 미래 날짜와 조회 범위를 벗어난 날짜는 에러가 발생합니다. | 랭킹은 미래와 범위 밖 날짜만 막습니다                                                                                                        |
| '오늘'은 게임의 기준 시간대를 따릅니다.                                                                                  | `toNexonDate(date, 540)`으로 기준 시간대의 날짜를 만듭니다 (메이플스토리는 한국 시간, MapleStorySEA와 MapleStoryTaiwan은 UTC+8)              |
| 당일 데이터의 제공 시각은 조회마다 다릅니다.                                                                             | 넥슨이 안내한 시각을 게임 문서와 [FAQ](faq.md#오늘-데이터가-안-나와요--예전-장비가-나와요)에 옮겨 두었습니다                                 |

메이플스토리 계열이 아닌 게임의 날짜 입력은 달력에 있는 날짜인지만 확인합니다. 그 게임에서 실제로 조회되는 범위는 직접 확인해야 합니다.

### 식별자

| NEXON Open API 가이드                                            | 이 라이브러리가 하는 일                                                                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 식별자에는 API Key와 같은 계정에 연결된 값이 포함될 수 있습니다. | 디버그 로그에서 식별자를 가립니다. `maskIdentifier()`·`maskIdentifiers()`로 직접 남기는 로그도 가릴 수 있습니다                               |
| 식별자가 바뀔 수 있으므로 오래 보관하지 않습니다.                | 저장해 둔 식별자로 조회가 안 되면 `NexonNotFoundError`가 납니다. 이름으로 다시 조회합니다. 저장과 갱신은 **창작자 몫**입니다                  |
| 식별자 파라미터의 이름은 게임마다 다릅니다.                      | 게임마다 `getOcid()`·`getOuid()`로 받아 그대로 넘기면 됩니다. TypeScript에서는 전용 타입이라 다른 문자열을 실수로 넣으면 에디터가 알려 줍니다 |
| 식별자를 브라우저에 전달하지 않습니다.                           | **하지 않습니다.** 웹페이지에 무엇을 내려 줄지는 **창작자 몫**입니다 ([체크리스트](service-checklist.md#5-식별자를-외부에-공개하지-않습니다)) |

### 이 라이브러리가 하지 않는 것

다음 항목은 서비스를 개발할 때 구현합니다. [서비스 공개 체크리스트](service-checklist.md)를 참고해 주세요.

- 응답 캐시와, 저장한 데이터의 30일 이내 갱신
- 화면의 출처 표기 ("Data based on NEXON Open API")
- 화면 하나에 드는 호출량 계산
- 식별자를 URL·파일명·웹페이지에 내보내지 않는 일
- 집계 화면의 표본 범위 표기

## AI 코딩 도구 사용 안내

AI 코딩 도구가 포털 스펙을 참고하면 [직접 호출 코드](#nexon-open-api-직접-호출-코드)와 같이 실제 응답과 다른 필드 이름을 사용할 수 있습니다.

요청에 사용할 라이브러리 이름을 포함해 주세요.

> nexon-open-api 라이브러리로 메이플스토리 캐릭터 카드를 만들어 줘.

AI 코딩 도구는 라이브러리의 타입에서 실제 응답과 대조한 필드 이름과 에러 유형을 참고할 수 있습니다. 정의되지 않은 필드 이름은 타입 검사에서 확인할 수 있습니다.

AI 코딩 도구에 이 라이브러리를 알려 주는 방법은 [AI 코딩 도구 사용 안내](ai-guide.md)에 있습니다.

## 다른 라이브러리와 비교

2026-11-24에 조회한 내용입니다. 각 프로젝트는 계속 바뀌므로 최신 상태는 직접 확인해 주세요.

|              | nexon-open-api (이 라이브러리)                | [maplestory-openapi](https://www.npmjs.com/package/maplestory-openapi) | nexon_openapi (Python)     |
| ------------ | --------------------------------------------- | ---------------------------------------------------------------------- | -------------------------- |
| 다루는 게임  | 14개 게임과 NEXON Open API 공지               | 메이플스토리 (KMS·MSEA·TMS)                                            | 여러 게임                  |
| 언어         | JavaScript·TypeScript                         | JavaScript·TypeScript, Python, Java, C#                                | Python                     |
| 의존성 (npm) | 없음                                          | axios, dayjs, xml2js                                                   | —                          |
| 사용 현황    | —                                             | npm 월 690회, GitHub 별 40개                                           | 2024-07 이후 업데이트 없음 |
| 확인 방법    | 실제 서버 응답과 263개 조회 대조 (2026-11-24) | 해당 프로젝트 문서 참고                                                | 해당 프로젝트 문서 참고    |

- **maplestory-openapi**는 메이플스토리를 지원하며 JavaScript·TypeScript, Python, Java, C#에서 사용할 수 있습니다. 조회 시점에 npm의 월간 다운로드는 690회였습니다. 이 라이브러리는 JavaScript와 TypeScript를 지원합니다.
- **이 라이브러리를 활용할 수 있는 경우**
  - 여러 게임을 한 패키지에서 조회합니다. 예를 들어 EA SPORTS FC 온라인 전적, 마비노기 경매장, 서든어택 전적을 같은 방식으로 조회할 수 있습니다.
  - 실제 응답을 기준으로 작성한 타입을 사용합니다.
  - 별도의 런타임 의존성 없이 설치합니다.
- 메이플스토리 전용 커뮤니티 MCP 서버도 2개 있습니다. MCP 서버는 AI와 대화하며 캐릭터를 조회할 때, 라이브러리는 봇이나 사이트에서 조회 기능을 구현할 때 사용할 수 있습니다.

## 실서버 검증 내용

**검증 범위** — 2026년 11월 24일 게임별 개발 단계에서 발급받은 API Key로 직업·레벨·월드가 다른 공개 캐릭터를 게임별 2~6명(총 42명) 조회했습니다. 조회 메서드 267개 중 263개의 응답을 중첩 필드까지 타입과 대조했습니다.

**검증 결과** — 초기 검증에서는 조회 항목 127개의 응답에서 600종이 넘는 차이를 확인했습니다. 문서에 없는 `null`, 이름이 다른 필드, 숫자와 문자열의 차이, 목록과 객체의 차이입니다. 타입을 실제 응답에 맞춰 보정한 뒤 같은 검증 범위에서 불일치 0건을 확인했습니다. 없는 캐릭터 이름에 넥슨이 "파라미터 오류"(`OPENAPI00004`)를 주는 것도 14개 게임 모두에서 확인했습니다.

**실서버 호출에서 제외한 메서드 4개**

- EA SPORTS FC 온라인 이적시장 거래 기록 `getTradeList` — API Key를 발급받은 계정의 거래 기록만 조회할 수 있습니다.
- 메이플스토리 `getLegacyOuid` — 이전 개발자센터에서 발급받은 API Key가 필요합니다.
- EA SPORTS FC 온라인 `getAllMatchList` — 넥슨에서 API 제공을 종료했습니다.
- EA SPORTS FC 온라인 `getSeasonIdMeta` — API Key 없이 접근 가능한 정적 파일로 별도 확인했습니다.

**한계** — 캐릭터마다 가진 데이터가 달라서, 처음 보는 장비·펫·스킬 구성에서는 또 다른 `null`이 나올 수 있습니다. 넥슨이 응답을 바꿀 수도 있습니다. 응답이 타입과 다르면 [이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 알려 주세요 ([FAQ](faq.md#응답이-실제-게임과-달라요)).

검증 절차는 [CONTRIBUTING.md](../CONTRIBUTING.md#실서버-확인)에 있습니다.
