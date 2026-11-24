import type { TfdLanguageCode, TfdOuid } from '../types.js';

// ─── 요청 타입 ───────────────────────────────────────────────────────────────

/** ouid만 받는 계정 조회 요청 */
export interface TfdUserRequest {
  /** 계정 식별자 (`client.firstDescendant.getOuid()` 로 조회) */
  readonly ouid: TfdOuid;
}

/** ouid와 언어 코드를 받는 계정 조회 요청 (랜덤 옵션·코어 옵션 이름이 해당 언어로 내려온다) */
export interface TfdUserLocalizedRequest extends TfdUserRequest {
  /** 언어 코드 (기본값: `'ko'`) */
  readonly language_code?: TfdLanguageCode | undefined;
}

/** 아르케 조율 정보 조회 요청 */
export interface TfdUserArcheTuningRequest extends TfdUserRequest {
  /** 계승자 그룹 식별자 (`meta.getDescendantGroup()` 참고) */
  readonly descendant_group_id: string;
}

// ─── 공통 중첩 타입 ──────────────────────────────────────────────────────────

/** 장착 모듈 정보 */
export interface TfdUserModule {
  /** 모듈 슬롯 식별자 */
  readonly module_slot_id: string;
  /** 장착한 모듈의 고유 번호. 같은 번호를 모듈 도감에서 찾으면 이름과 강화 효과를 알 수 있다. */
  readonly module_id: string;
  /** 장착한 모듈의 강화 단계 */
  readonly module_enchant_level: number;
}

/** 랜덤 옵션 정보 (무기·반응로·외장 부품 공통) */
export interface TfdUserAdditionalStat {
  /** 랜덤 옵션 이름 (요청한 언어) */
  readonly additional_stat_name: string;
  /** 랜덤 옵션 값 (숫자가 아닌 문자열) */
  readonly additional_stat_value: string;
}

/** 코어 옵션 정보 (무기·외장 부품 공통) */
export interface TfdUserCore {
  /** 코어 슬롯 식별자 (`meta.getCoreSlot()` 참고) */
  readonly core_slot_id: string;
  /** 코어 옵션 이름 (요청한 언어) */
  readonly core_option_name: string;
  /** 코어 옵션 값 (숫자가 아닌 문자열) */
  readonly core_option_value: string;
}

// ─── GET /tfd/v1/user/basic ──────────────────────────────────────────────────

/** 계정 기본 정보 */
export interface TfdUserBasic {
  /** 닉네임과 태그로 찾는 계정 고유 번호 */
  readonly ouid: TfdOuid;
  /** 닉네임 (예: `닉네임#1234`) */
  readonly user_name: string;
  /** 플랫폼 유형 */
  readonly platform_type: string;
  /** 마스터리 랭크 */
  readonly mastery_rank_level: number;
  /** 마스터리 랭크 경험치 */
  readonly mastery_rank_exp: number;
  /** 접두 칭호 번호. 타이틀 도감의 같은 번호에서 이름을 찾는다. 접두 칭호를 달지 않았으면 null */
  readonly title_prefix_id: string | null;
  /** 접미 칭호 번호. 타이틀 도감의 같은 번호에서 이름을 찾는다. 접미 칭호를 달지 않았으면 null */
  readonly title_suffix_id: string | null;
  /** 접속 환경의 운영체제 표시 언어 */
  readonly os_language: string;
  /** 게임 설정 언어 */
  readonly game_language: string;
  /** 훈장 식별자 (`meta.getMedal()` 참고) */
  readonly medal_id: string;
  /** 훈장 단계 */
  readonly medal_level: number;
}

// ─── GET /tfd/v1/user/descendant ─────────────────────────────────────────────

/** 염색 정보 */
export interface TfdUserCustomizingPaint {
  /** 염색 커스터마이징 슬롯 식별자 */
  readonly customizing_item_slot_id: string;
  /** 염색 커스터마이징 아이템 유형 */
  readonly customizing_item_type: string;
  /** 염색 커스터마이징 아이템 식별자 (`meta.getCustomizingItem()` 참고) */
  readonly customizing_item_id: string;
}

/** 커스터마이징 정보 */
export interface TfdUserCustomizing {
  /** 커스터마이징 슬롯 식별자 */
  readonly customizing_item_slot_id: string;
  /** 커스터마이징 아이템 유형 */
  readonly customizing_item_type: string;
  /** 커스터마이징 아이템 식별자 (`meta.getCustomizingItem()` 참고) */
  readonly customizing_item_id: string;
  /** 커스터마이징 아이템의 진화 단계. 값이 없으면 null */
  readonly customizing_item_evolution_stage: number | null;
  /** 커스터마이징 아이템의 현재 선택된 진화 단계. 값이 없으면 null */
  readonly customizing_item_current_evolution_stage: number | null;
  /** 염색 정보 */
  readonly paint: readonly TfdUserCustomizingPaint[];
}

/**
 * 장착 계승자 정보.
 *
 * 장착 모듈·커스터마이징 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
 */
export interface TfdUserDescendant {
  /** 계정 식별자 */
  readonly ouid: TfdOuid;
  /** 닉네임 */
  readonly user_name: string;
  /** 장착중인 계승자 식별자 (`meta.getDescendant()` 참고) */
  readonly descendant_id: string;
  /** 계승자 슬롯 식별자 */
  readonly descendant_slot_id: string;
  /** 장착중인 계승자 레벨 */
  readonly descendant_level: number;
  /** 장착 가능한 최대 모듈 수용량 */
  readonly module_max_capacity: number;
  /** 실제 적용된 수용량 */
  readonly module_capacity: number;
  /** 에너지 활성체 사용 횟수 */
  readonly energy_activator_use_count: number;
  /** 모듈 정보 */
  readonly module: readonly TfdUserModule[];
  /** 커스터마이징 정보 */
  readonly customizing: readonly TfdUserCustomizing[];
}

