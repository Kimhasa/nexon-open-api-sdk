# specs/ — 넥슨 Open API 스펙 (API DB)

SDK 구현의 원천 자료다. 넥슨 포털이 카테고리마다 공개하는 **OpenAPI 3.0.3 YAML**을 그대로 받아 git으로 관리한다.
포털에서 손으로 복사해 붙이는 절차는 더 이상 쓰지 않는다.

npm 패키지에는 포함되지 않는다 (`package.json`의 `files`가 `dist`만 배포).

## 디렉터리 구조

```
specs/
├── README.md                      # 이 문서
├── _template.md                   # 게임별 구현 노트 템플릿 (선택)
├── drift-baseline.json            # 사유가 확인된 의도적 SDK 차이
├── notices.json                   # 마지막으로 확인한 포털 공지의 공개 시각과 ID
└── openapi/                       # 생성물 — 손으로 고치지 않는다
    ├── index.json                 # manifest: 게임·카테고리·오퍼레이션 목록
    ├── .gitattributes             # YAML 원문 바이트 보존 (줄바꿈 정규화 금지)
    └── {slug}/{categoryId}.yaml   # 포털 원문 그대로
```

- `{slug}`는 포털 주소의 게임 식별자다 (`https://openapi.nexon.com/ko/game/{slug}/`). 예: `maplestory`, `heroes`, `kartrush`, `baramy`.
- `{categoryId}`는 포털 카테고리 id다 (`?id={categoryId}`).
- 언어가 여러 개면 `ko → en → zh-cht → 그 외` 순서로 하나만 저장한다. 고른 언어와 제공 언어 목록은 `index.json`에 있다.
- 던전앤파이터(`df`)와 사이퍼즈(`cyphers`)는 네오플 개발자센터로 연결되는 외부 API라 YAML이 없다. `index.json`에 `external: true`와 주소만 기록한다.

### `openapi/index.json`

```jsonc
{
  "schemaVersion": 1,
  "source": "https://openapi.nexon.com/ko/game/{slug}/",
  "games": [
    {
      "slug": "mabinogi",
      "name": "마비노기",
      "nameEng": "Mabinogi",
      "external": false, // true면 externalUrl만 있고 categories는 비어 있다
      "externalUrl": null,
      "categories": [
        {
          "id": 34,
          "name": "거대한 외침의 뿔피리 내역 조회",
          "language": "ko", // 저장한 YAML의 언어
          "availableLanguages": ["ko"],
          "file": "mabinogi/34.yaml", // specs/openapi/ 기준
          "fileUrl": "https://openapi.nexon.com/static/api/mabinogi/37_ko_script20241017040929.yaml",
          "timestamp": "20241017040929", // 파일명의 script{YYYYMMDDHHMMSS} = 포털 마지막 수정 시각
          "sha256": "…", // YAML 원문 해시
          "servers": ["https://open.api.nexon.com"],
          "operations": [
            {
              "method": "GET",
              "path": "/mabinogi/v1/horn-bugle-world/history",
              "operationId": "mabinogi_get_horn_bugle_world_history",
              "summary": "거대한 외침의 뿔피리 내역 조회",
            },
          ],
        },
      ],
    },
  ],
}
```

게임은 slug, 카테고리는 id, 오퍼레이션은 path·method 순으로 정렬하고 객체 키도 정렬한다. 수집 시각 같은 가변 값은 넣지 않는다.
그래서 포털이 변하지 않았으면 다시 받아도 git diff가 없다.

`timestamp`가 `00000000000000`인 파일은 포털이 수정 시각을 주지 않은 것이다. 이런 파일의 변경은 `sha256`으로 감지한다.

## 명령

| 명령                               | 하는 일                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `yarn specs:fetch`                 | 포털에서 전 게임 YAML을 받아 `specs/openapi/`를 갱신한다                  |
| `yarn specs:check`                 | 커밋된 `index.json`과 현재 포털을 비교해 변경 보고서를 낸다 (파일 무변경) |
| `yarn specs:coverage`              | 포털 오퍼레이션과 SDK(`src/games/**`)가 호출하는 경로를 대조한다          |
| `yarn specs:coverage --game tfd`   | 한 게임만                                                                 |
| `yarn specs:coverage --json`       | JSON 출력                                                                 |
| `yarn specs:check --manifest <p>`  | 다른 기준 manifest와 비교 (테스트용)                                      |
| `yarn specs:check --current <p>`   | 포털에 재요청하지 않고 이미 수집한 manifest와 비교                        |
| `yarn specs:check --report <path>` | Markdown 보고서 저장 위치 지정                                            |
| `yarn specs:diff`                  | Git HEAD와 작업 트리의 오퍼레이션·파라미터·응답 스키마 비교               |
| `yarn specs:diff --base <git-ref>` | 기준 커밋 지정                                                            |
| `yarn specs:diff --live`           | 포털 스냅샷을 임시 디렉터리에 수집하고 기준 커밋과 비교                   |
| `yarn specs:drift --game <slug>`   | 현재 SDK 코드와 Git HEAD에 커밋된 응답 스키마·쿼리 비교                   |
| `yarn specs:drift --summary`       | 게임별 집계만 표시                                                        |
| `yarn specs:notices --report <p>`  | 마지막으로 확인한 공지 이후의 새 공지를 저장하고 공지 기준 갱신           |

