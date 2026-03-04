# CLAUDE.md — nexon-open-api SDK

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

넥슨 Open API를 TypeScript로 감싼 SDK 라이브러리.
yarn / npm / pnpm 세 패키지 매니저를 모두 지원하며, CJS + ESM 듀얼 출력으로 빌드됩니다.
Node.js 18+ 및 최신 브라우저 환경을 타깃으로 합니다.

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'your-api-key' });

const { ocid } = await client.maplestory.getOcid('캐릭터명');
const basic    = await client.maplestory.character.getBasic({ ocid });
```

## 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 언어 | TypeScript 5.x (strict) | `noUncheckedIndexedAccess` 활성화 |
| 번들러 | tsup | CJS + ESM + `.d.ts` 동시 출력 |
| HTTP | native `fetch` | 외부 의존성 0, Node 18+ built-in |
| 테스트 | Vitest | 단위 테스트 중심 |
| 코드 품질 | ESLint 9 (flat config) + Prettier | `printWidth: 100` |
| CI/CD | GitHub Actions | 테스트 + 빌드 + npm publish |
| 배포 | npm public package | scoped or unscoped 결정 필요 |

## 개발 명령어

| 명령어 | 설명 |
|--------|------|
| `yarn dev` | tsup watch 모드 (로컬 개발) |
| `yarn build` | 프로덕션 빌드 (`dist/` 생성) |
| `yarn type-check` | TypeScript 타입 체크 (`tsc --noEmit`) |
| `yarn lint` | ESLint 검사 |
| `yarn lint:fix` | ESLint 자동 수정 |
| `yarn format` | Prettier 포맷팅 |
| `yarn test` | Vitest 1회 실행 |
| `yarn test:watch` | Vitest watch 모드 |
| `yarn release` | 버전 범프 + npm publish |

**코드 변경 후 반드시**: `yarn type-check` → `yarn test` → `yarn build` 순서로 확인.

## 디렉토리 구조

```
nexon-open-api/
├── src/
│   ├── core/                                    # 공유 인프라 (게임 무관)
│   │   ├── http/
│   │   │   ├── HttpClient.ts                    # fetch 래퍼 (retry, timeout, interceptors)
│   │   │   ├── retry.ts                         # 지수 백오프 순수 함수
│   │   │   └── http-types.ts                    # RequestInterceptor, ResponseInterceptor
│   │   ├── errors/
│   │   │   ├── NexonError.ts                    # base 에러 클래스
│   │   │   ├── NexonRateLimitError.ts           # 429 / OPENAPI00007
│   │   │   ├── NexonAuthError.ts                # 403 / OPENAPI00002, 00005
│   │   │   ├── NexonBadRequestError.ts          # 400 / OPENAPI00004, 00006
│   │   │   ├── NexonDataNotReadyError.ts        # 400 / OPENAPI00009, 00010
│   │   │   ├── NexonServerError.ts              # 5xx / OPENAPI00001, 00011
│   │   │   ├── error-codes.ts                   # OPENAPI00001~00011 as const
│   │   │   └── classify-error.ts                # (status, code) → 에러 인스턴스
│   │   └── types/
│   │       ├── branded.ts                       # OCID, GuildId, NexonDate 브랜드 타입
│   │       ├── date.ts                          # toNexonDate(), DateRange
│   │       └── pagination.ts                    # CursorPage<T>, CursorPageRequest
│   ├── games/
│   │   ├── _base/                               # 공유 추상 기반
│   │   │   ├── AbstractGameClient.ts            # 모든 게임의 최상위 기반 (pathPrefix, buildUrl)
│   │   │   ├── AbstractMapleStoryBaseClient.ts  # 메이플 패밀리 기반 (timezoneOffset, formatDate)
│   │   │   └── maple-base-types.ts              # 공유 요청 타입 (DateOptions 등)
│   │   ├── maplestory/                          # KMS — 메이플스토리 (구현 완료)
│   │       ├── MapleStoryClient.ts
│   │       ├── character/
│   │       │   ├── MapleStoryCharacterClient.ts
│   │       │   └── types.ts
│   │       ├── union/
│   │       │   ├── MapleStoryUnionClient.ts
│   │       │   └── types.ts
│   │       ├── guild/
│   │       │   ├── MapleStoryGuildClient.ts
│   │       │   └── types.ts
│   │       ├── ranking/
│   │       │   ├── MapleStoryRankingClient.ts
│   │       │   └── types.ts
│   │       ├── history/
│   │       │   ├── MapleStoryHistoryClient.ts
│   │       │   └── types.ts
│   │       ├── notice/
│   │       │   ├── MapleStoryNoticeClient.ts
│   │       │   └── types.ts
│   │       └── index.ts                         # sub-path export 진입점
│   │   ├── maplestory-m/                        # 메이플스토리M (예정)
│   │   ├── maplestory-sea/                      # MapleStorySEA (예정)
│   │   ├── maplestory-tw/                       # MapleStoryTW (예정)
│   │   ├── fc-online/                           # EA SPORTS FC Online (예정)
│   │   ├── dnf/                                 # 던전앤파이터 (예정)
│   │   ├── mabinogi/                            # 마비노기 (예정)
│   │   └── ...                                  # 기타 게임 (예정)
│   ├── NexonClient.ts                           # 메인 진입점
│   └── index.ts                                 # root public exports
├── tests/
│   ├── fixtures/                                # 응답 fixture 고정 데이터
│   │   └── maplestory/
│   ├── mocks/
│   │   ├── server.ts                            # MSW 서버 설정
│   │   └── handlers/                            # MSW HTTP 핸들러
│   └── unit/
│       ├── core/
│       └── games/
├── dist/                                        # 빌드 출력 (gitignore)
├── tsup.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
├── eslint.config.js
├── .prettierrc
└── README.md
```

## 아키텍처 원칙

### 클래스 계층 구조 (멀티 게임)

```
NexonClient
├── .maplestory    → MapleStoryClient    (UTC+9, prefix: maplestory)
├── .maplestoryM   → (예정) MapleStoryMClient
├── .maplestorySEA → (예정) MapleStorySEAClient
├── .maplestoryTW  → (예정) MapleStoryTWClient
├── .fcOnline      → (예정) FcOnlineClient
├── .dnf           → (예정) DnfClient
├── .mabinogi      → (예정) MabinogiClient
├── .mabinogiHeroes→ (예정) MabinogiHeroesClient
├── .suddenAttack  → (예정) SuddenAttackClient
├── .firstDescendant→(예정) FirstDescendantClient
├── .kartrider     → (예정) KartriderClient
├── .baram         → (예정) BaramClient
├── .baramYeon     → (예정) BaramYeonClient
├── .hit2          → (예정) Hit2Client
├── .crazyArcade   → (예정) CrazyArcadeClient
├── .v4            → (예정) V4Client
└── .cyphers       → (예정) CyphersClient

