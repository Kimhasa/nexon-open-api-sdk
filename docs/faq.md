# FAQ — 자주 겪는 상황과 해결

만들다가 막혔을 때 보는 문서입니다. 상황마다 **증상 → 원인 → 해결** 순서로 적었습니다. 코드 조각은 [시작 가이드](getting-started.md)처럼 `client` 를 만들어 둔 상태를 가정합니다.

- [캐릭터를 못 찾아요](#캐릭터를-못-찾아요)
- [오늘 데이터가 안 나와요 / 예전 장비가 나와요](#오늘-데이터가-안-나와요--예전-장비가-나와요)
- [점검 중이라고 나와요](#점검-중이라고-나와요)
- [API 키가 잘못됐다고 나와요](#api-키가-잘못됐다고-나와요)
- [입력이 잘못됐다고 나와요 (`NexonBadRequestError`)](#입력이-잘못됐다고-나와요-nexonbadrequesterror)
- [너무 자주 호출했다고 나와요](#너무-자주-호출했다고-나와요)
- [웹페이지에서 바로 부르고 싶어요](#웹페이지에서-바로-부르고-싶어요)
- [`await` 에서 문법 에러가 나요](#await-에서-문법-에러가-나요)
- [응답이 실제 게임과 달라요](#응답이-실제-게임과-달라요)
- [던전앤파이터·사이퍼즈는 왜 없나요](#던전앤파이터사이퍼즈는-왜-없나요)

## 캐릭터를 못 찾아요

**증상** — `getOcid()` 나 `getOuid()` 에서 `NexonNotFoundError` (`OPENAPI00003`)가 납니다.

**원인과 해결**

- **오타·띄어쓰기** — 이름은 게임에 표시되는 그대로 넣습니다. 채팅에서 받은 입력이라면 앞뒤 공백을 `trim()` 으로 지우고 넘깁니다.
- **닉네임 변경** — 바꾸기 전 이름으로는 찾을 수 없습니다. 새 이름으로 조회합니다. 고유 번호(OCID·OUID)를 저장해 두는 서비스라면, 넥슨 안내대로 게임 콘텐츠 변경으로 번호가 바뀔 수 있으니 조회가 안 될 때 이름으로 다시 받습니다.
- **월드·서버를 함께 넣어야 하는 게임** — 이름만으로는 캐릭터를 특정할 수 없는 게임이 있습니다.

| 게임                       | 이름과 함께 넣는 것                             | 예                                                           |
| -------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| 메이플스토리M              | 월드 이름 (앞에 넣는다)                         | `client.maplestorym.getOcid('스카니아', '캐릭터명')`         |
| 바람의나라, 바람의나라: 연 | 서버 이름 (뒤에 넣는다)                         | `client.baram.getOcid('캐릭터명', '연')`                     |
| 메이플스토리 길드          | 월드 이름                                       | `client.maplestory.guild.getId('길드명', '스카니아')`        |
| 퍼스트 디센던트            | `#` 뒤 태그까지 포함한 닉네임 (대소문자 구분)   | `client.firstDescendant.getOuid('닉네임#1234')`              |
| 카트라이더 러쉬플러스      | 라이더명 그대로 (`\|` 문자는 SDK가 알아서 변환) | `client.kartrider.getOuidInfo('라이더명')` — 결과가 목록이다 |

- **다른 게임의 캐릭터** — 메이플스토리와 메이플스토리M, 바람의나라와 바람의나라: 연은 서로 다른 게임입니다. `client.maplestory` 와 `client.maplestorym` 을 구분해 부릅니다.

```js
import { NexonNotFoundError } from 'nexon-open-api';

async function findCharacter(input) {
  try {
    return await client.maplestory.getOcid(input.trim());
  } catch (err) {
    if (err instanceof NexonNotFoundError) return null; // 없는 캐릭터
    throw err;
  }
}

console.log(await findCharacter(' 캐릭터명 '));
```

## 오늘 데이터가 안 나와요 / 예전 장비가 나와요

**증상** — 방금 바꾼 장비가 조회 결과에 없습니다. 또는 날짜를 지정했더니 `NexonDataNotReadyError` (`OPENAPI00009`)가 납니다.

**원인** — 넥슨 API의 데이터는 게임 화면과 실시간으로 같지 않습니다. 넥슨이 포털에 안내한 기준은 게임마다 다릅니다.

| 게임·데이터                                                         | 넥슨 안내                                                                                                                                |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 메이플스토리, MapleStorySEA, MapleStory Taiwan                      | 게임 데이터는 평균 15분 뒤 확인 가능. 지난 날짜의 데이터는 다음 날 오전 2시부터 확인 가능 (메이플스토리는 한국 시간, SEA·Taiwan은 UTC+8) |
| 메이플스토리 랭킹                                                   | 오늘의 랭킹은 오전 9시 30분쯤부터 조회 가능                                                                                              |
| 메이플스토리M, 마비노기, 마비노기 영웅전, 서든어택, 퍼스트 디센던트 | 게임 데이터는 평균 10분 뒤 확인 가능                                                                                                     |
| 메이플스토리M 랭킹                                                  | 매일 오전 2시 30분쯤 하루 한 번 집계                                                                                                     |
| 퍼스트 디센던트 리더보드                                            | 평균 1시간 단위로 갱신                                                                                                                   |

일부 정보는 특정 행동을 해야 갱신됩니다. 예를 들어 서든어택의 계급·티어 정보는 게임 접속을 종료할 때 갱신된다고 안내되어 있습니다. 게임별 기준은 각 게임 문서에 있습니다.

**해결**

- **방금 바꾼 내용이 안 보인다** — 잠시 기다렸다가 다시 조회합니다. 봇이라면 "데이터는 평균 15분 정도 늦게 반영돼요" 같은 안내를 함께 보여 주면 문의가 줄어듭니다.
- **`date` 를 생략하면 가장 최근 데이터를 조회합니다.** 게임에서 바뀐 내용은 평균 15분 뒤 반영됩니다. `date` 를 넣으면 그날 0시~24시의 데이터를 조회합니다.
- **`date` 를 지정했는데 `NexonDataNotReadyError` 가 난다** — 그 날짜의 데이터가 아직 준비되지 않았습니다(`OPENAPI00009` 데이터 준비 중). 메이플스토리의 지난 날짜 데이터는 다음 날 오전 2시(한국 시간)부터 볼 수 있습니다. 날짜를 하루 전으로 바꾸거나 `date` 를 빼고 조회합니다. 메이플스토리 캐릭터 정보는 2023년 12월 21일 데이터부터 조회할 수 있습니다.
- **점검 중일 때는 다른 에러가 납니다.** [점검 중이라고 나와요](#점검-중이라고-나와요)를 보세요.
- **날짜는 `YYYY-MM-DD` 로** — 메이플스토리는 한국 시간, MapleStorySEA·Taiwan은 현지 시간(UTC+8) 기준입니다. `toNexonDate()` 를 쓰면 기준 시간대에 맞는 날짜 문자열을 만들 수 있습니다.

```js
import { NexonDataNotReadyError, toNexonDate } from 'nexon-open-api';

const ocid = await client.maplestory.getOcid('캐릭터명');

// 한국 시간(UTC+9 = 540분) 기준 어제 날짜
const yesterday = toNexonDate(new Date(Date.now() - 24 * 60 * 60 * 1000), 540);

try {
  const basic = await client.maplestory.character.getBasic({ ocid, date: yesterday });
  console.log(`${yesterday} 기준 레벨 ${basic.character_level}`);
} catch (err) {
  if (err instanceof NexonDataNotReadyError) {
    console.log(`${yesterday} 데이터가 아직 준비되지 않았어요.`);
  } else {
    throw err;
  }
}
```

## 점검 중이라고 나와요

**증상** — `NexonMaintenanceError` 가 나고, 메시지가 `[OPENAPI00010]` 또는 `[OPENAPI00011]` 로 시작합니다.

**원인** — 게임이 정기·임시 점검 중이면 그 게임의 API도 응답하지 않습니다(`OPENAPI00010` 게임 점검 중). 넥슨 Open API 자체가 점검 중일 때도 있습니다(`OPENAPI00011` API 점검 중). 내 코드나 입력의 문제가 아닙니다.

**해결** — 점검이 끝난 뒤 다시 조회합니다. 봇이라면 "조회 실패" 대신 점검 중이라고 알려 주세요. `NexonMaintenanceError` 는 `NexonServerError` 의 한 종류라서, 둘을 나눠 안내하려면 `NexonMaintenanceError` 를 **먼저** 검사해야 합니다.

```js
import { NexonMaintenanceError, NexonServerError } from 'nexon-open-api';

async function replyLevel(characterName) {
  try {
    const ocid = await client.maplestory.getOcid(characterName);
    const basic = await client.maplestory.character.getBasic({ ocid });
    return `${basic.character_name} Lv.${basic.character_level}`;
  } catch (err) {
    // NexonServerError 보다 먼저 검사해야 점검 안내가 나간다
    if (err instanceof NexonMaintenanceError) {
      return '지금은 게임 점검 중이에요. 점검이 끝나면 다시 시도해 주세요.';
    }
    if (err instanceof NexonServerError) {
      return '넥슨 서버에 문제가 있어요. 잠시 뒤 다시 시도해 주세요.';
    }
    throw err;
  }
}

console.log(await replyLevel('캐릭터명'));
```

넥슨 Open API의 점검 공지는 [넥슨 Open API 공지](platform.md)(`client.platform.getNoticeList()`)로, 게임 점검 일정은 각 게임의 공지사항으로 확인합니다.

## API 키가 잘못됐다고 나와요

상황에 따라 나오는 메시지가 다릅니다.

| 증상                                                                           | 원인                                                        | 해결                                                                                                                                 |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `NexonBadRequestError` — `API 키가 비어 있습니다.` (클라이언트를 만들 때 바로) | `apiKey` 가 없거나 공백뿐이다. `.env` 를 읽지 못했다        | 실행 명령에 `--env-file=.env` 가 있는지, `.env` 안의 이름이 코드의 `process.env.이름` 과 같은지, 등호 뒤에 키가 적혀 있는지 확인한다 |
| `NexonAuthError` — `[OPENAPI00005] The apikey is not valid.`                   | 키 문자열이 틀렸다                                          | 넥슨 Open API의 애플리케이션 상세 페이지에서 키를 다시 복사한다. 앞뒤 공백·따옴표가 없는지 확인한다                                  |
| `NexonAuthError` — `[OPENAPI00002]` 로 시작하는 메시지                         | 이 키로는 이 API를 쓸 수 없다 (넥슨 안내: 권한이 없는 경우) | 키를 발급받은 게임과 조회하려는 게임이 같은지 확인한다                                                                               |
| 한 게임은 되는데 다른 게임에서만 키 관련 에러가 난다                           | 다른 게임으로 발급받은 키를 넣었다                          | 그 게임으로 애플리케이션을 등록해 키를 따로 받는다                                                                                   |

**키는 게임마다 따로입니다.** 여러 게임을 다룬다면 키와 클라이언트를 게임마다 나눕니다. 아래는 `games.mjs` 로 저장하고 `node --env-file=.env games.mjs` 로 실행하는 예입니다.

```js
import { NexonClient } from 'nexon-open-api';

// .env 에 NEXON_MAPLESTORY_API_KEY, NEXON_FC_ONLINE_API_KEY 를 각각 적어 둔다
const maple = new NexonClient({ apiKey: process.env.NEXON_MAPLESTORY_API_KEY ?? '' });
const fc = new NexonClient({ apiKey: process.env.NEXON_FC_ONLINE_API_KEY ?? '' });

const ocid = await maple.maplestory.getOcid('캐릭터명');
const ouid = await fc.fcOnline.getOuid('닉네임');
console.log(ocid, ouid);
```

키 발급 순서는 [시작 가이드](getting-started.md#2-api-키-발급받기)에 있습니다.

## 입력이 잘못됐다고 나와요 (`NexonBadRequestError`)

**증상** — `NexonBadRequestError` (`OPENAPI00004`)가 나고, 메시지에 어떤 값이 왜 틀렸는지 적혀 있습니다.

**원인** — 빈 이름, 달력에 없는 날짜(`2026-02-30`), 허용되지 않는 서버 이름처럼 넥슨에 보내 봐야 실패할 입력은 SDK가 **요청을 보내기 전에** 걸러 냅니다. 호출 한도를 쓰지 않고 바로 알려 주기 위해서입니다. SDK가 거르지 못한 값을 넥슨 서버가 거부했을 때도 같은 에러가 납니다.

**해결** — `err.message` 를 읽으면 됩니다. 허용되는 값이나 올바른 사용 예가 들어 있습니다.

```js
import { NexonBadRequestError } from 'nexon-open-api';

try {
  await client.maplestory.getOcid('');
} catch (err) {
  if (err instanceof NexonBadRequestError) {
    console.log(err.message);
    // characterName 값이 비어 있거나 문자열이 아닙니다. 조회할 캐릭터명을 전달하세요. 예: client.maplestory.getOcid('캐릭터명')
  } else {
    throw err;
  }
}
```

사용자 입력을 그대로 넘기는 봇이라면, 이 에러를 잡아서 "사용법: !정보 캐릭터명" 같은 안내로 바꿔 보여 주세요. 선택지가 정해진 값(마비노기 서버 이름, 경매장 카테고리 등)은 에디터 자동완성에 허용값이 나옵니다.

## 너무 자주 호출했다고 나와요

**증상** — `NexonRateLimitError` (`OPENAPI00007`)가 납니다.

**원인** — API 키마다 호출 한도가 있습니다. 넥슨 안내 기준(2026-11-24)으로 개발 단계 키는 **1초에 5건, 하루 1,000건**, 서비스 단계 키는 1초에 500건, 하루 20,000,000건입니다. 한도는 애플리케이션별로 합산됩니다. 캐릭터 한 명을 보여 주는 데 조회를 4번 쓴다면, 개발 단계 키로는 하루 250명만 조회할 수 있습니다.

SDK는 넥슨 서버가 "너무 잦다"(HTTP 429)고 답하면 잠시 기다렸다가 자동으로 다시 시도합니다(기본 3회). 이 에러는 그러고도 실패했을 때 나옵니다.

**해결**

- **결과를 저장해 두고 다시 씁니다(캐싱).** 같은 캐릭터를 몇 분 안에 다시 물어보면 넥슨에 묻지 않고 저장해 둔 값을 돌려줍니다. 가장 효과가 큽니다. [시작 가이드의 봇 예제](getting-started.md#6-디스코드-봇처럼-쓰기)에 간단한 구현이 있습니다.
- **한꺼번에 많이 부르지 않습니다.** 길드원 100명을 `Promise.all` 로 동시에 조회하면 1초 한도를 바로 넘습니다. 몇 명씩 나눠 순서대로 조회합니다.
- **서비스를 공개할 때는 서비스 단계 키로 바꿉니다.**
- 재시도 횟수와 대기 시간은 옵션으로 조절할 수 있습니다.

```js
import { NexonClient, NexonRateLimitError } from 'nexon-open-api';

const patient = new NexonClient({
  apiKey: process.env.NEXON_API_KEY ?? '',
  maxRetries: 5, // 자동 재시도 횟수 (기본 3)
  retryBaseDelayMs: 1000, // 재시도 전 기본 대기 시간 (기본 500). 시도마다 두 배로 늘어난다
});

try {
  const ocid = await patient.maplestory.getOcid('캐릭터명');
  console.log(ocid);
} catch (err) {
  if (err instanceof NexonRateLimitError) {
    // retryAfterMs: 넥슨 서버가 알려 준 대기 시간. 알려 주지 않으면 undefined
    console.log(`잠시 뒤 다시 시도하세요 (${err.retryAfterMs ?? 1000}ms 뒤)`);
  } else {
    throw err;
  }
}
```

## 웹페이지에서 바로 부르고 싶어요

**증상** — HTML/React 같은 웹페이지 코드에서 이 라이브러리를 직접 쓰고 싶습니다.

**원인** — 웹페이지의 코드는 방문자의 브라우저로 그대로 전송됩니다. 거기에 API 키를 넣으면 방문자 누구나 개발자 도구로 키를 볼 수 있고, 그 키로 내 호출 한도를 다 써 버릴 수 있습니다.

**해결** — 키는 서버나 봇(Node.js)에만 둡니다. 웹사이트는 **웹페이지 → 내 서버 → 넥슨 API** 순서로 거치게 만듭니다. 아래는 외부 라이브러리 없이 Node.js만으로 만든 가장 작은 서버입니다. `server.mjs` 로 저장하고 `node --env-file=.env server.mjs` 로 실행한 뒤, 브라우저에서 `http://localhost:3000/character?name=캐릭터명` 을 엽니다.

```js
import { createServer } from 'node:http';
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (url.pathname !== '/character') {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: '없는 주소입니다.' }));
    return;
  }

  try {
    const ocid = await client.maplestory.getOcid(url.searchParams.get('name') ?? '');
    const basic = await client.maplestory.character.getBasic({ ocid });
    // 웹페이지에 필요한 값만 골라서 내려 준다. API 키는 서버 밖으로 나가지 않는다
    res.end(JSON.stringify({ name: basic.character_name, level: basic.character_level }));
  } catch (err) {
    res.statusCode = err instanceof NexonNotFoundError ? 404 : 500;
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
  }
});

server.listen(3000, () => console.log('http://localhost:3000/character?name=캐릭터명'));
```

웹페이지에서는 `fetch('/character?name=캐릭터명')` 처럼 내 서버만 부릅니다. Next.js 같은 프레임워크를 쓴다면 서버에서만 실행되는 코드(API 라우트, 서버 컴포넌트)에서 이 라이브러리를 부르면 됩니다.

## `await` 에서 문법 에러가 나요

**증상** — 다음 중 하나가 나옵니다.

- `SyntaxError: await is only valid in async functions and the top level bodies of modules`
- `SyntaxError: Cannot use import statement outside a module`

**원인** — 자바스크립트 파일에는 두 가지 방식이 있습니다. `import` 를 쓰는 방식(ESM)에서만 파일 맨 바깥에서 `await` 를 쓸 수 있습니다. 이 문서들의 예제는 ESM 기준입니다.

**해결** — 셋 중 하나를 고릅니다.

1. 파일 확장자를 `.mjs` 로 바꿉니다 (`index.js` → `index.mjs`). 가장 간단합니다.
2. 프로젝트 폴더에서 `npm pkg set type=module` 을 실행합니다. 그 프로젝트의 `.js` 파일이 모두 ESM이 됩니다.
3. `require` 방식을 유지하려면 `async function main() { ... }` 으로 감싸고 `main()` 을 부릅니다 ([시작 가이드의 CommonJS 예제](getting-started.md#commonjs-require)).

`await` 를 빼먹어도 문제가 생깁니다. `console.log(client.maplestory.getOcid('캐릭터명'))` 이 `Promise { <pending> }` 을 출력한다면, 조회가 끝나기를 기다리지 않은 것입니다. 조회하는 호출 앞에는 항상 `await` 를 붙입니다.

## 응답이 실제 게임과 달라요

**증상** — 게임 화면의 값과 조회 결과가 다르거나, 문서에 있는 필드가 비어 있거나, 문서에 없는 필드가 옵니다.

**원인과 해결**

- **반영 시간 차이** — 가장 흔한 원인입니다. [오늘 데이터가 안 나와요](#오늘-데이터가-안-나와요--예전-장비가-나와요)를 먼저 확인하세요.
- **넥슨이 응답 구조를 바꿨다** — 게임 업데이트로 필드가 추가되거나 빠질 수 있습니다. `responseValidation: true` 를 켜면 넥슨 응답의 구조가 SDK가 아는 것과 다를 때 알려 줍니다. 에러를 내지는 않고 응답도 그대로 돌려주므로, 개발 중에 켜 두고 확인하는 용도입니다. 응답의 가장 바깥 필드만 검사합니다.

```js
import { NexonClient } from 'nexon-open-api';

const checking = new NexonClient({
  apiKey: process.env.NEXON_API_KEY ?? '',
  responseValidation: true,
  logger: {
    onResponseShapeMismatch: (mismatch) => {
      console.warn('넥슨 응답이 SDK와 다릅니다:', mismatch.url);
      console.warn('빠진 필드:', mismatch.missingKeys, '새 필드:', mismatch.unexpectedKeys);
    },
  },
});

const ocid = await checking.maplestory.getOcid('캐릭터명');
console.log(await checking.maplestory.character.getBasic({ ocid }));
```

`debug: true` 와 함께 켜면 따로 `logger` 를 적지 않아도 콘솔에 경고가 나옵니다.

- **SDK가 틀렸다** — 이 라이브러리는 넥슨 포털의 공식 스펙을 기준으로 만들었고, API 키가 필요한 조회는 아직 실제 키로 전부 확인하지 못했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)). 실제 응답과 다른 점을 발견하면 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 알려 주세요. 게임 이름, 호출한 코드(예: `client.maplestory.character.getStat`), 기대한 값과 실제 값을 적어 주시면 됩니다. **API 키와 실제 캐릭터·계정 이름은 지우고** 올려 주세요.

넥슨 API 자체의 점검·변경 소식은 [넥슨 Open API 공지](platform.md)(`client.platform.getNoticeList()`)로 확인할 수 있습니다.

## 던전앤파이터·사이퍼즈는 왜 없나요

두 게임은 넥슨 Open API가 아니라 [네오플 Developers](https://developers.neople.co.kr/)에서 따로 제공합니다. 주소와 API 키가 달라 이 라이브러리의 범위에 넣지 않았습니다.

---

여기에 없는 문제는 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)에 남겨 주세요.
