# 넥슨 Open API 공지 — nexon-open-api

> `client.platform` · API 1개 · [넥슨 공식 문서](https://openapi.nexon.com/ko/game/platform/)

API 점검이나 업데이트 공지를 새로 받아 디스코드에 띄우거나, 서비스 상태 페이지에 관련 공지를 모을 수 있습니다.

## 시작하기

게임의 캐릭터 번호나 계정 번호 없이 넥슨 Open API 공지를 조회합니다.

처음이라면 [시작 가이드](./getting-started.md)를 따라 API 키를 발급받고 패키지를 설치하세요.

```js
import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_API_KEY'];
if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
const client = new NexonClient({ apiKey });

try {
  const { notice } = await client.platform.getNoticeList();
  for (const entry of notice) {
    console.log(`[${entry.game_name}] ${entry.title}`);
  }
  // 예시 출력: [공통] NEXON Open API 점검 안내
} catch (error) {
  console.error('조회 실패', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
```

파일을 `index.mjs`(ES 모듈)로 저장하고 `.env`에 `NEXON_API_KEY`를 설정한 뒤 Node.js 20.6 이상에서 `node --env-file=.env index.mjs`로 실행합니다.

## 게임 용어 ↔ SDK 대응표

메서드는 `client.platform`에서 호출합니다.

| 게임에서 부르는 이름           | SDK 메서드                     | 주요 응답 필드                                        |
| ------------------------------ | ------------------------------ | ----------------------------------------------------- |
| 넥슨 Open API 공지 목록과 본문 | `getNoticeList({ game_name })` | `notice` (공지 목록), `notice[].contents` (공지 본문) |

## 알아두기

- 최근 등록된 넥슨 Open API 공지 10개를 반환합니다. 게시 시각은 UTC 기준입니다.
- `game_name`을 생략하거나 빈 문자열로 주면 전체 공지를 조회합니다. `PlatformGameName`이 공식 스펙의 이름을 자동완성하며 새 분류에도 대응할 수 있도록 다른 문자열도 받습니다.
- 공식 스펙의 분류는 `공통`, `메이플스토리`, `EA SPORTS FC 온라인`, `바람의나라`, `바람의나라:연`, `카트라이더 러쉬플러스`, `히트2`, `V4`, `마비노기 영웅전`, `메이플스토리M`, `크레이지 아케이드`, `플랫폼`입니다.

## 카테고리별 사용법

아래 코드 조각은 시작 예제의 `try` 블록 안에 하나씩 붙여 실행합니다. 나머지 응답 필드는 에디터 자동완성에서 확인할 수 있습니다.

### API 점검·업데이트 공지

시작 예제에서 만든 `client`를 사용합니다.

```ts
// 서비스 상태 페이지에 메이플스토리 관련 API 공지의 최신 글 표시
const { notice: mapleNotices } = await client.platform.getNoticeList({ game_name: '메이플스토리' });
const latest = mapleNotices[0];
if (latest) console.log(latest.title, latest.url, latest.contents);
```

- `title`과 `url`은 공지 제목과 링크입니다.
- `contents`는 목록에 함께 오는 공지 본문입니다.
- `notice_tag`는 공지에 붙은 분류 태그입니다. 태그가 없는 공지는 `null`입니다.

<details>
<summary>넥슨 API 경로</summary>

| SDK 메서드      | 넥슨 API 경로                     |
| --------------- | --------------------------------- |
| `getNoticeList` | `GET /platform/openapi/v1/notice` |

</details>

## 만들기 예제

- **디스코드 공지 봇** · 마지막에 표시한 공지 링크를 기억하고 새 글의 제목과 링크를 올립니다.
- **서비스 상태 페이지** · 공지의 태그와 게시 시각을 사용해 관련 점검과 업데이트를 표시합니다.

## 참고

- 에러와 문제 해결: [FAQ](./faq.md)
- 이 문서의 API는 넥슨 포털 공식 스펙을 기준으로 구현했습니다 ([실서버 검증 현황](../README.md#실서버-검증-현황)).
