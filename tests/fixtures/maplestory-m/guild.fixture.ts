import type { MGuildBasic } from '../../../src/games/maplestory-m/guild/types.js';

export const mGuildIdFixture = {
  oguild_id: 'guild-test-id-maplestorym-001',
};

export const mGuildBasicFixture: MGuildBasic = {
  date: '2024-01-01T00:00+09:00',
  world_name: '스카니아',
  guild_name: '테스트길드M',
  guild_level: 25,
  guild_fame: 50000,
  guild_point: 100000,
  guild_master_name: '길드마스터',
  guild_member_count: 30,
  guild_member: ['길드마스터', '멤버1', '멤버2'],
  guild_skill: [
    {
      skill_name: '길드의 축복',
      skill_description: '길드원 공격력/마력 증가',
      skill_level: 10,
      skill_effect: '공격력/마력 30 증가',
      skill_icon: 'https://open.api.nexon.com/static/maplestorym/Skill/guild_blessing.png',
    },
  ],
  guild_noblesse_skill: [],
};
