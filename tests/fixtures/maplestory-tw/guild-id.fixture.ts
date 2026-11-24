import type { GuildId } from '../../../src/games/_base/maple-base-types.js';
import type { TWGuildIdResponse } from '../../../src/games/maplestory-tw/guild/types.js';

// satisfies: 테스트에서 길드 번호를 null 이 아닌 GuildId 로 쓰기 위해 리터럴 타입을 유지한다
export const twGuildIdResponseFixture = {
  oguild_id: 'tw-test-guild-id' as GuildId,
} satisfies TWGuildIdResponse;
