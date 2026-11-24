import type { TWUnionRaider } from '../../../src/games/maplestory-tw/union/types.js';

const raiderPreset = {
  union_raider_stat: ['1'],
  union_occupied_stat: ['1'],
  union_inner_stat: [
    {
      stat_field_id: '0',
      stat_field_effect: 'stat field effect',
    },
  ],
  union_block: [
    {
      block_type: 'Thief',
      block_class: 'Night Lord',
      block_level: '275',
      block_control_point: {
        x: 1,
        y: 1,
      },
      block_position: null,
    },
  ],
};

export const twUnionRaiderFixture: TWUnionRaider = {
  date: '2025-10-15T00:00+08:00',
  union_raider_stat: ['1'],
  union_occupied_stat: ['1'],
  union_inner_stat: [
    {
      stat_field_id: '0',
      stat_field_effect: 'stat field effect',
    },
  ],
  union_block: [
    {
      block_type: 'Thief',
      block_class: 'Night Lord',
      block_level: '275',
      block_control_point: {
        x: 1,
        y: 1,
      },
      block_position: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 1,
          y: 0,
        },
      ],
    },
  ],
  use_preset_no: 1,
  union_raider_preset_1: raiderPreset,
  union_raider_preset_2: raiderPreset,
  union_raider_preset_3: null,
  union_raider_preset_4: null,
  union_raider_preset_5: null,
};
