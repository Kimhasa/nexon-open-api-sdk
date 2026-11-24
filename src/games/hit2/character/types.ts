// ─── GET /hit2/v1/character/basic ────────────────────────────────────────────

/** 기본 정보 조회 응답 */
export interface Hit2CharacterBasic {
  /** 서버 명 */
  readonly server_name: string;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터를 만든 날짜(UTC). 시·분·초는 모두 0이다. */
  readonly character_date_create: string;
  /** 캐릭터가 마지막으로 접속한 시각(UTC). 실제 응답의 필드. 포털 스펙에는 `character_last_login` 으로 적혀 있다 */
  readonly character_date_last_login?: string | undefined;
  /** 캐릭터가 마지막으로 접속을 종료한 시각(UTC). 실제 응답의 필드. 포털 스펙에는 `character_last_logout` 으로 적혀 있다 */
  readonly character_date_last_logout?: string | undefined;
  /** 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 `character_date_last_login` 으로 온다 */
  readonly character_last_login?: string | undefined;
  /** 포털 스펙의 이름. 2026-11-24 실제 응답에는 없고 `character_date_last_logout` 으로 온다 */
  readonly character_last_logout?: string | undefined;
  /** 캐릭터 직업군 명 */
  readonly character_class_group_name: string;
  /** 캐릭터 직업 명 */
  readonly character_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
}
