# 기여 가이드

`nexon-open-api` 를 고치거나 관리하는 분을 위한 문서입니다. 라이브러리를 사용하는 방법은 [README](README.md)와 [시작 가이드](docs/getting-started.md)에 있습니다.

버그 제보와 제안은 [GitHub 이슈](https://github.com/Kimhasa/nexon-open-api-sdk/issues)로 받습니다. 실제 응답이 SDK 타입과 다르다는 제보가 특히 도움이 됩니다. 제보할 때 API 키와 실제 캐릭터·계정 이름은 지워 주세요.

이 문서는 요약입니다. 구조, 네이밍, 게임 추가 절차의 상세는 [CLAUDE.md](CLAUDE.md), 스펙 형식과 포털 변경 대응의 상세는 [specs/README.md](specs/README.md), 버전 정책은 [SEMVER.md](SEMVER.md)에 있습니다.

## 개발 환경

- Node.js 18 이상 (CI는 22, 24, 26에서 테스트)
- Yarn 4 (`packageManager` 로 고정되어 있어 `corepack` 으로 실행)

```bash
git clone https://github.com/Kimhasa/nexon-open-api-sdk.git
cd nexon-open-api-sdk
corepack yarn install
```

코드를 바꾼 뒤에는 아래 순서로 확인합니다.

```bash
corepack yarn type-check      # src + tests + scripts 타입 검사
corepack yarn lint            # ESLint
corepack yarn test            # Vitest 단위 테스트 (MSW로 네트워크를 가로챈다)
corepack yarn build           # dist/ 에 CJS + ESM 빌드
corepack yarn check:exports   # 빌드된 패키지의 진입점별 CJS/ESM 타입 해석 검사
corepack yarn format:check    # Prettier
```

게임 API를 추가·수정했다면 `corepack yarn specs:coverage` 로 스펙 대비 경로도 확인합니다. 줄 끝은 `.gitattributes` 로 LF에 고정되어 있습니다.

## 스펙 기반 개발

SDK 코드는 넥슨 포털이 공개하는 OpenAPI YAML(`specs/openapi/{slug}/{categoryId}.yaml`)을 원천으로 만듭니다. YAML은 손으로 고치지 않고, 포털과 다르면 다시 받습니다.

| 명령                  | 하는 일                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `yarn specs:fetch`    | 포털의 OpenAPI YAML을 `specs/openapi/` 로 수집하고 `index.json` 을 갱신   |
| `yarn specs:check`    | 저장된 스펙과 포털을 비교해 변경을 감지                                   |
| `yarn specs:diff`     | 두 스펙 스냅샷의 구조를 비교하고 SEMVER로 분류 (`--base <ref>`, `--live`) |
| `yarn specs:drift`    | SDK 타입과 커밋된 스펙을 필드 단위로 대조 (`--strict` 는 CI 게이트)       |
| `yarn specs:coverage` | SDK가 구현한 경로와 스펙 경로를 대조                                      |
| `yarn specs:notices`  | 넥슨 Open API 공지에서 새 공지를 수집                                     |

게임이나 메서드를 추가할 때는 스펙을 읽고 types → shapes → client → fixture → MSW 핸들러 → 단위 테스트 → 문서 → `API_METADATA` 순서로 만듭니다. 단계별 규칙은 [CLAUDE.md의 "Spec-Driven 게임 추가 워크플로우"](CLAUDE.md#spec-driven-게임-추가-워크플로우)를 따릅니다.

SDK가 스펙과 의도적으로 다르게 동작하는 곳(예: FC 온라인 `getMaxDivision` 의 배열 정규화)은 `specs/drift-baseline.json` 에 이유와 함께 기록합니다.

## 포털 변경 자동 대응

넥슨이 API를 바꾸면 아래 순서로 따라갑니다.

1. **주간 모니터** — `api-monitor.yml` 이 매주 월요일 09:00(KST)에 포털을 저장된 스펙과 비교합니다.
2. **스펙 PR** — 변경이 있으면 스펙 갱신 PR(`specs/auto-update` → `main`)을 엽니다.
3. **Claude 자동 반영** — `sdk-auto-update.yml` 이 호환되는 변경(필드 추가, deprecation)을 SDK에 반영하고, 검증을 통과한 패치만 PR에 올립니다.
4. **사람의 리뷰** — 호환되지 않는 변경(MAJOR)과 새 게임은 사람이 판단합니다. 머지, `CHANGELOG.md`, 버전, 배포도 사람이 합니다.

수동으로 확인할 때는 `yarn specs:diff --base origin/main` 으로 분류를 보고 `yarn specs:drift --game <slug>` 로 반영 대상을 좁힙니다. 필요한 저장소 설정과 시크릿, 수동 절차는 [specs/README.md의 "포털 변경 대응 절차"](specs/README.md#포털-변경-대응-절차)에 있습니다.

## CI 게이트

`ci.yml` 이 `main` 으로 가는 변경을 아래 항목으로 검사합니다. 하나라도 실패하면 머지하지 않습니다.

| 항목       | 명령                               | 막는 것                                     |
| ---------- | ---------------------------------- | ------------------------------------------- |
| Type Check | `yarn type-check`                  | SDK와 테스트·스크립트의 타입 오류           |
| Lint       | `yarn lint`                        | ESLint 규칙 위반                            |
| Format     | `yarn format:check`                | Prettier 형식 위반                          |
| Spec Drift | `yarn specs:drift --strict`        | baseline에 없는 SDK 타입과 공식 스펙의 차이 |
| Test       | `yarn test`, `yarn test:coverage`  | 단위 테스트 실패 (Node.js 22, 24, 26)       |
| Build      | `yarn build`, `yarn check:exports` | 빌드 실패, 진입점별 CJS/ESM 타입 해석 문제  |

커밋할 때는 husky + lint-staged가 바뀐 파일에 ESLint와 Prettier를 실행합니다.

## 실서버 확인

단위 테스트는 스펙으로 만든 응답을 씁니다. 실제 넥슨 서버와의 일치는 아래 스크립트로 확인합니다.

| 명령                | API 키 | 확인하는 것                                                                                |
| ------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `yarn test:live`    | 불필요 | 빌드 결과로 실서버의 정적 메타데이터, FC 온라인 이미지, 잘못된 키의 에러 경로를 확인       |
| `yarn test:package` | 불필요 | npm tarball을 오프라인 설치해 CJS·ESM 실호출과 TypeScript(Node16·Bundler) 타입 검사        |
| `yarn test:{game}`  | 필요   | 게임별 실 API E2E (`scripts/test-*.ts`, 15개). `.env` 에 그 게임의 키와 캐릭터명 등이 필요 |
| `yarn test:deep`    | 필요   | E2E를 돌리며 모든 메서드 반환값을 SDK 응답 타입과 중첩 필드까지 대조 (차이 목록 출력)      |

```bash
corepack yarn build && corepack yarn test:live
corepack yarn test:package

cp .env.example .env            # 확인할 게임의 API 키와 캐릭터명 등을 채운다
corepack yarn test:maplestory   # test:{game} 목록은 package.json 참고
corepack yarn test:deep         # 15개 게임 전부, 또는 test:deep maplestory v4 처럼 일부만
```

`yarn test:deep` 은 E2E가 대표 필드 몇 개만 보는 한계를 메웁니다. 응답에 예상하지 못한 `null`, 타입에 없는 필드, 응답에 없는 필수 필드, 타입 차이가 있으면 메서드와 경로를 출력합니다. 캐릭터마다 장비·펫·스킬 구성이 달라 드러나는 차이도 달라지므로, 직업·레벨·월드가 다른 캐릭터 몇 명으로 돌려 보는 것이 좋습니다 (`.env` 의 캐릭터 변수를 바꾸거나 같은 이름의 환경변수로 덮어씁니다). 포털 스펙과 다르게 실제 응답에 맞춘 필드는 `specs/drift-baseline.json` 에 근거를 남깁니다.

API 키는 게임마다 따로 발급됩니다. 실 키로 확인한 뒤에는 `src/core/metadata/api-metadata.ts` 의 `lastVerifiedAt` 과 `note` 를 갱신하고, README의 "실서버 검증 현황" 수치도 맞춥니다. 실제 캐릭터명·계정 식별자는 fixture와 문서에 넣지 않습니다.

## 릴리즈 절차

1. `CHANGELOG.md` 를 정리하고 [SEMVER.md](SEMVER.md)에 따라 버전을 정합니다.
2. `package.json` 의 `version` 을 직접 올립니다. `yarn release` 는 버전을 바꾸지 않습니다.
3. 위의 검사 명령과 `yarn test:live`, `yarn test:package` 를 통과시킵니다.
4. 배포는 아래 둘 중 **한 가지 경로만** 씁니다. 같은 버전에 둘을 함께 쓰지 않습니다.
   - **태그 push (권장)** — `v{version}` 태그를 push하면 CI의 publish job이 태그와 `package.json` 버전이 같은지 확인한 뒤 `npm publish` 를 실행합니다. 이미 게시된 버전이면 건너뜁니다.
   - **수동** — `yarn release` (빌드 + 테스트 + `npm publish`).

## 문서·주석 작성 원칙

이 라이브러리의 독자는 **게임을 잘 아는 창작자**입니다. 팬사이트, 디스코드 봇, 전적 검색기를 만드는 사람들이고, 개발 경험은 초보부터 숙련까지 다양합니다. 사용자 문서(README, `docs/`, `examples/`)와 JSDoc은 이 독자를 기준으로 씁니다.

- **게임 용어가 먼저입니다.** 게임 화면과 유저들이 쓰는 공식 한국어 이름을 먼저 쓰고, 메서드와 응답 필드 이름은 그 옆에 붙입니다.
  - 예: "유니온 공격대 배치 — `client.maplestory.union.getRaider()` (`union_raider`)"
- **용어의 근거는 넥슨 스펙입니다.** 1순위는 포털 스펙의 `summary`·`description`, 2순위는 그 게임에서 널리 쓰는 공식 명칭입니다. 확실하지 않으면 스펙의 표현을 그대로 쓰고 용어를 지어내지 않습니다.
- **API 전용 개념은 게임 개념으로 풉니다.** 예: "OCID — 캐릭터마다 붙는 고유 번호. 캐릭터 이름으로 먼저 받아 두고, 정보를 조회할 때 넣는다."
- **코드값과 숫자의 게임 의미를 적습니다.** 예: `matchtype` 50 = 공식경기, `liberation_quest_clear` "1" = 제네시스 해방.
- **데이터 갱신 시점은 스펙에 적힌 것만 씁니다.** 근거 없는 시각은 쓰지 않습니다.
- **예제는 복사해서 그대로 실행돼야 합니다.** 완전한 예제에는 저장할 파일 이름과 실행 명령을 적고, 짧은 조각에는 전제("위의 `client` 가 있다고 가정")를 적습니다. API 키는 환경변수로 읽고, 대표 예제에는 `try/catch` 와 출력 예시를 넣습니다. 실존 인물처럼 보이는 캐릭터명은 쓰지 않습니다('캐릭터명', '닉네임').
- **응답 필드를 전부 나열하지 않습니다.** 창작에 자주 쓰는 필드만 설명하고 나머지는 에디터 자동완성으로 안내합니다.
- **사용자 문서에 관리자용 개념을 쓰지 않습니다.** PR, Spec Drift, fixture, MSW, SEMVER 같은 말은 이 문서와 `CLAUDE.md`, `specs/README.md` 에만 둡니다. 넥슨 API 경로(`GET /...`)가 필요하면 `<details>` 안에 둡니다.
- **코드의 메서드, 파라미터, 허용값, 필드, 에러 클래스는 실제 코드에서 확인하고 씁니다.** 문서의 코드 블록은 타입 검사를 통과해야 합니다.

코드 주석은 "왜"만 적고, 응답 타입의 비직관적인 값(문자열 boolean, 코드값)에는 의미를 적습니다 ([CLAUDE.md의 "주석 원칙"](CLAUDE.md#주석-원칙)).

## 커밋 메시지

```
prefix(scope): 주요 메시지 (한글 OK, 50자 이내)

* 상세 변경 내용
```

prefix는 `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `release` 중 하나입니다 ([CLAUDE.md의 "커밋 컨벤션"](CLAUDE.md#커밋-컨벤션)).
