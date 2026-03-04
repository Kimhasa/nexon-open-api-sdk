import type { OCID, NexonDate } from '../../../core/types/branded.js';

// ─── GET /maplestory/v1/character/list ───────────────────────────────────────

/** 계정 내 캐릭터 요약 정보 */
export interface CharacterSummary {
  /** 캐릭터 식별자 */
  readonly ocid: OCID;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}

/** 메이플스토리 계정 정보 */
export interface AccountCharacterList {
  /** 메이플스토리 계정 식별자 */
  readonly account_id: string;
  /** 캐릭터 목록 */
  readonly character_list: CharacterSummary[];
}

/** GET /maplestory/v1/character/list 응답 */
export interface CharacterList {
  /** 메이플스토리 계정 목록 */
  readonly account_list: AccountCharacterList[];
}

// ─── GET /maplestory/v1/character/basic ──────────────────────────────────────

/** GET /maplestory/v1/character/basic 응답 */
export interface CharacterBasic {
  /** 조회 기준일 (KST, 일 단위 데이터로 시, 분은 일괄 0으로 표기) */
  readonly date: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 전직 차수 */
  readonly character_class_level: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 현재 레벨에서 보유한 경험치 */
  readonly character_exp: number;
  /** 현재 레벨에서 경험치 퍼센트 */
  readonly character_exp_rate: string;
  /** 캐릭터 소속 길드 명 */
  readonly character_guild_name: string;
  /** 캐릭터 외형 이미지 URL */
  readonly character_image: string;
  /** 캐릭터 생성일 (KST) */
  readonly character_date_create: string;
  /** 최근 7일간 접속 여부 ("true": 접속, "false": 미접속) */
  readonly access_flag: string;
  /** 해방 퀘스트 완료 여부 ("0": 미완료, "1": 제네시스 해방, "2": 데스티니 1차 해방) */
  readonly liberation_quest_clear: string;
}

// ─── GET /maplestory/v1/character/popularity ─────────────────────────────────

/** GET /maplestory/v1/character/popularity 응답 */
export interface CharacterPopularity {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 인기도 */
  readonly popularity: number;
}

// ─── GET /maplestory/v1/character/stat ───────────────────────────────────────

/** 개별 스탯 정보 */
export interface FinalStat {
  /** 스탯 명 (예: "최소 스탯 공격력") */
  readonly stat_name: string;
  /** 스탯 값 (예: "43.75") */
  readonly stat_value: string;
}

/** GET /maplestory/v1/character/stat 응답 */
export interface CharacterStat {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 현재 스탯 정보 */
  readonly final_stat: FinalStat[];
  /** 잔여 AP */
  readonly remain_ap: number;
}

// ─── GET /maplestory/v1/character/hyper-stat ─────────────────────────────────

/** 하이퍼스탯 개별 정보 */
export interface HyperStatPreset {
  /** 스탯 종류 */
  readonly stat_type: string;
  /** 스탯 투자 포인트 */
  readonly stat_point: number;
  /** 스탯 레벨 */
  readonly stat_level: number;
  /** 스탯 상승량 */
  readonly stat_increase: string;
}

/** GET /maplestory/v1/character/hyper-stat 응답 */
export interface CharacterHyperStat {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: string;
  /** 사용 가능한 최대 하이퍼스탯 포인트 */
  readonly use_available_hyper_stat: number;
  /** 1번 프리셋 하이퍼 스탯 정보 */
  readonly hyper_stat_preset_1: HyperStatPreset[];
  /** 1번 프리셋 잔여 포인트 */
  readonly hyper_stat_preset_1_remain_point: number;
  /** 2번 프리셋 하이퍼 스탯 정보 */
  readonly hyper_stat_preset_2: HyperStatPreset[];
  /** 2번 프리셋 잔여 포인트 */
  readonly hyper_stat_preset_2_remain_point: number;
  /** 3번 프리셋 하이퍼 스탯 정보 */
  readonly hyper_stat_preset_3: HyperStatPreset[];
  /** 3번 프리셋 잔여 포인트 */
  readonly hyper_stat_preset_3_remain_point: number;
}

// ─── GET /maplestory/v1/character/propensity ─────────────────────────────────

/** GET /maplestory/v1/character/propensity 응답 */
export interface CharacterPropensity {
  /** 조회 기준일 (KST) */
  readonly date: string;
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

// ─── GET /maplestory/v1/character/ability ────────────────────────────────────

/** 개별 어빌리티 정보 */
export interface AbilityInfo {
  /** 어빌리티 번호 */
  readonly ability_no: string;
  /** 어빌리티 등급 */
  readonly ability_grade: string;
  /** 어빌리티 옵션 및 수치 */
  readonly ability_value: string;
}

/** 어빌리티 프리셋 정보 */
export interface AbilityPreset {
  /** 어빌리티 등급 */
  readonly ability_preset_grade: string;
  /** 어빌리티 정보 */
  readonly ability_info: AbilityInfo[];
}

/** GET /maplestory/v1/character/ability 응답 */
export interface CharacterAbility {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 어빌리티 등급 */
  readonly ability_grade: string;
  /** 어빌리티 정보 */
  readonly ability_info: AbilityInfo[];
  /** 보유 명성치 */
  readonly remain_fame: number;
  /** 적용 중인 어빌리티 프리셋 번호 */
  readonly preset_no: number;
  /** 1번 프리셋 */
  readonly ability_preset_1: AbilityPreset;
  /** 2번 프리셋 */
  readonly ability_preset_2: AbilityPreset;
  /** 3번 프리셋 */
  readonly ability_preset_3: AbilityPreset;
}

// ─── GET /maplestory/v1/character/item-equipment ─────────────────────────────

/** 장비 최종 옵션 (total/base 공용) */
export interface ItemTotalOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
  readonly boss_damage: string;
  readonly ignore_monster_armor: string;
  readonly all_stat: string;
  readonly damage: string;
  readonly equipment_level_decrease: number;
  readonly max_hp_rate: string;
  readonly max_mp_rate: string;
}

