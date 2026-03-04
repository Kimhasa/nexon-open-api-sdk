import type { StarforceHistory } from '../../../src/games/maplestory/history/types.js';

export const starforceHistoryFixture: StarforceHistory = {
  count: 1,
  next_cursor: 'next_cursor_abc123',
  starforce_history: [
    {
      id: 'sf_001',
      item_upgrade_result: '성공',
      before_starforce_count: 15,
      after_starforce_count: 16,
      starcatch_result: '성공',
      superior_item_flag: '미적용',
      destroy_defence: '미적용',
      chance_time: '미적용',
      event_field_flag: '미적용',
      upgrade_item: '파프니르 투핸드소드',
      protect_shield: '미적용',
      bonus_stat_upgrade: '미적용',
      character_name: '테스트캐릭터',
      world_name: '스카니아',
      target_item: '파프니르 투핸드소드',
      date_create: '2024-01-15T10:30:00+09:00',
      starforce_event_list: null,
    },
  ],
};
