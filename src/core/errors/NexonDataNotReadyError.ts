import { NexonError } from './NexonError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 조회한 날짜의 데이터가 아직 준비되지 않음 (HTTP 400).
 *
 * - `OPENAPI00009`: 데이터 준비 중
 *
 * 날짜를 지정해 조회했는데 그 날짜의 데이터가 아직 만들어지지 않았을 때 납니다.
 * 날짜를 하루 전으로 바꾸거나 잠시 뒤 다시 조회하세요.
 * 넥슨 안내 기준으로 메이플스토리의 지난 날짜 데이터는 다음날 오전 2시(KST)부터,
 * 오늘의 랭킹은 오전 9시 30분경부터 조회할 수 있습니다.
 *
 * 게임 점검 중(`OPENAPI00010`)은 이 에러가 아니라 `NexonMaintenanceError` 입니다.
 *
 * @example
 * ```ts
 * } catch (err) {
 *   if (err instanceof NexonDataNotReadyError) {
 *     console.log('아직 데이터가 준비되지 않았어요. 잠시 뒤 다시 시도해 주세요.');
 *   }
 * }
 * ```
 */
export class NexonDataNotReadyError extends NexonError {
  constructor(
    message: string,
    { code, nexonMessage }: { code: NexonErrorCode; nexonMessage?: string | undefined },
  ) {
    super(message, { status: 400, code, nexonMessage });
    this.name = 'NexonDataNotReadyError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
