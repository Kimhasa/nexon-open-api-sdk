# NEXON Open API 실행 예제

디스코드 봇의 캐릭터 카드, 팬사이트 랭킹, 경매장 시세 조회 등 필요한 예제를 선택해 실행해 주세요.

## 저장소에서 실행하기

Node.js 24를 기준으로 안내합니다. 저장소 루트에서 의존성을 설치하고 빌드하면 API Key 없이 EA SPORTS FC 온라인 매치 종류를 조회해 설치를 확인할 수 있습니다.

```bash
corepack yarn install && corepack yarn build
node examples/00-check-install.mjs
```

API Key가 필요한 예제는 [NEXON Open API](https://openapi.nexon.com/)에서 해당 게임의 API Key를 발급받아 저장소 루트의 `.env`에 표의 환경 변수 이름으로 설정합니다. 예를 들어 메이플스토리 API Key는 `NEXON_MAPLESTORY_API_KEY=발급받은_키`로 설정합니다. `.env`는 서버나 개인 작업 환경에서 관리하고 Git에 올리지 않도록 관리해 주세요.

`.env`를 만들기 전에는 `--env-file-if-exists=.env`로 실행하면 예제가 필요한 환경 변수 이름을 출력합니다.

## 내 프로젝트에서 실행하기

사용할 예제 파일을 프로젝트 루트에 복사하고 패키지를 설치합니다. API Key가 필요한 경우 프로젝트의 `.env`에 해당 환경 변수를 설정합니다.

```bash
npm install nexon-open-api
node --env-file=.env maplestory-character-card.mjs "캐릭터명"
```

아래 명령에서 `examples/`를 제외하고 실행합니다. `.mjs`는 ES 모듈로 최상위 `await`를 사용할 수 있으며, `.cjs`는 CommonJS의 `require`를 사용합니다. 복사한 `typescript.ts`는 Node.js 24에서 프로젝트 `package.json`에 `"type": "module"`을 설정하거나 파일 확장자를 `.mts`로 바꿔 실행해 주세요.

## 예제 선택하기

| 예제                                                              | 예제 설명                                                                                                                 | 필요한 환경 변수           | 저장소에서 실행                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| [설치 확인](./00-check-install.mjs)                               | 공식경기와 공식 친선 등 EA SPORTS FC 온라인 매치 종류 목록                                                                | 없음                       | `node examples/00-check-install.mjs`                                        |
| [메이플스토리 캐릭터 카드](./maplestory-character-card.mjs)       | 디스코드 봇의 `!정보 캐릭터명` 응답에 레벨, 직업, 월드, 길드, 전투력, 유니온 레벨 표시                                    | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-character-card.mjs "캐릭터명"`    |
| [메이플스토리 랭킹 TOP 10](./maplestory-ranking-top10.mjs)        | 한국 시간으로 어제의 종합 랭킹 1~10위. 명령 끝에 날짜를 넣으면 그날의 순위 조회                                           | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-ranking-top10.mjs`                |
| [메이플스토리 장비 옵션 합계](./maplestory-equipment-summary.mjs) | 환산 계산기·스펙 비교 도구의 재료인 스타포스 합계, 장비 옵션 합계, 잠재능력·에디셔널 잠재능력 합계                        | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-equipment-summary.mjs "캐릭터명"` |
| [메이플스토리 코디 카드](./maplestory-coordi-card.mjs)            | 동작·표정을 바꾼 캐릭터 외형 이미지 주소와 캐시 장비, 헤어·성형·피부, 안드로이드                                          | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-coordi-card.mjs "캐릭터명"`       |
| [EA SPORTS FC 온라인 전적](./fconline-recent-matches.mjs)         | 닉네임으로 최근 공식경기 5판의 승·무·패와 스코어 요약                                                                     | `NEXON_FC_ONLINE_API_KEY`  | `node --env-file=.env examples/fconline-recent-matches.mjs "닉네임"`        |
| [마비노기 경매장 시세](./mabinogi-auction-price.mjs)              | 판매 중인 매물 최대 3페이지에서 개당 최저가와 매물별 평균가 집계                                                          | `NEXON_MABINOGI_API_KEY`   | `node --env-file=.env examples/mabinogi-auction-price.mjs "롱 소드"`        |
| [마비노기 뿔피리](./mabinogi-horn-bugle.mjs)                      | 서버별 거대한 외침의 뿔피리 메시지를 최근 1시간 내 최대 5개 표시                                                          | `NEXON_MABINOGI_API_KEY`   | `node --env-file=.env examples/mabinogi-horn-bugle.mjs "류트"`              |
| [퍼스트 디센던트 계승자 도감](./first-descendant-codex.mjs)       | 공개 계승자 이름을 가나다순으로 정리한 도감                                                                               | 없음                       | `node examples/first-descendant-codex.mjs`                                  |
| [봇의 오류 메시지](./error-handling.mjs)                          | 캐릭터를 찾을 수 없거나 정보가 준비 중일 때, 게임 점검 중일 때, API Key 오류나 호출량 초과가 발생했을 때 상황에 맞게 답변 | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/error-handling.mjs "캐릭터명"`               |
| [CommonJS](./commonjs.cjs)                                        | `require`를 쓰는 봇에서 캐릭터의 월드와 레벨 표시                                                                         | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/commonjs.cjs "캐릭터명"`                     |
| [TypeScript](./typescript.ts)                                     | 캐릭터 식별자(ocid)의 전용 타입(`OCID`)과 기본 정보 타입(`CharacterBasic`)을 활용한 프로필                                | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/typescript.ts "캐릭터명"`                    |

메이플스토리에서 방금 장비를 바꿨다면 전투력에 반영되기까지 평균 15분이 걸립니다. EA SPORTS FC 온라인의 매치 기록은 매시 정각에 두 시간 전 경기까지 갱신됩니다. 예제에 나온 필드 외에 추가할 수 있는 정보는 편집기 자동완성에서 확인할 수 있습니다.

장비 옵션 합계와 코디 카드 예제를 서비스에 활용할 때 필요한 호출량 계산과 캐시 설정은 [레시피](../docs/recipes/README.md)에서 확인할 수 있습니다.

이 문서의 API는 NEXON Open API 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
