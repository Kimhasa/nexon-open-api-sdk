import type { TWCharacterFamiliar } from '../../../src/games/maplestory-tw/character/types.js';

export const twCharacterFamiliarFixture: TWCharacterFamiliar = {
  date: '2026-06-22T00:00+08:00',
  familiar_link_slot: [
    {
      slot_id: '1',
      familiar_name: 'Fixture Familiar',
      active_flag: 'true',
      expire_date: '2026-12-31T00:00+08:00',
    },
    {
      slot_id: '2',
      familiar_name: null,
      active_flag: 'false',
      expire_date: '2026-12-31T00:00+08:00',
    },
  ],
  familiar_info: [
    {
      familiar_name: 'Fixture Familiar',
      familiar_nickname: 'Fixture Familiar',
      familiar_special_flag: 'false',
      familiar_state: 'Active',
      familiar_level: 1,
      familiar_exp: 1,
      skill_name: 'Fixture skill',
      option_level: 1,
      option: [
        {
          option_no: 1,
          option_name: 'Fixture option',
          option_value: 'option value',
        },
      ],
      familiar_grade: 'Epic',
      look_name: 'Fixture Familiar',
      summoned_flag: 'true',
      slot_id: '1',
    },
  ],
};
