import type { GuildId } from '../../_base/maple-base-types.js';

// ─── GET /maplestory/v1/guild/id ──────────────────────────────────────────────

/** 길드 식별자 조회 응답 */
export interface GuildIdResponse {
  /** 길드 식별자 */
  readonly oguild_id: GuildId;
}

/**
 * 월드 명.
 *
 * 2024년 12월 19일 이후 리부트→에오스, 리부트2→핼리오스로 변경됨.
 */
export type WorldName =
  | '스카니아'
  | '베라'
  | '루나'
  | '제니스'
  | '크로아'
  | '유니온'
  | '엘리시움'
  | '이노시스'
  | '레드'
  | '오로라'
  | '아케인'
  | '노바'
  | '에오스'
  | '핼리오스'
  | '챌린저스'
  | '챌린저스2'
  | '챌린저스3'
  | '챌린저스4';

// ─── GET /maplestory/v1/guild/basic ──────────────────────────────────────────

/** 길드 스킬 정보 */
export interface GuildSkill {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 설명 */
  readonly skill_description: string;
  /** 스킬 레벨 */
  readonly skill_level: number;
  /** 스킬 레벨 별 효과 */
  readonly skill_effect: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
}

/** 길드 기본 정보 */
export interface GuildBasic {
  /** 조회 기준일 (KST, YYYY-MM-DDT00:00+09:00) */
  readonly date: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 길드 명 */
  readonly guild_name: string;
  /** 길드 레벨 */
  readonly guild_level: number;
  /** 길드 명성치 */
  readonly guild_fame: number;
  /** 길드 포인트(GP) */
  readonly guild_point: number;
  /** 길드 마스터 캐릭터 명 */
  readonly guild_master_name: string;
  /** 길드원 수 */
  readonly guild_member_count: number;
  /** 길드원 목록 */
  readonly guild_member: readonly string[];
  /** 길드 스킬 목록 */
  readonly guild_skill: readonly GuildSkill[];
  /** 노블레스 스킬 목록 */
  readonly guild_noblesse_skill: readonly GuildSkill[];
}
