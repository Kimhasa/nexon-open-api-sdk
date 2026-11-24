import type {
  MUnion,
  MUnionRaider,
  MUnionStat,
} from '../../../src/games/maplestory-m/union/types.js';

export const mUnionFixture: MUnion = {
  union_level: 5000,
  union_grade: '그랜드 마스터 유니온 1',
  union_level_total_option: '공격력/마력 10 증가',
  union_grade_icon: 'https://example.com/union-grade.png',
};

export const mUnionRaiderFixture: MUnionRaider = {
  use_union_raider_option: [
    {
      option_name: '경험치 획득량',
      option_value: '5%',
    },
  ],
};

export const mUnionStatFixture: MUnionStat = {
  use_preset_no: 1,
  use_union_stat: [
    {
      stat_name: '공격력',
      stat_point: 1,
      stat_value: '10%',
    },
  ],
  union_stat_preset: [
    {
      preset_no: 1,
      union_stat: [
        {
          stat_name: '공격력',
          stat_point: 1,
          stat_value: '10%',
        },
      ],
    },
  ],
};
