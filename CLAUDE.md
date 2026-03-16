# CLAUDE.md — nexon-open-api SDK

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

넥슨 Open API를 TypeScript로 감싼 SDK 라이브러리.
CJS + ESM 듀얼 출력, Node.js 18+, 외부 의존성 0.

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'your-api-key' });

const { ocid } = await client.maplestory.getOcid('캐릭터명');
const basic = await client.maplestory.character.getBasic({ ocid });
```

## 개발 명령어

| 명령어                        | 설명                    |
| ----------------------------- | ----------------------- |
| `yarn dev`                    | tsup watch 모드         |
| `yarn build`                  | 프로덕션 빌드 (`dist/`) |
| `yarn type-check`             | `tsc --noEmit`          |
| `yarn lint` / `yarn lint:fix` | ESLint                  |
| `yarn format`                 | Prettier                |
| `yarn test`                   | Vitest 1회 실행         |
| `yarn test:watch`             | Vitest watch            |
| `yarn release`                | 버전 범프 + npm publish |

**코드 변경 후 반드시**: `yarn type-check` → `yarn test` → `yarn build` 순서로 확인.

## 디렉토리 구조

```
src/
├── core/                                    # 공유 인프라 (게임 무관)
│   ├── http/                                # HttpClient, retry, http-types
│   ├── errors/                              # NexonError 계층 (6개 서브클래스)
│   ├── metadata/api-metadata.ts             # 게임별 API 검증 메타데이터
│   ├── validation/response-shape.ts         # 런타임 응답 shape 검증
│   ├── deprecation/deprecation.ts           # deprecation 경고 유틸
│   └── types/
│       ├── branded.ts                       # Brand<T,B> 유틸리티 타입만
│       └── pagination.ts                    # CursorPage<T>, CursorPageRequest
├── games/
│   ├── _base/                               # 공유 추상 기반
│   │   ├── AbstractGameClient.ts            # 최상위 기반 (pathPrefix, buildUrl)
│   │   ├── AbstractMapleStoryBaseClient.ts  # 메이플 패밀리 (timezoneOffset, formatDate)
│   │   ├── maple-base-types.ts              # OCID, GuildId, NexonDate + 공유 요청 타입
│   │   └── maple-date.ts                    # toNexonDate(), DateRange
│   ├── maplestory/                          # KMS (구현 완료)
│   ├── maplestory-m/                        # 메이플스토리M (구현 완료)
│   ├── maplestory-sea/                      # MapleStorySEA (진행 중)
│   ├── fc-online/                           # FC Online (구현 완료)
│   └── ...                                  # 기타 게임 (예정)
├── NexonClient.ts                           # 메인 진입점
└── index.ts                                 # root public exports

specs/                                       # API 스펙 파일 (npm 배포 제외)
├── _template.md                             # 변환 포맷 정의
└── {game}.md                                # 게임별 스펙

tests/
├── fixtures/                                # 응답 fixture 고정 데이터
├── mocks/handlers/                          # MSW HTTP 핸들러
└── unit/                                    # 단위 테스트
```

## 클래스 계층 구조

```
NexonClient
├── .maplestory    → MapleStoryClient    (UTC+9, prefix: maplestory)
├── .maplestoryM   → MapleStoryMClient   (UTC+9, prefix: maplestorym)
├── .maplestorySEA → MapleStorySEAClient (UTC+8, prefix: maplestorysea)
├── .maplestoryTW  → MapleStoryTWClient  (UTC+8, prefix: maplestorytw)
├── .fcOnline      → FcOnlineClient      (prefix: fconline)
├── .dnf           → DnfClient           (예정)
├── .mabinogi      → MabinogiClient      (예정)
└── ...                                  (17개 게임)

AbstractGameClient (abstract — 모든 게임의 최상위 기반)
├── abstract pathPrefix: string
├── constructor(http: HttpClient)
└── buildUrl(path, version?): string

AbstractMapleBaseClient extends AbstractGameClient (메이플 패밀리 전용)
├── abstract timezoneOffset: number       // 540 (KST) | 480 (SGT/TST)
└── formatDate(date): NexonDate

