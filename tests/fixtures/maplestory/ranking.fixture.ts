import type {
  AchievementRanking,
  DojangRanking,
  GuildRanking,
  OverallRanking,
  TheSeedRanking,
  UnionRanking,
} from '../../../src/games/maplestory/ranking/types.js';

export const overallRankingFixture: OverallRanking = {
  ranking: [
    {
      date: '2024-01-15T00:00+09:00',
      ranking: 1,
      character_name: '1위캐릭터',
      world_name: '스카니아',
      class_name: '아크메이지(불,독)',
      sub_class_name: '',
      character_level: 300,
      character_exp: 999999999999,
      character_popularity: 50000,
      character_guildname: '최강길드',
    },
  ],
};

/** GET /maplestory/v1/ranking/union — 포털 스펙 스키마로 합성한 응답 */
export const rankingUnionFixture: UnionRanking = {
  ranking: [
    {
      date: '2023-12-22',
      ranking: 1,
      character_name: '테스트캐릭터',
      world_name: '스카니아',
      class_name: '아크메이지(불,독)',
      sub_class_name: '아크메이지(불,독)',
      union_level: 10,
      union_power: 1,
    },
  ],
};

/** GET /maplestory/v1/ranking/guild — 포털 스펙 스키마로 합성한 응답 */
export const rankingGuildFixture: GuildRanking = {
  ranking: [
    {
      date: '2023-12-22',
      ranking: 1,
      guild_name: '테스트길드',
      world_name: '스카니아',
      guild_level: 10,
      guild_master_name: '테스트캐릭터',
      guild_mark: 'https://open.api.nexon.com/static/maplestory/item/icon/SAMPLE',
      guild_point: 1,
    },
  ],
};

/** GET /maplestory/v1/ranking/dojang — 포털 스펙 스키마로 합성한 응답 */
export const rankingDojangFixture: DojangRanking = {
  ranking: [
    {
      date: '2023-12-22',
      ranking: 1,
      character_name: '테스트캐릭터',
      world_name: '스카니아',
      class_name: '아크메이지(불,독)',
      sub_class_name: '아크메이지(불,독)',
      character_level: 10,
      dojang_floor: 1,
      dojang_time_record: 1,
    },
  ],
};

/** GET /maplestory/v1/ranking/theseed — 포털 스펙 스키마로 합성한 응답 */
export const rankingTheseedFixture: TheSeedRanking = {
  ranking: [
    {
      date: '2023-12-22',
      ranking: 1,
      character_name: '테스트캐릭터',
      world_name: '스카니아',
      class_name: '아크메이지(불,독)',
      sub_class_name: '아크메이지(불,독)',
      character_level: 10,
      theseed_floor: 1,
      theseed_time_record: 1,
    },
  ],
};

/** GET /maplestory/v1/ranking/achievement — 포털 스펙 스키마로 합성한 응답 */
export const rankingAchievementFixture: AchievementRanking = {
  ranking: [
    {
      date: '2023-12-22',
      ranking: 1,
      character_name: '테스트캐릭터',
      world_name: '스카니아',
      class_name: '아크메이지(불,독)',
      sub_class_name: '아크메이지(불,독)',
      trophy_grade: '레전드리',
      trophy_score: 1,
    },
  ],
};
