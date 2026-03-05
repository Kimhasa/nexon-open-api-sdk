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

/** 장비 옵션 (기본/추가/잠재/에디셔널 잠재 공용) */
export interface MItemOption {
  /** 옵션 번호 */
  readonly option_no: number;
  /** 옵션 명 */
  readonly option_name: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 소울 정보 */
export interface MSoulInfo {
  /** 소울 명 */
  readonly soul_name: string;
  /** 소울 옵션 */
  readonly soul_option: string;
}

/** 문장(엠블렘) 정보 */
export interface MEmblemInfo {
  /** 문장 명 */
  readonly emblem_name: string;
  /** 문장 레벨 */
  readonly emblem_level: string;
  /** 문장 옵션 */
  readonly emblem_option: string;
}

/** 장착 장비 개별 정보 */
export interface MItemEquipment {
  /** 장착 아이템 명 */
  readonly item_name: string;
  /** 장착 아이템 부위 */
  readonly item_equipment_page_name: string;
  /** 장착 아이템 슬롯 위치 */
  readonly item_equipment_slot_name: string;
  /** 아이템 등급 */
  readonly item_grade: string;
  /** 전투력 */
  readonly item_combat_power: number;
  /** 스타포스 강화 단계 */
  readonly starforce_upgrade: string;
  /** 남은 스타포스 확장 수 */
  readonly starforce_remain_count: number;
  /** 착용 가능 레벨 */
  readonly equipment_level: number;
  /** 착용 가능 성별 */
  readonly item_gender: string;
  /** 남은 카르마의 가위 사용 가능 횟수 */
  readonly cuttable_count: number;
  /** 전승 가능 여부 */
  readonly transmission_able: string;
  /** 전수 가능 여부 */
  readonly todd_able: string;
  /** 추가 옵션 등급 (1,4:파란색, 2:보라색, 3:주황색) */
  readonly item_additional_option_grade: string;
  /** 잠재 능력 등급 (1:레어, 2:에픽, 3:유니크, 4:레전더리) */
  readonly item_potential_option_grade: string;
  /** 에디셔널 잠재 능력 등급 (1:레어, 2:에픽, 3:유니크, 4:레전더리) */
  readonly item_additional_potential_option_grade: string;
  /** 아이템 아이콘 */
  readonly item_icon: string;
  /**
   * 기본 옵션.
   * @deprecated item_basic_option을 사용해주세요.
   */
  readonly item_option: string;
  /** 기본 옵션 */
  readonly item_basic_option: MItemOption[];
  /** 추가 옵션 */
  readonly item_additional_option: MItemOption[];
  /** 잠재 능력 */
  readonly item_potential_option: MItemOption[];
  /** 에디셔널 잠재능력 */
  readonly item_additional_potential_option: MItemOption[];
  /** 소울 장착 여부 (0:미장착, 1:장착) */
  readonly soul_equipment_flag: string;
  /** 소울 정보 */
  readonly soul_info: MSoulInfo;
  /** 문장 정보 */
  readonly emblem_info: MEmblemInfo;
}

/** 장비 프리셋 정보 */
export interface MEquipmentPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 아이템 정보 */
  readonly item_equipment: MItemEquipment[];
  /** 소울 세트 옵션 */
  readonly soul_set_option: string;
}

/** GET /maplestorym/v1/character/item-equipment 응답 */
export interface MCharacterItemEquipment {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: number;
  /** 장착 아이템 정보 */
  readonly item_equipment: MItemEquipment[];
  /** 소울 세트 옵션 */
  readonly soul_set_option: string;
  /** 프리셋별 아이템 정보 */
  readonly equipment_preset: MEquipmentPreset[];
}

// ─── GET /maplestorym/v1/character/cashitem-equipment ────────────────────────

