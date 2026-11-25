const IDENTIFIER_PARAMS = new Set(['ocid', 'ouid', 'oguild_id']);
const HEX_IDENTIFIER = /^[0-9a-f]{32,}$/i;

/**
 * 캐릭터·계정·길드 식별자를 로그에 남길 때 앞 8자만 표시한다.
 *
 * 넥슨이 이름 조회에서 돌려준 식별자에는 API Key의 뒷부분이 들어 있을 수 있습니다.
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
 * 요청 URL의 쿼리에서 캐릭터·계정·길드 식별자를 가린다.
 *
 * 식별자에는 API Key의 뒷부분이 들어 있을 수 있습니다. `ocid`, `ouid`, `oguild_id`
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

/**
 * 로그 출력용으로 URL 쿼리의 퍼센트 인코딩을 풀어 사람이 읽기 쉽게 만든다 (SDK 내부용).
 *
 * `character_name=%EC%BA%90…` 대신 `character_name=캐릭터` 처럼 보이게 한다.
 * 식별자 마스킹은 하지 않으므로 {@link maskIdentifiers} 를 먼저 거친 URL에 쓴다.
 * 디코딩할 수 없는 값은 그대로 둔다.
 */
export function readableUrl(url: string): string {
  const query = url.indexOf('?');
  if (query < 0) return url;
  const readable = url
    .slice(query + 1)
    .split('&')
    .map((pair) => {
      try {
        return decodeURIComponent(pair.replace(/\+/g, ' '));
      } catch {
        return pair;
      }
    })
    .join('&');
  return `${url.slice(0, query)}?${readable}`;
}
