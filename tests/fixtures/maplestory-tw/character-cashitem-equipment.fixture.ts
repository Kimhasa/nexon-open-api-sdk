import type { TWCharacterCashItemEquipment } from '../../../src/games/maplestory-tw/character/types.js';

const cashItem = {
  cash_item_equipment_part: 'cash item equipment part',
  cash_item_equipment_slot: '1',
  cash_item_name: 'Fixture cash item',
  cash_item_icon: 'https://example.com/fixture.png',
  cash_item_description: null,
  cash_item_option: [
    {
      option_type: 'option type',
      option_value: 'option value',
    },
  ],
  date_expire: '2025-10-15T17:28+08:00',
  date_option_expire: '2025-10-15T17:00+08:00',
  cash_item_label: null,
  cash_item_coloring_prism: {
    color_range: 'color range',
    hue: 1,
    saturation: 1,
    value: 1,
  },
  item_gender: null,
  skills: ['skills'],
  skill_info: [
    {
      skill_name: 'Fixture skill',
      skill_level: 1,
    },
  ],
  freestyle_flag: '0',
};

export const twCharacterCashItemEquipmentFixture: TWCharacterCashItemEquipment = {
  date: '2025-10-15T00:00+08:00',
  character_gender: 'Male',
  character_class: 'Night Lord',
  character_look_mode: '0',
  preset_no: null,
  cash_item_equipment_base: [cashItem],
  cash_item_equipment_preset_1: [cashItem],
  cash_item_equipment_preset_2: [cashItem],
  cash_item_equipment_preset_3: [cashItem],
  additional_cash_item_equipment_base: [cashItem],
  additional_cash_item_equipment_preset_1: [cashItem],
  additional_cash_item_equipment_preset_2: [cashItem],
  additional_cash_item_equipment_preset_3: [cashItem],
};
