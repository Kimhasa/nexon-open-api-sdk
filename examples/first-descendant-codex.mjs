// 퍼스트 디센던트 팬사이트에서 계승자 이름을 가나다순 도감으로 보여 줍니다.
// 실행: node examples/first-descendant-codex.mjs
// @ts-check

import { NexonClient } from 'nexon-open-api';

// 공개 계승자 목록 조회에는 API Key가 필요 없지만 NexonClient 생성에는 비어 있지 않은 문자열이 필요합니다.
const client = new NexonClient({ apiKey: 'public-metadata' });
const descendants = await client.firstDescendant.meta.getDescendant('ko');
const names = descendants.map(({ descendant_name }) => descendant_name);
names.sort(new Intl.Collator('ko-KR').compare);

console.log(`📖 퍼스트 디센던트 계승자 도감 · ${names.length}명`);
for (const name of names) console.log(`• ${name}`);
// 출력 예시: • 레픽
