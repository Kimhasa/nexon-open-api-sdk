// ─── GET /tfd/v1/recommendation/module ───────────────────────────────────────

/**
 * 추천 모듈 조회 기간.
 *
 * - `'0'`: 최근 7일
 * - `'1'`: 최근 30일
 * - `'2'`: 전체
 */
export type TfdRecommendationPeriod = '0' | '1' | '2';

/** 모듈 추천 요청 */
export interface TfdRecommendationModuleRequest {
  /** 계승자 식별자 (`meta.getDescendant()` 참고) */
  readonly descendant_id: string;
  /** 무기 식별자 (`meta.getWeapon()` 참고) */
  readonly weapon_id: string;
  /** 보이드 요격전 식별자 (`meta.getVoidBattle()` 참고) */
  readonly void_battle_id: string;
  /** 조회 기간 */
  readonly period: TfdRecommendationPeriod; // "0": 최근 7일, "1": 최근 30일, "2": 전체
}

/** 추천 모듈 1개 */
export interface TfdRecommendationModuleItem {
  /** 추천 모듈의 도감 번호. meta.getModule()에서 같은 번호의 이름과 효과를 찾는다. */
  readonly module_id: string;
}

/** 계승자 추천 모듈 */
export interface TfdRecommendationModuleDescendant {
  /** 계승자 식별자 (`meta.getDescendant()` 참고) */
  readonly descendant_id: string;
  /** 추천 정보 */
  readonly recommendation: readonly TfdRecommendationModuleItem[];
}

/** 무기 추천 모듈 */
export interface TfdRecommendationModuleWeapon {
  /** 무기 식별자 (`meta.getWeapon()` 참고) */
  readonly weapon_id: string;
  /** 추천 정보 */
  readonly recommendation: readonly TfdRecommendationModuleItem[];
}

/**
 * 모듈 추천 응답.
 *
 * 보이드 요격전 성공 기록을 바탕으로 만들어진다. 조건에 맞는 기록이 부족하면 빈 값으로
 * 내려올 수 있는데, 스펙은 그때의 정확한 모양을 밝히지 않는다. `recommendation` 이 빈 배열인
 * 경우를 항상 처리한다.
 */
export interface TfdRecommendationModule {
  /** 계승자 추천 모듈 */
  readonly descendant: TfdRecommendationModuleDescendant;
  /** 무기 추천 모듈 */
  readonly weapon: TfdRecommendationModuleWeapon;
}