AbstractGameClient (abstract — 모든 게임의 최상위 기반)
├── abstract pathPrefix: string           // 'maplestory', 'fconline', 'mabinogi' ...
├── constructor(http: HttpClient)
└── buildUrl(path, version?): string      // URL 조립

AbstractMapleBaseClient extends AbstractGameClient (메이플 패밀리 전용)
├── abstract timezoneOffset: number       // 540 (KST) | 480 (SGT/TST)
└── formatDate(date): NexonDate           // 지역 타임존 기준 YYYY-MM-DD

MapleStoryClient extends AbstractMapleBaseClient
├── getOcid(characterName): Promise<OCID>
├── .character  → MapleStoryCharacterClient  (lazy getter)
├── .union      → MapleStoryUnionClient       (lazy getter)
├── .guild      → MapleStoryGuildClient       (lazy getter)
├── .ranking    → MapleStoryRankingClient     (lazy getter)
├── .history    → MapleStoryHistoryClient     (lazy getter)
└── .notice     → MapleStoryNoticeClient      (lazy getter)

(비메이플 게임은 AbstractGameClient를 직접 상속)
FcOnlineClient extends AbstractGameClient
DnfClient extends AbstractGameClient
...

NexonError (base)
├── NexonRateLimitError    (429 / OPENAPI00007)
├── NexonAuthError         (403 / OPENAPI00002, 00005)
├── NexonNotFoundError     (400 / OPENAPI00003)
├── NexonBadRequestError   (400 / OPENAPI00004, 00006)
├── NexonDataNotReadyError (400 / OPENAPI00009, 00010)
└── NexonServerError       (5xx / OPENAPI00001, 00011)
```

### AbstractGameClient — 모든 게임의 최상위 기반

```ts
// src/games/_base/AbstractGameClient.ts
export abstract class AbstractGameClient {
  protected abstract readonly pathPrefix: string;
  constructor(protected readonly http: HttpClient) {}
  protected buildUrl(path: string, version: string = 'v1'): string {
    return `https://open.api.nexon.com/${this.pathPrefix}/${version}/${path}`;
  }
}
```

- 메이플 패밀리 → `AbstractMapleBaseClient extends AbstractGameClient` (timezoneOffset + formatDate 추가)
- 비메이플 게임 → `AbstractGameClient` 직접 상속

### AbstractMapleBaseClient — 메이플 패밀리 기반

`MapleStoryClient`는 `AbstractMapleBaseClient`를 상속한다.
`pathPrefix` / `timezoneOffset`을 abstract로 선언하여 **설정 누락 시 컴파일 에러** 발생.

```ts
// src/games/_base/AbstractMapleStoryBaseClient.ts
export abstract class AbstractMapleBaseClient extends AbstractGameClient {
  protected abstract readonly timezoneOffset: number;

