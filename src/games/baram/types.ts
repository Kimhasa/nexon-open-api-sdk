import type { Brand } from '../../core/types/branded.js';

/**
 * 바람의나라 캐릭터 식별자 (ocid).
 *
 * `client.baram.getOcid()` 로 획득합니다. 다른 게임의 ocid와 섞어 쓸 수 없습니다.
 * 게임 콘텐츠 변경으로 값이 바뀔 수 있으므로 장기 보관 시 주기적으로 다시 조회하세요.
 */
export type BaramOCID = Brand<string, 'BaramOCID'>;

/**
 * 바람의나라 서버 명.
 *
 * 스펙의 enum 값을 자동완성으로 제공하고, 서버가 추가될 때를 대비해 임의 문자열도 받습니다.
 */
export type BaramServerName = '연' | '무휼' | '유리' | '진' | '하자' | '호동' | (string & {});

/** ocid 기반 요청 파라미터 */
export interface BaramOcidRequest {
  /** 캐릭터 식별자 */
  readonly ocid: BaramOCID;
}
