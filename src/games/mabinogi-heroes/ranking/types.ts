/** 랭킹 유형. `"0"`: 공격력 기준 순위, `"1"`: 마법 공격력 기준 순위 (숫자가 아닌 문자열) */
export type HeroesRankingType = '0' | '1';

// ─── GET /heroes/v2/ranking/hall-of-honor ───────────────────────────────────

/** 명예의 전당 랭킹 조회 요청 파라미터 */
export interface HeroesHallOfHonorRankingRequest {
  /** 랭킹 유형. `"0"`: 공격력 (200위까지), `"1"`: 마법 공격력 (100위까지) */
  readonly ranking_type: HeroesRankingType;
}

// ─── GET /heroes/v2/ranking/real-time ───────────────────────────────────────

/** 실시간 랭킹 조회 요청 파라미터 */
export interface HeroesRealTimeRankingRequest {
  /** 랭킹 유형. `"0"`: 공격력 (4000위까지), `"1"`: 마법 공격력 (2000위까지) */
  readonly ranking_type: HeroesRankingType;
  /** 페이지 번호 (1부터, 한 페이지당 최대 500개) */
  readonly page_no: number;
}

/** 랭킹 항목 (명예의 전당·실시간 공통). 두 랭킹 API의 응답은 이 항목의 배열이다 */
export interface HeroesRankingEntry {
  /** 순위 기준. 문자열 "0"은 공격력, "1"은 마법 공격력이다. */
  readonly ranking_type: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 공격력 또는 마법 공격력 점수. 조회할 때 고른 순위 기준으로 결정된다. */
  readonly score: number;
}
