import type { KartriderOUID } from '../types.js';

// ─── GET /kartrush/v1/id ─────────────────────────────────────────────────────

/** 계정 식별자 정보 항목 */
export interface KartriderOuidInfo {
  /** 라이더 프로필이나 장착 칭호를 조회할 때 쓰는 계정 고유 번호 */
  readonly ouid: KartriderOUID;
  /** 라이더(계정) 생성 일(시) (UTC0, 예: `"2023-12-14T08:28:35Z"`) */
  readonly racer_date_create: string;
  /** 라이더 후보를 고를 때 확인하는 레벨. 숫자로 온다 (포털 스펙은 문자열로 적지만 2026-11-24 실제 응답은 숫자) */
  readonly racer_level: number;
}

/** 계정 식별자(ouid) 조회 응답 */
export interface KartriderOuidLookup {
  /** 같은 라이더명에 대응하는 계정 후보. 레벨과 생성 시각으로 원하는 계정을 고른다. */
  readonly ouid_info: readonly KartriderOuidInfo[];
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
  /** 라이더 프로필의 레벨. 숫자로 제공된다. */
  readonly racer_level: number;
}

// ─── GET /kartrush/v1/user/title-equipment ───────────────────────────────────

/** 장착 칭호 항목 */
export interface KartriderTitleEquipment {
  /** 장착 칭호 명. 칭호를 장착하지 않았으면 null */
  readonly title_name: string | null;
}

/** 장착 칭호 정보 조회 응답 */
export interface KartriderUserTitleEquipment {
  /** 장착 칭호 정보 */
  readonly title_equipment: readonly KartriderTitleEquipment[];
}
