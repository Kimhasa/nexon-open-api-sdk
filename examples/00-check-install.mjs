// 설치 확인: EA SPORTS FC 온라인 공식경기, 공식 친선 등 매치 종류 목록을 가져옵니다.
// 실행: node examples/00-check-install.mjs
// @ts-check

import { NexonClient } from 'nexon-open-api';

// 매치 종류는 공개 목록이라 API Key가 필요 없습니다.
// NexonClient 생성에는 비어 있지 않은 apiKey가 필요해 임시 문자열을 넣습니다.
const client = new NexonClient({ apiKey: 'public-metadata' });

console.log('⚽ EA SPORTS FC 온라인 매치 종류');
for (const { matchtype, desc } of await client.fcOnline.getMatchTypeMeta()) {
  console.log(`• ${desc} (${matchtype})`);
}
// 출력 예시: • 공식경기 (50)
