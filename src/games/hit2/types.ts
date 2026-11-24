import type { Brand } from '../../core/types/branded.js';

/**
 * 히트2 캐릭터 식별자 (ocid).
 *
 * `client.hit2.getOcid()` 로 획득합니다. 다른 게임의 ocid와 섞어 쓸 수 없습니다.
 * 게임 콘텐츠 변경으로 값이 바뀔 수 있으므로 장기 보관 시 주기적으로 다시 조회하세요.
 */
export type Hit2OCID = Brand<string, 'Hit2OCID'>;

/** ocid 기반 요청 파라미터 */
export interface Hit2OcidRequest {
  /** 캐릭터 식별자 */
  readonly ocid: Hit2OCID;
}
