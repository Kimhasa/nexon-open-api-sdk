/**
 * 지수 백오프(Exponential Backoff) with jitter 대기 시간 계산.
 *
 * 공식: `base * 2^(attempt - 1)` + random jitter (0~base ms)
 * 최대 대기 시간은 30초로 제한한다.
 *
 * @param attempt - 현재 시도 횟수 (1부터 시작)
 * @param baseDelayMs - 기본 대기 시간 (밀리초)
 */
export function computeRetryDelay(attempt: number, baseDelayMs: number): number {
  const exponential = baseDelayMs * Math.pow(2, attempt - 1);
  const jitter = Math.random() * baseDelayMs;
  const delay = exponential + jitter;
  const MAX_DELAY_MS = 30_000;
  return Math.min(delay, MAX_DELAY_MS);
}

/**
 * 해당 HTTP 상태 코드가 재시도 가능한지 여부를 반환한다.
 *
 * 호출량 초과(429)와 서버 오류(500~599)를 재시도한다.
 */
export function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

/**
 * Promise 기반 sleep 유틸리티.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
