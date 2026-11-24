# nexon-open-api

> Type-safe Nexon Open API SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/nexon-open-api.svg)](https://www.npmjs.com/package/nexon-open-api)
[![CI](https://github.com/Kimhasa/nexon-open-api-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Kimhasa/nexon-open-api-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

[Nexon Open API](https://openapi.nexon.com/)를 TypeScript로 감싼 비공식 SDK입니다. 넥슨 Open API 포털이 제공하는 14개 게임과 Open API 공지의 API 270개를 모두 지원합니다([지원 게임](#지원-게임)). 모든 요청과 응답에 타입이 있고, 외부 의존성 없이 네이티브 `fetch`만 사용하며, CJS와 ESM을 함께 제공합니다.

## 설치

```bash
npm install nexon-open-api
# or
yarn add nexon-open-api
# or
pnpm add nexon-open-api
```

- Node.js 18 이상 (CI는 Node.js 22, 24, 26에서 테스트합니다)
- TypeScript 5.0 이상 (타입을 사용할 때)
- API 키는 [Nexon Open API 포털](https://openapi.nexon.com/)에서 게임별로 발급받습니다.

## 빠른 시작

`NexonClient` 하나로 모든 게임에 접근합니다. 대부분의 게임은 식별자 조회(`getOcid` / `getOuid`) 뒤 카테고리별 sub-client를 호출하는 같은 패턴입니다.

### 메이플스토리

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

// OCID 조회
const ocid = await client.maplestory.getOcid('캐릭터명');

// 캐릭터 기본 정보
const basic = await client.maplestory.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

### 메이플스토리M · MapleStorySEA

```ts
// 메이플스토리M은 월드명이 필요하다
const mOcid = await client.maplestorym.getOcid('스카니아', '캐릭터명');
const mBasic = await client.maplestorym.character.getBasic({ ocid: mOcid });

const seaOcid = await client.maplestorySEA.getOcid('CharacterName');
const seaBasic = await client.maplestorySEA.character.getBasic({ ocid: seaOcid });
const seaUnion = await client.maplestorySEA.union.getUnion({ ocid: seaOcid });
```

### FC Online

```ts
const ouid = await client.fcOnline.getOuid('닉네임');
const basic = await client.fcOnline.getBasic(ouid);
console.log(`${basic.nickname} (Lv.${basic.level})`);

// 매치 기록
const matchIds = await client.fcOnline.getMatchList({ ouid, matchtype: 50, limit: 10 });
const detail = await client.fcOnline.getMatchDetail(matchIds[0]!);
```

### 그 밖의 게임

```ts
// MapleStory Taiwan
const twOcid = await client.maplestoryTW.getOcid('角色名稱');
const twBasic = await client.maplestoryTW.character.getBasic({ ocid: twOcid });

// 퍼스트 디센던트
const tfdOuid = await client.firstDescendant.getOuid('닉네임#1234');
const tfdUser = await client.firstDescendant.user.getBasic({ ouid: tfdOuid });
const descendants = await client.firstDescendant.meta.getDescendant('ko'); // 정적 메타데이터

// 마비노기 영웅전
const heroesOcid = await client.mabinogiHeroes.getOcid('캐릭터명');
const heroesBasic = await client.mabinogiHeroes.character.getBasic({ ocid: heroesOcid });

// 서든어택
const saOuid = await client.suddenAttack.getOuid('닉네임');
const matches = await client.suddenAttack.match.getList({ ouid: saOuid, match_mode: '폭파미션' });

// 마비노기
const items = await client.mabinogi.auction.listItems({ auction_item_category: '검' });

// 바람의나라 (서버 이름 필요)
const baramOcid = await client.baram.getOcid('캐릭터명', '연');
const baramBasic = await client.baram.character.getBasic({ ocid: baramOcid });

// 넥슨 Open API 공지
const { notice } = await client.platform.getNoticeList();
```

게임별 전체 API는 아래 [상세 문서](#상세-문서)를 참고하세요.

## 주요 특징

- **포털 전체 지원** — 넥슨 Open API 포털의 14개 게임과 Open API 공지를 하나의 `NexonClient`로 호출합니다.
- **타입 안전** — 요청과 응답 타입을 포털의 공식 OpenAPI 스펙에서 만들었습니다. `OCID`, `OUID`, `GuildId`, `NexonDate` 는 브랜드 타입이라 서로 섞어 쓰면 컴파일 오류가 납니다.
- **요청 전 입력 검증** — 빈 캐릭터명, 달력에 없는 날짜 같은 입력은 HTTP 요청을 보내기 전에 `NexonBadRequestError` 로 거부하고, 메시지에 고치는 방법을 담습니다.
- **에러 분류** — 넥슨 에러 코드에 따라 에러 클래스를 나눠 `instanceof` 로 분기할 수 있습니다([에러 처리](#에러-처리)).
- **자동 재시도** — HTTP 429와 503 응답은 지수 백오프로 재시도합니다. `Retry-After` 헤더가 있으면 그 값을 따릅니다.
- **런타임 응답 검증 (선택)** — `responseValidation: true` 로 켜면 응답의 최상위 구조가 SDK 타입과 다를 때 경고합니다. 배열 응답도 검사합니다([설정 옵션](#설정-옵션)).
- **포털 변경 추적** — 주간 모니터가 포털 스펙 변경을 감지해 스펙 갱신 PR을 열고, CI의 Spec Drift 검사가 SDK 타입과 공식 스펙의 차이를 막습니다([개발 · 기여](#개발--기여)).
- **외부 의존성 0, CJS + ESM** — 런타임 의존성이 없고, `require` 와 `import` 모두에서 타입이 해석됩니다. 게임별 [sub-path](#sub-path-import)도 제공합니다.

## 지원 게임

넥슨 Open API 포털이 제공하는 **14개 게임 전부와 Open API 공지(`client.platform`)를 지원**합니다 (2026-11-24 포털 기준, API 270개).

- <img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> — SDK에 구현된 게임. 아래 버전과 날짜는 처음 포함된 버전과 구현일입니다.
- **API 개수** — "SDK public API 메서드 수"(메서드 1개 = 넥슨 API 경로 1개)입니다. FC 온라인만 예외이며 아래 [표](#포털-대비-지원-범위)에 적었습니다.

<!-- 아이콘 파일: docs/assets/games/{game}.png (48x48 권장) -->

<table width="100%" cellspacing="0" cellpadding="8" style="table-layout:fixed;width:100%">
<tr>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/fc-online.png" alt="EA SPORTS FC 온라인" height="64">
<h4>EA SPORTS FC 온라인</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-18-blue" alt="SDK 지원 API 18개"><br>
<sub>v0.1.1 · 2026-03-04</sub><br>
<br>
<a href="docs/fc-online.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/maplestory.png" alt="메이플스토리" height="64">
<h4>메이플스토리</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-56-blue" alt="SDK 지원 API 56개"><br>
<sub>v0.1.0 · 2026-03-04</sub><br>
<br>
<a href="docs/maplestory.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/maplestory-m.png" alt="메이플스토리M" height="64">
<h4>메이플스토리M</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-38-blue" alt="SDK 지원 API 38개"><br>
<sub>v0.1.1 · 2026-03-05</sub><br>
<br>
<a href="docs/maplestory-m.md">레퍼런스</a><br>
<br>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/maplestory-sea.png" alt="MapleStorySEA" height="64">
<h4>MapleStorySEA</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-26-blue" alt="SDK 지원 API 26개"><br>
<sub>v0.1.1 · 2026-03-09</sub><br>
<br>
<a href="docs/maplestory-sea.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/maplestory-taiwan.png" alt="MapleStory Taiwan" height="64">
<h4>MapleStory Taiwan</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-27-blue" alt="SDK 지원 API 27개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/maplestory-tw.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/sudden-attack.png" alt="서든어택" height="64">
<h4>서든어택</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-11-blue" alt="SDK 지원 API 11개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/sudden-attack.md">레퍼런스</a><br>
<br>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/first-descendant.png" alt="퍼스트 디센던트" height="64">
<h4>퍼스트 디센던트</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-42-blue" alt="SDK 지원 API 42개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/first-descendant.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/mabinogi.png" alt="마비노기" height="64">
<h4>마비노기</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-5-blue" alt="SDK 지원 API 5개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/mabinogi.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/mabinogi-heroes.png" alt="마비노기 영웅전" height="64">
<h4>마비노기 영웅전</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-19-blue" alt="SDK 지원 API 19개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/mabinogi-heroes.md">레퍼런스</a><br>
<br>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/kartrider-rush-plus.png" alt="카트라이더 러쉬플러스" height="64">
<h4>카트라이더 러쉬플러스</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-9-blue" alt="SDK 지원 API 9개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/kartrider.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/baram-nara.png" alt="바람의나라" height="64">
<h4>바람의나라</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-7-blue" alt="SDK 지원 API 7개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/baram.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/hit2.png" alt="히트2" height="64">
<h4>히트2</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-2-blue" alt="SDK 지원 API 2개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/hit2.md">레퍼런스</a><br>
<br>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/baram-yeon.png" alt="바람의나라: 연" height="64">
<h4>바람의나라: 연</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-4-blue" alt="SDK 지원 API 4개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/baram-yeon.md">레퍼런스</a><br>
<br>
</td>
<td align="center" valign="top" width="33%">
<br>
<img src="docs/assets/games/v4.png" alt="V4" height="64">
<h4>V4</h4>
<img src="https://img.shields.io/badge/SDK-지원-brightgreen" alt="SDK 지원"> <img src="https://img.shields.io/badge/API-4-blue" alt="SDK 지원 API 4개"><br>
<sub>v0.2.0 · 2026-11-24</sub><br>
<br>
<a href="docs/v4.md">레퍼런스</a><br>
<br>
</td>
<td width="33%"></td>
</tr>
</table>

### 포털 대비 지원 범위

2026-11-24 넥슨 Open API 포털 스펙과 대조한 결과, **포털의 API 270개를 모두 지원합니다** (14개 게임 + platform).

| 게임                                   | SDK 메서드 | 포털 API 경로                                                         |
| -------------------------------------- | ---------- | --------------------------------------------------------------------- |
| 메이플스토리                           | 56         | 56                                                                    |
| 메이플스토리M                          | 38         | 38                                                                    |
| MapleStorySEA                          | 26         | 26                                                                    |
| MapleStory Taiwan                      | 27         | 27                                                                    |
| EA SPORTS FC 온라인                    | 18         | 19 (이미지 4개 경로를 URL 헬퍼 2개로 지원, [상세](docs/fc-online.md)) |
| 퍼스트 디센던트                        | 42         | 42                                                                    |
| 마비노기 영웅전                        | 19         | 19                                                                    |
| 서든어택                               | 11         | 11                                                                    |
| 카트라이더 러쉬플러스                  | 9          | 9                                                                     |
| 바람의나라                             | 7          | 7                                                                     |
| 마비노기                               | 5          | 5                                                                     |
| 바람의나라: 연                         | 4          | 4                                                                     |
| V4                                     | 4          | 4                                                                     |
| 히트2                                  | 2          | 2                                                                     |
| 넥슨 Open API 공지 (`client.platform`) | 1          | 1                                                                     |

SDK 메서드 합계는 269개입니다. FC 온라인의 이미지 경로 4개를 헬퍼 2개가 담당하고, 넥슨이 제공을 종료한 `getAllMatchList()` 가 deprecated 상태로 남아 있어 포털 경로 수(270)와 1 차이가 납니다.

### 범위 외: 네오플 API

던전앤파이터와 사이퍼즈는 넥슨 Open API가 아니라 [네오플 Developers](https://developers.neople.co.kr/) API로 제공됩니다. 호스트와 API 키가 달라 이 SDK의 지원 범위에 포함하지 않습니다.

- 던전앤파이터: [네오플 던전앤파이터 API](https://developers.neople.co.kr/contents/apiDocs/df)
- 사이퍼즈: [네오플 사이퍼즈 API](https://developers.neople.co.kr/contents/apiDocs/cyphers)

## 에러 처리

API 호출에서 SDK가 던지는 에러는 모두 `NexonError` 이거나 그 하위 클래스이고 `status`, `code`, `nexonMessage` 를 가집니다. 분류 기준은 HTTP 상태가 아니라 넥슨 에러 코드(`OPENAPI000xx`)입니다.

```ts
import {
  NexonClient,
  NexonError,
  NexonBadRequestError,
  NexonAuthError,
  NexonNotFoundError,
  NexonDataNotReadyError,
  NexonRateLimitError,
} from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

try {
  const ocid = await client.maplestory.getOcid('캐릭터명');
  const basic = await client.maplestory.character.getBasic({ ocid, date: '2026-11-23' });
  console.log(basic.character_name);
} catch (err) {
  if (err instanceof NexonBadRequestError) {
    // 입력이 잘못됨. 메시지에 문제가 된 입력과 고치는 방법이 들어 있다
    console.error(err.message);
  } else if (err instanceof NexonAuthError) {
    // API 키가 유효하지 않거나 이 게임용 키가 아님
  } else if (err instanceof NexonNotFoundError) {
    // 캐릭터·길드를 찾을 수 없음
  } else if (err instanceof NexonDataNotReadyError) {
    // 해당 날짜 데이터가 아직 없음 (일 단위 데이터는 KST 기준 다음 날 오전 1시 이후)
  } else if (err instanceof NexonRateLimitError) {
    // 자동 재시도(기본 3회)를 모두 쓴 뒤에도 한도 초과
    console.error(`재시도 대기: ${err.retryAfterMs ?? 1000}ms`);
  } else if (err instanceof NexonError) {
    // 서버 오류, 타임아웃, 네트워크 오류 등
    console.error(err.status, err.code, err.message);
  } else {
    throw err;
  }
}
```

SDK가 검사하는 입력은 요청을 보내기 전에 거부합니다.

```ts
await client.maplestory.getOcid('');
// NexonBadRequestError (code: 'OPENAPI00004', status: 400) — HTTP 요청 없이 즉시 throw
```

| 에러 클래스              | 넥슨 에러 코드                                               | 언제 발생하나                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `NexonBadRequestError`   | `OPENAPI00004`, `OPENAPI00006`                               | SDK 입력 검증 실패(요청 전, 항상 `OPENAPI00004`) 또는 서버가 파라미터를 HTTP 400으로 거부                                                     |
| `NexonAuthError`         | `OPENAPI00002`, `OPENAPI00005`                               | API 키가 유효하지 않거나 권한이 없음. `status` 는 서버가 준 값 그대로다. 실제 서버는 잘못된 키에 HTTP 400 + `OPENAPI00005` 를 준다 (403 아님) |
| `NexonNotFoundError`     | `OPENAPI00003`                                               | 캐릭터·길드 등 식별자를 찾을 수 없음 (HTTP 400)                                                                                               |
| `NexonDataNotReadyError` | `OPENAPI00009`, `OPENAPI00010`                               | 조회 가능 기간 이전 날짜이거나 당일 데이터가 아직 준비되지 않음 (HTTP 400)                                                                    |
| `NexonRateLimitError`    | `OPENAPI00007` 또는 HTTP 429                                 | 요청 한도 초과. 429는 자동 재시도 후에 던진다. `retryAfterMs` 는 `Retry-After` 헤더 값이며 헤더가 없으면 `undefined`                          |
| `NexonServerError`       | `OPENAPI00001`, `OPENAPI00008`, `OPENAPI00011` 또는 HTTP 5xx | 서버 내부 오류, 점검, 과부하. 503은 자동 재시도 후에 던진다                                                                                   |
| `NexonError` (기반)      | 없음 또는 분류되지 않은 코드                                 | 타임아웃, 네트워크 오류(`status` 가 `undefined`), 위에 해당하지 않는 응답                                                                     |

## 설정 옵션

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({
  apiKey: 'YOUR_API_KEY', // 필수
  timeoutMs: 10_000, // 요청 타임아웃 (기본 10000)
  maxRetries: 3, // HTTP 429/503 재시도 횟수 (기본 3)
  retryBaseDelayMs: 500, // 지수 백오프 기본 대기 시간 (기본 500)
  debug: false, // true면 요청·응답·재시도를 console.debug 로 출력 (기본 false)
  responseValidation: false, // 런타임 응답 shape 검증 (기본 false)
});
```

재시도 대기 시간은 `retryBaseDelayMs * 2^(시도 - 1)` 에 지터를 더한 값이고 최대 30초입니다. 429와 503 외의 응답은 재시도하지 않습니다.

### 로거와 런타임 응답 검증

`logger` 로 요청, 응답, 재시도 시점에 호출할 함수를 넘깁니다. `debug: true` 이면 SDK 기본 콘솔 로거를 쓰고 `logger` 는 무시합니다.

넥슨이 응답 구조를 바꾸면 TypeScript 타입만으로는 알 수 없습니다. `responseValidation: true` 를 켜면 응답의 최상위 키와 타입(배열 응답은 각 원소)을 SDK가 기대하는 구조와 비교하고, 다르면 `logger.onResponseShapeMismatch` 로 알립니다. 예외를 던지지 않고 응답도 그대로 반환하므로, 개발·모니터링 환경에서 넥슨의 응답 구조 변경을 일찍 발견하는 용도입니다.

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({
  apiKey: 'YOUR_API_KEY',
  responseValidation: true,
  logger: {
    onRequest: (info) => console.log(`→ ${info.method} ${info.url}`),
    onResponse: (info) => console.log(`← ${info.status} (${info.durationMs}ms)`),
    onRetry: (info) => console.warn(`↩ retry #${info.attempt} after ${info.waitMs}ms`),
    onResponseShapeMismatch: (mismatch) => {
      console.warn(mismatch.url, mismatch.missingKeys, mismatch.unexpectedKeys);
    },
  },
});
```

`debug: true` 와 함께 쓰면 기본 로거가 불일치를 `console.warn` 으로 출력합니다. `debug` 도 `onResponseShapeMismatch` 도 없으면 불일치가 있어도 아무것도 출력하지 않습니다. 중첩 필드는 검사하지 않습니다.

## Sub-path Import

게임마다 `nexon-open-api/{sub-path}` 진입점이 있고, 그 게임의 Client 클래스와 타입만 내보냅니다. sub-path는 아래 [상세 문서](#상세-문서) 표에 있습니다. 루트(`nexon-open-api`)에서도 같은 이름을 모두 가져올 수 있습니다.

```ts
import { HttpClient } from 'nexon-open-api';
import { MapleStoryClient } from 'nexon-open-api/maplestory';
import type { CharacterBasic } from 'nexon-open-api/maplestory';

// 게임 Client를 직접 만들 때는 루트의 HttpClient를 넘긴다
const maplestory = new MapleStoryClient(new HttpClient({ apiKey: 'YOUR_API_KEY' }));
const ocid = await maplestory.getOcid('캐릭터명');
const basic: CharacterBasic = await maplestory.character.getBasic({ ocid });
```

## 상세 문서

| 게임                  | Client 프로퍼티          | sub-path           | 문서                                     | 카테고리                                        |
| --------------------- | ------------------------ | ------------------ | ---------------------------------------- | ----------------------------------------------- |
| 메이플스토리          | `client.maplestory`      | `maplestory`       | [API 레퍼런스](docs/maplestory.md)       | 캐릭터, 유니온, 길드, 랭킹, 확률/이력, 공지사항 |
| 메이플스토리M         | `client.maplestorym`     | `maplestory-m`     | [API 레퍼런스](docs/maplestory-m.md)     | 캐릭터, 유니온, 길드, 랭킹, 공지사항            |
| MapleStorySEA         | `client.maplestorySEA`   | `maplestory-sea`   | [API 레퍼런스](docs/maplestory-sea.md)   | 캐릭터, 유니온, 길드                            |
| MapleStory Taiwan     | `client.maplestoryTW`    | `maplestory-tw`    | [API 레퍼런스](docs/maplestory-tw.md)    | 캐릭터, 유니온, 길드                            |
| EA SPORTS FC 온라인   | `client.fcOnline`        | `fconline`         | [API 레퍼런스](docs/fc-online.md)        | 계정 정보, 매치, 랭커, 메타데이터, 이미지 URL   |
| 퍼스트 디센던트       | `client.firstDescendant` | `first-descendant` | [API 레퍼런스](docs/first-descendant.md) | 계정, 메타데이터, 추천 모듈, 리더보드           |
| 마비노기 영웅전       | `client.mabinogiHeroes`  | `mabinogi-heroes`  | [API 레퍼런스](docs/mabinogi-heroes.md)  | 캐릭터, 메타(인챈트), 거래소, 랭킹, 공지사항    |
| 서든어택              | `client.suddenAttack`    | `sudden-attack`    | [API 레퍼런스](docs/sudden-attack.md)    | 계정, 매치, 메타데이터                          |
| 카트라이더 러쉬플러스 | `client.kartrider`       | `kartrider`        | [API 레퍼런스](docs/kartrider.md)        | 계정, 공지사항                                  |
| 바람의나라            | `client.baram`           | `baram`            | [API 레퍼런스](docs/baram.md)            | 캐릭터                                          |
| 마비노기              | `client.mabinogi`        | `mabinogi`         | [API 레퍼런스](docs/mabinogi.md)         | NPC 상점, 경매장, 거대한 외침의 뿔피리          |
| 바람의나라: 연        | `client.baramYeon`       | `baram-yeon`       | [API 레퍼런스](docs/baram-yeon.md)       | 캐릭터                                          |
| V4                    | `client.v4`              | `v4`               | [API 레퍼런스](docs/v4.md)               | 캐릭터                                          |
| 히트2                 | `client.hit2`            | `hit2`             | [API 레퍼런스](docs/hit2.md)             | 캐릭터                                          |
| 넥슨 Open API 공지    | `client.platform`        | `platform`         | [API 레퍼런스](docs/platform.md)         | 공지 사항                                       |

`client.maplestorym` 의 `m` 은 소문자입니다. 버전별 변경 내용은 [CHANGELOG.md](CHANGELOG.md), 버전 정책은 [SEMVER.md](SEMVER.md)에 있습니다.

## 실서버 검증 현황

이 SDK가 실제 넥슨 서버와 어디까지 대조됐는지 구분해서 적습니다.

- **모든 API는 넥슨 포털의 공식 OpenAPI 스펙을 기준으로 구현했습니다.** 경로, 파라미터, 응답 필드를 스펙과 대조하고, CI가 SDK 타입과 스펙의 차이를 검사합니다.
- **API 키 없이 열리는 정적 메타데이터는 실제 응답과 대조했습니다.** FC 온라인, 퍼스트 디센던트, 서든어택의 메타데이터와 FC 온라인 이미지 CDN이 여기에 해당합니다. 실응답이 스펙과 다른 곳은 실응답에 맞췄습니다.
- **API 키가 필요한 API는 0.2.0 기준으로 실 API 키 E2E 검증을 하지 않았습니다.** 단위 테스트는 스펙으로 합성한 응답을 사용합니다. 메이플스토리는 0.1.x 때 실 키 E2E를 통과했지만 0.2.0에서 추가·변경한 부분은 다시 확인하지 않았습니다. 스펙과 실제 응답이 다르면 타입이 어긋날 수 있으니, 그런 경우 [이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 알려 주세요.

게임별 검증 방식과 날짜는 코드에서 확인할 수 있습니다. 키는 path prefix입니다 (`maplestory`, `maplestorym`, `fconline`, `tfd`, `heroes` 등).

```ts
import { getApiMetadata } from 'nexon-open-api';

const meta = getApiMetadata('tfd');
console.log(meta?.lastVerifiedAt, meta?.note);
```

발급받은 키로 직접 E2E를 돌릴 수 있습니다. 저장소를 받은 뒤 `.env.example` 을 `.env` 로 복사하고, 확인할 게임의 API 키와 캐릭터명 등을 채운 다음 그 게임의 스크립트를 실행합니다. API 키는 게임마다 따로 발급됩니다.

```bash
cp .env.example .env
corepack yarn test:maplestory   # test:{game} — 게임 15개 모두 스크립트가 있다 (package.json 참고)
```

## 개발 · 기여

```bash
corepack yarn install
```

| 구분        | 명령                                                                                 | 설명                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 검사        | `yarn type-check` → `yarn lint` → `yarn test` → `yarn build` → `yarn check:exports`  | 코드 변경 후 이 순서로 확인한다. `check:exports` 는 빌드된 패키지의 sub-path별 CJS/ESM 타입 해석을 검사한다 |
| 스펙        | `yarn specs:fetch` / `specs:check` / `specs:diff` / `specs:drift` / `specs:coverage` | 포털 스펙 수집 / 포털 변경 감지 / 스냅샷 비교와 SEMVER 분류 / SDK 타입과 스펙 대조 / 경로 커버리지          |
| 실서버 확인 | `yarn test:live`                                                                     | API 키 없이 실제 넥슨 서버의 정적 메타데이터와 에러 경로를 확인한다                                         |
| 패키지 확인 | `yarn test:package`                                                                  | npm 패키지를 설치해 CJS, ESM, TypeScript에서 사용할 수 있는지 확인한다                                      |

SDK 코드는 `specs/openapi/` 에 저장한 포털 OpenAPI YAML을 원천으로 만듭니다. 매주 월요일 API Monitor 워크플로가 포털을 저장된 스펙과 비교하고, 변경이 있으면 스펙 갱신 PR을 엽니다. 이어서 SDK Auto Update 워크플로가 호환되는 변경(필드 추가, deprecation)을 SDK에 반영하고 검증을 통과한 패치만 PR에 올립니다. 호환되지 않는 변경과 새 게임은 사람이 판단하고, 머지와 배포도 사람이 합니다. CI의 Spec Drift 검사(`yarn specs:drift --strict`)는 SDK 타입이 커밋된 스펙에서 벗어나면 실패합니다.

구조, 네이밍, 게임 추가 절차는 [CLAUDE.md](CLAUDE.md)에, 스펙 형식과 포털 변경 대응 절차는 [specs/README.md](specs/README.md)에 있습니다. 버그 제보와 PR은 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 받습니다.

## 면책 조항

이 프로젝트는 넥슨(NEXON Korea Corporation)이 제휴, 승인, 후원하지 않는 **비공식** 서드파티 라이브러리입니다.

- 이 SDK에서 사용하는 모든 게임명, 로고 및 관련 상표의 권리는 넥슨에 있습니다 ([이용약관 제6조 ①](https://openapi.nexon.com/ko/support/terms/)).
- 이 SDK는 [NEXON Open API](https://openapi.nexon.com/)를 통해 데이터를 제공받습니다 ([이용약관 제6조 ④](https://openapi.nexon.com/ko/support/terms/)).
- API 사용 시 [Nexon Open API 이용약관](https://openapi.nexon.com/ko/support/terms/)을 준수해 주세요.

## 라이선스

이 SDK의 소스 코드는 [MIT](LICENSE) 라이선스를 따릅니다.
단, API를 통해 제공되는 데이터의 저작권은 넥슨에 있으며, 데이터의 무단 복제/재배포/영리적 이용은 이용약관에 의해 제한됩니다.
