import type { OCID } from '../../_base/maple-base-types.js';
import type {
  AbilityInfo,
  CashItemOption,
  ClassItemExceptionalOption,
  FinalStat,
  HexaLinkedSkill,
  HexaStatCore,
  ItemAddOption,
  ItemBaseOption,
  ItemEtcOption,
  ItemExceptionalOption,
  ItemTotalOption,
  LinkSkillInfo,
  OtherStatEntry,
  PetAutoSkill,
  PetEquipmentItem,
  PetiteLunaPetSkill,
  SetEffectOption,
  SymbolInfo,
  VCoreEquipment,
} from '../character/types.js';
import type { GuildSkill } from '../guild/types.js';

// ─── 공통 요청 파라미터 ──────────────────────────────────────────────────────

/** 연무장 리플레이 식별자 조회 요청 파라미터 */
export interface BattlePracticeReplayIdRequest {
  /** 캐릭터 식별자. 리플레이를 등록한 캐릭터만 조회할 수 있습니다. */
  readonly ocid: OCID;
}

/** 리플레이 식별자 기반 요청 파라미터 */
export interface BattlePracticeReplayRequest {
  /** 연무장 리플레이 고유 식별자 (`battlePractice.getReplayId()` 로 획득) */
  readonly replay_id: string;
}

/** 연무장 스킬 사용 내역 조회 요청 파라미터 */
export interface BattlePracticeSkillTimelineRequest extends BattlePracticeReplayRequest {
  /** 페이지 번호 (1부터 시작, 미입력 시 1페이지) */
  readonly page_no?: number | undefined;
}

// ─── GET /maplestory/v1/battle-practice/replay-id ────────────────────────────

/** 연무장 리플레이 개별 정보 */
export interface BattlePracticeReplay {
  /** 기간 번호 (연무장 초기화 시마다 1씩 증가) */
  readonly period_no: number;
  /** 리플레이 등록 일시 (KST, 일 단위 데이터로 시, 분은 일괄 0으로 표기) */
  readonly register_date: string;
  /** 연무장 리플레이 고유 식별자 */
  readonly replay_id: string;
}

/** 연무장 리플레이 목록 — `client.maplestory.battlePractice.getReplayId()` 의 응답. */
export interface BattlePracticeReplayId {
  /** 리플레이 목록 */
  readonly replay_list: readonly BattlePracticeReplay[];
}

// ─── GET /maplestory/v1/battle-practice/result ───────────────────────────────

/** 스킬 단위 전투 분석 정보 */
export interface BattlePracticeSkillStatistic {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 누적 데미지 */
  readonly damage: number;
  /** 데미지 점유율 */
  readonly damage_percent: string;
  /** 초당 평균 데미지 */
  readonly dps: number;
  /** 사용 횟수 */
  readonly use_count: number;
  /** 1회당 평균 데미지 */
  readonly damage_per_use: number;
  /** 공격 횟수 */
  readonly attack_count: number;
  /** 최대 데미지 (1타) */
  readonly max_damage: number;
  /** 최소 데미지 (1타) */
  readonly min_damage: number;
}

/** 연무장 측정 결과 — `client.maplestory.battlePractice.getResult()` 의 응답. */
export interface BattlePracticeResult {
  /** 리플레이 등록 일시 (KST, 일 단위 데이터로 시, 분은 일괄 0으로 표기) */
  readonly register_date: string;
  /** 총 연무 시간 (ms) */
  readonly total_play_time: number;
  /** 총합 데미지 */
  readonly total_damage: number;
  /** 초당 평균 데미지 */
  readonly total_dps: number;
  /** 종료 타입 ("1": 자동 종료, "2": 수동 종료, "3": 시간 초과, "9": 기타 종료) */
  readonly end_type: string;
  /** 리플레이 추천 수 */
  readonly like_count: number;
  /** 스킬 단위 전투 분석 정보 */
  readonly skill_statistic: readonly BattlePracticeSkillStatistic[];
}

// ─── GET /maplestory/v1/battle-practice/skill-timeline ───────────────────────

