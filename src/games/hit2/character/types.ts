// ─── GET /hit2/v1/character/basic ────────────────────────────────────────────

/** 기본 정보 조회 응답 */
export interface Hit2CharacterBasic {
  /** 서버 명 */
  readonly server_name: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터를 만든 날짜(UTC). 시·분·초는 모두 0이다. */
  readonly character_date_create: string;
  /** 캐릭터가 마지막으로 접속한 시각(UTC) */
  readonly character_last_login: string;
  /** 캐릭터가 마지막으로 접속을 종료한 시각(UTC) */
  readonly character_last_logout: string;
  /** 캐릭터 직업군 명 */
  readonly character_class_group_name: string;
  /** 캐릭터 직업 명 */
  readonly character_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}
