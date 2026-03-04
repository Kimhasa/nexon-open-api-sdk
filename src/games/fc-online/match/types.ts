// ─── GET /fconline/v1/match ──────────────────────────────────────────────────

/** 매치 기록 조회 요청 파라미터 */
export interface FcMatchListRequest {
  /** 매치 종류 (/metadata/matchtype API 참고) */
  readonly matchtype: number;
  /** 리스트에서 가져올 시작 위치 (기본값: 0) */
  readonly offset?: number | undefined;
  /** 리스트에서 가져올 갯수 (최대 100, 기본값: 100) */
  readonly limit?: number | undefined;
  /** 매치 기록의 정렬 순서 (기본값: `'desc'` — 최근 매치부터) */
  readonly orderby?: 'desc' | 'asc' | undefined;
}

// ─── GET /fconline/v1/match-detail ──────────────────────────────────────────

/** 매치 상세 기록 응답 */
export interface FcMatchDetail {
  /** 매치 고유 식별자 */
  readonly matchId: string;
  /** 매치 일자 (UTC0) */
  readonly matchDate: string;
  /** 매치 종류 (/metadata/matchtype API 참고) */
  readonly matchType: number;
  /** 매치 참여 플레이어별 매치 상세 */
  readonly matchInfo: readonly FcMatchInfo[];
}

/** 매치 참여 플레이어 정보 */
export interface FcMatchInfo {
  /** 계정 식별자 */
  readonly ouid: string;
  /** 유저 닉네임 */
  readonly nickname: string;
  /** 매치 결과 상세 */
  readonly matchDetail: FcMatchDetailInfo;
  /** 슈팅 정보 */
  readonly shoot: FcMatchShoot;
  /** 슈팅 별 상세정보 리스트 */
  readonly shootDetail: readonly FcMatchShootDetail[];
  /** 패스 정보 */
  readonly pass: FcMatchPass;
  /** 수비 정보 */
  readonly defence: FcMatchDefence;
  /** 경기 사용 선수 정보 */
  readonly player: readonly FcMatchPlayer[];
}

/** 매치 결과 상세 정보 */
export interface FcMatchDetailInfo {
  /** 시즌 ID */
  readonly seasonId: number;
  /** 매치 결과 (`"승"` | `"무"` | `"패"`) */
  readonly matchResult: string;
  /** 매치종료 타입 (0: 정상종료, 1: 몰수승, 2: 몰수패) */
  readonly matchEndType: number;
  /** 게임 일시정지 수 */
  readonly systemPause: number;
  /** 파울 수 */
  readonly foul: number;
  /** 부상 수 */
  readonly injury: number;
  /** 받은 레드카드 수 */
  readonly redCards: number;
  /** 받은 옐로카드 수 */
  readonly yellowCards: number;
  /** 드리블 거리 (야드) */
  readonly dribble: number;
  /** 코너킥 수 */
  readonly cornerKick: number;
  /** 점유율 */
  readonly possession: number;
  /** 오프사이드 수 */
  readonly OffsideCount: number;
  /** 경기 평점 */
  readonly averageRating: number;
  /** 사용한 컨트롤러 타입 (`"keyboard"` | `"pad"` 등) */
  readonly controller: string;
}

/** 슈팅 정보 */
export interface FcMatchShoot {
  /** 총 슛 수 */
  readonly shootTotal: number;
  /** 총 유효슛 수 */
  readonly effectiveShootTotal: number;
  /** 승부차기 슛 수 */
  readonly shootOutScore: number;
  /** 총 골 수 (goalInPenalty + goalOutPenalty + goalPenaltyKick) */
  readonly goalTotal: number;
  /** 게임 종료 후 유저에게 노출되는 골 수 */
  readonly goalTotalDisplay: number;
  /** 자책 골 수 */
  readonly ownGoal: number;
  /** 헤딩 슛 수 */
  readonly shootHeading: number;
  /** 헤딩 골 수 */
  readonly goalHeading: number;
  /** 프리킥 슛 수 */
  readonly shootFreekick: number;
  /** 프리킥 골 수 */
  readonly goalFreekick: number;
  /** 인패널티 슛 수 */
  readonly shootInPenalty: number;
  /** 인패널티 골 수 */
  readonly goalInPenalty: number;
  /** 아웃패널티 슛 수 */
  readonly shootOutPenalty: number;
  /** 아웃패널티 골 수 */
  readonly goalOutPenalty: number;
  /** 패널티킥 슛 수 */
  readonly shootPenaltyKick: number;
  /** 패널티킥 골 수 */
  readonly goalPenaltyKick: number;
}

/**
 * 슈팅 상세 정보.
 *
 * `goalTime` 디코딩:
 * - `2^24*0 ~ 2^24*1 - 1`: 전반전 (그대로 사용)
 * - `2^24*1 ~ 2^24*2 - 1`: 후반전 (`- 2^24*1 + 45*60`)
 * - `2^24*2 ~ 2^24*3 - 1`: 연장 전반 (`- 2^24*2 + 90*60`)
 * - `2^24*3 ~ 2^24*4 - 1`: 연장 후반 (`- 2^24*3 + 105*60`)
 * - `2^24*4 ~ 2^24*5 - 1`: 승부차기 (`- 2^24*4 + 120*60`)
 */
