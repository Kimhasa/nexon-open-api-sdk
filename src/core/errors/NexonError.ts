import type { NexonErrorCode } from './error-codes.js';

/** Nexon Open API 오류 응답 페이로드 */
export interface NexonErrorPayload {
  readonly error: {
    readonly name: NexonErrorCode;
    readonly message: string;
  };
}

/**
 * Nexon Open API SDK의 기반 에러 클래스.
 * 모든 SDK 에러는 이 클래스를 상속합니다.
 *
 * @example
 * ```ts
 * try {
 *   const basic = await client.maplestory.character.getBasic({ ocid });
 * } catch (err) {
 *   if (err instanceof NexonError) {
 *     console.log(err.code);    // 'OPENAPI00007'
 *     console.log(err.status);  // 429
 *   }
 * }
 * ```
 */
export class NexonError extends Error {
  /**
   * HTTP 상태 코드.
   * 네트워크/타임아웃 오류 등 HTTP 응답이 없는 경우 `undefined`.
   */
  readonly status: number | undefined;

  /** Nexon Open API 에러 코드 (예: `'OPENAPI00007'`) */
  readonly code: NexonErrorCode | undefined;

  /** Nexon Open API 에러 원문 메시지 */
  readonly nexonMessage: string | undefined;

  constructor(
    message: string,
    {
      status,
      code,
      nexonMessage,
      cause,
    }: {
      status?: number | undefined;
      code?: NexonErrorCode | undefined;
      nexonMessage?: string | undefined;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause });
    this.name = 'NexonError';
    this.status = status;
    this.code = code;
    this.nexonMessage = nexonMessage;

    // Error 서브클래스에서 instanceof가 정상 동작하도록 prototype 복원
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
