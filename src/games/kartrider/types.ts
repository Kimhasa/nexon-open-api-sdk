import type { Brand } from '../../core/types/branded.js';

/**
 * 카트라이더 러쉬플러스 계정 식별자 (ouid).
 *
 * `client.kartrider.getOuidInfo()` 응답의 `ouid_info[].ouid` 로 획득합니다.
 * 게임 콘텐츠 변경으로 값이 바뀔 수 있으므로 장기 보관 시 주기적으로 다시 조회하세요.
 */
export type KartriderOUID = Brand<string, 'KartriderOUID'>;

/** ouid 기반 요청 파라미터 */
export interface KartriderOuidRequest {
  /** 계정 식별자 */
  readonly ouid: KartriderOUID;
}
