/**
 * 퍼스트 디센던트 정적 메타데이터 응답 타입.
 *
 * 모든 메타데이터 응답은 최상위가 배열이며, 아래 `Tfd*Meta` 타입은 그 원소다.
 * 스펙(`specs/openapi/tfd/21.yaml`)과 키 없이 내려오는 실데이터(2026-11-24, ko)를 대조해 만들었다.
 * 둘이 다르면 실데이터를 따랐고, 다른 곳은 필드 주석에 적었다.
 * `| null` 은 실데이터에서 null이 관측된 필드다 (스펙은 nullable을 표시하지 않는다).
 */

// ─── GET /static/tfd/meta/{language_code}/descendant.json ────────────────────────

/** 계승자 메타데이터 원소 */
export interface TfdDescendantMeta {
  /** 계승자 식별자 */
  readonly descendant_id: string;
  /** 계승자 이름 */
  readonly descendant_name: string;
  /** 계승자 그룹 식별자 (/meta/descendant-group API 참고) */
  readonly descendant_group_id: string;
  /** 계승자 이미지 경로 */
  readonly descendant_image_url: string;
  /** 계승자 스탯 */
  readonly descendant_stat: readonly TfdDescendantMetaStat[];
  /** 계승자 스킬 정보 */
  readonly descendant_skill: readonly TfdDescendantMetaSkill[];
}

/** 계승자 스탯 */
export interface TfdDescendantMetaStat {
  /** 레벨 */
  readonly level: number;
  /** 스탯 상세 */
  readonly stat_detail: readonly TfdDescendantMetaStatDetail[];
}

/** 스탯 상세 */
export interface TfdDescendantMetaStatDetail {
  /** 스탯 유형 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 스탯 유형별 값 */
  readonly stat_value: number;
}

/** 계승자 스킬 정보 */
export interface TfdDescendantMetaSkill {
  /** 스킬 유형 (액티브, 패시브) */
  readonly skill_type: string;
  /** 스킬 이름 */
  readonly skill_name: string;
  /** 스킬 유형 */
  readonly element_type: string;
  /** 아르케 유형 */
  readonly arche_type: string | null;
  /** 스킬 아이콘 이미지 경로 */
  readonly skill_image_url: string;
  /** 스킬 설명 */
  readonly skill_description: string;
}

// ─── GET /static/tfd/meta/{language_code}/weapon.json ────────────────────────────

/** 무기 메타데이터 원소 */
export interface TfdWeaponMeta {
  /** 무기 이름 */
  readonly weapon_name: string;
  /** 무기 식별자 */
  readonly weapon_id: string;
  /** 무기 이미지 경로 */
  readonly image_url: string;
  /** 무기 유형 */
  readonly weapon_type: string;
  /** 무기 구분 */
  readonly weapon_category: string;
  /** 무기 등급 (/meta/tier API 참고) */
  readonly weapon_tier_id: string;
  /** 무기 탄환 유형 */
  readonly weapon_rounds_type: string;
  /** 오픈 가능한 코어 슬롯 목록 (/meta/core-slot API 참고) */
  readonly available_core_slot: readonly string[];
  /** 무기 기본 제원 */
  readonly base_stat: readonly TfdWeaponMetaBaseStat[];
  /** 레벨별 총기 공격력 */
  readonly firearm_atk: readonly TfdWeaponMetaFirearmAtk[];
  /** 고유 능력 이름 */
  readonly weapon_perk_ability_name: string | null;
  /** 고유 능력 설명 */
  readonly weapon_perk_ability_description: string | null;
  /** 고유 능력 아이콘 이미지 경로 */
  readonly weapon_perk_ability_image_url: string | null;
}

/** 무기 기본 제원 */
export interface TfdWeaponMetaBaseStat {
  /** 무기 기본 제원 식별자 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 무기 기본 제원 값 */
  readonly stat_value: number;
}

/** 레벨별 총기 공격력 */
export interface TfdWeaponMetaFirearmAtk {
  /** 총기 레벨 */
  readonly level: number;
  /** 총기 공격력 */
  readonly firearm: readonly TfdWeaponMetaFirearmAtkFirearm[];
}