/** 스킬 타임라인 개별 정보 */
export interface BattlePracticeSkillTimelineItem {
  /** 연무 시작 후 경과 시간 (ms) */
  readonly elapse_time: number;
  /** 사용 스킬 명 */
  readonly skill_name: string;
  /** 헥사 스킬 특성 여부 ("0": 그 외 스킬, "1": 오리진 스킬, "2": 어센트 스킬) */
  readonly hexa_skill_specificity_flag: string;
  /** 시퀀스 명 */
  readonly sequence_name: string | null;
  /** 시퀀스 키 */
  readonly sequence_key: string | null;
}

/** 연무장 스킬 사용 내역 — `client.maplestory.battlePractice.getSkillTimeline()` 의 응답. */
export interface BattlePracticeSkillTimeline {
  /** 조회된 페이지 번호 */
  readonly page_no: number;
  /** 전체 페이지 번호 */
  readonly total_page_no: number;
  /** 스킬 타임라인 정보 */
  readonly skill_timeline: readonly BattlePracticeSkillTimelineItem[];
}

// ─── GET /maplestory/v1/battle-practice/character-info ───────────────────────

/** 연무장 캐릭터 기본 정보 */
export interface BattlePracticeBasic {
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 전직 차수 */
  readonly character_class_level: string;
  /** 캐릭터 이미지 URL */
  readonly character_image: string;
}

/** 연무장 캐릭터 스탯 관련 정보 */
export interface BattlePracticeStat {
  /** 스탯 정보 */
  readonly basic_stat_object: {
    /** 현재 스탯 정보 */
    readonly final_stat: readonly FinalStat[];
  };
  /** 장착 심볼 정보 */
  readonly symbol_stat_object: {
    /** 심볼 정보 */
    readonly symbol: readonly SymbolInfo[];
  };
  /** 기타 능력치 영향 요소 */
  readonly other_stat_object: {
    /** 능력치에 영향을 주는 요소 및 스탯 정보 */
    readonly other_stat: readonly OtherStatEntry[];
  };
}

/** 연무장 하이퍼 스탯 개별 정보 */
export interface BattlePracticeHyperStatInfo {
  /** 스탯 종류 */
  readonly stat_type: string;
  /** 스탯 레벨 */
  readonly stat_level: number;
  /** 스탯 상승량 */
  readonly stat_increase: string | null;
}

/** 연무장 캐릭터 성향 정보 */
export interface BattlePracticePropensity {
  /** 카리스마 레벨 */
  readonly charisma_level: number;
  /** 감성 레벨 */
  readonly sensibility_level: number;
  /** 통찰력 레벨 */
  readonly insight_level: number;
  /** 의지 레벨 */
  readonly willingness_level: number;
  /** 손재주 레벨 */
  readonly handicraft_level: number;
  /** 매력 레벨 */
  readonly charm_level: number;
}

/**
 * 연무장 드래곤·메카닉 장비 정보.
 *
 * 캐릭터 API의 직업 전용 장비와 달리 슬롯 필드가 `item_equipment_slot`,
 * 주문서 잔여 횟수 필드가 `scroll_upgrade_able_count` 다 (스펙 원문 그대로).
 */
