import type { SEAGuildBasic } from '../../../src/games/maplestory-sea/guild/types.js';

export const seaGuildIdFixture = {
  oguild_id: 'sea-guild-id-test-1234',
};

export const seaGuildBasicFixture: SEAGuildBasic = {
  date: '2025-04-21T00:00+08:00',
  world_name: 'Aquila',
  guild_name: 'TestGuild',
  guild_level: 25,
  guild_fame: 50000,
  guild_point: 10000,
  guild_master_name: 'BubbIeLord',
  guild_member_count: 150,
  guild_member: ['BubbIeLord', 'Member2'],
  guild_skill: [],
  guild_noblesse_skill: [],
};