/** 총기 공격력 */
export interface TfdWeaponMetaFirearmAtkFirearm {
  /** 총기 공격력 유형 (/meta/stat API 참고) */
  readonly firearm_atk_type: string;
  /** 총기 공격력 값 */
  readonly firearm_atk_value: number;
}

// ─── GET /static/tfd/meta/{language_code}/module.json ────────────────────────────

/** 모듈 메타데이터 원소 */
export interface TfdModuleMeta {
  /** 모듈 이름 */
  readonly module_name: string;
  /** 모듈 식별자 */
  readonly module_id: string;
  /** 모듈 이미지 경로 */
  readonly image_url: string;
  /** 모듈 유형 */
  readonly module_type: string | null;
  /** 모듈 등급 (/meta/tier API 참고) */
  readonly module_tier_id: string;
  /** 모듈 슬롯 소켓 유형 */
  readonly module_socket_type: string | null;
  /** 모듈 클래스 */
  readonly module_class: string;
  /** 모듈 장착 가능 무기 유형 목록 (/meta/weapon-type API 참고) */
  readonly available_weapon_type: readonly string[];
  /** 모듈 장착 가능 계승자 식별자 목록 (/meta/descendant API 참고) */
  readonly available_descendant_id: readonly string[];
  /** 모듈 장착 가능 슬롯 유형 */
  readonly available_module_slot_type: readonly string[];
  /** 모듈 속성 */
  readonly module_stat: readonly TfdModuleMetaStat[];
}

/** 모듈 속성 */
export interface TfdModuleMetaStat {
  /** 모듈 강화 레벨 */
  readonly level: number;
  /** 모듈 수용량 */
  readonly module_capacity: number | null;
  /** 모듈 속성 값 */
  readonly value: string | null;
}

// ─── GET /static/tfd/meta/{language_code}/reactor.json ───────────────────────────

/** 반응로 메타데이터 원소 */
export interface TfdReactorMeta {
  /** 반응로 식별자 */
  readonly reactor_id: string;
  /** 반응로 이름 */
  readonly reactor_name: string;
  /** 반응로 이미지 경로 */
  readonly image_url: string;
  /** 반응로 등급 (/meta/tier API 참고) */
  readonly reactor_tier_id: string;
  /** 레벨별 스킬 위력 */
  readonly reactor_skill_power: readonly TfdReactorMetaSkillPower[];
  /** 최적화 조건 유형 */
  readonly optimized_condition_type: string | null;
}

/** 레벨별 스킬 위력 */
export interface TfdReactorMetaSkillPower {
  /** 반응로 레벨 */
  readonly level: number;
  /** 스킬 위력 */
  readonly skill_atk_power: number;
  /** 보조공격 위력 */
  readonly sub_skill_atk_power: number | null;
  /** 스킬 위력 증가율 */
  readonly skill_power_coefficient: readonly TfdReactorMetaSkillPowerCoefficient[];
  /** 레벨별 강화 효과 */
  readonly enchant_effect: readonly TfdReactorMetaSkillPowerEnchantEffect[];
}

/** 스킬 위력 증가율 */
export interface TfdReactorMetaSkillPowerCoefficient {
  /** 스킬 위력 증가율 식별자 (/meta/stat API 참고) */
  readonly coefficient_stat_id: string;
  /** 스킬 위력 증가율 값 */
  readonly coefficient_stat_value: number;
}

/** 레벨별 강화 효과 */
export interface TfdReactorMetaSkillPowerEnchantEffect {
  /** 강화 레벨 */
  readonly enchant_level: number;
  /** 강화 효과 유형 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 강화 효과 값 */
  readonly value: number;
}

// ─── GET /static/tfd/meta/{language_code}/external-component.json ────────────────