NexonError (base)
├── NexonRateLimitError    (429 / OPENAPI00007)
├── NexonAuthError         (403 / OPENAPI00002, 00005)
├── NexonNotFoundError     (400 / OPENAPI00003)
├── NexonBadRequestError   (400 / OPENAPI00004, 00006)
├── NexonDataNotReadyError (400 / OPENAPI00009, 00010)
└── NexonServerError       (5xx / OPENAPI00001, 00011)
```

## 아키텍처 규칙

- **메이플 패밀리** (KMS, M, SEA, TW) → `AbstractMapleBaseClient` 상속 (timezoneOffset + formatDate)
- **비메이플 게임** → `AbstractGameClient` 직접 상속
- **Sub-client** → lazy getter (`??=` 패턴)로 초기화, 미사용 시 할당 비용 0
- **Branded Types** → OCID, GuildId, NexonDate는 `_base/maple-base-types.ts`, OUID는 `fc-online/user/types.ts`에 정의. `core/types/branded.ts`는 `Brand<T,B>` 유틸리티만 보유
- **HttpClient** → 429/503만 재시도, 나머지 즉시 throw. `x-nxopen-api-key` 헤더 자동 주입
- **에러 분류** → OPENAPI 에러 코드 기반 서브클래스 분류 (`classify-error.ts`)
- **엔드포인트** → 게임별 `endpoints.ts`에 `as const` 객체로 관리
- **새 게임 추가 시** → `API_METADATA`에 엔트리 추가 필수

## API 버전 관리

### Semver 정책 (`SEMVER.md` 참조)

- 넥슨 응답 필드 추가 → SDK optional 필드 추가 → **MINOR**
- 넥슨 응답 필드 삭제 → `@deprecated` + optional → **MINOR** (다음 MAJOR에서 삭제)
- 넥슨 필드 타입 변경 → SDK 타입 변경 → **MAJOR**
- public 메서드 제거/이름 변경 → **MAJOR**

### 런타임 응답 Shape 검증

- `responseValidation: true` 옵션으로 활성화 (warn-only, opt-in)
- `shapes.ts`에 shape descriptor 정의 → `HttpClient.get()` 3번째 param으로 전달

## DX 원칙

> IntelliSense가 문서이고, 에러 메시지가 튜토리얼이다.

### JSDoc 필수

모든 public API에 JSDoc 작성. `@param`, `@throws`, `@example` 포함.
`@example`은 복사-붙여넣기 가능한 실제 코드여야 한다.

### Date Coercion

`date` 파라미터는 `Date | NexonDate | 'today' | string` 모두 수용.
SDK 내부에서 지역 타임존 기준 `YYYY-MM-DD` 변환.

### Auto-pagination 네이밍

- `getXxx()` → 단일 페이지 (`CursorPage<T>`)
- `iterateXxx()` → `AsyncGenerator<T>` (자동 페이지네이션)
- `collectXxx()` → `Promise<T[]>` (전체 수집)

### 에러 메시지 = 미니 튜토리얼

에러 발생 시 다음 행동을 명확히 안내. "무엇이 틀렸고, 어떻게 고치는지" 포함.

```ts
throw new NexonRateLimitError(
  'API 호출 한도를 초과했습니다. ' +
    'SDK가 자동으로 3회 재시도했으나 실패했습니다. ' +
    'new NexonClient({ maxRetries: 5 })로 재시도 횟수를 늘리거나 요청 빈도를 줄여주세요.',
  { code: 'OPENAPI00007', retryAfter: 1000 },
);
```

### SDK 경계 입력 검증

API 서버 400 응답에 의존하지 않고 SDK에서 즉시 throw (빈 ocid, 미래 날짜 등).

### 메서드 네이밍

| 패턴               | 메서드명             | 반환 타입                |
| ------------------ | -------------------- | ------------------------ |
| 단건 조회          | `getXxx(params)`     | `Promise<T>`             |
| 이름으로 단건 조회 | `getXxxByName(name)` | `Promise<T>`             |
| 식별자 조회        | `getOcid(name)`      | `Promise<OCID>`          |
| 단일 페이지        | `listXxx(params)`    | `Promise<CursorPage<T>>` |
| 자동 순회          | `iterateXxx(params)` | `AsyncGenerator<T>`      |
| 전체 수집          | `collectXxx(params)` | `Promise<T[]>`           |

**금지**: 메서드 이름에 컨텍스트 중복 — `character.getBasic()` ✅, `character.getCharacterBasic()` ❌

## 파일 네이밍 규칙

| 종류        | 패턴               | 예시                        |
| ----------- | ------------------ | --------------------------- |
| 클래스 파일 | `PascalCase.ts`    | `NexonClient.ts`            |
| 타입 파일   | `types.ts`         | `character/types.ts`        |
| 유틸/인프라 | `kebab-case.ts`    | `maple-date.ts`             |
| 테스트      | `[파일명].test.ts` | `maplestory-client.test.ts` |

**barrel file (index.ts) 사용 안 함** — `src/index.ts` 단 하나만 허용 (public exports 전용).

## TypeScript 스타일

- `interface` — API 응답/요청 타입
- `type` — 유니온, 유틸리티 타입
- `class` — Client 계층
- `as const` — 엔드포인트 상수 객체
- `import type { ... }` — 타입 전용 import 분리 (`verbatimModuleSyntax`)
- `any` 금지 → `unknown` + 타입 가드
- 모든 response 필드는 `readonly`
- 필드명 API 응답 그대로 (snake_case 유지)
- `exactOptionalPropertyTypes: true` → optional 타입에 `| undefined` 명시

## 지원 게임

Base URL: `https://open.api.nexon.com/`

