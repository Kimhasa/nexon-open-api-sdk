# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See [SEMVER.md](SEMVER.md) for versioning rules specific to this API wrapper SDK.

엔드포인트 개수는 "SDK public API 메서드 수"(메서드 1개 = 넥슨 API 경로 1개) 기준입니다.

## [Unreleased]

### Added

- **넥슨 Open API 포털 전체 지원** — 신규 게임 클라이언트 11개를 추가해 포털의 API 270개를 모두 지원한다 (14개 게임 + Open API 공지)
  - MapleStory Taiwan — `client.maplestoryTW`, `nexon-open-api/maplestory-tw` (27)
  - 퍼스트 디센던트 — `client.firstDescendant`, `nexon-open-api/first-descendant` (42)
  - 마비노기 영웅전 — `client.mabinogiHeroes`, `nexon-open-api/mabinogi-heroes` (19)
  - 서든어택 — `client.suddenAttack`, `nexon-open-api/sudden-attack` (11)
  - 카트라이더 러쉬플러스 — `client.kartrider`, `nexon-open-api/kartrider` (9)
  - 바람의나라 — `client.baram`, `nexon-open-api/baram` (7)
  - 마비노기 — `client.mabinogi`, `nexon-open-api/mabinogi` (5)
  - 바람의나라: 연 — `client.baramYeon`, `nexon-open-api/baram-yeon` (4)
  - V4 — `client.v4`, `nexon-open-api/v4` (4)
  - 히트2 — `client.hit2`, `nexon-open-api/hit2` (2)
  - 넥슨 Open API 공지 — `client.platform`, `nexon-open-api/platform` (1)
- 신규 게임 E2E 스크립트 `yarn test:{game}` 11개 (실 API 키 필요, `.env.example` 참고)

- 넥슨 포털 OpenAPI 스펙 저장소: `yarn specs:fetch` 가 포털의 카테고리별 OpenAPI YAML을 `specs/openapi/{slug}/{categoryId}.yaml` 로 수집하고 `specs/openapi/index.json` 색인을 만든다 (2026-11-24 기준 15개 게임, 270개 오퍼레이션)
- `yarn specs:check` — 저장된 스펙과 포털을 비교해 게임·카테고리·오퍼레이션 추가/삭제, YAML 수정(시각·해시)을 감지
- `yarn specs:coverage` — SDK가 호출하는 경로와 스펙 경로를 게임별로 대조
- `yarn check:exports` — 빌드된 패키지의 sub-path별 CJS/ESM 타입 해석 검사 (`@arethetypeswrong/cli`)
- 메이플스토리 `GuildBasic.guild_user_count` (포털 스펙 반영, optional)
- `API_METADATA` 에 `fconline` 엔트리
- 메이플스토리: 포털 신규 API 8개 (48 → 56)
  - 연무장 `battlePractice.getReplayId()`, `getResult()`, `getSkillTimeline()`, `getCharacterInfo()`
  - 스케줄러 `scheduler.getCharacterState()`
  - `history.getSoulPotential()`, `character.getRingReserveSkillEquipment()`
  - `getLegacyOuid(legacyApiKey)` — 구 개발자센터 API 키로 ouid 조회
- 메이플스토리M: `union.getStat()` 유니온 스탯 (37 → 38)
- FC 온라인: `getSeasonMeta()` 공식경기 시즌, `getClassMeta()` 선수 클래스 메타데이터 (16 → 18)
- MapleStorySEA 응답 shape 검증 (`responseValidation`) — 이제 구현된 모든 게임에 적용
- 메이플스토리·메이플스토리M·MapleStorySEA·FC 온라인 응답 타입에 2026-11 포털 스펙의 새 필드를 optional로 추가
- `HttpClient.get()` 의 4번째 인자 `HttpRequestOptions` — 요청별 헤더 추가·덮어쓰기, `undefined` 로 기본 헤더 제거
- FC 온라인 매치 상세 `matchInfo[].division` (optional)
- 포털 변경 분석 도구
  - `yarn specs:diff` — 두 스펙 스냅샷을 오퍼레이션·파라미터·응답 필드 단위로 비교하고 SEMVER 기준(MINOR / DEPRECATE / MAJOR)으로 분류
  - `yarn specs:drift` — SDK 타입과 커밋된 스펙을 필드 단위로 대조. `--strict` 는 baseline(`specs/drift-baseline.json`) 밖의 drift가 있으면 실패
  - `yarn specs:notices` — 넥슨 Open API 공지에서 새 공지 수집