export interface FcMatchShootDetail {
  /** 슛 시간 (인코딩된 값, 위 디코딩 규칙 참고) */
  readonly goalTime: number;
  /** 슛 x좌표 (전체 경기장 기준) */
  readonly x: number;
  /** 슛 y좌표 (전체 경기장 기준) */
  readonly y: number;
  /**
   * 슛 종류.
   * 1: normal, 2: finesse, 3: header, 4: lob, 5: flare,
   * 6: low, 7: volley, 8: free-kick, 9: penalty,
   * 10: knuckle, 11: bicycle, 12: super(파워샷)
   */
  readonly type: number;
  /** 슛 결과 (1: on target, 2: off target, 3: goal) */
  readonly result: number;
  /** 슈팅 선수 고유 식별자 (/metadata/spid API 참고) */
  readonly spId: number;
  /** 슈팅 선수 강화 등급 */
  readonly spGrade: number;
  /** 슈팅 선수 레벨 */
  readonly spLevel: number;
  /** 슈팅 선수 임대 여부 (임대선수: true) */
  readonly spIdType: boolean;
  /** 어시스트 받은 골 여부 */
  readonly assist: boolean;
  /** 어시스트 선수 고유 식별자 (-1이면 없음) */
  readonly assistSpI: number;
  /** 어시스트 x좌표 */
  readonly assistX: number;
  /** 어시스트 y좌표 */
  readonly assistY: number;
  /** 골포스트 맞춤 여부 */
  readonly hitPost: boolean;
  /** 페널티박스 안에서 넣은 슛 여부 */
  readonly inPenalty: boolean;
}

/** 패스 정보 */
export interface FcMatchPass {
  /** 패스 시도 수 */
  readonly passTry: number;
  /** 패스 성공 수 */
  readonly passSuccess: number;
  /** 숏 패스 시도 수 */
  readonly shortPassTry: number;
  /** 숏 패스 성공 수 */
  readonly shortPassSuccess: number;
  /** 롱 패스 시도 수 */
  readonly longPassTry: number;
  /** 롱 패스 성공 수 */
  readonly longPassSuccess: number;
  /** 바운싱 롭 패스 시도 수 */
  readonly bouncingLobPassTry: number;
  /** 바운싱 롭 패스 성공 수 */
  readonly bouncingLobPassSuccess: number;
  /** 드리븐 땅볼 패스 시도 수 */
  readonly drivenGroundPassTry: number;
  /** 드리븐 땅볼 패스 성공 수 */
  readonly drivenGroundPassSuccess: number;
  /** 스루 패스 시도 수 */
  readonly throughPassTry: number;
  /** 스루 패스 성공 수 */
  readonly throughPassSuccess: number;
  /** 로빙 스루 패스 시도 수 */
  readonly lobbedThroughPassTry: number;
  /** 로빙 스루 패스 성공 수 */
  readonly lobbedThroughPassSuccess: number;
}

/** 수비 정보 */
export interface FcMatchDefence {
  /** 블락 시도 수 */
  readonly blockTry: number;
  /** 블락 성공 수 */
  readonly blockSuccess: number;
  /** 태클 시도 수 */
  readonly tackleTry: number;
  /** 태클 성공 수 */
  readonly tackleSuccess: number;
}

/** 선수 경기 스탯 */
export interface FcPlayerStatus {
  /** 슛 수 */
  readonly shoot: number;
  /** 유효 슛 수 */
  readonly effectiveShoot: number;
  /** 어시스트 수 */
  readonly assist: number;
  /** 득점 수 */
  readonly goal: number;
  /** 드리블 거리 (야드) */
  readonly dribble: number;
  /** 인터셉트 수 */
  readonly intercept: number;
  /** 디펜딩 수 */
  readonly defending: number;
  /** 패스 시도 수 */
  readonly passTry: number;
  /** 패스 성공 수 */
  readonly passSuccess: number;
  /** 드리블 시도 수 */
  readonly dribbleTry: number;
  /** 드리블 성공 수 */
  readonly dribbleSuccess: number;
  /** 볼 소유 시도 수 */
  readonly ballPossesionTry: number;
  /** 볼 소유 성공 수 */
  readonly ballPossesionSuc: number;
  /** 공중볼 경합 시도 수 */
  readonly aerialTry: number;
  /** 공중볼 경합 성공 수 */
  readonly aerialSuccess: number;
  /** 블락 시도 수 */
  readonly blockTry: number;
  /** 블락 성공 수 */
  readonly block: number;
  /** 태클 시도 수 */
  readonly tackleTry: number;
  /** 태클 성공 수 */
  readonly tackle: number;
  /** 옐로카드 수 */
  readonly yellowCards: number;
  /** 레드카드 수 */
  readonly redCards: number;
  /** 선수 평점 */
  readonly spRating: number;
}

/** 경기 사용 선수 정보 */
export interface FcMatchPlayer {
  /** 선수 고유 식별자 (/metadata/spid API 참고) */
  readonly spId: number;
  /** 선수 포지션 (/metadata/spposition API 참고) */
  readonly spPosition: number;
  /** 선수 강화 등급 */
  readonly spGrade: number;
  /** 선수 경기 스탯 */
  readonly status: FcPlayerStatus;
}
