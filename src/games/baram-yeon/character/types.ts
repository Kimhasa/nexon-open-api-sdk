// ─── GET /baramy/v1/character/basic ──────────────────────────────────────────

/** 기본 정보 조회 응답 */
export interface BaramYeonCharacterBasic {
  /** 서버 명 */
  readonly server_name: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터 생성 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly character_date_create: string;
  /** 캐릭터 직업군 명 */
  readonly character_class_group_name: string;
  /** 캐릭터 직업 명 */
  readonly character_class_name: string;
  /** 캐릭터 국적 */
  readonly character_nation: string;
  /** 캐릭터 성별 */
  readonly character_gender: string;
  /** 캐릭터 경험치 */
  readonly character_exp: number;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}

// ─── GET /baramy/v1/character/title ──────────────────────────────────────────

/** 보유 칭호 항목 */
export interface BaramYeonTitle {
  /** 보유 칭호의 유형 이름. 2022년 3월 18일 이후 획득한 칭호에 제공된다. */
  readonly title_type_name: string | null;
  /** 칭호 명 */
  readonly title_name: string;
}

/**
 * 칭호 보유 정보 조회 응답.
 *
 * 칭호 타입(`title_type_name`)은 2022년 3월 18일 이후 획득한 칭호에 한해 조회할 수 있습니다.
 */
export interface BaramYeonCharacterTitle {
  /** 칭호 정보 */
  readonly title: readonly BaramYeonTitle[];
}

// ─── GET /baramy/v1/character/title-equipment ────────────────────────────────

/** 장착 칭호 항목 */
export interface BaramYeonTitleEquipment {
  /** 문자열 "1"은 장착 칭호, "2"는 표시 칭호다. */
  readonly title_equipment_type: string;
  /** 장착한 칭호의 유형 이름. 2022년 3월 18일 이후 장착한 칭호에 제공된다. */
  readonly title_type_name: string | null;
  /** 장착 칭호 명 */
  readonly title_name: string;
}

/**
 * 장착 칭호 정보 조회 응답.
 *
 * 칭호 타입(`title_type_name`)은 2022년 3월 18일 이후 장착한 칭호에 한해 조회할 수 있습니다.
 */
export interface BaramYeonCharacterTitleEquipment {
  /** 장착 칭호 정보 */
  readonly title_equipment: readonly BaramYeonTitleEquipment[];
}
