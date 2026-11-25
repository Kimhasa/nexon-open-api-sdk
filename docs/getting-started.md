# 시작 가이드

개발이 처음인 분을 위해 패키지 설치부터 메이플스토리 캐릭터 정보 조회까지 안내합니다. 이미 Node.js 프로젝트가 있다면 [2. API Key 발급받기](#2-api-key-발급받기)부터 진행해 주세요.

## 1. 준비물과 프로젝트 만들기

**Node.js 18 이상**이 필요합니다. 터미널(Windows는 PowerShell, macOS는 터미널)에서 버전을 확인합니다.

```bash
node -v
```

`v18` 보다 낮거나 명령을 찾을 수 없다고 나오면 [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치합니다. 이 가이드의 실행 명령은 Node.js 20.6 이상을 기준으로 합니다.

에디터는 [VS Code](https://code.visualstudio.com/)를 권장합니다. `basic.`을 입력하면 편집기 자동완성에서 캐릭터 레벨(`character_level`), 직업(`character_class`) 등의 응답 필드와 설명을 확인할 수 있습니다.

새 폴더를 만들고 그 안에서 프로젝트를 시작합니다.

```bash
mkdir my-nexon-app
cd my-nexon-app
npm init -y
npm pkg set type=module
npm install nexon-open-api
```

- `npm init -y`는 프로젝트 정보 파일(`package.json`)을 만듭니다.
- `npm pkg set type=module`은 이 프로젝트의 `.js` 파일에서 `import`와 맨 바깥의 `await`를 쓸 수 있게 합니다. 이 설정을 하지 않았다면 파일 확장자를 `.mjs`로 하면 됩니다. 이 가이드는 어느 쪽이든 동작하도록 `.mjs`를 씁니다.

## 2. API Key 발급받기

API Key는 애플리케이션이 NEXON Open API에서 데이터를 조회할 때 사용하는 인증 정보입니다. 포털 안내는 [NEXON Open API 사전 준비 가이드](https://openapi.nexon.com/ko/guide/prepare-in-advance/)에서 확인할 수 있습니다.

1. [NEXON Open API](https://openapi.nexon.com/) 오른쪽 위의 **로그인** 버튼으로 넥슨 ID에 로그인합니다.
2. **내 애플리케이션 > 애플리케이션 등록**으로 들어가 애플리케이션 정보를 적습니다.
   - **게임 선택**: 데이터를 조회할 게임을 고릅니다.
   - **애플리케이션 타입 선택**: 처음에는 **개발 단계**를 고릅니다. 서비스명만 적으면 됩니다. **서비스 단계**는 서비스명, 개발 환경, URL 정보, 소개, 대표 이미지가 필요합니다.
3. 이용약관에 동의하고 등록합니다.
4. 등록이 끝나면 API Key가 자동으로 발급됩니다. **내 애플리케이션 > 애플리케이션 목록 > 애플리케이션 상세 페이지**에서 확인합니다.

알아 둘 점:

- **API Key는 게임별로 발급됩니다.** 메이플스토리와 EA SPORTS FC 온라인을 모두 조회하려면 게임마다 애플리케이션을 등록하고 API Key를 발급받습니다.
- **개발 단계의 호출 허용량은 초당 5건, 1일 1,000건입니다.** 봇이나 사이트를 공개할 때에는 서비스 단계 애플리케이션을 등록하여 API Key를 새로 발급받습니다. 서비스 단계의 호출 허용량은 초당 500건, 1일 20,000,000건입니다(2026년 11월 24일 넥슨 안내 기준). 자세한 내용은 [서비스 공개 체크리스트](service-checklist.md)에서 확인할 수 있습니다.
- API Key가 노출됐다면 애플리케이션 상세 페이지에서 새 API Key를 발급받아 교체해 주세요.

## 3. `.env` 파일로 API Key 관리하기

코드를 공유하거나 GitHub에 올릴 때 API Key가 공개되지 않도록 `.env` 파일에서 관리합니다.

프로젝트 폴더에 `.env` 파일을 만들고 발급받은 API Key를 설정합니다. 등호 앞뒤에 공백이나 따옴표를 넣지 않습니다.

```
NEXON_API_KEY=발급받은_키
```

값에 `#`이 들어가면 큰따옴표로 감쌉니다. 따옴표가 없으면 `#`부터 뒤가 주석으로 읽혀 잘립니다. 예를 들어 퍼스트 디센던트 닉네임은 `TFD_USER_NAME="닉네임#1234"`처럼 적습니다.

GitHub에 올릴 계획이 있다면 같은 폴더에 `.gitignore` 파일을 만들고 아래 두 줄을 적습니다. 이 파일에 적힌 것은 올라가지 않습니다.

```
.env
node_modules/
```

실행할 때 `--env-file=.env`를 붙이면 Node.js가 이 파일을 읽어 `process.env.NEXON_API_KEY`로 넘겨줍니다.

```bash
node --env-file=.env index.mjs
```

`--env-file`은 Node.js 20.6 이상에서 동작합니다. 그보다 낮은 버전에서는 `npm install dotenv`로 dotenv를 설치하고, 코드 맨 첫 줄에 `import 'dotenv/config';`를 추가한 뒤 `node index.mjs`로 실행합니다.

여러 게임의 API Key를 사용하는 경우 `NEXON_MAPLESTORY_API_KEY`, `NEXON_FC_ONLINE_API_KEY`처럼 게임 이름을 넣어 구분합니다.

## 4. 첫 실행: 메이플스토리 캐릭터 정보 출력

메이플스토리용 API Key를 사용합니다. 아래 내용을 `index.mjs`로 저장합니다.

```js
import { NexonClient, NexonError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) {
  console.error('NEXON_API_KEY 가 비어 있습니다. .env 파일을 확인하세요.');
  process.exit(1);
}

const client = new NexonClient({ apiKey });

// 실행할 때 뒤에 붙인 이름을 쓴다. 예: node --env-file=.env index.mjs 캐릭터명
const characterName = process.argv[2] ?? '캐릭터명';

try {
  // 1단계: 캐릭터 이름으로 캐릭터 식별자(ocid)를 조회합니다
  const ocid = await client.maplestory.getOcid(characterName);

  // 2단계: 식별자로 캐릭터 정보를 조회합니다
  const basic = await client.maplestory.character.getBasic({ ocid }); // 기본 정보
  const stat = await client.maplestory.character.getStat({ ocid }); // 종합 능력치
  const equipment = await client.maplestory.character.getItemEquipment({ ocid }); // 장착 장비

  // 종합 능력치는 { 이름, 값 } 목록이라 이름으로 찾는다
  const combatPower = stat.final_stat.find((s) => s.stat_name === '전투력')?.stat_value;

  console.log(`${basic.character_name} (${basic.world_name} · ${basic.character_class})`);
  console.log(`레벨 ${basic.character_level} (${basic.character_exp_rate}%)`);
  console.log(`전투력 ${combatPower ? Number(combatPower).toLocaleString('ko-KR') : '정보 없음'}`);
  console.log(`길드 ${basic.character_guild_name || '없음'}`);
  console.log('장착 장비');
  for (const item of equipment.item_equipment.slice(0, 5)) {
    console.log(`- ${item.item_equipment_slot}: ${item.item_name}`);
  }
} catch (err) {
  if (err instanceof NexonError) {
    // 메시지에 무엇이 틀렸고 어떻게 고치는지 들어 있다
    console.error(`조회하지 못했습니다: ${err.message}`);
  } else {
    throw err;
  }
}
```

내 캐릭터 이름을 붙여 실행합니다.

```bash
node --env-file=.env index.mjs 캐릭터명
```

```
캐릭터명 (스카니아 · 아크메이지(불,독))
레벨 275 (42.31%)
전투력 123,456,789
길드 길드명
장착 장비
- 모자: 에테르넬 메이지햇
- 얼굴장식: 루즈 컨트롤 머신 마크
- 눈장식: 마력이 깃든 안대
- 귀고리: 커맨더 포스 이어링
- 상의: 에테르넬 메이지로브
```

조회는 **이름 → 식별자 → 정보** 순서로 진행합니다. 메이플스토리에서는 캐릭터 이름으로 캐릭터 식별자(ocid)를 조회합니다. EA SPORTS FC 온라인이나 서든어택처럼 계정 단위로 조회하는 게임에서는 닉네임으로 계정 식별자(ouid)를 조회합니다.

방금 게임에서 바꾼 장비가 바로 보이지 않을 수 있습니다. 넥슨 안내에 따르면 메이플스토리 게임 데이터는 평균 15분 뒤에 확인할 수 있습니다. `getBasic({ ocid, date: '2026-11-23' })`처럼 날짜를 넣으면 그날의 데이터를 조회합니다 ([FAQ](faq.md#오늘-데이터가-안-나와요--예전-장비가-나와요)).

### 첫 실행에서 자주 나는 에러

| 화면에 나온 메시지                                                                       | 원인                                                   | 해결                                                                                        |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `SyntaxError: Cannot use import statement outside a module`                              | `.js` 파일에 `type=module` 설정 누락                   | 파일 이름을 `index.mjs`로 바꾸거나 `npm pkg set type=module`을 실행합니다                   |
| `Cannot find package 'nexon-open-api'`                                                   | 실행 폴더에 라이브러리 미설치                          | 코드가 있는 폴더에서 `npm install nexon-open-api`를 실행합니다                              |
| `node: bad option: --env-file=.env`                                                      | Node.js 버전이 20.6 미만                               | Node.js를 업데이트하거나 위의 dotenv 설정을 사용합니다.                                     |
| `NEXON_API_KEY 가 비어 있습니다. .env 파일을 확인하세요.` 또는 `API 키가 비어 있습니다.` | 실행 옵션 누락, `.env` 위치 또는 환경 변수 이름 불일치 | `.env`가 `index.mjs`와 같은 폴더에 있는지, 환경 변수 이름이 `NEXON_API_KEY`인지 확인합니다. |
| `[OPENAPI00005] The apikey is not valid.`                                                | 유효하지 않은 API Key                                  | API Key를 다시 복사해 설정하고 앞뒤 공백이나 따옴표가 없는지 확인합니다.                    |
| `[OPENAPI00002]`로 시작하고 해당 API를 호출할 수 없다는 메시지                           | 해당 API에 대한 권한 없음                              | API Key를 발급받은 게임과 조회할 게임이 일치하는지 확인합니다.                              |
| `[OPENAPI00006]`로 시작하고 게임 이름이 들어간 메시지                                    | 다른 게임용 API Key 사용                               | 메시지에 나온 게임의 애플리케이션을 등록해 API Key를 발급받습니다.                          |
| `'캐릭터명' 캐릭터를 찾을 수 없습니다.`로 시작하는 메시지                                | 입력한 이름과 일치하는 캐릭터 없음                     | 캐릭터 이름의 오타와 띄어쓰기, 월드·서버를 확인합니다.                                      |
| `[OPENAPI00010]` 또는 `[OPENAPI00011]`로 시작하고 점검 중이라는 메시지                   | 게임 또는 NEXON Open API 점검 중                       | 점검이 끝난 뒤 다시 실행합니다.                                                             |
| `characterName 값이 비어 있거나 문자열이 아닙니다.`                                      | 캐릭터 이름 미입력                                     | 캐릭터 이름을 입력해 다시 실행합니다.                                                       |

그 밖의 상황은 [FAQ](faq.md)에서 확인해 주세요.

## 5. (선택) API Key 없이 설치 확인하기

API Key를 발급받기 전에 패키지 설치를 확인할 수 있습니다. EA SPORTS FC 온라인의 매치 종류나 퍼스트 디센던트의 계승자 목록 같은 **게임 기본 데이터는 넥슨 서버가 API Key를 검사하지 않습니다.** `apiKey`에 임시 문자열을 지정해 조회할 수 있습니다(2026년 11월 24일 실서버에서 확인).

아래 내용을 `check.mjs`로 저장하고 `node check.mjs`로 실행합니다.

```js
import { NexonClient } from 'nexon-open-api';

// 게임 기본 데이터는 키를 검사하지 않으므로 임시 문자열을 넣는다
const client = new NexonClient({ apiKey: 'no-key-needed' });

// EA SPORTS FC 온라인 매치 종류
const matchTypes = await client.fcOnline.getMatchTypeMeta();
for (const type of matchTypes) {
  console.log(type.matchtype, type.desc);
}

// 퍼스트 디센던트 계승자 목록 (한국어)
const descendants = await client.firstDescendant.meta.getDescendant('ko');
const names = descendants.slice(0, 5).map((d) => d.descendant_name);
console.log(`계승자 ${descendants.length}명: ${names.join(', ')} ...`);
```

```
30 리그 친선
40 클래식 1on1
50 공식경기
52 감독모드
60 공식 친선
204 볼타 친선
214 볼타 공식
224 볼타 AI대전
234 볼타 커스텀
계승자 37명: 세레나, 얼티밋 블레어, 넬, 얼티밋 루나, 해리스 ...
```

목록은 게임 업데이트에 따라 달라집니다. 캐릭터·계정 정보처럼 그 밖의 조회는 임시 문자열로는 되지 않고 `[OPENAPI00005]` 에러가 납니다.

## 6. 디스코드 봇에서 사용하기

봇과 웹사이트 모두 **입력 받기 → 데이터 조회 → 응답 작성** 순서로 처리합니다. 다음 예제는 별도의 라이브러리 없이 `!정보 캐릭터명` 명령에 응답하는 함수입니다. `bot.mjs`로 저장하고 `node --env-file=.env bot.mjs`로 실행합니다.

```js
import { NexonClient, NexonNotFoundError, NexonRateLimitError } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

// 같은 캐릭터를 다시 조회할 때 캐시를 사용해 호출량을 줄입니다.
const cache = new Map();
const CACHE_MS = 5 * 60 * 1000;

async function getCharacterSummary(characterName) {
  const saved = cache.get(characterName);
  if (saved && Date.now() - saved.savedAt < CACHE_MS) return saved.text;

  const ocid = await client.maplestory.getOcid(characterName);
  const basic = await client.maplestory.character.getBasic({ ocid });
  const text = `${basic.character_name} · ${basic.world_name} · Lv.${basic.character_level} ${basic.character_class}`;

  cache.set(characterName, { text, savedAt: Date.now() });
  return text;
}

/** 채팅 한 줄을 받아 답할 문장을 돌려준다. 명령이 아니면 null */
async function handleMessage(message) {
  if (!message.startsWith('!정보')) return null;

  const characterName = message.slice('!정보'.length).trim();
  if (!characterName) return '사용법: !정보 캐릭터명';

  try {
    return await getCharacterSummary(characterName);
  } catch (err) {
    if (err instanceof NexonNotFoundError) {
      return `'${characterName}' 캐릭터를 찾을 수 없어요. 이름을 다시 확인해 주세요.`;
    }
    if (err instanceof NexonRateLimitError) {
      return '지금 조회가 몰리고 있어요. 조금 뒤 다시 시도해 주세요.';
    }
    console.error(err); // 키 문제, 넥슨 서버 오류 등은 운영자가 확인한다
    return '조회 중 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.';
  }
}

// 시험 삼아 채팅 세 줄을 넣어 본다
for (const message of ['안녕하세요', '!정보', '!정보 캐릭터명']) {
  console.log(`> ${message}`);
  console.log(await handleMessage(message));
}
```

```
> 안녕하세요
null
> !정보
사용법: !정보 캐릭터명
> !정보 캐릭터명
캐릭터명 · 스카니아 · Lv.275 아크메이지(불,독)
```

디스코드 봇에서는 discord.js 등의 라이브러리가 채팅을 수신할 때 `handleMessage`를 호출하고 반환된 문장을 답장으로 보냅니다. 웹사이트에서는 서버가 함수의 결과를 브라우저에 전달합니다. API Key는 봇 또는 서버의 Node.js 환경에서 관리합니다. 방문자의 브라우저에서 실행되는 코드에 공개되지 않도록 관리해 주세요.

## 7. CommonJS와 TypeScript

### CommonJS (`require`)

`require`를 쓰는 기존 프로젝트에서도 그대로 동작합니다. `require` 방식에서는 맨 바깥에서 `await`를 쓸 수 없으므로 `async function main()`으로 감쌉니다. `index.cjs`로 저장하고 `node --env-file=.env index.cjs 캐릭터명`으로 실행합니다.

```js
const { NexonClient, NexonError } = require('nexon-open-api');

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

async function main() {
  const ocid = await client.maplestory.getOcid(process.argv[2] ?? '캐릭터명');
  const basic = await client.maplestory.character.getBasic({ ocid });
  console.log(`${basic.character_name} Lv.${basic.character_level}`);
}

main().catch((err) => {
  if (err instanceof NexonError) {
    console.error(`조회하지 못했습니다: ${err.message}`);
  } else {
    console.error(err);
  }
  process.exitCode = 1;
});
```

### TypeScript

라이브러리는 TypeScript 5.0 이상에서 사용할 수 있는 타입을 제공합니다. 응답 타입은 편집기 자동완성에서 확인할 수 있습니다. 캐릭터 식별자(ocid)는 전용 타입 `OCID`를 사용하며, 다른 문자열을 전달하면 타입 검사에서 확인할 수 있습니다.

```bash
npm install -D typescript tsx @types/node
```

`index.ts`로 저장하고 `npx tsx --env-file=.env index.ts 캐릭터명`으로 실행합니다.

```ts
import { NexonClient, NexonError } from 'nexon-open-api';
import type { CharacterBasic, OCID } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

function describe(basic: CharacterBasic): string {
  return `${basic.character_name} · ${basic.world_name} · Lv.${basic.character_level} ${basic.character_class}`;
}

try {
  const ocid: OCID = await client.maplestory.getOcid(process.argv[2] ?? '캐릭터명');
  const basic = await client.maplestory.character.getBasic({ ocid });
  console.log(describe(basic));
} catch (err) {
  if (err instanceof NexonError) {
    console.error(`조회하지 못했습니다: ${err.message}`);
  } else {
    throw err;
  }
}
```

`tsc`로 직접 컴파일한다면 `tsconfig.json`의 `module`을 `NodeNext`(또는 번들러를 쓸 때 `moduleResolution: "Bundler"`)로 둡니다.

## 8. 다음 단계

- **게임별 문서** — 게임마다 조회할 수 있는 항목과 예제가 있습니다. [README의 문서 표](../README.md#문서)에서 게임을 선택해 주세요.
- **[FAQ](faq.md)** — "캐릭터를 못 찾아요", "오늘 데이터가 안 나와요", "너무 자주 호출했대요" 같은 상황별 해결
- **[`examples/`](../examples/README.md)** — 복사해서 바로 실행하는 예제 모음
- **[에러 처리](../README.md#에러-처리)** — 상황별 에러 종류
- **[서비스 공개 체크리스트](service-checklist.md)** — 봇이나 사이트를 공개하기 전에 확인할 API Key 관리, 호출 허용량, 캐시, 출처 표기
- **[라이브러리 기능 및 비교](why.md)** — 직접 호출하는 코드와의 비교 및 AI 코딩 도구 사용 안내
