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

/** GET /maplestorysea/v1/guild/basic response */
export interface SEAGuildBasic {
  /** Reference date for query (SGT, daily data with hours and minutes set to 0) */
  readonly date: string;
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