/** 외장 부품 메타데이터 원소 */
export interface TfdExternalComponentMeta {
  /** 외장 부품 식별자 */
  readonly external_component_id: string;
  /** 외장 부품 이름 */
  readonly external_component_name: string;
  /** 외장 부품 이미지 경로 */
  readonly image_url: string;
  /** 외장 부품 착용 부위 */
  readonly external_component_equipment_type: string;
  /** 외장 부품 등급 (/meta/tier API 참고) */
  readonly external_component_tier_id: string;
  /** 오픈 가능한 코어 슬롯 목록 (/meta/core-slot API 참고) */
  readonly available_core_slot: readonly string[];
  /** 외장 부품 기본 스탯 */
  readonly base_stat: readonly TfdExternalComponentMetaBaseStat[];
  /** 외장 부품 세트 옵션 */
  readonly set_option_detail: readonly TfdExternalComponentMetaSetOptionDetail[];
}

/** 외장 부품 기본 스탯 */
export interface TfdExternalComponentMetaBaseStat {
  /** 외장 부품 레벨 */
  readonly level: number;
  /** 외장 부품 기본 효과 유형 */
  readonly stat_id: string;
  /** 외장 부품 기본 효과 값 */
  readonly stat_value: number;
}

/** 외장 부품 세트 옵션 */
export interface TfdExternalComponentMetaSetOptionDetail {
  /** 외장 부품 세트 옵션 이름 */
  readonly set_option: string;
  /** 외장 부품 세트 옵션 필요 수 */
  readonly set_count: number;
  /** 외장 부품 세트 옵션 세트 효과 */
  readonly set_option_effect: string;
}

// ─── GET /static/tfd/meta/{language_code}/reward.json ────────────────────────────

/** 난이도 보상 메타데이터 원소 */
export interface TfdRewardMeta {
  /** 지역 식별자 */
  readonly map_id: string;
  /** 지역 이름 */
  readonly map_name: string;
  /** 전장 */
  readonly battle_zone: readonly TfdRewardMetaBattleZone[];
}

/** 전장 */
export interface TfdRewardMetaBattleZone {
  /** 전장 식별자 */
  readonly battle_zone_id: string;
  /** 전장 이름 */
  readonly battle_zone_name: string;
  /** 보상 정보 */
  readonly reward: readonly TfdRewardMetaBattleZoneReward[];
}

/** 보상 정보 */
export interface TfdRewardMetaBattleZoneReward {
  /** 보상 회차 */
  readonly rotation: number;
  /** 보상 유형 */
  readonly reward_type: string;
  /** 반응로 스킬 유형 */
  readonly reactor_element_type: string | null;
  /** 무기 탄환 유형 */
  readonly weapon_rounds_type: string | null;
  /** 아르케 유형 */
  readonly arche_type: string | null;
}

// ─── GET /static/tfd/meta/{language_code}/stat.json ──────────────────────────────

/** 기본 스탯 메타데이터 원소 */
export interface TfdStatMeta {
  /** 기본 스탯 식별자 */
  readonly stat_id: string;
  /** 기본 스탯 이름 */
  readonly stat_name: string;
  /** 기본 스탯 정렬 순서 (오름차순) */
  readonly stat_order_no: number | null;
}

// ─── GET /static/tfd/meta/{language_code}/void-battle.json ───────────────────────

/** 보이드 요격전 메타데이터 원소 */
export interface TfdVoidBattleMeta {
  /** 보이드 요격전 식별자 */
  readonly void_battle_id: string;
  /** 보이드 요격전 이름 */
  readonly void_battle_name: string;
}

// ─── GET /static/tfd/meta/{language_code}/title.json ─────────────────────────────

/** 타이틀 메타데이터 원소 */
export interface TfdTitleMeta {
  /** 타이틀 식별자 */
  readonly title_id: string;
  /** 타이틀 이름 */
  readonly title_name: string;
}

// ─── GET /static/tfd/meta/descendant-level-detail.json ───────────────────────────

/** 계승자 레벨별 경험치 메타데이터 원소 */
export interface TfdDescendantLevelDetailMeta {
  /** 계승자 레벨 */
  readonly descendant_level: number;
  /** 다음 레벨을 위한 필요 경험치 */
  readonly exp_per_level: number;
}

// ─── GET /static/tfd/meta/mastery-rank-level-detail.json ─────────────────────────

