const IDENTIFIER_PARAMS = new Set(['ocid', 'ouid', 'oguild_id']);
const HEX_IDENTIFIER = /^[0-9a-f]{32,}$/i;

/**
 * 캐릭터·계정·길드 고유 번호를 로그에 남길 때 앞 8자만 표시한다.
 *
 * 넥슨이 이름 조회에서 돌려준 고유 번호에는 API 키의 뒷부분이 들어 있을 수 있습니다.
 * 8자 이하의 값은 그대로 돌려줍니다.
 *
 * @param value - 캐릭터 번호(OCID), 계정 번호(OUID), 길드 번호 등
 * @example
 * ```ts
 * import { maskIdentifier, NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({
 *   apiKey: '발급받은-메이플스토리-키',
 *   logger: {
 *     onRequest: ({ params }) => {
 *       if (params?.['ocid']) console.debug(maskIdentifier(params['ocid']));
 *     },
 *   },
 * });
 * ```
 */
export function maskIdentifier(value: string): string {
  return value.length > 8 ? `${value.slice(0, 8)}…` : value;
}

/**
 * 요청 URL의 쿼리에서 캐릭터·계정·길드 고유 번호를 가린다.
 *
 * 고유 번호에는 API 키의 뒷부분이 들어 있을 수 있습니다. `ocid`, `ouid`, `oguild_id`
 * 값과 32자 이상의 16진수 값을 마스킹합니다. 캐릭터명과 날짜 등은 그대로 표시합니다.
 * URL을 파싱할 수 없으면 `?…`를 반환합니다.
 *
 * @param url - 로그에 남길 전체 요청 URL
 * @example
 * ```ts
 * import { maskIdentifiers, NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({
 *   apiKey: '발급받은-메이플스토리-키',
 *   logger: {
 *     onRequest: ({ method, url }) => console.debug(method, maskIdentifiers(url)),
 *   },
 * });
 * ```
 */
export function maskIdentifiers(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return '?…';
  }

  const params = new URLSearchParams();
  let masked = false;
  for (const [name, value] of parsed.searchParams) {
    const displayValue =
      IDENTIFIER_PARAMS.has(name.toLowerCase()) || HEX_IDENTIFIER.test(value)
        ? maskIdentifier(value)
        : value;
    params.append(name, displayValue);
    masked ||= displayValue !== value;
  }
  if (!masked) return url;

  parsed.search = params.toString();
  return parsed.toString();
}
