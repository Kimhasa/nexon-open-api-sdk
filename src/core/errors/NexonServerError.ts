import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 넥슨 서버 쪽 문제로 조회하지 못함.
 *
 * - `OPENAPI00001`: 서버 내부 오류
 * - HTTP 5xx 응답 (코드가 없는 경우 포함)
 *
 * 내 코드나 입력의 문제가 아닙니다. 잠시 뒤 다시 조회하세요.
 * HTTP 503은 SDK가 자동으로 다시 시도한 뒤에도 실패했을 때 던집니다.
 *
 * 점검 중(`OPENAPI00010`, `OPENAPI00011`)은 하위 클래스 `NexonMaintenanceError` 로 던지므로,
 * 점검만 따로 안내하려면 그 클래스를 먼저 검사하세요.
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonServerError) {
 *     console.log('넥슨 서버에 문제가 있어요. 잠시 뒤 다시 시도해 주세요.');
 *   }
 * }
 * ```
 */
export class NexonServerError extends NexonError {
  constructor(
    message: string,
    {
      status,
      code,
      nexonMessage,
    }: {
      status: number;
      code?: NexonErrorCode | undefined;
      nexonMessage?: string | undefined;
    },
  ) {
    super(message, { status, code, nexonMessage });
    this.name = 'NexonServerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
