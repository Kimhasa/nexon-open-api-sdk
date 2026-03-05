import type { OCID, GuildId } from '../../core/types/branded.js';

/** OCID 기반 요청 파라미터 (메이플스토리M 전용) */
export interface MOcidRequest {
  readonly ocid: OCID;
}

/** 길드 ID 기반 요청 파라미터 (메이플스토리M 전용) */
export interface MGuildIdRequest {
  readonly oguild_id: GuildId;
}