  protected formatDate(date: Date | NexonDate | 'today' | string): NexonDate {
    return toNexonDate(date, this.timezoneOffset);
  }
}

// src/games/maplestory/MapleStoryClient.ts
export class MapleStoryClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestory';
  protected readonly timezoneOffset = 540;

  private _character: MapleStoryCharacterClient | undefined;

  // Lazy initialization: 미사용 sub-client 할당 비용 0
  get character(): MapleStoryCharacterClient {
    this._character ??= new MapleStoryCharacterClient(this.http);
    return this._character;
  }
}
```

### 새 게임 추가 가이드

```ts
// 1. 메이플 패밀리 (M, SEA, TW) — AbstractMapleBaseClient 상속
export class MapleStoryMClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestorym';
  protected readonly timezoneOffset = 540; // KST
}

// 2. 비메이플 게임 — AbstractGameClient 직접 상속
export class FcOnlineClient extends AbstractGameClient {
  protected readonly pathPrefix = 'fconline';
}

// 3. NexonClient에 lazy getter 추가
get fcOnline(): FcOnlineClient {
  this._fcOnline ??= new FcOnlineClient(this.http);
  return this._fcOnline;
}
```

### HttpClient — Retry + Interceptors

```ts
// src/core/http/HttpClient.ts
export interface HttpClientConfig {
  apiKey: string;
  timeoutMs?: number;       // default 10_000 (10s)
  maxRetries?: number;      // default 3 — 429/503 전용, 400/403/500은 재시도 안 함
  retryBaseDelayMs?: number; // default 500, 지수 백오프
}

export type RequestInterceptor = (request: Request) => Request | Promise<Request>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
```

- API key를 헤더(`x-nxopen-api-key`)에 자동 주입
- `AbortSignal.timeout()` 네이티브 사용 (Node 17.3+, 외부 의존성 0 유지)
- 429 (rate limit) / 503 (maintenance)만 재시도 — 나머지는 즉시 throw
- Request/Response interceptor로 로깅·모니터링 주입 가능

### 에러 분류 (OPENAPI error code 기반)

```ts
// src/core/errors/classify-error.ts
// (status, errorCode) → 구체적 에러 서브클래스
OPENAPI00007 → NexonRateLimitError
OPENAPI00002, 00005 → NexonAuthError
OPENAPI00009, 00010 → NexonDataNotReadyError
OPENAPI00001, 00011 → NexonServerError

