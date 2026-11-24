// ─── GET /baram/v1/character/basic ───────────────────────────────────────────

/**
 * 기본 정보 조회 응답.
 *
 * 버프, 아이템 사용 등으로 적용된 효과 때문에 경험치·레벨이 게임 내 데이터와 다를 수 있습니다.
 */
export interface BaramCharacterBasic {
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터 생성 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly character_date_create: string;
  /** 캐릭터 생성 타입 명 */
  readonly character_create_type_name: string;
  /** 캐릭터 직업 명 */
  readonly character_class_name: string;
  /** 캐릭터 국가 명 */
  readonly character_nation_name: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 경험치 */
  readonly character_exp: number;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}

// ─── GET /baram/v1/character/title ───────────────────────────────────────────

/** 보유 칭호 항목 */
export interface BaramTitle {
  /** 보유 칭호 이름(넥슨 포털의 필드 설명 기준) */
  readonly title_id: string;
  /** 칭호 만료 일(시) (UTC0) */
  readonly date_expire: string | null; // 스펙에 nullable 표시는 없으나 만료 없는 칭호는 null일 수 있어 넓게 잡음 (실 API 미검증)
}

/** 칭호 보유 정보 조회 응답 */
export interface BaramCharacterTitle {
  /** 칭호 정보 */
  readonly title: readonly BaramTitle[];
}

// ─── GET /baram/v1/character/title-equipment ─────────────────────────────────

/** 장착 칭호 항목 */
export interface BaramTitleEquipment {
  /** 장착한 칭호 이름(넥슨 포털의 필드 설명 기준) */
  readonly title_id: string;
  /** 장착 칭호 만료 일(시) (UTC0) */
  readonly date_expire: string | null; // 스펙에 nullable 표시는 없으나 만료 없는 칭호는 null일 수 있어 넓게 잡음 (실 API 미검증)
}

/** 장착 칭호 정보 조회 응답 */
export interface BaramCharacterTitleEquipment {
  /** 장착 칭호 정보 */
  readonly title_equipment: readonly BaramTitleEquipment[];
}

// ─── GET /baram/v1/character/item-equipment ──────────────────────────────────

/** 장착 아이템 항목 */
export interface BaramItemEquipment {
  /** 장착한 아이템 이름(넥슨 포털의 필드 설명 기준). 아이템을 장착하지 않은 슬롯이면 null */
  readonly item_id: string | null;
  /** 장착 아이템 페이지 슬롯 명 */
  readonly item_equipment_slot_name: string;
}

/** 장착 아이템 정보 조회 응답 */
export interface BaramCharacterItemEquipment {
  /** 장착 아이템 정보 */
  readonly item_equipment: readonly BaramItemEquipment[];
}

// ─── GET /baram/v1/character/stat ────────────────────────────────────────────

/** 능력치 항목 */
export interface BaramStat {
  /** 능력치 명 */
  readonly stat_name: string;
  /** 캐릭터 능력치 값. 문자열로 제공된다. */
  readonly stat_value: string;
}

/** 능력치 정보 조회 응답 */
export interface BaramCharacterStat {
  /** 능력치 정보 */
  readonly stat: readonly BaramStat[];
}

// ─── GET /baram/v1/character/guild ───────────────────────────────────────────

/** 가입한 길드(문파) 정보 조회 응답 */
export interface BaramCharacterGuild {
  /** 가입한 문파 이름. SDK 타입은 null을 허용한다. */
  readonly guild_name: string | null;
}