| 게임                  | Client 프로퍼티          | Client 클래스           | Path Prefix      | Base Class                | 상태          |
| --------------------- | ------------------------ | ----------------------- | ---------------- | ------------------------- | ------------- |
| 메이플스토리 (KMS)    | `client.maplestory`      | `MapleStoryClient`      | `maplestory`     | `AbstractMapleBaseClient` | **구현 완료** |
| 메이플스토리M         | `client.maplestoryM`     | `MapleStoryMClient`     | `maplestorym`    | `AbstractMapleBaseClient` | **구현 완료** |
| MapleStory SEA        | `client.maplestorySEA`   | `MapleStorySEAClient`   | `maplestorysea`  | `AbstractMapleBaseClient` | 진행 중       |
| MapleStory Taiwan     | `client.maplestoryTW`    | `MapleStoryTWClient`    | `maplestorytw`   | `AbstractMapleBaseClient` | 예정          |
| EA SPORTS FC 온라인   | `client.fcOnline`        | `FcOnlineClient`        | `fconline`       | `AbstractGameClient`      | **구현 완료** |
| 던전앤파이터          | `client.dnf`             | `DnfClient`             | `dnf`            | `AbstractGameClient`      | 예정          |
| 마비노기              | `client.mabinogi`        | `MabinogiClient`        | `mabinogi`       | `AbstractGameClient`      | 예정          |
| 마비노기 영웅전       | `client.mabinogiHeroes`  | `MabinogiHeroesClient`  | `mabinogiheroes` | `AbstractGameClient`      | 예정          |
| 서든어택              | `client.suddenAttack`    | `SuddenAttackClient`    | `suddenattack`   | `AbstractGameClient`      | 예정          |
| 퍼스트 디센던트       | `client.firstDescendant` | `FirstDescendantClient` | `tfd`            | `AbstractGameClient`      | 예정          |
| 카트라이더 러쉬플러스 | `client.kartrider`       | `KartriderClient`       | `kartrider`      | `AbstractGameClient`      | 예정          |
| 바람의나라            | `client.baram`           | `BaramClient`           | `baramnara`      | `AbstractGameClient`      | 예정          |
| 바람의나라: 연        | `client.baramYeon`       | `BaramYeonClient`       | `baramyeon`      | `AbstractGameClient`      | 예정          |
| 히트2                 | `client.hit2`            | `Hit2Client`            | `hit2`           | `AbstractGameClient`      | 예정          |
| 크레이지 아케이드     | `client.crazyArcade`     | `CrazyArcadeClient`     | `crazyarcade`    | `AbstractGameClient`      | 예정          |
| V4                    | `client.v4`              | `V4Client`              | `v4`             | `AbstractGameClient`      | 예정          |
| 사이퍼즈              | `client.cyphers`         | `CyphersClient`         | `cyphers`        | `AbstractGameClient`      | 예정          |

