import type { HeroesRankingEntry } from '../../../src/games/mabinogi-heroes/ranking/types.js';

// 포털 스펙(specs/openapi/heroes/31.yaml) 스키마로 합성한 값이다. 실 API 응답이 아니다.
// 두 랭킹 API의 응답은 객체가 아니라 배열이다.

export const heroesHallOfHonorRankingFixture: HeroesRankingEntry[] = [
  { ranking_type: '0', ranking: 1, character_name: '테스트랭커1', score: 52000 },
  { ranking_type: '0', ranking: 2, character_name: '테스트랭커2', score: 51500 },
];

export const heroesRealTimeRankingFixture: HeroesRankingEntry[] = [
  { ranking_type: '1', ranking: 501, character_name: '테스트랭커501', score: 31000 },
  { ranking_type: '1', ranking: 502, character_name: '테스트랭커502', score: 30950 },
];
