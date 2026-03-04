// ─── GET /static/fconline/meta/matchtype.json ───────────────────────────────

/** 매치 종류 메타데이터 */
export interface FcMatchTypeMeta {
  /** 매치 종류 */
  readonly matchtype: number;
  /** 매치 종류명 */
  readonly desc: string;
}

// ─── GET /static/fconline/meta/spid.json ────────────────────────────────────

/** 선수 고유 식별자(spid) 메타데이터 */
export interface FcSpidMeta {
  /** 선수 고유 식별자 (seasonId 3자리 + pid 6자리) */
  readonly id: number;
  /** 선수명 */
  readonly name: string;
}

// ─── GET /static/fconline/meta/seasonid.json ────────────────────────────────

/** 시즌 아이디 메타데이터 */
export interface FcSeasonIdMeta {
  /** 시즌 아이디 */
  readonly seasonId: number;
  /** 선수가 속한 클래스 */
  readonly className: string;
  /** 시즌 이미지 경로 */
  readonly seasonImg: string;
}

// ─── GET /static/fconline/meta/spposition.json ──────────────────────────────

/** 선수 포지션 메타데이터 */
export interface FcSpPositionMeta {
  /** 선수 포지션 */
  readonly spposition: number;
  /** 선수 포지션명 (예: `"GK"`, `"CB"`, `"ST"`) */
  readonly desc: string;
}

// ─── GET /static/fconline/meta/division.json ────────────────────────────────

/** 등급 식별자 메타데이터 */
export interface FcDivisionMeta {
  /** 등급 식별자 */
  readonly divisionId: number;
  /** 등급명 */
  readonly divisionName: string;
}

// ─── GET /static/fconline/meta/division-volta.json ──────────────────────────

/** 볼타 공식경기 등급 식별자 메타데이터 */
export interface FcDivisionVoltaMeta {
  /** 볼타 경기 등급 식별자 */
  readonly divisionId: number;
  /** 볼타 경기 등급명 */
  readonly divisionName: string;
}