로그인과 API 키는 필요 없다. 포털에는 요청을 순차로 보낸다 (전체 60여 건, 30초 안팎).
`specs:diff`와 `specs:drift` 모두 `--json`을 지원한다.

### 종료 코드

| 명령             | 0                           | 1                                                     |
| ---------------- | --------------------------- | ----------------------------------------------------- |
| `specs:fetch`    | 수집·저장 성공              | 네트워크·파싱 실패. **기존 파일은 건드리지 않는다**   |
| `specs:check`    | 수집 성공 (변경이 있어도 0) | 수집 실패 또는 기준 manifest 없음. 변경 감지가 아니다 |
| `specs:coverage` | 정상                        | manifest 없음, 잘못된 인자                            |
| `specs:diff`     | 비교 성공 (변경이 있어도 0) | 기준 커밋, YAML 파싱 또는 수집 실패                   |
| `specs:drift`    | 분석 성공                   | 분석 실패 또는 `--strict`에서 baseline 외 drift 확인  |
| `specs:notices`  | 공지 수집 성공              | 네트워크·파싱 실패                                    |

`specs:check`의 변경 여부는 표준 출력의 `changes_detected=true|false`와, GitHub Actions에서는 step output
(`changes_detected`, `changes_count`, `report_path`, `fingerprint`)으로 확인한다.
`specs:diff`는 `major_count`, `deprecate_count`, `minor_count`를 step output에 쓴다.

### Semver 분류

분류는 [SEMVER.md](../SEMVER.md)의 SDK 공개 계약을 기준으로 한다.

| 분류      | 포털의 변경                                                                                                  | SDK 반영                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| MINOR     | 오퍼레이션, 응답 필드, 선택 파라미터 추가                                                                    | 새 메서드를 추가하고 새 필드·파라미터를 optional로 노출                       |
| MINOR     | 타입의 합집합 확장, enum 값 추가·제한 해제, 파라미터 필수 해제, 응답 필수화, null 제약 완화(입력)·강화(응답) | 호환되는 범위에서 타입을 조정                                                 |
| DEPRECATE | 오퍼레이션, 응답 필드 또는 파라미터 삭제                                                                     | MINOR에서 `@deprecated`와 optional 또는 메서드 호출 경고, 다음 MAJOR에서 제거 |
| MAJOR     | 호환되지 않는 타입·format 변경(배열↔객체 포함), enum 값 삭제·제한 도입                                       | 공개 타입과 호출 계약 변경을 검토                                             |
| MAJOR     | 필수 파라미터 추가, 선택→필수, 응답 필수 해제, 응답에 null 허용 또는 입력에서 null 제외                      | 영향 범위와 마이그레이션 검토                                                 |
| MINOR     | 오퍼레이션에 200 응답 스키마 추가                                                                            | 새 응답 계약을 검토                                                           |
| MAJOR     | 오퍼레이션의 200 응답 스키마 제거, 배열 원소 스키마 지정 여부 변경                                           | 응답 계약 변경을 검토                                                         |

diff는 200 응답의 미디어 유형별로 배열 원소와 중첩 속성까지 비교한다. 같은 YAML의 `#/components/…` 참조를 해석한다.
설명, 예제, 요청 본문, 합성 스키마(`oneOf`, `allOf` 등) 자체의 변경은 manifest 보고서에서 확인한다.
같은 게임에 동일한 method와 path가 여러 카테고리에 나오면 파일 경로순 첫 문서를 사용한다.

drift는 직접 HTTP 호출이 있는 SDK 메서드를 JSON 200 응답과 비교한다. 의도적으로 변환하는 반환 타입은 JSON 결과의 `operation`, `path`, `kind` 값을 복사하고 확인한 `reason`을 필수로 작성한다.

```json
[
  {
    "operation": "GET /example/v1/items",
    "path": "response",
    "kind": "type-mismatch",
    "reason": "SDK는 단일 응답을 목록으로 정규화한다."
  }
]
```

## 포털 변경 대응 절차

