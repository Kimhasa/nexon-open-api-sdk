# nexon-open-api

> 넥슨 게임 데이터로 팬사이트·디스코드 봇·전적 검색기를 만드는 분들을 위한 TypeScript/JavaScript 라이브러리

[![npm version](https://img.shields.io/npm/v/nexon-open-api.svg)](https://www.npmjs.com/package/nexon-open-api)
[![CI](https://github.com/Kimhasa/nexon-open-api-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Kimhasa/nexon-open-api-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

캐릭터 이름만 알면 레벨, 장비, 전적, 랭킹을 코드 몇 줄로 가져옵니다. [넥슨 Open API](https://openapi.nexon.com/)가 제공하는 **14개 게임과 Open API 공지**를 모두 지원하는 비공식 라이브러리입니다.

## 무엇을 만들 수 있나요

- **메이플스토리** — 캐릭터 이름으로 레벨·전투력·장착 장비·유니온을 조회하는 스펙 검색기, 스타포스·큐브 기록 분석
- **FC 온라인** — 닉네임으로 최근 공식경기 전적과 역대 최고 등급을 보여 주는 전적 검색기
- **마비노기** — 경매장 시세 알림, 거대한 외침의 뿔피리 모아 보기
- **퍼스트 디센던트** — 계승자·무기·모듈 도감 (이 데이터는 API 키 없이도 받을 수 있습니다)
- **서든어택·마비노기 영웅전·바람의나라 등** — 디스코드 봇의 `!정보 캐릭터명` 같은 명령에 답하기

게임별로 할 수 있는 일은 [지원 게임](#지원-게임)에 있습니다.

## 시작하기

개발이 처음이라면 준비물부터 차근차근 설명하는 [시작 가이드](docs/getting-started.md)를 먼저 보세요.

### ① 설치

Node.js 18 이상이 필요합니다.

```bash
npm install nexon-open-api
```

### ② API 키 받기

[넥슨 Open API](https://openapi.nexon.com/)에 넥슨 ID로 로그인하고 애플리케이션을 등록하면 API 키가 발급됩니다. 자세한 순서는 [시작 가이드의 API 키 발급](docs/getting-started.md#2-api-키-발급받기)에 있습니다.

**API 키는 게임마다 따로입니다.** 애플리케이션을 등록할 때 게임을 고르기 때문에, 메이플스토리로 받은 키로는 FC 온라인을 조회할 수 없습니다.

받은 키는 프로젝트 폴더의 `.env` 파일에 적어 둡니다.

```
NEXON_API_KEY=발급받은_키
```

### ③ 첫 코드: 메이플스토리 캐릭터 요약

아래 내용을 `index.mjs` 로 저장합니다. 파일 확장자가 `.mjs` 여야 `import` 와 맨 바깥의 `await` 를 그대로 쓸 수 있습니다.

```js
import { NexonClient, NexonError } from 'nexon-open-api';

const apiKey = process.env.NEXON_API_KEY;
if (!apiKey) {
  console.error('NEXON_API_KEY 가 비어 있습니다. .env 파일을 확인하세요.');
  process.exit(1);
}

const client = new NexonClient({ apiKey });
const characterName = process.argv[2] ?? '캐릭터명';

try {
  // 1단계: 캐릭터 이름으로 고유 번호(OCID)를 받는다
  const ocid = await client.maplestory.getOcid(characterName);

  // 2단계: 고유 번호로 원하는 정보를 조회한다
  const [basic, stat, union] = await Promise.all([
    client.maplestory.character.getBasic({ ocid }), // 기본 정보
    client.maplestory.character.getStat({ ocid }), // 종합 능력치
    client.maplestory.union.getUnion({ ocid }), // 유니온
  ]);
  const combatPower = stat.final_stat.find((s) => s.stat_name === '전투력')?.stat_value;

  console.log(`${basic.character_name} (${basic.world_name} · ${basic.character_class})`);
  console.log(`레벨 ${basic.character_level} (${basic.character_exp_rate}%)`);
  console.log(`전투력 ${combatPower ? Number(combatPower).toLocaleString('ko-KR') : '정보 없음'}`);
  console.log(`유니온 Lv.${union.union_level} (${union.union_grade})`);
  console.log(`길드 ${basic.character_guild_name || '없음'}`);
} catch (err) {
  if (err instanceof NexonError) {
    // 메시지에 무엇이 틀렸고 어떻게 고치는지 들어 있다
    console.error(`조회하지 못했습니다: ${err.message}`);
  } else {
    throw err;
  }
}
```

조회할 캐릭터 이름을 붙여서 실행합니다 (`--env-file` 은 Node.js 20.6 이상. 그보다 낮으면 [시작 가이드](docs/getting-started.md#3-env-파일로-키-관리하기) 참고).

```bash
node --env-file=.env index.mjs 캐릭터명
```

```
캐릭터명 (스카니아 · 아크메이지(불,독))
레벨 275 (42.31%)
전투력 123,456,789
유니온 Lv.8500 (그랜드 마스터 유니온 1)
길드 길드명
```

더 많은 완성 예제는 [`examples/`](examples/README.md)에 있습니다.

## 기본 원리: 이름 → 고유 번호 → 정보

넥슨 API는 캐릭터 이름으로 바로 정보를 주지 않습니다. 대부분의 게임에서 **두 단계**를 거칩니다.

1. **이름으로 고유 번호를 받는다.** 캐릭터마다 붙는 번호는 OCID, 계정(닉네임)마다 붙는 번호는 OUID라고 부릅니다. 닉네임을 바꿔도 같은 캐릭터를 가리키기 위한 번호입니다.
2. **고유 번호로 정보를 조회한다.** 기본 정보, 장비, 전적 등 원하는 것을 고유 번호를 넣어 부릅니다.

게임마다 이름을 넣는 방법이 조금씩 다릅니다. 아래는 위의 `client` 가 있다고 가정한 조각입니다.

```js
// 메이플스토리: 캐릭터 이름만
const ocid = await client.maplestory.getOcid('캐릭터명');
const equipment = await client.maplestory.character.getItemEquipment({ ocid }); // 장착 장비

// 메이플스토리M: 월드 이름이 먼저 온다
const mOcid = await client.maplestorym.getOcid('스카니아', '캐릭터명');

// 바람의나라: 캐릭터 이름 뒤에 서버 이름
const baramOcid = await client.baram.getOcid('캐릭터명', '연');

// FC 온라인: 구단주 닉네임 → 계정 번호(OUID) → 최근 공식경기(matchtype 50) 10판
const ouid = await client.fcOnline.getOuid('닉네임');
const matchIds = await client.fcOnline.getMatchList({ ouid, matchtype: 50, limit: 10 });

// 퍼스트 디센던트: '#' 뒤 태그까지 포함한 닉네임
const tfdOuid = await client.firstDescendant.getOuid('닉네임#1234');

// 마비노기 경매장처럼 캐릭터와 상관없는 정보는 고유 번호 없이 바로 조회한다
const auction = await client.mabinogi.auction.listItems({ auction_item_category: '검' });
```

- 넥슨 안내에 따르면 게임 콘텐츠 변경으로 고유 번호가 바뀔 수 있습니다. 오래 저장해 둔 번호로 조회가 안 되면 이름으로 다시 받으세요.
- 키가 게임마다 따로이므로, 여러 게임을 다루면 `new NexonClient({ apiKey })` 도 게임 키마다 하나씩 만듭니다.

## 지원 게임

넥슨 Open API 포털의 **14개 게임 전부와 Open API 공지**를 지원합니다 (2026-11-24 포털 기준, API 270개). 넥슨 API가 바뀌면 SDK도 빠르게 따라갑니다. 매주 포털의 변경을 자동으로 확인합니다.

<!-- 아이콘 파일: docs/assets/games/{game}.png -->
<!-- prettier-ignore-start -->
<table width="100%" cellspacing="0" cellpadding="8" style="table-layout:fixed;width:100%">
<tr>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/maplestory.png" alt="메이플스토리" height="64"><h4>메이플스토리</h4><sub>캐릭터 스펙·장비·유니온, 랭킹, 스타포스·큐브 기록</sub><br><br><a href="docs/maplestory.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/maplestory-m.png" alt="메이플스토리M" height="64"><h4>메이플스토리M</h4><sub>캐릭터 스탯·장착 아이템, 길드, 전투력·무릉도장 랭킹</sub><br><br><a href="docs/maplestory-m.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/fc-online.png" alt="EA SPORTS FC 온라인" height="64"><h4>EA SPORTS FC 온라인</h4><sub>공식경기 전적, 역대 최고 등급, 선수 이미지</sub><br><br><a href="docs/fc-online.md">문서 보기</a><br><br></td>
</tr>
<tr>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/maplestory-sea.png" alt="MapleStorySEA" height="64"><h4>MapleStorySEA</h4><sub>MapleStory SEA의 캐릭터·유니온·길드</sub><br><br><a href="docs/maplestory-sea.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/maplestory-taiwan.png" alt="MapleStory Taiwan" height="64"><h4>MapleStory Taiwan</h4><sub>MapleStory Taiwan의 캐릭터·유니온·길드</sub><br><br><a href="docs/maplestory-tw.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/first-descendant.png" alt="퍼스트 디센던트" height="64"><h4>퍼스트 디센던트</h4><sub>계승자·무기·모듈 도감, 장착 정보, 리더보드</sub><br><br><a href="docs/first-descendant.md">문서 보기</a><br><br></td>
</tr>
<tr>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/mabinogi.png" alt="마비노기" height="64"><h4>마비노기</h4><sub>경매장 매물·거래 내역, NPC 상점, 거대한 외침의 뿔피리</sub><br><br><a href="docs/mabinogi.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/mabinogi-heroes.png" alt="마비노기 영웅전" height="64"><h4>마비노기 영웅전</h4><sub>캐릭터 장비·능력치, 거래소 기록, 명예의 전당 랭킹</sub><br><br><a href="docs/mabinogi-heroes.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/sudden-attack.png" alt="서든어택" height="64"><h4>서든어택</h4><sub>계급·티어, 최근 동향, 매치 기록</sub><br><br><a href="docs/sudden-attack.md">문서 보기</a><br><br></td>
</tr>
<tr>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/kartrider-rush-plus.png" alt="카트라이더 러쉬플러스" height="64"><h4>카트라이더 러쉬플러스</h4><sub>라이더 기본 정보·장착 칭호, 시즌 알림판</sub><br><br><a href="docs/kartrider.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/baram-nara.png" alt="바람의나라" height="64"><h4>바람의나라</h4><sub>캐릭터 능력치·장착 아이템·칭호·길드</sub><br><br><a href="docs/baram.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/baram-yeon.png" alt="바람의나라: 연" height="64"><h4>바람의나라: 연</h4><sub>캐릭터 기본 정보·칭호</sub><br><br><a href="docs/baram-yeon.md">문서 보기</a><br><br></td>
</tr>
<tr>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/v4.png" alt="V4" height="64"><h4>V4</h4><sub>캐릭터 기본 정보·명예</sub><br><br><a href="docs/v4.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><img src="docs/assets/games/hit2.png" alt="히트2" height="64"><h4>히트2</h4><sub>캐릭터 기본 정보</sub><br><br><a href="docs/hit2.md">문서 보기</a><br><br></td>
<td align="center" valign="top" width="33%"><br><h4>넥슨 Open API 공지</h4><sub>점검·API 변경 공지 모아 보기</sub><br><br><a href="docs/platform.md">문서 보기</a><br><br></td>
</tr>
</table>
<!-- prettier-ignore-end -->

던전앤파이터와 사이퍼즈는 넥슨 Open API가 아니라 [네오플 Developers](https://developers.neople.co.kr/)에서 따로 제공합니다. 주소와 API 키가 달라 이 라이브러리로는 조회할 수 없습니다.

## 에러 처리

조회에 실패하면 상황에 맞는 에러가 던져집니다. 에러 종류로 나눠서 사용자에게 알맞은 안내를 보여 주세요. 모든 에러의 `message` 에는 무엇이 틀렸고 어떻게 고치는지가 들어 있습니다.

| 이런 상황                                                               | 이런 에러                                                | 이렇게 하세요                                                                                 |
| ----------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 캐릭터명 오타, 없는 캐릭터·길드                                         | `NexonNotFoundError` (`OPENAPI00003`)                    | "캐릭터를 찾을 수 없어요"라고 답하고 이름·월드를 다시 확인하게 한다                           |
| 이름이 빈칸, 달력에 없는 날짜, 허용되지 않는 서버명, API 키가 비어 있음 | `NexonBadRequestError` (`OPENAPI00004`)                  | 넥슨에 요청을 보내기 전에 걸러진다. `err.message` 에 고치는 방법이 있다                       |
| 그 날짜의 데이터가 아직 없음                                            | `NexonDataNotReadyError` (`OPENAPI00009`)                | 날짜를 하루 전으로 바꾸거나 잠시 뒤 다시 조회한다                                             |
| 게임 또는 넥슨 Open API가 점검 중                                       | `NexonMaintenanceError` (`OPENAPI00010`, `OPENAPI00011`) | 점검이 끝난 뒤 다시 조회한다. "지금은 점검 중이에요"라고 답한다                               |
| 키가 잘못됨 (잘못 복사, 앞뒤 공백·따옴표)                               | `NexonAuthError` (`OPENAPI00005`)                        | `.env` 의 키를 넥슨 Open API의 애플리케이션 상세 페이지에 있는 키와 비교한다                  |
| 이 키로는 이 API를 쓸 수 없음                                           | `NexonAuthError` (`OPENAPI00002`)                        | 키를 발급받은 게임과 조회하려는 게임이 같은지 확인한다                                        |
| 너무 자주 호출함                                                        | `NexonRateLimitError` (`OPENAPI00007`)                   | SDK가 먼저 자동으로 다시 시도한다(기본 3회). 그래도 실패하면 호출을 줄이고 결과를 저장해 둔다 |
| 넥슨 서버 오류                                                          | `NexonServerError` (`OPENAPI00001`, HTTP 5xx)            | 잠시 뒤 다시 시도한다                                                                         |
| 인터넷 끊김, 응답 시간 초과                                             | `NexonError` (코드 없음)                                 | 네트워크를 확인하거나 `timeoutMs` 를 늘린다                                                   |

모든 에러는 `NexonError` 를 상속하고 `code`(넥슨 에러 코드)와 `status` 를 가집니다. 에러 종류는 넥슨 에러 코드로 정해집니다. 예를 들어 잘못된 키에 넥슨 서버는 `OPENAPI00005` 를 돌려주고, SDK는 이를 `NexonAuthError` 로 알려 줍니다. `NexonMaintenanceError` 는 `NexonServerError` 의 한 종류이므로, 점검을 따로 안내하려면 `NexonMaintenanceError` 를 먼저 검사합니다.

### 디스코드 봇 응답 예제

`!정보 캐릭터명` 같은 명령에 답할 문장을 만드는 함수입니다. 위의 `client` 가 있다고 가정합니다.

```js
import {
  NexonNotFoundError,
  NexonBadRequestError,
  NexonDataNotReadyError,
  NexonMaintenanceError,
  NexonRateLimitError,
} from 'nexon-open-api';

async function replyCharacterInfo(characterName) {
  try {
    const ocid = await client.maplestory.getOcid(characterName);
    const basic = await client.maplestory.character.getBasic({ ocid });
    return `${basic.character_name} · ${basic.world_name} · Lv.${basic.character_level} ${basic.character_class}`;
  } catch (err) {
    if (err instanceof NexonNotFoundError) {
      return `'${characterName}' 캐릭터를 찾을 수 없어요. 이름을 다시 확인해 주세요.`;
    }
    if (err instanceof NexonBadRequestError) {
      return '캐릭터 이름을 입력해 주세요. 예: !정보 캐릭터명';
    }
    if (err instanceof NexonDataNotReadyError) {
      return '아직 데이터가 준비되지 않았어요. 잠시 뒤 다시 시도해 주세요.';
    }
    if (err instanceof NexonRateLimitError) {
      return '지금 조회가 몰리고 있어요. 조금 뒤 다시 시도해 주세요.';
    }
    if (err instanceof NexonMaintenanceError) {
      return '지금은 게임 점검 중이에요. 점검이 끝나면 다시 시도해 주세요.';
    }
    console.error(err); // 키 문제, 넥슨 서버 오류 등은 운영자가 확인한다
    return '조회 중 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.';
  }
}

console.log(await replyCharacterInfo('캐릭터명'));
// 캐릭터명 · 스카니아 · Lv.275 아크메이지(불,독)
```

상황별 원인과 해결은 [FAQ](docs/faq.md)에 더 있습니다.

## 설정 옵션

`apiKey` 만 넣어도 됩니다. 나머지는 필요할 때만 바꿉니다.

| 옵션                 | 기본값  | 설명                                                                                                |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `apiKey`             | (필수)  | 넥슨 Open API에서 발급받은 키                                                                       |
| `timeoutMs`          | `10000` | 넥슨 서버 응답을 기다리는 시간(밀리초). 넘으면 에러                                                 |
| `maxRetries`         | `3`     | 호출이 너무 잦거나(429) 서버가 잠시 응답하지 못할 때(503) 자동으로 다시 시도하는 횟수               |
| `retryBaseDelayMs`   | `500`   | 다시 시도하기 전에 기다리는 기본 시간(밀리초). 시도할 때마다 두 배로 늘어난다 (최대 30초)           |
| `debug`              | `false` | `true` 면 요청·응답·재시도를 콘솔에 출력한다. 문제를 찾을 때 켠다                                   |
| `responseValidation` | `false` | `true` 면 넥슨 응답의 구조가 SDK가 아는 것과 다를 때 알려 준다 (`debug` 또는 `logger` 와 함께 사용) |
| `logger`             | 없음    | 요청·응답·재시도 때 부를 함수를 직접 지정한다. `debug: true` 이면 무시된다                          |

```js
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({
  apiKey: process.env.NEXON_API_KEY ?? '',
  maxRetries: 5, // 방문자가 많은 서비스라면 재시도를 늘린다
  debug: true, // 개발 중에 요청과 응답을 콘솔에서 확인한다
});
```

## API 키와 보안

- **키는 서버·봇(Node.js)에서만 씁니다.** 웹페이지(브라우저)에서 실행되는 코드에 키를 넣으면 방문자 누구나 키를 볼 수 있습니다. 웹사이트를 만든다면 내 서버가 넥슨 API를 부르고, 웹페이지는 내 서버에 요청하게 합니다 ([FAQ](docs/faq.md#웹페이지에서-바로-부르고-싶어요)).
- **키를 코드에 직접 적지 않습니다.** `.env` 파일에 두고 `process.env` 로 읽습니다.
- **`.env` 를 GitHub에 올리지 않습니다.** `.gitignore` 파일에 `.env` 한 줄을 추가합니다. 키가 노출됐다면 넥슨 Open API의 애플리케이션 상세 페이지에서 새 키를 발급받아 교체합니다.
- **키는 게임마다 따로입니다.** 여러 게임을 다루면 `NEXON_MAPLESTORY_API_KEY`, `NEXON_FC_ONLINE_API_KEY` 처럼 이름을 나눠 저장하고 게임마다 `NexonClient` 를 따로 만듭니다.

## 문서

- [시작 가이드](docs/getting-started.md) — 설치, API 키 발급, 첫 실행, 디스코드 봇 형태로 쓰는 법, CommonJS·TypeScript
- [FAQ](docs/faq.md) — "캐릭터를 못 찾아요", "오늘 데이터가 안 나와요" 같은 상황별 해결
- [`examples/`](examples/README.md) — 복사해서 바로 실행하는 예제
- [CHANGELOG.md](CHANGELOG.md) — 버전별 변경 내용

| 게임                  | 코드에서                 | 문서                             | 다루는 내용                                                            |
| --------------------- | ------------------------ | -------------------------------- | ---------------------------------------------------------------------- |
| 메이플스토리          | `client.maplestory`      | [문서](docs/maplestory.md)       | 장비·심볼·HEXA 매트릭스, 유니온 공격대, 길드, 랭킹, 스타포스·큐브 기록 |
| 메이플스토리M         | `client.maplestorym`     | [문서](docs/maplestory-m.md)     | 장착 아이템·쥬얼, 유니온, 길드, 전투력·무릉도장 랭킹                   |
| MapleStorySEA         | `client.maplestorySEA`   | [문서](docs/maplestory-sea.md)   | 캐릭터, 유니온, 길드                                                   |
| MapleStory Taiwan     | `client.maplestoryTW`    | [문서](docs/maplestory-tw.md)    | 캐릭터, 유니온, 길드                                                   |
| EA SPORTS FC 온라인   | `client.fcOnline`        | [문서](docs/fc-online.md)        | 매치 기록, 역대 최고 등급, 거래 기록, 랭커 선수 스탯, 선수 이미지      |
| 퍼스트 디센던트       | `client.firstDescendant` | [문서](docs/first-descendant.md) | 계승자, 무기, 반응로, 외장 부품, 모듈 추천, 보이드 요격전 리더보드     |
| 마비노기 영웅전       | `client.mabinogiHeroes`  | [문서](docs/mabinogi-heroes.md)  | 장착 아이템, 타이틀·문양, 인챈트, 거래소, 명예의 전당                  |
| 서든어택              | `client.suddenAttack`    | [문서](docs/sudden-attack.md)    | 계급, 티어, 최근 동향, 매치 기록                                       |
| 카트라이더 러쉬플러스 | `client.kartrider`       | [문서](docs/kartrider.md)        | 라이더 정보, 장착 칭호, 공지·시즌 알림판                               |
| 바람의나라            | `client.baram`           | [문서](docs/baram.md)            | 능력치, 장착 아이템, 칭호, 길드                                        |
| 마비노기              | `client.mabinogi`        | [문서](docs/mabinogi.md)         | 경매장, NPC 상점, 거대한 외침의 뿔피리                                 |
| 바람의나라: 연        | `client.baramYeon`       | [문서](docs/baram-yeon.md)       | 기본 정보, 칭호                                                        |
| V4                    | `client.v4`              | [문서](docs/v4.md)               | 기본 정보, 명예                                                        |
| 히트2                 | `client.hit2`            | [문서](docs/hit2.md)             | 기본 정보                                                              |
| 넥슨 Open API 공지    | `client.platform`        | [문서](docs/platform.md)         | 점검·API 변경 공지                                                     |

`client.maplestorym` 의 `m` 은 소문자입니다. VS Code 같은 에디터에서는 `client.` 뒤에서 자동완성으로 게임과 조회 항목, 응답 필드를 확인할 수 있습니다.

## 실서버 검증 현황

이 라이브러리가 실제 넥슨 서버와 어디까지 맞춰 봤는지 구분해서 적습니다.

- **모든 API는 넥슨 포털의 공식 스펙을 기준으로 만들었습니다.** 조회 항목, 입력값, 응답 필드를 공식 스펙과 맞췄고, 어긋나면 자동 검사가 알려 줍니다.
- **API 키 없이 열리는 데이터는 실제 응답과 맞춰 봤습니다** (2026-11-24). 실제 응답이 스펙과 다른 곳은 실제 응답에 맞췄습니다.
  - 게임 기본 데이터(매치 종류, 계급·티어, 계승자·무기 도감 등) **44/44** 통과 (FC 온라인 8, 서든어택 4, 퍼스트 디센던트 32). 퍼스트 디센던트 한국어·영어를 포함해 실제 호출은 68건입니다.
  - 실제 응답과 SDK의 응답 필드를 안쪽 필드까지 비교한 결과, 빠지거나 남거나 형식이 다른 필드가 **0건**이었습니다.
  - 15개 게임 모두에서 잘못된 키를 넣으면 `NexonAuthError`(`OPENAPI00005`)와 안내 메시지가 나오고, 재시도 없이 끝났습니다.
  - npm에서 설치한 패키지를 `require` 와 `import` 양쪽으로 실제 호출했고, TypeScript 타입 검사도 통과했습니다.
  - FC 온라인 선수 이미지는 선수에 따라 두 가지 주소(시즌 포함 번호 / 선수 번호) 중 한쪽에만 있습니다. 없는 쪽은 넥슨 이미지 서버가 403을 돌려줍니다 ([FC 온라인 문서](docs/fc-online.md)).
- **API 키가 필요한 API는 0.2.0 기준으로 실제 키를 넣은 전체 점검을 하지 않았습니다.** 메이플스토리는 0.1.x 때 실제 키로 전체 점검을 통과했지만, 0.2.0에서 추가·변경한 부분은 다시 확인하지 않았습니다. 응답이 실제 게임이나 문서와 다르면 [이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 알려 주세요 ([FAQ](docs/faq.md#응답이-실제-게임과-달라요)).

같은 확인을 직접 다시 해 보는 방법은 [CONTRIBUTING.md](CONTRIBUTING.md#실서버-확인)에 있습니다.

## 고급

<details>
<summary>게임 하나만 가져오기, TypeScript 타입, 게임별 검증 정보</summary>

게임마다 `nexon-open-api/{게임}` 진입점이 있습니다 (`maplestory`, `maplestory-m`, `maplestory-sea`, `maplestory-tw`, `fconline`, `first-descendant`, `mabinogi-heroes`, `sudden-attack`, `kartrider`, `baram`, `mabinogi`, `baram-yeon`, `v4`, `hit2`, `platform`). 번들 크기를 줄이고 싶을 때 씁니다.

```ts
import { HttpClient, MapleStoryClient } from 'nexon-open-api/maplestory';
import type { CharacterBasic } from 'nexon-open-api/maplestory';

const maplestory = new MapleStoryClient(
  new HttpClient({ apiKey: process.env.NEXON_API_KEY ?? '' }),
);
const ocid = await maplestory.getOcid('캐릭터명');
const basic: CharacterBasic = await maplestory.character.getBasic({ ocid });
console.log(basic.character_level);
```

- 모든 요청과 응답에 TypeScript 타입이 있고, `require` 와 `import` 를 모두 지원합니다. 외부 의존성은 없습니다.
- 게임별로 언제 어떤 방식으로 검증했는지는 `getApiMetadata('maplestory')` 로 확인할 수 있습니다.
- 버전 정책은 [SEMVER.md](SEMVER.md)에 있습니다.

</details>

## 기여

버그 제보와 개선 제안은 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 받습니다. 개발 환경과 절차는 [CONTRIBUTING.md](CONTRIBUTING.md)에 있습니다.

## 면책 조항

이 프로젝트는 넥슨(NEXON Korea Corporation)이 제휴, 승인, 후원하지 않는 **비공식** 서드파티 라이브러리입니다.

- 이 SDK에서 사용하는 모든 게임명, 로고 및 관련 상표의 권리는 넥슨에 있습니다 ([이용약관 제6조 ①](https://openapi.nexon.com/ko/support/terms/)).
- 이 SDK는 [NEXON Open API](https://openapi.nexon.com/)를 통해 데이터를 제공받습니다 ([이용약관 제6조 ④](https://openapi.nexon.com/ko/support/terms/)).
- API 사용 시 [Nexon Open API 이용약관](https://openapi.nexon.com/ko/support/terms/)을 준수해 주세요.

## 라이선스

이 SDK의 소스 코드는 [MIT](LICENSE) 라이선스를 따릅니다.
단, API를 통해 제공되는 데이터의 저작권은 넥슨에 있으며, 데이터의 무단 복제/재배포/영리적 이용은 이용약관에 의해 제한됩니다.
