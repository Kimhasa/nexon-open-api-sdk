import type { Brand } from '../../core/types/branded.js';

/** `getOuid`로 조회한 서든어택 계정 식별자. */
export type SuddenAttackOuid = Brand<string, 'SuddenAttackOuid'>;

export interface SuddenAttackOuidResponse {
  /** 계정 식별자 */
  readonly ouid: SuddenAttackOuid;
}