- API 변경 자동 대응 (GitHub Actions)
  - 주간 모니터가 포털 변경을 감지하면 `specs/auto-update` 브랜치에 스펙을 갱신하고 PR을 연다. 본문에는 분류된 diff, drift, 공지를 넣는다
  - `sdk-auto-update.yml` — Claude Code가 MINOR·DEPRECATE 변경을 SDK에 반영한다. 권한은 읽기 전용이고 샌드박스에서 실행된다. 독립 검증 게이트를 통과한 변경만 워크플로가 커밋한 뒤 CI를 실행하고 PR에 요약을 단다. MAJOR는 사람 판단으로 남긴다
  - 모니터가 매 실행마다 자신을 다시 활성화해 60일 비활동 비활성화를 방지한다

### Fixed

- CommonJS(`require`) TypeScript 소비자가 패키지 타입을 해석하지 못하던 문제 (TS1471) — `exports` 에 조건별 `types` (`.d.ts` / `.d.cts`) 지정
- 메이플스토리 `GuildBasic.guild_member_count` 설명 정정 (길드원 수 → 길드 캐릭터 전체 수)
- 테스트 파일이 타입 검사에서 빠져 있던 문제 (`tsconfig.test.json` 이 상속한 `exclude`) 와 그로 인해 숨어 있던 테스트 타입 오류 16개
- Windows(`core.autocrlf=true`) 체크아웃에서 `format:check` 가 실패하던 문제 — `.gitattributes` 로 LF 고정
- API 모니터가 2026-04부터 실패하던 문제 — 존재하지 않는 `api-change` 라벨, 잘못된 slug 4개, lockfile 미사용, 같은 변경의 반복 보고. `specs:check` 기반으로 재작성
- CI가 이미 게시된 버전을 다시 `npm publish` 하려다 실패하던 문제 — 게시 전 버전 존재 확인
- FC 온라인 이미지 URL 헬퍼(`getActionShotUrl`, `getPlayerImageUrl`)가 HTTP 400을 돌려주는 `open.api.nexon.com` 을 가리키던 문제 — 포털 스펙의 CDN `fco.dn.nexoncdn.co.kr` 로 변경 (실측 200)
- 메이플스토리·메이플스토리M·MapleStorySEA·FC 온라인 응답 타입을 현재 포털 스펙과 대조해 누락 필드·nullable 정정

### Changed

- **BREAKING** FC 온라인 `getMaxDivision()` 반환 타입 `FcMaxDivision` → `readonly FcMaxDivision[]`. 역대 최고 등급은 매치 종류별로 존재하며, 응답이 단일 객체여도 배열로 정규화한다
- SDK 입력 검증 실패를 모든 게임에서 `NexonBadRequestError`(code `OPENAPI00004`, status 400)로 통일했다. 오류 메시지는 유효한 값이나 조회 방법을 안내한다. 이전에 `toNexonDate()` 가 파싱할 수 없는 날짜 문자열에 던지던 `Error` 도 이 에러로 바뀐다. `NexonBadRequestError` 는 `Error` 의 하위 클래스이므로 `catch (e)` / `instanceof Error` 처리는 그대로 동작한다
- 런타임 응답 shape 검증(`responseValidation`)이 최상위 배열 응답에도 적용된다 (`arrayOf()` 사용, 서든어택·마비노기 영웅전·퍼스트 디센던트 메타데이터 등 37개)
- CI에 `specs:drift --strict` 게이트 추가 — SDK 타입이 커밋된 포털 스펙에서 벗어나면 실패 (nullable 넓힘과 `@deprecated` 유지는 허용)

- CI: GitHub Actions 메이저 버전 갱신(Node 24 런타임), 테스트 매트릭스 Node 22/24/26 (`engines` 는 `>=18` 유지), npm Trusted Publishing(OIDC·provenance) 준비
- `yarn type-check` 가 `tests`, `scripts` 까지, `yarn lint` 가 `scripts` 까지 검사
- 문서(CLAUDE.md, README, docs, CHANGELOG)의 게임 목록·path prefix·엔드포인트 수를 실제와 일치시킴 — 크레이지 아케이드 제거(포털에서 삭제됨), `platform` 추가, 던전앤파이터·사이퍼즈는 네오플 API라 범위 외로 표기

### Deprecated

