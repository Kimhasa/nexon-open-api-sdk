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
  /** 조회 기준일 (대만 시간 UTC+8). 생략하면 가장 최근 데이터(약 15분 뒤 반영). */
  readonly date?: TWDate | undefined;
}

/** Request for a guild snapshot. */
export interface TWGuildIdDateRequest {
  /** Guild identifier returned by `guild.getId()`. */
  readonly oguild_id: GuildId;
  /** 조회 기준일 (대만 시간 UTC+8). 생략하면 가장 최근 데이터(약 15분 뒤 반영). */
  readonly date?: TWDate | undefined;
}