/** 장비 기본 옵션 */
export interface ItemBaseOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
  readonly boss_damage: string;
  readonly ignore_monster_armor: string;
  readonly all_stat: string;
  readonly max_hp_rate: string;
  readonly max_mp_rate: string;
  /** 기본 착용 레벨 */
  readonly base_equipment_level: number;
}

/** 장비 특별(익셉셔널) 옵션 */
export interface ItemExceptionalOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  /** 익셉셔널 강화 적용 횟수 */
  readonly exceptional_upgrade?: number | undefined;
}

/** 장비 추가 옵션 */
export interface ItemAddOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
  readonly boss_damage: string;
  readonly damage: string;
  readonly all_stat: string;
  readonly equipment_level_decrease: number;
}

/** 장비 기타 옵션 (주문서/스타포스 등) */
export interface ItemEtcOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
  readonly armor: string;
  readonly speed: string;
  readonly jump: string;
}

/** 장착 장비 개별 정보 */
export interface ItemEquipment {
  /** 장비 부위 명 */
  readonly item_equipment_part: string;
  /** 장비 슬롯 위치 */
  readonly item_equipment_slot: string;
  /** 장비 명 */
  readonly item_name: string;
  /** 장비 아이콘 */
  readonly item_icon: string;
  /** 장비 설명 */
  readonly item_description: string;
  /** 장비 외형 */
  readonly item_shape_name: string;
  /** 장비 외형 아이콘 */
  readonly item_shape_icon: string;
  /** 전용 성별 */
  readonly item_gender: string;
  /** 장비 최종 옵션 */
  readonly item_total_option: ItemTotalOption;
  /** 장비 기본 옵션 */
  readonly item_base_option: ItemBaseOption;
  /** 잠재능력 봉인 여부 ("true": 봉인, "false": 봉인 없음) */
  readonly potential_option_flag: string;
  /** 에디셔널 잠재능력 봉인 여부 */
  readonly additional_potential_option_flag: string;
  /** 잠재능력 등급 */
  readonly potential_option_grade: string;
  /** 에디셔널 잠재능력 등급 */
  readonly additional_potential_option_grade: string;
  /** 잠재능력 첫 번째 옵션 */
  readonly potential_option_1: string;
  /** 잠재능력 두 번째 옵션 */
  readonly potential_option_2: string;
  /** 잠재능력 세 번째 옵션 */
  readonly potential_option_3: string;
  /** 에디셔널 잠재능력 첫 번째 옵션 */
  readonly additional_potential_option_1: string;
  /** 에디셔널 잠재능력 두 번째 옵션 */
  readonly additional_potential_option_2: string;
  /** 에디셔널 잠재능력 세 번째 옵션 */
  readonly additional_potential_option_3: string;
  /** 착용 레벨 증가 */
  readonly equipment_level_increase: number;
  /** 장비 특별 옵션 */
  readonly item_exceptional_option: ItemExceptionalOption;
  /** 장비 추가 옵션 */
  readonly item_add_option: ItemAddOption;
  /** 성장 경험치 */
  readonly growth_exp: number;
  /** 성장 레벨 */
  readonly growth_level: number;
  /** 주문서 횟수 */
  readonly scroll_upgrade: string;
  /** 가위 사용 가능 횟수 (교환 불가 장비는 255) */
  readonly cuttable_count: string;
  /** 황금 망치 재련 적용 ("1": 적용) */
  readonly golden_hammer_flag: string;
  /** 복구 가능 횟수 */
  readonly scroll_resilience_count: string;
  /** 주문서 잔여 횟수 */
  readonly scroll_upgradable_count: string;
  /** 소울 명 */
  readonly soul_name: string;
  /** 소울 옵션 */
  readonly soul_option: string;
  /** 장비 기타 옵션 */
  readonly item_etc_option: ItemEtcOption;
  /** 스타포스 강화 단계 */
  readonly starforce: string;
  /** 놀장강 사용 여부 ("0": 미사용, "1": 사용) */
  readonly starforce_scroll_flag: string;
  /** 스타포스 옵션 */
  readonly item_starforce_option: ItemEtcOption;
  /** 특수 반지 레벨 */
  readonly special_ring_level: number;
  /** 장비 유효 기간 ("expired": 만료, null: 무제한) */
  readonly date_expire: string | null;
  /** 프리스타일 쿠폰 적용 여부 ("0": 미적용, "1": 적용) */
  readonly freestyle_flag: string;
}

