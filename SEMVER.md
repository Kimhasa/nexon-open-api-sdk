# Semver Policy

이 SDK는 [Semantic Versioning 2.0.0](https://semver.org/)을 따르며,
**서드파티 API 래퍼**에 특화된 버전 정책을 적용합니다.

## 버전 규칙

### MAJOR (breaking)

- public 클래스, 메서드, 타입의 제거 또는 이름 변경
- 메서드 반환 타입에서 필드 삭제 (narrowing)
- 필수 파라미터 변경
- Node.js 최소 버전 상향 (예: 18 → 20)
- 게임 클라이언트 제거

### MINOR (feature, non-breaking)

- 새 메서드, sub-client, 게임 클라이언트 추가
- 기존 응답 타입에 optional 필드 추가
- 기존 메서드에 optional 파라미터 추가
- 새 에러 서브클래스 추가
- 기존 API의 deprecation 표시 (런타임 경고 추가)

### PATCH (fix, non-breaking)

- URL 구성, 날짜 포맷, 에러 분류 등의 버그 수정
- 응답 타입 수정 (필드 제거 없이 타입 보정)
- 문서 개선
- 내부 리팩토링 (public API 변경 없음)
- devDependencies 업데이트

## 넥슨 API 변경 시 대응

이 SDK는 넥슨이 통제하는 API를 래핑하므로, API 측 변경에 대한 대응 규칙이 필요합니다.

### 넥슨이 응답 필드를 추가한 경우

→ **MINOR**: SDK 타입에 optional 필드로 추가. 기존 코드는 영향 없음.

```ts
// before
interface CharacterBasic { character_name: string; character_level: number; }

// after (MINOR)
interface CharacterBasic { character_name: string; character_level: number; new_field?: string; }
```

### 넥슨이 응답 필드를 삭제한 경우

→ **MINOR**: 해당 필드를 `@deprecated` + optional로 변경하고 런타임 경고 추가.
→ **다음 MAJOR**: deprecated 필드를 타입에서 제거.

```ts
// Phase 1 (MINOR) — deprecated 표시
interface CharacterBasic {
  /** @deprecated 넥슨 API에서 제거됨 (v0.3.0). 다음 major 버전에서 삭제 예정. */
  removed_field?: string;
}

// Phase 2 (MAJOR) — 타입에서 삭제
interface CharacterBasic {
  // removed_field 삭제
}
```

### 넥슨이 필드 타입을 변경한 경우

→ **MAJOR**: SDK 타입 변경이 불가피한 경우.
→ **MINOR**: 타입을 확장(widening)할 수 있는 경우 (예: `number` → `number | string`).

### 넥슨이 엔드포인트를 삭제한 경우

→ **MINOR**: 해당 메서드에 `@deprecated` 표시 + 런타임 경고.
→ **다음 MAJOR**: 메서드 제거.

## 검증 주기

- 각 게임의 API는 `getApiMetadata(gameId).lastVerifiedAt`로 마지막 검증 일자 추적
- `responseValidation: true` 옵션으로 런타임 shape drift 감지 가능
- `scripts/test-api.ts`로 실제 API 대비 E2E 검증

## Pre-1.0 주의사항

`0.x.y` 버전에서는 MINOR 변경이 breaking을 포함할 수 있습니다.
안정적 API 보장은 `1.0.0` 이후부터 적용됩니다.
