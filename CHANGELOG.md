# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See [SEMVER.md](SEMVER.md) for versioning rules specific to this API wrapper SDK.

## [Unreleased]

### Added
- `AbstractGameClient` base class for multi-game architecture support
- 17개 게임 지원 테이블 (현재 KMS만 구현 완료)
- API 메타데이터: `getApiMetadata()` — 게임별 API 검증 일자 조회
- 런타임 응답 Shape 검증: `responseValidation` 옵션 (opt-in, warn-only)
- Deprecation 유틸리티: `emitDeprecation()` — 런타임 deprecation 경고
- `CHANGELOG.md`, `SEMVER.md` 추가

## [0.1.0] - 2025-06-01

### Added
- 초기 릴리즈
- 메이플스토리 KMS 클라이언트 — 45개 엔드포인트
  - character (22), union (4), guild (2), ranking (6), history (3), notice (8)
- `NexonClient` 메인 진입점 (lazy getter 패턴)
- `HttpClient` — native fetch, retry (429/503), timeout, interceptors
- Branded types: `OCID`, `GuildId`, `NexonDate`
- 에러 분류: 6개 서브클래스 (`NexonRateLimitError`, `NexonAuthError`, etc.)
- CJS + ESM 듀얼 출력 (tsup)
- Sub-path export: `nexon-open-api/maplestory`
- MSW 기반 단위 테스트 (67개)

[Unreleased]: https://github.com/Kimhasa/nexon-open-api-sdk/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Kimhasa/nexon-open-api-sdk/releases/tag/v0.1.0