## 커밋 컨벤션

```
prefix(scope): 주요 메시지 (한글 OK, 50자 이내)

* 상세 변경 내용 1
* 상세 변경 내용 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

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
- `tests/fixtures/` — 게임별 응답 fixture (실제 API 응답 구조와 동일)
- `tests/mocks/handlers/` — MSW HTTP 핸들러 (URL 미매칭 시 테스트 실패 → API 계약 검증)
- `tests/unit/[core|games]/` — 단위 테스트 파일
- `vitest.config.ts`에 MSW 서버 lifecycle 설정

## 주석 원칙

- **"왜(why)" 주석만 작성** — "무엇(what)"은 코드로 표현
- API 응답 타입에서 비직관적 필드는 주석 필수:

```ts
access_flag: string; // "true" | "false" (boolean이 아닌 문자열)
liberation_quest_clear: string; // "0": 미완료, "1": 제네시스 해방, "2": 데스티니 1차 해방
```

---

## Spec-Driven 게임 추가 워크플로우

새 게임을 추가할 때 `specs/` 디렉토리의 구조화된 스펙 파일을 기반으로 코드를 생성한다.

### 전체 흐름

```
유저: 넥슨 API 포털에서 raw 복붙 (엔드포인트, 스키마, example value)
  ↓
Claude: specs/{game}.md 로 구조화해서 저장 (없으면 생성, 있으면 추가)
  ↓
유저: "{game}의 {category} 카테고리 구현해줘"
  ↓
Claude: spec 읽기 → types.ts → shapes.ts → Client.ts → tests → 검증
  ↓
Claude: spec의 Implementation Status 업데이트
```

### Phase A: Raw Paste → Spec 변환

유저가 넥슨 포털에서 복붙하면, `specs/_template.md` 포맷에 맞춰 `specs/{game}.md`로 변환:

1. **Meta 섹션** — gameId, pathPrefix, clientClass, baseClass, timezoneOffset 등
2. **Implementation Status** — 카테고리별 진행 상황 테이블
3. **Category 섹션** — 엔드포인트별:
   - sdkMethod, params, paramType
   - Response 필드 테이블 (Field | Type | Required | Description)
   - 중첩 객체는 서브테이블로 분리
   - Example Response JSON (fixture 생성 근거)

### Phase B: 카테고리 구현

`specs/{game}.md`를 읽고 아래 순서로 아티팩트 생성:

1. `src/games/{game}/{category}/types.ts` — Response 테이블 → TypeScript interface
   - 모든 필드 `readonly`, 필드명 API 응답 그대로 (snake_case)
   - 게임별 prefix: KMS=없음, M=M, SEA=SEA, TW=TW
2. `src/games/{game}/shapes.ts` — 응답 shape descriptor (responseValidation용)
3. `src/games/{game}/{category}/{Game}{Category}Client.ts` — HTTP 메서드
4. `src/games/{game}/{Game}Client.ts` — lazy getter 추가
5. `tests/fixtures/{game}/` — Example Response → fixture 파일
6. `tests/mocks/handlers/{game}.handlers.ts` — MSW 핸들러
7. `tests/unit/games/{game}-client.test.ts` — 단위 테스트

### Phase C: 최초 와이어링 (게임당 1회)

- `src/NexonClient.ts` — lazy getter 추가
- `src/index.ts` — 게임 Client + 타입 re-export
- `src/games/{game}/index.ts` — sub-path export barrel
- `tsup.config.ts` — entry 추가
- `package.json` — exports 추가
- `src/core/metadata/api-metadata.ts` — 게임 엔트리 추가

### Phase D: 검증

```bash
yarn type-check && yarn test && yarn build
```

### Spec 파일 관리

- git 추적 O (대화 간 정보 보존)
- npm 배포 X (`"files": ["dist"]`로 이미 제외)
- 구현 완료 게임 포함 전 게임 spec 관리 (API DB 역할)
