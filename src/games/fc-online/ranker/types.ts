// ─── GET /fconline/v1/ranker-stats ──────────────────────────────────────────

/** 랭커 스탯 조회 시 선수 식별 정보 */
export interface FcRankerPlayer {
  /** 선수 고유 식별자 (/metadata/spid API 참고) */
  readonly id: number;
  /** 선수 포지션 (/metadata/spposition API 참고) */
  readonly po: number;
}

/** 랭커 스탯 조회 요청 파라미터 */
export interface FcRankerStatsRequest {
  /** 매치 종류 (/metadata/matchtype API 참고) */
  readonly matchtype: number;
  /** 조회할 선수 목록 (1회 최대 50명 권장, 초과 시 413 에러 가능) */
  readonly players: readonly FcRankerPlayer[];
}

/** 랭커 선수 평균 스탯 (20경기 평균) */
export interface FcRankerPlayerStatus {
  /** 평균 슛 수 */
  readonly shoot: number;
  /** 평균 유효 슛 수 */
  readonly effectiveShoot: number;
  /** 평균 어시스트 수 */
  readonly assist: number;
  /** 평균 득점 수 */
  readonly goal: number;
  /** 평균 드리블 거리 (야드) */
  readonly dribble: number;
  /** 평균 드리블 시도 수 */
  readonly dribbleTry: number;
  /** 평균 드리블 성공 수 */
  readonly dribbleSuccess: number;
  /** 평균 패스 시도 수 */
  readonly passTry: number;
  /** 평균 패스 성공 수 */
  readonly passSuccess: number;
  /** 평균 블락 성공 수 */
  readonly block: number;
  /** 평균 태클 성공 수 */
  readonly tackle: number;
  /** 해당 포지션으로 경기 참여한 횟수 */
  readonly matchCount: number;
}

/** 랭커 선수 스탯 응답 */
export interface FcRankerStats {
  /** 선수 고유 식별자 (/metadata/spid API 참고) */
  readonly spId: number;
  /** 선수 포지션 (/metadata/spposition API 참고) */
  readonly spPosition: number;
  /** 선수의 20경기 평균 스탯 */
  readonly status: FcRankerPlayerStatus;
  /** 랭커 유저의 선수 스탯이 집계된 시간 (UTC0) */
  readonly createDate: string;
}
