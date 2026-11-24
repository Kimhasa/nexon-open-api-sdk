import type { TfdPlatformType } from '../types.js';

// ─── 요청 타입 ───────────────────────────────────────────────────────────────

/** 리더보드 유형 */
export type TfdLeaderboardType = 'Solo' | 'Squad';

/** 스쿼드 인원 수 */
export type TfdLeaderboardSquadUserCount = 2 | 3 | 4;

/** 솔로 리더보드 조건 */
export interface TfdLeaderboardSoloFilter {
  /** 리더보드 유형 */
  readonly leaderboard_type: 'Solo';
  /** 계승자 식별자 (`meta.getDescendant()` 참고) */
  readonly descendant_id?: string | undefined;
  /** 솔로 리더보드에는 쓸 수 없다 */
  readonly squad_user_count?: undefined;
}

/** 스쿼드 리더보드 조건 */
export interface TfdLeaderboardSquadFilter {
  /** 리더보드 유형 */
  readonly leaderboard_type: 'Squad';
  /** 스쿼드 인원 수 */
  readonly squad_user_count?: TfdLeaderboardSquadUserCount | undefined;
  /** 스쿼드 리더보드에는 쓸 수 없다 */
  readonly descendant_id?: undefined;
}

/** 플랫폼 조건 */
export interface TfdLeaderboardPlatformFilter {
  /** 플랫폼 타입 (기본값: `'All'`) */
  readonly platform_type?: TfdPlatformType | undefined;
}

/** 보이드 요격전 리더보드 콘텐츠 타입 (현재 `'RiskMode'` 하나뿐이다) */
export type TfdLeaderboardVoidInterceptBattleContentsType = 'RiskMode';

/**
 * 보이드 요격전 리더보드 조회 요청.
 *
 * `leaderboard_type` 이 `'Solo'` 면 `descendant_id`, `'Squad'` 면 `squad_user_count` 를 함께 쓴다.
 */
export type TfdLeaderboardVoidInterceptBattleRequest = (
  | TfdLeaderboardSoloFilter
  | TfdLeaderboardSquadFilter
) &
  TfdLeaderboardPlatformFilter & {
    /** 리더보드 콘텐츠 타입 (기본값: `'RiskMode'`) */
    readonly contents_type?: TfdLeaderboardVoidInterceptBattleContentsType | undefined;
  };

/**
 * 보이드 침식 정화 - 도전 리더보드 조회 요청.
 *
 * `leaderboard_type` 이 `'Solo'` 면 `descendant_id`, `'Squad'` 면 `squad_user_count` 를 함께 쓴다.
 */
export type TfdLeaderboardVoidErosionPurgeChallengeRequest = (
  | TfdLeaderboardSoloFilter
  | TfdLeaderboardSquadFilter
) &
  TfdLeaderboardPlatformFilter;

// ─── 응답 공통 ───────────────────────────────────────────────────────────────

/** 리더보드 기록의 멤버 */
export interface TfdLeaderboardMember {
  /** 닉네임 */
  readonly user_name: string | null;
  /** 마스터리 랭크 */
  readonly mastery_rank_level: number | null;
  /** 계승자 식별자 (`meta.getDescendant()` 참고) */
  readonly descendant_id: string | null;
  /** 플랫폼 유형 */
  readonly platform_type: string | null;
}

// ─── GET /tfd/v1/leaderboard/void-intercept-battle ───────────────────────────

/** 보이드 요격전 리더보드 기록 */
export interface TfdLeaderboardVoidInterceptBattleEntry {
  /** 순위 */
  readonly ranking: number | null;
  /** 보이드 요격전을 클리어하는 데 걸린 시간. 문자열로 제공된다. */
  readonly score: string | null;
  /** 멤버 목록 */
  readonly member: readonly TfdLeaderboardMember[];
}

/** 보이드 요격전 리더보드 (평균 1시간 단위로 갱신) */
export interface TfdLeaderboardVoidInterceptBattle {
  /** 리더보드 목록. 기록이 없으면 `null` 일 수 있다 */
  readonly leaderboard: readonly TfdLeaderboardVoidInterceptBattleEntry[] | null;
}

// ─── GET /tfd/v1/leaderboard/void-erosion-purge-challenge ────────────────────

/** 보이드 침식 정화 - 도전 리더보드 기록 */
export interface TfdLeaderboardVoidErosionPurgeChallengeEntry {
  /** 순위 */
  readonly ranking: number;
  /** 보이드 침식 정화 - 도전을 클리어하는 데 걸린 시간. 문자열로 제공된다. */
  readonly score: string;
  /** 보이드 침식 정화 - 도전의 단계. 문자열로 제공된다. */
  readonly stage: string;
  /** 멤버 목록 */
  readonly member: readonly TfdLeaderboardMember[];
}

/** 보이드 침식 정화 - 도전 리더보드 (평균 1시간 단위로 갱신) */
export interface TfdLeaderboardVoidErosionPurgeChallenge {
  /** 리더보드 목록 */
  readonly leaderboard: readonly TfdLeaderboardVoidErosionPurgeChallengeEntry[];
}
