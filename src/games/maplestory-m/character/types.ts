// ─── GET /maplestorym/v1/character/basic ─────────────────────────────────────

/** 캐릭터 기본 정보 — `client.maplestorym.character.getBasic()` 의 응답. */
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

/** 캐릭터 스탯 — `client.maplestorym.character.getStat()` 의 응답. */
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

/** 하이퍼 스탯 — `client.maplestorym.character.getHyperStat()` 의 응답. */
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

/** 가입한 길드 — `client.maplestorym.character.getGuild()` 의 응답. */
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
  readonly emblem_level: number;
  /** 문장 옵션 */
  readonly emblem_option: string;
}

/** 마스터리 정보 */
export interface MItemMasteryInfo {
  /** 마스터리 레벨 */
  readonly mastery_level: number;
  /** 마스터리 경험치 */
  readonly mastery_exp: number;
  /** 기본 옵션 보너스 포인트 */
  readonly base_option_point: number;
  /** 잠재 옵션 보너스 포인트 */
  readonly potential_option_point: number;
  /** 추가 옵션 보너스 포인트 */
  readonly additional_option_point: number;
  /** 에디셔널 잠재 옵션 보너스 포인트 */
  readonly additional_potential_option_point: number;
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
  /** 장비 전투력. 값이 없으면 null */
  readonly item_combat_power: number | null;
  /** 스타포스 강화 단계. 값이 없으면 null */
  readonly starforce_upgrade: string | null;
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
  /** 추가 옵션 등급 (1,4:파란색, 2:보라색, 3:주황색). 추가 옵션이 없으면 null */
  readonly item_additional_option_grade: string | null;
  /** 잠재 능력 등급 (1:레어, 2:에픽, 3:유니크, 4:레전더리). 잠재 능력이 없으면 null */
  readonly item_potential_option_grade: string | null;
  /** 에디셔널 잠재 능력 등급 (1:레어, 2:에픽, 3:유니크, 4:레전더리). 에디셔널 잠재 능력이 없으면 null */
  readonly item_additional_potential_option_grade: string | null;
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
  /** 소울 정보. 장착한 소울이 없으면 null */
  readonly soul_info: MSoulInfo | null;
  /** 문장 정보. 문장이 없으면 null */
  readonly emblem_info: MEmblemInfo | null;
  /** 프리스타일 쿠폰 적용 여부 (0:미적용, 1:적용). 프리셋 장비에서는 null 이 올 수 있다 (2026-11-24 실측) */
  readonly freestyle_coupon_flag?: string | null | undefined;
  /** 마스터리 정보. 값이 없으면 null */
  readonly mastery_info?: MItemMasteryInfo | null | undefined;
}

/** 장비 프리셋 정보 */
export interface MEquipmentPreset {
  /** 프리셋 번호 */
  readonly preset_no: number;
  /** 아이템 정보 */
  readonly item_equipment: MItemEquipment[];
  /** 소울 세트 옵션. 세트 효과가 없는 프리셋이면 null (2026-11-24 실측) */
  readonly soul_set_option: string | null;
}

/** 장착 장비(캐시 아이템 제외) — `client.maplestorym.character.getItemEquipment()` 의 응답. */
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
  /** 신비의 모루로 설정된 외형 아이템 명. 모루를 적용하지 않았으면 null */
  readonly miracle_anvil_item_name: string | null;
  /** 신비의 모루로 설정된 외형 아이템 아이콘 (컬러링 프리즘 효과 미반영 상태). 모루를 적용하지 않았으면 null */
  readonly miracle_anvil_item_icon: string | null;
  /** 캐시 아이템 설명 */
  readonly cash_item_description: string;
  /** 아이템 장착 가능 성별 */
  readonly cash_item_gender: string;
  /** 캐시 아이템 옵션 */
  readonly cash_item_option: MCashItemOption[];
  /** 캐시 아이템 유효 기간 (UTC:0) (null: 무제한) */
  readonly date_expire: string | null;
  /** 캐시 아이템 옵션 유효 기간 (UTC:0) (null: 무제한) */
  readonly date_option_expire: string | null;
  /** 캐시 아이템 라벨 정보. 라벨이 없으면 null */
  readonly cash_item_label: string | null;
  /** 캐시 아이템 컬러링프리즘 정보 (null: 미적용) */
  readonly cash_item_coloring_prism: MCashItemColoringPrism | null;
  /** 프리스타일 쿠폰 적용 여부 (0:미적용, 1:적용) */
  readonly freestyle_coupon_flag?: string | undefined;
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