/** 프리셋 장비 정보 (item_equipment_slot 대신 equipment_slot 사용) */
export interface PresetItemEquipment {
  readonly item_equipment_part: string;
  /** 프리셋에서는 equipment_slot 사용 */
  readonly equipment_slot: string;
  readonly item_name: string;
  readonly item_icon: string;
  readonly item_description: string;
  readonly item_shape_name: string;
  readonly item_shape_icon: string;
  readonly item_gender: string;
  readonly item_total_option: ItemTotalOption;
  readonly item_base_option: ItemBaseOption;
  readonly potential_option_grade: string;
  readonly additional_potential_option_grade: string;
  readonly potential_option_1: string;
  readonly potential_option_2: string;
  readonly potential_option_3: string;
  readonly additional_potential_option_1: string;
  readonly additional_potential_option_2: string;
  readonly additional_potential_option_3: string;
  readonly equipment_level_increase: number;
  readonly item_exceptional_option: ItemExceptionalOption;
  readonly item_add_option: ItemAddOption;
  readonly growth_exp: number;
  readonly growth_level: number;
  readonly scroll_upgrade: string;
  readonly cuttable_count: string;
  readonly golden_hammer_flag: string;
  readonly scroll_resilience_count: string;
  readonly scroll_upgradable_count: string;
  readonly soul_name: string;
  readonly soul_option: string;
  readonly item_etc_option: ItemEtcOption;
  readonly starforce: string;
  readonly starforce_scroll_flag: string;
  readonly item_starforce_option: ItemEtcOption;
  readonly special_ring_level: number;
  readonly date_expire: string | null;
  readonly freestyle_flag: string;
}

/** 칭호 정보 */
export interface TitleInfo {
  /** 칭호 장비 명 */
  readonly title_name: string;
  /** 칭호 아이콘 */
  readonly title_icon: string;
  /** 칭호 설명 */
  readonly title_description: string;
  /** 칭호 유효 기간 ("expired": 만료, null: 무제한) */
  readonly date_expire: string | null;
  /** 칭호 옵션 유효 기간 */
  readonly date_option_expire: string | null;
  /** 외형 설정 칭호 장비 명 */
  readonly title_shape_name: string;
  /** 외형 설정 칭호 아이콘 */
  readonly title_shape_icon: string;
  /** 외형 설정 칭호 설명 */
  readonly title_shape_description: string;
}

/** 훈장 외형 정보 */
export interface MedalShape {
  /** 외형 설정 훈장 장비 명 */
  readonly medal_shape_name: string;
  /** 외형 설정 훈장 아이콘 */
  readonly medal_shape_icon: string;
  /** 외형 설정 훈장 설명 */
  readonly medal_shape_description: string;
  /** 모루 적용 장비 명 */
  readonly medal_shape_changed_name: string;
  /** 모루 적용 아이콘 */
  readonly medal_shape_changed_icon: string;
  /** 모루 적용 훈장 설명 */
  readonly medal_shape_changed_description: string;
}

/** GET /maplestory/v1/character/item-equipment 응답 */
export interface CharacterItemEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 적용 중인 장비 프리셋 번호 */
  readonly preset_no: number;
  /** 장착 장비 정보 */
  readonly item_equipment: ItemEquipment[];
  /** 1번 프리셋 장비 정보 */
  readonly item_equipment_preset_1: PresetItemEquipment[];
  /** 2번 프리셋 장비 정보 */
  readonly item_equipment_preset_2: PresetItemEquipment[];
  /** 3번 프리셋 장비 정보 */
  readonly item_equipment_preset_3: PresetItemEquipment[];
  /** 칭호 정보 */
  readonly title: TitleInfo;
  /** 훈장 외형 정보 */
  readonly medal_shape: MedalShape;
  /** 에반 드래곤 장비 정보 (에반인 경우 응답) */
  readonly dragon_equipment: PresetItemEquipment[];
  /** 메카닉 장비 정보 (메카닉인 경우 응답) */
  readonly mechanic_equipment: PresetItemEquipment[];
}

// ─── GET /maplestory/v1/character/cashitem-equipment ─────────────────────────

/** 캐시 장비 컬러링프리즘 정보 */
export interface CashItemColoringPrism {
  /** 컬러링프리즘 색상 범위 */
  readonly color_range: string;
  /** 컬러링프리즘 색조 */
  readonly hue: number;
  /** 컬러링프리즘 채도 */
  readonly saturation: number;
  /** 컬러링프리즘 명도 */
  readonly value: number;
}

