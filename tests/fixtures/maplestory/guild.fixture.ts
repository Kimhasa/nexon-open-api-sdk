import type { GuildBasic } from '../../../src/games/maplestory/guild/types.js';

export const guildIdFixture = {
  oguild_id: 'guild_abc123def456',
};

export const guildBasicFixture: GuildBasic = {
  date: '2024-01-15T00:00+09:00',
  world_name: '스카니아',
  guild_name: '테스트길드',
  guild_level: 25,
  guild_fame: 150000,
  guild_point: 5000,
  guild_master_name: '길드마스터',
  guild_member_count: 150,
  guild_member: ['길드마스터', '부마스터1', '멤버1'],
  guild_skill: [
    {
      skill_name: '길드 스킬 1',
      skill_description: '길드 스킬 설명',
      skill_level: 10,
      skill_effect: '경험치 획득량 30% 증가',
      skill_icon: 'https://example.com/icon.png',
    },
  ],
  guild_noblesse_skill: [],
  guild_mark: null,
  guild_mark_custom: null,
};