1. 월요일 00:00 UTC의 **API Monitor** 실행 요약과 `specs/auto-update` → `main` PR을 확인한다. PR 생성·갱신에 실패하면 `api-change` 이슈에서 보고서와 비교 링크를 확인한다. 공지 목록은 [넥슨 포털 공지](https://openapi.nexon.com/ko/support/notice/) 페이지가 사용하는 공개 JSON으로 수집한다.
2. PR 본문의 `specs:diff` 결과를 심각도별로 읽는다. 로컬에서 재검토할 때는 `yarn specs:diff --base origin/main`을 실행한다.
3. 스펙 갱신 커밋이 있는 브랜치에서 `yarn specs:drift --game <slug>`로 SDK 반영 대상을 확인한다. `yarn specs:coverage`로 누락된 엔드포인트를 점검한다. `--strict`는 로컬 점검에 쓸 수 있다.
4. SDK Auto Update가 제안한 MINOR와 DEPRECATE 수정을 검토한다. MAJOR와 새 게임의 공용 진입점 변경은 직접 판단하고 수정한다.
5. `CHANGELOG.md`와 [SEMVER.md](../SEMVER.md)에 따른 버전을 검토하고 사람이 머지한다.

### 워크플로 운영

- Settings → Actions → General → Workflow permissions에서 **Allow GitHub Actions to create and approve pull requests**를 켠다. 모니터는 스펙 커밋에서 type-check, test, drift를 직접 실행해 결과를 PR에 기록한다. 봇이 만든 PR의 이벤트 기반 CI는 사람의 실행 승인이 필요할 수 있다. [GitHub 토큰의 워크플로 트리거 규칙](https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs)
- Claude 구독 토큰은 `claude setup-token`으로 만들고 `gh secret set CLAUDE_CODE_OAUTH_TOKEN`에 입력한다. API 키를 사용할 때는 `gh secret set ANTHROPIC_API_KEY`에 입력한다. 둘 다 있으면 OAuth 토큰을 사용한다. 시크릿이 없으면 스펙 PR에 건너뛴 이유를 남긴다.
- repository variable `SDK_AUTO_IMPLEMENT=false`로 SDK 자동 수정을 끈다. `CLAUDE_MODEL`과 `CLAUDE_MAX_TURNS`로 기본값 `claude-sonnet-5-5`, `80`을 바꿀 수 있다. 열린 스펙 PR의 번호로 **SDK Auto Update**를 수동 실행해 재시도한다.
- Claude는 포털 콘텐츠를 데이터로 읽고, 쓰기 권한이 없는 검증 job에서 지정 경로와 명령만 사용한다. 게시 job은 별도 runner에서 허용 경로의 패치만 커밋한다. 통과한 경우 `ci.yml`을 명시적으로 실행한 뒤 PR에 결과를 남긴다. 실패하거나 MAJOR가 남으면 PR에서 사람이 처리한다. 자동 머지와 배포는 하지 않는다.
- 모니터는 실행이 끝날 때 REST API로 자기 워크플로를 활성화한다. 이미 비활성화된 경우 Actions에서 먼저 **Enable workflow**를 선택한다. GitHub는 active 상태에서 호출할 때 60일 타이머 갱신을 공식 보장하지 않는다. [GitHub schedule 및 비활성화 규칙](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- 검증할 때는 오래된 포털 스냅샷을 가진 테스트 브랜치에서 **API Monitor**의 `dry_run`을 선택한다. 실행 요약의 diff, 공지와 검증 결과를 확인한 뒤 `main`에 통합하고 실제 수동 실행으로 PR, SDK 코멘트와 `ci.yml` 실행을 확인한다. 모니터가 새 스냅샷을 감지하면 롤링 브랜치를 갱신하므로 검토자가 작업한 별도 수정은 별도 브랜치에서 관리한다.

## 구현할 때 스펙 읽는 법

1. `specs/openapi/index.json`에서 게임 → 카테고리 → 오퍼레이션 목록을 찾는다.
2. 해당 `specs/openapi/{slug}/{categoryId}.yaml`의 `paths`(파라미터)와 `components.schemas`(응답 필드)를 읽는다.
3. YAML은 들여쓰기가 파일마다 다르다(2칸/4칸 혼재). 정규식이 아니라 YAML 파서로 읽는다.

알아 둘 한계:

- YAML에는 필드 단위 `example`만 드문드문 있고 완성된 예시 응답 JSON은 없다. fixture는 스키마에서 합성해야 한다.
- 스펙과 실제 응답이 다를 수 있다. 실응답 검증에는 게임별 API 키가 필요하다.
- 정적 메타데이터(`/static/{slug}/meta/...`)는 키 없이 실데이터가 내려온다.

## 커버리지 표의 한계

`yarn specs:coverage`는 소스를 정규식으로 훑는 휴리스틱이다. 한계는 실행할 때마다 출력 끝의 "한계" 절에 나온다. 요약하면:

- 리터럴 URL, `buildUrl('리터럴')`, `BASE`류 상수, `endpoints.ts` 객체만 인식한다.
- "구현"은 경로가 소스에 있다는 뜻이지 타입이 스펙과 맞는다는 뜻이 아니다.
- HTTP 메서드, 호스트, 경로 변수 이름은 매칭에 쓰지 않는다.

## 이전 방식에서 바뀐 것

- `specs/maplestory-sea.md`(포털 화면을 손으로 복사한 10,444줄)는 삭제했다. 같은 내용의 원본이
  `specs/openapi/maplestorysea/45.yaml`(캐릭터), `46.yaml`(유니온), `47.yaml`(길드)에 있다.
  예전 파일이 필요하면 `git show v0.1.1:specs/maplestory-sea.md`로 볼 수 있다.
- `specs/_template.md`는 API 스펙을 옮겨 적는 양식에서, 스펙에 없는 구현 결정만 적는 노트 양식으로 바뀌었다.
- `scripts/api-monitor.ts`와 `scripts/api-snapshot.json`은 `yarn specs:check`와 `specs/openapi/index.json`으로 대체했다.
