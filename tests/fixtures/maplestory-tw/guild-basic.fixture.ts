import type { TWGuildBasic } from '../../../src/games/maplestory-tw/guild/types.js';

export const twGuildBasicFixture: TWGuildBasic = {
  date: '2025-10-15T00:00+08:00',
  world_name: '艾麗亞',
  guild_name: 'FixtureGuild',
  guild_level: 1,
  guild_fame: 1,
  guild_point: 1,
  guild_master_name: 'FixtureCharacter',
  guild_member_count: 1,
  guild_member: ['FixtureCharacter'],
  guild_skill: [
    {
      skill_name: 'Fixture skill',
      skill_description: 'skill description',
      skill_level: 1,
      skill_effect: 'skill effect',
      skill_icon: 'https://example.com/fixture.png',
    },
  ],
  guild_noblesse_skill: [
    {
      skill_name: 'Fixture skill',
      skill_description: 'skill description',
      skill_level: 1,
      skill_effect: 'skill effect',
      skill_icon: 'https://example.com/fixture.png',
    },
  ],
};
