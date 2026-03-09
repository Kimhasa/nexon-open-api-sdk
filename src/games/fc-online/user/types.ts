// ─── Brand 기반 ──────────────────────────────────────────────────────────────

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * EA SPORTS FC Online 계정 고유 식별자 (OUID).
 *
 * FC Online 전용 브랜드 타입입니다.
 * `FcOnlineClient.getOuid()` 로 획득합니다.
 */
export type OUID = Brand<string, 'OUID'>;

// ─── GET /fconline/v1/user/basic ────────────────────────────────────────────

/** 유저 기본 정보 응답 */
export interface FcUserBasic {
  /** 계정 식별자 */
  readonly ouid: OUID;
  /** 유저 닉네임 */
  readonly nickname: string;
  /** 유저 레벨 */
  readonly level: number;
}

// ─── GET /fconline/v1/user/maxdivision ──────────────────────────────────────

/** 역대 최고 등급 정보 */
export interface FcMaxDivision {
  /** 매치 종류 (/metadata/matchtype API 참고) */
  readonly matchType: number;
  /** 등급 식별자 (공식경기 /metadata/division, 볼타모드 /metadata/division_volta 참고) */
  readonly division: number;
  /** 최고 등급 달성 일자 (UTC0, ISO 8601) */
  readonly achievementDate: string;
}

// ─── GET /fconline/v1/user/match ────────────────────────────────────────────

/** 유저 매치 기록 조회 요청 파라미터 */
export interface FcUserMatchRequest {
  /** 계정 식별자 */
  readonly ouid: OUID;
  /** 매치 종류 (/metadata/matchtype API 참고) */
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

/** 거래 기록 */
export interface FcTradeRecord {
  /** 거래 일자 (UTC0) — 구매: 등록 시점, 판매: 완료 시점 */
  readonly tradeDate: string;
  /** 거래 고유 식별자 */
  readonly saleSn: string;
  /** 선수 고유 식별자 (/metadata/spid API 참고) */
  readonly spid: number;
  /** 거래 선수 강화 등급 */
  readonly grade: number;
  /** 거래 선수 가치 (BP) */
  readonly value: number;
}
