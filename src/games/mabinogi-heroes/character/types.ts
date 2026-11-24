import type { HeroesStatValue } from '../types.js';

// ─── GET /heroes/v2/character/basic ─────────────────────────────────────────

/** 스킬 각성 정보 */
export interface HeroesSkillAwakening {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 사용된 각성의 돌 */
  readonly item_name: string;
}

/** 드레스 수집 포인트 정보 */
export interface HeroesDressPoint {
  /** 드레스 수집 포인트 */
  readonly total_point: number;
  /** 아바타 수집 포인트 */
  readonly avatar_point: number;
  /** 등 수집 포인트 */
  readonly back_point: number;
  /** 꼬리 수집 포인트 */
  readonly tail_point: number;
  /** 오브젝트 수집 포인트 */
  readonly object_point: number;
}

/**
 * 캐릭터 기본 정보 응답.
 *
 * 버프, 아이템 사용 등으로 적용된 효과 때문에 경험치·레벨이 게임 내 데이터와 다를 수 있습니다.
 */
export interface HeroesCharacterBasic {
  /** 영웅(캐릭터) 명 */
  readonly character_name: string;
  /** 영웅(캐릭터) 생성 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly character_date_create: string;
  /** 최근 7일간 접속 여부. `"true"` | `"false"` (boolean이 아닌 문자열) */
  readonly access_flag: string;
  /** 영웅(캐릭터) 직업 명 */
  readonly character_class_name: string;
  /** 영웅(캐릭터) 성별 */
  readonly character_gender: string;
  /** 영웅(캐릭터) 경험치 */
  readonly character_exp: number;
  /** 영웅(캐릭터) 레벨 */
  readonly character_level: number;
  /** 카르제 이름 (스펙에 nullable 표기는 없으나 미설정 계정을 고려해 null 허용) */
  readonly cairde_name: string | null;
  /** 획득한 내 타이틀 개수 */
  readonly title_count: number;
  /** 내 타이틀로 획득하지 않은 ID 타이틀 개수 */
  readonly id_title_count: number;
  /** 획득한 모든 타이틀 총 개수 */
  readonly total_title_count: number;
  /** 타이틀로 오른 능력치의 합계 정보 */
  readonly title_stat: readonly HeroesStatValue[];
  /** 각성의 돌이 적용된 스킬 목록과 스킬 별 각성의 돌 정보 */
  readonly skill_awakening: readonly HeroesSkillAwakening[];
  /** 드레스 수집 포인트 정보 */
  readonly dress_point: HeroesDressPoint | null;
}

// ─── GET /heroes/v2/character/title ─────────────────────────────────────────

/** 보유 타이틀/문양 */
export interface HeroesTitle {
  /**
   * 타이틀 타입. `"title"`: 타이틀, `"pattern"`: 문양.
   * 2023년 11월 23일 이후 획득한 타이틀/문양만 값이 있고, 그 이전 것은 null일 수 있다.
   */
  readonly title_type: string | null;
  /** 타이틀/문양 명 */
  readonly title_name: string;
}

/** 타이틀/문양 보유 정보 응답 */
export interface HeroesCharacterTitle {
  /** 타이틀/문양 정보 */
  readonly title: readonly HeroesTitle[];
}

// ─── GET /heroes/v2/character/title-equipment ───────────────────────────────

/** 장착 타이틀/문양 */
export interface HeroesTitleEquipment {
  /** 장착 타이틀/문양 장착 위치 명 */
  readonly title_equipment_type_name: string;
  /**
   * 장착 타이틀 타입. `"title"`: 타이틀, `"pattern"`: 문양.
   * 2023년 11월 23일 이후 장착한 타이틀/문양만 값이 있고, 그 이전 것은 null일 수 있다.
   */
  readonly title_type: string | null;
  /** 장착 타이틀/문양 명 */
  readonly title_name: string;
}

/** 장착 타이틀/문양 정보 응답 */
export interface HeroesCharacterTitleEquipment {
  /** 장착 타이틀/문양 정보 */
  readonly title_equipment: readonly HeroesTitleEquipment[];
}

// ─── GET /heroes/v2/character/item-equipment ────────────────────────────────

/** 아이템 색상 정보 (색상 파트 1~5) */
export interface HeroesItemColor {
  /** 색상 파트 1 */
  readonly color_1: string | null;
  /** 색상 파트 2 */
  readonly color_2: string | null;
  /** 색상 파트 3 */
  readonly color_3: string | null;
  /** 색상 파트 4 */
  readonly color_4: string | null;
  /** 색상 파트 5 */
  readonly color_5: string | null;
}

/** 아바타 하의 이너아머 색상 정보 프리셋 */
export interface HeroesInnerArmorColor extends HeroesItemColor {
  /** 기본 색상 여부. `"0"`: 기본 색상 미적용, `"1"`: 기본 색상 적용 (숫자가 아닌 문자열) */
  readonly default_color_flag: string | null;
}