/** 마스터리 랭크별 경험치 메타데이터 원소 */
export interface TfdMasteryRankLevelDetailMeta {
  /** 마스터리 랭크 — 스펙에는 있으나 실데이터에는 없다 (2026-11-24 기준) */
  readonly mastery_rank_level?: number | undefined;
  /** 다음 레벨을 위한 필요 경험치 */
  readonly exp_per_level: number;
  /** 스펙에 없는 필드 (실데이터 기준, 2026-11-24) */
  readonly mastery_level: number;
}

// ─── GET /static/tfd/meta/{language_code}/consumable-material.json ───────────────

/** 소비 아이템 메타데이터 원소 */
export interface TfdConsumableMaterialMeta {
  /** 소비 아이템 식별자 */
  readonly consumable_material_id: string;
  /** 소비 아이템 이미지 경로 */
  readonly image_url: string | null;
  /** 소비 아이템 이름 */
  readonly consumable_material_name: string;
  /** 마스터리 랭크 요구사항 */
  readonly required_mastery_rank_level: number | null;
  /** 재료 타입 */
  readonly material_type: string;
  /** 획득처 (/meta/acquisition-detail API 참고) */
  readonly acquisition_detail: readonly string[];
  /** 비정형 물질 오픈 보상 (/meta/amorphous-reward API 참고) */
  readonly amorphous_reward: readonly string[];
}

// ─── GET /static/tfd/meta/{language_code}/research.json ──────────────────────────

/** 연구 정보 메타데이터 원소 */
export interface TfdResearchMeta {
  /** 연구 식별자 */
  readonly research_id: string;
  /** 연구 이름 */
  readonly research_name: string;
  /** 반복 가능 여부 */
  readonly repeatable_research: boolean;
  /** 연구 유형 */
  readonly research_type: string;
  /** 연구 시간 (초) */
  readonly research_time: number;
  /** 연구 비용 */
  readonly research_cost: readonly TfdResearchMetaCost[];
  /** 연구 가속 비용 */
  readonly research_boost_cost: readonly TfdResearchMetaBoostCost[];
  /** 연구 결과 */
  readonly research_result: readonly TfdResearchMetaResult[];
  /** 연구 재료 */
  readonly research_material: readonly TfdResearchMetaMaterial[];
  /** 연구 가능 개수 */
  readonly available_research_count: readonly number[] | null;
}

/** 연구 비용 */
export interface TfdResearchMetaCost {
  /** 재화 타입 */
  readonly currency_type: string;
  /** 재화 수량 */
  readonly currency_value: number;
}

/** 연구 가속 비용 */
export interface TfdResearchMetaBoostCost {
  /** 재화 타입 */
  readonly currency_type: string;
  /** 재화 수량 */
  readonly currency_value: number;
}

/** 연구 결과 */
export interface TfdResearchMetaResult {
  /** 연구 결과 아이템 메타데이터 유형 */
  readonly meta_type: string;
  /** 연구 결과 아이템 식별자 */
  readonly meta_id: string;
  /** 연구 결과 아이템 수량 */
  readonly result_count: number;
}

/** 연구 재료 */
export interface TfdResearchMetaMaterial {
  /** 연구 재료 아이템 메타데이터 유형 */
  readonly meta_type: string;
  /** 연구 재료 아이템 식별자 */
  readonly meta_id: string;
  /** 연구 재료 아이템 수량 */
  readonly material_count: number;
  /** 연구 재료 아이템의 연구 식별자 (/meta/research API 참고) */
  readonly research_id: readonly string[];
}

// ─── GET /static/tfd/meta/amorphous-reward.json ──────────────────────────────────

/** 비정형 물질 오픈 보상 메타데이터 원소 */
export interface TfdAmorphousRewardMeta {
  /** 비정형 물질 오픈 보상 식별자 */
  readonly amorphous_reward_id: string;
  /** 비정형 물질 오픈 보상 정보 */
  readonly open_reward: readonly TfdAmorphousRewardMetaOpenReward[];
}

