import type {
  BaramYeonCharacterBasic,
  BaramYeonCharacterTitle,
  BaramYeonCharacterTitleEquipment,
} from '../../../src/games/baram-yeon/character/types.js';

// 포털 스펙(specs/openapi/baramy/7.yaml) 스키마와 example 로 합성한 값. 실 캐릭터 데이터가 아니다.

export const baramYeonOcidFixture = {
  ocid: 'test-baram-yeon-ocid-0001',
};

export const baramYeonCharacterBasicFixture: BaramYeonCharacterBasic = {
  server_name: '연',
  character_name: '테스트연',
  character_date_create: '2023-12-14T08:28:35Z',
  character_class_group_name: '전사',
  character_class_name: '검객',
  character_nation: '고구려',
  character_gender: '여',
  character_exp: 987654321,
  character_level: 150,
};

export const baramYeonCharacterTitleFixture: BaramYeonCharacterTitle = {
  title: [
    { title_type_name: '업적', title_name: '테스트 칭호' },
    // 2022-03-18 이전에 획득한 칭호를 가정 (타입 미제공)
    { title_type_name: null, title_name: '테스트 옛 칭호' },
  ],
};

export const baramYeonCharacterTitleEquipmentFixture: BaramYeonCharacterTitleEquipment = {
  title_equipment: [
    { title_equipment_type: '1', title_type_name: '업적', title_name: '테스트 칭호' },
    { title_equipment_type: '2', title_type_name: null, title_name: '테스트 옛 칭호' },
  ],
};