// 사용자 측 instanceof 체크
try {
  const data = await client.maplestory.character.getBasic({ ocid });
} catch (e) {
  if (e instanceof NexonRateLimitError) { /* 429 재시도 로직 */ }
  if (e instanceof NexonAuthError)      { /* API 키 점검 */ }
}
```

### Branded Types — 타입 안전성

```ts
// src/core/types/branded.ts
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type OCID      = Brand<string, 'OCID'>;
export type GuildId   = Brand<string, 'GuildId'>;
export type NexonDate = Brand<string, 'NexonDate'>;

// getBasic({ ocid: guildId }) → 컴파일 타임 에러 (런타임 400 방지)
```

### 엔드포인트 관리 — 게임별 분리

```ts
// src/games/maplestory/endpoints.ts
const BASE = 'https://open.api.nexon.com/maplestory/v1';
export const MAPLESTORY_ENDPOINTS = {
  ID: `${BASE}/id`,
  CHARACTER: {
    BASIC:    `${BASE}/character/basic`,
    STAT:     `${BASE}/character/stat`,
    // ...
  },
  UNION: { /* ... */ },
  GUILD: { /* ... */ },
} as const;

```

v2 도입 시 `endpoints.ts`에 `BASE_V2` 추가 — 전역 버전 상수 없음.

## DX 원칙 (Developer Experience)

> "문서를 읽지 않아도 올바른 코드를 작성할 수 있는 SDK"
>
> IntelliSense가 문서이고, 에러 메시지가 튜토리얼이다.

---

### 1. IntelliSense-first — 자동 완성이 곧 문서

모든 public API에 JSDoc 필수. `@example`은 복사-붙여넣기 가능한 실제 코드여야 한다.

```ts
/**
 * 캐릭터의 기본 정보를 조회합니다.
 *
 * @param params.ocid  - {@link MapleStoryClient.getOcid}로 얻은 고유 식별자
 * @param params.date  - 조회 기준일. 생략 시 전날 (넥슨 정책). Date 객체 또는 'today' 사용 가능
 *
 * @throws {NexonRateLimitError}    호출 한도 초과 (SDK가 3회 재시도 후 throw)
 * @throws {NexonAuthError}         API 키 오류 또는 권한 없음
 * @throws {NexonDataNotReadyError} 해당 날짜 데이터 미준비 (매일 오전 1시 KST 이후 갱신)
 *
 * @example
 * const ocid = await client.maplestory.getOcid('아르테미스');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * console.log(basic.character_level); // 250
 *
 */
async getBasic(params: { ocid: OCID; date?: Date | NexonDate | 'today' }): Promise<CharacterBasic>
```

---

### 2. Date Coercion — 날짜 형식을 신경 쓰지 않아도 된다

```ts
// 모두 허용 — SDK 내부에서 지역 타임존 기준 YYYY-MM-DD 변환
client.maplestory.character.getBasic({ ocid, date: new Date() })        // Date 객체
client.maplestory.character.getBasic({ ocid, date: '2025-01-15' })      // ISO string
client.maplestory.character.getBasic({ ocid, date: 'today' })           // 편의 문자열
client.maplestory.character.getBasic({ ocid })                          // 생략 = 전날
```

`date` 파라미터 타입 선언: `Date | NexonDate | 'today'` — 브랜드 타입과 네이티브 타입 모두 수용.

---

### 3. Auto-pagination — 커서를 개발자가 다루지 않는다

커서 기반 페이지네이션 엔드포인트는 `async *` iterator를 함께 제공한다.

```ts
// ❌ SDK 없이 — 커서 직접 관리
let cursor: string | null = null;
do {
  const page = await client.maplestory.history.getStarforce({ date, cursor: cursor ?? undefined });
  for (const item of page.items) process(item);
  cursor = page.nextCursor;
} while (cursor);

// ✅ SDK DX — iterator로 자동 순회
for await (const item of client.maplestory.history.iterateStarforce({ date })) {
  process(item);
}

