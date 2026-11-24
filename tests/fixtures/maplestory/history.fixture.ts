import type {
  CubeHistory,
  PotentialHistory,
  SoulPotentialHistory,
  StarforceHistory,
} from '../../../src/games/maplestory/history/types.js';

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
      starforce_event_list: [],
    },
  ],
};

/** GET /maplestory/v1/history/potential — 포털 스펙 스키마로 합성한 응답 */
export const historyPotentialFixture: PotentialHistory = {
  count: 1,
  next_cursor: 'next_cursor_abc123',
  potential_history: [
    {
      id: 'history_0001',
      character_name: '테스트캐릭터',
      date_create: '2024-01-25T17:28:31.000+09:00',
      potential_type: '샘플',
      item_upgrade_result: '레전드리',
      miracle_time_flag: '1',
      item_equipment_part: '샘플',
      item_level: 10,
      target_item: '샘플 잠재능력 재설정 장비',
      potential_option_grade: '레전드리',
      additional_potential_option_grade: '레전드리',
      upgrade_guarantee: false,
      upgrade_guarantee_count: 1,
      before_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      before_additional_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      after_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      after_additional_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
    },
  ],
};

/** GET /maplestory/v1/history/cube — 포털 스펙 스키마로 합성한 응답 */
export const historyCubeFixture: CubeHistory = {
  count: 1,
  next_cursor: 'next_cursor_abc123',
  cube_history: [
    {
      id: 'history_0001',
      character_name: '테스트캐릭터',
      date_create: '2023-12-21T17:28:31.000+09:00',
      cube_type: '샘플',
      item_upgrade_result: '레전드리',
      miracle_time_flag: '1',
      item_equipment_part: '샘플',
      item_level: 10,
      target_item: '샘플 큐브 및 특수 재화 사용한 장비',
      potential_option_grade: '레전드리',
      additional_potential_option_grade: '레전드리',
      upgrade_guarantee: false,
      upgrade_guarantee_count: 1,
      before_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      before_additional_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      after_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      after_additional_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
    },
  ],
};

/** GET /maplestory/v1/history/soul-potential — 포털 스펙 스키마로 합성한 응답 */
export const historySoulPotentialFixture: SoulPotentialHistory = {
  count: 1,
  next_cursor: 'next_cursor_abc123',
  soul_potential_history: [
    {
      id: 'history_0001',
      character_name: '테스트캐릭터',
      date_create: '2024-01-25T17:28:31.000+09:00',
      item_upgrade_result: '레전드리',
      miracle_time_flag: '1',
      soul_potential_amplified_grade: 1,
      target_item: '샘플 소울 잠재능력 재설정 장비',
      soul_potential_grade: '레전드리',
      upgrade_guarantee: false,
      upgrade_guarantee_count: 1,
      before_soul_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
      after_soul_potential_option: [
        {
          value: '10',
          grade: '레전드리',
        },
      ],
    },
  ],
};

/** 마지막 페이지 응답 (next_cursor가 null, 결과 없음) */
export const historySoulPotentialLastPageFixture: SoulPotentialHistory = {
  count: 0,
  next_cursor: null,
  soul_potential_history: [],
};
