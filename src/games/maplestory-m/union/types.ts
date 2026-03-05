// ─── GET /maplestorym/v1/user/union ──────────────────────────────────────────

/** GET /maplestorym/v1/user/union 응답 */
export interface MUnion {
  /** 유니온 레벨 */
  readonly union_level: number;
  /** 유니온 등급 */
  readonly union_grade: string;
  /** 레벨 총합 누적 효과 */
  readonly union_level_total_option: string;
  /** 유니온 등급 아이콘 */
  readonly union_grade_icon: string;
}

// ─── GET /maplestorym/v1/user/union-raider ──────────────────────────────────

/** 유니온 옵션 정보 (점령 효과 / 공격대원 효과 공용) */
export interface MUnionOption {
  /** 옵션 명 */
  readonly option_name: string;
  /** 옵션 값 */
  readonly option_value: string;
}

/** 블록 셀 위치 정보 */
export interface MUnionBlockCell {
  /** 셀 번호 (블록 당 1~5개 셀 + position 기준점) */
  readonly cell_no: string;
  /** 셀 x 좌표 */
  readonly cell_x: string;
  /** 셀 y 좌표 */
  readonly cell_y: string;
}

/** 공격대 블록 배치 정보 */
export interface MUnionRaiderBlock {
  /** 블록 랭크 (0:B, 1:A, 2:S, 3:SS, 4:SSS) */
  readonly block_rank: string;
  /** 블록 타입 (0:공통, 1:전사, 2:궁수, 3:도적, 4:마법사, 5:해적) */
  readonly block_type: string;
  /** 블록 맵 위치 정보 (맵: 0x0 ~ 21x19, 총 440칸) */
  readonly block_position: MUnionBlockCell[];
}

/** 구역별 옵션 설정 (좌측 상단이 구역 1, 반시계 방향으로 증가, 우측 상단이 구역 8) */
export interface MUnionOptionSetting {
  /** 구역 1 옵션 명 */
  readonly option_name_1: string;
  /** 구역 2 옵션 명 */
  readonly option_name_2: string;
  /** 구역 3 옵션 명 */
  readonly option_name_3: string;
  /** 구역 4 옵션 명 */
  readonly option_name_4: string;
  /** 구역 5 옵션 명 */
  readonly option_name_5: string;
  /** 구역 6 옵션 명 */
  readonly option_name_6: string;
  /** 구역 7 옵션 명 */
  readonly option_name_7: string;
  /** 구역 8 옵션 명 */
  readonly option_name_8: string;
}

/** 전투 지도 프리셋 정보 */
export interface MUnionBattleMap {
  /** 프리셋 번호 */
  readonly preset_no: string;
  /** 구역별 옵션 설정 */
  readonly option_setting: MUnionOptionSetting;
  /** 공격대 배치 정보 */
  readonly union_raider: MUnionRaiderBlock[];
}

/** GET /maplestorym/v1/user/union-raider 응답 */
export interface MUnionRaider {
  /** 적용 중인 전투 지도 프리셋 번호 */
  readonly use_preset_no: number;
  /** 적용 중인 점령 효과 정보 */
  readonly use_union_occupied_option: MUnionOption[];
  /** 적용 중인 공격대원 효과 정보 */
  readonly use_union_raider_option: MUnionOption[];
  /** 프리셋별 전투 지도 정보 */
  readonly battle_map: MUnionBattleMap[];
}
