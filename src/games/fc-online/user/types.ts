// ─── Brand 기반 ──────────────────────────────────────────────────────────────

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * EA SPORTS FC 온라인 계정 식별자(ouid). 구단주 닉네임으로 받아 두고 정보를 조회할 때 넣는다.
 *
 * FC Online 전용 브랜드 타입입니다.
 * `FcOnlineClient.getOuid()` 로 획득합니다.
 */
export type OUID = Brand<string, 'OUID'>;

// ─── GET /fconline/v1/user/basic ────────────────────────────────────────────

/** 구단주 기본 정보 — `client.fcOnline.getBasic()` 의 응답. */
export interface FcUserBasic {
  /** 계정 식별자 */
  readonly ouid: OUID;
  /** 구단주 닉네임 */
  readonly nickname: string;
  /** 구단주 레벨 */
  readonly level: number;
}

// ─── GET /fconline/v1/user/maxdivision ──────────────────────────────────────

/** 매치 종류 하나의 역대 최고 등급(디비전) — `client.fcOnline.getMaxDivision()` 응답 배열의 항목. */
export interface FcMaxDivision {
  /** 매치 종류 번호 (50: 공식경기, 52: 감독모드 등. `getMatchTypeMeta()` 참고) */
  readonly matchType: number;
  /** 등급(디비전) 번호 (예: 800 = 슈퍼 챔피언스). 공식경기는 `getDivisionMeta()`, 볼타는 `getDivisionVoltaMeta()` 로 이름을 찾는다 */
  readonly division: number;
  /** 최고 등급 달성 일자 (UTC0, ISO 8601) */
  readonly achievementDate: string;
}

// ─── GET /fconline/v1/user/match ────────────────────────────────────────────

/** 유저 매치 기록 조회 요청 파라미터 */
export interface FcUserMatchRequest {
  /** 계정 식별자 */
  readonly ouid: OUID;
  /** 매치 종류 번호 (50: 공식경기, 52: 감독모드 등. `getMatchTypeMeta()` 참고) */
  readonly matchtype: number;
  /** 리스트에서 가져올 시작 위치 (기본값: 0) */
  readonly offset?: number | undefined;
  /** 리스트에서 가져올 갯수 (최대 100, 기본값: 100) */
  readonly limit?: number | undefined;
}

// ─── GET /fconline/v1/user/trade ────────────────────────────────────────────

/** 거래 종류 */
export type FcTradeType = 'buy' | 'sell';

/** 유저 거래 기록 조회 요청 파라미터 */
export interface FcUserTradeRequest {
  /** 거래 종류 (구입: buy, 판매: sell) */
  readonly tradetype: FcTradeType;
  /** 리스트에서 가져올 시작 위치 (기본값: 0) */
  readonly offset?: number | undefined;
  /** 리스트에서 가져올 갯수 (최대 100, 기본값: 100) */
  readonly limit?: number | undefined;
}

/** 이적시장 거래 한 건 — `client.fcOnline.getTradeList()` 응답 배열의 항목. */
export interface FcTradeRecord {
  /** 거래 일자 (UTC0) — 구매: 등록 시점, 판매: 완료 시점 */
  readonly tradeDate: string;
  /** 거래 식별자 */
  readonly saleSn: string;
  /** 선수 식별자 — 선수 카드 번호 (`getSpidMeta()` 참고) */
  readonly spid: number;
  /** 거래한 선수 카드의 강화 등급 (강화 단계) */
  readonly grade: number;
  /** 거래 가격 (BP) */
  readonly value: number;
}
