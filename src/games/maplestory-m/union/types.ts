// ─── GET /maplestorym/v1/user/union ──────────────────────────────────────────

/** 유니온 정보 */
export interface MUnion {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 유니온 레벨 */
  readonly union_level: number;
  /** 유니온 등급 */
  readonly union_grade: string;
}

// ─── GET /maplestorym/v1/user/union-raider ───────────────────────────────────

/** 유니온 공격대 배치 위치 및 점령 효과 */
export interface MUnionInnerStat {
  /** 공격대 배치 위치 */
  readonly stat_field_id: string;
  /** 해당 지역 점령 효과 */
  readonly stat_field_effect: string;
}

/** 블록 좌표 */
export interface MUnionBlockPosition {
  /** X좌표 */
  readonly x: number;
  /** Y좌표 */
  readonly y: number;
}

/** 유니온 블록 배치 정보 */
export interface MUnionBlock {
  /** 블록 모양 */
  readonly block_type: string;
  /** 블록 해당 캐릭터 직업 */
  readonly block_class: string;
  /** 블록 해당 캐릭터 레벨 */
  readonly block_level: string;
  /** 블록 기준점 좌표 */
  readonly block_control_point: MUnionBlockPosition;
  /** 블록이 차지하고 있는 영역 좌표들 (null: 미배치 시) */
  readonly block_position: MUnionBlockPosition[] | null;
}

/** 유니온 공격대 정보 */
export interface MUnionRaider {
  /** 조회 기준일 (KST) */
  readonly date: string;
  /** 유니온 공격대원 효과 */
  readonly union_raider_stat: readonly string[];
  /** 유니온 공격대 점령 효과 */
  readonly union_occupied_stat: readonly string[];
  /** 유니온 공격대 배치 */
  readonly union_inner_stat: readonly MUnionInnerStat[];
  /** 유니온 블록 정보 */
  readonly union_block: readonly MUnionBlock[];
}
