import type {
  MLevelRanking,
  MDojangRanking,
  MRootOfTimeRanking,
  MUnionRanking,
  MCombatPowerRanking,
  MKerningMTowerRanking,
  MAchievementRanking,
  MSharenianBattlefieldRanking,
  MSharenianWaterwayRanking,
} from '../../../src/games/maplestory-m/ranking/types.js';

export const mLevelRankingFixture: MLevelRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '랭커1M',
      world_name: '스카니아',
      character_class: '히어로',
      character_level: 300,
      guild_name: '테스트길드M',
      guild_mark_icon: 'https://example.com/guild-mark.png',
    },
  ],
};

export const mDojangRankingFixture: MDojangRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '테스트캐릭터M',
      world_name: '스카니아',
      character_class: '히어로',
      character_level: 250,
      dojang_floor: 50,
      guild_name: '테스트길드M',
    },
  ],
};

export const mRootOfTimeRankingFixture: MRootOfTimeRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '테스트캐릭터M',
      world_name: '스카니아',
      character_class: '히어로',
      character_level: 250,
      max_damage: 12345678,
      guild_name: '테스트길드M',
    },
  ],
};

export const mUnionRankingFixture: MUnionRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '테스트캐릭터M',
      world_name: '스카니아',
      character_class: '히어로',
      union_grade: '마스터 유니온 1',
      union_grade_icon: 'https://example.com/union-grade-icon.png',
      union_level: 5000,
      guild_name: '테스트길드M',
    },
  ],
};

export const mCombatPowerRankingFixture: MCombatPowerRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '테스트캐릭터M',
      world_name: '스카니아',
      character_class: '히어로',
      character_level: 250,
      character_combat_power: 87654321,
      guild_name: '테스트길드M',
    },
  ],
};

export const mKerningMTowerRankingFixture: MKerningMTowerRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '테스트캐릭터M',
      world_name: '스카니아',
      character_class: '히어로',
      character_level: 250,
      tower_floor: 35,
      guild_name: '테스트길드M',
    },
  ],
};

export const mAchievementRankingFixture: MAchievementRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      character_name: '테스트캐릭터M',
      world_name: '스카니아',
      achievement_score: 12000,
      achievement_grade_name: '테스트 업적 등급',
      achievement_grade_icon: 'https://example.com/achievement-grade-icon.png',
      main_honor_badge: [
        {
          badge_no: 1,
          badge_name: '테스트 대표 명예 배지 명',
          badge_option: '공격력 10 증가',
          badge_icon: 'https://example.com/badge-icon.png',
        },
      ],
    },
  ],
};

export const mSharenianBattlefieldRankingFixture: MSharenianBattlefieldRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      guild_name: '테스트길드M',
      world_name: '스카니아',
      guild_master_name: '테스트길드장M',
      guild_mark_icon: 'https://example.com/guild-mark-icon.png',
      season_score: '5000',
      grade_icon: 'https://example.com/ranking-grade.png',
    },
  ],
};

export const mSharenianWaterwayRankingFixture: MSharenianWaterwayRanking = {
  ranking: [
    {
      date: '2024-01-01T00:00+09:00',
      ranking: 1,
      world_ranking: 1,
      guild_name: '테스트길드M',
      world_name: '스카니아',
      guild_master_name: '테스트길드장M',
      guild_mark_icon: 'https://example.com/guild-mark-icon.png',
      season_score: '7500',
      grade_icon: 'https://example.com/ranking-grade.png',
    },
  ],
};
