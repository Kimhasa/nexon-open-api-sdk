import type {
  MCharacterStat,
  MCharacterHyperStat,
  MCharacterGuild,
  MCharacterItemEquipment,
  MCharacterCashItemEquipment,
  MCharacterSymbolEquipment,
  MCharacterSetEffect,
  MCharacterAndroidEquipment,
  MCharacterJewel,
  MCharacterBeautyEquipment,
  MCharacterPetEquipment,
  MCharacterSkillEquipment,
  MCharacterLinkSkill,
  MCharacterVMatrix,
  MCharacterHexaMatrixSkill,
  MCharacterHexaMatrixStat,
  MItemOption,
  MItemEquipment,
  MCashItemEquipmentItem,
  MAndroidEquipmentInfo,
  MHeartEquipment,
} from '../../../src/games/maplestory-m/character/types.js';

const itemOption: MItemOption = {
  option_no: 1,
  option_name: '경험치 획득량',
  option_value: '5%',
};

const equipmentItem: MItemEquipment = {
  item_name: '테스트 장비',
  item_equipment_page_name: '장비',
  item_equipment_slot_name: '무기',
  item_grade: '1',
  item_combat_power: 15000,
  starforce_upgrade: '20',
  starforce_remain_count: 1,
  equipment_level: 160,
  item_gender: '공용',
  freestyle_coupon_flag: '1',
  cuttable_count: 1,
  transmission_able: '1',
  todd_able: '0',
  item_additional_option_grade: '1',
  item_potential_option_grade: '1',
  item_additional_potential_option_grade: '1',
  item_icon: 'https://example.com/item-icon.png',
  item_option: '공격력 10 증가',
  item_basic_option: [itemOption],
  item_additional_option: [itemOption],
  item_potential_option: [itemOption],
  item_additional_potential_option: [itemOption],
  soul_equipment_flag: '1',
  soul_info: {
    soul_name: '테스트 소울',
    soul_option: '공격력 10 증가',
  },
  emblem_info: {
    emblem_name: '테스트 문장',
    emblem_level: '2',
    emblem_option: '공격력 10 증가',
  },
  mastery_info: {
    mastery_level: 2,
    mastery_exp: 350,
    base_option_point: 4,
    potential_option_point: 2,
    additional_option_point: 3,
    additional_potential_option_point: 1,
  },
};

const cashItem: MCashItemEquipmentItem = {
  cash_item_equipment_page_name: '캐시',
  cash_item_equipment_slot_name: '모자',
  cash_item_name: '테스트 코디',
  cash_item_icon: 'https://example.com/cash-item-icon.png',
  miracle_anvil_item_name: '테스트 신비의 모루 외형',
  miracle_anvil_item_icon: 'https://example.com/miracle-anvil-item-icon.png',
  cash_item_description: '테스트용 캐시 아이템',
  cash_item_gender: 1,
  freestyle_coupon_flag: '1',
  cash_item_option: [
    {
      option_name: '경험치 획득량',
      option_value: '5%',
    },
  ],
  date_expire: null,
  date_option_expire: '2026-12-01T00:00:00Z',
  cash_item_label: '스페셜 라벨',
  cash_item_coloring_prism: {
    color_range: '전체',
    hue: 1,
    saturation: 1,
    value: 1,
  },
};

const dressUpItem: MCashItemEquipmentItem = {
  ...cashItem,
  cash_item_name: '테스트 드레스 업 코디',
};

const android: MAndroidEquipmentInfo = {
  android_name: '테스트 안드로이드',
  android_nickname: '테스트 별명',
  android_icon: 'https://example.com/android-icon.png',
  android_description: '테스트용 안드로이드',
  android_grade: '레어',
  android_gender: '여',
  android_non_humanoid_flag: '1',
  android_warehouse_usable_flag: '1',
  android_ear_sensor_clip_flag: '1',
  android_cash_item_equipment: [
    {
      cash_item_equipment_page_name: '캐시',
      cash_item_equipment_slot_name: '모자',
      cash_item_name: '테스트 코디',
      cash_item_icon: 'https://example.com/cash-item-icon.png',
      cash_item_description: '테스트용 캐시 아이템',
      android_item_gender: '공용',
      freestyle_coupon_flag: '1',
      cash_item_label: '스페셜 라벨',
      cash_item_coloring_prism: {
        color_range: '전체',
        hue: 1,
        saturation: 1,
        value: 1,
      },
    },
  ],
};

const heart: MHeartEquipment = {
  heart_name: '테스트 하트',
  heart_icon: 'https://example.com/heart-icon.png',
  heart_description: '테스트용 기계 심장',
  item_additional_option_grade: '1',
  item_potential_option_grade: '1',
  item_additional_option: [itemOption],
  item_potential_option: [itemOption],
};