// 또는 전체 수집
const all = await client.maplestory.history.collectStarforce({ date }); // item[]
```

메서드 네이밍 규칙:
- `getXxx()` → 단일 페이지 (`CursorPage<T>`)
- `iterateXxx()` → `AsyncGenerator<T>` (자동 페이지네이션)
- `collectXxx()` → `Promise<T[]>` (전체 수집, 대용량 주의)

---

### 4. Convenience Methods — 1단계로 원하는 것을 얻는다

OCID 조회 + 데이터 조회를 묶은 convenience 메서드를 제공한다.

```ts
// ❌ 2단계 필수
const { ocid } = await client.maplestory.getOcid('아르테미스');
const basic = await client.maplestory.character.getBasic({ ocid });

// ✅ 1단계 — 이름으로 바로
const basic = await client.maplestory.character.getBasicByName('아르테미스');

// 내부 구현: getOcid → getBasic 순차 호출
// 성능보다 DX 우선, 2회 네트워크 비용 감수
```

`ByName` suffix로 OCID를 내부 처리하는 메서드임을 명시.

---

### 5. 에러 메시지 = 미니 튜토리얼

에러가 발생했을 때 다음 행동을 명확히 안내한다.

```ts
// ❌ 기존 패턴
throw new Error('OPENAPI00007')

// ✅ 목표 패턴
throw new NexonRateLimitError(
  'API 호출 한도를 초과했습니다. ' +
  'SDK가 자동으로 3회 재시도했으나 실패했습니다. ' +
  'new NexonClient({ maxRetries: 5 })로 재시도 횟수를 늘리거나 요청 빈도를 줄여주세요.',
  { code: 'OPENAPI00007', retryAfter: 1000 }
);

// ❌ 기존 패턴
throw new Error('OPENAPI00009')

// ✅ 목표 패턴
throw new NexonDataNotReadyError(
  `${date} 날짜의 데이터가 아직 준비되지 않았습니다. ` +
  '넥슨 Open API는 매일 오전 1시(KST) 이후 전날 데이터가 갱신됩니다. ' +
  '자정~새벽 1시 사이에는 전전날 날짜로 요청해주세요.',
  { code: 'OPENAPI00009' }
);
```

---

### 6. SDK 경계 입력 검증 — API 호출 전에 실패한다

API 서버의 400 응답에 의존하지 않고, SDK에서 즉시 던진다.

```ts
// ocid 빈 문자열 — API 전에 throw
if (!params.ocid) {
  throw new NexonBadRequestError(
    'ocid는 필수값입니다. ' +
    'await client.maplestory.getOcid("캐릭터명")으로 먼저 ocid를 조회해주세요.'
  );
}

// 미래 날짜 — API 전에 throw
if (resolvedDate > today) {
  throw new NexonBadRequestError(
    `미래 날짜(${resolvedDate})는 조회할 수 없습니다. ` +
    '오늘 이전 날짜를 사용해주세요.'
  );
}
```

---

### 7. Safe 변형 — Result 패턴 (throw-free)

기본은 throw, `.safe()` 변형으로 Result 패턴 선택 지원.

```ts
// 기본 — throw
const basic = await client.maplestory.character.getBasic({ ocid });

