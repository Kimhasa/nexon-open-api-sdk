import type {
  HeroesCharacterBasic,
  HeroesCharacterGuild,
  HeroesCharacterItemEquipment,
  HeroesCharacterStat,
  HeroesCharacterTitle,
  HeroesCharacterTitleEquipment,
} from '../../../src/games/mabinogi-heroes/character/types.js';

// 포털 스펙(specs/openapi/heroes/29.yaml) 스키마로 합성한 값이다. 실 API 응답이 아니다.

export const heroesCharacterBasicFixture: HeroesCharacterBasic = {
  character_name: '테스트영웅',
  character_date_create: '2023-12-14T08:28:35Z',
  access_flag: 'true',
  character_class_name: '리시타',
  character_gender: '남',
  character_exp: 123456789,
  character_level: 120,
  cairde_name: '테스트카르제',
  title_count: 350,
  id_title_count: 12,
  total_title_count: 362,
  title_stat: [
    { stat_name: '힘', stat_value: '420' },
    { stat_name: '민첩', stat_value: '315' },
  ],
  skill_awakening: [{ skill_name: '테스트 스킬', item_name: '각성의 돌: 대미지 증가' }],
  dress_point: {
    total_point: 1500,
    avatar_point: 900,
    back_point: 250,
    tail_point: 150,
    object_point: 200,
  },
};

export const heroesCharacterTitleFixture: HeroesCharacterTitle = {
  title: [
    { title_type: 'title', title_name: '테스트 타이틀' },
    { title_type: 'pattern', title_name: '테스트 문양' },
    // 2023-11-23 이전에 획득한 타이틀은 타입이 조회되지 않는다
    { title_type: null, title_name: '오래된 타이틀' },
  ],
};

export const heroesCharacterTitleEquipmentFixture: HeroesCharacterTitleEquipment = {
  title_equipment: [
    { title_equipment_type_name: '타이틀', title_type: 'title', title_name: '테스트 타이틀' },
    { title_equipment_type_name: '문양', title_type: 'pattern', title_name: '테스트 문양' },
  ],
};

export const heroesCharacterItemEquipmentFixture: HeroesCharacterItemEquipment = {
  item_equipment: [
    {
      item_equipment_page: 'Bag',
      item_equipment_slot_name: '무기',
      item_name: '테스트 듀얼소드',
      item_option: {
        enhancement_level: 15,
        tuning_stat: [{ stat_name: '공격력', stat_value: '120' }],
        ability_name: '테스트 어빌리티',
        prefix_enchant_use_preset_no: 1,
        suffix_enchant_use_preset_no: 1,
        prefix_enchant_preset_1: '용맹한',
        suffix_enchant_preset_1: '심판',
        prefix_enchant_preset_2: '날카로운',
        suffix_enchant_preset_2: '열정',
        power_infusion_use_preset_no: 1,
        power_infusion_preset_1: [{ stat_name: '공격력', stat_value: '50' }],
        power_infusion_preset_2: [{ stat_name: '크리티컬', stat_value: '3' }],
        cash_item_color: null,
        avatar_color_use_preset_no: null,
        avatar_color_preset_1: null,
        avatar_color_preset_2: null,
        avatar_color_preset_3: null,
        avatar_color_preset_4: null,
        avatar_color_preset_5: null,
        avatar_inner_armor_color_preset_1: null,
        avatar_inner_armor_color_preset_2: null,
        avatar_inner_armor_color_preset_3: null,
        avatar_inner_armor_color_preset_4: null,
        avatar_inner_armor_color_preset_5: null,
      },
    },
    {
      item_equipment_page: 'Cash',
      item_equipment_slot_name: '아바타 상의',
      item_name: '테스트 아바타 상의',
      item_option: {
        enhancement_level: null,
        tuning_stat: null,
        ability_name: null,
        prefix_enchant_use_preset_no: null,
        suffix_enchant_use_preset_no: null,
        prefix_enchant_preset_1: null,
        suffix_enchant_preset_1: null,
        prefix_enchant_preset_2: null,
        suffix_enchant_preset_2: null,
        power_infusion_use_preset_no: null,
        power_infusion_preset_1: null,
        power_infusion_preset_2: null,
        cash_item_color: {
          color_1: '#FFFFFF',
          color_2: '#1A1A1A',
          color_3: '#C0392B',
          color_4: null,
          color_5: null,
        },
        avatar_color_use_preset_no: 2,
        avatar_color_preset_1: {
          color_1: '#FFFFFF',
          color_2: '#1A1A1A',
          color_3: '#C0392B',
          color_4: null,
          color_5: null,
        },
        avatar_color_preset_2: {
          color_1: '#2C3E50',
          color_2: '#ECF0F1',
          color_3: '#F1C40F',
          color_4: null,
          color_5: null,
        },
        avatar_color_preset_3: null,
        avatar_color_preset_4: null,
        avatar_color_preset_5: null,
        avatar_inner_armor_color_preset_1: {
          color_1: '#FFFFFF',
          color_2: '#FFFFFF',
          color_3: '#FFFFFF',
          color_4: null,
          color_5: null,
          default_color_flag: '1',
        },
        avatar_inner_armor_color_preset_2: {
          color_1: '#000000',
          color_2: '#333333',
          color_3: '#666666',
          color_4: null,
          color_5: null,
          default_color_flag: '0',
        },
        avatar_inner_armor_color_preset_3: null,
        avatar_inner_armor_color_preset_4: null,
        avatar_inner_armor_color_preset_5: null,
      },
    },
  ],
};

export const heroesCharacterStatFixture: HeroesCharacterStat = {
  stat: [
    { stat_name: '공격력', stat_value: '45000' },
    { stat_name: '마법 공격력', stat_value: '12000' },
    { stat_name: '방어력', stat_value: '21000' },
  ],
};

export const heroesCharacterGuildFixture: HeroesCharacterGuild = {
  guild_name: '테스트길드',
};

export const heroesCharacterNoGuildFixture: HeroesCharacterGuild = {
  guild_name: null,
};