/** 캐시 장비 옵션 정보 */
export interface CashItemOption {
  /** 옵션 타입 */
  readonly option_type: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 캐시 장비 개별 정보 */
export interface CashItemEquipmentItem {
  /** 캐시 장비 부위 명 */
  readonly cash_item_equipment_part: string;
  /** 캐시 장비 슬롯 위치 */
  readonly cash_item_equipment_slot: string;
  /** 캐시 장비 명 */
  readonly cash_item_name: string;
  /** 캐시 장비 아이콘 */
  readonly cash_item_icon: string;
  /** 캐시 장비 설명 */
  readonly cash_item_description: string;
  /** 캐시 장비 옵션 */
  readonly cash_item_option: CashItemOption[];
  /** 캐시 장비 유효 기간 (null: 무제한) */
  readonly date_expire: string | null;
  /** 캐시 장비 옵션 유효 기간 (null: 무제한) */
  readonly date_option_expire: string | null;
  /** 캐시 장비 라벨 정보 */
  readonly cash_item_label: string;
  /** 캐시 장비 컬러링프리즘 정보 (null: 미적용) */
  readonly cash_item_coloring_prism: CashItemColoringPrism | null;
  /** 캐시 장비 이펙트프리즘 정보 */
  readonly cash_item_effect_prism: CashItemColoringPrism | null;
  /** 아이템 장착 가능 성별 */
  readonly item_gender: string;
  /** 캐시 장비 스킬 (예: 스킬 리스트) */
  readonly cash_item_skills: string[];
  /** 프리스타일 쿠폰 적용 여부 ("0": 미적용, "1": 적용) */
  readonly freestyle_flag: string;
  /** 감정 표현 이름 */
  readonly emotion_name: string;
}

/** GET /maplestory/v1/character/cashitem-equipment 응답 */
export interface CharacterCashItemEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 룩모드 */
  readonly character_look_mode: string;
  /** 적용 중인 캐시 장비 프리셋 번호 */
  readonly preset_no: number;
  /** 장착 캐시 장비 정보 */
  readonly cash_item_equipment_base: CashItemEquipmentItem[];
  /** 1번 프리셋 캐시 장비 정보 */
  readonly cash_item_equipment_preset_1: CashItemEquipmentItem[];
  /** 2번 프리셋 캐시 장비 정보 */
  readonly cash_item_equipment_preset_2: CashItemEquipmentItem[];
  /** 3번 프리셋 캐시 장비 정보 */
  readonly cash_item_equipment_preset_3: CashItemEquipmentItem[];
  /** 제로/엔젤릭버스터 추가 장착 캐시 장비 정보 */
  readonly additional_cash_item_equipment_base: CashItemEquipmentItem[];
  /** 제로/엔젤릭버스터 1번 프리셋 추가 캐시 장비 정보 */
  readonly additional_cash_item_equipment_preset_1: CashItemEquipmentItem[];
  /** 제로/엔젤릭버스터 2번 프리셋 추가 캐시 장비 정보 */
  readonly additional_cash_item_equipment_preset_2: CashItemEquipmentItem[];
  /** 제로/엔젤릭버스터 3번 프리셋 추가 캐시 장비 정보 */
  readonly additional_cash_item_equipment_preset_3: CashItemEquipmentItem[];
}

// ─── GET /maplestory/v1/character/symbol-equipment ──────────────────────────

/** 심볼 개별 정보 */
export interface SymbolInfo {
  /** 심볼 명 */
  readonly symbol_name: string;
  /** 심볼 아이콘 */
  readonly symbol_icon: string;
  /** 심볼 설명 */
  readonly symbol_description: string;
  /** 심볼로 인한 추가 효과 (예: 아케인포스) */
  readonly symbol_force: string;
  /** 심볼 레벨 */
  readonly symbol_level: number;
  /** STR 증가량 */
  readonly symbol_str: string;
  /** DEX 증가량 */
  readonly symbol_dex: string;
  /** INT 증가량 */
  readonly symbol_int: string;
  /** LUK 증가량 */
  readonly symbol_luk: string;
  /** HP 증가량 */
  readonly symbol_hp: string;
  /** 드롭률 증가 (%) */
  readonly symbol_drop_rate: string;
  /** 메소 획득량 증가 (%) */
  readonly symbol_meso_rate: string;
  /** 경험치 획득량 증가 (%) */
  readonly symbol_exp_rate: string;
  /** 현재 성장치 */
  readonly symbol_growth_count: number;
  /** 다음 레벨까지 필요 성장치 */
  readonly symbol_require_growth_count: number;
}

/** GET /maplestory/v1/character/symbol-equipment 응답 */
export interface CharacterSymbolEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 심볼 정보 */
  readonly symbol: SymbolInfo[];
}

// ─── GET /maplestory/v1/character/set-effect ─────────────────────────────────

/** 세트 효과 옵션 정보 */
export interface SetEffectOption {
  /** 세트 효과 레벨 (장비 수) */
  readonly set_count: number;
  /** 세트 효과 */
  readonly set_option: string;
}

/** 세트 효과 정보 */
export interface SetEffectInfo {
  /** 세트 효과 명 */
  readonly set_name: string;
  /** 세트 개수 (럭키 아이템 포함) */
  readonly total_set_count: number;
  /** 적용 중인 세트 효과 정보 */
  readonly set_effect_info: SetEffectOption[];
  /** 모든 세트 효과 정보 */
  readonly set_option_full: SetEffectOption[];
}