// .safe() — Result 패턴, try/catch 불필요
const result = await client.maplestory.character.getBasic.safe({ ocid });
if (result.ok) {
  console.log(result.data.character_level);
} else {
  // result.error는 NexonError 서브클래스 (instanceof 체크 가능)
  if (result.error instanceof NexonDataNotReadyError) { /* ... */ }
}
```

---

### 8. Debug / Logger 지원

```ts
const client = new NexonClient({
  apiKey: 'key',
  // 간단한 디버그 모드
  debug: true,
  // 또는 커스텀 로거 주입
  logger: {
    onRequest:  (url, params)           => myLogger.info('→', { url, params }),
    onResponse: (url, status, ms)       => myLogger.info('←', { url, status, ms }),
    onRetry:    (url, attempt, delayMs) => myLogger.warn('↻', { url, attempt, delayMs }),
  },
});
```

`debug: true` 는 `console.debug`로 모든 요청/응답/재시도를 출력.
`logger` 주입 시 프로덕션 로깅 시스템(pino, winston 등)과 연결 가능.

---

### 9. 일관된 메서드 네이밍 — 예측 가능한 API Surface

| 패턴 | 메서드명 | 반환 타입 |
|---|---|---|
| 단건 조회 | `getXxx(params)` | `Promise<T>` |
| 이름으로 단건 조회 | `getXxxByName(name)` | `Promise<T>` |
| 식별자 조회 | `getId(name)` | `Promise<Id>` |
| 단일 페이지 | `listXxx(params)` | `Promise<CursorPage<T>>` |
| 자동 순회 | `iterateXxx(params)` | `AsyncGenerator<T>` |
| 전체 수집 | `collectXxx(params)` | `Promise<T[]>` |

**금지 패턴**: 메서드 이름에 컨텍스트 중복 노출
```ts
character.getCharacterBasic() // ❌ "Character"가 두 번
character.getBasic()          // ✅
```

---

## 파일 네이밍 규칙

| 종류 | 패턴 | 예시 |
|------|------|------|
| 클래스 파일 | `PascalCase.ts` | `NexonClient.ts`, `CharacterClient.ts` |
| 타입 파일 | `[도메인]-types.ts` | `character-types.ts`, `user-types.ts` |
| 유틸/인프라 | `kebab-case.ts` | `http-client.ts`, `nexon-error.ts` |
| 상수 | `kebab-case.ts` | `nexon-endpoints.ts` |
| 테스트 | `[파일명].test.ts` | `character-client.test.ts` |

**barrel file (index.ts) 사용 안 함** — `src/index.ts` 단 하나만 허용 (public exports 전용).

## TypeScript 스타일

- `interface` — API 응답/요청 타입
- `type` — 유니온, 유틸리티 타입
- `class` — Client 계층 (NexonClient, CharacterClient 등)
- `as const` — 엔드포인트 상수 객체
- `import type { ... }` — 타입 전용 import 분리 (`verbatimModuleSyntax`)
- `any` 금지 → `unknown` + 타입 가드

## package.json 핵심 설정

Sub-path exports로 tree-shaking 지원.

```json
{
  "name": "nexon-open-api",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./maplestory": {
      "import": "./dist/maplestory.js",
      "require": "./dist/maplestory.cjs",
      "types": "./dist/maplestory.d.ts"
    }
  },
  "files": ["dist"],
  "engines": {
    "node": ">=18"
  }
}
```

```ts
// sub-path import 사용 예
import { MapleStoryClient } from 'nexon-open-api/maplestory';
```

## tsup 설정

```ts
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index:        'src/index.ts',
    maplestory:   'src/games/maplestory/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,  // core/ 공유 코드 중복 방지
  treeshake: true,
});
```

## 지원 게임

Base URL: `https://open.api.nexon.com/`

