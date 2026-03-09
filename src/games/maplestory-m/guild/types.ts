import type { GuildId } from '../../_base/maple-base-types.js';

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
  /** 스킬 레벨 */
  readonly skill_level: number;
  /** 스킬 옵션 */
  readonly skill_option: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
}

/** 길드 개인 스킬 정보 */
export interface MGuildPersonalSkill {
  /** 스킬 명 */
  readonly skill_name: string;
  /** 스킬 레벨 */
  readonly skill_level: number;
  /** 스킬 옵션 */
  readonly skill_option: string;
  /** 스킬 아이콘 */
  readonly skill_icon: string;
}

/** 길드원 정보 */
export interface MGuildMember {
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 길드 활동량 */
  readonly guild_activity: number;
  /** 길드 개인 스킬 정보 */
  readonly guild_personal_skill: MGuildPersonalSkill[];
}

/** 길드 시설물 정보 */
export interface MGuildBuilding {
  /** 시설물 명 */
  readonly building_name: string;
  /** 시설물 레벨 */
  readonly building_level: number;
}

/** 길드 어빌리티 정보 */
export interface MGuildAbility {
  /** 어빌리티 차수 */
  readonly ability_no: number;
  /** 어빌리티 명 */
  readonly ability_name: string;
  /** 어빌리티 레벨 */
  readonly ability_level: number;
  /** 어빌리티 옵션 */
  readonly ability_option: string;
  /** 어빌리티 아이콘 */
  readonly ability_icon: string;
}

/** GET /maplestorym/v1/guild/basic 응답 */
export interface MGuildBasic {
  /** 길드 명 */
  readonly guild_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 길드 레벨 */
  readonly guild_level: number;
  /** 길드 생성일 */
  readonly world_create_date: string;
  /** 길드 키워드 */
  readonly guild_keyword: string[];
  /** 길드 마크 아이콘 */
  readonly guild_mark_icon: string;
  /** 길드 마스터 캐릭터 명 */
  readonly guild_master_name: string;
  /** 길드원 수 */
  readonly guild_member_count: number;
  /** 길드원 정보 */
  readonly guild_member: MGuildMember[];
  /** 길드 시설물 정보 */
  readonly guild_building: MGuildBuilding[];
  /** 길드 스킬 정보 */
  readonly guild_skill: MGuildSkill[];
  /** 길드 어빌리티 정보 */
  readonly guild_ability: MGuildAbility[];
}