/** GET /maplestory/v1/character/set-effect 응답 */
export interface CharacterSetEffect {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 세트 효과 정보 */
  readonly set_effect: SetEffectInfo[];
}

// ─── GET /maplestory/v1/character/beauty-equipment ──────────────────────────

/** 헤어 정보 (캐릭터/안드로이드 공용) */
export interface HairInfo {
  /** 헤어 명 */
  readonly hair_name: string;
  /** 헤어 베이스 컬러 */
  readonly base_color: string;
  /** 헤어 믹스 컬러 */
  readonly mix_color: string;
  /** 헤어 믹스 컬러의 염색 비율 */
  readonly mix_rate: string;
  /** 프리스타일 쿠폰 적용 여부 ("0": 미적용, "1": 적용) */
  readonly freestyle_flag: string;
}

/** 성형 정보 (캐릭터/안드로이드 공용) */
export interface FaceInfo {
  /** 성형 명 */
  readonly face_name: string;
  /** 성형 베이스 컬러 */
  readonly base_color: string;
  /** 성형 믹스 컬러 */
  readonly mix_color: string;
  /** 성형 믹스 컬러의 염색 비율 */
  readonly mix_rate: string;
  /** 프리스타일 쿠폰 적용 여부 ("0": 미적용, "1": 적용) */
  readonly freestyle_flag: string;
}

/** 피부 정보 (캐릭터/안드로이드 공용) */
export interface SkinInfo {
  /** 피부 명 */
  readonly skin_name: string;
  /** 색상 계열 */
  readonly color_style: string;
  /** 피부 색조 */
  readonly hue: number;
  /** 피부 채도 */
  readonly saturation: number;
  /** 피부 명도 */
  readonly brightness: number;
}

/** GET /maplestory/v1/character/beauty-equipment 응답 */
export interface CharacterBeautyEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 헤어 정보 (제로: 알파, 엔젤릭버스터: 일반 모드) */
  readonly character_hair: HairInfo;
  /** 캐릭터 성형 정보 (제로: 알파, 엔젤릭버스터: 일반 모드) */
  readonly character_face: FaceInfo;
  /** 캐릭터 피부 정보 (제로: 알파, 엔젤릭버스터: 일반 모드) */
  readonly character_skin: SkinInfo;
  /** 추가 헤어 정보 (제로: 베타, 엔젤릭버스터: 드레스 업 모드) */
  readonly additional_character_hair: HairInfo;
  /** 추가 성형 정보 (제로: 베타, 엔젤릭버스터: 드레스 업 모드) */
  readonly additional_character_face: FaceInfo;
  /** 추가 피부 정보 (제로: 베타, 엔젤릭버스터: 드레스 업 모드) */
  readonly additional_character_skin: SkinInfo;
}

// ─── GET /maplestory/v1/character/android-equipment ─────────────────────────

/** 안드로이드 캐시 장비 개별 정보 */
export interface AndroidCashItem {
  /** 캐시 아이템 부위 명 */
  readonly cash_item_equipment_part: string;
  /** 캐시 아이템 슬롯 위치 */
  readonly cash_item_equipment_slot: string;
  /** 캐시 아이템 명 */
  readonly cash_item_name: string;
  /** 캐시 아이템 아이콘 */
  readonly cash_item_icon: string;
  /** 캐시 아이템 설명 */
  readonly cash_item_description: string;
  /** 캐시 아이템 옵션 */
  readonly cash_item_option: CashItemOption[];
  /** 캐시 아이템 유효 기간 ("expired": 만료, null: 무제한) */
  readonly date_expire: string | null;
  /** 캐시 아이템 옵션 유효 기간 ("expired": 만료, null: 무제한) */
  readonly date_option_expire: string | null;
  /** 캐시 아이템 라벨 정보 */
  readonly cash_item_label: string;
  /** 캐시 아이템 컬러링프리즘 정보 (null: 미적용) */
  readonly cash_item_coloring_prism: CashItemColoringPrism | null;
  /** 아이템 장착 가능 성별 */
  readonly android_item_gender: string;
  /** 프리스타일 쿠폰 적용 여부 ("0": 미적용, "1": 적용) */
  readonly freestyle_flag: string;
}

/** 안드로이드 프리셋 정보 */
export interface AndroidPresetInfo {
  /** 안드로이드 명 */
  readonly android_name: string;
  /** 안드로이드 닉네임 */
  readonly android_nickname: string;
  /** 안드로이드 아이콘 */
  readonly android_icon: string;
  /** 안드로이드 아이템 설명 */
  readonly android_description: string;
  /** 안드로이드 성별 */
  readonly android_gender: string;
  /** 안드로이드 등급 */
  readonly android_grade: string;
  /** 안드로이드 피부 정보 */
  readonly android_skin: SkinInfo;
  /** 안드로이드 헤어 정보 */
  readonly android_hair: HairInfo;
  /** 안드로이드 성형 정보 */
  readonly android_face: FaceInfo;
  /** 이어센서 클립 적용 여부 */
  readonly android_ear_sensor_clip_flag: string;
  /** 비인간형 안드로이드 여부 */
  readonly android_non_humanoid_flag: string;
  /** 잡화상점 기능 이용 가능 여부 */
  readonly android_shop_usable_flag: string;
}

