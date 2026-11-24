import { NexonError } from '../../core/errors/NexonError.js';
import { TFD_LANGUAGE_CODES } from './types.js';
import type { TfdLanguageCode } from './types.js';

/**
 * 필수 문자열 인자가 비어 있으면 요청을 보내기 전에 throw한다.
 *
 * @param value - 검사할 값
 * @param name - 에러 메시지에 쓸 인자 이름
 * @param hint - 올바른 값을 얻는 방법 안내
 * @internal
 */
export function assertNonEmpty(value: unknown, name: string, hint: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new NexonError(
      `${name} 값이 비어 있습니다. 퍼스트 디센던트 API에 요청을 보내지 않았습니다.\n→ ${hint}`,
    );
  }
}

/**
 * 언어 코드를 검증한다.
 *
 * 정적 메타데이터는 지원하지 않는 언어 경로에 JSON이 아닌 403(XML)을 돌려줘서
 * API 키 오류처럼 보인다. 그래서 SDK에서 먼저 걸러 원인을 바로 알려준다.
 *
 * @internal
 */
export function assertLanguageCode(languageCode: unknown): TfdLanguageCode {
  if (!(TFD_LANGUAGE_CODES as readonly unknown[]).includes(languageCode)) {
    throw new NexonError(
      `지원하지 않는 언어 코드입니다: ${JSON.stringify(languageCode)}. ` +
        '퍼스트 디센던트 API에 요청을 보내지 않았습니다.\n' +
        `→ 다음 중 하나를 쓰세요 (대소문자 구분): ${TFD_LANGUAGE_CODES.join(', ')}`,
    );
  }
  return languageCode as TfdLanguageCode;
}