/** 비정형 물질 오픈 보상 정보 */
export interface TfdAmorphousRewardMetaOpenReward {
  /** 보상 구분 (Default, Upgrade) */
  readonly reward_type: string;
  /** 업그레이드에 필요한 형태 안정제 식별자 (/meta/consumable-material API 참고) */
  readonly required_stabilizer: string | null;
  /** 비정형 물질 오픈 보상 아이템 정보 */
  readonly reward_item: readonly TfdAmorphousRewardMetaOpenRewardItem[];
}

/** 비정형 물질 오픈 보상 아이템 정보 */
export interface TfdAmorphousRewardMetaOpenRewardItem {
  /** 비정형 물질 오픈 보상 아이템 유형 */
  readonly meta_type: string;
  /** 비정형 물질 오픈 보상 아이템 식별자 */
  readonly meta_id: string;
  /** 보상 확률(%) */
  readonly rate: number;
}

// ─── GET /static/tfd/meta/{language_code}/acquisition-detail.json ────────────────

/** 획득처 정보 메타데이터 원소 */
export interface TfdAcquisitionDetailMeta {
  /** 획득처 식별자 */
  readonly acquisition_detail_id: string;
  /** 획득처 이름 */
  readonly acquisition_detail_name: string;
}

// ─── GET /static/tfd/meta/{language_code}/weapon-type.json ───────────────────────

/** 무기 유형 메타데이터 원소 */
export interface TfdWeaponTypeMeta {
  /** 무기 유형 */
  readonly weapon_type: string;
  /** 무기 유형 이름 */
  readonly weapon_type_name: string;
}

// ─── GET /static/tfd/meta/{language_code}/fellow.json ────────────────────────────

/** 조력자 메타데이터 원소 */
export interface TfdFellowMeta {
  /** 조력자 식별자 */
  readonly fellow_id: string;
  /** 조력자 이름 */
  readonly fellow_name: string;
  /** 조력자 등급 (/meta/tier API 참고) */
  readonly fellow_tier_id: string;
  /** 조력자 레벨별 세부 정보 */
  readonly fellow_detail: readonly TfdFellowMetaDetail[];
}

/** 조력자 레벨별 세부 정보 */
export interface TfdFellowMetaDetail {
  /** 조력자 레벨 */
  readonly fellow_level: number;
  /** 레벨별 조력자 아이템 검색 반경 값 */
  readonly search_radius_value: number | null;
  /** 레벨별 부가 효과 */
  readonly stat_effect: readonly TfdFellowMetaDetailStatEffect[];
}

/** 레벨별 부가 효과 */
export interface TfdFellowMetaDetailStatEffect {
  /** 연산 구분 (Add:합산) — 스펙에는 있으나 실데이터에는 없다 (2026-11-24 기준) */
  readonly operator_type?: string | undefined;
  /** 부가 효과 유형 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 부가 효과 값 */
  readonly stat_value: number;
}

// ─── GET /static/tfd/meta/fellow-level-detail.json ───────────────────────────────

/** 조력자 레벨별 경험치 메타데이터 원소 */
export interface TfdFellowLevelDetailMeta {
  /** 조력자 레벨 */
  readonly fellow_level: number;
  /** 다음 레벨을 위한 필요 경험치 */
  readonly exp_per_level: number;
}

// ─── GET /static/tfd/meta/{language_code}/tier.json ──────────────────────────────

/** 등급 메타데이터 원소 */
export interface TfdTierMeta {
  /** 등급 식별자 */
  readonly tier_id: string;
  /** 등급 이름 */
  readonly tier_name: string;
}

// ─── GET /static/tfd/meta/core-slot.json ─────────────────────────────────────────

/** 코어 슬롯 메타데이터 원소 */
export interface TfdCoreSlotMeta {
  /** 코어 슬롯 식별자 */
  readonly core_slot_id: string;
  /** 해당 코어 슬롯을 오픈할 수 있는 무기 목록 (/meta/weapon API 참고) */
  readonly available_weapon_id: readonly string[];
  /** 해당 코어 슬롯을 오픈할 수 있는 외장 부품 목록 (/meta/external-component API 참고) */
  readonly available_external_component_id: readonly string[];
  /** 지정된 코어 타입 목록 (/meta/core-type API 참고) */
  readonly available_core_type_id: readonly string[];
}