/** GET /maplestory/v1/character/android-equipment 응답 */
export interface CharacterAndroidEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 안드로이드 명 */
  readonly android_name: string;
  /** 안드로이드 닉네임 */
  readonly android_nickname: string;
  /** 안드로이드 아이콘 */
  readonly android_icon: string;
  /** 안드로이드 아이템 설명 */
  readonly android_description: string;
  /** 안드로이드 헤어 정보 */
  readonly android_hair: HairInfo;
  /** 안드로이드 성형 정보 */
  readonly android_face: FaceInfo;
  /** 안드로이드 피부 정보 */
  readonly android_skin: SkinInfo;
  /** 안드로이드 캐시 아이템 장착 정보 */
  readonly android_cash_item_equipment: AndroidCashItem[];
  /** 이어센서 클립 적용 여부 */
  readonly android_ear_sensor_clip_flag: string;
  /** 안드로이드 성별 */
  readonly android_gender: string;
  /** 안드로이드 등급 */
  readonly android_grade: string;
  /** 비인간형 안드로이드 여부 */
  readonly android_non_humanoid_flag: string;
  /** 잡화상점 기능 이용 가능 여부 */
  readonly android_shop_usable_flag: string;
  /** 적용 중인 프리셋 번호 */
  readonly preset_no: number;
  /** 1번 프리셋 안드로이드 정보 */
  readonly android_preset_1: AndroidPresetInfo;
  /** 2번 프리셋 안드로이드 정보 */
  readonly android_preset_2: AndroidPresetInfo;
  /** 3번 프리셋 안드로이드 정보 */
  readonly android_preset_3: AndroidPresetInfo;
}

// ─── GET /maplestory/v1/character/pet-equipment ─────────────────────────────

/** 펫 장비 옵션 */
export interface PetItemOption {
  /** 옵션 타입 */
  readonly option_type: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 펫 장착 장비 정보 */
export interface PetEquipmentItem {
  /** 아이템 명 */
  readonly item_name: string;
  /** 아이템 아이콘 */
  readonly item_icon: string;
  /** 아이템 설명 */
  readonly item_description: string;
  /** 아이템 표기상 옵션 */
  readonly item_option: PetItemOption[];
  /** 주문서 횟수 */
  readonly scroll_upgrade: number;
  /** 주문서 잔여 횟수 */
  readonly scroll_upgradable: number;
  /** 아이템 외형 */
  readonly item_shape: string;
  /** 아이템 외형 아이콘 */
  readonly item_shape_icon: string;
}

/** 펫 버프 자동스킬 정보 */
export interface PetAutoSkill {
  /** 첫 번째 슬롯에 등록된 자동 스킬 */
  readonly skill_1: string;
  /** 첫 번째 슬롯에 등록된 자동 스킬 아이콘 */
  readonly skill_1_icon: string;
  /** 두 번째 슬롯에 등록된 자동 스킬 */
  readonly skill_2: string;
  /** 두 번째 슬롯에 등록된 자동 스킬 아이콘 */
  readonly skill_2_icon: string;
}

/** GET /maplestory/v1/character/pet-equipment 응답 */
export interface CharacterPetEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 펫1 명 */
  readonly pet_1_name: string;
  /** 펫1 닉네임 */
  readonly pet_1_nickname: string;
  /** 펫1 아이콘 */
  readonly pet_1_icon: string;
  /** 펫1 설명 */
  readonly pet_1_description: string;
  /** 펫1 장착 정보 */
  readonly pet_1_equipment: PetEquipmentItem;
  /** 펫1 펫 버프 자동스킬 정보 */
  readonly pet_1_auto_skill: PetAutoSkill;
  /** 펫1 원더 펫 종류 */
  readonly pet_1_pet_type: string;
  /** 펫1 펫 보유 스킬 */
  readonly pet_1_skill: string[];
  /** 펫1 마법의 시간 ("expired": 만료, null: 무제한) */
  readonly pet_1_date_expire: string | null;
  /** 펫1 외형 */
  readonly pet_1_appearance: string;
  /** 펫1 외형 아이콘 */
  readonly pet_1_appearance_icon: string;
  /** 펫2 명 */
  readonly pet_2_name: string;
  /** 펫2 닉네임 */
  readonly pet_2_nickname: string;
  /** 펫2 아이콘 */
  readonly pet_2_icon: string;
  /** 펫2 설명 */
  readonly pet_2_description: string;
  /** 펫2 장착 정보 */
  readonly pet_2_equipment: PetEquipmentItem;
  /** 펫2 펫 버프 자동스킬 정보 */
  readonly pet_2_auto_skill: PetAutoSkill;
  /** 펫2 원더 펫 종류 */
  readonly pet_2_pet_type: string;
  /** 펫2 펫 보유 스킬 */
  readonly pet_2_skill: string[];
  /** 펫2 마법의 시간 ("expired": 만료, null: 무제한) */
  readonly pet_2_date_expire: string | null;
  /** 펫2 외형 */
  readonly pet_2_appearance: string;
  /** 펫2 외형 아이콘 */
  readonly pet_2_appearance_icon: string;
  /** 펫3 명 */
  readonly pet_3_name: string;
  /** 펫3 닉네임 */
  readonly pet_3_nickname: string;
  /** 펫3 아이콘 */
  readonly pet_3_icon: string;
  /** 펫3 설명 */
  readonly pet_3_description: string;
  /** 펫3 장착 정보 */
  readonly pet_3_equipment: PetEquipmentItem;
  /** 펫3 펫 버프 자동스킬 정보 */
  readonly pet_3_auto_skill: PetAutoSkill;
  /** 펫3 원더 펫 종류 */
  readonly pet_3_pet_type: string;
  /** 펫3 펫 보유 스킬 */
  readonly pet_3_skill: string[];
  /** 펫3 마법의 시간 ("expired": 만료, null: 무제한) */
  readonly pet_3_date_expire: string | null;
  /** 펫3 외형 */
  readonly pet_3_appearance: string;
  /** 펫3 외형 아이콘 */
  readonly pet_3_appearance_icon: string;
}

