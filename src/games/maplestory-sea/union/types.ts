// ─── GET /maplestorysea/v1/user/union ─────────────────────────────────────────

/** 유니온 레벨·등급 — `client.maplestorySEA.union.getUnion()` 의 응답. */
export interface SEAUnion {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Union level */
  readonly union_level: number;
  /** Union grade */
  readonly union_grade: string;
  /** Artifact level */
  readonly union_artifact_level: number;
  /** Earned Artifact EXP */
  readonly union_artifact_exp: number;
  /** Earned Artifact Points */
  readonly union_artifact_point: number;
}

// ─── GET /maplestorysea/v1/user/union-raider ──────────────────────────────────

/** Union raider deployment information */
export interface SEAUnionInnerStat {
  /** Raider deployment position (0 to 7, clockwise from 11 o'clock) */
  readonly stat_field_id: string;
  /** Occupation effects over the area */
  readonly stat_field_effect: string;
}

/** Block position coordinates */
export interface SEAUnionBlockPosition {
  /** X-coordinate */
  readonly x: number;
  /** Y-coordinate */
  readonly y: number;
}

/** Union Legion Block information */
export interface SEAUnionBlock {
  /** Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid) */
  readonly block_type: string;
  /** 유니온 공격대 블록에 해당하는 캐릭터 직업. 직업 정보가 없으면 null. */
  readonly block_class: string | null;
  /** Character level corresponding to the block */
  readonly block_level: string;
  /**
   * Coordinates of the block's reference point.
   *
   * The bottom-right square among the four central squares is positioned at x: 0, y: 0.
   * Moving one square to the left decreases x by 1.
   * Moving one square to the right increases x by 1.
   * Moving one square downward decreases y by 1.
   * Moving one square upward increases y by 1.
   */
  readonly block_control_point: SEAUnionBlockPosition;
  /** Coordinates of the area occupied by the block (null if not placed) */
  readonly block_position: SEAUnionBlockPosition[] | null;
}

/** Union raider preset information */
export interface SEAUnionRaiderPreset {
  /** Union raid member effects */
  readonly union_raider_stat: readonly string[];
  /** Union raid capture effects */
  readonly union_occupied_stat: readonly string[];
  /** Union raider deployment */
  readonly union_inner_stat: readonly SEAUnionInnerStat[];
  /** Information about Legion Blocks */
  readonly union_block: readonly SEAUnionBlock[];
}

/** 유니온 공격대 배치 — `client.maplestorySEA.union.getRaider()` 의 응답. */
export interface SEAUnionRaider {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Union raid member effects */
  readonly union_raider_stat: readonly string[];
  /** Union raid capture effects */
  readonly union_occupied_stat: readonly string[];
  /** Union raider deployment */
  readonly union_inner_stat: readonly SEAUnionInnerStat[];
  /** Union Legion Block */
  readonly union_block: readonly SEAUnionBlock[];
  /** Number of the preset currently in use */
  readonly use_preset_no: number;
  /** Information for Union Preset 1 */
  readonly union_raider_preset_1: SEAUnionRaiderPreset | null;
  /** Information for Union Preset 2 */
  readonly union_raider_preset_2: SEAUnionRaiderPreset | null;
  /** Information for Union Preset 3 */
  readonly union_raider_preset_3: SEAUnionRaiderPreset | null;
  /** Information for Union Preset 4 */
  readonly union_raider_preset_4: SEAUnionRaiderPreset | null;
  /** Information for Union Preset 5 */
  readonly union_raider_preset_5: SEAUnionRaiderPreset | null;
}

// ─── GET /maplestorysea/v1/user/union-artifact ────────────────────────────────

/** Artifact effect information */
export interface SEAUnionArtifactEffect {
  /** Name of the artifact effect */
  readonly name: string;
  /** Level of the artifact effect */
  readonly level: number;
}

/** Artifact crystal information */
export interface SEAUnionArtifactCrystal {
  /** Name of the artifact crystal */
  readonly name: string;
  /** Validity of the stat (0: Valid, 1: Invalid) */
  readonly validity_flag: string;
  /** Expiration date of the stat (SGT) */
  readonly date_expire: string | null;
  /** Grade of the artifact crystal */
  readonly level: number;
  /** First option of the artifact crystal */
  readonly crystal_option_name_1: string;
  /** Second option of the artifact crystal */
  readonly crystal_option_name_2: string;
  /** Third option of the artifact crystal */
  readonly crystal_option_name_3: string;
}

/** 유니온 아티팩트 — `client.maplestorySEA.union.getArtifact()` 의 응답. */
export interface SEAUnionArtifact {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Artifact effect information */
  readonly union_artifact_effect: readonly SEAUnionArtifactEffect[];
  /** Artifact crystal information */
  readonly union_artifact_crystal: readonly SEAUnionArtifactCrystal[];
  /** Remaining artifact AP */
  readonly union_artifact_remain_ap: number;
}

// ─── GET /maplestorysea/v1/user/union-champion ────────────────────────────────

/** Union Champion Insignia information */
export interface SEAUnionChampionBadgeInfo {
  /** Union Champion Insignia information */
  readonly stat: string;
}

/** Union Champion information */
export interface SEAUnionChampionInfo {
  /** Union Champion character name */
  readonly champion_name: string;
  /** Union Champion slot */
  readonly champion_slot: number;
  /** Union Champion level */
  readonly champion_grade: string;
  /** Union Champion character's job */
  readonly champion_class: string;
  /** Union Champion Insignia information */
  readonly champion_badge_info: readonly SEAUnionChampionBadgeInfo[];
}

/** 유니온 챔피언 — `client.maplestorySEA.union.getChampion()` 의 응답. */
export interface SEAUnionChampion {
  /** 조회 기준일(싱가포르 시간). 일별 데이터는 0시 0분 기준. 최신 데이터 조회 시 null일 수 있다. */
  readonly date: string | null;
  /** Union Champion information */
  readonly union_champion: readonly SEAUnionChampionInfo[];
  /** Champion Insignia effects */
  readonly champion_badge_total_info: readonly SEAUnionChampionBadgeInfo[];
}
