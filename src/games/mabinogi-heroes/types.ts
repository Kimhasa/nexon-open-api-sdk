import type { Brand } from '../../core/types/branded.js';

/**
 * 마비노기 영웅전 캐릭터 식별자 (ocid).
 *
 * 마비노기 영웅전 전용 브랜드 타입입니다. 메이플스토리의 `OCID` 와 섞어 쓸 수 없습니다.
 * `MabinogiHeroesClient.getOcid()` 로 획득합니다.
 *
 * 게임 콘텐츠 변경으로 ocid가 바뀔 수 있으므로 장기간 저장해 두고 쓰지 말고 주기적으로 다시 조회합니다.
 */
export type HeroesOCID = Brand<string, 'HeroesOCID'>;

/** ocid 기반 요청 파라미터 */
export interface HeroesOcidRequest {
  /** 캐릭터 식별자 (`client.mabinogiHeroes.getOcid()` 로 조회) */
  readonly ocid: HeroesOCID;
}

/** 능력치 명과 값 한 쌍 (캐릭터 능력치, 연마·정령합성 능력치, 팔찌 보석 능력치 등에 공통) */
export interface HeroesStatValue {
  /** 능력치 명 */
  readonly stat_name: string;
  /** 능력치 값 또는 증가량 (숫자가 아닌 문자열) */
  readonly stat_value: string;
}
