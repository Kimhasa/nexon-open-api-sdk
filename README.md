# nexon-open-api

> Type-safe Nexon Open API SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/nexon-open-api.svg)](https://www.npmjs.com/package/nexon-open-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

[Nexon Open API](https://openapi.nexon.com/) 전체 게임을 TypeScript로 감싼 SDK입니다. 외부 의존성 없이 네이티브 `fetch`만 사용하며, CJS/ESM 듀얼 출력을 지원합니다.

## 지원 게임

| 게임 | Client | 상태 | 엔드포인트 |
|------|--------|------|-----------|
| 메이플스토리 (KMS) | `client.maplestory` | **구현 완료** | 45개 |
| 메이플스토리M | `client.maplestoryM` | 예정 | - |
| MapleStory SEA | `client.maplestorySEA` | 예정 | - |
| MapleStory Taiwan | `client.maplestoryTW` | 예정 | - |
| EA SPORTS FC 온라인 | `client.fcOnline` | 예정 | - |
| 던전앤파이터 | `client.dnf` | 예정 | - |
| 마비노기 | `client.mabinogi` | 예정 | - |
| 마비노기 영웅전 | `client.mabinogiHeroes` | 예정 | - |
| 서든어택 | `client.suddenAttack` | 예정 | - |
| 퍼스트 디센던트 | `client.firstDescendant` | 예정 | - |
| 카트라이더 러쉬플러스 | `client.kartrider` | 예정 | - |
| 바람의나라 | `client.baram` | 예정 | - |
| 바람의나라: 연 | `client.baramYeon` | 예정 | - |
| 히트2 | `client.hit2` | 예정 | - |
| 크레이지 아케이드 | `client.crazyArcade` | 예정 | - |
| V4 | `client.v4` | 예정 | - |
| 사이퍼즈 | `client.cyphers` | 예정 | - |

## 주요 특징

- **Type-safe** — 모든 API 응답에 대한 완전한 TypeScript 타입 정의
- **Branded Types** — `OCID`, `GuildId`, `NexonDate` 브랜드 타입으로 컴파일 타임 안전성
- **자동 재시도** — 429 (Rate Limit) / 503 응답 시 지수 백오프 자동 재시도
- **에러 분류** — `NexonRateLimitError`, `NexonAuthError` 등 `instanceof`로 에러 분기
- **외부 의존성 0** — Node.js 18+ 네이티브 `fetch` 사용
- **멀티 게임** — 하나의 `NexonClient`로 모든 게임 접근

## 설치

```bash
npm install nexon-open-api
# or
yarn add nexon-open-api
# or
pnpm add nexon-open-api
```

## 빠른 시작

```ts
import { NexonClient } from 'nexon-open-api';

const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });

// OCID 조회
const ocid = await client.maplestory.getOcid('캐릭터명');

// 캐릭터 기본 정보
const basic = await client.maplestory.character.getBasic({ ocid });
console.log(`${basic.character_name} Lv.${basic.character_level}`);
```

> API 키는 [Nexon Open API 포털](https://openapi.nexon.com/)에서 발급받을 수 있습니다.

## API 목록

### 캐릭터 (22개)

```ts
const char = client.maplestory.character;

await char.getList();                          // 계정 캐릭터 목록
await char.getBasic({ ocid });                 // 기본 정보
await char.getPopularity({ ocid });            // 인기도
await char.getStat({ ocid });                  // 종합 능력치
await char.getHyperStat({ ocid });             // 하이퍼스탯
await char.getPropensity({ ocid });            // 성향
await char.getAbility({ ocid });               // 어빌리티
await char.getItemEquipment({ ocid });         // 장착 장비
await char.getCashItemEquipment({ ocid });     // 캐시 장비
await char.getSymbolEquipment({ ocid });       // 심볼
await char.getSetEffect({ ocid });             // 세트 효과
await char.getBeautyEquipment({ ocid });       // 헤어/성형/피부
await char.getAndroidEquipment({ ocid });      // 안드로이드
await char.getPetEquipment({ ocid });          // 펫 장비
await char.getSkill({ ocid, character_skill_grade: '6' }); // 스킬
await char.getLinkSkill({ ocid });             // 링크 스킬
await char.getVMatrix({ ocid });               // V매트릭스
await char.getHexaMatrix({ ocid });            // HEXA 매트릭스
await char.getHexaMatrixStat({ ocid });        // HEXA 스탯
await char.getDojang({ ocid });                // 무릉도장
await char.getOtherStat({ ocid });             // 기타 능력치
await char.getRingExchangeSkillEquipment({ ocid }); // 링 익스체인지
```

### 유니온 (4개)

```ts
const union = client.maplestory.union;

await union.getUnion({ ocid });      // 유니온 레벨/등급
await union.getRaider({ ocid });     // 공격대원 효과
await union.getArtifact({ ocid });   // 아티팩트
await union.getChampion({ ocid });   // 챔피언
```

### 길드 (2개)

```ts
const guild = client.maplestory.guild;

const guildId = await guild.getId('길드명', '스카니아');
await guild.getBasic({ oguild_id: guildId });
```

### 랭킹 (6개)

```ts
const ranking = client.maplestory.ranking;

await ranking.getOverall({ date: '2024-01-01' });     // 종합 랭킹
await ranking.getUnion({ date: '2024-01-01' });        // 유니온 랭킹
await ranking.getGuild({ date: '2024-01-01' });        // 길드 랭킹
await ranking.getDojang({ date: '2024-01-01' });       // 무릉도장 랭킹
await ranking.getTheSeed({ date: '2024-01-01' });      // 더 시드 랭킹
await ranking.getAchievement({ date: '2024-01-01' });  // 업적 랭킹
```

### 확률/이력 (3개)

```ts
const history = client.maplestory.history;

await history.getStarforce({ count: 100, date: '2024-01-01' });  // 스타포스
await history.getPotential({ count: 100, date: '2024-01-01' });  // 잠재능력
await history.getCube({ count: 100, date: '2024-01-01' });       // 큐브
```

### 공지사항 (8개)

```ts
const notice = client.maplestory.notice;

await notice.getList();              // 공지 목록
await notice.getDetail(12345);       // 공지 상세
await notice.getUpdateList();        // 업데이트 목록
await notice.getUpdateDetail(12345); // 업데이트 상세
await notice.getEventList();         // 이벤트 목록
await notice.getEventDetail(12345);  // 이벤트 상세
await notice.getCashshopList();      // 캐시샵 목록
await notice.getCashshopDetail(12345); // 캐시샵 상세
```

### 기타 (2개)

```ts
await client.maplestory.getOuid();        // 계정 식별자
await client.maplestory.getAchievement(); // 계정 업적
```

## 에러 처리

SDK는 Nexon API 에러 코드를 구체적인 에러 클래스로 분류합니다.

```ts
import {
  NexonRateLimitError,
  NexonAuthError,
  NexonNotFoundError,
  NexonDataNotReadyError,
} from 'nexon-open-api';

try {
  const basic = await client.maplestory.character.getBasic({ ocid });
} catch (err) {
  if (err instanceof NexonRateLimitError) {
    // 429 — 요청 한도 초과 (SDK가 자동으로 3회 재시도 후 throw)
    console.log(`재시도 대기: ${err.retryAfterMs}ms`);
  }
  if (err instanceof NexonAuthError) {
    // 403 — API 키 오류 또는 권한 없음
  }
  if (err instanceof NexonNotFoundError) {
    // 캐릭터/길드를 찾을 수 없음
  }
  if (err instanceof NexonDataNotReadyError) {
    // 해당 날짜 데이터 미준비 (매일 오전 1시 KST 이후 갱신)
  }
}
```

## 설정 옵션

```ts
const client = new NexonClient({
  apiKey: 'YOUR_API_KEY',
  timeoutMs: 10_000,        // 요청 타임아웃 (기본: 10초)
  maxRetries: 3,             // 429/503 재시도 횟수 (기본: 3)
  retryBaseDelayMs: 500,     // 재시도 기본 대기시간 (기본: 500ms)
  debug: true,               // 콘솔 디버그 로그 활성화
});
```

### 커스텀 로거

```ts
const client = new NexonClient({
  apiKey: 'YOUR_API_KEY',
  logger: {
    onRequest: (info) => console.log(`→ ${info.method} ${info.url}`),
    onResponse: (info) => console.log(`← ${info.status} (${info.durationMs}ms)`),
    onRetry: (info) => console.warn(`↩ retry #${info.attempt} after ${info.waitMs}ms`),
  },
});
```

## Sub-path Import

KMS 코드만 번들에 포함하고 싶다면 sub-path import를 사용하세요.

```ts
import { MapleStoryClient } from 'nexon-open-api/maplestory';
```

## 요구사항

- Node.js 18+
- TypeScript 5.0+ (타입 사용 시)

## 면책 조항

이 프로젝트는 넥슨(NEXON Korea Corporation)이 제휴, 승인, 후원하지 않는 **비공식** 서드파티 라이브러리입니다.

- 메이플스토리, NEXON, Nexon Open API 및 관련 상표의 모든 권리는 넥슨에 있습니다 ([이용약관 제6조 ①](https://openapi.nexon.com/ko/support/terms/)).
- 이 SDK는 [NEXON Open API](https://openapi.nexon.com/)를 통해 데이터를 제공받습니다 ([이용약관 제6조 ④](https://openapi.nexon.com/ko/support/terms/)).
- API 사용 시 [Nexon Open API 이용약관](https://openapi.nexon.com/ko/support/terms/)을 준수하세요.

## 라이선스

이 SDK의 소스 코드는 [MIT](LICENSE) 라이선스를 따릅니다.
단, API를 통해 제공되는 데이터의 저작권은 넥슨에 있으며, 데이터의 무단 복제/재배포/영리적 이용은 이용약관에 의해 제한됩니다.