| 게임 | Client 프로퍼티 | Client 클래스 | Path Prefix | Base Class | 상태 |
|------|----------------|--------------|-------------|------------|------|
| 메이플스토리 (KMS) | `client.maplestory` | `MapleStoryClient` | `maplestory` | `AbstractMapleBaseClient` | **구현 완료** |
| 메이플스토리M | `client.maplestoryM` | `MapleStoryMClient` | `maplestorym` | `AbstractMapleBaseClient` | 예정 |
| MapleStory SEA | `client.maplestorySEA` | `MapleStorySEAClient` | `maplestorysea` | `AbstractMapleBaseClient` | 예정 |
| MapleStory Taiwan | `client.maplestoryTW` | `MapleStoryTWClient` | `maplestorytw` | `AbstractMapleBaseClient` | 예정 |
| EA SPORTS FC 온라인 | `client.fcOnline` | `FcOnlineClient` | `fconline` | `AbstractGameClient` | 예정 |
| 던전앤파이터 | `client.dnf` | `DnfClient` | `dnf` | `AbstractGameClient` | 예정 |
| 마비노기 | `client.mabinogi` | `MabinogiClient` | `mabinogi` | `AbstractGameClient` | 예정 |
| 마비노기 영웅전 | `client.mabinogiHeroes` | `MabinogiHeroesClient` | `mabinogiheroes` | `AbstractGameClient` | 예정 |
| 서든어택 | `client.suddenAttack` | `SuddenAttackClient` | `suddenattack` | `AbstractGameClient` | 예정 |
| 퍼스트 디센던트 | `client.firstDescendant` | `FirstDescendantClient` | `tfd` | `AbstractGameClient` | 예정 |
| 카트라이더 러쉬플러스 | `client.kartrider` | `KartriderClient` | `kartrider` | `AbstractGameClient` | 예정 |
| 바람의나라 | `client.baram` | `BaramClient` | `baramnara` | `AbstractGameClient` | 예정 |
| 바람의나라: 연 | `client.baramYeon` | `BaramYeonClient` | `baramyeon` | `AbstractGameClient` | 예정 |
| 히트2 | `client.hit2` | `Hit2Client` | `hit2` | `AbstractGameClient` | 예정 |
| 크레이지 아케이드 | `client.crazyArcade` | `CrazyArcadeClient` | `crazyarcade` | `AbstractGameClient` | 예정 |
| V4 | `client.v4` | `V4Client` | `v4` | `AbstractGameClient` | 예정 |
| 사이퍼즈 | `client.cyphers` | `CyphersClient` | `cyphers` | `AbstractGameClient` | 예정 |

## 커밋 컨벤션

```
prefix(scope): 주요 메시지 (한글 OK, 50자 이내)

* 상세 변경 내용 1
* 상세 변경 내용 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

| prefix | 용도 |
|--------|------|
| `feat` | 새 기능 (새 게임 API, 새 엔드포인트) |
| `fix` | 버그 수정 |
| `refactor` | 구조 개선 (동작 변경 없음) |
| `chore` | 설정, 의존성, 빌드 |
| `docs` | 문서 |
| `test` | 테스트 |
| `release` | 버전 릴리즈 |

## 테스트 전략

**MSW (Mock Service Worker)** 를 사용한다 — `vi.fn(fetch)` 대신 네트워크 레이어에서 인터셉트.

이유: URL 구성 → 헤더 주입 → 응답 파싱 전체 경로를 테스트할 수 있고,
URL 변경 시 MSW 핸들러 미매칭으로 테스트 실패 → API 계약 검증 가능.

```ts
// tests/mocks/server.ts
import { setupServer } from 'msw/node';
export const server = setupServer(...mapleStoryHandlers);

// tests/mocks/handlers/maplestory.handlers.ts
import { http, HttpResponse } from 'msw';
export const mapleStoryHandlers = [
  http.get('https://open.api.nexon.com/maplestory/v1/character/basic', ({ request }) => {
    const ocid = new URL(request.url).searchParams.get('ocid');
    if (!ocid) return HttpResponse.json({ error: { name: 'OPENAPI00004', message: 'Missing ocid' } }, { status: 400 });
    return HttpResponse.json(characterBasicFixture);
  }),
];