export interface BattlePracticeSubItemEquipment {
  /** 장비 부위 명 */
  readonly item_equipment_part: string;
  /** 장비 슬롯 위치 */
  readonly item_equipment_slot: string;
  /** 장비 명 */
  readonly item_name: string;
  /** 장비 아이콘 */
  readonly item_icon: string;
  /** 장비 설명 */
  readonly item_description: string | null;
  /** 장비 외형 */
  readonly item_shape_name: string;
  /** 장비 외형 아이콘 */
  readonly item_shape_icon: string;
  /** 전용 성별 */
  readonly item_gender: string | null;
  /** 장비 최종 옵션 정보 */
  readonly item_total_option: ItemTotalOption;
  /** 장비 기본 옵션 정보 */
  readonly item_base_option: ItemBaseOption;
  /** 착용 레벨 증가 */
  readonly equipment_level_increase: number;
  /** 장비 특별 옵션 정보 */
  readonly item_exceptional_option: ClassItemExceptionalOption;
  /** 장비 추가 옵션 */
  readonly item_add_option: ItemAddOption;
  /** 성장 경험치 */
  readonly growth_exp: number;
  /** 성장 레벨 */
  readonly growth_level: number;
  /** 주문서 횟수 */
  readonly scroll_upgrade: string;
  /** 가위 사용 가능 횟수 (교환 불가 장비, 가위 횟수가 없는 교환 가능 장비는 255) */
  readonly cuttable_count: string;
  /** 황금 망치 재련 적용 ("1": 적용, 이외 미적용) */
  readonly golden_hammer_flag: string;
  /** 복구 가능 횟수 */
  readonly scroll_resilience_count: string;
  /** 주문서 잔여 횟수 (캐릭터 API의 `scroll_upgradable_count` 에 해당) */
  readonly scroll_upgrade_able_count: string;
  /** 소울 명 */
  readonly soul_name: string | null;
  /** 소울 옵션 */
  readonly soul_option: string | null;
  /** 장비 기타 옵션 정보 */
  readonly item_etc_option: ItemEtcOption;
  /** 강화 단계 */
  readonly starforce: string;
  /** 놀라운 장비 강화 주문서 사용 여부 ("0": 미사용, "1": 사용) */
  readonly starforce_scroll_flag: string;
  /** 장비 스타포스 옵션 정보 */
  readonly item_starforce_option: ItemEtcOption;
  /** 특수 반지 레벨 */
  readonly special_ring_level: number;
  /** 장비 유효 기간 (KST) */
  readonly date_expire: string | null;
  /** 프리스타일 쿠폰 적용 여부 ("0": 미적용, "1": 적용) */
  readonly freestyle_flag: string | null;
}

