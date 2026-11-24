import type { MGuildBasic } from '../../../src/games/maplestory-m/guild/types.js';

export const mGuildIdFixture = {
  oguild_id: 'guild-test-id-maplestorym-001',
};

export const mGuildBasicFixture: MGuildBasic = {
  world_name: '스카니아',
  guild_name: '테스트길드M',
  guild_level: 25,
  world_create_date: '2024-01-01T00:00+09:00',
  guild_keyword: ['친목'],
  guild_mark_icon: 'https://example.com/guild-mark.png',
  guild_master_name: '길드마스터',
  guild_member_count: 1,
  guild_member: [
    {
      character_name: '길드마스터',
      character_level: 250,
      guild_activity: 100,
      guild_personal_skill: [],
    },
  ],
  guild_building: [],
  guild_skill: [
    {
      skill_name: '길드의 축복',
      skill_level: 10,
      skill_option: '공격력/마력 30 증가',
      skill_icon: 'https://open.api.nexon.com/static/maplestorym/Skill/guild_blessing.png',
    },
  ],
  guild_ability: [],
};
