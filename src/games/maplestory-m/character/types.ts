// ─── GET /maplestorym/v1/character/basic ─────────────────────────────────────

/** GET /maplestorym/v1/character/basic 응답 */
export interface MCharacterBasic {
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 캐릭터 생성 일(시) (UTC0) */
  readonly character_date_create: string;
  /** 캐릭터 마지막 로그인 일(시) (UTC0) */
  readonly character_date_last_login: string;
  /** 캐릭터 마지막 로그아웃 일(시) (UTC0) */
  readonly character_date_last_logout: string;
  /**
   * 캐릭터 직업 명.
   * @deprecated character_class를 사용해주세요.
   */
  readonly character_job_name: string;
  /** 캐릭터 직업 명 */
  readonly character_class: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 경험치 */
  readonly character_exp: number;
  /** 캐릭터 경험치(%) */
  readonly character_exp_rate: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 캐릭터 외형 이미지 */
  readonly character_image: string;
}

// ─── GET /maplestorym/v1/character/stat ──────────────────────────────────────

/** 개별 스탯 정보 */
export interface MStat {
  /** 스탯 명 */
  readonly stat_name: string;
  /** 스탯 값 */
  readonly stat_value: string;
}

/** GET /maplestorym/v1/character/stat 응답 */
export interface MCharacterStat {
  /** 스탯 정보 */
  readonly stat: MStat[];
}

// ─── GET /maplestorym/v1/character/hyper-stat ────────────────────────────────

/** 하이퍼스탯 개별 정보 */
export interface MHyperStatInfo {
  /** 스탯 종류 */
  readonly stat_type: string;
  /** 스탯 레벨 */
  readonly stat_level: number;
  /** 스탯 상승량 */
  readonly stat_increase: string;
}

/** 하이퍼스탯 프리셋 */
export interface MHyperStatPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 하이퍼 스탯 정보 */
  readonly hyper_stat_info: MHyperStatInfo[];
}

/** GET /maplestorym/v1/character/hyper-stat 응답 */
export interface MCharacterHyperStat {
  /** 보유 프리셋 수 */
  readonly preset_count: number;
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: number;
  /** 적용 중인 프리셋의 잔여 스탯 */
  readonly use_preset_remain_hyper_stat: number;
  /** 하이퍼 스탯 */
  readonly hyper_stat: MHyperStatPreset[];
}

// ─── GET /maplestorym/v1/character/guild ─────────────────────────────────────

/** GET /maplestorym/v1/character/guild 응답 */
export interface MCharacterGuild {
  /** 가입한 길드 명 */
  readonly guild_name: string;
}

// ─── GET /maplestorym/v1/character/item-equipment ────────────────────────────

