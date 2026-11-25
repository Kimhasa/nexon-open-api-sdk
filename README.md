# nexon-open-api

nexon-open-api는 [NEXON Open API](https://openapi.nexon.com/)를 TypeScript와 JavaScript에서 사용할 수 있도록 만든 비공식 라이브러리입니다.

캐릭터 레벨과 장비, 매치 기록, 랭킹 등을 조회해 팬사이트, 디스코드 봇, 계산기 등의 서비스에 활용할 수 있습니다. 서비스의 화면과 기능은 개발자가 구현합니다.

[![npm version](https://img.shields.io/npm/v/nexon-open-api.svg)](https://www.npmjs.com/package/nexon-open-api) [![CI](https://github.com/Kimhasa/nexon-open-api-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Kimhasa/nexon-open-api-sdk/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

[설치 및 API Key](#사전-준비하기), [첫 조회](#메이플스토리-캐릭터-정보-조회하기), [지원 게임](#지원-게임), [문서](#문서), [에러 처리](#에러-처리), [설정 옵션](#설정-옵션)

## 사전 준비하기

이 라이브러리를 사용하려면 Node.js 18 이상과 조회할 게임의 API Key가 필요합니다.

1. 프로젝트 폴더에서 다음 명령으로 패키지를 설치합니다.

   ```bash
   npm install nexon-open-api
   ```

2. 메이플스토리 API Key를 발급받습니다.
   1. [NEXON Open API](https://openapi.nexon.com/)에서 넥슨 ID로 로그인합니다.
   2. **내 애플리케이션 > 애플리케이션 등록**에서 메이플스토리와 **개발 단계**를 선택한 후 애플리케이션을 등록합니다.
   3. **내 애플리케이션 > 애플리케이션 목록 > 애플리케이션 상세 페이지**에서 발급된 API Key를 확인합니다.

   자세한 내용은 [API Key 발급 안내](docs/getting-started.md#2-api-key-발급받기)를 참고해 주세요.

3. 프로젝트 폴더에 `.env` 파일을 만들고 발급받은 API Key를 다음과 같이 설정합니다.

   ```dotenv
   NEXON_API_KEY=발급받은_메이플스토리_API_Key
   ```

※ API Key는 게임별로 발급됩니다. 여러 게임을 조회하는 경우 게임마다 API Key를 발급받고 `NexonClient`를 각각 생성합니다.

설치부터 환경 변수 설정까지 자세한 내용은 [시작 가이드](docs/getting-started.md)에서 확인할 수 있습니다.

## 메이플스토리 캐릭터 정보 조회하기

1. 아래 코드를 `index.mjs`로 저장하고 `캐릭터명`을 조회할 캐릭터의 이름으로 바꿉니다.

   이 코드는 캐릭터명으로 식별자(ocid)를 조회한 다음, 해당 식별자로 캐릭터 기본 정보를 조회합니다.

   ```js
   import { NexonClient } from 'nexon-open-api';

   const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
   const ocid = await client.maplestory.getOcid('캐릭터명');
   const basic = await client.maplestory.character.getBasic({ ocid });
   console.log(`${basic.character_name} Lv.${basic.character_level} ${basic.character_class}`);
   ```

2. 다음 명령으로 실행합니다.

   ```bash
   node --env-file=.env index.mjs
   ```

   ※ `--env-file`은 Node.js 20.6 이상에서 사용할 수 있습니다. 이전 지원 버전에서는 `NEXON_API_KEY` 환경 변수를 설정한 뒤 `node index.mjs`를 실행하거나 [시작 가이드의 dotenv 설정 방법](docs/getting-started.md#3-env-파일로-api-key-관리하기)을 참고해 주세요.

3. 출력에서 캐릭터 이름, 레벨, 직업을 확인합니다.

   ```text
   캐릭터명 Lv.275 아크메이지(불,독)
   ```

### 게임별 캐릭터 및 전적 조회 예제

아래 예제에서는 캐릭터명으로 캐릭터 식별자(ocid)를, 구단주 닉네임으로 계정 식별자(ouid)를 조회합니다. 게임에 따라 월드명이나 서버명을 함께 입력합니다.

`NexonClient`를 가져온 뒤 조회할 게임의 API Key를 해당 환경 변수에 설정하고, 해당 예제를 실행합니다.

#### 메이플스토리M 캐릭터 식별자 조회

월드명과 캐릭터명으로 식별자(ocid)를 조회합니다.

```js
const mapleStoryM = new NexonClient({ apiKey: process.env.NEXON_MAPLESTORY_M_API_KEY ?? '' });
const mOcid = await mapleStoryM.maplestorym.getOcid('스카니아', '캐릭터명');
```

#### 바람의나라 캐릭터 식별자 조회

캐릭터명과 서버명으로 식별자(ocid)를 조회합니다.

```js
const baram = new NexonClient({ apiKey: process.env.NEXON_BARAM_API_KEY ?? '' });
const baramOcid = await baram.baram.getOcid('캐릭터명', '연');
```

#### EA SPORTS FC 온라인 공식경기 매치 ID 조회

구단주 닉네임으로 계정 식별자를 조회한 뒤 최근 공식경기(`matchtype: 50`) 매치 ID를 최대 10개 조회합니다.

```js
const fcOnline = new NexonClient({ apiKey: process.env.NEXON_FC_ONLINE_API_KEY ?? '' });
const ouid = await fcOnline.fcOnline.getOuid('닉네임');
const matchIds = await fcOnline.fcOnline.getMatchList({ ouid, matchtype: 50, limit: 10 });
```

에러 처리를 포함한 조회 코드는 [메이플스토리 첫 실행 안내](docs/getting-started.md#4-첫-실행-메이플스토리-캐릭터-정보-출력)와 [실행 예제 목록](examples/README.md)에서 확인할 수 있습니다.

## 지원 게임

이 라이브러리는 2026년 11월 24일에 저장한 NEXON Open API 포털 스펙을 기준으로 14개 게임과 NEXON Open API 공지의 API 경로 270개를 지원합니다.

포털 API 변경 여부는 매주 자동으로 확인합니다.

<!-- 아이콘 파일: docs/assets/games/{game}.png -->

| 게임 및 문서                                                                                                                                    | 조회 항목                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| <img src="docs/assets/games/maplestory.png" alt="메이플스토리" height="24" /><br />[메이플스토리](docs/maplestory.md)                           | 캐릭터 스펙·장비·유니온, 랭킹, 스타포스·큐브 기록     |
| <img src="docs/assets/games/maplestory-m.png" alt="메이플스토리M" height="24" /><br />[메이플스토리M](docs/maplestory-m.md)                     | 캐릭터 스탯·장착 아이템, 길드, 전투력·무릉도장 랭킹   |
| <img src="docs/assets/games/fc-online.png" alt="EA SPORTS FC 온라인" height="24" /><br />[EA SPORTS FC 온라인](docs/fc-online.md)               | 공식경기 전적, 역대 최고 등급, 선수 이미지            |
| <img src="docs/assets/games/maplestory-sea.png" alt="MapleStorySEA" height="24" /><br />[MapleStorySEA](docs/maplestory-sea.md)                 | 캐릭터·유니온·길드                                    |
| <img src="docs/assets/games/maplestory-taiwan.png" alt="MapleStory Taiwan" height="24" /><br />[MapleStoryTaiwan](docs/maplestory-tw.md)        | 캐릭터·유니온·길드                                    |
| <img src="docs/assets/games/first-descendant.png" alt="퍼스트 디센던트" height="24" /><br />[퍼스트 디센던트](docs/first-descendant.md)         | 계승자·무기·모듈 도감, 장착 정보, 리더보드            |
| <img src="docs/assets/games/mabinogi.png" alt="마비노기" height="24" /><br />[마비노기](docs/mabinogi.md)                                       | 경매장 매물·거래 내역, NPC 상점, 거대한 외침의 뿔피리 |
| <img src="docs/assets/games/mabinogi-heroes.png" alt="마비노기 영웅전" height="24" /><br />[마비노기 영웅전](docs/mabinogi-heroes.md)           | 캐릭터 장비·능력치, 거래소 기록, 명예의 전당 랭킹     |
| <img src="docs/assets/games/sudden-attack.png" alt="서든어택" height="24" /><br />[서든어택](docs/sudden-attack.md)                             | 계급·티어, 최근 동향, 매치 기록                       |
| <img src="docs/assets/games/kartrider-rush-plus.png" alt="카트라이더 러쉬플러스" height="24" /><br />[카트라이더 러쉬플러스](docs/kartrider.md) | 라이더 기본 정보·장착 칭호, 시즌 알림판               |
| <img src="docs/assets/games/baram-nara.png" alt="바람의나라" height="24" /><br />[바람의나라](docs/baram.md)                                    | 캐릭터 능력치·장착 아이템·칭호·길드                   |
| <img src="docs/assets/games/baram-yeon.png" alt="바람의나라: 연" height="24" /><br />[바람의나라: 연](docs/baram-yeon.md)                       | 캐릭터 기본 정보·칭호                                 |
| <img src="docs/assets/games/v4.png" alt="V4" height="24" /><br />[V4](docs/v4.md)                                                               | 캐릭터 기본 정보·명예                                 |
| <img src="docs/assets/games/hit2.png" alt="히트2" height="24" /><br />[히트2](docs/hit2.md)                                                     | 캐릭터 기본 정보                                      |
| [NEXON Open API 공지](docs/platform.md)                                                                                                         | 점검·API 변경 공지                                    |

게임별 클라이언트와 주요 조회 항목은 [문서](#문서)에서 확인할 수 있습니다.

※ 던전앤파이터와 사이퍼즈 API는 [네오플 Developers](https://developers.neople.co.kr/)에서 별도로 제공하며, 이 라이브러리의 지원 범위에서 제외됩니다.

## 활용 예제

| 활용 사례                           | 조회 항목                                    | 문서 및 예제                                                                                                                            |
| ----------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 환산 계산기                         | 장비·잠재능력 옵션                           | [레시피](docs/recipes/)                                                                                                                 |
| 코디 카드                           | 캐릭터 외형 이미지                           | [레시피](docs/recipes/)                                                                                                                 |
| 디스코드 봇의 `!정보 캐릭터명` 응답 | 캐릭터 기본 정보, 전투력, 유니온 레벨        | [캐릭터 카드 예제](examples/maplestory-character-card.mjs), [디스코드 봇 사용 안내](docs/getting-started.md#6-디스코드-봇에서-사용하기) |
| 전적 검색                           | 최근 공식경기 기록                           | [EA SPORTS FC 온라인 전적 예제](examples/fconline-recent-matches.mjs)                                                                   |
| 경매장 시세 도구                    | 경매장 매물                                  | [마비노기 경매장 예제](examples/mabinogi-auction-price.mjs)                                                                             |
| 랭킹 페이지, 도감, 뿔피리 모아 보기 | 랭킹, 계승자 목록, 거대한 외침의 뿔피리 내역 | [실행 예제 목록](examples/README.md)                                                                                                    |

## 라이브러리 기능

- 응답 타입을 제공합니다. 2026년 11월 24일 표본에 대해 문서와 실제 응답의 차이를 확인하고 응답 타입을 보정했습니다.
- 지원하는 입력값 검사를 수행하고, 이름 조회 시 해당 캐릭터나 계정이 없는 경우를 구분합니다.
- 별도의 런타임 의존성 없이 하나의 패키지에서 14개 게임별 클라이언트를 제공합니다.
- TypeScript 타입을 지원하는 편집기에서는 `client.`에서 게임과 조회 항목을 자동완성하고 응답 필드와 게임 용어 설명을 확인할 수 있습니다.

API를 직접 호출하는 코드와의 차이는 [조회 코드 비교](docs/why.md#조회-코드-비교)에서 확인할 수 있습니다. 다른 패키지와의 차이는 [다른 라이브러리와 비교](docs/why.md#다른-라이브러리와-비교)를 참고해 주세요.

포털의 [AI 에이전트 가이드](https://openapi.nexon.com/ko/guide/ai-agent/)에 나온 입력값, 필터, 재시도 유의사항의 적용 범위는 [가이드 항목별 대응표](docs/why.md#nexon-open-api-ai-에이전트-가이드와-이-라이브러리)에서 확인할 수 있습니다.

AI 코딩 도구에 이 라이브러리의 메서드, 응답 필드, 에러 처리 예제를 참고 자료로 제공할 수 있습니다. [AI 코딩 도구 사용 안내](docs/ai-guide.md)를 확인해 주세요.

## 에러 처리

이 라이브러리가 분류하는 에러는 `NexonError` 또는 그 하위 클래스입니다. 에러 유형에 따라 `message`에서 원인과 확인할 항목을 확인할 수 있습니다.

- 입력한 이름으로 캐릭터 또는 길드를 찾을 수 없음 (`NexonNotFoundError`)

  이름을 확인하거나 유저에게 “캐릭터를 찾을 수 없어요.”와 같이 안내합니다.

- 유효하지 않은 요청 (`NexonBadRequestError`)

  빈 이름, 조회할 수 없는 날짜, 허용되지 않는 서버명·분류 등이 해당합니다. `err.message`를 확인하고 요청 파라미터를 수정합니다.

- 요청한 날짜의 데이터 준비 중 (`NexonDataNotReadyError`)

  데이터 제공 시점을 확인하고 이전 날짜를 조회하거나 잠시 뒤 다시 조회합니다.

- 게임 또는 NEXON Open API 점검 (`NexonMaintenanceError`)

  점검 공지를 확인하고 유저에게 “지금은 점검 중이에요.”와 같이 안내합니다.

- 유효하지 않은 API Key 또는 다른 게임의 API Key 사용 (`NexonAuthError`)

  `.env`에 설정한 API Key와 발급 대상 게임을 확인합니다.

- API 호출량 초과 (`NexonRateLimitError`)

  호출량을 확인하고 저장한 결과를 재사용합니다.

- NEXON Open API 서버 오류 (`NexonServerError`)

  잠시 뒤 다시 시도합니다.

- 네트워크 연결 오류 또는 응답 시간 초과 (`NexonError`)

  네트워크를 확인합니다. 응답 시간이 초과된 경우 `timeoutMs`를 조정할 수 있습니다.

※ `NexonBadRequestError`는 이 라이브러리가 일부 입력값을 전송 전에 검사할 때와 API가 잘못된 요청으로 응답할 때 모두 발생할 수 있습니다.

※ 자동 재시도는 HTTP 429와 5xx 응답에만 적용됩니다.

아래 예제는 앞에서 생성한 메이플스토리용 `client`로 캐릭터 정보를 조회하고, 캐릭터를 찾을 수 없을 때 안내 문구를 출력합니다.

```js
import { NexonNotFoundError } from 'nexon-open-api';

try {
  const ocid = await client.maplestory.getOcid('캐릭터명');
  console.log(await client.maplestory.character.getBasic({ ocid }));
} catch (err) {
  if (err instanceof NexonNotFoundError) console.log('캐릭터를 찾을 수 없어요.');
  else throw err;
}
```

`NexonMaintenanceError`는 `NexonServerError`의 하위 클래스입니다. 점검을 별도로 안내하려면 `NexonMaintenanceError`를 먼저 검사합니다.

상황별 해결 방법은 [FAQ](docs/faq.md)에서, 에러에 따라 응답 문구를 지정하는 방법은 [에러 처리 예제](examples/error-handling.mjs)에서 확인할 수 있습니다.

## 설정 옵션

`NexonClient`를 생성할 때 NEXON Open API에서 발급받은 API Key를 `apiKey`에 지정합니다. 나머지 옵션은 필요에 따라 설정할 수 있습니다.

| 옵션                 | 기본값과 용도               |
| -------------------- | --------------------------- |
| `apiKey`             | 필수<br />API Key           |
| `timeoutMs`          | `10000`<br />응답 대기 시간 |
| `maxRetries`         | `3`<br />자동 재시도 횟수   |
| `retryBaseDelayMs`   | `500`<br />재시도 대기 시간 |
| `debug`              | `false`<br />디버그 로그    |
| `responseValidation` | `false`<br />응답 구조 검사 |
| `logger`             | 없음<br />로그 처리 함수    |

- `timeoutMs`는 요청별 응답 대기 시간(밀리초)입니다. 대기 시간을 초과하면 에러가 발생합니다.
- `maxRetries`는 HTTP 429 또는 5xx 응답에 대한 최대 자동 재시도 횟수입니다.
- 재시도 대기 시간은 `retryBaseDelayMs`(밀리초)를 기준으로 시도마다 두 배로 늘리고 무작위 시간을 더해 최대 30초까지 적용합니다. 응답에 초 단위 `Retry-After`가 있으면 해당 값을 우선합니다.
- `debug: true`이면 기본 디버그 로거가 적용되어 요청·응답·재시도를 콘솔에 출력합니다. 요청 URL과 응답 검증 로그의 URL에서는 식별자(ocid 등)를 가립니다.
- `responseValidation: true`이면 응답 구조가 정의된 조회의 최상위 필드를 검사합니다. 불일치는 `debug` 또는 `logger.onResponseShapeMismatch`를 통해 확인할 수 있습니다.
- `logger`로 요청·응답·재시도 등의 로그를 처리할 함수를 지정합니다.

## 서비스 공개 안내

API Key는 서버 또는 봇의 Node.js 환경에서 관리합니다. 브라우저에서 실행하는 코드와 GitHub에 공개되지 않도록 관리해 주세요.

NEXON Open API의 호출 허용량은 애플리케이션 타입에 따라 다르며, 호출량은 애플리케이션별로 합산됩니다.

| 애플리케이션 타입 | 초당 최대 허용량 | 1일 최대 허용량 |
| ----------------- | ---------------- | --------------- |
| 개발 단계         | 5건              | 1,000건         |
| 서비스 단계       | 500건            | 20,000,000건    |

서비스 단계로 전환할 때에는 서비스 단계 애플리케이션을 등록하여 API Key를 새로 발급받습니다. [NEXON Open API 사전 준비 가이드](https://openapi.nexon.com/ko/guide/prepare-in-advance/)를 참고해 주세요.

NEXON Open API 데이터를 활용하는 서비스 및 애플리케이션에는 다음 출처 문구를 표시해 주세요.

```text
Data based on NEXON Open API
```

[NEXON Open API 사용 가이드](https://openapi.nexon.com/ko/guide/request-api/)를 참고해 주세요.

캐시, 데이터 갱신, 식별자 관리 등 공개 전에 확인할 항목은 [서비스 공개 체크리스트](docs/service-checklist.md)에서 확인할 수 있습니다.

## 문서

### 가이드 및 예제

- [시작 가이드](docs/getting-started.md)에서 설치, API Key 발급, 첫 실행, 디스코드 봇, CommonJS·TypeScript 사용 방법을 안내합니다.
- [라이브러리 기능 및 비교](docs/why.md)에서 직접 호출하는 코드와의 비교, NEXON Open API AI 에이전트 가이드 대응표, 다른 라이브러리와의 비교를 확인할 수 있습니다.
- [서비스 공개 체크리스트](docs/service-checklist.md)에서 API Key 관리, 호출 허용량, 캐시, 출처 표기 항목을 확인할 수 있습니다.
- [레시피](docs/recipes/)에서 환산 계산기용 장비 옵션을 조회하거나 코디 카드를 만드는 방법을 확인할 수 있습니다.
- [FAQ](docs/faq.md)에서 캐릭터를 찾을 수 없거나 오늘 데이터를 조회할 수 없는 경우 등 상황별 해결 방법을 확인할 수 있습니다.
- [실행 예제](examples/README.md)에서 예제별 실행 방법과 필요한 API Key를 확인할 수 있습니다.
- [AI 코딩 도구 사용 안내](docs/ai-guide.md)에서 라이브러리 참고 자료 제공 방법과 [`llms.txt`](llms.txt)를 확인할 수 있습니다.
- [변경 이력](CHANGELOG.md)에서 버전별 변경 내용을 확인할 수 있습니다.

### 게임별 클라이언트

아래 클라이언트 이름을 `client.` 뒤에 붙여 사용합니다. 게임 이름을 선택하면 문서를 열 수 있습니다.

| 게임과 클라이언트                                                  | 주요 조회 항목                                                         |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [메이플스토리](docs/maplestory.md)<br />`maplestory`               | 장비·심볼·HEXA 매트릭스, 유니온 공격대, 길드, 랭킹, 스타포스·큐브 기록 |
| [메이플스토리M](docs/maplestory-m.md)<br />`maplestorym`           | 장착 아이템·쥬얼, 유니온, 길드, 전투력·무릉도장 랭킹                   |
| [MapleStorySEA](docs/maplestory-sea.md)<br />`maplestorySEA`       | 캐릭터, 유니온, 길드                                                   |
| [MapleStoryTaiwan](docs/maplestory-tw.md)<br />`maplestoryTW`      | 캐릭터, 유니온, 길드                                                   |
| [EA SPORTS FC 온라인](docs/fc-online.md)<br />`fcOnline`           | 매치 기록, 역대 최고 등급, 거래 기록, 랭커 선수 스탯, 선수 이미지      |
| [퍼스트 디센던트](docs/first-descendant.md)<br />`firstDescendant` | 계승자, 무기, 반응로, 외장 부품, 모듈 추천, 보이드 요격전 리더보드     |
| [마비노기 영웅전](docs/mabinogi-heroes.md)<br />`mabinogiHeroes`   | 장착 아이템, 타이틀·문양, 인챈트, 거래소, 명예의 전당                  |
| [서든어택](docs/sudden-attack.md)<br />`suddenAttack`              | 계급, 티어, 최근 동향, 매치 기록                                       |
| [카트라이더 러쉬플러스](docs/kartrider.md)<br />`kartrider`        | 라이더 정보, 장착 칭호, 공지·시즌 알림판                               |
| [바람의나라](docs/baram.md)<br />`baram`                           | 능력치, 장착 아이템, 칭호, 길드                                        |
| [마비노기](docs/mabinogi.md)<br />`mabinogi`                       | 경매장, NPC 상점, 거대한 외침의 뿔피리                                 |
| [바람의나라: 연](docs/baram-yeon.md)<br />`baramYeon`              | 기본 정보, 칭호                                                        |
| [V4](docs/v4.md)<br />`v4`                                         | 기본 정보, 명예                                                        |
| [히트2](docs/hit2.md)<br />`hit2`                                  | 기본 정보                                                              |
| [NEXON Open API 공지](docs/platform.md)<br />`platform`            | 점검·API 변경 공지                                                     |

`client.maplestorym`의 마지막 `m`은 소문자입니다.

## 실서버 검증 현황

2026년 11월 24일 게임별 개발 단계 API Key로 실서버 응답을 검증했습니다.

- 표본은 공개 캐릭터 42명(게임별 2~6명)입니다.
- HTTP 메서드 267개 중 263개를 호출하여 응답의 중첩 필드까지 라이브러리 타입과 대조했습니다.
- 초기 검증에서는 조회 항목 127개의 응답에서 600종이 넘는 차이를 확인했습니다.
- 타입을 보정한 뒤 같은 검증 범위에서 불일치 0건을 확인했습니다.

| 검증 대상에서 제외된 메서드                                    | 제외 사유                                      |
| -------------------------------------------------------------- | ---------------------------------------------- |
| EA SPORTS FC 온라인 이적시장 거래 기록 (`getTradeList`)        | API Key 소유 계정의 거래 기록만 조회 가능      |
| 메이플스토리 이전 API Key의 계정 식별자 조회 (`getLegacyOuid`) | 이전 방식으로 발급된 API Key 필요              |
| EA SPORTS FC 온라인 전체 매치 기록 (`getAllMatchList`)         | API 제공 종료                                  |
| EA SPORTS FC 온라인 시즌 ID 목록 (`getSeasonIdMeta`)           | API Key 없이 접근 가능한 정적 파일로 별도 확인 |

※ 캐릭터가 보유한 데이터에 따라 이 표본에서 관찰하지 못한 `null` 값이 반환될 수 있습니다. 실제 응답과 타입이 다른 경우 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 알려 주세요.

확인 방법과 차이 사례는 [실서버 검증 내용](docs/why.md#실서버-검증-내용)에서 확인할 수 있습니다.

## 게임별 패키지 가져오기

<details>
<summary>가져오기 경로, TypeScript 타입 및 게임별 검증 정보</summary>

번들 크기를 줄이려면 필요한 게임만 `nexon-open-api/{게임}` 경로에서 가져올 수 있습니다.

사용할 수 있는 경로 이름은 `maplestory`, `maplestory-m`, `maplestory-sea`, `maplestory-tw`, `fconline`, `first-descendant`, `mabinogi-heroes`, `sudden-attack`, `kartrider`, `baram`, `mabinogi`, `baram-yeon`, `v4`, `hit2`, `platform`입니다.

아래 코드는 메이플스토리용 클라이언트와 타입을 가져와 캐릭터 레벨을 조회합니다.

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

- 패키지와 게임별 가져오기 경로 모두 CommonJS(`require`)와 ES 모듈(`import`)을 지원합니다. 공개 요청과 응답에 TypeScript 타입을 제공합니다.
- 게임별 검증 일자와 방법은 `nexon-open-api`에서 가져온 `getApiMetadata('maplestory')`로 확인할 수 있습니다.
- 버전 정책은 [기여 가이드](CONTRIBUTING.md)에서 확인할 수 있습니다.

</details>

## 문의 및 제보

라이브러리의 오류나 개선 사항은 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)에 남겨 주세요. 오류를 제보할 때는 API Key와 실제 캐릭터·계정 이름을 제외하고 라이브러리 버전, 재현 방법, 오류 메시지를 함께 적어 주세요.

개발 환경과 기여 절차는 [기여 가이드](CONTRIBUTING.md)에서 확인할 수 있습니다.

## 면책 조항

이 라이브러리는 넥슨(NEXON Korea Corporation)과의 제휴, 승인 또는 후원 없이 개발된 비공식 서드파티 라이브러리입니다.

이 라이브러리에서 사용하는 게임명, 로고 및 관련 상표는 각각 해당 권리자에게 귀속됩니다. 이 라이브러리에서 조회하는 데이터는 [NEXON Open API](https://openapi.nexon.com/)를 통해 제공됩니다.

API를 사용하려면 [NEXON Open API 이용약관](https://openapi.nexon.com/ko/support/terms/)을 준수해 주세요.

- 넥슨이 제공하는 API 서비스와 넥슨이 제작한 관련 프로그램, 디자인, 상표 등의 권리는 제6조 ①을 참고해 주세요.
- 서비스와 결과 데이터의 출처 표기 의무는 제6조 ④를 참고해 주세요.

## 라이선스

이 라이브러리의 소스 코드는 [MIT 라이선스](LICENSE)를 따릅니다.

API를 통해 제공되는 데이터의 저작권 등 권리는 넥슨 또는 해당 제3자에게 있습니다. 데이터의 무단 복제·재배포와 넥슨의 승낙 없는 영리 목적 이용은 [NEXON Open API 이용약관](https://openapi.nexon.com/ko/support/terms/)에 따라 제한됩니다.
