import { NEXON_ERROR_CODES } from './error-codes.js';
import { NexonError } from './NexonError.js';
import { NexonRateLimitError } from './NexonRateLimitError.js';
import { NexonAuthError } from './NexonAuthError.js';
import { NexonNotFoundError } from './NexonNotFoundError.js';
import { NexonBadRequestError } from './NexonBadRequestError.js';
import { NexonDataNotReadyError } from './NexonDataNotReadyError.js';
import { NexonServerError } from './NexonServerError.js';
import { NexonMaintenanceError } from './NexonMaintenanceError.js';
import type { NexonErrorPayload } from './NexonError.js';

const GAME_NAMES_BY_PATH_PREFIX = new Map([
  ['maplestory', '메이플스토리'],
  ['maplestorym', '메이플스토리M'],
  ['maplestorysea', 'MapleStorySEA'],
  ['maplestorytw', 'MapleStoryTaiwan'],
  ['fconline', 'EA SPORTS FC 온라인'],
  ['tfd', '퍼스트 디센던트'],
  ['heroes', '마비노기 영웅전'],
  ['suddenattack', '서든어택'],
  ['kartrush', '카트라이더 러쉬플러스'],
  ['baram', '바람의나라'],
  ['mabinogi', '마비노기'],
  ['baramy', '바람의나라: 연'],
  ['v4', 'V4'],
  ['hit2', '히트2'],
  ['platform', 'NEXON Open API 공지'],
]);

/**
 * HTTP 상태 코드와 넥슨 에러 코드를 기반으로 적절한 에러 인스턴스를 반환한다.
 *
 * 코드의 의미는 넥슨 포털의 응답코드 표를 따른다 (`error-codes.ts`).
 * 메시지는 `[코드] 서버 원문` 뒤에 "무엇이 틀렸고 어떻게 고치는지"를 `→` 로 덧붙인다.
 *
 * @param status - HTTP 상태 코드
 * @param payload - NEXON Open API 에러 응답 페이로드 (파싱 실패 시 undefined)
 * @param retryAfterMs - Retry-After 헤더값 (밀리초)
 * @param context - 요청 URL을 넘기면 `OPENAPI00006` 안내에 조회하려던 게임 이름을 표시합니다.
 *
 * @example
 * ```ts
 * import { classifyError } from 'nexon-open-api';
 *
 * const error = classifyError(
 *   400,
 *   { error: { name: 'OPENAPI00006', message: 'Invalid game or path' } },
 *   undefined,
 *   { url: 'https://open.api.nexon.com/maplestory/v1/id' },
 * );
 * console.error(error.message); // 메이플스토리 API Key를 확인하라는 안내
 * ```
 */
