# {Game Display Name} 구현 노트

<!--
  이 양식은 API 스펙을 옮겨 적는 곳이 아니다.
  엔드포인트·파라미터·응답 필드의 원본은 specs/openapi/{slug}/*.yaml 이고, 목록은 specs/openapi/index.json 이다.
  여기에는 YAML에 없는 것만 적는다: SDK 설계 결정, 메서드 이름 매핑, 진행 상황, 스펙과 실제 응답의 차이.

  사용법: specs/{slug}.md 로 복사해 채운다. 적을 내용이 없는 게임은 만들지 않아도 된다.
-->

## Meta

- slug: {포털 slug = API path prefix, e.g. "maplestorysea"}
- specs: `specs/openapi/{slug}/`
- clientClass: {PascalCase}Client, e.g. MapleStorySEAClient
- clientProperty: {NexonClient getter 이름}
- baseClass: {AbstractGameClient | AbstractMapleBaseClient}
- timezoneOffset: {분 단위, e.g. 540(KST), 480(SGT). 비메이플은 생략}
- brandedTypes: {게임 전용 브랜드 타입, e.g. "OCID, GuildId" 또는 "OUID"}
- typePrefix: {타입 이름 접두사, e.g. KMS=없음, M=M, SEA=SEA, TW=TW}
- status: {not-started | in-progress | complete | verified}
- lastUpdated: {YYYY-MM-DD}

## Implementation Status

<!-- 오퍼레이션 수는 `yarn specs:coverage --game {slug}` 로 확인한다. -->

| Category (id) | 스펙 파일 | # Operations | Types | Shapes | Client | Tests | Status      |
| ------------- | --------- | ------------ | ----- | ------ | ------ | ----- | ----------- |
| {name} ({id}) | {id}.yaml | {n}          | -     | -      | -      | -     | not-started |

## Method Mapping

<!-- operationId 는 index.json 의 값을 그대로 쓴다. SDK 메서드 이름은 CLAUDE.md 의 네이밍 규칙을 따른다. -->

| Operation (path)      | operationId   | SDK method            | paramType       |
| --------------------- | ------------- | --------------------- | --------------- |
| GET /{slug}/v1/{path} | {operationId} | `{category}.getXxx()` | OcidDateRequest |

## Notes

<!--
  YAML만 봐서는 알 수 없는 것:
  - "world_name이 OCID 조회에 필수"
  - "일부 엔드포인트가 camelCase 사용"
  - "메타데이터 API는 static JSON (키 불필요)"
  - 스펙과 실제 응답이 다른 필드 (실응답으로 확인한 날짜와 함께)
  - nullable 여부처럼 스펙에 안 적힌 동작
-->

## 타입 변환 규칙

- 모든 response 필드는 `readonly`, 필드명은 API 응답 그대로 (snake_case 유지)
- `type: integer, format: int64` → `number` (JSDoc에 int64 명시)
- 중첩 object/array → 별도 interface로 분리
- `nullable: true` 또는 실응답에서 null이 오는 필드 → `T | null`
- fixture는 스키마와 필드 `example`에서 합성한다 (YAML에 완성된 예시 응답은 없다)
