import type { TWCharacterHexaMatrixStat } from '../../../src/games/maplestory-tw/character/types.js';

const hexaStatCore = {
  slot_id: '1',
  main_stat_name: 'Fixture main stat',
  sub_stat_name_1: '1',
  sub_stat_name_2: '1',
  main_stat_level: 1,
  sub_stat_level_1: 1,
  sub_stat_level_2: 1,
  stat_grade: 1,
};

const unassignedPresetCore = {
  ...hexaStatCore,
  main_stat_name: null,
  sub_stat_name_1: null,
  sub_stat_name_2: null,
  main_stat_level: 0,
  sub_stat_level_1: 0,
  sub_stat_level_2: 0,
  stat_grade: 0,
};

export const twCharacterHexaMatrixStatFixture: TWCharacterHexaMatrixStat = {
  date: '2025-10-15T00:00+08:00',
  character_class: null,
  character_hexa_stat_core: [hexaStatCore],
  character_hexa_stat_core_2: null,
  character_hexa_stat_core_3: null,
  preset_hexa_stat_core: [unassignedPresetCore],
  preset_hexa_stat_core_2: [unassignedPresetCore],
  preset_hexa_stat_core_3: null,
};