/** 장착 캐시 아이템 — `client.maplestorym.character.getCashItemEquipment()` 의 응답. */
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

/** 장착 심볼(아케인·어센틱) — `client.maplestorym.character.getSymbol()` 의 응답. */
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

/** 적용 중인 세트 효과 — `client.maplestorym.character.getSetEffect()` 의 응답. */
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
  /** 안드로이드 캐시 아이템 장착 가능 성별. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 `cash_item_gender`로 온다. */
  readonly android_item_gender?: string | undefined;
  /** 안드로이드 캐시 아이템 장착 가능 성별. 실제 응답의 필드. 포털 스펙에는 `android_item_gender`로 적혀 있다. */
  readonly cash_item_gender?: string | undefined;
  /** 안드로이드 캐시 아이템 라벨 정보. 라벨이 없으면 null */
  readonly cash_item_label: string | null;
  /** 안드로이드 캐시 아이템 컬러링프리즘 정보 */
  readonly cash_item_coloring_prism: MCashItemColoringPrism | null;
  /** 프리스타일 쿠폰 적용 여부 (0:미적용, 1:적용) */
  readonly freestyle_coupon_flag?: string | undefined;
}

/** 안드로이드 장착 정보 */
export interface MAndroidEquipmentInfo {
  /** 안드로이드 명 */
  readonly android_name: string;
  /** 안드로이드 닉네임. 닉네임을 정하지 않았으면 null (2026-11-24 실측) */
  readonly android_nickname: string | null;
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

/** 장착 안드로이드 — `client.maplestorym.character.getAndroidEquipment()` 의 응답. */
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
  /** 쥬얼 페이지 번호 */
  readonly jewel_page_no: number;
  /** 쥬얼 정보 */
  readonly jewel_info: MJewelInfo[];
}

/** 장착 쥬얼 — `client.maplestorym.character.getJewel()` 의 응답. */
export interface MCharacterJewel {
  /** 적용 중인 쥬얼 페이지 번호 */
  readonly use_jewel_page_no: number;
  /** 적용 중인 쥬얼 세트 옵션. 세트 효과가 없으면 null (2026-11-24 실측) */
  readonly use_jewel_set_option: string | null;
  /** 쥬얼 장착 정보 */
  readonly jewel_equipment: MJewelEquipmentPage[];
}

// ─── GET /maplestorym/v1/character/beauty-equipment ──────────────────────────

/** 헤어 정보 */
export interface MHairInfo {
  /** 헤어 명. 값이 없으면 null */
  readonly hair_name: string | null;
  /** 헤어 베이스 컬러. 값이 없으면 null */
  readonly base_color: string | null;
  /** 헤어 믹스 컬러. 믹스 컬러가 없으면 null */
  readonly mix_color: string | null;
  /** 헤어 믹스 컬러의 염색 비율. 값이 없으면 null */
  readonly mix_rate: string | null;
  /** 프리스타일 쿠폰 적용 여부 (0:미적용, 1:적용). 값이 없으면 null */
  readonly freestyle_coupon_flag?: string | null | undefined;
}

