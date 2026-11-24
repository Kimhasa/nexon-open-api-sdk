import type { Brand } from '../../core/types/branded.js';

/**
 * 퍼스트 디센던트 계정 식별자 (ouid).
 *
 * `client.firstDescendant.getOuid()` 로 얻는다.
 * 게임 콘텐츠 변경으로 값이 바뀔 수 있으므로 장기 보관한 ouid는 주기적으로 다시 조회한다.
 */
export type TfdOuid = Brand<string, 'TfdOuid'>;

/** 퍼스트 디센던트 API가 지원하는 언어 코드 목록 (스펙의 `language_code` enum). */
export const TFD_LANGUAGE_CODES = [
  'ko',
  'en',
  'de',
  'fr',
  'ja',
  'zh-CN',
  'zh-TW',
  'it',
  'pl',
  'pt',
  'ru',
  'es',
] as const;

/** 퍼스트 디센던트 언어 코드. */
export type TfdLanguageCode = (typeof TFD_LANGUAGE_CODES)[number];

/** 플랫폼 유형 (리더보드 조회 조건). */
export type TfdPlatformType = 'All' | 'Pc' | 'PlayStation' | 'Xbox';