// ─── GET /static/tfd/meta/{language_code}/core-type.json ─────────────────────────

/** 코어 타입 메타데이터 원소 */
export interface TfdCoreTypeMeta {
  /** 코어 타입 식별자 */
  readonly core_type_id: string;
  /** 코어 타입 */
  readonly core_type: string;
  /** 코어 타입별 옵션 */
  readonly core_option: readonly TfdCoreTypeMetaCoreOption[];
}

/** 코어 타입별 옵션 */
export interface TfdCoreTypeMetaCoreOption {
  /** 코어 타입 옵션 식별자 */
  readonly core_option_id: string;
  /** 코어 타입별 옵션 상세 정보 */
  readonly detail: readonly TfdCoreTypeMetaCoreOptionDetail[];
}

/** 코어 타입별 옵션 상세 정보 */
export interface TfdCoreTypeMetaCoreOptionDetail {
  /** 코어 옵션 등급 -코어 등급은 높을 수록 더 좋은 효과 값이 부여될 수 있습니다. */
  readonly core_option_grade: number | null;
  readonly required_core_item: TfdCoreTypeMetaCoreOptionDetailRequiredCoreItem;
  /** 아이템 옵션 */
  readonly available_item_option: readonly TfdCoreTypeMetaCoreOptionDetailAvailableItemOption[];
}

export interface TfdCoreTypeMetaCoreOptionDetailRequiredCoreItem {
  /** 필요한 코어 아이템 유형 */
  readonly meta_type: string;
  /** 필요한 코어 아이템 식별자 */
  readonly meta_id: string;
  /** 필요한 코어 아이템 수량 */
  readonly count: number;
}

/** 아이템 옵션 */
export interface TfdCoreTypeMetaCoreOptionDetailAvailableItemOption {
  /** 옵션 이름 */
  readonly item_option: string;
  /** 옵션 구분 */
  readonly option_type: string;
  /** 옵션 등급 -등급은 높을 수록 더 좋은 효과 값이 부여될 수 있습니다. */
  readonly option_grade: number;
  readonly option_effect: TfdCoreTypeMetaCoreOptionDetailAvailableItemOptionEffect;
  /** 옵션 등장 확률 */
  readonly rate: number;
}

export interface TfdCoreTypeMetaCoreOptionDetailAvailableItemOptionEffect {
  /** 옵션 효과 스탯 식별자 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 스탯 연산 구분(Add:합 연산, Multiply:곱 연산) */
  readonly operator_type: string;
  /** 최소 스탯 수치 */
  readonly min_stat_value: number;
  /** 최대 스탯 수치 */
  readonly max_stat_value: number;
}

// ─── GET /static/tfd/meta/{language_code}/descendant-group.json ──────────────────

/** 계승자 그룹 메타데이터 원소 */
export interface TfdDescendantGroupMeta {
  /** 계승자 그룹 식별자 */
  readonly descendant_group_id: string;
  /** 계승자 그룹 이름 */
  readonly descendant_group_name: string;
}

// ─── GET /static/tfd/meta/adapt-level.json ───────────────────────────────────────

/** 적응도 레벨 메타데이터 원소 */
export interface TfdAdaptLevelMeta {
  /** 레벨 */
  readonly level: number;
  /** 다음 레벨을 위한 필요 경험치 */
  readonly exp_per_level: number;
}

// ─── GET /static/tfd/meta/arche-tuning-board-group.json ──────────────────────────

/** 아르케 조율 보드 그룹 메타데이터 원소 */
export interface TfdArcheTuningBoardGroupMeta {
  /** 아르케 조율 보드 그룹 식별자 */
  readonly arche_tuning_board_group_id: string;
  /** 계승자 그룹 식별자 (meta/descendant-group API 참고) */
  readonly descendant_group_id: string;
  /** 아르케 보드 식별자 (/meta/arche-tuning-board API 참고) */
  readonly arche_tuning_board_id: string;
}

// ─── GET /static/tfd/meta/arche-tuning-board.json ────────────────────────────────

