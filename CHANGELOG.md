# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See [SEMVER.md](SEMVER.md) for versioning rules specific to this API wrapper SDK.

엔드포인트 개수는 "SDK public API 메서드 수"(메서드 1개 = 넥슨 API 경로 1개) 기준입니다.

## [Unreleased]

## [0.2.0] - 2026-11-24

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
- 모든 게임 sub-path 진입점(`nexon-open-api/{sub-path}`)이 `HttpClient` 와 `HttpClientConfig` 타입을 내보낸다. sub-path만 import해도 `new MapleStoryClient(new HttpClient({ apiKey }))` 처럼 게임 클라이언트를 만들 수 있으며, 루트의 `HttpClient` 와 같은 클래스다 (CJS·ESM 모두)
- `yarn test:live` — API 키 없이 실제 넥슨 서버로 확인한다
  - 공개 정적 메타데이터 44개: 실응답과 SDK 타입을 중첩 필드까지 대조
  - FC 이미지 CDN
  - 15개 게임의 인증 오류 처리
  - 2026-11-24 결과: 44/44 통과, 타입 불일치 0건
- `yarn test:package` — npm tarball을 오프라인 설치해 CJS·ESM 실호출과 TypeScript(Node16·Bundler) 타입 해석을 확인
- `NexonMaintenanceError` — 게임 점검 중(`OPENAPI00010`)과 넥슨 Open API 점검 중(`OPENAPI00011`)을 알린다. `NexonServerError` 를 상속하므로 기존 처리도 그대로 동작하고, 봇에서는 "점검 중" 안내를 따로 보여 줄 수 있다
- `NEXON_ERROR_CODES` 에 포털 응답코드 표의 의미를 따른 키: `INVALID_API_KEY`(00005), `INVALID_GAME_OR_PATH`(00006), `GAME_MAINTENANCE`(00010), `API_MAINTENANCE`(00011)
- 모든 에러 클래스가 넥슨 서버의 원문 메시지를 `nexonMessage` 로 담는다 (이전에는 `NexonBadRequestError` 와 분류되지 않은 응답만)
- 창작자용 문서
  - `docs/getting-started.md`: 설치, API 키 발급, `.env`, 첫 실행, 디스코드 봇 형태, CommonJS·TypeScript
  - `docs/faq.md`: "캐릭터를 못 찾아요", "오늘 데이터가 안 나와요", "점검 중이래요" 같은 상황별 증상 → 원인 → 해결
  - `CONTRIBUTING.md`: 개발 환경, 스펙 기반 개발, 포털 변경 자동 대응, CI, 릴리즈, 문서·주석 작성 원칙
- `examples/` — 창작 시나리오 예제 10개
  - 디스코드 봇 `!정보 캐릭터명` 카드, 메이플 랭킹 TOP 10, FC 온라인 최근 공식경기 전적
  - 마비노기 경매장 시세와 거대한 외침의 뿔피리
  - 키 없이 실행하는 설치 확인과 퍼스트 디센던트 계승자 도감
  - 봇 에러 안내, CommonJS, TypeScript
- `yarn examples:check` — 빌드된 패키지로 예제를 타입 검사한다 (CI Examples 게이트, SDK 자동 반영 게이트)
- `yarn test:deep` — 실 API E2E를 돌리며 호출된 모든 public 메서드의 반환값을 SDK 응답 타입과 중첩 필드까지 대조한다 (`scripts/lib/deep-check.ts`). 예상하지 못한 `null`, 타입에 없는 필드, 응답에 없는 필수 필드, 타입 차이를 메서드·경로별로 출력한다 (`.env` 의 게임별 키 필요)
- **실 API 키 검증 (2026-11-24, 게임별 개발 단계 키)** — 직업·레벨·월드가 다른 공개 캐릭터 42명(게임별 2~6명)으로 HTTP 메서드 263/267개를 불러 응답을 SDK 타입과 대조했다. 처음 600종이 넘던 차이를 아래 Fixed·Changed 항목으로 정정해 0건이 됐다. 부르지 못한 메서드는 다음과 같다
  - FC `getTradeList`: 키 계정 본인의 거래 기록만 나온다
  - 메이플스토리 `getLegacyOuid`: 구 개발자센터 키가 필요하다
  - FC `getAllMatchList`: 제공이 종료됐다
  - FC `getSeasonIdMeta`: 정적 파일은 `test:live` 로 확인했다
