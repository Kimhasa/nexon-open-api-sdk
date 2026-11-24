# CLAUDE.md — nexon-open-api SDK

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

넥슨 Open API를 TypeScript로 감싼 SDK 라이브러리.
CJS + ESM 듀얼 출력, Node.js 18+, 외부 의존성 0.

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'your-api-key' });

const ocid = await client.maplestory.getOcid('캐릭터명');
const basic = await client.maplestory.character.getBasic({ ocid });
```

## 개발 명령어

| 명령어                              | 설명                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `yarn dev`                          | tsup watch 모드                                                                                |
| `yarn build`                        | 프로덕션 빌드 (`dist/`)                                                                        |
| `yarn type-check`                   | `tsc --noEmit` (src) + `tsc -p tsconfig.test.json` (src, tests, scripts)                       |
| `yarn lint` / `yarn lint:fix`       | ESLint (`src`, `tests`, `scripts`)                                                             |
| `yarn check:exports`                | 빌드된 패키지의 sub-path별 CJS/ESM 타입 해석 검사 (attw, `yarn build` 후, `exports` 자동 탐색) |
| `yarn format` / `yarn format:check` | Prettier                                                                                       |
| `yarn test`                         | Vitest 1회 실행                                                                                |
| `yarn test:watch`                   | Vitest watch                                                                                   |
| `yarn test:coverage`                | Vitest + 커버리지                                                                              |
| `yarn test:{game}`                  | 실 API E2E 스크립트 (`scripts/test-*.ts`, `.env`에 API 키 필요)                                |
| `yarn specs:fetch`                  | 넥슨 포털의 OpenAPI YAML을 `specs/openapi/`로 수집                                             |
| `yarn specs:check`                  | 포털 변경 감지 (저장된 스펙과 포털 비교)                                                       |
| `yarn specs:coverage`               | SDK가 구현한 경로 vs 스펙 경로 커버리지 대조                                                   |
| `yarn release`                      | 빌드 + 테스트 + `npm publish` (**버전 범프 없음** — 아래 참고)                                 |

- `yarn test:{game}` 은 구현된 게임마다 하나씩 15개다 (`test:maplestory`, `test:maplestory-m`, `test:maplestory-sea`, `test:maplestory-tw`, `test:fconline`, `test:first-descendant`, `test:mabinogi-heroes`, `test:sudden-attack`, `test:kartrider`, `test:baram`, `test:mabinogi`, `test:baram-yeon`, `test:v4`, `test:hit2`, `test:platform`). 필요한 환경변수는 `.env.example` 참고.
- `yarn release` 는 `package.json` 의 `version` 을 바꾸지 않는다. 버전은 직접 올리고 태그(`v{version}`)를 만든다. 태그를 push하면 CI도 `npm publish` 를 실행하므로 두 경로를 같은 버전에 함께 쓰지 않는다.

**코드 변경 후 반드시**: `yarn type-check` → `yarn lint` → `yarn test` → `yarn build` → `yarn check:exports` 순서로 확인. 게임 API를 추가·수정했다면 `yarn specs:coverage` 로 스펙 대비 경로도 확인한다.

- 줄 끝은 `.gitattributes` 로 LF 고정이다 (Windows `core.autocrlf=true` 에서도 `format:check` 통과). `specs/openapi/*.yaml` 은 포털 원문을 바이트 그대로 보존하므로 `-text` 이고 Prettier 대상에서도 빠진다 (`.prettierignore`).

## 디렉토리 구조

```
src/
├── core/                                    # 공유 인프라 (게임 무관)
│   ├── http/                                # HttpClient, retry, http-types
│   ├── errors/                              # NexonError 계층 (6개 서브클래스), classify-error, error-codes
│   ├── metadata/api-metadata.ts             # 게임별 API 검증 메타데이터 (API_METADATA)
│   ├── validation/response-shape.ts         # 런타임 응답 shape 검증
│   ├── deprecation/deprecation.ts           # deprecation 경고 유틸
│   └── types/
│       ├── branded.ts                       # Brand<T,B> 유틸리티 타입만
│       └── pagination.ts                    # CursorPage<T>, CursorPageRequest
├── games/
│   ├── _base/                               # 공유 추상 기반
│   │   ├── AbstractGameClient.ts            # 최상위 기반 (pathPrefix, buildUrl)
│   │   ├── AbstractMapleStoryBaseClient.ts  # class AbstractMapleBaseClient (파일명과 클래스명이 다름)
│   │   ├── maple-base-types.ts              # OCID, GuildId, NexonDate + 공유 요청 타입
│   │   └── maple-date.ts                    # toNexonDate(), DateRange
│   ├── maplestory/                          # 메이플스토리 (KMS)
│   ├── maplestory-m/                        # 메이플스토리M
│   ├── maplestory-sea/                      # MapleStory SEA
│   ├── maplestory-tw/                       # MapleStory Taiwan
│   ├── fc-online/                           # EA SPORTS FC 온라인
│   ├── first-descendant/                    # 퍼스트 디센던트
│   ├── mabinogi-heroes/                     # 마비노기 영웅전
│   ├── sudden-attack/                       # 서든어택
│   ├── kartrider/                           # 카트라이더 러쉬플러스
│   ├── baram/                               # 바람의나라
│   ├── mabinogi/                            # 마비노기
│   ├── baram-yeon/                          # 바람의나라: 연
│   ├── v4/                                  # V4
│   ├── hit2/                                # 히트2
│   └── platform/                            # 넥슨 Open API 공지
├── NexonClient.ts                           # 메인 진입점
└── index.ts                                 # root public exports

specs/
├── README.md                                # 스펙 수집·갱신 설명서
└── openapi/
    ├── index.json                           # 게임·카테고리·오퍼레이션 색인
    └── {slug}/{categoryId}.yaml             # 포털 카테고리별 OpenAPI YAML (원천 스펙)

scripts/                                     # specs:* 스크립트, 실 API E2E 스크립트(test-*.ts)
docs/                                        # 게임별 API 레퍼런스 ({game}.md), 아이콘

tests/
├── setup.ts                                 # MSW 서버 lifecycle (listen / resetHandlers / close)
├── fixtures/{game}/*.fixture.ts             # 응답 fixture 고정 데이터
├── mocks/server.ts                          # MSW 서버
├── mocks/handlers/{game}.handlers.ts        # 게임별 MSW HTTP 핸들러
├── mocks/handlers/index.ts                  # 전체 핸들러 등록
└── unit/{core,games}/                       # 단위 테스트
```

게임 디렉토리 내부 구조 (하위 카테고리가 있는 게임 기준):

```
src/games/{game}/
├── {Game}Client.ts                          # 게임 진입 클라이언트 (lazy getter로 sub-client 보유)
├── index.ts                                 # sub-path export entry (tsup entry)
├── shapes.ts                                # 응답 shape descriptor
├── types.ts                                 # 게임 공통 요청 타입 (필요 시)
└── {category}/
    ├── {Game}{Category}Client.ts            # 카테고리 sub-client
    └── types.ts                             # 요청/응답 타입
```

FC Online처럼 API 수가 적은 게임은 sub-client 없이 `{Game}Client.ts` 하나에 메서드를 두고, 타입만 `{category}/types.ts` 로 나눈다.

## 클래스 계층 구조

```
NexonClient
├── .maplestory      → MapleStoryClient      (UTC+9, prefix: maplestory)
├── .maplestorym     → MapleStoryMClient     (prefix: maplestorym)
├── .maplestorySEA   → MapleStorySEAClient   (UTC+8, prefix: maplestorysea)
├── .maplestoryTW    → MapleStoryTWClient    (UTC+8, prefix: maplestorytw)
├── .fcOnline        → FcOnlineClient        (prefix: fconline)
├── .firstDescendant → FirstDescendantClient (prefix: tfd)
├── .mabinogiHeroes  → MabinogiHeroesClient  (prefix: heroes)
├── .suddenAttack    → SuddenAttackClient    (prefix: suddenattack)
├── .kartrider       → KartriderClient       (prefix: kartrush)
├── .baram           → BaramClient           (prefix: baram)
├── .mabinogi        → MabinogiClient        (prefix: mabinogi)
├── .baramYeon       → BaramYeonClient       (prefix: baramy)
├── .v4              → V4Client              (prefix: v4)
├── .hit2            → Hit2Client            (prefix: hit2)
└── .platform        → PlatformClient        (prefix: platform)

AbstractGameClient (abstract — 모든 게임의 최상위 기반)
├── abstract pathPrefix: string
├── constructor(http: HttpClient)
└── buildUrl(path, version = 'v1'): string   // https://open.api.nexon.com/{pathPrefix}/{version}/{path}

AbstractMapleBaseClient extends AbstractGameClient
│   (파일: _base/AbstractMapleStoryBaseClient.ts)
├── abstract timezoneOffset: number       // 540 (KST) | 480 (SGT/TST)
└── formatDate(date): NexonDate

NexonError (base)
├── NexonRateLimitError    (429 / OPENAPI00007)
├── NexonAuthError         (OPENAPI00002, 00005 — 코드로 분류, status는 서버 값 그대로)
├── NexonNotFoundError     (400 / OPENAPI00003)
├── NexonBadRequestError   (400 / OPENAPI00004, 00006)
├── NexonDataNotReadyError (400 / OPENAPI00009, 00010)
└── NexonServerError       (5xx / OPENAPI00001, 00008, 00011)
```

분류 기준은 HTTP 상태가 아니라 넥슨 에러 코드다 (`classify-error.ts`). 실제 서버는 잘못된 API 키에 403이 아니라 HTTP 400 + `OPENAPI00005` 를 돌려준다 (2026-11-24 실측).

## 아키텍처 규칙

- **날짜 기준 조회가 있는 메이플 게임** (KMS, SEA, TW) → `AbstractMapleBaseClient` 상속 (timezoneOffset + formatDate)
- **그 외 게임** → `AbstractGameClient` 직접 상속
  - **메이플스토리M도 여기에 속한다.** M의 캐릭터·유니온·길드 API는 `date` 파라미터가 없어서(`MOcidRequest` 는 `ocid` 만 가짐) timezone 기반 날짜 변환이 필요 없고, 요청 타입도 KMS 공유 타입(`OcidDateRequest`)과 다르다. PR #2에서 의도적으로 `AbstractMapleBaseClient` 의존을 제거했다. 랭킹의 `date` 는 문자열 그대로 전달한다.
- **Sub-client** → lazy getter (`??=` 패턴)로 초기화, 미사용 시 할당 비용 0. sub-client는 기반 클래스를 상속하지 않고 `constructor(private readonly http: HttpClient)` 만 받는다
- **Branded Types** → OCID, GuildId, NexonDate는 `_base/maple-base-types.ts`, OUID는 `fc-online/user/types.ts`에 정의. `core/types/branded.ts`는 `Brand<T,B>` 유틸리티만 보유
- **HttpClient** → 429/503만 재시도, 나머지 즉시 throw. `x-nxopen-api-key` 헤더 자동 주입
- **에러 분류** → OPENAPI 에러 코드 기반 서브클래스 분류 (`classify-error.ts`)
- **SDK 경계 입력 검증** → `src/core/validation/input.ts` 의 공용 헬퍼를 사용한다. 게임별 조건과 상수는 해당 게임에 두고 `NexonBadRequestError` (`OPENAPI00004`)로 알린다.
- **신규 게임 공개 export** → 게임의 `index.ts` 에 게임별 접두어가 있는 Client, sub-client, 공개 타입을 내보낸다. 루트 진입점도 게임별 `index.ts` 를 재노출한다.
- **엔드포인트 URL** → 두 방식이 공존한다. 한 게임 안에서는 한 방식만 쓴다
  - 메이플 계열(KMS, M, SEA): sub-client마다 `private static readonly BASE = 'https://open.api.nexon.com/{prefix}/v1'` 상수를 두고 `` `${Xxx.BASE}/character/basic` `` 로 조립. 게임 진입 클라이언트는 `this.buildUrl('id')` 사용
  - FC Online: `fc-online/endpoints.ts` 에 `as const` 객체로 모아 관리 (`/static/...`, CDN처럼 host 경로가 여러 갈래일 때 적합)
- **새 게임 추가 시** → `API_METADATA`에 엔트리 추가 필수. 키는 path prefix와 같게 한다 (`maplestory`, `maplestorym`, `maplestorysea`, `fconline`)

## API 버전 관리

### Semver 정책 (`SEMVER.md` 참조)

- 넥슨 응답 필드 추가 → SDK optional 필드 추가 → **MINOR**
- 넥슨 응답 필드 삭제 → `@deprecated` + optional → **MINOR** (다음 MAJOR에서 삭제)
- 넥슨 필드 타입 변경 → SDK 타입 변경 → **MAJOR**
- public 메서드 제거/이름 변경 → **MAJOR**
- 새 게임 클라이언트·메서드 추가 → **MINOR**

게시된 버전: `0.1.0` (2026-03-04, KMS), `0.1.1` (2026-03-18, + M·SEA·FC). 상세는 `CHANGELOG.md`.

### 런타임 응답 Shape 검증

- `responseValidation: true` 옵션으로 활성화 (warn-only, opt-in)
- `shapes.ts`에 shape descriptor 정의 → `HttpClient.get()` 3번째 param으로 전달
- 배열 응답은 `arrayOf(itemShape)` (`src/core/validation/response-shape.ts`), 단일 객체도 배열로 받는 응답은 `arrayOf(itemShape, { allowSingleObject: true })`
- 현황: 구현된 모든 게임에 적용 (KMS·M·SEA·FC)

### HttpClient 요청별 옵션

- `HttpClient.get(url, params?, shape?, options?)` — `options.headers` 로 이 요청에만 헤더를 추가·덮어쓴다. 값이 `undefined` 면 기본 헤더를 제거한다 (예: KMS `getLegacyOuid` 는 `x-nxopen-api-key` 를 빼고 `x-nxopen-legacy-api-key` 만 보낸다).
- 전용 `HttpClient` 인스턴스를 새로 만들지 않는다. 사용자의 `timeoutMs`·`maxRetries`·`logger`·인터셉터가 적용되지 않기 때문이다.

## DX 원칙

> IntelliSense가 문서이고, 에러 메시지가 튜토리얼이다.

### JSDoc 필수

모든 public API에 JSDoc 작성. `@param`, `@throws`, `@example` 포함.
`@example`은 복사-붙여넣기 가능한 실제 코드여야 한다.

### Date Coercion

`date` 파라미터는 `Date | NexonDate | 'today' | string` 모두 수용하고,
SDK 내부에서 지역 타임존 기준 `YYYY-MM-DD` 로 변환하는 것이 목표다 (`toNexonDate()` / `formatDate()`).

현황: 변환 유틸은 있지만 기존 sub-client는 `date?: NexonDate | string` 을 받아 그대로 전달한다. 새 코드에서 `Date` 를 받으려면 `toNexonDate(date, timezoneOffset)` 를 거친다.

### Auto-pagination 네이밍

- `getXxx()` / `listXxx()` → 단일 페이지
- `iterateXxx()` → `AsyncGenerator<T>` (자동 페이지네이션)
- `collectXxx()` → `Promise<T[]>` (전체 수집)

현황: `iterateXxx` / `collectXxx` 구현 사례는 아직 없다. 추가할 때 이 이름을 따른다.

### 에러 메시지 = 미니 튜토리얼

에러 발생 시 다음 행동을 명확히 안내. "무엇이 틀렸고, 어떻게 고치는지" 포함.

```ts
throw new NexonRateLimitError(
  'API 호출 한도를 초과했습니다. ' +
    'SDK가 자동으로 3회 재시도했으나 실패했습니다. ' +
    'new NexonClient({ maxRetries: 5 })로 재시도 횟수를 늘리거나 요청 빈도를 줄여주세요.',
  { retryAfterMs: 1000 },
);
```

### SDK 경계 입력 검증

빈 식별자, 범위를 벗어난 날짜 등 SDK가 검사하는 입력은 HTTP 요청 전에 검증한다. `assertNonEmptyString`, `assertOneOf`, `assertInteger`, `assertDateInRange` 를 재사용하고, 게임별 조건 조합은 `invalidInput(message, hint)` 으로 알린다. 모든 검증 실패는 `NexonBadRequestError` (`code: 'OPENAPI00004'`)를 던지며, 메시지에 문제가 된 입력과 수정 방법을 포함한다.

### 메서드 네이밍

| 패턴                                | 메서드명                             | 반환 타입                                        |
| ----------------------------------- | ------------------------------------ | ------------------------------------------------ |
| 단건 조회                           | `getXxx(params)`                     | `Promise<T>`                                     |
| 이름으로 단건 조회                  | `getXxxByName(name)`                 | `Promise<T>`                                     |
| 식별자 조회                         | `getOcid(name)`                      | `Promise<OCID>`                                  |
| 커서 목록 한 페이지 (`next_cursor`) | `listXxx(params)`                    | `Promise<CursorPage<T>>` 또는 게임별 페이지 응답 |
| 커서 없는 목록                      | `getList(params)` / `getXxx(params)` | `Promise<T[]>` 또는 게임별 목록 응답             |
| 자동 순회                           | `iterateXxx(params)`                 | `AsyncGenerator<T>`                              |
| 전체 수집                           | `collectXxx(params)`                 | `Promise<T[]>`                                   |

**금지**: 메서드 이름에 컨텍스트 중복 — `character.getBasic()` ✅, `character.getCharacterBasic()` ❌

예를 들어 `mabinogi.auction.listItems()` 는 `next_cursor` 를 반환하고, `suddenAttack.match.getList()` 는 커서 없이 매치 목록을 반환한다.

## 파일 네이밍 규칙

| 종류        | 패턴                 | 예시                         |
| ----------- | -------------------- | ---------------------------- |
| 클래스 파일 | `PascalCase.ts`      | `NexonClient.ts`             |
| 타입 파일   | `types.ts`           | `character/types.ts`         |
| 유틸/인프라 | `kebab-case.ts`      | `maple-date.ts`              |
| 테스트      | `{대상}.test.ts`     | `maplestory-client.test.ts`  |
| fixture     | `{이름}.fixture.ts`  | `character-basic.fixture.ts` |
| MSW 핸들러  | `{game}.handlers.ts` | `maplestory-sea.handlers.ts` |

클래스 파일명은 클래스명과 같게 짓는다. 예외는 `_base/AbstractMapleStoryBaseClient.ts` (클래스명 `AbstractMapleBaseClient`) 하나이며, 기존 import 경로를 유지하려고 그대로 둔 것이다. 새 파일에서는 따라 하지 않는다.

### `index.ts` 규칙

`index.ts` 는 **패키지의 공개 진입점에만** 만든다.

| 위치                                    | 역할                                                                   | 새로 만들어도 되는가     |
| --------------------------------------- | ---------------------------------------------------------------------- | ------------------------ |
| `src/index.ts`                          | root public exports (`nexon-open-api`)                                 | 이미 있음 (하나뿐)       |
| `src/games/{game}/index.ts`             | 게임별 sub-path entry (`nexon-open-api/{subpath}`, tsup entry와 1:1)   | 게임당 1개 필수          |
| `src/core/{errors,http,types}/index.ts` | core 내부 모듈 묶음. `src/index.ts` 가 errors·types를 여기서 re-export | 아니오 (기존 3개만 유지) |
| `tests/mocks/handlers/index.ts`         | 전체 MSW 핸들러 등록                                                   | 이미 있음                |

- 그 밖의 위치(카테고리 디렉토리 등)에는 `index.ts` 를 만들지 않는다. `src/games/maplestory/character/index.ts` 는 어디서도 import하지 않는 초기 잔재이므로 본뜨지 않는다.
- SDK 내부 코드는 `index.ts` 를 거치지 않고 실제 파일을 직접 import한다 (`'./character/types.js'`).

## TypeScript 스타일

- `interface` — API 응답/요청 타입
- `type` — 유니온, 유틸리티 타입
- `class` — Client 계층
- `as const` — 엔드포인트 상수 객체
- `import type { ... }` — 타입 전용 import 분리 (`verbatimModuleSyntax`)
- import 경로는 `.js` 확장자 포함 (ESM)
- `any` 금지 → `unknown` + 타입 가드
- 모든 response 필드는 `readonly`
- 필드명 API 응답 그대로 (snake_case 유지)
- `exactOptionalPropertyTypes: true` → optional 타입에 `| undefined` 명시
- 게임별 타입 prefix: KMS=없음, M=`M`, SEA=`SEA`, TW=`TW`, FC=`Fc`. 새 게임도 root export에서 이름이 겹치지 않게 게임 prefix를 붙인다

## 지원 게임

Base URL: `https://open.api.nexon.com/`

범위는 넥슨 Open API 포털(`https://openapi.nexon.com`)이 제공하는 **14개 게임 + `platform`** 이다 (2026-11-24 포털 기준).
"포털 API 수"는 포털 OpenAPI YAML의 경로 수, "SDK"는 게임 클라이언트의 public API 메서드 수다.

### 구현된 게임 (15개, 포털 270/270)

| 게임                  | Client 프로퍼티          | Client 클래스           | Path Prefix     | 디렉토리 / sub-path                     | Base Class                | 타입 prefix    | SDK / 포털 |
| --------------------- | ------------------------ | ----------------------- | --------------- | --------------------------------------- | ------------------------- | -------------- | ---------- |
| 메이플스토리 (KMS)    | `client.maplestory`      | `MapleStoryClient`      | `maplestory`    | `maplestory` / `maplestory`             | `AbstractMapleBaseClient` | (없음)         | 56 / 56    |
| 메이플스토리M         | `client.maplestorym`     | `MapleStoryMClient`     | `maplestorym`   | `maplestory-m` / `maplestory-m`         | `AbstractGameClient`      | `M`            | 38 / 38    |
| MapleStory SEA        | `client.maplestorySEA`   | `MapleStorySEAClient`   | `maplestorysea` | `maplestory-sea` / `maplestory-sea`     | `AbstractMapleBaseClient` | `SEA`          | 26 / 26    |
| MapleStory Taiwan     | `client.maplestoryTW`    | `MapleStoryTWClient`    | `maplestorytw`  | `maplestory-tw` / `maplestory-tw`       | `AbstractMapleBaseClient` | `TW`           | 27 / 27    |
| EA SPORTS FC 온라인   | `client.fcOnline`        | `FcOnlineClient`        | `fconline`      | `fc-online` / `fconline`                | `AbstractGameClient`      | `Fc`           | 18 / 19    |
| 퍼스트 디센던트       | `client.firstDescendant` | `FirstDescendantClient` | `tfd`           | `first-descendant` / `first-descendant` | `AbstractGameClient`      | `Tfd`          | 42 / 42    |
| 마비노기 영웅전       | `client.mabinogiHeroes`  | `MabinogiHeroesClient`  | `heroes`        | `mabinogi-heroes` / `mabinogi-heroes`   | `AbstractGameClient`      | `Heroes`       | 19 / 19    |
| 서든어택              | `client.suddenAttack`    | `SuddenAttackClient`    | `suddenattack`  | `sudden-attack` / `sudden-attack`       | `AbstractGameClient`      | `SuddenAttack` | 11 / 11    |
| 카트라이더 러쉬플러스 | `client.kartrider`       | `KartriderClient`       | `kartrush`      | `kartrider` / `kartrider`               | `AbstractGameClient`      | `Kartrider`    | 9 / 9      |
| 바람의나라            | `client.baram`           | `BaramClient`           | `baram`         | `baram` / `baram`                       | `AbstractGameClient`      | `Baram`        | 7 / 7      |
| 마비노기              | `client.mabinogi`        | `MabinogiClient`        | `mabinogi`      | `mabinogi` / `mabinogi`                 | `AbstractGameClient`      | `Mabinogi`     | 5 / 5      |
| 바람의나라: 연        | `client.baramYeon`       | `BaramYeonClient`       | `baramy`        | `baram-yeon` / `baram-yeon`             | `AbstractGameClient`      | `BaramYeon`    | 4 / 4      |
| V4                    | `client.v4`              | `V4Client`              | `v4`            | `v4` / `v4`                             | `AbstractGameClient`      | `V4`           | 4 / 4      |
| 히트2                 | `client.hit2`            | `Hit2Client`            | `hit2`          | `hit2` / `hit2`                         | `AbstractGameClient`      | `Hit2`         | 2 / 2      |
| 넥슨 Open API 공지    | `client.platform`        | `PlatformClient`        | `platform`      | `platform` / `platform`                 | `AbstractGameClient`      | `Platform`     | 1 / 1      |

- `client.maplestorym` 은 소문자 `m` 이다 (`maplestoryM` 아님).
- FC는 디렉토리(`fc-online`)와 sub-path(`fconline`)가 다르다. 나머지 게임은 같다.
- FC의 18은 HTTP 메서드 16 + 이미지 URL 헬퍼 2. 헬퍼 2개가 포털의 이미지 4경로를 담당하며 호스트는 CDN `fco.dn.nexoncdn.co.kr` 이다 (`open.api.nexon.com` 은 400). `getAllMatchList` (`/fconline/v1/match`)는 넥슨이 제공을 종료해 deprecated이고 포털 스펙에 없다.
- FC `getMaxDivision` 은 스펙(단일 객체)과 달리 매치 종류별 배열로 정규화하고, `getSeasonMeta` 는 실응답의 `seasonid`(문자열)를 스펙 형태 `seasonId`(정수)로 맞춘다. 이런 의도적 차이는 `specs/drift-baseline.json` 에 이유와 함께 기록한다.
- **Path prefix는 포털 slug와 같다** (`heroes`, `kartrush`, `baram`, `baramy` 등). 포털은 모르는 slug에도 200(목록 페이지)을 돌려주므로 slug는 `specs/openapi/index.json` 에서 확인한다.
- `platform` 의 경로는 `/platform/openapi/v1/notice` 로 `{prefix}/v1/{path}` 꼴이 아니다 (`buildUrl('notice', 'openapi/v1')`).
- 일부 경로는 `v1` 이 아니다 (예: 영웅전 V2 캐릭터 API, KMS `/maplestory/legacy/ouid`, 정적 메타 `/static/{prefix}/meta/...`). 경로는 항상 스펙 YAML에서 그대로 가져온다.
- 카트라이더 러쉬플러스는 라이더명의 `|` 를 `_` 로 바꿔 보내야 한다 (스펙 안내). SDK가 자동 변환한다.
- 신규 게임은 `src/index.ts` 에 `export * from './games/{dir}/index.js'` 한 줄로 연결하고, 공개할 Client·타입은 게임의 `index.ts` 가 관리한다. root 이름 충돌을 막기 위해 공개 타입 이름에는 게임 타입 prefix를 붙인다.
- 크레이지 아케이드는 포털에서 제거되어 범위에서 뺐다.

### 범위 외: 네오플 API

던전앤파이터와 사이퍼즈는 넥슨 Open API가 아니라 네오플 API(`https://developers.neople.co.kr`)다. host와 API 키가 달라 이 SDK의 범위에 넣지 않는다. `HttpClient` 의 `x-nxopen-api-key` 인증으로는 호출할 수 없다.

## 현황과 후속 과제

2026-11-24 기준 포털 14개 게임 + platform의 API **270개를 모두 SDK가 지원**한다 (`yarn specs:coverage` 270/270, CI `specs:drift --strict` 통과).

**포털 변경 대응**: 주간 API Monitor가 변경을 감지하면 스펙 갱신 PR을 열고, `sdk-auto-update.yml` 이 MINOR·DEPRECATE 변경을 SDK에 자동 반영한다. MAJOR와 신규 게임은 사람이 판단한다 ("포털 변경 대응" 참고).

**후속 과제 (선택)**

- 실 API 키로 E2E 검증: 대부분의 게임은 포털 스펙 기반으로 구현됐고 실응답은 정적 메타만 확인했다 (`API_METADATA.note`). 키가 있으면 `yarn test:{game}` 으로 검증한다.
- 자동 페이지네이션 `iterateXxx`/`collectXxx` (DX 원칙): 현재 커서 API는 단일 페이지 메서드다.
- 런타임 shape 검증의 중첩 필드 확인: 현재는 최상위 키만 본다.
- 던전앤파이터·사이퍼즈(네오플 API)는 범위 외.

현재 수치는 `yarn specs:coverage` 로 다시 확인한다. 이 섹션의 숫자와 다르면 명령 결과가 맞다.

## 커밋 컨벤션

```
prefix(scope): 주요 메시지 (한글 OK, 50자 이내)

* 상세 변경 내용 1
* 상세 변경 내용 2

Co-Authored-By: {작업한 모델명} <noreply@anthropic.com>
```

`Co-Authored-By` 에는 실제로 작업한 모델명을 쓴다.

| prefix     | 용도                       |
| ---------- | -------------------------- |
| `feat`     | 새 기능                    |
| `fix`      | 버그 수정                  |
| `refactor` | 구조 개선 (동작 변경 없음) |
| `chore`    | 설정, 의존성, 빌드         |
| `docs`     | 문서                       |
| `test`     | 테스트                     |
| `release`  | 릴리즈                     |

## 테스트 전략

- **MSW (Mock Service Worker)** 사용 — `vi.fn(fetch)` 대신 네트워크 레이어 인터셉트
- `tests/setup.ts` — MSW 서버 lifecycle 관리 (`vitest.config.ts` 의 `setupFiles` 로 연결). `onUnhandledRequest: 'error'` 이므로 핸들러에 없는 URL을 호출하면 테스트가 실패한다 → API 계약 검증
- `tests/fixtures/{game}/` — 게임별 응답 fixture (스펙의 응답 구조와 동일)
- `tests/mocks/handlers/{game}.handlers.ts` — MSW HTTP 핸들러. 새 파일은 `tests/mocks/handlers/index.ts` 에 등록해야 동작한다
- `tests/unit/{core,games}/` — 단위 테스트 파일
- 새로 추가하는 public 메서드는 메서드마다 성공 경로 테스트(핸들러 + fixture)를 둔다. 기존 4개 게임은 대표 메서드만 테스트되어 있다 (보강 대상)

## 주석 원칙

- **"왜(why)" 주석만 작성** — "무엇(what)"은 코드로 표현
- API 응답 타입에서 비직관적 필드는 주석 필수:

```ts
access_flag: string; // "true" | "false" (boolean이 아닌 문자열)
liberation_quest_clear: string; // "0": 미완료, "1": 제네시스 해방, "2": 데스티니 1차 해방
```

---

## Spec-Driven 게임 추가 워크플로우

SDK 코드는 `specs/openapi/` 에 저장된 **넥슨 포털 OpenAPI YAML** 을 원천으로 만든다.
포털은 카테고리마다 OpenAPI 3.0 YAML을 로그인·API 키 없이 공개하므로, 사람이 포털 화면을 복사해 붙여 넣는 단계는 없다.

### 전체 흐름

```
yarn specs:fetch        포털 → specs/openapi/{slug}/{categoryId}.yaml, index.json 갱신
  ↓
스펙 읽기               대상 게임의 YAML (paths, parameters, components.schemas)
  ↓
구현                    types → shapes → client → lazy getter → fixtures → MSW → tests → docs → API_METADATA
  ↓
최초 와이어링           (게임당 1회) NexonClient, src/index.ts, 게임 index.ts, tsup entry, package.json exports
  ↓
검증                    yarn type-check && yarn lint && yarn test && yarn build, yarn specs:coverage
```

### 스펙 원천

| 경로                                     | 내용                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `specs/openapi/{slug}/{categoryId}.yaml` | 포털 카테고리 1개 = YAML 1개. `{slug}` 는 path prefix와 같다          |
| `specs/openapi/index.json`               | 게임 → 카테고리 → 오퍼레이션(method, path, operationId, summary) 색인 |
| `specs/README.md`                        | 수집 방식, 갱신 절차, 파일 형식 설명                                  |

- 스펙은 git으로 추적하고 npm에는 배포하지 않는다 (`package.json` 의 `files`).
- YAML을 손으로 고치지 않는다. 포털과 다르면 `yarn specs:fetch` 로 다시 받는다.
- YAML은 파일마다 들여쓰기가 다르다(2칸/4칸). 정규식이 아니라 YAML 파서로 읽는다.
- 포털 변경은 `yarn specs:check` 로 감지한다. 변경이 있으면 스펙을 갱신하고 SEMVER 정책에 따라 타입을 고친다.
- 예전의 "포털 화면 복붙 → `specs/{game}.md`" 방식은 폐기했다. `specs/{game}.md` 를 새로 만들지 않는다.

### 구현 순서

대상 게임의 YAML을 읽고 아래 순서로 만든다.

1. **types** — `src/games/{game}/{category}/types.ts`
   - `components.schemas` → TypeScript `interface`. 모든 필드 `readonly`, 필드명은 스펙 그대로(snake_case)
   - 중첩 객체/배열 원소는 별도 interface로 분리, nullable은 `T | null`
   - 스펙의 `description` 을 JSDoc으로 옮기고, 비직관적 값(문자열 boolean, 코드값)은 주석으로 설명
   - 게임 prefix를 붙인다 (TypeScript 스타일 참고)
2. **shapes** — `src/games/{game}/shapes.ts`: 응답 top-level 키와 타입의 shape descriptor
3. **client** — `src/games/{game}/{category}/{Game}{Category}Client.ts`: 경로당 메서드 1개, `http.get(url, params, SHAPE)`
   - 경로·쿼리 파라미터 이름은 스펙에서 그대로 가져온다. 메서드명은 "메서드 네이밍" 규칙을 따른다
   - 모든 public 메서드에 JSDoc (`@param`, `@throws`, `@example`)
4. **게임 client** — `src/games/{game}/{Game}Client.ts`: sub-client lazy getter 추가, 식별자 조회 메서드(`getOcid` 등)
5. **fixtures** — `tests/fixtures/{game}/{이름}.fixture.ts` (아래 "fixture 작성법")
6. **MSW 핸들러** — `tests/mocks/handlers/{game}.handlers.ts` + `handlers/index.ts` 등록
7. **단위 테스트** — `tests/unit/games/{game}-client.test.ts`: 메서드마다 성공 경로, 대표 에러 경로
8. **docs** — `docs/{game}.md`: 카테고리별 메서드 목록과 개수 (개수 = public API 메서드 수)
9. **`API_METADATA`** — `src/core/metadata/api-metadata.ts` 에 엔트리 추가/갱신
   - 키 = path prefix, `endpointCount` = public API 메서드 수
   - `lastVerifiedAt` = 스펙(또는 실 API)과 대조한 날짜, `note` 에 검증 방식 명시. 실 API 키로 확인하지 못했으면 "포털 스펙 기준, 실 API 미검증"이라고 쓴다
   - `tests/unit/core/api-metadata.test.ts` 의 게임 목록·개수 단언도 함께 고친다
10. **최초 와이어링** (게임당 1회, 아래)

기존 게임에 카테고리나 메서드를 추가할 때는 1~9만 수행한다.

### fixture 작성법

- 포털 YAML에는 **완성된 예시 응답 JSON이 없다.** 스키마와 필드별 `example` 값으로 fixture를 합성한다.
  - 스키마의 모든 필드를 채운다. `example` 이 있으면 그 값을, 없으면 타입에 맞는 그럴듯한 값을 쓴다
  - 배열은 원소 1~2개, nullable 필드는 한 fixture에서 `null` 인 경우도 다룬다
  - fixture에 응답 타입을 명시(`const x: Xxx = {...}`)해 타입과 어긋나면 컴파일 에러가 나게 한다
- **정적 메타데이터는 키 없이 실데이터를 쓸 수 있다.** `https://open.api.nexon.com/static/...` 경로(예: `/static/fconline/meta/class.json`, `/static/suddenattack/meta/tier`, `/static/tfd/meta/core-slot.json`)는 API 키 없이 실제 응답이 내려온다. 이런 API는 실제 응답 일부를 잘라 fixture로 쓴다.
- 그 밖의 API는 게임별 API 키가 있어야 실응답을 볼 수 있다. 키 없이 만든 fixture는 스펙 기반 합성값이며, 그 사실을 `API_METADATA.note` 에 남긴다.
- 실제 캐릭터명·계정 식별자 같은 개인 데이터를 fixture에 넣지 않는다.

### 최초 와이어링 (게임당 1회)

| 파일                            | 할 일                                                          |
| ------------------------------- | -------------------------------------------------------------- |
| `src/games/{game}/index.ts`     | 게임 Client + 타입 export (sub-path entry)                     |
| `src/NexonClient.ts`            | private 필드 + lazy getter 추가                                |
| `src/index.ts`                  | 게임 Client + 타입 re-export                                   |
| `tsup.config.ts`                | `entry` 에 `'{subpath}': 'src/games/{game}/index.ts'` 추가     |
| `package.json`                  | `exports` 에 `./{subpath}` 추가 (기존 엔트리와 같은 조건 구성) |
| `tests/mocks/handlers/index.ts` | 게임 핸들러 등록                                               |
| `README.md`, `CLAUDE.md`        | 지원 게임 표·그리드 갱신                                       |

이 파일들은 모든 게임 작업이 함께 건드리는 **공용 파일**이다. 여러 게임을 병렬로 작업할 때는 게임 디렉토리(`src/games/{game}/`, `tests/fixtures/{game}/`, `{game}.handlers.ts`, `{game}-client.test.ts`, `docs/{game}.md`)를 먼저 완성하고, 공용 파일 변경은 추가 전용으로 최소화한다. 작업 지시에 공용 파일 담당이 따로 정해져 있으면 그 지시를 따른다.

### 검증

```bash
yarn type-check && yarn lint && yarn test && yarn build
yarn specs:coverage   # 대상 게임의 SDK 경로 = 스펙 경로인지 확인
```

### 포털 변경 대응

1. **API Monitor**가 만든 `specs/auto-update` → `main` PR 또는 `api-change` 이슈와 포털 공지를 확인한다. `yarn specs:diff --base origin/main`으로 분류를 확인하고 `yarn specs:drift --game <slug>`로 SDK 반영 대상을 좁힌다.
2. MINOR는 호환되는 공개 API로 반영한다. DEPRECATE는 `@deprecated`, optional 또는 메서드 런타임 경고를 적용한다. MAJOR와 새 게임의 공용 진입점 변경은 사람이 판단한다.
3. SDK Auto Update는 포털 텍스트를 데이터로 취급하고 제한된 파일·명령으로 수정과 검증을 수행한다. 별도 게시 job이 검증된 패치를 커밋하고 CI를 실행한다. 변경은 사람이 검토하고 머지하며 `CHANGELOG.md`와 버전도 검토한다.
4. CI의 `yarn specs:drift --strict`를 통과하려면 새 drift를 수정하거나 의도적인 차이를 `specs/drift-baseline.json`에 사유와 함께 기록한다. 스펙보다 넓은 SDK의 `null` 허용과 제거된 API의 `@deprecated` 유지는 허용한다.

운영에는 **Allow GitHub Actions to create and approve pull requests** 설정과 Claude 시크릿(`CLAUDE_CODE_OAUTH_TOKEN` 또는 `ANTHROPIC_API_KEY`)이 필요하다. `SDK_AUTO_IMPLEMENT=false`를 설정하면 스펙 갱신만 동작한다. 등록과 수동 검증 절차는 [specs/README.md](specs/README.md#포털-변경-대응-절차)를 확인한다.
