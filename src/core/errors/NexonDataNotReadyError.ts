import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 조회 가능한 데이터가 아직 준비되지 않음 (HTTP 400).
 *
 * - `OPENAPI00009`: 조회 기간 이전 데이터 (서비스 시작 전 날짜)
 * - `OPENAPI00010`: 당일 데이터가 아직 집계되지 않음 (보통 오전 1~2시 이후 조회 가능)
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonDataNotReadyError) {
 *     // 일 단위 데이터는 KST 기준 익일 오전 1시 이후 조회 가능합니다.
 *   }
 * }
 * ```
 */
export class NexonDataNotReadyError extends NexonError {
  constructor(message: string, { code }: { code: NexonErrorCode }) {
    super(message, { status: 400, code });
    this.name = 'NexonDataNotReadyError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