/** 캐시 아이템 옵션 정보 */
export interface MCashItemOption {
  /** 옵션 명 */
  readonly option_name: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 캐시 아이템 컬러링프리즘 정보 */
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

/** 캐시 아이템 개별 정보 */
export interface MCashItemEquipmentItem {
  /** 캐시 아이템 부위 */
  readonly cash_item_equipment_page_name: string;
  /** 캐시 아이템 슬롯 위치 */
  readonly cash_item_equipment_slot_name: string;
  /** 캐시 아이템 명 */
  readonly cash_item_name: string;
  /** 캐시 아이템 아이콘 (컬러링 프리즘 효과 미반영 상태) */
  readonly cash_item_icon: string;
  /** 신비의 모루로 설정된 외형 아이템 명 */
  readonly miracle_anvil_item_name: string;
  /** 신비의 모루로 설정된 외형 아이템 아이콘 (컬러링 프리즘 효과 미반영 상태) */
  readonly miracle_anvil_item_icon: string;
  /** 캐시 아이템 설명 */
  readonly cash_item_description: string;
  /** 아이템 장착 가능 성별 */
  readonly cash_item_gender: number;
  /** 캐시 아이템 옵션 */
  readonly cash_item_option: MCashItemOption[];
  /** 캐시 아이템 유효 기간 (UTC:0) (null: 무제한) */
  readonly date_expire: string | null;
  /** 캐시 아이템 옵션 유효 기간 (UTC:0) (null: 무제한) */
  readonly date_option_expire: string | null;
  /** 캐시 아이템 라벨 정보 */
  readonly cash_item_label: string;
  /** 캐시 아이템 컬러링프리즘 정보 (null: 미적용) */
  readonly cash_item_coloring_prism: MCashItemColoringPrism | null;
}

/** 캐시 아이템 프리셋 정보 */
export interface MCashEquipmentPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 코디 정보 */
  readonly cash_item_equipment: MCashItemEquipmentItem[];
}

/** 드레스업 모드 캐시 아이템 프리셋 정보 */
export interface MAdditionalCashEquipmentPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 엔젤릭버스터 드레스업 모드 코디 정보 */
  readonly additional_cash_item_equipment: MCashItemEquipmentItem[];
}

/** GET /maplestorym/v1/character/cashitem-equipment 응답 */
export interface MCharacterCashItemEquipment {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: number;
  /** 적용 중인 드레스업 모드의 프리셋 번호 */
  readonly use_additional_preset_no: number;
  /** 캐릭터 외형 모드 (0:일반 모드, 1:엔젤릭버스터인 경우 드레스 업 모드) */
  readonly character_look_mode: string;
  /** 장착 코디 정보 */
  readonly cash_item_equipment: MCashItemEquipmentItem[];
  /** 엔젤릭버스터 드레스업 모드의 장착 코디 정보 */
  readonly additional_cash_item_equipment: MCashItemEquipmentItem[];
  /** 프리셋별 코디 정보 */
  readonly cash_equipment_preset: MCashEquipmentPreset[];
  /** 프리셋별 드레스업 모드의 코디 정보 */
  readonly additional_cash_equipment_preset: MAdditionalCashEquipmentPreset[];
}

// ─── GET /maplestorym/v1/character/symbol ────────────────────────────────────

/** 심볼 개별 정보 */
export interface MSymbolInfo {
  /** 심볼 명 */
  readonly symbol_name: string;
  /** 심볼 아이콘 */
  readonly symbol_icon: string;
  /** 심볼 레벨 */
  readonly symbol_level: number;
  /** 심볼 성장치 */
  readonly symbol_growth_value: number;
  /** 심볼 옵션 */
  readonly symbol_option: string;
}

/** GET /maplestorym/v1/character/symbol 응답 */
export interface MCharacterSymbolEquipment {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 아케인심볼 정보 */
  readonly arcane_symbol: MSymbolInfo[];
  /** 어센틱심볼 정보 */
  readonly authentic_symbol: MSymbolInfo[];
}

// ─── GET /maplestorym/v1/character/set-effect ────────────────────────────────

/** 세트 정보 */
export interface MSetInfo {
  /** 세트 명 */
  readonly set_name: string;
  /** 캐릭터의 세트 아이템 착용 수 */
  readonly set_count: number;
  /** 세트 옵션 */
  readonly set_option: string;
}

/** GET /maplestorym/v1/character/set-effect 응답 */
export interface MCharacterSetEffect {
  /** 세트 정보 */
  readonly set_info: MSetInfo[];
}

// ─── GET /maplestorym/v1/character/android-equipment ─────────────────────────

/** 안드로이드 캐시 아이템 개별 정보 */
export interface MAndroidCashItem {
  /** 안드로이드 캐시 아이템 부위 */
  readonly cash_item_equipment_page_name: string;
  /** 안드로이드 캐시 아이템 슬롯 위치 */
  readonly cash_item_equipment_slot_name: string;
  /** 안드로이드 캐시 아이템 명 */
  readonly cash_item_name: string;
  /** 안드로이드 캐시 아이템 아이콘 */
  readonly cash_item_icon: string;
  /** 안드로이드 캐시 아이템 설명 */
  readonly cash_item_description: string;
  /** 아이템 장착 가능 성별 */
  readonly android_item_gender: string;
  /** 안드로이드 캐시 아이템 라벨 정보 */
  readonly cash_item_label: string;
  /** 안드로이드 캐시 아이템 컬러링프리즘 정보 */
  readonly cash_item_coloring_prism: MCashItemColoringPrism | null;
}