/** 성형 정보 */
export interface MFaceInfo {
  /** 성형 명. 값이 없으면 null */
  readonly face_name: string | null;
  /** 성형 베이스 컬러. 값이 없으면 null */
  readonly base_color: string | null;
  /** 성형 믹스 컬러. 믹스 컬러가 없으면 null */
  readonly mix_color: string | null;
  /** 성형 믹스 컬러의 염색 비율. 값이 없으면 null */
  readonly mix_rate: string | null;
  /** 프리스타일 쿠폰 적용 여부 (0:미적용, 1:적용). 값이 없으면 null */
  readonly freestyle_coupon_flag?: string | null | undefined;
}

/** 헤어·성형·피부 — `client.maplestorym.character.getBeautyEquipment()` 의 응답. */
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
  /** 엔젤릭버스터 드레스 업 모드 피부 명. 드레스 업 외형 정보가 없으면 null */
  readonly additional_character_skin_name: string | null;
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

/** 장착 펫 — `client.maplestorym.character.getPetEquipment()` 의 응답. */
export interface MCharacterPetEquipment {
  /** 펫1 명. 펫 미장착 시 null */
  readonly pet_1_name: string | null;
  /** 펫1 원더 펫 종류. 값이 없으면 null */
  readonly pet_1_pet_type: string | null;
  /** 펫1 마법의 시간 (UTC0). 값이 없으면 null */
  readonly pet_1_date_expire: string | null;
  /** 펫1 아이콘. 펫 미장착 시 null */
  readonly pet_1_icon: string | null;
  /** 펫2 명. 펫 미장착 시 null */
  readonly pet_2_name: string | null;
  /** 펫2 원더 펫 종류. 값이 없으면 null */
  readonly pet_2_pet_type: string | null;
  /** 펫2 마법의 시간 (UTC0). 값이 없으면 null */
  readonly pet_2_date_expire: string | null;
  /** 펫2 아이콘. 펫 미장착 시 null */
  readonly pet_2_icon: string | null;
  /** 펫3 명. 펫 미장착 시 null */
  readonly pet_3_name: string | null;
  /** 펫3 원더 펫 종류. 값이 없으면 null */
  readonly pet_3_pet_type: string | null;
  /** 펫3 마법의 시간 (UTC0). 값이 없으면 null */
  readonly pet_3_date_expire: string | null;
  /** 펫3 아이콘. 펫 미장착 시 null */
  readonly pet_3_icon: string | null;
  /** 창작 펫 세트 정보 */
  readonly pet_set_option: MPetSetOption[];
}

// ─── GET /maplestorym/v1/character/skill-equipment ───────────────────────────

