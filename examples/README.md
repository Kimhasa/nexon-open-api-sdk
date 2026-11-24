# 넥슨 Open API 창작 예제

디스코드 봇의 캐릭터 카드부터 팬사이트 랭킹, 경매장 장보기 도구까지 필요한 예제 파일 하나를 골라 실행해 보세요.

## 저장소에서 실행하기

Node.js 24를 기준으로 설명합니다. 저장소 루트에서 설치하고 빌드한 뒤, 키 없이 FC 온라인 매치 종류가 나오는지 확인할 수 있습니다.

```bash
corepack yarn install && corepack yarn build
node examples/00-check-install.mjs
```

키가 필요한 예제는 [넥슨 Open API](https://openapi.nexon.com/)에서 해당 게임의 키를 발급받고, 저장소 루트의 `.env`에 표의 변수명으로 넣어 주세요. 예를 들어 메이플스토리 키는 `NEXON_MAPLESTORY_API_KEY=발급받은_키`로 저장합니다. `.env`는 서버나 개인 작업 환경에 두고 Git에 올리지 마세요.

`.env`를 만들기 전에는 `--env-file-if-exists=.env`로 실행하면 예제가 필요한 키의 변수명을 안내합니다.

## 내 프로젝트에서 실행하기

쓰고 싶은 예제 파일을 프로젝트 루트로 복사하고 패키지를 설치합니다. 키가 필요한 경우 그 프로젝트의 `.env`에 같은 환경변수를 설정합니다.

```bash
npm install nexon-open-api
node --env-file=.env maplestory-character-card.mjs "캐릭터명"
```

아래 명령에서 `examples/`를 빼고 실행하면 됩니다. `.mjs`는 ESM이라 파일 맨 바깥에서 `await`를 쓸 수 있고, `.cjs`는 CommonJS의 `require`를 사용합니다. 복사한 `typescript.ts`는 Node.js 24에서 프로젝트 `package.json`에 `"type": "module"`을 설정하거나 파일 확장자를 `.mts`로 바꿔 실행하세요.

## 예제 고르기

| 예제                                                              | 만드는 것                                                                                                        | 필요한 키                  | 저장소에서 실행                                                             |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| [설치 확인](./00-check-install.mjs)                               | 공식경기와 공식 친선 등 FC 온라인 매치 종류 목록                                                                 | 없음                       | `node examples/00-check-install.mjs`                                        |
| [메이플스토리 캐릭터 카드](./maplestory-character-card.mjs)       | 디스코드 봇의 `!정보 캐릭터명` 응답에 레벨, 직업, 월드, 길드, 전투력, 유니온 레벨 표시                           | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-character-card.mjs "캐릭터명"`    |
| [메이플스토리 랭킹 TOP 10](./maplestory-ranking-top10.mjs)        | 한국 시간으로 어제의 종합 랭킹 1~10위. 명령 끝에 날짜를 넣으면 그날의 순위 조회                                  | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-ranking-top10.mjs`                |
| [메이플스토리 장비 옵션 합계](./maplestory-equipment-summary.mjs) | 환산 계산기·스펙 비교 도구의 재료인 스타포스 합계, 장비 옵션 합계, 잠재능력·에디셔널 잠재능력 합계               | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-equipment-summary.mjs "캐릭터명"` |
| [메이플스토리 코디 카드](./maplestory-coordi-card.mjs)            | 동작·표정을 바꾼 캐릭터 외형 이미지 주소와 캐시 장비, 헤어·성형·피부, 안드로이드                                 | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/maplestory-coordi-card.mjs "캐릭터명"`       |
| [FC 온라인 전적](./fconline-recent-matches.mjs)                   | 닉네임으로 최근 공식경기 5판의 승·무·패와 스코어 요약                                                            | `NEXON_FC_ONLINE_API_KEY`  | `node --env-file=.env examples/fconline-recent-matches.mjs "닉네임"`        |
| [마비노기 경매장 시세](./mabinogi-auction-price.mjs)              | 판매 중인 매물 최대 3페이지에서 개당 최저가와 매물별 평균가 집계                                                 | `NEXON_MABINOGI_API_KEY`   | `node --env-file=.env examples/mabinogi-auction-price.mjs "롱 소드"`        |
| [마비노기 뿔피리](./mabinogi-horn-bugle.mjs)                      | 서버별 거대한 외침의 뿔피리 메시지를 최근 1시간 내 최대 5개 표시                                                 | `NEXON_MABINOGI_API_KEY`   | `node --env-file=.env examples/mabinogi-horn-bugle.mjs "류트"`              |
| [퍼스트 디센던트 계승자 도감](./first-descendant-codex.mjs)       | 공개 계승자 이름을 가나다순으로 정리한 도감                                                                      | 없음                       | `node examples/first-descendant-codex.mjs`                                  |
| [봇의 오류 메시지](./error-handling.mjs)                          | 캐릭터를 찾을 수 없거나 정보가 준비 중일 때, 게임 점검 중일 때, 키 오류나 호출 한도가 걸렸을 때 상황에 맞게 답변 | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/error-handling.mjs "캐릭터명"`               |
| [CommonJS](./commonjs.cjs)                                        | `require`를 쓰는 봇에서 캐릭터의 월드와 레벨 표시                                                                | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/commonjs.cjs "캐릭터명"`                     |
| [TypeScript](./typescript.ts)                                     | 캐릭터 고유 번호(`OCID`)와 기본 정보 타입(`CharacterBasic`)을 활용한 프로필                                      | `NEXON_MAPLESTORY_API_KEY` | `node --env-file=.env examples/typescript.ts "캐릭터명"`                    |

메이플스토리에서 방금 장비를 바꿨다면 전투력에 반영되기까지 평균 15분이 걸립니다. FC 온라인의 매치 기록은 매시 정각에 두 시간 전 경기까지 갱신됩니다. 예제에 나온 필드 외에 추가할 수 있는 정보는 에디터 자동완성에서 확인할 수 있습니다.

장비 옵션 합계와 코디 카드를 앱으로 키우는 방법(호출 수 세기, 캐시)은 [레시피](../docs/recipes/README.md)에 있습니다.

이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