// ─── GET /tfd/v1/user/weapon ─────────────────────────────────────────────────

/** 장착 무기 1개 */
export interface TfdUserWeaponItem {
  /** 장착 가능한 최대 모듈 수용량. 값이 없으면 null */
  readonly module_max_capacity: number | null;
  /** 실제 적용된 수용량. 값이 없으면 null */
  readonly module_capacity: number | null;
  /** 에너지 활성체 사용 횟수. 값이 없으면 null */
  readonly energy_activator_use_count: number | null;
  /** 무기 슬롯 식별자 */
  readonly weapon_slot_id: string;
  /** 무기 식별자 (`meta.getWeapon()` 참고) */
  readonly weapon_id: string;
  /** 무기 레벨 */
  readonly weapon_level: number;
  /** 무기 고유 능력 강화 단계. 값이 없으면 null */
  readonly perk_ability_enchant_level: number | null;
  /** 무기 랜덤 옵션 정보 */
  readonly weapon_additional_stat: readonly TfdUserAdditionalStat[];
  /** 모듈 정보 */
  readonly module: readonly TfdUserModule[];
  /** 무기 코어 슬롯 개방 여부. 문자열 "0"은 잠금, "1"은 개방이다. 값이 없으면 null */
  readonly core_unlock_flag: string | null;
  /** 코어 옵션 정보 */
  readonly core: readonly TfdUserCore[];
}

/**
 * 장착 무기 정보 (모든 슬롯).
 *
 * 장착 모듈 정보는 게임을 재접속하거나 매칭이 있는 콘텐츠를 완료한 뒤에 갱신된다.
 */
export interface TfdUserWeapon {
  /** 계정 식별자 */
  readonly ouid: TfdOuid;
  /** 닉네임 */
  readonly user_name: string;
  /** 무기 정보 */
  readonly weapon: readonly TfdUserWeaponItem[];
}

// ─── GET /tfd/v1/user/reactor ────────────────────────────────────────────────

/** 장착 반응로 정보 */
export interface TfdUserReactor {
  /** 계정 식별자 */
  readonly ouid: TfdOuid;
  /** 닉네임 */
  readonly user_name: string;
  /** 반응로 식별자 (`meta.getReactor()` 참고) */
  readonly reactor_id: string;
  /** 반응로 슬롯 식별자 */
  readonly reactor_slot_id: string;
  /** 반응로 레벨 */
  readonly reactor_level: number;
  /** 반응로 랜덤 옵션 */
  readonly reactor_additional_stat: readonly TfdUserAdditionalStat[];
  /** 반응로 강화 단계 */
  readonly reactor_enchant_level: number;
}

// ─── GET /tfd/v1/user/external-component ─────────────────────────────────────

/** 장착 외장 부품 1개 */
export interface TfdUserExternalComponentItem {
  /** 외장 부품 슬롯 식별자 */
  readonly external_component_slot_id: string;
  /** 외장 부품 식별자 (`meta.getExternalComponent()` 참고) */
  readonly external_component_id: string;
  /** 외장 부품 레벨 */
  readonly external_component_level: number;
  /** 외장 부품 랜덤 옵션 */
  readonly external_component_additional_stat: readonly TfdUserAdditionalStat[];
  /** 외장 부품 코어 슬롯 개방 여부. 문자열 "0"은 잠금, "1"은 개방이다. */
  readonly core_unlock_flag: string;
  /** 코어 옵션 정보 */
  readonly core: readonly TfdUserCore[];
}

/** 장착 외장 부품 정보 (모든 슬롯) */
export interface TfdUserExternalComponent {
  /** 계정 식별자 */
  readonly ouid: TfdOuid;
  /** 닉네임 */
  readonly user_name: string;
  /** 외장 부품 정보 */
  readonly external_component: readonly TfdUserExternalComponentItem[];
}

// ─── GET /tfd/v1/user/arche-tuning ───────────────────────────────────────────

/** 활성화한 아르케 조율 노드 */
export interface TfdUserArcheTuningNode {
  /** 노드 식별자 (`meta.getArcheTuningNode()` 참고) */
  readonly node_id: string;
  /** 아르케 조율 보드의 노드 행 좌표. 문자열로 제공된다. */
  readonly position_row: string;
  /** 아르케 조율 보드의 노드 열 좌표. 문자열로 제공된다. */
  readonly position_column: string;
}

/** 아르케 조율 보드 */
export interface TfdUserArcheTuningBoard {
  /** 아르케 조율 보드 식별자 (`meta.getArcheTuningBoard()` 참고) */
  readonly arche_tuning_board_id: string;
  /** 노드 목록 */
  readonly node: readonly TfdUserArcheTuningNode[];
}

/** 아르케 조율 슬롯 */
export interface TfdUserArcheTuningSlot {
  /** 슬롯 식별자 */
  readonly slot_id: string;
  /** 아르케 조율 보드 목록 */
  readonly arche_tuning_board: readonly TfdUserArcheTuningBoard[];
}

/** 아르케 조율 정보 (계승자 그룹별로 활성화한 노드와 좌표) */
export interface TfdUserArcheTuning {
  /** 계정 식별자 */
  readonly ouid: TfdOuid;
  /** 계승자 그룹 식별자 (`meta.getDescendantGroup()` 참고) */
  readonly descendant_group_id: string;
  /** 아르케 조율 보드 그룹 식별자 (`meta.getArcheTuningBoardGroup()` 참고) */
  readonly arche_tuning_board_group_id: string;
  /** 아르케 조율 목록 */
  readonly arche_tuning: readonly TfdUserArcheTuningSlot[];
}
