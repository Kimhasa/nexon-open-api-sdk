import type { SuddenAttackOuid } from './types.js';

export function validateOuid(ouid: SuddenAttackOuid): void {
  if (typeof ouid !== 'string' || ouid.trim() === '') {
    throw new TypeError(
      'ouid가 비어 있습니다. client.suddenAttack.getOuid(닉네임)으로 계정 식별자를 조회하세요.',
    );
  }
}
