import type {
  Union,
  UnionArtifact,
  UnionChampion,
  UnionRaider,
} from '../../../src/games/maplestory/union/types.js';

export const unionFixture: Union = {
  date: '2024-01-15T00:00+09:00',
  union_level: 8500,
  union_grade: '그랜드 마스터 유니온 2',
  union_artifact_level: 10,
  union_artifact_exp: 500,
  union_artifact_point: 30,
};

/** GET /maplestory/v1/user/union-raider — 포털 스펙 스키마로 합성한 응답 */
export const unionRaiderFixture: UnionRaider = {
  date: '2023-12-21T00:00+09:00',
  union_raider_stat: ['공격력 +10'],
  union_state_stat: ['공격력 +10'],
  union_state_stat_preset: [
    {
      preset_no: 1,
      union_state_stat: ['공격력 +10'],
    },
  ],
  union_max_point: 1,
  union_occupied_stat: ['공격력 +10'],
  union_inner_stat: [
    {
      stat_field_id: '10',
      stat_field_effect: '공격력 +10',
    },
  ],
  union_block: [
    {
      block_type: '샘플',
      block_class: '아크메이지(불,독)',
      block_level: '10',
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
    union_raider_stat: ['공격력 +10'],
    union_occupied_stat: ['공격력 +10'],
    union_inner_stat: [
      {
        stat_field_id: '10',
        stat_field_effect: '공격력 +10',
      },
    ],
    union_block: [
      {
        block_type: '샘플',
        block_class: '아크메이지(불,독)',
        block_level: '10',
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
  union_raider_preset_2: {
    union_raider_stat: ['공격력 +10'],
    union_occupied_stat: ['공격력 +10'],
    union_inner_stat: [
      {
        stat_field_id: '10',
        stat_field_effect: '공격력 +10',
      },
    ],
    union_block: [
      {
        block_type: '샘플',
        block_class: '아크메이지(불,독)',
        block_level: '10',
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
  union_raider_preset_3: {
    union_raider_stat: ['공격력 +10'],
    union_occupied_stat: ['공격력 +10'],
    union_inner_stat: [
      {
        stat_field_id: '10',
        stat_field_effect: '공격력 +10',
      },
    ],
    union_block: [
      {
        block_type: '샘플',
        block_class: '아크메이지(불,독)',
        block_level: '10',
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
  union_raider_preset_4: {
    union_raider_stat: ['공격력 +10'],
    union_occupied_stat: ['공격력 +10'],
    union_inner_stat: [
      {
        stat_field_id: '10',
        stat_field_effect: '공격력 +10',
      },
    ],
    union_block: [
      {
        block_type: '샘플',
        block_class: '아크메이지(불,독)',
        block_level: '10',
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
  union_raider_preset_5: {
    union_raider_stat: ['공격력 +10'],
    union_occupied_stat: ['공격력 +10'],
    union_inner_stat: [
      {
        stat_field_id: '10',
        stat_field_effect: '공격력 +10',
      },
    ],
    union_block: [
      {
        block_type: '샘플',
        block_class: '아크메이지(불,독)',
        block_level: '10',
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
};

/** GET /maplestory/v1/user/union-artifact — 포털 스펙 스키마로 합성한 응답 */
export const unionArtifactFixture: UnionArtifact = {
  date: '2023-12-21T00:00+09:00',
  union_artifact_effect: [
    {
      name: '샘플 아티팩트 효과',
      level: 10,
    },
  ],
  union_artifact_crystal: [
    {
      name: '샘플 아티팩트 크리스탈',
      validity_flag: '1',
      date_expire: '2023-12-21T17:28+09:00',
      level: 10,
      crystal_option_name_1: '샘플 아티팩트 크리스탈 첫 번째 옵션',
      crystal_option_name_2: '샘플 아티팩트 크리스탈 두 번째 옵션',
      crystal_option_name_3: '샘플 아티팩트 크리스탈 세 번째 옵션',
    },
  ],
  union_artifact_remain_ap: 1,
};

/** GET /maplestory/v1/user/union-champion — 포털 스펙 스키마로 합성한 응답 */
export const unionChampionFixture: UnionChampion = {
  date: '2023-12-21T00:00+09:00',
  union_champion: [
    {
      champion_name: '샘플 유니온 챔피언 캐릭터',
      champion_slot: 1,
      champion_grade: '레전드리',
      champion_class: '아크메이지(불,독)',
      champion_badge_info: [
        {
          stat: '공격력 +10',
        },
      ],
    },
  ],
  champion_badge_total_info: [
    {
      stat: '공격력 +10',
    },
  ],
};
