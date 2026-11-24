import type {
  SEAUnionRaider,
  SEAUnionArtifact,
  SEAUnionChampion,
} from '../../../src/games/maplestory-sea/union/types.js';

// Synthetic responses based on the portal schemas and examples.

export const seaUnionRaiderFixture: SEAUnionRaider = {
  date: '2025-04-21T00:00+08:00',
  union_raider_stat: ['union raider stat'],
  union_occupied_stat: ['union occupied stat'],
  union_inner_stat: [
    {
      stat_field_id: 'stat field id',
      stat_field_effect: 'stat field effect',
    },
  ],
  union_block: [
    {
      block_type: 'block type',
      block_class: null,
      block_level: 'block level',
      block_control_point: {
        x: 1,
        y: 1,
      },
      block_position: [
        {
          x: 1,
          y: 1,
        },
      ],
    },
  ],
  use_preset_no: 1,
  union_raider_preset_1: {
    union_raider_stat: ['union raider stat'],
    union_occupied_stat: ['union occupied stat'],
    union_inner_stat: [
      {
        stat_field_id: 'stat field id',
        stat_field_effect: 'stat field effect',
      },
    ],
    union_block: [
      {
        block_type: 'block type',
        block_class: null,
        block_level: 'block level',
        block_control_point: {
          x: 1,
          y: 1,
        },
        block_position: [
          {
            x: 1,
            y: 1,
          },
        ],
      },
    ],
  },
  union_raider_preset_2: null,
  union_raider_preset_3: null,
  union_raider_preset_4: null,
  union_raider_preset_5: null,
};

export const seaUnionArtifactFixture: SEAUnionArtifact = {
  date: '2025-04-21T00:00+08:00',
  union_artifact_effect: [
    {
      name: 'name',
      level: 1,
    },
  ],
  union_artifact_crystal: [
    {
      name: 'name',
      validity_flag: '0',
      date_expire: null,
      level: 1,
      crystal_option_name_1: 'crystal option name 1',
      crystal_option_name_2: 'crystal option name 2',
      crystal_option_name_3: 'crystal option name 3',
    },
  ],
  union_artifact_remain_ap: null,
};

export const SEA_UNION_CHAMPION_DATE = '2025-12-18';

export const seaUnionChampionFixture: SEAUnionChampion = {
  date: `${SEA_UNION_CHAMPION_DATE}T00:00+08:00`,
  union_champion: [
    {
      champion_name: 'ExampleChampion',
      champion_slot: 1,
      champion_grade: 'champion grade',
      champion_class: 'champion class',
      champion_badge_info: [
        {
          stat: 'stat',
        },
      ],
    },
  ],
  champion_badge_total_info: [
    {
      stat: 'stat',
    },
  ],
};
