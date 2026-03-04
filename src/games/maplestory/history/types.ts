import type { NexonDate } from '../../../core/types/branded.js';

// ─── 공통 요청 파라미터 ──────────────────────────────────────────────────────

/** 이력 조회 요청 파라미터 (커서 기반 페이지네이션) */
export interface HistoryRequest {
  /** 한번에 가져오려는 결과의 개수 (최소 10, 최대 1000) */
  readonly count: number;
  /** 조회 기준일 (KST, YYYY-MM-DD). date와 cursor 중 1개 이상 필수 */
  readonly date?: NexonDate | string | undefined;
  /** 페이징 처리를 위한 cursor. date와 cursor 중 1개 이상 필수 */
  readonly cursor?: string | undefined;
}

// ─── GET /maplestory/v1/history/starforce ─────────────────────────────────────

/** 스타포스 강화 이벤트 정보 */
export interface StarforceEvent {
  /** 이벤트 성공 확률 */
  readonly success_rate: string;
  /** 이벤트 파괴 확률 감소율 */
  readonly destroy_decrease_rate: string;
  /** 이벤트 비용 할인율 */
  readonly cost_discount_rate: string;
  /** 이벤트 강화 수치 가중값 */
  readonly plus_value: string;
  /** 이벤트 적용 강화 시도 가능한 n성 범위 */
  readonly starforce_event_range: string;
}

/** 스타포스 강화 결과 */
export interface StarforceHistoryItem {
  /** 스타포스 히스토리 식별자 */
  readonly id: string;
  /** 강화 시도 결과 */
  readonly item_upgrade_result: string;
  /** 강화 시도 전 스타포스 수치 */
  readonly before_starforce_count: number;
  /** 강화 시도 후 스타포스 수치 */
  readonly after_starforce_count: number;
  /** 스타 캐치 */
  readonly starcatch_result: string;
  /** 슈페리얼 장비 */
  readonly superior_item_flag: string;
  /** 파괴 방지 */
  readonly destroy_defence: string;
  /** 찬스 타임 */
  readonly chance_time: string;
  /** 파괴 방지 필드 이벤트 */
  readonly event_field_flag: string;
  /** 사용 주문서 명 */
  readonly upgrade_item: string;
  /** 프로텍트 실드 */
  readonly protect_shield: string;
  /** 보너스 스탯 부여 아이템 여부 */
  readonly bonus_stat_upgrade: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 대상 장비 아이템 명 */
  readonly target_item: string;
  /** 강화 일시 (KST) */
  readonly date_create: string;
  /** 진행 중인 스타포스 강화 이벤트 정보 */
  readonly starforce_event_list: readonly StarforceEvent[];
}

/** 스타포스 강화 결과 조회 응답 */
export interface StarforceHistory {
  /** 결과 건 수 */
  readonly count: number;
  /** 페이징 처리를 위한 cursor */
  readonly next_cursor: string;
  /** 스타포스 히스토리 */
  readonly starforce_history: readonly StarforceHistoryItem[];
}

// ─── 공통: 잠재능력 옵션 (Potential / Cube 공유) ─────────────────────────────

/** 잠재능력 옵션 */
export interface PotentialOption {
  /** 옵션 명 */
  readonly value: string;
  /** 옵션 등급 */
  readonly grade: string;
}

// ─── GET /maplestory/v1/history/potential ─────────────────────────────────────

/** 잠재능력 재설정 결과 */
export interface PotentialHistoryItem {
  /** 잠재능력 재설정 히스토리 식별자 */
  readonly id: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 사용 일시 (KST) */
  readonly date_create: string;
  /** 대상 잠재능력 타입 (잠재능력, 에디셔널 잠재능력) */
  readonly potential_type: string;
  /** 사용 결과 */
  readonly item_upgrade_result: string;
  /** 미라클 타임 적용 여부 */
  readonly miracle_time_flag: string;
  /** 장비 분류 */
  readonly item_equipment_part: string;
  /** 장비 레벨 */
  readonly item_level: number;
  /** 잠재능력 재설정 장비 명 */
  readonly target_item: string;
  /** 잠재능력 등급 */
  readonly potential_option_grade: string;
  /** 에디셔널 잠재능력 등급 */
  readonly additional_potential_option_grade: string;
  /** 천장에 도달하여 확정 등급 상승한 여부 */
  readonly upgrade_guarantee: boolean;
  /** 현재까지 쌓은 스택 */
  readonly upgrade_guarantee_count: number;
  /** 사용 전 잠재능력 옵션 */
  readonly before_potential_option: readonly PotentialOption[];
  /** 사용 전 에디셔널 잠재능력 옵션 */
  readonly before_additional_potential_option: readonly PotentialOption[];
  /** 사용 후 잠재능력 옵션 */
  readonly after_potential_option: readonly PotentialOption[];
  /** 사용 후 에디셔널 잠재능력 옵션 */
  readonly after_additional_potential_option: readonly PotentialOption[];
}

/** 잠재능력 재설정 결과 조회 응답 */
export interface PotentialHistory {
  /** 결과 건 수 */
  readonly count: number;
  /** 페이징 처리를 위한 cursor */
  readonly next_cursor: string;
  /** 잠재능력 재설정 히스토리 */
  readonly potential_history: readonly PotentialHistoryItem[];
}

// ─── GET /maplestory/v1/history/cube ─────────────────────────────────────────

/** 큐브 사용 결과 */
export interface CubeHistoryItem {
  /** 큐브 히스토리 식별자 */
  readonly id: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 사용 일시 (KST) */
  readonly date_create: string;
  /** 사용 큐브 */
  readonly cube_type: string;
  /** 사용 결과 */
  readonly item_upgrade_result: string;
  /** 미라클 타임 적용 여부 */
  readonly miracle_time_flag: string;
  /** 장비 분류 */
  readonly item_equipment_part: string;
  /** 장비 레벨 */
  readonly item_level: number;
  /** 큐브 사용한 장비 */
  readonly target_item: string;
  /** 잠재능력 등급 */
  readonly potential_option_grade: string;
  /** 에디셔널 잠재능력 등급 */
  readonly additional_potential_option_grade: string;
  /** 천장에 도달하여 확정 등급 상승한 여부 */
  readonly upgrade_guarantee: boolean;
  /** 현재까지 쌓은 스택 */
  readonly upgrade_guarantee_count: number;
  /** 사용 전 잠재능력 옵션 */
  readonly before_potential_option: readonly PotentialOption[];
  /** 사용 전 에디셔널 잠재능력 옵션 */
  readonly before_additional_potential_option: readonly PotentialOption[];
  /** 사용 후 잠재능력 옵션 */
  readonly after_potential_option: readonly PotentialOption[];
  /** 사용 후 에디셔널 잠재능력 옵션 */
  readonly after_additional_potential_option: readonly PotentialOption[];
}

/** 큐브 사용 결과 조회 응답 */
export interface CubeHistory {
  /** 결과 건 수 */
  readonly count: number;
  /** 페이징 처리를 위한 cursor */
  readonly next_cursor: string;
  /** 큐브 히스토리 */
  readonly cube_history: readonly CubeHistoryItem[];
}
