# 시작 가이드

게임은 잘 알지만 개발은 처음인 분을 기준으로, 설치부터 캐릭터 정보를 화면에 찍어 보는 데까지 안내합니다. 이미 Node.js 프로젝트가 있다면 [2. API 키 발급받기](#2-api-키-발급받기)부터 보세요.

## 1. 준비물과 프로젝트 만들기

**Node.js 18 이상**이 필요합니다. 터미널(Windows는 PowerShell, macOS는 터미널)에서 버전을 확인합니다.

```bash
node -v
```

`v18` 보다 낮거나 명령을 찾을 수 없다고 나오면 [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치합니다. 이 가이드의 실행 명령은 Node.js 20.6 이상을 기준으로 합니다.

에디터는 [VS Code](https://code.visualstudio.com/)를 권장합니다. `basic.` 까지만 입력해도 `character_level`(레벨), `character_class`(직업) 같은 응답 필드가 설명과 함께 자동완성으로 나오기 때문에, 문서를 뒤지지 않고 원하는 값을 찾을 수 있습니다.

새 폴더를 만들고 그 안에서 프로젝트를 시작합니다.

```bash
mkdir my-nexon-app
cd my-nexon-app
npm init -y
npm pkg set type=module
npm install nexon-open-api
```

- `npm init -y` 는 프로젝트 정보 파일(`package.json`)을 만듭니다.
- `npm pkg set type=module` 은 이 프로젝트의 `.js` 파일에서 `import` 와 맨 바깥의 `await` 를 쓸 수 있게 합니다. 이 설정을 하지 않았다면 파일 확장자를 `.mjs` 로 하면 됩니다. 이 가이드는 어느 쪽이든 동작하도록 `.mjs` 를 씁니다.

## 2. API 키 발급받기

API 키는 "이 프로그램이 넥슨 데이터를 조회해도 된다"는 허가증입니다. 넥슨의 공식 안내는 [사전 준비하기](https://openapi.nexon.com/ko/guide/prepare-in-advance/)에 있고, 순서는 다음과 같습니다.

1. [넥슨 Open API](https://openapi.nexon.com/) 오른쪽 위의 **로그인** 버튼으로 넥슨 ID에 로그인합니다.
2. **내 애플리케이션 > 애플리케이션 등록**으로 들어가 애플리케이션 정보를 적습니다.
   - **게임 선택**: 데이터를 조회할 게임을 고릅니다.
   - **애플리케이션 타입 선택**: 처음에는 **개발 단계**를 고릅니다. 서비스명만 적으면 됩니다. **서비스 단계**는 서비스명, 개발 환경, URL 정보, 소개, 대표 이미지가 필요합니다.
3. 이용 약관에 동의하고 등록합니다.
4. 등록이 끝나면 API 키가 자동으로 발급됩니다. **내 애플리케이션 > 애플리케이션 목록 > 애플리케이션 상세 페이지**에서 확인합니다.

알아 둘 점:

- **API 키는 게임마다 따로입니다.** 애플리케이션을 등록할 때 게임을 고르므로, 메이플스토리와 FC 온라인을 모두 다루려면 애플리케이션을 두 개 등록해 키를 두 개 받습니다.
- **개발 단계 키는 하루 1,000건, 1초에 5건까지** 호출할 수 있습니다. 혼자 만들고 시험하기에는 충분하지만, 여러 사람이 쓰는 봇이나 사이트를 공개할 때는 서비스 단계(하루 20,000,000건, 1초에 500건)로 새로 등록해 키를 다시 받습니다 (2026-11-24 넥슨 안내 기준).
- 키가 노출됐다면 애플리케이션 상세 페이지에서 키를 추가로 발급받아 교체합니다.

## 3. `.env` 파일로 키 관리하기

키를 코드에 직접 적으면 코드를 공유하거나 GitHub에 올릴 때 키도 함께 공개됩니다. 그래서 키는 `.env` 라는 별도 파일에 둡니다.

프로젝트 폴더에 `.env` 파일을 만들고 발급받은 키를 적습니다. 등호 앞뒤에 공백이나 따옴표를 넣지 않습니다.

```
NEXON_API_KEY=발급받은_키
```

값에 `#` 이 들어가면 큰따옴표로 감쌉니다. 따옴표가 없으면 `#` 부터 뒤가 주석으로 읽혀 잘립니다. 예를 들어 퍼스트 디센던트 닉네임은 `TFD_USER_NAME="닉네임#1234"` 처럼 적습니다.

GitHub에 올릴 계획이 있다면 같은 폴더에 `.gitignore` 파일을 만들고 아래 두 줄을 적습니다. 이 파일에 적힌 것은 올라가지 않습니다.

```
.env
node_modules/
```

실행할 때 `--env-file=.env` 를 붙이면 Node.js가 이 파일을 읽어 `process.env.NEXON_API_KEY` 로 넘겨줍니다.

```bash
node --env-file=.env index.mjs
```

`--env-file` 은 Node.js 20.6 이상에서 동작합니다. 그보다 낮은 버전에서는 `npm install dotenv` 로 dotenv를 설치하고, 코드 맨 첫 줄에 `import 'dotenv/config';` 를 추가한 뒤 `node index.mjs` 로 실행합니다.

여러 게임의 키를 쓴다면 `NEXON_MAPLESTORY_API_KEY`, `NEXON_FC_ONLINE_API_KEY` 처럼 게임 이름을 넣어 구분합니다.

## 4. 첫 실행: 메이플스토리 캐릭터 정보 출력

메이플스토리 키를 기준으로 설명합니다. 아래 내용을 `index.mjs` 로 저장합니다.

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
  // 1단계: 캐릭터 이름으로 고유 번호(OCID)를 받는다
  const ocid = await client.maplestory.getOcid(characterName);

  // 2단계: 고유 번호로 원하는 정보를 조회한다
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

기본 원리는 **이름 → 고유 번호 → 정보** 두 단계입니다. 캐릭터마다 붙는 고유 번호를 OCID라고 하고, 캐릭터 이름으로 먼저 받아 둔 뒤 정보를 조회할 때 넣습니다. FC 온라인이나 서든어택처럼 계정(닉네임) 단위인 게임은 OUID라고 부릅니다.

방금 게임에서 바꾼 장비가 바로 보이지 않을 수 있습니다. 넥슨 안내에 따르면 메이플스토리 게임 데이터는 평균 15분 뒤에 확인할 수 있습니다. `getBasic({ ocid, date: '2026-11-23' })` 처럼 날짜를 넣으면 그날의 데이터를 조회합니다 ([FAQ](faq.md#오늘-데이터가-안-나와요--예전-장비가-나와요)).

### 첫 실행에서 자주 나는 에러

| 화면에 나온 메시지                                                      | 원인                                                                         | 해결                                                                                   |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `SyntaxError: Cannot use import statement outside a module`             | 파일이 `.js` 인데 `type=module` 설정이 없다                                  | 파일 이름을 `index.mjs` 로 바꾸거나 `npm pkg set type=module` 을 실행한다              |
| `Cannot find package 'nexon-open-api'`                                  | 이 폴더에 라이브러리가 설치되지 않았다                                       | 코드가 있는 폴더에서 `npm install nexon-open-api` 를 실행한다                          |
| `node: bad option: --env-file=.env`                                     | Node.js가 20.6보다 낮다                                                      | Node.js를 올리거나 위의 dotenv 방법을 쓴다                                             |
| `NEXON_API_KEY 가 비어 있습니다` 또는 `API 키가 비어 있습니다.`         | `--env-file=.env` 를 빼먹었거나, `.env` 가 다른 폴더에 있거나, 이름이 다르다 | `.env` 가 `index.mjs` 와 같은 폴더에 있는지, 안의 이름이 `NEXON_API_KEY` 인지 확인한다 |
| `[OPENAPI00005] The apikey is not valid.`                               | 키가 잘못됐다                                                                | 키를 다시 복사해 붙여 넣는다. 앞뒤에 공백이나 따옴표가 붙지 않았는지 확인한다          |
| `[OPENAPI00002]` 로 시작하고 이 키로는 이 API를 쓸 수 없다는 메시지     | 이 키로 조회할 수 없는 API다                                                 | 키를 발급받은 게임과 조회하려는 게임이 같은지 확인한다                                 |
| `[OPENAPI00003]` 으로 시작하고 캐릭터를 찾을 수 없다는 메시지           | 그 이름의 캐릭터를 찾지 못했다                                               | 캐릭터 이름에 오타가 없는지 확인한다                                                   |
| `[OPENAPI00010]` 또는 `[OPENAPI00011]` 로 시작하고 점검 중이라는 메시지 | 게임 또는 넥슨 Open API가 점검 중이다                                        | 점검이 끝난 뒤 다시 실행한다                                                           |
| `characterName 값이 비어 있거나 문자열이 아닙니다.`                     | 캐릭터 이름이 빈칸이다                                                       | 이름을 넣어 다시 실행한다                                                              |

그 밖의 상황은 [FAQ](faq.md)에서 찾아보세요.

## 5. (선택) 키 없이 설치 확인하기

키를 받기 전에 설치가 잘 됐는지만 먼저 확인할 수 있습니다. FC 온라인의 매치 종류나 퍼스트 디센던트의 계승자 목록 같은 **게임 기본 데이터는 넥슨 서버가 API 키를 검사하지 않습니다.** 그래서 `apiKey` 에 아무 문자열이나 넣어도 조회됩니다 (2026-11-24 실제 서버로 확인).

아래 내용을 `check.mjs` 로 저장하고 `node check.mjs` 로 실행합니다.

```js
import { NexonClient } from 'nexon-open-api';

// 게임 기본 데이터는 키를 검사하지 않으므로 임시 문자열을 넣는다
const client = new NexonClient({ apiKey: 'no-key-needed' });

// FC 온라인 매치 종류
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

## 6. 디스코드 봇처럼 쓰기

봇이든 웹사이트든 흐름은 같습니다. **명령을 받는다 → 넥슨 데이터를 조회한다 → 보여 줄 문장을 만든다.** 아래는 `!정보 캐릭터명` 명령에 답하는 함수를 외부 라이브러리 없이 만든 것입니다. `bot.mjs` 로 저장하고 `node --env-file=.env bot.mjs` 로 실행합니다.

```js
import { NexonClient, NexonNotFoundError, NexonRateLimitError } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

// 같은 캐릭터를 연달아 물어보면 넥슨에 다시 묻지 않고 저장해 둔 답을 쓴다 (호출 한도 절약)
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

실제 디스코드 봇에서는 discord.js 같은 라이브러리가 채팅을 받을 때마다 `handleMessage` 를 부르고, 돌려받은 문장을 답장으로 보내면 됩니다. 웹사이트라면 내 서버가 이 함수의 결과를 웹페이지에 내려 줍니다. API 키는 봇이나 서버 쪽에만 두고, 방문자의 브라우저에서 실행되는 코드에는 넣지 않습니다.

## 7. CommonJS와 TypeScript

### CommonJS (`require`)

`require` 를 쓰는 기존 프로젝트에서도 그대로 동작합니다. `require` 방식에서는 맨 바깥에서 `await` 를 쓸 수 없으므로 `async function main()` 으로 감쌉니다. `index.cjs` 로 저장하고 `node --env-file=.env index.cjs 캐릭터명` 으로 실행합니다.

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

타입이 라이브러리에 들어 있어 따로 설치할 것이 없습니다 (TypeScript 5.0 이상). 응답 타입 이름은 에디터 자동완성으로 확인할 수 있고, 고유 번호(`OCID`)는 전용 타입이라 다른 문자열을 실수로 넣으면 에디터가 바로 알려 줍니다.

```bash
npm install -D typescript tsx @types/node
```

`index.ts` 로 저장하고 `npx tsx --env-file=.env index.ts 캐릭터명` 으로 실행합니다.

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

`tsc` 로 직접 컴파일한다면 `tsconfig.json` 의 `module` 을 `NodeNext`(또는 번들러를 쓸 때 `moduleResolution: "Bundler"`)로 둡니다.

## 8. 다음 단계

- **게임별 문서** — 게임마다 조회할 수 있는 항목과 예제가 있습니다. [README의 문서 표](../README.md#문서)에서 게임을 고르세요.
- **[FAQ](faq.md)** — "캐릭터를 못 찾아요", "오늘 데이터가 안 나와요", "너무 자주 호출했대요" 같은 상황별 해결
- **[`examples/`](../examples/README.md)** — 복사해서 바로 실행하는 예제 모음
- **[에러 처리](../README.md#에러-처리)** — 상황별 에러 종류와 봇 응답 예제
