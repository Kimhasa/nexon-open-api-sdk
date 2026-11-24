# specs/ — 넥슨 Open API 스펙 (API DB)

SDK 구현의 원천 자료다. 넥슨 포털이 카테고리마다 공개하는 **OpenAPI 3.0.3 YAML**을 그대로 받아 git으로 관리한다.
포털에서 손으로 복사해 붙이는 절차는 더 이상 쓰지 않는다.

npm 패키지에는 포함되지 않는다 (`package.json`의 `files`가 `dist`만 배포).

## 디렉터리 구조

```
specs/
├── README.md                      # 이 문서
├── _template.md                   # 게임별 구현 노트 템플릿 (선택)
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
| `yarn specs:check --report <path>` | Markdown 보고서 저장 위치 지정                                            |

로그인과 API 키는 필요 없다. 포털에는 요청을 순차로 보낸다 (전체 60여 건, 30초 안팎).

### 종료 코드

| 명령             | 0                           | 1                                                     |
| ---------------- | --------------------------- | ----------------------------------------------------- |
| `specs:fetch`    | 수집·저장 성공              | 네트워크·파싱 실패. **기존 파일은 건드리지 않는다**   |
| `specs:check`    | 수집 성공 (변경이 있어도 0) | 수집 실패 또는 기준 manifest 없음. 변경 감지가 아니다 |
| `specs:coverage` | 정상                        | manifest 없음, 잘못된 인자                            |

`specs:check`의 변경 여부는 표준 출력의 `changes_detected=true|false`와, GitHub Actions에서는 step output
(`changes_detected`, `changes_count`, `report_path`, `fingerprint`)으로 확인한다.

## 갱신 절차

포털이 바뀌면 `.github/workflows/api-monitor.yml`(매주 월요일)이 `api-change` 라벨 이슈를 만든다. 그때:

1. `yarn specs:fetch`
2. `git diff specs/openapi/`로 바뀐 스키마·파라미터를 읽는다.
3. `yarn specs:coverage`로 SDK에 빠진 엔드포인트를 확인한다.
4. `specs/openapi/` 변경분을 커밋한다. 이 커밋이 main에 들어가면 다음 `specs:check`부터 같은 차이가 나오지 않는다.
5. SDK 반영이 필요하면 별도 커밋으로 진행한다 (`SEMVER.md` 정책 참고).

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