export function classifyError(
  status: number,
  payload: NexonErrorPayload | undefined,
  retryAfterMs?: number,
  context?: { readonly url?: string | undefined },
): NexonError {
  const code = payload?.error?.name;
  // 서버가 준 원문. 응답 본문을 읽지 못했으면 undefined
  const rawMessage = payload?.error?.message;
  const nexonMessage = rawMessage ?? 'Unknown error';
  const baseMessage = `[${code ?? status}] ${nexonMessage}`;

  if (code === NEXON_ERROR_CODES.INVALID_GAME_OR_PATH) {
    const game = getGameName(context?.url);
    const api = game ? `${game} API` : '이 API';
    const application = game ? `${game}용 애플리케이션` : '조회하려는 게임의 애플리케이션';
    return new NexonAuthError(
      `${baseMessage}\n→ 이 API Key로는 ${api}를 부를 수 없습니다. ` +
        'API Key는 NEXON Open API에서 게임마다 따로 발급됩니다. ' +
        `${application}의 API Key인지 확인하세요 (https://openapi.nexon.com/ko/my-application/). ` +
        'API Key가 맞다면 넥슨이 이 API 제공을 중단했을 수 있으니 nexon-open-api를 최신 버전으로 올리세요.',
      { status, code, nexonMessage: rawMessage },
    );
  }

  // 호출량 초과
  if (status === 429 || code === NEXON_ERROR_CODES.RATE_LIMIT) {
    return new NexonRateLimitError(
      `${baseMessage}\n→ API 호출 허용량을 초과했습니다. 잠시 뒤 다시 조회하세요. ` +
        '같은 조회 결과는 저장해 두고 다시 쓰면 호출량을 줄일 수 있습니다.',
      { retryAfterMs, nexonMessage: rawMessage },
    );
  }

  // API Key
  if (code === NEXON_ERROR_CODES.INVALID_API_KEY) {
    return new NexonAuthError(
      `${baseMessage}\n→ API Key가 올바르지 않습니다. ` +
        '입력한 API Key를 https://openapi.nexon.com/ 의 애플리케이션 상세 페이지에 표시된 값과 비교하세요. ' +
        '앞뒤 공백이나 따옴표가 붙지 않았는지 확인하고, API Key가 노출됐다면 새로 발급받으세요.',
      { status, code, nexonMessage: rawMessage },
    );
  }
  if (code === NEXON_ERROR_CODES.UNAUTHORIZED) {
    return new NexonAuthError(
      `${baseMessage}\n→ 이 API Key로는 이 API를 쓸 수 없습니다. ` +
        'API Key는 게임마다 따로 발급됩니다. API Key를 발급받은 게임과 조회하려는 게임이 같은지 확인하세요.',
      { status, code, nexonMessage: rawMessage },
    );
  }

  // 없는 캐릭터·길드·계정
  if (code === NEXON_ERROR_CODES.NOT_FOUND) {
    return new NexonNotFoundError(
      `${baseMessage}\n→ 캐릭터·길드·계정을 찾을 수 없습니다. 이름과 월드·서버가 맞는지 확인하세요. ` +
        '저장해 둔 식별자(ocid·ouid)로 조회했다면 식별자가 바뀌었을 수 있으니 이름으로 다시 조회하세요.',
      { nexonMessage: rawMessage },
    );
  }

  // 점검 — 00011은 HTTP 503으로 오므로 일반 서버 에러 분기보다 먼저 검사한다
  if (code === NEXON_ERROR_CODES.GAME_MAINTENANCE) {
    return new NexonMaintenanceError(
      `${baseMessage}\n→ 게임이 점검 중이라 조회할 수 없습니다. 점검이 끝난 뒤 다시 조회하세요.`,
      { status, code, nexonMessage: rawMessage },
    );
  }
  if (code === NEXON_ERROR_CODES.API_MAINTENANCE) {
    return new NexonMaintenanceError(
      `${baseMessage}\n→ NEXON Open API가 점검 중입니다. 점검이 끝난 뒤 다시 조회하세요. ` +
        '점검 공지는 client.platform.getNoticeList() 로 확인할 수 있습니다.',
      { status, code, nexonMessage: rawMessage },
    );
  }

  // 데이터 준비 중
  if (code === NEXON_ERROR_CODES.DATA_NOT_READY) {
    return new NexonDataNotReadyError(
      `${baseMessage}\n→ 조회한 날짜의 데이터가 아직 준비되지 않았습니다. ` +
        '날짜를 하루 전으로 바꾸거나 잠시 뒤 다시 조회하세요. ' +
        '예: 메이플스토리의 지난 날짜 데이터는 다음날 오전 2시(KST)부터, ' +
        '오늘의 랭킹은 오전 9시 30분경부터 조회할 수 있습니다.',
      { code, nexonMessage: rawMessage },
    );
  }

  // 잘못된 입력
  if (status === 400 && code === NEXON_ERROR_CODES.BAD_REQUEST) {
    return new NexonBadRequestError(
      `${baseMessage}\n→ 빠졌거나 형식이 틀린 값이 있습니다. ` +
        '이름이 비어 있지 않은지, 날짜가 YYYY-MM-DD 형식인지, 번호와 선택값이 허용 범위 안인지 확인하세요.',
      { code, nexonMessage },
    );
  }

  // 서버 오류 (5xx, 서버 내부 오류). 00008은 포털 표에 없어 점검이라고 단정하지 않는다
  if (
    status >= 500 ||
    code === NEXON_ERROR_CODES.SERVER_ERROR ||
    code === NEXON_ERROR_CODES.MAINTENANCE
  ) {
    return new NexonServerError(
      `${baseMessage}\n→ NEXON Open API 서버에 문제가 발생했습니다. 잠시 뒤 다시 조회하세요.`,
      { status, ...(code !== undefined ? { code } : {}), nexonMessage: rawMessage },
    );
  }

  // 표에 없는 응답
  return new NexonError(baseMessage, { status, code, nexonMessage });
}

function getGameName(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const [, prefix] = new URL(url).pathname.split('/');
    return prefix ? GAME_NAMES_BY_PATH_PREFIX.get(prefix) : undefined;
  } catch {
    return undefined;
  }
}
