import { classifyError } from '../errors/classify-error.js';
import type { NexonErrorPayload } from '../errors/NexonError.js';
import { NexonError } from '../errors/NexonError.js';
import { validateShape } from '../validation/response-shape.js';
import type { ShapeDescriptor, ShapeMismatch } from '../validation/response-shape.js';
import { computeRetryDelay, isRetryableStatus, sleep } from './retry.js';
import type {
  HttpClientConfig,
  HttpLogger,
  HttpRequestInfo,
  RequestInterceptor,
  ResponseInterceptor,
  RetryInterceptor,
} from './http-types.js';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_BASE_DELAY_MS = 500;

/**
 * Nexon Open API 전용 HTTP 클라이언트.
 *
 * - 네이티브 `fetch` 사용 (Node.js 18+)
 * - `AbortSignal.timeout()` 기반 타임아웃
 * - 429/503 응답에 대한 지수 백오프 자동 재시도
 * - Request / Response / Retry 인터셉터 지원
 *
 * @internal SDK 내부용. 직접 생성하지 말고 `NexonClient`를 사용하세요.
 */
export class HttpClient {
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly retryBaseDelayMs: number;
  private readonly responseValidation: boolean;
  private readonly logger: Partial<HttpLogger> | undefined;

  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly retryInterceptors: RetryInterceptor[] = [];

  constructor(config: HttpClientConfig) {
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryBaseDelayMs = config.retryBaseDelayMs ?? DEFAULT_RETRY_BASE_DELAY_MS;
    this.responseValidation = config.responseValidation ?? false;

    if (config.debug === true) {
      this.logger = defaultDebugLogger;
    } else {
      this.logger = config.logger;
    }
  }

  /**
   * Request 인터셉터를 추가한다.
   * 요청이 전송되기 전에 순서대로 실행됩니다.
   */
  addRequestInterceptor(fn: RequestInterceptor): void {
    this.requestInterceptors.push(fn);
  }

  /**
   * Response 인터셉터를 추가한다.
   * 응답 수신 후 순서대로 실행됩니다.
   */
  addResponseInterceptor(fn: ResponseInterceptor): void {
    this.responseInterceptors.push(fn);
  }

  /**
   * Retry 인터셉터를 추가한다.
   * 재시도 직전에 순서대로 실행됩니다.
   */
  addRetryInterceptor(fn: RetryInterceptor): void {
    this.retryInterceptors.push(fn);
  }

  /**
   * GET 요청을 수행하고 JSON 응답을 반환한다.
   *
   * @param url - 완전한 URL 문자열
   * @param params - URL 쿼리 파라미터
   * @param shape - 응답 shape descriptor (`responseValidation: true` 시에만 사용)
   */
  async get<T>(
    url: string,
    params?: Record<string, string | number | boolean | undefined>,
    shape?: ShapeDescriptor,
  ): Promise<T> {
    const cleanedParams = cleanParams(params);
    const fullUrl = buildUrl(url, cleanedParams);

    let requestInfo: HttpRequestInfo = {
      url: fullUrl,
      method: 'GET',
      headers: {
        'x-nxopen-api-key': this.apiKey,
        Accept: 'application/json',
      },
      params: cleanedParams,
    };

    // 요청 인터셉터 실행
    for (const interceptor of this.requestInterceptors) {
      requestInfo = await interceptor(requestInfo);
    }

    this.logger?.onRequest?.(requestInfo);

    return this.executeWithRetry<T>(requestInfo, shape, 0);
  }

