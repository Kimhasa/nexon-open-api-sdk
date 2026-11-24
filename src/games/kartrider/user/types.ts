import type { KartriderOUID } from '../types.js';

// ─── GET /kartrush/v1/id ─────────────────────────────────────────────────────

/** 계정 식별자 정보 항목 */
export interface KartriderOuidInfo {
  /** 계정 식별자 */
  readonly ouid: KartriderOUID;
  /** 라이더(계정) 생성 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly racer_date_create: string;
  /** 라이더(계정) 레벨 */
  readonly racer_level: string; // 스펙상 string(int64). `user/basic` 의 racer_level 은 number
}

/** 계정 식별자(ouid) 조회 응답 */
export interface KartriderOuidLookup {
  /** 계정 식별자 정보 */
  readonly ouid_info: readonly KartriderOuidInfo[]; // 같은 라이더 명에 계정이 여러 개 대응할 수 있어 배열
}

// ─── GET /kartrush/v1/user/basic ─────────────────────────────────────────────

/** 기본 정보 조회 응답 */
export interface KartriderUserBasic {
  /** 라이더(계정) 명 */
  readonly racer_name: string;
  /** 라이더(계정) 생성 일(시) (UTC0) */
  readonly racer_date_create: string;
  /** 라이더(계정) 마지막 로그인 일(시) (UTC0) */
  readonly racer_date_last_login: string;
  /** 라이더(계정) 마지막 로그아웃 일(시) (UTC0) */
  readonly racer_date_last_logout: string;
  /** 라이더(계정) 레벨 */
  readonly racer_level: number;
}

// ─── GET /kartrush/v1/user/title-equipment ───────────────────────────────────

/** 장착 칭호 항목 */
export interface KartriderTitleEquipment {
  /** 장착 칭호 명 */
  readonly title_name: string;
}

/** 장착 칭호 정보 조회 응답 */
export interface KartriderUserTitleEquipment {
  /** 장착 칭호 정보 */
  readonly title_equipment: readonly KartriderTitleEquipment[];
}
