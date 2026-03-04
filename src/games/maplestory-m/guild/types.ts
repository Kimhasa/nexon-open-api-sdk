import type { GuildId } from '../../../core/types/branded.js';

// ─── GET /maplestorym/v1/guild/id ────────────────────────────────────────────

/** 길드 식별자 조회 응답 */
export interface MGuildIdResponse {
  /** 길드 식별자 */
  readonly oguild_id: GuildId;
}

/**
 * 월드 명.
 *
 * 메이플스토리M 서버 목록.
 */
export type MWorldName =
  | '아케인'
  | '크로아'
  | '엘리시움'
  | '루나'
  | '스카니아'
  | '유니온'
  | '제니스'
  | (string & {});

// ─── GET /maplestorym/v1/guild/basic ─────────────────────────────────────────

/** 길드 스킬 정보 */
export interface MGuildSkill {
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
export interface MGuildBasic {
  /** 조회 기준일 (KST) */
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
  readonly guild_skill: readonly MGuildSkill[];
  /** 노블레스 스킬 목록 */
  readonly guild_noblesse_skill: readonly MGuildSkill[];
}