  private async executeWithRetry<T>(
    requestInfo: HttpRequestInfo,
    shape: ShapeDescriptor | undefined,
    attempt: number,
  ): Promise<T> {
    const startTime = Date.now();

    let response: Response;
    try {
      response = await fetch(requestInfo.url, {
        method: requestInfo.method,
        headers: requestInfo.headers,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (err) {
      // 타임아웃 또는 네트워크 에러
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new NexonError(
          `요청 타임아웃 (${this.timeoutMs}ms)\n→ timeoutMs 옵션을 늘리거나 네트워크를 확인하세요.`,
          { cause: err },
        );
      }
      throw new NexonError(`네트워크 오류: ${err instanceof Error ? err.message : String(err)}`, {
        cause: err,
      });
    }

    const durationMs = Date.now() - startTime;
    const responseInfo = {
      request: requestInfo,
      status: response.status,
      durationMs,
    };

    // 응답 인터셉터 실행
    for (const interceptor of this.responseInterceptors) {
      await interceptor(responseInfo);
    }

    this.logger?.onResponse?.(responseInfo);

    // 성공 응답
    if (response.ok) {
      const data: unknown = await response.json();

      if (this.responseValidation && shape) {
        const mismatch = validateShape(requestInfo.url, data, shape);
        if (mismatch) {
          this.logger?.onResponseShapeMismatch?.(mismatch);
        }
      }

      return data as T;
    }

    // 에러 응답 파싱
    let payload: NexonErrorPayload | undefined;
    try {
      payload = (await response.json()) as NexonErrorPayload;
    } catch {
      // 응답 바디가 JSON이 아닌 경우 무시
    }

    // Retry-After 헤더 파싱
    const retryAfterHeader = response.headers.get('Retry-After');
    const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : undefined;

    // 재시도 가능한 경우
    if (isRetryableStatus(response.status) && attempt < this.maxRetries) {
      const waitMs = retryAfterMs ?? computeRetryDelay(attempt + 1, this.retryBaseDelayMs);
      const retryInfo = {
        request: requestInfo,
        attempt: attempt + 1,
        maxRetries: this.maxRetries,
        waitMs,
        reason: `HTTP ${response.status}`,
      };

      for (const interceptor of this.retryInterceptors) {
        await interceptor(retryInfo);
      }

      this.logger?.onRetry?.(retryInfo);

      await sleep(waitMs);
      return this.executeWithRetry<T>(requestInfo, shape, attempt + 1);
    }

    throw classifyError(response.status, payload, retryAfterMs);
  }
}

/** URL에 쿼리 파라미터를 붙인다. */
function buildUrl(baseUrl: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return baseUrl;
  const qs = new URLSearchParams(params).toString();
  return `${baseUrl}?${qs}`;
}

/** undefined 값을 제거하고 모든 값을 문자열로 변환한다. */
function cleanParams(
  params?: Record<string, string | number | boolean | undefined>,
): Record<string, string> | undefined {
  if (!params) return undefined;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result[key] = String(value);
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

/** `debug: true` 시 사용하는 기본 콘솔 로거 */
const defaultDebugLogger: Partial<HttpLogger> = {
  onRequest: (info) => {
    console.debug(`[nexon-sdk] → ${info.method} ${info.url}`);
  },
  onResponse: (info) => {
    console.debug(`[nexon-sdk] ← ${info.status} (${info.durationMs}ms)`);
  },
  onRetry: (info) => {
    console.debug(
      `[nexon-sdk] ↩ retry #${info.attempt}/${info.maxRetries} after ${info.waitMs}ms (${info.reason})`,
    );
  },
  onResponseShapeMismatch: (mismatch: ShapeMismatch) => {
    const parts: string[] = [];
    if (mismatch.missingKeys.length > 0) {
      parts.push(`missing keys: [${mismatch.missingKeys.join(', ')}]`);
    }
    if (mismatch.unexpectedKeys.length > 0) {
      parts.push(`unexpected keys: [${mismatch.unexpectedKeys.join(', ')}]`);
    }
    if (mismatch.typeMismatches.length > 0) {
      parts.push(
        `type mismatches: ${mismatch.typeMismatches
          .map((m) => `${m.key}: expected ${m.expected}, got ${m.actual}`)
          .join('; ')}`,
      );
    }
    console.warn(
      `[nexon-sdk] ⚠ Response shape mismatch for ${mismatch.url}\n  ${parts.join('\n  ')}`,
    );
  },
};