/** 아르케 조율 보드 메타데이터 원소 */
export interface TfdArcheTuningBoardMeta {
  /** 아르케 보드 식별자 */
  readonly arche_tuning_board_id: string;
  /** 행 크기 */
  readonly row_size: number;
  /** 열 크기 */
  readonly column_size: number;
  readonly node: readonly TfdArcheTuningBoardMetaNode[];
}

export interface TfdArcheTuningBoardMetaNode {
  /** 노드 식별자 (/meta/arche-tuning-node API 참고) */
  readonly node_id: string;
  /** 노드의 행 좌표 */
  readonly position_row: number;
  /** 노드의 열 좌표 */
  readonly position_column: number;
}

// ─── GET /static/tfd/meta/{language_code}/arche-tuning-node.json ─────────────────

/** 아르케 조율 노드 메타데이터 원소 */
export interface TfdArcheTuningNodeMeta {
  /** 노드 식별자 */
  readonly node_id: string;
  /** 노드 이름 */
  readonly node_name: string;
  /** 노드 이미지 URL */
  readonly node_image_url: string;
  /** 노드 구분 */
  readonly node_type: string;
  /** 노드 등급 식별자 (/meta/tier API 참고) */
  readonly tier_id: string;
  /** 필요 포인트 */
  readonly required_tuning_point: number;
  readonly node_effect: readonly TfdArcheTuningNodeMetaEffect[];
}

export interface TfdArcheTuningNodeMetaEffect {
  /** 스탯 식별자 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 스탯 효과 수치 */
  readonly stat_value: number;
  /** 스탯 연산 구분(Add:합 연산, Multiply:곱 연산) */
  readonly operator_type: string;
}

// ─── GET /static/tfd/meta/{language_code}/customizing-item.json ──────────────────

/** 커스터마이징 아이템 메타데이터 원소 */
export interface TfdCustomizingItemMeta {
  /** 커스터마이징 아이템 식별자 */
  readonly customizing_item_id: string;
  /** 커스터마이징 아이템 이름 */
  readonly customizing_item_name: string;
  /** 커스터마이징 아이템 유형 */
  readonly customizing_item_type: string;
  /** 커스터마이징 아이템 등급 (/meta/tier API 참고) */
  readonly customizing_item_tier_id: string | null;
  /** 커스터마이징 아이템 설명 */
  readonly customizing_item_description: string;
  /** 커스터마이징 아이템 이미지 경로 */
  readonly customizing_item_image_url: string | null;
  /** 커스터마이징 아이템 진화 단계 정보 */
  readonly customizing_item_evolution_stage: readonly TfdCustomizingItemMetaEvolutionStage[];
  /** 적용 가능한 계승자 목록 (/meta/descendant API 참고) */
  readonly available_descendant: readonly string[];
}

/** 커스터마이징 아이템 진화 단계 정보 */
export interface TfdCustomizingItemMetaEvolutionStage {
  /** 커스터마이징 아이템 진화 단계 */
  readonly stage: number;
  /** 커스터마이징 아이템 진화 단계별 이미지 경로 */
  readonly customizing_item_image_url: string;
}

// ─── GET /static/tfd/meta/{language_code}/medal.json ─────────────────────────────

/** 훈장 메타데이터 원소 */
export interface TfdMedalMeta {
  /** 훈장 식별자 */
  readonly medal_id: string;
  /** 훈장 단계별 세부 정보 */
  readonly medal_detail: readonly TfdMedalMetaDetail[];
}

/** 훈장 단계별 세부 정보 */
export interface TfdMedalMetaDetail {
  /** 훈장 단계 */
  readonly medal_level: number;
  /** 훈장 이름 */
  readonly medal_name: string;
  /** 훈장 등급 (/meta/tier API 참고) */
  readonly medal_tier_id: string;
  /** 훈장 이미지 경로 */
  readonly medal_image_url: string;
}

// ─── GET /static/tfd/meta/{language_code}/vehicle.json ───────────────────────────

