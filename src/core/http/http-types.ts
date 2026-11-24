import type { ShapeMismatch } from '../validation/response-shape.js';

/**
 * HttpClient 설정 인터페이스.
 */
export interface HttpClientConfig {
  /** Nexon Open API 키 */
  readonly apiKey: string;

  /**
   * 요청 타임아웃 (밀리초).
   * @default 10_000
   */
  readonly timeoutMs?: number;

  /**
   * 최대 재시도 횟수. 429(호출량 초과)와 5xx(서버 오류) 응답에 적용됩니다.
   * @default 3
   */
  readonly maxRetries?: number;

  /**
   * 지수 백오프 기본 대기 시간 (밀리초).
   * 실제 대기 = `retryBaseDelayMs * 2^(attempt - 1)` + jitter
   * @default 500
   */
  readonly retryBaseDelayMs?: number;

  /**
   * 디버그 모드 또는 커스텀 로거 주입.
   *
   * @example
   * ```ts
   * import { maskIdentifiers, NexonClient } from 'nexon-open-api';
   *
   * const apiKey = '발급받은-메이플스토리-키';
   *
   * // 간단 디버그
   * new NexonClient({ apiKey, debug: true });
   *
   * // 커스텀 로거에서 요청 URL을 출력할 때는 maskIdentifiers()로 고유 번호를 가린다
   * new NexonClient({
   *   apiKey,
   *   logger: { onRequest: ({ url }) => console.debug(maskIdentifiers(url)) },
   * });
   * ```
   */
  readonly debug?: boolean;
  readonly logger?: Partial<HttpLogger>;

  /**
   * 런타임 응답 shape 검증 활성화.
   *
   * 활성화 시 응답의 top-level 키와 타입을 shape descriptor와 비교하여
   * 불일치를 logger를 통해 경고합니다. throw하지 않습니다.
   *
   * 개발·모니터링 환경에서 넥슨 API의 응답 스키마 변경(drift)을 조기 감지하는 데 유용합니다.
   *
   * @default false
   *
   * @example
   * ```ts
   * const client = new NexonClient({
   *   apiKey: 'key',
   *   debug: true,
   *   responseValidation: true,
   * });
   * ```
   */
  readonly responseValidation?: boolean;
}

/**
 * `HttpClient.get()` 의 요청별 옵션.
 *
 * 클라이언트 전역 설정(타임아웃, 재시도, 로거, 인터셉터)은 그대로 적용되고,
 * 이 요청 한 건의 헤더만 바꿉니다.
 *
 * @example
 * ```ts
 * // 기본 API 키 헤더를 빼고 다른 인증 헤더로 보낸다
 * await http.get<{ ouid: string }>(url, undefined, undefined, {
 *   headers: { 'x-nxopen-api-key': undefined, 'x-nxopen-legacy-api-key': legacyApiKey },
 * });
 * ```
 */
export interface HttpRequestOptions {
  /**
   * 이 요청에만 적용할 헤더.
   *
   * - 기본 헤더(`x-nxopen-api-key`, `Accept`)에 병합하고, 같은 이름이면 덮어씁니다.
   * - 값이 `undefined` 면 그 이름의 기본 헤더를 제거합니다.
   * - 이름은 대소문자를 구분하지 않고 비교합니다.
   */
  readonly headers?: Readonly<Record<string, string | undefined>> | undefined;
}

/** 요청 전 호출되는 인터셉터. 반환값으로 요청 정보를 수정할 수 있다. */
export type RequestInterceptor = (
  request: HttpRequestInfo,
) => HttpRequestInfo | Promise<HttpRequestInfo>;

/** 응답 후 호출되는 인터셉터. 응답을 가공하거나 사이드이펙트를 추가할 수 있다. */
export type ResponseInterceptor = (response: HttpResponseInfo) => void | Promise<void>;

/** 재시도 시 호출되는 인터셉터. */
export type RetryInterceptor = (info: HttpRetryInfo) => void | Promise<void>;

export interface HttpRequestInfo {
  readonly url: string;
  readonly method: string;
  readonly headers: Record<string, string>;
  readonly params?: Record<string, string> | undefined;
}

export interface HttpResponseInfo {
  readonly request: HttpRequestInfo;
  readonly status: number;
  readonly durationMs: number;
}

export interface HttpRetryInfo {
  readonly request: HttpRequestInfo;
  readonly attempt: number;
  readonly maxRetries: number;
  readonly waitMs: number;
  readonly reason: string;
}

export interface HttpLogger {
  onRequest: (info: HttpRequestInfo) => void;
  onResponse: (info: HttpResponseInfo) => void;
  onRetry: (info: HttpRetryInfo) => void;
  /** 응답 shape가 예상과 다를 때 호출. `responseValidation: true` 시에만 동작. */
  onResponseShapeMismatch?: ((mismatch: ShapeMismatch) => void) | undefined;
}