/** 연무장 장착 장비 개별 정보 */
export interface BattlePracticeItemEquipment extends BattlePracticeSubItemEquipment {
  /** 장비 특별 옵션 정보 */
  readonly item_exceptional_option: ItemExceptionalOption;
  /** 잠재능력 봉인 여부 ("true": 봉인, "false": 봉인 없음) */
  readonly potential_option_flag: string | null;
  /** 에디셔널 잠재능력 봉인 여부 ("true": 봉인, "false": 봉인 없음) */
  readonly additional_potential_option_flag: string | null;
  /** 잠재능력 등급 */
  readonly potential_option_grade: string | null;
  /** 에디셔널 잠재능력 등급 */
  readonly additional_potential_option_grade: string | null;
  /** 소울 잠재능력 등급. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_potential_grade?: string | null | undefined;
  /** 소울 증폭 단계. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_potential_amplified_grade?: number | null | undefined;
  /** 잠재능력 첫 번째 옵션 */
  readonly potential_option_1: string | null;
  /** 잠재능력 두 번째 옵션 */
  readonly potential_option_2: string | null;
  /** 잠재능력 세 번째 옵션 */
  readonly potential_option_3: string | null;
  /** 에디셔널 잠재능력 첫 번째 옵션 */
  readonly additional_potential_option_1: string | null;
  /** 에디셔널 잠재능력 두 번째 옵션 */
  readonly additional_potential_option_2: string | null;
  /** 에디셔널 잠재능력 세 번째 옵션 */
  readonly additional_potential_option_3: string | null;
  /** 소울 잠재능력 첫 번째 옵션. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_potential_option_1?: string | null | undefined;
  /** 소울 잠재능력 두 번째 옵션. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_potential_option_2?: string | null | undefined;
  /** 소울 잠재능력 세 번째 옵션. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_potential_option_3?: string | null | undefined;
  /** 소울 공격력 증가 옵션. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_pad?: string | null | undefined;
  /** 소울 마력 증가 옵션. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_mad?: string | null | undefined;
  /** 소울 활성 여부 ("0": 비활성, "1": 활성). 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly soul_active?: string | null | undefined;
}

/** 연무장 칭호 정보 */
export interface BattlePracticeTitle {
  /** 칭호 장비 명 */
  readonly title_name: string;
  /** 칭호 아이콘 */
  readonly title_icon: string;
  /** 칭호 설명 */
  readonly title_description: string;
  /** 칭호 유효 기간 (KST) */
  readonly date_expire: string | null;
  /** 칭호 옵션 유효 기간 (KST, "expired": 만료, null: 무제한) */
  readonly date_option_expire: string | null;
  /** 외형 설정에 등록한 칭호 장비 명 */
  readonly title_shape_name: string | null;
  /** 외형 설정에 등록한 칭호 아이콘 */
  readonly title_shape_icon: string | null;
  /** 외형 설정에 등록한 칭호 설명 */
  readonly title_shape_description: string | null;
}

/** 연무장 세트 효과 정보 */
export interface BattlePracticeSetEffect {
  /** 세트 효과 명 */
  readonly set_name: string;
  /** 세트 개수 (럭키 아이템 포함) */
  readonly total_set_count: number;
  /** 적용 중인 세트 효과 정보 */
  readonly set_effect_info: readonly SetEffectOption[];
}

/** 연무장 장착 장비(캐시 장비 제외) 정보 */
export interface BattlePracticeItem {
  /** 장착 장비 정보 */
  readonly item_equipment_object: {
    /** 장비 정보 */
    readonly item_equipment: readonly BattlePracticeItemEquipment[];
    /** 칭호 정보 */
    readonly title: BattlePracticeTitle | null;
    /** 에반 드래곤 장비 정보 (에반인 경우 응답) */
    readonly dragon_equipment: readonly BattlePracticeSubItemEquipment[];
    /** 메카닉 장비 정보 (메카닉인 경우 응답) */
    readonly mechanic_equipment: readonly BattlePracticeSubItemEquipment[];
  };
  /** 적용 세트 효과 정보 */
  readonly set_effect_object: {
    /** 세트 효과 정보 */
    readonly set_effect: readonly BattlePracticeSetEffect[];
  };
}

/** 연무장 캐시 장비 개별 정보 */
export interface BattlePracticeCashItemEquipment {
  /** 캐시 장비 부위 명 */
  readonly cash_item_equipment_part: string;
  /** 캐시 장비 슬롯 위치 */
  readonly cash_item_equipment_slot: string;
  /** 캐시 장비 명 */
  readonly cash_item_name: string;
  /** 캐시 장비 아이콘 */
  readonly cash_item_icon: string;
  /** 캐시 장비 설명 */
  readonly cash_item_description: string | null;
  /** 캐시 장비의 옵션 */
  readonly cash_item_option: readonly CashItemOption[];
  /** 캐시 장비 유효 기간 (KST) */
  readonly date_expire: string | null;
  /** 캐시 장비 옵션 유효 기간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기) */
  readonly date_option_expire: string | null;
}

/** 연무장 월드 공유 마스터라벨 장착 장비 */
export interface BattlePracticeWorldShareMasterLabelItem extends BattlePracticeCashItemEquipment {
  /** 캐시 장비 라벨 정보 */
  readonly cash_item_label: string | null;
}

/** 연무장 장착 캐시 장비 정보 */
export interface BattlePracticeCashItem {
  /** 장착 중인 캐시 장비 */
  readonly cash_item_equipment_base: readonly BattlePracticeCashItemEquipment[];
  /** 제로인 경우 베타, 엔젤릭버스터인 경우 드레스 업 모드에서 장착 중인 캐시 장비 */
  readonly additional_cash_item_equipment_base: readonly BattlePracticeCashItemEquipment[];
  /** 월드 공유 마스터라벨 슬롯 활성화 여부 ("0": 미활성, "1": 활성). 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_master_label_activate_flag?: string | undefined;
  /** 월드 공유 마스터라벨 장착 장비. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_master_label_base?:
    | readonly BattlePracticeWorldShareMasterLabelItem[]
    | undefined;
}

/** 연무장 펫 정보 (펫 미장착 슬롯은 null) */
export interface BattlePracticePet {
  /** 활성화된 펫 유형 ("0": 캐릭터 펫, "1": 월드 공유 펫). 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly pet_activate_flag?: string | undefined;
  /** 펫1 명 */
  readonly pet_1_name: string | null;
  /** 펫1 닉네임 */
  readonly pet_1_nickname: string | null;
  /** 펫1 아이콘 */
  readonly pet_1_icon: string | null;
  /** 펫1 설명 */
  readonly pet_1_description: string | null;
  /** 펫1 장착 정보 */
  readonly pet_1_equipment: PetEquipmentItem | null;
  /** 펫1 버프 자동스킬 정보 */
  readonly pet_1_auto_skill: PetAutoSkill | null;
  /** 펫1 원더 펫 종류 */
  readonly pet_1_pet_type: string | null;
  /** 펫1 펫 보유 스킬 */
  readonly pet_1_skill: readonly string[];
  /** 펫1 마법의 시간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기) */
  readonly pet_1_date_expire: string | null;
  /** 펫2 명 */
  readonly pet_2_name: string | null;
  /** 펫2 닉네임 */
  readonly pet_2_nickname: string | null;
  /** 펫2 아이콘 */
  readonly pet_2_icon: string | null;
  /** 펫2 설명 */
  readonly pet_2_description: string | null;
  /** 펫2 장착 정보 */
  readonly pet_2_equipment: PetEquipmentItem | null;
  /** 펫2 버프 자동스킬 정보 */
  readonly pet_2_auto_skill: PetAutoSkill | null;
  /** 펫2 원더 펫 종류 */
  readonly pet_2_pet_type: string | null;
  /** 펫2 펫 보유 스킬 */
  readonly pet_2_skill: readonly string[];
  /** 펫2 마법의 시간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기) */
  readonly pet_2_date_expire: string | null;
  /** 펫3 명 */
  readonly pet_3_name: string | null;
  /** 펫3 닉네임 */
  readonly pet_3_nickname: string | null;
  /** 펫3 아이콘 */
  readonly pet_3_icon: string | null;
  /** 펫3 설명 */
  readonly pet_3_description: string | null;
  /** 펫3 장착 정보 */
  readonly pet_3_equipment: PetEquipmentItem | null;
  /** 펫3 버프 자동스킬 정보 */
  readonly pet_3_auto_skill: PetAutoSkill | null;
  /** 펫3 원더 펫 종류 */
  readonly pet_3_pet_type: string | null;
  /** 펫3 펫 보유 스킬 */
  readonly pet_3_skill: readonly string[];
  /** 펫3 마법의 시간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기) */
  readonly pet_3_date_expire: string | null;
  /** 월드 공유 펫1 명. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_name?: string | null | undefined;
  /** 월드 공유 펫1 닉네임. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_nickname?: string | null | undefined;
  /** 월드 공유 펫1 아이콘. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_icon?: string | null | undefined;
  /** 월드 공유 펫1 설명. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_description?: string | null | undefined;
  /** 월드 공유 펫1 원더 펫 종류. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_pet_type?: string | null | undefined;
  /** 월드 공유 펫1 장착 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_equipment?: PetEquipmentItem | null | undefined;
  /** 월드 공유 펫1 버프 자동스킬 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_auto_skill?: PetAutoSkill | null | undefined;
  /** 월드 공유 펫1 펫 보유 스킬. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_skill?: readonly string[] | undefined;
  /** 월드 공유 펫1 마법의 시간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기). 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_1_date_expire?: string | null | undefined;
  /** 월드 공유 펫2 명. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_name?: string | null | undefined;
  /** 월드 공유 펫2 닉네임. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_nickname?: string | null | undefined;
  /** 월드 공유 펫2 아이콘. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_icon?: string | null | undefined;
  /** 월드 공유 펫2 설명. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_description?: string | null | undefined;
  /** 월드 공유 펫2 원더 펫 종류. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_pet_type?: string | null | undefined;
  /** 월드 공유 펫2 장착 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_equipment?: PetEquipmentItem | null | undefined;
  /** 월드 공유 펫2 버프 자동스킬 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_auto_skill?: PetAutoSkill | null | undefined;
  /** 월드 공유 펫2 펫 보유 스킬. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_skill?: readonly string[] | undefined;
  /** 월드 공유 펫2 마법의 시간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기). 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_2_date_expire?: string | null | undefined;
  /** 월드 공유 펫3 명. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_name?: string | null | undefined;
  /** 월드 공유 펫3 닉네임. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_nickname?: string | null | undefined;
  /** 월드 공유 펫3 아이콘. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_icon?: string | null | undefined;
  /** 월드 공유 펫3 설명. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_description?: string | null | undefined;
  /** 월드 공유 펫3 원더 펫 종류. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_pet_type?: string | null | undefined;
  /** 월드 공유 펫3 장착 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_equipment?: PetEquipmentItem | null | undefined;
  /** 월드 공유 펫3 버프 자동스킬 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_auto_skill?: PetAutoSkill | null | undefined;
  /** 월드 공유 펫3 펫 보유 스킬. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_skill?: readonly string[] | undefined;
  /** 월드 공유 펫3 마법의 시간 (KST, 시간 단위 데이터로 분은 일괄 0으로 표기). 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly world_share_pet_3_date_expire?: string | null | undefined;
  /** 루나 쁘띠 펫 스킬 정보. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly petite_luna_pet_skill?: readonly PetiteLunaPetSkill[] | undefined;
}

/** 연무장 HEXA 코어 개별 정보 */
export interface BattlePracticeHexaCore {
  /** 코어 명 */
  readonly hexa_core_name: string;
  /** 코어 레벨 */
  readonly hexa_core_level: number;
  /** 코어 타입 */
  readonly hexa_core_type: string;
  /** 연결된 스킬 */
  readonly linked_skill: readonly HexaLinkedSkill[];
}

/** 연무장 HEXA 매트릭스 정보 */
export interface BattlePracticeHexaMatrix {
  /** HEXA 매트릭스 코어 정보 */
  readonly hexa_core_object: {
    /** HEXA 코어 정보 */
    readonly character_hexa_core_equipment: readonly BattlePracticeHexaCore[];
  };
  /** HEXA 매트릭스 스탯 정보 */
  readonly hexa_matrix_stat_object: {
    /** HEXA 스탯 I 코어 정보 */
    readonly character_hexa_stat_core: readonly HexaStatCore[];
    /** HEXA 스탯 II 코어 정보 */
    readonly character_hexa_stat_core_2: readonly HexaStatCore[];
    /** HEXA 스탯 III 코어 정보 */
    readonly character_hexa_stat_core_3: readonly HexaStatCore[];
  };
}

/** 예비 특수 반지 슬롯에 장착한 특수 반지 정보 */
export interface BattlePracticeRingReserveSkill {
  /** 예비 특수 반지 슬롯에 장착한 특수 반지 (null: 미장착) */
  readonly special_ring_reserve_name: string | null;
  /** 예비 특수 반지 슬롯에 장착한 특수 반지 레벨 */
  readonly special_ring_reserve_level: number;
  /** 예비 특수 반지 슬롯에 장착한 특수 반지 아이콘 */
  readonly special_ring_reserve_icon: string | null;
  /** 예비 특수 반지 슬롯에 장착한 특수 반지 설명 */
  readonly special_ring_reserve_description: string | null;
}

/** 연무장 스킬 개별 정보. 일반 캐릭터 조회의 스킬과 달리 효과 설명이 비어 올 수 있다. */
export interface BattlePracticeSkillInfo extends Omit<LinkSkillInfo, 'skill_effect'> {
  /** 스킬 효과 (효과 설명이 없는 스킬이면 null) */
  readonly skill_effect: string | null;
}

/** 연무장 유니온 공격대 정보 */
export interface BattlePracticeUnionRaider {
  /** 유니온 공격대원 효과 */
  readonly union_raider_stat: readonly string[];
  /** 유니온 공격대 점령 효과. 2026-11-25 리플레이 실제 응답에는 없는 경우가 있었다 */
  readonly union_occupied_stat?: readonly string[] | undefined;
  /** 적용 중인 유니온 스탯 효과. 일반 캐릭터 조회에는 있지만 2026-11-24 연무장 리플레이 실제 응답에는 없었다 */
  readonly union_state_stat?: readonly string[] | undefined;
}

/** 연무장 유니온 아티팩트 효과 정보 */
export interface BattlePracticeUnionArtifactEffect {
  /** 아티팩트 효과 명 */
  readonly name: string;
  /** 아티팩트 효과 레벨 */
  readonly level: number;
}

/** 연무장 유니온 챔피언 휘장 정보 */
export interface BattlePracticeChampionBadge {
  /** 유니온 챔피언 휘장 효과 */
  readonly stat: string;
}

/**
 * GET /maplestory/v1/battle-practice/character-info 응답.
 *
 * 리플레이 등록 시점의 캐릭터 정보를 한 번에 담는다. 최상위 키는 모두 `*_object` 래퍼다.
 */
export interface BattlePracticeCharacterInfo {
  /** 기본 정보 */
  readonly basic_object: BattlePracticeBasic;
  /** 스탯 관련 정보 */
  readonly stat_object: BattlePracticeStat;
  /** 하이퍼 스탯 정보 */
  readonly hyper_stat_object: {
    /** 하이퍼 스탯 정보 */
    readonly hyper_stat: readonly BattlePracticeHyperStatInfo[];
  };
  /** 성향 정보 */
  readonly propensity_object: BattlePracticePropensity;
  /** 어빌리티 정보 */
  readonly ability_object: {
    /** 어빌리티 정보 */
    readonly ability_info: readonly AbilityInfo[];
  };
  /** 장착 장비(캐시 장비 제외) 정보 */
  readonly item_object: BattlePracticeItem;
  /** 장착 캐시 장비 정보 */
  readonly cash_item_object: BattlePracticeCashItem;
  /** 펫 정보 */
  readonly pet_object: BattlePracticePet;
  /** 스킬 정보 */
  readonly skill_object: {
    /** 스킬 정보 */
    readonly character_skill: readonly BattlePracticeSkillInfo[];
  };
  /** 링크 스킬 정보 */
  readonly link_skill_object: {
    /** 링크 스킬 정보 */
    readonly character_link_skill: readonly LinkSkillInfo[];
    /** 내 링크 스킬 정보 */
    readonly character_owned_link_skill: LinkSkillInfo | null;
  };
  /** V 매트릭스 정보 */
  readonly v_matrix_object: {
    /** V코어 정보 */
    readonly character_v_core_equipment: readonly VCoreEquipment[];
  };
  /** HEXA 매트릭스 정보 */
  readonly hexa_matrix_object: BattlePracticeHexaMatrix;
  /** 예비 특수 반지 슬롯에 장착한 특수 반지 정보 */
  readonly ring_reserve_skill_object: BattlePracticeRingReserveSkill;
  /** 유니온 공격대 정보 */
  readonly union_raider_object: BattlePracticeUnionRaider;
  /** 유니온 아티팩트 정보 */
  readonly union_artifact_object: {
    /** 아티팩트 효과 정보 */
    readonly union_artifact_effect: readonly BattlePracticeUnionArtifactEffect[];
  };
  /** 유니온 챔피언 정보 */
  readonly union_champion_object: {
    /** 유니온 챔피언 휘장 */
    readonly champion_badge_total_info: readonly BattlePracticeChampionBadge[];
  };
  /** 길드 정보 */
  readonly guild_object: {
    /** 길드 스킬 목록 */
    readonly guild_skill: readonly GuildSkill[];
    /** 노블레스 스킬 목록 */
    readonly guild_noblesse_skill: readonly GuildSkill[];
  };
}
