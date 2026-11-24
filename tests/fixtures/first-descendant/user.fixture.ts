import type { TfdOuid } from '../../../src/games/first-descendant/types.js';
import type {
  TfdUserArcheTuning,
  TfdUserBasic,
  TfdUserDescendant,
  TfdUserExternalComponent,
  TfdUserReactor,
  TfdUserWeapon,
} from '../../../src/games/first-descendant/user/types.js';

// 계정 API는 API 키가 있어야 실응답을 볼 수 있다. 아래 값은 스펙 스키마로 합성한 가상 데이터다.

export const TFD_TEST_OUID = 'a1b2c3d4e5f60718293a4b5c6d7e8f90' as TfdOuid;
export const TFD_TEST_USER_NAME = '테스트계승자#1234';

export const tfdOuidFixture: { ouid: string } = {
  ouid: TFD_TEST_OUID,
};

export const tfdUserBasicFixture: TfdUserBasic = {
  ouid: TFD_TEST_OUID,
  user_name: TFD_TEST_USER_NAME,
  platform_type: 'Pc',
  mastery_rank_level: 24,
  mastery_rank_exp: 1250000,
  title_prefix_id: '300100001',
  title_suffix_id: null,
  os_language: 'ko',
  game_language: 'ko',
  medal_id: '310100001',
  medal_level: 3,
};

export const tfdUserDescendantFixture: TfdUserDescendant = {
  ouid: TFD_TEST_OUID,
  user_name: TFD_TEST_USER_NAME,
  descendant_id: '101000001',
  descendant_slot_id: '1',
  descendant_level: 40,
  module_max_capacity: 85,
  module_capacity: 80,
  energy_activator_use_count: 1,
  module: [
    { module_slot_id: 'Skill 1', module_id: '252011001', module_enchant_level: 0 },
    { module_slot_id: 'Main 1', module_id: '251001001', module_enchant_level: 10 },
  ],
  customizing: [
    {
      customizing_item_slot_id: '1',
      customizing_item_type: 'Body',
      customizing_item_id: '410100001',
      customizing_item_evolution_stage: 3,
      customizing_item_current_evolution_stage: 2,
      paint: [
        {
          customizing_item_slot_id: '1',
          customizing_item_type: 'Paint',
          customizing_item_id: '430100001',
        },
      ],
    },
    {
      customizing_item_slot_id: '2',
      customizing_item_type: 'Head',
      customizing_item_id: '410200001',
      customizing_item_evolution_stage: null,
      customizing_item_current_evolution_stage: null,
      paint: [],
    },
  ],
};

export const tfdUserWeaponFixture: TfdUserWeapon = {
  ouid: TFD_TEST_OUID,
  user_name: TFD_TEST_USER_NAME,
  weapon: [
    {
      module_max_capacity: 80,
      module_capacity: 78,
      energy_activator_use_count: 1,
      weapon_slot_id: '1',
      weapon_id: '211011001',
      weapon_level: 100,
      perk_ability_enchant_level: 4,
      weapon_additional_stat: [
        { additional_stat_name: '총기 치명타 확률', additional_stat_value: '12.5' },
        { additional_stat_name: '약점 배율', additional_stat_value: '0.11' },
      ],
      module: [{ module_slot_id: '1', module_id: '251002001', module_enchant_level: 10 }],
      core_unlock_flag: '1',
      core: [{ core_slot_id: '1', core_option_name: '총기 공격력', core_option_value: '30' }],
    },
    {
      module_max_capacity: null,
      module_capacity: null,
      energy_activator_use_count: null,
      weapon_slot_id: '2',
      weapon_id: '212011001',
      weapon_level: 1,
      perk_ability_enchant_level: null,
      weapon_additional_stat: [],
      module: [],
      core_unlock_flag: '0',
      core: [],
    },
  ],
};

export const tfdUserReactorFixture: TfdUserReactor = {
  ouid: TFD_TEST_OUID,
  user_name: TFD_TEST_USER_NAME,
  reactor_id: '245000001',
  reactor_slot_id: '1',
  reactor_level: 100,
  reactor_additional_stat: [
    { additional_stat_name: '스킬 재사용 대기시간', additional_stat_value: '-0.074' },
    { additional_stat_name: '스킬 지속시간', additional_stat_value: '0.106' },
  ],
  reactor_enchant_level: 2,
};

export const tfdUserExternalComponentFixture: TfdUserExternalComponent = {
  ouid: TFD_TEST_OUID,
  user_name: TFD_TEST_USER_NAME,
  external_component: [
    {
      external_component_slot_id: '1',
      external_component_id: '241001001',
      external_component_level: 100,
      external_component_additional_stat: [
        { additional_stat_name: '최대 체력', additional_stat_value: '593' },
      ],
      core_unlock_flag: '1',
      core: [{ core_slot_id: '1', core_option_name: '방어력', core_option_value: '1200' }],
    },
    {
      external_component_slot_id: '2',
      external_component_id: '241002001',
      external_component_level: 100,
      external_component_additional_stat: [],
      core_unlock_flag: '0',
      core: [],
    },
  ],
};

export const tfdUserArcheTuningFixture: TfdUserArcheTuning = {
  ouid: TFD_TEST_OUID,
  descendant_group_id: '101000001',
  arche_tuning_board_group_id: '1',
  arche_tuning: [
    {
      slot_id: '0',
      arche_tuning_board: [
        {
          arche_tuning_board_id: '1',
          node: [
            { node_id: '10100001', position_row: '10', position_column: '10' },
            { node_id: '10100002', position_row: '9', position_column: '10' },
          ],
        },
      ],
    },
  ],
};
