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
  guild_master_name: '테스트길드장M',
  guild_member_count: 1,
  guild_member: [
    {
      character_name: '테스트길드장M',
      character_level: 250,
      guild_activity: 100,
      guild_personal_skill: [
        {
          skill_name: '테스트 개인 스킬',
          skill_level: 5,
          skill_option: '경험치 획득량 5% 증가',
          skill_icon: 'https://example.com/guild-personal-skill.png',
        },
      ],
    },
  ],
  guild_building: [{ building_name: '테스트 시설물', building_level: 3 }],
  guild_skill: [
    {
      skill_name: '길드의 축복',
      skill_level: 10,
      skill_option: '공격력/마력 30 증가',
      skill_icon: 'https://example.com/guild-blessing.png',
    },
  ],
  guild_ability: [
    {
      ability_no: 1,
      ability_name: '테스트 길드 어빌리티',
      ability_level: 3,
      ability_option: '물리 공격력 3% 증가',
      ability_icon: 'https://example.com/guild-ability.png',
    },
  ],
};
