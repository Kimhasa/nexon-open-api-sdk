import type { GuildId } from '../../_base/maple-base-types.js';

// ─── GET /maplestorysea/v1/guild/id ───────────────────────────────────────────

/** GET /maplestorysea/v1/guild/id response */
export interface SEAGuildIdResponse {
  /** Guild identifier */
  readonly oguild_id: GuildId;
}

// ─── GET /maplestorysea/v1/guild/basic ────────────────────────────────────────

/** Guild skill information */
export interface SEAGuildSkill {
  /** Skill name */
  readonly skill_name: string;
  /** Skill description */
  readonly skill_description: string;
  /** Skill level */
  readonly skill_level: number;
  /** Effects by skill level */
  readonly skill_effect: string;
  /** Skill icon */
  readonly skill_icon: string;
}

/** 길드 기본 정보 — `client.maplestorySEA.guild.getBasic()` 의 응답. */
export interface SEAGuildBasic {
  /** 조회 기준일(싱가포르 시간). 날짜를 생략해 최신 길드 정보를 조회하면 null. */
  readonly date: string | null;
  /** World name */
  readonly world_name: string;
  /** Guild name */
  readonly guild_name: string;
  /** Guild level */
  readonly guild_level: number;
  /** Honor EXP */
  readonly guild_fame: number;
  /** Guild Points (GP) */
  readonly guild_point: number;
  /** Character name of the Guild Master */
  readonly guild_master_name: string;
  /** Number of guild members */
  readonly guild_member_count: number;
  /** List of guild members */
  readonly guild_member: readonly string[];
  /** List of guild skills */
  readonly guild_skill: readonly SEAGuildSkill[];
  /** List of Noblesse Guild Skills */
  readonly guild_noblesse_skill: readonly SEAGuildSkill[];
}
