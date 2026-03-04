import { NexonError } from './NexonError.js';
import { NEXON_ERROR_CODES } from './error-codes.js';

/**
 * 캐릭터/길드를 찾을 수 없음 (HTTP 400, OPENAPI00003).
 *
 * 캐릭터명이나 길드명이 잘못되었거나, 해당 서버에 존재하지 않습니다.
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonNotFoundError) {
 *     console.log('캐릭터를 찾을 수 없습니다. 이름을 다시 확인해주세요.');
 *   }
 * }
 * ```
 */
export class NexonNotFoundError extends NexonError {
  constructor(message: string) {
    super(message, {
      status: 400,
      code: NEXON_ERROR_CODES.NOT_FOUND,
    });
    this.name = 'NexonNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
