// ─── GET /static/fconline/meta/matchtype.json ───────────────────────────────

/** 매치 종류 번호와 이름 — `client.fcOnline.getMatchTypeMeta()` 응답 배열의 항목. */
export interface FcMatchTypeMeta {
  /** 매치 종류 번호 (예: 50) */
  readonly matchtype: number;
  /** 매치 종류 이름 (예: "공식경기", "감독모드", "볼타 공식") */
  readonly desc: string;
}

// ─── GET /static/fconline/meta/spid.json ────────────────────────────────────

/** 선수 카드 번호와 선수 이름 — `client.fcOnline.getSpidMeta()` 응답 배열의 항목. */
export interface FcSpidMeta {
  /** 선수 카드 번호 (spid = 클래스 번호 3자리 + 선수 번호(pid) 6자리) */
  readonly id: number;
  /** 선수명 */
  readonly name: string;
}

// ─── GET /static/fconline/meta/seasonid.json ────────────────────────────────

/** @deprecated 선수 클래스 정보는 {@link FcClassMeta}를 사용하세요. */
export interface FcSeasonIdMeta {
  /** 기존 선수 클래스 식별자 */
  readonly seasonId: number;
  /** 선수가 속한 클래스 */
  readonly className: string;
  /** 시즌 이미지 경로 */
  readonly seasonImg: string;
}

// ─── GET /static/fconline/meta/spposition.json ──────────────────────────────

/** 포지션 번호와 이름 — `client.fcOnline.getSpPositionMeta()` 응답 배열의 항목. */
export interface FcSpPositionMeta {
  /** 포지션 번호 (예: 0) */
  readonly spposition: number;
  /** 선수 포지션명 (예: `"GK"`, `"CB"`, `"ST"`) */
  readonly desc: string;
}

// ─── GET /static/fconline/meta/division.json ────────────────────────────────

/** 공식경기 등급(디비전) 번호와 이름 — `client.fcOnline.getDivisionMeta()` 응답 배열의 항목. */
export interface FcDivisionMeta {
  /** 등급 번호 (예: 800) */
  readonly divisionId: number;
  /** 등급 이름 (예: "슈퍼 챔피언스") */
  readonly divisionName: string;
}

// ─── GET /static/fconline/meta/division-volta.json ──────────────────────────

/** 볼타 공식경기 등급 번호와 이름 — `client.fcOnline.getDivisionVoltaMeta()` 응답 배열의 항목. */
export interface FcDivisionVoltaMeta {
  /** 볼타 등급 번호 (예: 1100) */
  readonly divisionId: number;
  /** 볼타 등급 이름 (예: "월드 스타") */
  readonly divisionName: string;
}

/** 매치 종류별 최신 공식경기 시즌 — `client.fcOnline.getSeasonMeta()` 응답 배열의 항목. */
export interface FcSeasonMeta {
  /** 매치 종류 번호 (50: 공식경기, 52: 감독모드) */
  readonly matchtype: number;
  /** 최신 시즌 번호 (예: 202606) */
  readonly seasonId: number;
}

/** 선수 클래스(시즌 카드 종류) — `client.fcOnline.getClassMeta()` 응답 배열의 항목. */
export interface FcClassMeta {
  /** 클래스 번호 (선수 카드 번호 spid 의 앞 3자리, 예: 100) */
  readonly class: number;
  /** 클래스 이름 (예: "ICON TM (ICON The Moment)") */
  readonly className: string;
  /** 클래스 아이콘 이미지 주소 */
  readonly classImg: string;
}