/** 장비 옵션 (total/base 공용) */
export interface MItemTotalOption {
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
export interface MItemBaseOption {
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

/** 장비 추가 옵션 */
export interface MItemAddOption {
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

/** 장비 기타 옵션 */
export interface MItemEtcOption {
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

/** 장비 특별(익셉셔널) 옵션 */
export interface MItemExceptionalOption {
  readonly str: string;
  readonly dex: string;
  readonly int: string;
  readonly luk: string;
  readonly max_hp: string;
  readonly max_mp: string;
  readonly attack_power: string;
  readonly magic_power: string;
}

/** 장착 장비 개별 정보 */
export interface MItemEquipment {
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
  readonly item_total_option: MItemTotalOption;
  /** 장비 기본 옵션 */
  readonly item_base_option: MItemBaseOption;
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
  /** 장비 특별 옵션 */
  readonly item_exceptional_option: MItemExceptionalOption;
  /** 장비 추가 옵션 */
  readonly item_add_option: MItemAddOption;
  /** 성장 경험치 */
  readonly growth_exp: number;
  /** 성장 레벨 */
  readonly growth_level: number;
  /** 주문서 횟수 */
  readonly scroll_upgrade: string;
  /** 가위 사용 가능 횟수 */
  readonly cuttable_count: string;
  /** 황금 망치 재련 적용 여부 */
  readonly golden_hammer_flag: string;
  /** 주문서 잔여 횟수 */
  readonly scroll_upgradable_count: string;
  /** 소울 명 */
  readonly soul_name: string;
  /** 소울 옵션 */
  readonly soul_option: string;
  /** 장비 기타 옵션 */
  readonly item_etc_option: MItemEtcOption;
  /** 스타포스 강화 단계 */
  readonly starforce: string;
  /** 스타포스 옵션 */
  readonly item_starforce_option: MItemEtcOption;
  /** 특수 반지 레벨 */
  readonly special_ring_level: number;
  /** 장비 유효 기간 */
  readonly date_expire: string | null;
}

/** GET /maplestorym/v1/character/item-equipment 응답 */
export interface MCharacterItemEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 적용 중인 장비 프리셋 번호 */
  readonly preset_no: number;
  /** 장착 장비 정보 */
  readonly item_equipment: MItemEquipment[];
}

// ─── GET /maplestorym/v1/character/cashitem-equipment ────────────────────────

/** 캐시 장비 옵션 정보 */
export interface MCashItemOption {
  /** 옵션 타입 */
  readonly option_type: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 캐시 장비 컬러링프리즘 정보 */
export interface MCashItemColoringPrism {
  /** 컬러링프리즘 색상 범위 */
  readonly color_range: string;
  /** 컬러링프리즘 색조 */
  readonly hue: number;
  /** 컬러링프리즘 채도 */
  readonly saturation: number;
  /** 컬러링프리즘 명도 */
  readonly value: number;
}

/** 캐시 장비 개별 정보 */
export interface MCashItemEquipmentItem {
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
  readonly cash_item_option: MCashItemOption[];
  /** 캐시 장비 유효 기간 (null: 무제한) */
  readonly date_expire: string | null;
  /** 캐시 장비 옵션 유효 기간 (null: 무제한) */
  readonly date_option_expire: string | null;
  /** 캐시 장비 라벨 정보 */
  readonly cash_item_label: string;
  /** 캐시 장비 컬러링프리즘 정보 (null: 미적용) */
  readonly cash_item_coloring_prism: MCashItemColoringPrism | null;
  /** 아이템 장착 가능 성별 */
  readonly item_gender: string;
}

/** GET /maplestorym/v1/character/cashitem-equipment 응답 */
export interface MCharacterCashItemEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 적용 중인 캐시 장비 프리셋 번호 */
  readonly preset_no: number;
  /** 장착 캐시 장비 정보 */
  readonly cash_item_equipment_base: MCashItemEquipmentItem[];
  /** 1번 프리셋 캐시 장비 정보 */
  readonly cash_item_equipment_preset_1: MCashItemEquipmentItem[];
  /** 2번 프리셋 캐시 장비 정보 */
  readonly cash_item_equipment_preset_2: MCashItemEquipmentItem[];
  /** 3번 프리셋 캐시 장비 정보 */
  readonly cash_item_equipment_preset_3: MCashItemEquipmentItem[];
}

// ─── GET /maplestorym/v1/character/symbol ────────────────────────────────────

/** 심볼 개별 정보 */
export interface MSymbolInfo {
  /** 심볼 명 */
  readonly symbol_name: string;
  /** 심볼 아이콘 */
  readonly symbol_icon: string;
  /** 심볼 설명 */
  readonly symbol_description: string;
  /** 심볼로 인한 추가 효과 */
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
  /** 현재 성장치 */
  readonly symbol_growth_count: number;
  /** 다음 레벨까지 필요 성장치 */
  readonly symbol_require_growth_count: number;
}

/** GET /maplestorym/v1/character/symbol 응답 */
export interface MCharacterSymbolEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 심볼 정보 */
  readonly symbol: MSymbolInfo[];
}

// ─── GET /maplestorym/v1/character/set-effect ────────────────────────────────

/** 세트 효과 옵션 정보 */
export interface MSetEffectOption {
  /** 세트 효과 레벨 (장비 수) */
  readonly set_count: number;
  /** 세트 효과 */
  readonly set_option: string;
}

/** 세트 효과 정보 */
export interface MSetEffectInfo {
  /** 세트 효과 명 */
  readonly set_name: string;
  /** 세트 개수 */
  readonly total_set_count: number;
  /** 적용 중인 세트 효과 정보 */
  readonly set_effect_info: MSetEffectOption[];
  /** 모든 세트 효과 정보 */
  readonly set_option_full: MSetEffectOption[];
}

/** GET /maplestorym/v1/character/set-effect 응답 */
export interface MCharacterSetEffect {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 세트 효과 정보 */
  readonly set_effect: MSetEffectInfo[];
}

// ─── GET /maplestorym/v1/character/android-equipment ─────────────────────────

/** 헤어 정보 */
export interface MHairInfo {
  /** 헤어 명 */
  readonly hair_name: string;
  /** 헤어 베이스 컬러 */
  readonly base_color: string;
  /** 헤어 믹스 컬러 */
  readonly mix_color: string;
  /** 헤어 믹스 컬러의 염색 비율 */
  readonly mix_rate: string;
}

/** 성형 정보 */
export interface MFaceInfo {
  /** 성형 명 */
  readonly face_name: string;
  /** 성형 베이스 컬러 */
  readonly base_color: string;
  /** 성형 믹스 컬러 */
  readonly mix_color: string;
  /** 성형 믹스 컬러의 염색 비율 */
  readonly mix_rate: string;
}

/** 피부 정보 */
export interface MSkinInfo {
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

/** 안드로이드 캐시 장비 개별 정보 */
export interface MAndroidCashItem {
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
  readonly cash_item_option: MCashItemOption[];
  /** 캐시 아이템 유효 기간 */
  readonly date_expire: string | null;
  /** 캐시 아이템 옵션 유효 기간 */
  readonly date_option_expire: string | null;
  /** 캐시 아이템 라벨 정보 */
  readonly cash_item_label: string;
  /** 캐시 아이템 컬러링프리즘 정보 (null: 미적용) */
  readonly cash_item_coloring_prism: MCashItemColoringPrism | null;
  /** 아이템 장착 가능 성별 */
  readonly android_item_gender: string;
}

/** GET /maplestorym/v1/character/android-equipment 응답 */
export interface MCharacterAndroidEquipment {
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
  readonly android_hair: MHairInfo;
  /** 안드로이드 성형 정보 */
  readonly android_face: MFaceInfo;
  /** 안드로이드 피부 정보 */
  readonly android_skin: MSkinInfo;
  /** 안드로이드 캐시 아이템 장착 정보 */
  readonly android_cash_item_equipment: MAndroidCashItem[];
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
}

// ─── GET /maplestorym/v1/character/jewel ─────────────────────────────────────

/** 쥬얼 개별 정보 */
export interface MJewelInfo {
  /** 쥬얼 명 */
  readonly jewel_name: string;
  /** 쥬얼 등급 */
  readonly jewel_grade: string;
  /** 쥬얼 옵션 */
  readonly jewel_option: string;
  /** 쥬얼 아이콘 */
  readonly jewel_icon: string;
}

/** GET /maplestorym/v1/character/jewel 응답 */
export interface MCharacterJewel {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 쥬얼 정보 */
  readonly jewel: MJewelInfo[];
}

// ─── GET /maplestorym/v1/character/beauty-equipment ──────────────────────────

/** GET /maplestorym/v1/character/beauty-equipment 응답 */
export interface MCharacterBeautyEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 헤어 정보 */
  readonly character_hair: MHairInfo;
  /** 캐릭터 성형 정보 */
  readonly character_face: MFaceInfo;
  /** 캐릭터 피부 정보 */
  readonly character_skin: MSkinInfo;
}

// ─── GET /maplestorym/v1/character/pet-equipment ─────────────────────────────

/** 펫 장비 옵션 */
export interface MPetItemOption {
  /** 옵션 타입 */
  readonly option_type: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 펫 장착 장비 정보 */
export interface MPetEquipmentItem {
  /** 아이템 명 */
  readonly item_name: string;
  /** 아이템 아이콘 */
  readonly item_icon: string;
  /** 아이템 설명 */
  readonly item_description: string;
  /** 아이템 표기상 옵션 */
  readonly item_option: MPetItemOption[];
  /** 주문서 횟수 */
  readonly scroll_upgrade: number;
  /** 주문서 잔여 횟수 */
  readonly scroll_upgradable: number;
}

/** 펫 버프 자동스킬 정보 */
export interface MPetAutoSkill {
  /** 첫 번째 슬롯에 등록된 자동 스킬 */
  readonly skill_1: string;
  /** 첫 번째 슬롯에 등록된 자동 스킬 아이콘 */
  readonly skill_1_icon: string;
  /** 두 번째 슬롯에 등록된 자동 스킬 */
  readonly skill_2: string;
  /** 두 번째 슬롯에 등록된 자동 스킬 아이콘 */
  readonly skill_2_icon: string;
}

/** GET /maplestorym/v1/character/pet-equipment 응답 */
export interface MCharacterPetEquipment {
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
  readonly pet_1_equipment: MPetEquipmentItem;
  /** 펫1 펫 버프 자동스킬 정보 */
  readonly pet_1_auto_skill: MPetAutoSkill;
  /** 펫1 펫 보유 스킬 */
  readonly pet_1_skill: string[];
  /** 펫1 마법의 시간 */
  readonly pet_1_date_expire: string | null;
  /** 펫2 명 */
  readonly pet_2_name: string;
  /** 펫2 닉네임 */
  readonly pet_2_nickname: string;
  /** 펫2 아이콘 */
  readonly pet_2_icon: string;
  /** 펫2 설명 */
  readonly pet_2_description: string;
  /** 펫2 장착 정보 */
  readonly pet_2_equipment: MPetEquipmentItem;
  /** 펫2 펫 버프 자동스킬 정보 */
  readonly pet_2_auto_skill: MPetAutoSkill;
  /** 펫2 펫 보유 스킬 */
  readonly pet_2_skill: string[];
  /** 펫2 마법의 시간 */
  readonly pet_2_date_expire: string | null;
  /** 펫3 명 */
  readonly pet_3_name: string;
  /** 펫3 닉네임 */
  readonly pet_3_nickname: string;
  /** 펫3 아이콘 */
  readonly pet_3_icon: string;
  /** 펫3 설명 */
  readonly pet_3_description: string;
  /** 펫3 장착 정보 */
  readonly pet_3_equipment: MPetEquipmentItem;
  /** 펫3 펫 버프 자동스킬 정보 */
  readonly pet_3_auto_skill: MPetAutoSkill;
  /** 펫3 펫 보유 스킬 */
  readonly pet_3_skill: string[];
  /** 펫3 마법의 시간 */
  readonly pet_3_date_expire: string | null;
}

// ─── GET /maplestorym/v1/character/skill-equipment ───────────────────────────

/** 스킬 장비 개별 정보 */
export interface MSkillEquipmentInfo {
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

/** GET /maplestorym/v1/character/skill-equipment 응답 */
export interface MCharacterSkillEquipment {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 장착 스킬 정보 */
  readonly character_skill: MSkillEquipmentInfo[];
}

// ─── GET /maplestorym/v1/character/link-skill ────────────────────────────────

/** 링크 스킬 정보 */
export interface MLinkSkillInfo {
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

/** GET /maplestorym/v1/character/link-skill 응답 */
export interface MCharacterLinkSkill {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 장착 링크 스킬 정보 */
  readonly character_link_skill: MLinkSkillInfo[];
  /** 내 링크 스킬 정보 */
  readonly character_owned_link_skill: MLinkSkillInfo;
}

// ─── GET /maplestorym/v1/character/vmatrix ───────────────────────────────────

/** V코어 개별 정보 */
export interface MVCoreEquipment {
  /** 슬롯 인덱스 */
  readonly slot_id: string;
  /** 슬롯 레벨 */
  readonly slot_level: number;
  /** 코어 명 */
  readonly v_core_name: string;
  /** 코어 타입 */
  readonly v_core_type: string;
  /** 코어 레벨 */
  readonly v_core_level: number;
  /** 코어에 해당하는 스킬 명 */
  readonly v_core_skill_1: string | null;
  /** (강화 코어) 두 번째 스킬 명 */
  readonly v_core_skill_2: string | null;
  /** (강화 코어) 세 번째 스킬 명 */
  readonly v_core_skill_3: string | null;
}

/** GET /maplestorym/v1/character/vmatrix 응답 */
export interface MCharacterVMatrix {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** V코어 정보 */
  readonly character_v_core_equipment: MVCoreEquipment[];
  /** 잔여 매트릭스 강화 포인트 */
  readonly character_v_matrix_remain_slot_upgrade_point: number;
}

// ─── GET /maplestorym/v1/character/hexamatrix-skill ──────────────────────────

/** HEXA 코어 연결 스킬 정보 */
export interface MHexaLinkedSkill {
  /** HEXA 스킬 명 */
  readonly hexa_skill_id: string;
}

/** HEXA 코어 개별 정보 */
export interface MHexaCoreEquipment {
  /** 코어 명 */
  readonly hexa_core_name: string;
  /** 코어 레벨 */
  readonly hexa_core_level: number;
  /** 코어 타입 */
  readonly hexa_core_type: string;
  /** 연결된 스킬 */
  readonly linked_skill: MHexaLinkedSkill[];
}

/** GET /maplestorym/v1/character/hexamatrix-skill 응답 */
export interface MCharacterHexaMatrixSkill {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** HEXA 코어 정보 */
  readonly character_hexa_core_equipment: MHexaCoreEquipment[];
}

// ─── GET /maplestorym/v1/character/hexamatrix-stat ───────────────────────────

/** HEXA 스탯 코어 개별 정보 */
export interface MHexaStatCore {
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

/** GET /maplestorym/v1/character/hexamatrix-stat 응답 */
export interface MCharacterHexaMatrixStat {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** HEXA 스탯 코어 정보 */
  readonly character_hexa_stat_core: MHexaStatCore[];
  /** 프리셋 HEXA 스탯 코어 정보 */
  readonly preset_hexa_stat_core: MHexaStatCore[];
}
