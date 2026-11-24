// ─── GET /v4/v1/character/basic ──────────────────────────────────────────────

/** 기본 정보 조회 응답 */
export interface V4CharacterBasic {
  /** 서버 명 */
  readonly server_name: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터를 만든 날짜(UTC). 시·분·초는 모두 0이다. */
  readonly character_date_create: string;
  /** 생성 방식. 문자열 "0"은 일반 캐릭터, "1"은 점핑 캐릭터다. 값이 없으면 null */
  readonly character_create_type: string | null;
  /** 캐릭터 마지막 로그인 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly character_date_last_login: string;
  /** 캐릭터 마지막 로그아웃 일(시) (UTC0) */
  readonly character_date_last_logout: string;
  /** 캐릭터 직업 명 */
  readonly character_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}

// ─── GET /v4/v1/character/honor ──────────────────────────────────────────────

/** 보유 명예 항목 */
export interface V4Honor {
  /** 명예 타입 명 */
  readonly honor_type_name: string;
  /** 명예 명 */
  readonly honor_name: string;
  /** 보유 명예의 만료 시각(UTC). SDK 타입은 null을 허용한다. */
  readonly date_expire: string | null;
}

/** 명예 보유 정보 조회 응답 */
export interface V4CharacterHonor {
  /** 명예 정보 */
  readonly honor: readonly V4Honor[];
}

// ─── GET /v4/v1/character/honor-equipment ────────────────────────────────────

/** 장착 명예 항목 */
export interface V4HonorEquipment {
  /** 장착 명예 타입 명 */
  readonly honor_type_name: string;
  /** 장착 명예 명 */
  readonly honor_name: string;
  /** 장착 명예의 만료 시각(UTC). SDK 타입은 null을 허용한다. */
  readonly date_expire: string | null;
}

/** 장착 명예 정보 조회 응답 */
export interface V4CharacterHonorEquipment {
  /** 장착 명예 정보 */
  readonly honor_equipment: readonly V4HonorEquipment[];
}
