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

export const twCharacterHexaMatrixStatFixture: TWCharacterHexaMatrixStat = {
  date: '2025-10-15T00:00+08:00',
  character_class: 'Night Lord',
  character_hexa_stat_core: [hexaStatCore],
  character_hexa_stat_core_2: [hexaStatCore],
  character_hexa_stat_core_3: [hexaStatCore],
  preset_hexa_stat_core: [hexaStatCore],
  preset_hexa_stat_core_2: [hexaStatCore],
  preset_hexa_stat_core_3: [hexaStatCore],
};
