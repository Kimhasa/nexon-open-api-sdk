# {Game Display Name} API Spec

<!--
  이 파일은 Claude가 SDK 코드를 생성할 때 참조하는 구조화된 API 스펙입니다.

  작성 방법:
  1. 유저가 넥슨 API 포털(https://openapi.nexon.com)에서 raw 복붙
  2. Claude가 이 템플릿 포맷으로 변환하여 specs/{game}.md 에 저장
  3. 유저가 "specs/{game}.md 의 {category} 카테고리 구현해줘" 요청
  4. Claude가 spec 읽고 types.ts → shapes.ts → Client.ts → tests 순서로 생성

  변환 규칙:
  - 모든 response 필드는 readonly
  - 필드명은 API 응답 그대로 (snake_case 유지, 변환하지 않음)
  - nullable 필드는 `T | null` 로 표기
  - 중첩 객체/배열은 별도 interface로 분리
  - Example Response는 fixture 생성의 근거이므로 반드시 포함
  - 게임별 타입 prefix: KMS=없음, M=M, SEA=SEA, TW=TW (e.g. SEACharacterBasic)
-->

## Meta

- gameId: {소문자 식별자, e.g. "maplestorysea"}
- pathPrefix: {API path prefix, e.g. "maplestorysea"}
- clientClass: {PascalCase}Client, e.g. MapleStorySEAClient
- clientProperty: {NexonClient getter 이름, e.g. "maplestorySEA"}
- baseClass: {AbstractGameClient | AbstractMapleBaseClient}
- timezoneOffset: {분 단위, e.g. 540(KST), 480(SGT). 비메이플은 생략}
- dataStartDate: {데이터 제공 시작일 YYYY-MM-DD, 해당 시 기재}
- dataRefreshTime: {전일 데이터 갱신 시각, e.g. "01:00 KST (UTC+9)"}
- idMethod: {식별자 조회 메서드 시그니처, e.g. "getOcid(characterName: string): OCID"}
- idEndpoint: {식별자 조회 엔드포인트, e.g. "GET /{pathPrefix}/v1/id"}
- idParams: {식별자 조회 쿼리 파라미터, e.g. "character_name"}
- brandedTypes: {게임 전용 브랜드 타입, e.g. "OCID, GuildId" 또는 "OUID"}
- status: {not-started | spec-ready | in-progress | complete | verified}
- lastUpdated: {YYYY-MM-DD}

## Implementation Status

| Category | # Endpoints | Types | Shapes | Client | Tests | Status      |
| -------- | ----------- | ----- | ------ | ------ | ----- | ----------- |
| {cat}    | {n}         | -     | -      | -      | -     | not-started |

## Notes

<!--
  게임별 특이사항 기재:
  - "world_name이 OCID 조회에 필수"
  - "일부 엔드포인트가 camelCase 사용"
  - "메타데이터 API는 static JSON (별도 base URL)"
  - "특정 필드가 deprecated 예정"
-->

---

## Category: {category}

### GET /{pathPrefix}/v1/{path}

- sdkMethod: {메서드명, e.g. "getBasic"}
- params: { ocid: OCID, date?: NexonDate | string }
- paramType: {기존 타입 또는 신규 정의 필요 시 "new", e.g. "OcidDateRequest"}
- description: {한줄 설명}
- dataAvailableFrom: {데이터 제공 시작일, 해당 시 기재}
- notes: {엔드포인트별 특이사항}

#### Query Parameters

| Parameter | Type   | Required | Description                                       |
| --------- | ------ | -------- | ------------------------------------------------- |
| ocid      | string | yes      | Character identifier                              |
| date      | string | no       | Query date (YYYY-MM-DD). Defaults to previous day |

#### Response

| Field           | Type     | Required | Description             |
| --------------- | -------- | -------- | ----------------------- |
| date            | string   | yes      | Query date              |
| character_name  | string   | yes      | Character name          |
| character_level | number   | yes      | Character level         |
| some_array      | Object[] | yes      | Array of nested objects |
| optional_field  | string   | no       | Nullable field          |

<!--
  Type 표기 규칙:
  - string, number, boolean → 그대로
  - number(int64) → TypeScript에서는 number지만 JSDoc에 int64 명시
  - Object[] → 별도 interface 분리 (아래 서브테이블)
  - Object → 별도 interface 분리
  - string[] → readonly string[]
  - Required "no" → `T | null` 또는 optional (API 동작에 따라)
-->

##### some_array element

| Field      | Type   | Required | Description |
| ---------- | ------ | -------- | ----------- |
| sub_field  | string | yes      | Description |
| sub_number | number | yes      | Description |

#### Example Response

```json
{
  "date": "2025-01-01T00:00+09:00",
  "character_name": "TestChar",
  "character_level": 275,
  "some_array": [{ "sub_field": "value", "sub_number": 100 }],
  "optional_field": null
}
```

---

<!--
  다음 엔드포인트도 동일한 구조로 반복:

  ### GET /{pathPrefix}/v1/{next-path}
  - sdkMethod: ...
  ...
-->
