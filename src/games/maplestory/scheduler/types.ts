import type { NexonDate, OCID } from '../../_base/maple-base-types.js';

// ─── 요청 파라미터 ───────────────────────────────────────────────────────────

/** 스케줄러 정보 조회 요청 파라미터 */
export interface SchedulerCharacterStateRequest {
  /** 캐릭터 식별자. 자신의 계정에 속한 캐릭터만 조회할 수 있습니다. */
  readonly ocid: OCID;
  /**
   * 조회 기준일 (KST, YYYY-MM-DD). 생략 시 오늘 날짜.
   * 조회 요청일 기준 최대 14일 전까지만 조회할 수 있습니다.
   */
  readonly date?: NexonDate | string | undefined;
}

// ─── GET /maplestory/v1/scheduler/character-state ────────────────────────────

/** 일일·주간 콘텐츠 수행 현황 */
export interface SchedulerContent {
  /** 콘텐츠/퀘스트 명 */
  readonly content_name: string;
  /** 타입 ("contents" | "quest") */
  readonly type: string;
  /** 인게임 스케줄러 등록 여부 ("true" | "false", boolean이 아닌 문자열) */
  readonly registration_flag: string;
  /** 현재 완료 횟수/점수 */
  readonly now_count: number;
  /** 최대 완료 가능 횟수/점수 */
  readonly max_count: number;
  /** 퀘스트인 경우 진행 상태 ("0": 기타, "1": 진행 중, "2": 완료) */
  readonly quest_state: string | null;
}

/** 보스 콘텐츠 수행 현황 */
export interface SchedulerBossContent {
  /** 보스 명 */
  readonly content_name: string;
  /** 보스 난이도 */
  readonly difficulty: string;
  /** 보스 초기화 주기 */
  readonly cycle: string;
  /** 리스트 순서 */
  readonly list_order_no: number;
  /** 인게임 스케줄러 등록 여부 ("true" | "false", boolean이 아닌 문자열) */
  readonly registration_flag: string;
  /** 완료 여부 ("true" | "false", boolean이 아닌 문자열) */
  readonly complete_flag: string;
}

/**
 * GET /maplestory/v1/scheduler/character-state 응답.
 *
 * 캐릭터가 기준일에 접속하지 않았다면 응답 결과가 없을 수 있습니다.
 */
export interface SchedulerCharacterState {
  /** 조회 기준일 (YYYY-MM-DD) */
  readonly date: string | null;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 일일 콘텐츠 정보 */
  readonly daily_contents: readonly SchedulerContent[];
  /** 주간 콘텐츠 정보 */
  readonly weekly_contents: readonly SchedulerContent[];
  /** 보스 콘텐츠 정보 */
  readonly boss_contents: readonly SchedulerBossContent[];
  /** 주간 보스 처치 완료 횟수 */
  readonly weekly_boss_clear_count: number;
  /** 주간 보스 처치 제한 횟수 */
  readonly weekly_boss_clear_limit_count: number;
}
