import { NexonServerError } from './NexonServerError.js';
import type { NexonErrorCode } from './error-codes.js';

/**
 * 점검 중이라 조회할 수 없음.
 *
 * - `OPENAPI00010`: 게임 점검 중
 * - `OPENAPI00011`: 넥슨 Open API 점검 중
 *
 * 게임이 정기·임시 점검에 들어가면 그 게임의 API도 응답하지 않습니다.
 * 코드를 고칠 일은 없고, 점검이 끝난 뒤 다시 조회하면 됩니다.
 * Open API 자체의 점검 공지는 `client.platform.getNoticeList()` 로 확인할 수 있습니다.
 *
 * `status` 에는 서버가 준 HTTP 상태가 그대로 담깁니다.
 *
 * {@link NexonServerError} 를 상속하므로 기존의 `instanceof NexonServerError` 처리에도 걸립니다.
 * 점검만 따로 안내하려면 `NexonMaintenanceError` 를 **먼저** 검사하세요.
 *
 * @example
 * ```ts
 * import { NexonClient, NexonMaintenanceError, NexonServerError } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
 *
 * // 디스코드 봇의 `!정보 캐릭터명` 명령에 답할 문장을 만든다
 * async function replyLevel(characterName: string): Promise<string> {
 *   try {
 *     const ocid = await client.maplestory.getOcid(characterName);
 *     const basic = await client.maplestory.character.getBasic({ ocid });
 *     return `${basic.character_name} Lv.${basic.character_level}`;
 *   } catch (err) {
 *     // NexonServerError 보다 먼저 검사해야 점검 안내가 나간다
 *     if (err instanceof NexonMaintenanceError) {
 *       return '지금은 게임 점검 중이에요. 점검이 끝나면 다시 시도해 주세요.';
 *     }
 *     if (err instanceof NexonServerError) {
 *       return '넥슨 서버에 문제가 있어요. 잠시 뒤 다시 시도해 주세요.';
 *     }
 *     throw err;
 *   }
 * }
 * ```
 */
export class NexonMaintenanceError extends NexonServerError {
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
    this.name = 'NexonMaintenanceError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
