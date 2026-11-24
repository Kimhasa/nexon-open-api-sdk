import type { Brand } from '../../core/types/branded.js';

/**
 * V4 캐릭터 식별자 (ocid).
 *
 * `client.v4.getOcid()` 로 획득합니다. 다른 게임의 ocid와 섞어 쓸 수 없습니다.
 * 게임 콘텐츠 변경으로 값이 바뀔 수 있으므로 장기 보관 시 주기적으로 다시 조회하세요.
 */
export type V4OCID = Brand<string, 'V4OCID'>;

/** ocid 기반 요청 파라미터 */
export interface V4OcidRequest {
  /** 캐릭터 식별자 */
  readonly ocid: V4OCID;
}