/** 안드로이드 장착 정보 */
export interface MAndroidEquipmentInfo {
  /** 안드로이드 명 */
  readonly android_name: string;
  /** 안드로이드 닉네임 */
  readonly android_nickname: string;
  /** 안드로이드 아이콘 */
  readonly android_icon: string;
  /** 안드로이드 설명 */
  readonly android_description: string;
  /** 안드로이드 등급 */
  readonly android_grade: string;
  /** 안드로이드 성별 */
  readonly android_gender: string;
  /** 비인간형 안드로이드 여부 (0:인간형, 1:비인간형) */
  readonly android_non_humanoid_flag: string;
  /** 창고 기능 이용 가능 여부 (0:불가, 1:가능) */
  readonly android_warehouse_usable_flag: string;
  /** 이어센서 클립 적용 여부 (0:미적용, 1:적용) */
  readonly android_ear_sensor_clip_flag: string;
  /** 안드로이드 캐시 아이템 장착 정보 */
  readonly android_cash_item_equipment: MAndroidCashItem[];
}

/** 기계 심장 장착 정보 */
export interface MHeartEquipment {
  /** 기계 심장 명 */
  readonly heart_name: string;
  /** 기계 심장 아이콘 */
  readonly heart_icon: string;
  /** 기계 심장 설명 */
  readonly heart_description: string;
  /** 추가 옵션 등급 (1,4:파란색, 2:보라색, 3:주황색) */
  readonly item_additional_option_grade: string;
  /** 잠재능력 등급 (1:레어, 2:에픽, 3:유니크) */
  readonly item_potential_option_grade: string;
  /** 추가 옵션 */
  readonly item_additional_option: MItemOption[];
  /** 잠재능력 */
  readonly item_potential_option: MItemOption[];
}

/** 안드로이드 + 기계 심장 프리셋 정보 */
export interface MAndroidHeartPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 안드로이드 정보 */
  readonly android_equipment: MAndroidEquipmentInfo;
  /** 기계 심장 정보 */
  readonly heart_equipment: MHeartEquipment;
}

/** GET /maplestorym/v1/character/android-equipment 응답 */
export interface MCharacterAndroidEquipment {
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: number;
  /** 장착 안드로이드 정보 */
  readonly android_equipment: MAndroidEquipmentInfo;
  /** 장착 기계 심장 정보 */
  readonly heart_equipment: MHeartEquipment;
  /** 프리셋별 안드로이드 및 기계 심장 정보 */
  readonly android_heart_equipment_preset: MAndroidHeartPreset[];
}

// ─── 아래 엔드포인트는 실제 API 스펙 확인 후 구현 예정 ────────────────────────

// ─── GET /maplestorym/v1/character/jewel ─────────────────────────────────────

/** 쥬얼 개별 정보 */
export interface MJewelInfo {
  /** 슬롯 번호 */
  readonly slot_no: number;
  /** 쥬얼 명 */
  readonly jewel_name: string;
  /** 쥬얼 등급 */
  readonly jewel_grade: string;
  /** 쥬얼 색상 */
  readonly jewel_color: string;
  /** 쥬얼 옵션 */
  readonly jewel_option: string;
  /** 쥬얼 아이콘 */
  readonly jewel_icon: string;
}

/** 쥬얼 페이지별 장착 정보 */
export interface MJewelEquipmentPage {
  /** 장착 아이템 명 */
  readonly jewel_page_no: number;
  /** 쥬얼 정보 */
  readonly jewel_info: MJewelInfo[];
}

/** GET /maplestorym/v1/character/jewel 응답 */
export interface MCharacterJewel {
  /** 적용 중인 쥬얼 페이지 번호 */
  readonly use_jewel_page_no: number;
  /** 적용 중인 쥬얼 세트 옵션 */
  readonly use_jewel_set_option: string;
  /** 쥬얼 장착 정보 */
  readonly jewel_equipment: MJewelEquipmentPage[];
}

// ─── GET /maplestorym/v1/character/beauty-equipment ──────────────────────────

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