/** 탈것 메타데이터 원소 */
export interface TfdVehicleMeta {
  /** 탈것 식별자 */
  readonly vehicle_id: string;
  /** 탈것 이름 */
  readonly vehicle_name: string;
  /** 탈것 설명 */
  readonly vehicle_description: string;
  /** 등급 */
  readonly vehicle_tier_id: string;
  /** 탈것 이미지 경로 */
  readonly image_url: string;
  /** 스탯 효과 */
  readonly stat_effect: readonly TfdVehicleMetaStatEffect[];
  /** 레벨별 효과 */
  readonly stat_effect_per_level: readonly TfdVehicleMetaStatEffectPerLevel[];
}

/** 스탯 효과 */
export interface TfdVehicleMetaStatEffect {
  /** 효과 유형 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 효과 값 */
  readonly stat_value: number;
}

/** 레벨별 효과 */
export interface TfdVehicleMetaStatEffectPerLevel {
  /** 탈것 레벨 */
  readonly vehicle_level: number;
  /** 레벨별 효과 */
  readonly stat_effect: readonly TfdVehicleMetaStatEffectPerLevelStatEffect[];
}

/** 레벨별 효과 */
export interface TfdVehicleMetaStatEffectPerLevelStatEffect {
  /** 효과 유형 (/meta/stat API 참고) */
  readonly stat_id: string;
  /** 효과 값 */
  readonly stat_value: number;
}

// ─── GET /static/tfd/meta/{language_code}/collectible-item.json ──────────────────

/** 수집형 아이템 메타데이터 원소 */
export interface TfdCollectibleItemMeta {
  /** 수집형 아이템 식별자 */
  readonly collectible_item_id: string;
  /** 수집형 아이템 이름 */
  readonly collectible_item_name: string;
  /** 수집형 아이템 설명 */
  readonly collectible_item_description: string;
  /** 수집형 아이템 스토리 */
  readonly collectible_item_narrative: string;
  /** 수집형 아이템 등급(/meta/tier API 참고) */
  readonly collectible_item_tier_id: string;
  /** 수집형 아이템 사이즈 */
  readonly collectible_item_lounge_size: string | null;
  /** 수집 구분 */
  readonly collect_type: string;
  /** 분해 가능 여부 (0:불가, 1:가능) */
  readonly decomposition_flag: string;
  /** 분해 보상 */
  readonly decomposition_reward: readonly TfdCollectibleItemMetaDecompositionReward[] | null;
}

/** 분해 보상 */
export interface TfdCollectibleItemMetaDecompositionReward {
  /** 아이템 식별자 */
  readonly item_id: string;
  /** 아이템 타입 (타입에 따라 해당 아이템의 메타 데이터 참조) */
  readonly item_type: string;
  /** 수량 */
  readonly count: number;
}

// ─── GET /static/tfd/meta/{language_code}/node-item.json ─────────────────────────

/** 변이 세포 메타데이터 원소 */
export interface TfdNodeItemMeta {
  /** 변이 세포 식별자 */
  readonly node_item_id: string;
  /** 변이 세포 명 */
  readonly node_item_name: string;
  /** 변이 세포 이미지 경로 */
  readonly node_item_image_url: string;
  /** 설명 */
  readonly node_item_description: string;
  /** 변이 세포 소켓 타입 */
  readonly node_item_socket_type: string;
  /** 변이 세포 장착 효과 */
  readonly node_item_effect: readonly TfdNodeItemMetaEffect[];
}

/** 변이 세포 장착 효과 */
export interface TfdNodeItemMetaEffect {
  /** 변이 세포 효과명 */
  readonly node_item_effect_name: string;
  /** 변이 세포 효과 설명 */
  readonly node_item_effect_description: string;
}

// ─── GET /static/tfd/meta/{language_code}/node-socket-type.json ──────────────────

/** 변이 세포 소켓 타입 메타데이터 원소 */
export interface TfdNodeSocketTypeMeta {
  /** 변이 세포 소켓 타입 * SocketType_A: 세룰리안 * SocketType_B: 알만딘 * SocketType_C: 말라카이트 * SocketType_D: 크산틱 * SocketType_E: 루틸 */
  readonly node_item_socket_type: string;
  /** 변이 세포 소켓 명 */
  readonly node_item_socket_name: string;
  /** 변이 세포 소켓 이미지 경로 */
  readonly node_item_socket_image_url: string | null;
}