/**
 * 장착 아이템 옵션 정보.
 *
 * 스펙에는 nullable 표기가 없지만 아이템 종류(장비/캐시/아바타)에 따라 해당하지 않는 옵션이 많아
 * 모든 필드를 null 허용으로 둔다. 실 API 키로 검증되지 않았다.
 */
export interface HeroesItemEquipmentOption {
  /** 강화 단계 */
  readonly enhancement_level: number | null;
  /** 아이템 연마 능력치 */
  readonly tuning_stat: readonly HeroesStatValue[] | null;
  /** 장비에 부여된 어빌리티 명 */
  readonly ability_name: string | null;
  /** 활성화된 접두 인챈트 프리셋 번호. 장비를 장착하거나 게임에 재접속할 때 갱신된다 */
  readonly prefix_enchant_use_preset_no: number | null;
  /** 활성화된 접미 인챈트 프리셋 번호. 장비를 장착하거나 게임에 재접속할 때 갱신된다 */
  readonly suffix_enchant_use_preset_no: number | null;
  /** 1번 프리셋 접두 인챈트 명 */
  readonly prefix_enchant_preset_1: string | null;
  /** 1번 프리셋 접미 인챈트 명 */
  readonly suffix_enchant_preset_1: string | null;
  /** 2번 프리셋 접두 인챈트 명 */
  readonly prefix_enchant_preset_2: string | null;
  /** 2번 프리셋 접미 인챈트 명 */
  readonly suffix_enchant_preset_2: string | null;
  /** 활성화된 정령합성 프리셋 번호. 장비를 장착하거나 게임에 재접속할 때 갱신된다 */
  readonly power_infusion_use_preset_no: number | null;
  /** 1번 프리셋 정령합성 능력치 */
  readonly power_infusion_preset_1: readonly HeroesStatValue[] | null;
  /** 2번 프리셋 정령합성 능력치 */
  readonly power_infusion_preset_2: readonly HeroesStatValue[] | null;
  /** 캐시 아이템 및 이너아머 색상 정보 */
  readonly cash_item_color: HeroesItemColor | null;
  /** 사용 중인 아바타 및 아바타 하의 이너아머 아이템 색상 정보 프리셋 번호 */
  readonly avatar_color_use_preset_no: number | null;
  /** 1번 아바타 색상 정보 프리셋 */
  readonly avatar_color_preset_1: HeroesItemColor | null;
  /** 2번 아바타 색상 정보 프리셋 */
  readonly avatar_color_preset_2: HeroesItemColor | null;
  /** 3번 아바타 색상 정보 프리셋 */
  readonly avatar_color_preset_3: HeroesItemColor | null;
  /** 4번 아바타 색상 정보 프리셋 */
  readonly avatar_color_preset_4: HeroesItemColor | null;
  /** 5번 아바타 색상 정보 프리셋 */
  readonly avatar_color_preset_5: HeroesItemColor | null;
  /** 1번 아바타 하의 이너아머 색상 정보 프리셋 */
  readonly avatar_inner_armor_color_preset_1: HeroesInnerArmorColor | null;
  /** 2번 아바타 하의 이너아머 색상 정보 프리셋 */
  readonly avatar_inner_armor_color_preset_2: HeroesInnerArmorColor | null;
  /** 3번 아바타 하의 이너아머 색상 정보 프리셋 */
  readonly avatar_inner_armor_color_preset_3: HeroesInnerArmorColor | null;
  /** 4번 아바타 하의 이너아머 색상 정보 프리셋 */
  readonly avatar_inner_armor_color_preset_4: HeroesInnerArmorColor | null;
  /** 5번 아바타 하의 이너아머 색상 정보 프리셋 */
  readonly avatar_inner_armor_color_preset_5: HeroesInnerArmorColor | null;
}

/** 장착 아이템 */
export interface HeroesItemEquipment {
  /** 장착 아이템 장착 페이지. `"Bag"`: 장착소지품, `"Cash"`: 캐시소지품 */
  readonly item_equipment_page: string;
  /** 장착 아이템 슬롯 명 */
  readonly item_equipment_slot_name: string;
  /** 장착 아이템 명 */
  readonly item_name: string;
  /** 아이템 옵션 정보 */
  readonly item_option: HeroesItemEquipmentOption | null;
}

/** 장착 아이템 정보 응답 */
export interface HeroesCharacterItemEquipment {
  /** 장착 아이템 정보 */
  readonly item_equipment: readonly HeroesItemEquipment[];
}

// ─── GET /heroes/v2/character/stat ──────────────────────────────────────────

/** 능력치 정보 응답 */
export interface HeroesCharacterStat {
  /** 능력치 정보 */
  readonly stat: readonly HeroesStatValue[];
}

// ─── GET /heroes/v2/character/guild ─────────────────────────────────────────

/** 가입/신청한 길드 정보 응답 */
export interface HeroesCharacterGuild {
  /** 가입/신청한 길드 명 (가입·신청한 길드가 없으면 null일 수 있다) */
  readonly guild_name: string | null;
}
