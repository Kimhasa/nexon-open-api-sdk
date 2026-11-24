# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See [SEMVER.md](SEMVER.md) for versioning rules specific to this API wrapper SDK.

엔드포인트 개수는 "SDK public API 메서드 수"(메서드 1개 = 넥슨 API 경로 1개) 기준입니다.

## [Unreleased]

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