/** GET /maplestorym/v1/character/beauty-equipment 응답 */
export interface MCharacterBeautyEquipment {
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 캐릭터 헤어 정보 (엔젤릭버스터인 경우 일반 모드) */
  readonly character_hair: MHairInfo;
  /** 캐릭터 성형 정보 (엔젤릭버스터인 경우 일반 모드) */
  readonly character_face: MFaceInfo;
  /** 피부 명 (엔젤릭버스터인 경우 일반 모드) */
  readonly character_skin_name: string;
  /** 엔젤릭버스터 드레스 업 모드 헤어 정보 */
  readonly additional_character_hair: MHairInfo;
  /** 엔젤릭버스터 드레스 업 모드 성형 정보 */
  readonly additional_character_face: MFaceInfo;
  /** 엔젤릭버스터 드레스 업 모드 피부 명 */
  readonly additional_character_skin_name: string;
}

// ─── GET /maplestorym/v1/character/pet-equipment ─────────────────────────────

/** 펫 세트 옵션 정보 */
export interface MPetSetOption {
  /** 세트 옵션 명 */
  readonly set_name: string;
  /** 세트 개수 */
  readonly set_count: number;
  /** 세트 옵션 */
  readonly set_option: string;
}

/** GET /maplestorym/v1/character/pet-equipment 응답 */
export interface MCharacterPetEquipment {
  /** 펫1 명 */
  readonly pet_1_name: string;
  /** 펫1 원더 펫 종류 */
  readonly pet_1_pet_type: string;
  /** 펫1 마법의 시간 (UTC0) */
  readonly pet_1_date_expire: string;
  /** 펫1 아이콘 */
  readonly pet_1_icon: string;
  /** 펫2 명 */
  readonly pet_2_name: string;
  /** 펫2 원더 펫 종류 */
  readonly pet_2_pet_type: string;
  /** 펫2 마법의 시간 (UTC0) */
  readonly pet_2_date_expire: string;
  /** 펫2 아이콘 */
  readonly pet_2_icon: string;
  /** 펫3 명 */
  readonly pet_3_name: string;
  /** 펫3 원더 펫 종류 */
  readonly pet_3_pet_type: string;
  /** 펫3 마법의 시간 (UTC0) */
  readonly pet_3_date_expire: string;
  /** 펫3 아이콘 */
  readonly pet_3_icon: string;
  /** 창작 펫 세트 정보 */
  readonly pet_set_option: MPetSetOption[];
}

// ─── GET /maplestorym/v1/character/skill-equipment ───────────────────────────

/** 장착 스킬 개별 정보 */
export interface MEquipmentSkill {
  /** 현재 사용 중인 스킬 모드 */
  readonly skill_mode: number;
  /** 해당 스킬을 장착한 스킬 세팅 */
  readonly equipment_skill_set: string;
  /** 스킬 장착 슬롯 인덱스 */
  readonly slot_id: string;
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
  /** 스킬 타입 */
  readonly skill_type: string;
  /** 스킬 차수 (프리셋의 경우 스킬 프리셋 번호) */
  readonly skill_grade: string;
  /** 추가 기능 활성화 여부 */
  readonly add_feature_flag: string;
}

/** 스킬 프리셋 정보 */
export interface MSkillPreset {
  /** 스킬 프리셋 번호 */
  readonly preset_slot_no: number;
  /** 1번 슬롯에 등록된 스킬 명 */
  readonly skill_name_1: string;
  /** 1번 슬롯에 등록된 스킬 아이콘 */
  readonly skill_icon_1: string;
  /** 2번 슬롯에 등록된 스킬 명 */
  readonly skill_name_2: string;
  /** 2번 슬롯에 등록된 스킬 아이콘 */
  readonly skill_icon_2: string;
  /** 3번 슬롯에 등록된 스킬 명 */
  readonly skill_name_3: string;
  /** 3번 슬롯에 등록된 스킬 아이콘 */
  readonly skill_icon_3: string;
  /** 4번 슬롯에 등록된 스킬 명 */
  readonly skill_name_4: string;
  /** 4번 슬롯에 등록된 스킬 아이콘 */
  readonly skill_icon_4: string;
  /** 스킬 프리셋 커맨드 ON 활성화 여부 */
  readonly preset_command_flag: string;
}

/** 팬텀 탤런트 오브 팬텀시프 스킬 정보 */
export interface MStealSkill {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
  /** 스킬 슬롯 정보 */
  readonly skill_slot: string;
}

/** 시아 스텔라 메모라이즈 스킬 정보 */
export interface MStellaMemorize {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
  /** 스킬을 장착한 스킬 세팅 */
  readonly equipment_skill_set: string;
}

