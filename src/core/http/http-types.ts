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
   * 최대 재시도 횟수. 429(Rate Limit)와 503(Maintenance) 응답에만 적용됩니다.
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
   * // 간단 디버그
   * new NexonClient({ apiKey, debug: true });
   *
   * // 커스텀 로거
   * new NexonClient({ apiKey, logger: { onRequest: (req) => console.log(req) } });
   * ```
   */
  readonly debug?: boolean;
  readonly logger?: Partial<HttpLogger>;
}

/** 요청 전 호출되는 인터셉터. 반환값으로 요청 정보를 수정할 수 있다. */
export type RequestInterceptor = (request: HttpRequestInfo) => HttpRequestInfo | Promise<HttpRequestInfo>;

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
}