/** 장착 스킬 개별 정보 */
export interface MEquipmentSkill {
  /** 현재 사용 중인 스킬 모드 */
  readonly skill_mode: number;
  /** 해당 스킬을 장착한 스킬 세팅 */
  readonly equipment_skill_set: number;
  /** 스킬 장착 슬롯 인덱스 */
  readonly slot_id: string;
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
  /** 스킬 타입. 값이 없으면 null */
  readonly skill_type: string | null;
  /** 스킬 차수 (프리셋의 경우 스킬 프리셋 번호). 값이 없으면 null */
  readonly skill_grade: string | null;
  /** 추가 기능 활성화 여부. 값이 없으면 null */
  readonly add_feature_flag: string | null;
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
  /** 3번 슬롯에 등록된 스킬 명. 슬롯이 비어 있으면 null */
  readonly skill_name_3: string | null;
  /** 3번 슬롯에 등록된 스킬 아이콘. 슬롯이 비어 있으면 null */
  readonly skill_icon_3: string | null;
  /** 4번 슬롯에 등록된 스킬 명. 슬롯이 비어 있으면 null */
  readonly skill_name_4: string | null;
  /** 4번 슬롯에 등록된 스킬 아이콘. 슬롯이 비어 있으면 null */
  readonly skill_icon_4: string | null;
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

/** 장착 스킬 — `client.maplestorym.character.getSkillEquipment()` 의 응답. */
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
  readonly skill_level: number;
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

/** 장착 링크 스킬 — `client.maplestorym.character.getLinkSkill()` 의 응답. */
export interface MCharacterLinkSkill {
  /** 적용 중인 링크 스킬 프리셋 번호. 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 `use_prest_no`로 온다. */
  readonly use_preset_no?: number | undefined;
  /** 적용 중인 링크 스킬 프리셋 번호. 실제 응답의 필드. 포털 스펙에는 `use_preset_no`로 적혀 있다. */
  readonly use_prest_no?: number | undefined;
  /** 링크 스킬 */
  readonly link_skill: MLinkSkillPreset[];
}

// ─── GET /maplestorym/v1/character/vmatrix ───────────────────────────────────

/** V코어 개별 정보 */
export interface MVCoreEquipment {
  /** @deprecated 현재 포털 스펙에서 제거된 필드입니다. */
  readonly slot_id?: string | undefined;
  /** @deprecated 현재 포털 스펙에서 제거된 필드입니다. */
  readonly slot_level?: number | undefined;
  /** @deprecated 현재 포털 스펙에서 제거된 필드입니다. */
  readonly vcore_name?: string | undefined;
  /** 코어 타입 */
  readonly vcore_type: string;
  /** 코어 레벨 */
  readonly vcore_level: number;
  /** @deprecated 현재 포털 스펙에서 제거된 필드입니다. `vcore_skill_name1`을 사용하세요. */
  readonly vcore_skill_name_1?: string | undefined;
  /** @deprecated 현재 포털 스펙에서 제거된 필드입니다. `vcore_skill_name2`을 사용하세요. */
  readonly vcore_skill_name_2?: string | undefined;
  /** @deprecated 현재 포털 스펙에서 제거된 필드입니다. `vcore_skill_name3`을 사용하세요. */
  readonly vcore_skill_name_3?: string | undefined;
  /** 코어 점수 */
  readonly vcore_score?: number | undefined;
  /** 스킬 명 1 */
  readonly vcore_skill_name1?: string | undefined;
  /** 스킬 명 2. 해당 코어에 두 번째 스킬이 없으면 null */
  readonly vcore_skill_name2?: string | null | undefined;
  /** 스킬 명 3. 해당 코어에 세 번째 스킬이 없으면 null */
  readonly vcore_skill_name3?: string | null | undefined;
  /** 스킬 명 4. 해당 코어에 네 번째 스킬이 없으면 null */
  readonly vcore_skill_name4?: string | null | undefined;
  /** 기간제 여부 (0:영구, 1:기간제) */
  readonly vcore_expire_flag?: string | undefined;
  /** 만료 시간 (UTC0). 영구 코어는 null */
  readonly vcore_expire_date?: string | null | undefined;
  /** 장착 여부 (0:미장착, 1:장착) */
  readonly vcore_equipment_flag?: string | undefined;
}

/** V매트릭스 — `client.maplestorym.character.getVMatrix()` 의 응답. */
export interface MCharacterVMatrix {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** V코어 정보 */
  readonly character_v_core_equipment: MVCoreEquipment[];
  /** V매트릭스 합산 점수 */
  readonly vmatrix_total_score?: number | undefined;
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
  /** 코어 점수 */
  readonly skill_score?: number | undefined;
}

/** HEXA매트릭스 스킬 — `client.maplestorym.character.getHexaMatrixSkill()` 의 응답. */
export interface MCharacterHexaMatrixSkill {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** HEXA매트릭스 스킬 정보 */
  readonly hexamatrix_skill: MHexaMatrixSkillInfo[];
  /** HEXA매트릭스 합산 점수 */
  readonly hexamatrix_total_score?: number | undefined;
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

/** HEXA매트릭스 스탯 — `client.maplestorym.character.getHexaMatrixStat()` 의 응답. */
export interface MCharacterHexaMatrixStat {
  /** 캐릭터 직업 */
  readonly character_class: string;
  /** HEXA 스탯 정보 */
  readonly hexamatrix_stat: MHexaStatCore[];
}