/** 스킬 정보 (중첩 객체) */
export interface MSkillInfo {
  /** 장착한 스킬 정보 */
  readonly equipment_skill: MEquipmentSkill[];
  /** 스킬 프리셋 */
  readonly preset: MSkillPreset[];
  /** 팬텀 탤런트 오브 팬텀시프 스킬 */
  readonly steal_skill: MStealSkill[];
  /** 시아 스텔라 메모라이즈 스킬 */
  readonly stella_memorize: MStellaMemorize[];
}

/** GET /maplestorym/v1/character/skill-equipment 응답 */
export interface MCharacterSkillEquipment {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** 스킬 정보 */
  readonly skill: MSkillInfo;
}

// ─── GET /maplestorym/v1/character/link-skill ────────────────────────────────

/** 링크 스킬 개별 정보 */
export interface MLinkSkillInfo {
  /** 링크 스킬 명 */
  readonly skill_name: string;
  /** 링크 스킬 레벨 */
  readonly skill_level: string;
  /** 링크 스킬 설명 */
  readonly skill_description: string;
  /** 스킬 효과 */
  readonly skill_effect: string;
  /** 다음 스킬 레벨 효과 */
  readonly skill_effect_next: string;
  /** 링크 스킬 아이콘 */
  readonly skill_icon: string;
}

/** 링크 스킬 프리셋 정보 */
export interface MLinkSkillPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 링크 스킬 정보 */
  readonly link_skill_info: MLinkSkillInfo[];
}

/** GET /maplestorym/v1/character/link-skill 응답 */
export interface MCharacterLinkSkill {
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: number;
  /** 링크 스킬 */
  readonly link_skill: MLinkSkillPreset[];
}

// ─── GET /maplestorym/v1/character/vmatrix ───────────────────────────────────

/** V코어 개별 정보 */
export interface MVCoreEquipment {
  /** 슬롯 인덱스 */
  readonly slot_id: string;
  /** 슬롯 레벨 */
  readonly slot_level: number;
  /** 코어 명 */
  readonly vcore_name: string;
  /** 코어 타입 */
  readonly vcore_type: string;
  /** 코어 레벨 */
  readonly vcore_level: number;
  /** 코어에 해당하는 스킬 명 */
  readonly vcore_skill_name_1: string;
  /** (강화 코어) 두 번째 스킬 명 */
  readonly vcore_skill_name_2: string;
  /** (강화 코어) 세 번째 스킬 명 */
  readonly vcore_skill_name_3: string;
}

/** GET /maplestorym/v1/character/vmatrix 응답 */
export interface MCharacterVMatrix {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** V코어 정보 */
  readonly character_v_core_equipment: MVCoreEquipment[];
}

// ─── GET /maplestorym/v1/character/hexamatrix-skill ──────────────────────────

/** HEXA매트릭스 스킬 개별 정보 */
export interface MHexaMatrixSkillInfo {
  /** 슬롯 번호 */
  readonly slot_no: number;
  /** 슬롯 레벨 */
  readonly slot_level: number;
  /** 스킬 타입 */
  readonly skill_type: string;
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 설명 */
  readonly skill_description: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
}

/** GET /maplestorym/v1/character/hexamatrix-skill 응답 */
export interface MCharacterHexaMatrixSkill {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** HEXA매트릭스 스킬 정보 */
  readonly hexamatrix_skill: MHexaMatrixSkillInfo[];
}

// ─── GET /maplestorym/v1/character/hexamatrix-stat ───────────────────────────

/** HEXA 스탯 페이지 정보 */
export interface MHexaStatInfo {
  /** 스탯 코어 페이지 번호 */
  readonly page_no: number;
  /** 활성화 여부 */
  readonly activate_flag: string;
  /** 메인 스탯 */
  readonly main_stat: string;
  /** 메인 스탯 강화 레벨 */
  readonly main_stat_level: number;
  /** 서브 1 스탯 */
  readonly sub_1_stat: string;
  /** 서브 1 스탯 강화 레벨 */
  readonly sub_1_stat_level: number;
  /** 서브 2 스탯 */
  readonly sub_2_stat: string;
  /** 서브 2 스탯 강화 레벨 */
  readonly sub_2_stat_level: number;
}

/** HEXA 스탯 코어 정보 */
export interface MHexaStatCore {
  /** 스탯 코어 슬롯 */
  readonly stat_core_slot: number;
  /** 스탯 정보 */
  readonly stat_info: MHexaStatInfo[];
}

/** GET /maplestorym/v1/character/hexamatrix-stat 응답 */
export interface MCharacterHexaMatrixStat {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** HEXA 스탯 정보 */
  readonly hexamatrix_stat: MHexaStatCore[];
}
