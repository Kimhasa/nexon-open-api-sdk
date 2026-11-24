import type { GuildId, OCID } from '../_base/maple-base-types.js';

/** A calendar date (YYYY-MM-DD), a Date, or 'today' in Taiwan Standard Time (UTC+8). */
export type TWDate = Date | string;

/** GET /maplestorytw/v1/id response. */
export interface TWOcidResponse {
  /** Character identifier. Game updates can change this value. */
  readonly ocid: OCID;
}

/** Request for a character or Union snapshot. */
export interface TWOcidDateRequest {
  /** Character identifier returned by `getOcid()`. */
  readonly ocid: OCID;
  /** Taiwan calendar date. Omit to use the API's default. */
  readonly date?: TWDate | undefined;
}

/** Request for a guild snapshot. */
export interface TWGuildIdDateRequest {
  /** Guild identifier returned by `guild.getId()`. */
  readonly oguild_id: GuildId;
  /** Taiwan calendar date. Omit to use the API's default. */
  readonly date?: TWDate | undefined;
}