// ─── GET /maplestory/v1/character/skill ──────────────────────────────────────

/** 스킬 개별 정보 */
export interface SkillInfo {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 설명 */
  readonly skill_description: string;
  /** 스킬 레벨 */
  readonly skill_level: number;
  /** 스킬 레벨 별 효과 설명 */
  readonly skill_effect: string;
  /** 다음 스킬 레벨 효과 설명 */
  readonly skill_effect_next: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
}

/**
 * 스킬 전직 차수.
 *
 * - `"0"`: 0차 스킬 및 제로 공용스킬
 * - `"1"` / `"1.5"` / `"2"` / `"2.5"` / `"3"` / `"4"`: 해당 차수 스킬
 * - `"hyperpassive"` / `"hyperactive"`: 하이퍼 스킬
 * - `"5"` / `"6"`: 5차/6차 스킬
 */
export type SkillGrade =
  | '0'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '4'
  | 'hyperpassive'
  | 'hyperactive'
  | '5'
  | '6';

/** 스킬 조회 요청 파라미터 */
export interface SkillRequest {
  /** 캐릭터 식별자 */
  readonly ocid: OCID;
  /** 조회 기준일 (YYYY-MM-DD). 생략 시 전일 */
  readonly date?: NexonDate | string;
  /** 조회하고자 하는 전직 차수 */
  readonly character_skill_grade: SkillGrade;
}

/** GET /maplestory/v1/character/skill 응답 */
export interface CharacterSkill {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 스킬 전직 차수 */
  readonly character_skill_grade: string;
  /** 스킬 정보 */
  readonly character_skill: SkillInfo[];
}

// ─── GET /maplestory/v1/character/link-skill ─────────────────────────────────

/** 링크 스킬 정보 (프리셋/owned 공용, skill_effect_next 없음) */
export interface LinkSkillInfo {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 설명 */
  readonly skill_description: string;
  /** 스킬 레벨 */
  readonly skill_level: number;
  /** 스킬 효과 */
  readonly skill_effect: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
}

/** GET /maplestory/v1/character/link-skill 응답 */
export interface CharacterLinkSkill {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 장착 링크 스킬 정보 */
  readonly character_link_skill: SkillInfo[];
  /** 1번 프리셋 링크 스킬 정보 */
  readonly character_link_skill_preset_1: LinkSkillInfo[];
  /** 2번 프리셋 링크 스킬 정보 */
  readonly character_link_skill_preset_2: LinkSkillInfo[];
  /** 3번 프리셋 링크 스킬 정보 */
  readonly character_link_skill_preset_3: LinkSkillInfo[];
  /** 내 링크 스킬 정보 */
  readonly character_owned_link_skill: LinkSkillInfo;
  /** 내 링크 스킬 1번 프리셋 정보 */
  readonly character_owned_link_skill_preset_1: LinkSkillInfo;
  /** 내 링크 스킬 2번 프리셋 정보 */
  readonly character_owned_link_skill_preset_2: LinkSkillInfo;
  /** 내 링크 스킬 3번 프리셋 정보 */
  readonly character_owned_link_skill_preset_3: LinkSkillInfo;
}

// ─── GET /maplestory/v1/character/vmatrix ────────────────────────────────────

/** V코어 개별 정보 */
export interface VCoreEquipment {
  /** 슬롯 인덱스 */
  readonly slot_id: string;
  /**
   * 슬롯 레벨
   * @deprecated 2025년 12월 18일 점검 이후 미사용. 이후 데이터는 0으로 응답.
   */
  readonly slot_level: number;
  /** 코어 명 */
  readonly v_core_name: string;
  /** 코어 타입 */
  readonly v_core_type: string;
  /** 코어 레벨 */
  readonly v_core_level: number;
  /**
   * 코어에 해당하는 스킬 명
   * @deprecated 2025년 12월 18일 점검 이후 미사용. 이후 데이터는 null로 응답.
   */
  readonly v_core_skill_1: string | null;
  /**
   * (강화 코어) 두 번째 스킬 명
   * @deprecated 2025년 12월 18일 점검 이후 미사용. 이후 데이터는 null로 응답.
   */
  readonly v_core_skill_2: string | null;
  /**
   * (강화 코어) 세 번째 스킬 명
   * @deprecated 2025년 12월 18일 점검 이후 미사용. 이후 데이터는 null로 응답.
   */
  readonly v_core_skill_3: string | null;
}

