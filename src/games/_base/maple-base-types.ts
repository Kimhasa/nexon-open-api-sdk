import type { OCID, GuildId, NexonDate } from '../../core/types/branded.js';

/** OCID 기반 기본 요청 파라미터 */
export interface OcidRequest {
  readonly ocid: OCID;
}

/** OCID + 날짜 기반 요청 파라미터 */
export interface OcidDateRequest {
  readonly ocid: OCID;
  /**
   * 조회 기준일 (YYYY-MM-DD).
   * 생략 시 전일 데이터를 반환합니다.
   */
  readonly date?: NexonDate | string;
}

/** 길드 ID 기반 기본 요청 파라미터 */
export interface GuildIdRequest {
  readonly oguild_id: GuildId;
}

/** 길드 ID + 날짜 기반 요청 파라미터 */
export interface GuildIdDateRequest {
  readonly oguild_id: GuildId;
  readonly date?: NexonDate | string;
}
