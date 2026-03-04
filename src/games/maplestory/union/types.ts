// ─── GET /maplestory/v1/user/union ────────────────────────────────────────────

/** 유니온 정보 */
export interface Union {
  /** 조회 기준일 (KST, YYYY-MM-DDT00:00+09:00) */
  readonly date: string;
  /** 유니온 레벨 */
  readonly union_level: number;
  /** 유니온 등급 */
  readonly union_grade: string;
  /** 아티팩트 레벨 */
  readonly union_artifact_level: number;
  /** 보유 아티팩트 경험치 */
  readonly union_artifact_exp: number;
  /** 보유 아티팩트 포인트 */
  readonly union_artifact_point: number;
}

// ─── GET /maplestory/v1/user/union-raider ────────────────────────────────────

/** 유니온 공격대 배치 위치 및 점령 효과 */
export interface UnionInnerStat {
  /** 공격대 배치 위치 (11시 방향부터 시계 방향 순서대로 0~7) */
  readonly stat_field_id: string;
  /** 해당 지역 점령 효과 */
  readonly stat_field_effect: string;
}

/**
 * 블록 좌표.
 *
 * 중앙 4칸 중 오른쪽 아래 칸이 x:0, y:0.
 * 좌측 이동 시 x 감소, 우측 이동 시 x 증가.
 * 아래 이동 시 y 감소, 위 이동 시 y 증가.
 */
export interface UnionBlockPosition {
  /** X좌표 */
  readonly x: number;
  /** Y좌표 */
  readonly y: number;
}

/** 유니온 블록 배치 정보 */
export interface UnionBlock {
  /** 블록 모양 (전사, 마법사, 궁수, 도적, 해적, 메이플m, 하이브리드) */
  readonly block_type: string;
  /** 블록 해당 캐릭터 직업 */
  readonly block_class: string;
  /** 블록 해당 캐릭터 레벨 */
  readonly block_level: string;
  /** 블록 기준점 좌표 */
  readonly block_control_point: UnionBlockPosition;
  /** 블록이 차지하고 있는 영역 좌표들 (null: 미배치 시) */
  readonly block_position: UnionBlockPosition[] | null;
}

/** 유니온 공격대 프리셋 */
export interface UnionRaiderPreset {
  /** 유니온 공격대원 효과 */
  readonly union_raider_stat: readonly string[];
  /** 유니온 공격대 점령 효과 */
  readonly union_occupied_stat: readonly string[];
  /** 유니온 공격대 배치 */
  readonly union_inner_stat: readonly UnionInnerStat[];
  /** 유니온 블록 정보 */
  readonly union_block: readonly UnionBlock[];
}

/** 유니온 공격대 정보 */
export interface UnionRaider {
  /** 조회 기준일 (KST, YYYY-MM-DDT00:00+09:00) */
  readonly date: string;
  /** 유니온 공격대원 효과 */
  readonly union_raider_stat: readonly string[];
  /** 유니온 공격대 점령 효과 */
  readonly union_occupied_stat: readonly string[];
  /** 유니온 공격대 배치 */
  readonly union_inner_stat: readonly UnionInnerStat[];
  /** 유니온 블록 정보 */
  readonly union_block: readonly UnionBlock[];
  /** 적용 중인 프리셋 번호 */
  readonly use_preset_no: number;
  /** 유니온 프리셋 1번 정보 */
  readonly union_raider_preset_1: UnionRaiderPreset | null;
  /** 유니온 프리셋 2번 정보 */
  readonly union_raider_preset_2: UnionRaiderPreset | null;
  /** 유니온 프리셋 3번 정보 */
  readonly union_raider_preset_3: UnionRaiderPreset | null;
  /** 유니온 프리셋 4번 정보 */
  readonly union_raider_preset_4: UnionRaiderPreset | null;
  /** 유니온 프리셋 5번 정보 */
  readonly union_raider_preset_5: UnionRaiderPreset | null;
}

// ─── GET /maplestory/v1/user/union-artifact ──────────────────────────────────

/** 아티팩트 효과 */
export interface UnionArtifactEffect {
  /** 아티팩트 효과 명 */
  readonly name: string;
  /** 아티팩트 효과 레벨 */
  readonly level: number;
}

/** 아티팩트 크리스탈 */
export interface UnionArtifactCrystal {
  /** 아티팩트 크리스탈 명 */
  readonly name: string;
  /** 능력치 유효 여부 ("0": 유효, "1": 유효하지 않음) */
  readonly validity_flag: string;
  /** 능력치 유효 기간 ("expired": 만료, null: 무제한) (KST) */
  readonly date_expire: string | null;
  /** 아티팩트 크리스탈 등급 */
  readonly level: number;
  /** 아티팩트 크리스탈 첫 번째 옵션 명 */
  readonly crystal_option_name_1: string;
  /** 아티팩트 크리스탈 두 번째 옵션 명 */
  readonly crystal_option_name_2: string;
  /** 아티팩트 크리스탈 세 번째 옵션 명 */
  readonly crystal_option_name_3: string;
}

/** 유니온 아티팩트 정보 */
export interface UnionArtifact {
  /** 조회 기준일 (KST, YYYY-MM-DDT00:00+09:00) */
  readonly date: string;
  /** 아티팩트 효과 정보 */
  readonly union_artifact_effect: readonly UnionArtifactEffect[];
  /** 아티팩트 크리스탈 정보 */
  readonly union_artifact_crystal: readonly UnionArtifactCrystal[];
  /** 잔여 아티팩트 AP */
  readonly union_artifact_remain_ap: number;
}

// ─── GET /maplestory/v1/user/union-champion ──────────────────────────────────

/** 유니온 챔피언 휘장 정보 */
export interface UnionChampionBadgeInfo {
  /** 유니온 챔피언 휘장 효과 */
  readonly stat: string;
}

/** 유니온 챔피언 개별 정보 */
export interface UnionChampionInfo {
  /** 유니온 챔피언 캐릭터 명 */
  readonly champion_name: string;
  /** 유니온 챔피언 슬롯 */
  readonly champion_slot: number;
  /** 유니온 챔피언 등급 */
  readonly champion_grade: string;
  /** 유니온 챔피언 캐릭터의 직업 */
  readonly champion_class: string;
  /** 유니온 챔피언 휘장 정보 */
  readonly champion_badge_info: readonly UnionChampionBadgeInfo[];
}

/** 유니온 챔피언 정보 */
export interface UnionChampion {
  /** 조회 기준일 (KST, YYYY-MM-DDT00:00+09:00) */
  readonly date: string;
  /** 유니온 챔피언 정보 */
  readonly union_champion: readonly UnionChampionInfo[];
  /** 챔피언 휘장 효과 */
  readonly champion_badge_total_info: readonly UnionChampionBadgeInfo[];
}
