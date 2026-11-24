import type {
  BaramCharacterBasic,
  BaramCharacterGuild,
  BaramCharacterItemEquipment,
  BaramCharacterStat,
  BaramCharacterTitle,
  BaramCharacterTitleEquipment,
} from '../../../src/games/baram/character/types.js';

// 포털 스펙(specs/openapi/baram/13.yaml) 스키마와 example 로 합성한 값. 실 캐릭터 데이터가 아니다.

export const baramOcidFixture = {
  ocid: 'test-baram-ocid-0001',
};

export const baramCharacterBasicFixture: BaramCharacterBasic = {
  character_name: '테스트바람',
  character_date_create: '2023-12-14T08:28:35Z',
  character_create_type_name: '일반',
  character_class_name: '전사',
  character_nation_name: '고구려',
  character_gender: '남',
  character_exp: 123456789,
  character_level: 99,
};

export const baramCharacterTitleFixture: BaramCharacterTitle = {
  title: [
    { title_id: '테스트 칭호', date_expire: '2023-12-14T08:28:35Z' },
    { title_id: '테스트 영구 칭호', date_expire: null },
  ],
};

export const baramCharacterTitleEquipmentFixture: BaramCharacterTitleEquipment = {
  title_equipment: [
    { title_id: '테스트 칭호', date_expire: '2023-12-14T08:28:35Z' },
    { title_id: '테스트 영구 칭호', date_expire: null },
  ],
};

export const baramCharacterItemEquipmentFixture: BaramCharacterItemEquipment = {
  item_equipment: [
    { item_id: '테스트 검', item_equipment_slot_name: '무기' },
    { item_id: '테스트 갑옷', item_equipment_slot_name: '갑옷' },
    { item_id: null, item_equipment_slot_name: '투구' },
  ],
};

export const baramCharacterStatFixture: BaramCharacterStat = {
  stat: [
    { stat_name: '체력', stat_value: '120000' },
    { stat_name: '마력', stat_value: '45000' },
  ],
};

export const baramCharacterGuildFixture: BaramCharacterGuild = {
  guild_name: '테스트문파',
};

/** 문파 미가입 캐릭터를 가정한 응답 (nullable 경로) */
export const baramCharacterNoGuildFixture: BaramCharacterGuild = {
  guild_name: null,
};
