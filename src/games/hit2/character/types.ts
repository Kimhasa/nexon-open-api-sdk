// ─── GET /hit2/v1/character/basic ────────────────────────────────────────────

/** 기본 정보 조회 응답 */
export interface Hit2CharacterBasic {
  /** 서버 명 */
  readonly server_name: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터 생성일 (UTC0) */
  readonly character_date_create: string; // 일 단위 데이터라 시·분·초는 항상 0 (예: "2023-12-14T00:00:00Z")
  /** 캐릭터 마지막 로그인 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly character_last_login: string; // 다른 게임과 달리 필드명에 `date_` 가 없다 (V4는 character_date_last_login)
  /** 캐릭터 마지막 로그아웃 일(시) (UTC0) */
  readonly character_last_logout: string; // 다른 게임과 달리 필드명에 `date_` 가 없다
  /** 캐릭터 직업군 명 */
  readonly character_class_group_name: string;
  /** 캐릭터 직업 명 */
  readonly character_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}