export const mCharacterStatFixture: MCharacterStat = {
  stat: [
    {
      stat_name: '공격력',
      stat_value: '10%',
    },
  ],
};

export const mCharacterHyperStatFixture: MCharacterHyperStat = {
  preset_count: 1,
  use_preset_no: 1,
  use_preset_remain_hyper_stat: 1,
  hyper_stat: [
    {
      preset_no: 1,
      hyper_stat_info: [
        {
          stat_type: '물리 공격력',
          stat_level: 5,
          stat_increase: '10%',
        },
      ],
    },
  ],
};

export const mCharacterGuildFixture: MCharacterGuild = {
  guild_name: '테스트길드M',
};

export const mCharacterItemEquipmentFixture: MCharacterItemEquipment = {
  character_class: '히어로',
  use_preset_no: 1,
  item_equipment: [equipmentItem],
  soul_set_option: '공격력 10 증가',
  equipment_preset: [
    {
      preset_no: 1,
      item_equipment: [equipmentItem],
      soul_set_option: '공격력 10 증가',
    },
  ],
};

export const mCharacterCashItemEquipmentFixture: MCharacterCashItemEquipment = {
  character_class: '엔젤릭버스터',
  character_gender: '여',
  use_preset_no: 1,
  use_additional_preset_no: 1,
  character_look_mode: '1',
  cash_item_equipment: [cashItem],
  additional_cash_item_equipment: [dressUpItem],
  cash_equipment_preset: [
    {
      preset_no: 1,
      cash_item_equipment: [cashItem],
    },
  ],
  additional_cash_equipment_preset: [
    {
      preset_no: 1,
      additional_cash_item_equipment: [dressUpItem],
    },
  ],
};

export const mCharacterSymbolEquipmentFixture: MCharacterSymbolEquipment = {
  character_class: '히어로',
  arcane_symbol: [
    {
      symbol_name: '소멸의 여로',
      symbol_icon: 'https://example.com/symbol-icon.png',
      symbol_level: 15,
      symbol_growth_value: 1,
      symbol_option: '공격력 10 증가',
    },
  ],
  authentic_symbol: [
    {
      symbol_name: '세르니움',
      symbol_icon: 'https://example.com/symbol-icon.png',
      symbol_level: 5,
      symbol_growth_value: 1,
      symbol_option: '공격력 10 증가',
    },
  ],
};

export const mCharacterSetEffectFixture: MCharacterSetEffect = {
  set_info: [
    {
      set_name: '테스트 세트',
      set_count: 2,
      set_option: '공격력 20 증가',
    },
  ],
};

export const mCharacterAndroidEquipmentFixture: MCharacterAndroidEquipment = {
  use_preset_no: 1,
  android_equipment: android,
  heart_equipment: heart,
  android_heart_equipment_preset: [
    {
      preset_no: 1,
      android_equipment: android,
      heart_equipment: heart,
    },
  ],
};

export const mCharacterJewelFixture: MCharacterJewel = {
  use_jewel_page_no: 1,
  use_jewel_set_option: '경험치 획득량 증가',
  jewel_equipment: [
    {
      jewel_page_no: 1,
      jewel_info: [
        {
          slot_no: 1,
          jewel_name: '테스트 쥬얼',
          jewel_grade: 'S',
          jewel_color: '레드',
          jewel_option: '물리 공격력 5% 증가',
          jewel_icon: 'https://example.com/jewel-icon.png',
        },
      ],
    },
  ],
};

export const mCharacterBeautyEquipmentFixture: MCharacterBeautyEquipment = {
  character_gender: '여',
  character_class: '엔젤릭버스터',
  character_hair: {
    hair_name: '테스트 헤어',
    base_color: '검은색',
    mix_color: '갈색',
    mix_rate: '50',
    freestyle_coupon_flag: '1',
  },
  character_face: {
    face_name: '테스트 얼굴',
    base_color: '검은색',
    mix_color: '갈색',
    mix_rate: '50',
    freestyle_coupon_flag: '1',
  },
  character_skin_name: '뽀송 피부',
  additional_character_hair: {
    hair_name: '테스트 드레스 업 헤어',
    base_color: '검은색',
    mix_color: '갈색',
    mix_rate: '50',
    freestyle_coupon_flag: '1',
  },
  additional_character_face: {
    face_name: '테스트 드레스 업 성형',
    base_color: '검은색',
    mix_color: '갈색',
    mix_rate: '50',
    freestyle_coupon_flag: '1',
  },
  additional_character_skin_name: '뽀송 피부',
};