/** GET /maplestory/v1/character/vmatrix 응답 */
export interface CharacterVMatrix {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** V코어 정보 */
  readonly character_v_core_equipment: VCoreEquipment[];
  /** 잔여 매트릭스 강화 포인트 */
  readonly character_v_matrix_remain_slot_upgrade_point: number;
}

// ─── GET /maplestory/v1/character/hexamatrix ─────────────────────────────────

/** HEXA 코어 연결 스킬 정보 */
export interface HexaLinkedSkill {
  /** HEXA 스킬 명 */
  readonly hexa_skill_id: string;
}

/** HEXA 코어 개별 정보 */
export interface HexaCoreEquipment {
  /** 코어 명 */
  readonly hexa_core_name: string;
  /** 코어 레벨 */
  readonly hexa_core_level: number;
  /** 코어 타입 */
  readonly hexa_core_type: string;
  /** 연결된 스킬 */
  readonly linked_skill: HexaLinkedSkill[];
}

/** GET /maplestory/v1/character/hexamatrix 응답 */
export interface CharacterHexaMatrix {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** HEXA 코어 정보 */
  readonly character_hexa_core_equipment: HexaCoreEquipment[];
}

// ─── GET /maplestory/v1/character/hexamatrix-stat ────────────────────────────

/** HEXA 스탯 코어 개별 정보 */
export interface HexaStatCore {
  /** 슬롯 인덱스 */
  readonly slot_id: string;
  /** 메인 스탯 명 */
  readonly main_stat_name: string;
  /** 첫 번째 서브 명 */
  readonly sub_stat_name_1: string;
  /** 두 번째 서브 명 */
  readonly sub_stat_name_2: string;
  /** 메인 스탯 레벨 */
  readonly main_stat_level: number;
  /** 첫 번째 서브 레벨 */
  readonly sub_stat_level_1: number;
  /** 두 번째 서브 레벨 */
  readonly sub_stat_level_2: number;
  /** 스탯 코어 등급 */
  readonly stat_grade: number;
}

/** GET /maplestory/v1/character/hexamatrix-stat 응답 */
export interface CharacterHexaMatrixStat {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** HEXA 스탯 I 코어 정보 */
  readonly character_hexa_stat_core: HexaStatCore[];
  /** HEXA 스탯 II 코어 정보 */
  readonly character_hexa_stat_core_2: HexaStatCore[];
  /** HEXA 스탯 III 코어 정보 */
  readonly character_hexa_stat_core_3: HexaStatCore[];
  /** 프리셋 HEXA 스탯 I 코어 정보 */
  readonly preset_hexa_stat_core: HexaStatCore[];
  /** 프리셋 HEXA 스탯 II 코어 정보 */
  readonly preset_hexa_stat_core_2: HexaStatCore[];
  /** 프리셋 HEXA 스탯 III 코어 정보 */
  readonly preset_hexa_stat_core_3: HexaStatCore[];
}

// ─── GET /maplestory/v1/character/dojang ─────────────────────────────────────

/** GET /maplestory/v1/character/dojang 응답 */
export interface CharacterDojang {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 무릉도장 최고 기록 층수 */
  readonly dojang_best_floor: number;
  /** 무릉도장 최고 기록 달성 일 (KST) */
  readonly date_dojang_record: string;
  /** 무릉도장 최고 층수 클리어에 걸린 시간 (초) */
  readonly dojang_best_time: number;
}

// ─── GET /maplestory/v1/character/other-stat ─────────────────────────────────

/** 기타 스탯 개별 정보 */
export interface OtherStatInfo {
  /** 스탯 명 */
  readonly stat_name: string;
  /** 스탯 값 */
  readonly stat_value: string;
}

/** 기타 능력치 영향 요소 */
export interface OtherStatEntry {
  /** 스탯 타입 */
  readonly other_stat_type: string;
  /** 스탯 정보 */
  readonly stat_info: OtherStatInfo[];
}

/** GET /maplestory/v1/character/other-stat 응답 */
export interface CharacterOtherStat {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 능력치에 영향을 주는 요소 및 스탯 정보 */
  readonly other_stat: OtherStatEntry[];
}

// ─── GET /maplestory/v1/character/ring-exchange-skill-equipment ──────────────

/** GET /maplestory/v1/character/ring-exchange-skill-equipment 응답 */
export interface CharacterRingExchangeSkillEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 링 익스체인지에 등록된 특수 반지 */
  readonly special_ring_exchange_name: string;
  /** 링 익스체인지에 등록된 특수 반지 레벨 */
  readonly special_ring_exchange_level: number;
  /** 링 익스체인지에 등록된 특수 반지 아이콘 */
  readonly special_ring_exchange_icon: string;
  /** 링 익스체인지에 등록된 특수 반지 설명 */
  readonly special_ring_exchange_description: string;
}
