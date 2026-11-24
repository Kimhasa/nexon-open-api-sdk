import type { GuildId } from '../../_base/maple-base-types.js';

export const TW_WORLD_NAMES = [
  '艾麗亞',
  '普力特',
  '琉德',
  '優依娜',
  '愛麗西亞',
  '米特拉',
  '挑戰者',
  '殺人鯨',
  '賽蓮',
] as const;

/** World names accepted by the guild identifier endpoint. */
export type TWWorldName = (typeof TW_WORLD_NAMES)[number];

// ─── GET /maplestorytw/v1/guild/id ───────────────────────────────────────────

/** GET /maplestorytw/v1/guild/id response */
export interface TWGuildIdResponse {
  /** 길드 고유 번호. 없는 길드면 넥슨이 null 을 준다 (SDK는 NexonNotFoundError 를 던진다) */
  readonly oguild_id: GuildId | null;
}

// ─── GET /maplestorytw/v1/guild/basic ────────────────────────────────────────

/** Guild skill information */
export interface TWGuildSkill {
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

/** 길드 기본 정보 — `client.maplestoryTW.guild.getBasic()` 의 응답. */
export interface TWGuildBasic {
  /** Reference date for query (TST, daily data with hours and minutes set to 0) */
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
  readonly guild_skill: readonly TWGuildSkill[];
  /** List of Noblesse Guild Skills */
  readonly guild_noblesse_skill: readonly TWGuildSkill[];
}
