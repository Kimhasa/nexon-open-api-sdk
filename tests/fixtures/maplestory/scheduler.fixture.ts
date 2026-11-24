import type { SchedulerCharacterState } from '../../../src/games/maplestory/scheduler/types.js';

/** GET /maplestory/v1/scheduler/character-state — 포털 스펙 스키마로 합성한 응답 */
export const schedulerCharacterStateFixture: SchedulerCharacterState = {
  date: '2026-11-23',
  character_name: '테스트캐릭터',
  world_name: '스카니아',
  character_level: 10,
  character_class: '아크메이지(불,독)',
  daily_contents: [
    {
      content_name: '샘플 콘텐츠/퀘스트',
      type: 'contents',
      registration_flag: 'true',
      now_count: 1,
      max_count: 1,
      quest_state: '2',
    },
  ],
  weekly_contents: [
    {
      content_name: '샘플 콘텐츠',
      type: 'contents',
      registration_flag: 'true',
      now_count: 1,
      max_count: 1,
      quest_state: '2',
    },
  ],
  boss_contents: [
    {
      content_name: '샘플 보스',
      difficulty: '하드',
      cycle: '주간',
      list_order_no: 1,
      registration_flag: 'true',
      complete_flag: 'true',
    },
  ],
  weekly_boss_clear_count: 1,
  weekly_boss_clear_limit_count: 1,
};