- 실제 응답에만 있는 필드를 선택 필드로 추가했다 (포털 스펙에 없음, 근거는 `specs/drift-baseline.json`)
  - 메이플스토리: 칭호 프리셋 `title_preset1~3`, 프리셋 장비의 `potential_option_flag`·`additional_potential_option_flag`, 공지 `thumbnail_url`
  - 서든어택 매치 상세 `guild_name` 등

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
- `toNexonDate()` 가 유효하지 않은 `Date` 객체를 `NaN-NaN-NaN` 으로, 달력에 없는 날짜(예: `2026-02-30`)를 그대로 넘기던 문제 — 이제 `NexonBadRequestError`(`OPENAPI00004`)로 거부한다. MapleStory Taiwan 날짜 조회도 이 공용 검증을 사용한다
- SDK 자동 반영 워크플로에서 Claude Code가 시작 직후 종료되던 문제 (MCP 설정 형식, 샌드박스 거부 규칙) — 2026-11-24 실제 실행으로 검증
- 에러 코드 해석을 넥슨 포털 [응답코드 표](https://openapi.nexon.com/ko/guide/request-api/)에 맞췄다 (2026-11-24 확인)
  - **동작 변경** `OPENAPI00010` 은 "데이터 준비 중"이 아니라 "게임 점검 중"이다. 이제 `NexonDataNotReadyError` 대신 `NexonMaintenanceError` 로 알린다. `NexonDataNotReadyError` 는 `OPENAPI00009`(데이터 준비 중)만 받는다
  - `OPENAPI00011` 은 "서버 과부하"가 아니라 "API 점검 중"으로 안내한다 (`NexonMaintenanceError`, 계속 `NexonServerError` 이기도 하다)
  - 코드별 안내 문구를 포털 의미에 맞게 고쳤다: 00002 이 키로 쓸 수 없는 API, 00005 잘못된 키, 00006 게임·API 주소 오류
  - "익일 오전 1시" 안내를 스펙 문구로 정정했다: 메이플스토리 지난 날짜 데이터는 다음날 오전 2시, 오늘의 랭킹은 오전 9시 30분경부터
- 메이플스토리·SEA·TW `date` 설명 정정 — 생략하면 전일이 아니라 가장 최근 데이터(평균 15분 뒤 반영)를 조회한다 (포털 스펙)
- `nexon-open-api/maplestory-m` sub-path가 응답 타입 일부(4개)만 내보내던 문제 — 루트와 같은 M 타입 84개를 내보낸다
- JSDoc 예제 오류: 메이플스토리 클래스 예제의 없는 메서드 `union.get`(→ `union.getUnion`), 필수 인자가 빠진 `ranking.getGuild`·`getDojang` 예제, 조회 범위를 벗어난 예제 날짜
- **동작 변경** 없는 이름 조회가 `NexonNotFoundError` 로 알려진다. 대상은 14개 게임의 `getOcid`·`getOuid`·`getOuidInfo` 와 메이플 4종의 `guild.getId` 다
  - 넥슨은 없는 캐릭터·계정·길드 이름에 `OPENAPI00003` 이 아니라 `OPENAPI00004`(파라미터 오류)를 돌려준다 (14개 게임 실측). 그래서 문서대로 `instanceof NexonNotFoundError` 로 "캐릭터를 찾을 수 없어요"를 안내하는 코드가 동작하지 않았다
  - 이제 이름 조회에서 온 `OPENAPI00004` 를 `NexonNotFoundError` 로 바꾸고, 메시지로 무엇을 확인할지 안내한다. `code`·`nexonMessage` 는 넥슨 값 그대로다
- 메이플스토리·SEA·TW `guild.getId()` 가 없는 길드에 `null` 을 길드 번호처럼 돌려주던 버그를 고쳤다. 넥슨이 200과 `oguild_id: null` 을 준다. 이제 `NexonNotFoundError` 를 던진다. 메이플스토리는 빈 길드명·월드명도 요청 전에 검증한다
- 마비노기 영웅전 `ranking.getHallOfHonor()`·`getRealTime()` 이 배열 대신 응답 객체를 돌려줘 `list[0]`, `list.length` 가 비던 버그를 고쳤다. 실제 응답은 `{ ranking: [...] }` 이다. 선언대로 배열을 돌려준다
- 퍼스트 디센던트 리더보드: 서버가 거부하는 요청(400)을 요청 전에 알린다
  - 솔로(`leaderboard_type: 'Solo'`)에 `descendant_id` 가 없거나, 스쿼드에 `squad_user_count` 가 없으면 넥슨이 400을 돌려준다
  - 이제 요청 타입에서 둘을 필수로 받고, SDK가 `NexonBadRequestError` 로 먼저 알린다
- 응답 타입의 `null` 허용 누락 500여 곳을 실측에 맞춰 넓혔다 (장착하지 않은 펫 장비, 날짜를 생략한 최신 조회의 `date`, 세트 효과가 없는 프리셋 등)
- 실제 응답과 이름이 다른 필드에 실제 이름을 선택 필드로 추가했다. 포털 이름도 선택 필드로 남겨 두었다
  - 메이플스토리·SEA·TW 장비: 업그레이드 가능 횟수 `scroll_upgradable_count` → 실제 `scroll_upgradeable_count`, 프리셋 장착 슬롯 `equipment_slot` → 실제 `item_equipment_slot`
  - 메이플스토리M: `use_preset_no` → `use_prest_no`, 길드 `world_create_date` → `guild_create_date`, 안드로이드 캐시 아이템 `android_item_gender` → `cash_item_gender`
  - FC 온라인 매치 상세·랭커 통계: `OffsideCount` → `offsideCount`, `ballPossesionSuc` → `ballPossesionSuccess`, `assistSpI` → `assistSpId`, `spId` → `spid`
  - TW 펫 잠재능력: `potential_increase_1/2` → `potential_increase1/2`
  - 마비노기 영웅전 골드 거래소 TOP 30: `total_buy_gold`·`total_sell_gold` → `buy_gold`·`sell_gold`
  - 히트2: `character_last_login`·`character_last_logout` → `character_date_last_login`·`character_date_last_logout`
- 메이플스토리 연무장 `getCharacterInfo()`: 리플레이 스냅숏에 없는 필드를 선택 필드로 바꿨다 (소울, 월드 공유 펫, 유니온 상태 스탯 등). 스킬 효과 `null` 은 새 `BattlePracticeSkillInfo` 로 따로 표현한다
- 실 API E2E 스크립트
  - 메이플스토리 강화 기록·랭킹이 최근 2년 밖인 고정 날짜를 쓰던 문제
  - 스케줄러를 다른 계정 캐릭터로 부르던 문제 (키 계정 본인 캐릭터만 조회됨)
  - FC 선수 이미지 URL 검사가 엉뚱한 번호를 찾던 문제
- `.env` 에서 `#` 뒤가 주석으로 잘려 퍼스트 디센던트 닉네임(`닉네임#1234`)이 깨지던 문제 — `.env.example` 과 문서에 큰따옴표로 감싸라는 안내를 추가했다

### Changed

- **BREAKING** FC 온라인 `getMaxDivision()` 반환 타입 `FcMaxDivision` → `readonly FcMaxDivision[]`. 역대 최고 등급은 매치 종류별로 존재하며, 응답이 단일 객체여도 배열로 정규화한다
- **BREAKING** 실제 응답과 타입이 달랐던 필드를 실제 타입으로 바꿨다 (2026-11-24 실측)
  - 메이플스토리 `CharacterPetEquipment.world_share_pet_equipment_preset`: 객체 → 배열
  - 메이플스토리M: `MCashItemEquipmentItem.cash_item_gender` 숫자 → 문자열. `MEmblemInfo.emblem_level`, `MLinkSkillInfo.skill_level`, `MEquipmentSkill.equipment_skill_set`, 지하 수로 랭킹 `season_score` 는 문자열 → 숫자
  - 마비노기 영웅전: 인챈트 `enchant_grade` 숫자 → 문자열, 장착 장비의 `power_infusion_preset_1/2` 배열 → `{ stat_name, stat_value } | null`
  - 서든어택 `solo_rank_match_tier`·`party_rank_match_tier`: 숫자 → 문자열
  - 카트라이더 러쉬플러스 `ouid_info[].racer_level`: 문자열 → 숫자
  - 메이플스토리·SEA·TW 장비의 `scroll_upgradable_count`, 프리셋의 `equipment_slot`: 필수 → 선택 (실제 이름은 Fixed 참고)
  - 퍼스트 디센던트 리더보드 요청: 솔로는 `descendant_id`, 스쿼드는 `squad_user_count` 가 필수
- SDK 입력 검증 실패를 모든 게임에서 `NexonBadRequestError`(code `OPENAPI00004`, status 400)로 통일했다. 오류 메시지는 유효한 값이나 조회 방법을 안내한다. 이전에 `toNexonDate()` 가 파싱할 수 없는 날짜 문자열에 던지던 `Error` 도 이 에러로 바뀐다. `NexonBadRequestError` 는 `Error` 의 하위 클래스이므로 `catch (e)` / `instanceof Error` 처리는 그대로 동작한다
- 런타임 응답 shape 검증(`responseValidation`)이 최상위 배열 응답에도 적용된다 (`arrayOf()` 사용, 서든어택·마비노기 영웅전·퍼스트 디센던트 메타데이터 등 37개)
- CI에 `specs:drift --strict` 게이트 추가 — SDK 타입이 커밋된 포털 스펙에서 벗어나면 실패 (nullable 넓힘과 `@deprecated` 유지는 허용)
- 에러 클래스 JSDoc과 문서의 HTTP 상태 설명을 실제 동작에 맞췄다 (동작 변경 없음). `NexonAuthError` 는 HTTP 상태가 아니라 에러 코드(`OPENAPI00002`, `OPENAPI00005`)로 분류하며, 실제 서버는 잘못된 API 키에 HTTP 400 + `OPENAPI00005` 를 돌려준다
- `apiKey` 가 없거나 공백뿐이면 `NexonClient` 와 `HttpClient` 생성 시 `NexonBadRequestError`(`OPENAPI00004`)를 던지고 `.env` 설정 방법을 안내한다. 이전에는 `NexonClient` 만 일반 `Error` 를 던졌고 공백 키는 서버까지 갔다. `Error` 의 하위 클래스이므로 기존 `catch` 는 그대로 동작한다
- 문서와 주석을 게임을 잘 아는 창작자(팬사이트·디스코드 봇·전적 검색기) 기준으로 다시 썼다
  - README: 무엇을 만들 수 있나요, 시작하기 3단계, 이름 → 고유 번호 → 정보, 상황별 에러 표와 봇 응답 예제, API 키 보안. 관리자용 내용은 `CONTRIBUTING.md` 로 옮겼다. 동작하지 않던 codecov 배지를 제거했다
  - 15개 게임 문서를 "게임 용어 ↔ SDK 대응표" 중심으로 재구성했다 (예: 유니온 공격대 배치 → `union.getRaider()`, 선수 카드 → `spid`)
  - 공개 메서드와 주요 응답 필드의 JSDoc을 게임 용어로 다듬었다. 코드값에는 게임 속 의미를 붙였다 (동작 변경 없음)
- npm 패키지 `description` 과 `keywords` 를 지원 범위(14개 게임 + Open API 공지)에 맞게 갱신

- CI: GitHub Actions 메이저 버전 갱신(Node 24 런타임), 테스트 매트릭스 Node 22/24/26 (`engines` 는 `>=18` 유지), npm Trusted Publishing(OIDC·provenance) 준비
- `yarn type-check` 가 `tests`, `scripts` 까지, `yarn lint` 가 `scripts` 까지 검사
- 문서(CLAUDE.md, README, docs, CHANGELOG)의 게임 목록·path prefix·엔드포인트 수를 실제와 일치시킴 — 크레이지 아케이드 제거(포털에서 삭제됨), `platform` 추가, 던전앤파이터·사이퍼즈는 네오플 API라 범위 외로 표기

### Deprecated

- FC 온라인 `getAllMatchList()` — 넥슨이 2026-07-07 `/fconline/v1/match` 제공을 종료했다. 개별 계정 기록은 `getMatchList()` 를 사용한다
- FC 온라인 `getSeasonIdMeta()` — 넥슨이 2026-11-19 이후 제공 종료를 공지했다. 선수 클래스는 `getClassMeta()`, 공식경기 시즌은 `getSeasonMeta()` 를 사용한다
- 메이플스토리 `ranking.getGuild({ ocid })` 의 `ocid` — 포털 스펙에서 제거됐다. 입력해도 서버로 보내지 않고 한 번 경고한다. 특정 길드는 `guild_name` 으로 조회한다
- 메이플스토리 `character.getRingExchangeSkillEquipment()` — 포털 안내에 따라 2025-08-21 ~ 2026-03-18 데이터만 제공된다. 이후 날짜는 `character.getRingReserveSkillEquipment()`(예비 특수 반지)를 사용한다 (JSDoc 표시만, 런타임 경고 없음)
- `NEXON_ERROR_CODES` 의 이름이 포털 의미와 다른 키 — 값은 그대로라 기존 비교는 계속 동작한다
  - `FORBIDDEN` → `INVALID_API_KEY`
  - `INVALID_PARAM` → `INVALID_GAME_OR_PATH`
  - `DATA_PREPARING` → `GAME_MAINTENANCE`
  - `SERVER_OVERLOAD` → `API_MAINTENANCE`
  - `MAINTENANCE`(`OPENAPI00008`, 포털 표에 없는 코드)
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

[Unreleased]: https://github.com/Kimhasa/nexon-open-api-sdk/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Kimhasa/nexon-open-api-sdk/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/Kimhasa/nexon-open-api-sdk/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Kimhasa/nexon-open-api-sdk/releases/tag/v0.1.0