// tests/fixtures/maplestory/character-basic.fixture.ts
export const characterBasicFixture: CharacterBasic = {
  character_name: '테스트캐릭터',
  world_name: '스카니아',
  // ...
};
```

- `tests/fixtures/` — 게임별 응답 fixture 고정 데이터 (실제 API 응답 구조와 동일)
- 타입 레벨 테스트: `tsc --noEmit`으로 브랜드 타입 오용 검출
- 테스트 파일: `tests/unit/[core|games]/` 아래 `[파일명].test.ts`
- `vitest.config.ts`에 MSW 서버 lifecycle (beforeAll/afterEach/afterAll) 설정

## 주석 원칙

- **"왜(why)" 주석만 작성** — 코드가 "무엇(what)"을 하는지는 클래스/함수명으로 표현
- API 응답 타입에서 비직관적인 필드는 주석 필수

```ts
access_flag: string; // "true" | "false" (boolean이 아닌 문자열)
liberation_quest_clear: string; // "0": 미완료, "1": 제네시스 해방, "2": 데스티니 1차 해방
```

## Prettier

`printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`, `endOfLine: 'lf'`, `tabWidth: 2`, `semi: true`

---

## 참조 문서

이 SDK의 아키텍처 결정과 DX 원칙은 아래 문서들을 참조하여 설계했다.

### SDK 설계 철학

| 문서 | 참조 포인트 |
|---|---|
| [Stripe — Designing APIs for humans](https://dev.to/stripe/designing-apis-for-humans-object-ids-3o5a) | 식별자 타입 설계, 에러 메시지 철학 |
| [Stripe — Error handling](https://stripe.com/docs/error-handling) | 에러 분류 계층, `instanceof` 체크 패턴 |
| [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript) | Retry 로직, auto-pagination (`_defaultPageSize`, async iterator), 에러 서브클래스 분류 |
| [GitHub Octokit.js](https://github.com/octokit/octokit.js) | 멀티 플랫폼 SDK 패턴, plugin 아키텍처, sub-path exports |
| [Toss Payments — 개발자 문서](https://docs.tosspayments.com/sdk/v2) | 국내 개발자를 위한 DX, 한글 에러 메시지, 단계별 가이드 |

### TypeScript 패턴

| 문서 | 참조 포인트 |
|---|---|
| [Matt Pocock — Branded Types](https://www.totaltypescript.com/using-branded-types-in-typescript) | `OCID`, `GuildId`, `NexonDate` 브랜드 타입 구현 |
| [Matt Pocock — Strongly Typed Fetch](https://www.totaltypescript.com/fetching-data-in-typescript) | 제네릭 fetch 래퍼 타입 설계 |
| [TypeScript Handbook — Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) | `.d.ts` 최적화, public API 노출 전략 |
| [TypeScript — `satisfies` operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) | 엔드포인트 상수 타입 추론 개선 |

### 번들링 & 패키지

| 문서 | 참조 포인트 |
|---|---|
| [tsup — Multiple Entry Points](https://tsup.egoist.dev/#multiple-entry-points) | sub-path entry 설정, `splitting` 옵션 |
| [Node.js — Package Entry Points](https://nodejs.org/api/packages.html#package-entry-points) | `exports` 필드 공식 스펙 |
| [publint](https://publint.dev/) | npm 패키지 exports 유효성 검사 도구 |
| [Are the types wrong?](https://arethetypeswrong.com/) | TypeScript `.d.ts` exports 검증 도구 |

### 테스트

| 문서 | 참조 포인트 |
|---|---|
| [MSW — Mock Service Worker](https://mswjs.io/docs/) | 네트워크 레이어 인터셉트, `setupServer`, `http.get` 핸들러 |
| [Vitest — vi.fn mock](https://vitest.dev/api/vi.html) | 단위 테스트, fetch mock 비교 |

### 넥슨 공식 문서

| 문서 | 참조 포인트 |
|---|---|
| [Nexon Open API 포털](https://openapi.nexon.com/) | API 키 발급, 게임별 엔드포인트 목록 |
| [Nexon Open API 요청 가이드](https://openapi.nexon.com/guide/request-api/) | 인증 헤더(`x-nxopen-api-key`), 에러 코드 `OPENAPI00001~00011`, Rate Limit(5 req/s) |
| [MapleStory Open API](https://openapi.nexon.com/game/maplestory/) | KMS 전체 엔드포인트 목록 |
### 선행 구현체 (참고용)

| 저장소 | 참조 포인트 |
|---|---|
| [SpiralMoon/maplestory.openapi](https://github.com/SpiralMoon/maplestory.openapi) | KMS 전체 타입 정의 레퍼런스 |
| [leejs8128/nexon-api](https://github.com/leejs8128/nexon-api) | 국내 SDK 구현 패턴 참고 |