export const mCharacterPetEquipmentFixture: MCharacterPetEquipment = {
  pet_1_name: '테스트 펫 1',
  pet_1_pet_type: '원더 블랙',
  pet_1_date_expire: '2023-12-14T08:28:35Z',
  pet_1_icon: 'https://example.com/pet-1-icon.png',
  pet_2_name: '테스트 펫 2',
  pet_2_pet_type: '원더 블랙',
  pet_2_date_expire: '2023-12-14T08:28:35Z',
  pet_2_icon: 'https://example.com/pet-2-icon.png',
  pet_3_name: '테스트 펫 3',
  pet_3_pet_type: '원더 블랙',
  pet_3_date_expire: '2023-12-14T08:28:35Z',
  pet_3_icon: 'https://example.com/pet-3-icon.png',
  pet_set_option: [
    {
      set_name: '테스트 세트',
      set_count: 2,
      set_option: '공격력 20 증가',
    },
  ],
};

export const mCharacterSkillEquipmentFixture: MCharacterSkillEquipment = {
  character_class: '히어로',
  skill: {
    equipment_skill: [
      {
        skill_mode: 1,
        equipment_skill_set: '1',
        slot_id: '1',
        skill_name: '테스트 스킬',
        skill_icon: 'https://example.com/skill-icon.png',
        skill_type: '강화',
        skill_grade: '1',
        add_feature_flag: '1',
      },
    ],
    preset: [
      {
        preset_slot_no: 1,
        skill_name_1: '테스트 스킬 1',
        skill_icon_1: 'https://example.com/skill.png',
        skill_name_2: '테스트 스킬 2',
        skill_icon_2: 'https://example.com/skill.png',
        skill_name_3: '테스트 스킬 3',
        skill_icon_3: 'https://example.com/skill.png',
        skill_name_4: '테스트 스킬 4',
        skill_icon_4: 'https://example.com/skill.png',
        preset_command_flag: '1',
      },
    ],
    steal_skill: [
      {
        skill_name: '테스트 스킬',
        skill_icon: 'https://example.com/skill-icon.png',
        skill_slot: '1',
      },
    ],
    stella_memorize: [
      {
        skill_name: '테스트 스킬',
        skill_icon: 'https://example.com/skill-icon.png',
        equipment_skill_set: '1',
      },
    ],
  },
};

export const mCharacterLinkSkillFixture: MCharacterLinkSkill = {
  use_preset_no: 1,
  link_skill: [
    {
      preset_no: 1,
      link_skill_info: [
        {
          skill_name: '테스트 스킬',
          skill_level: '1',
          skill_description: '공격력을 높이는 테스트 스킬',
          skill_effect: '공격력 10 증가',
          skill_effect_next: '공격력 15 증가',
          skill_icon: 'https://example.com/skill-icon.png',
        },
      ],
    },
  ],
};

export const mCharacterVMatrixFixture: MCharacterVMatrix = {
  character_class: '히어로',
  vmatrix_total_score: 100,
  character_v_core_equipment: [
    {
      vcore_type: '강화 코어',
      vcore_level: 25,
      vcore_score: 100,
      vcore_skill_name1: '레이징 블로우',
      vcore_skill_name2: '콤보 어택',
      vcore_skill_name3: '인레이지',
      vcore_skill_name4: '파이널 어택',
      vcore_expire_flag: '1',
      vcore_expire_date: '2026-12-31T00:00:00Z',
      vcore_equipment_flag: '1',
    },
  ],
};

export const mCharacterHexaMatrixSkillFixture: MCharacterHexaMatrixSkill = {
  character_class: '히어로',
  hexamatrix_total_score: 200,
  hexamatrix_skill: [
    {
      slot_no: 1,
      slot_level: 5,
      skill_score: 200,
      skill_type: '강화',
      skill_name: '테스트 스킬',
      skill_description: '공격력을 높이는 테스트 스킬',
      skill_icon: 'https://example.com/skill-icon.png',
    },
  ],
};

export const mCharacterHexaMatrixStatFixture: MCharacterHexaMatrixStat = {
  character_class: '히어로',
  hexamatrix_stat: [
    {
      stat_core_slot: 1,
      stat_info: [
        {
          page_no: 1,
          activate_flag: '1',
          main_stat: '물리 공격력',
          main_stat_level: 1,
          sub_1_stat: '보스 공격력',
          sub_1_stat_level: 1,
          sub_2_stat: '크리티컬 데미지',
          sub_2_stat_level: 1,
        },
      ],
    },
  ],
};
