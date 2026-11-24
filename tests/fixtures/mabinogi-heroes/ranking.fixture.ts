import type { HeroesRankingEntry } from '../../../src/games/mabinogi-heroes/ranking/types.js';

// 값은 합성한 것이다. 구조는 2026-11-24 실제 응답을 따른다:
// 포털 스펙(specs/openapi/heroes/31.yaml)은 최상위 배열로 적지만 서버는 `{ ranking: [...] }` 객체를 돌려준다.

/** 서버가 돌려주는 랭킹 응답 형태 */
export interface HeroesRankingResponseFixture {
  readonly ranking: HeroesRankingEntry[];
}

export const heroesHallOfHonorRankingFixture: HeroesRankingResponseFixture = {
  ranking: [
    { ranking_type: '0', ranking: 1, character_name: '테스트랭커1', score: 52000 },
    { ranking_type: '0', ranking: 2, character_name: '테스트랭커2', score: 51500 },
  ],
};

export const heroesRealTimeRankingFixture: HeroesRankingResponseFixture = {
  ranking: [
    { ranking_type: '1', ranking: 501, character_name: '테스트랭커501', score: 31000 },
    { ranking_type: '1', ranking: 502, character_name: '테스트랭커502', score: 30950 },
  ],
};