- FC 온라인 `getAllMatchList()` — 넥슨이 2026-07-07 `/fconline/v1/match` 제공을 종료했다. 개별 계정 기록은 `getMatchList()` 를 사용한다
- FC 온라인 `getSeasonIdMeta()` — 넥슨이 2026-11-19 이후 제공 종료를 공지했다. 선수 클래스는 `getClassMeta()`, 공식경기 시즌은 `getSeasonMeta()` 를 사용한다
- 메이플스토리 `ranking.getGuild({ ocid })` 의 `ocid` — 포털 스펙에서 제거됐다. 입력해도 서버로 보내지 않고 한 번 경고한다. 특정 길드는 `guild_name` 으로 조회한다
- 포털 스펙에서 사라진 응답 필드를 `@deprecated` + optional로 전환 (다음 MAJOR에서 삭제)
  - 메이플스토리: `CashItemEquipmentItem.cash_item_skills` 등, 직업 전용 장비(`dragon_equipment[]`·`mechanic_equipment[]`)의 잠재능력·에디셔널 잠재능력 등급·옵션 8개 필드 (일반 장비 프리셋은 기존 계약 유지)
  - 메이플스토리M: V코어 `slot_id`, `slot_level`, `vcore_name`, `vcore_skill_name_1~3`, 유니온 공격대 `use_preset_no`, `use_union_occupied_option`, `battle_map`
  - MapleStorySEA: `skills`, 직업 전용 장비(Dragon/Mechanic)의 잠재능력 필드

### Removed

- `scripts/api-monitor.ts`, `scripts/api-snapshot.json` → `yarn specs:check` 와 `specs/openapi/index.json` 으로 대체
- `specs/maplestory-sea.md` (포털 화면 복사본) → `specs/openapi/maplestorysea/` 로 대체

## [0.1.1] - 2026-03-18

### Added

- EA SPORTS FC Online 클라이언트 (`client.fcOnline`) — 16개 메서드
  - 계정 정보 (5): `getOuid`, `getBasic`, `getMaxDivision`, `getMatchList`, `getTradeList`
  - 매치 (2): `getAllMatchList`, `getMatchDetail`
  - 랭커 (1): `getRankerStats`
  - 메타데이터 (6): `getMatchTypeMeta`, `getSpidMeta`, `getSeasonIdMeta`, `getSpPositionMeta`, `getDivisionMeta`, `getDivisionVoltaMeta`
  - 이미지 URL 헬퍼 (2): `getActionShotUrl`, `getPlayerImageUrl`
- 메이플스토리M 클라이언트 (`client.maplestorym`) — 37개 메서드
  - `getOcid` (1), character (17), union (2), guild (2), ranking (9), notice (6)
- MapleStorySEA 클라이언트 (`client.maplestorySEA`) — 26개 메서드
  - `getOcid` (1), character (19), union (4), guild (2)
- Sub-path export: `nexon-open-api/fconline`, `nexon-open-api/maplestory-m`, `nexon-open-api/maplestory-sea`
- Branded type: `OUID` (FC Online 계정 식별자)
- `AbstractGameClient` base class — 비메이플 게임을 위한 멀티 게임 계층
- API 메타데이터: `getApiMetadata()` — 게임별 API 검증 일자 조회
- 런타임 응답 Shape 검증: `responseValidation` 옵션 (opt-in, warn-only) — KMS, 메이플스토리M, FC Online에 shape descriptor 적용 (MapleStorySEA는 미적용)
- Deprecation 유틸리티: `emitDeprecation()` — 런타임 deprecation 경고
- `CHANGELOG.md`, `SEMVER.md`, `docs/` 게임별 API 레퍼런스
- CI/CD 파이프라인 (GitHub Actions: lint, type-check, test, build, 태그 push 시 npm publish)
- 넥슨 API 포털 변경 감지 모니터링 워크플로우 (`scripts/api-monitor.ts`, 주간 실행)
- husky + lint-staged pre-commit hook

### Changed

- README 개편: 지원 게임 그리드, 게임별 레퍼런스를 `docs/`로 분리
- 날짜 유틸을 `core/types/date.ts` 에서 `games/_base/maple-date.ts` 로 이동 (public export 변경 없음)

### Fixed

- npm 패키지 메타데이터: `homepage`, `bugs` 추가, `files` 에 `README.md`·`LICENSE` 포함 (npm 페이지에 README 표시)
- lint 에러와 prettier 포맷 일괄 수정

## [0.1.0] - 2026-03-04

### Added

- 초기 릴리즈
- 메이플스토리 KMS 클라이언트 (`client.maplestory`) — 48개 메서드
  - `getOcid`·`getOuid`·`getAchievement` (3), character (22), union (4), guild (2), ranking (6), history (3), notice (8)
- `NexonClient` 메인 진입점 (lazy getter 패턴)
- `HttpClient` — native fetch, retry (429/503), timeout, interceptors
- Branded types: `OCID`, `GuildId`, `NexonDate`
- 에러 분류: 6개 서브클래스 (`NexonRateLimitError`, `NexonAuthError`, etc.)
- CJS + ESM 듀얼 출력 (tsup)
- Sub-path export: `nexon-open-api/maplestory`
- MSW 기반 단위 테스트 (67개)

[Unreleased]: https://github.com/Kimhasa/nexon-open-api-sdk/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Kimhasa/nexon-open-api-sdk/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Kimhasa/nexon-open-api-sdk/releases/tag/v0.1.0
