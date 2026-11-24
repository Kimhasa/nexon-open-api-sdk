import type {
  V4CharacterBasic,
  V4CharacterHonor,
  V4CharacterHonorEquipment,
} from '../../../src/games/v4/character/types.js';

// 포털 스펙(specs/openapi/v4/9.yaml) 스키마와 example 로 합성한 값. 실 캐릭터 데이터가 아니다.

export const v4OcidFixture = {
  ocid: 'test-v4-ocid-0001',
};

export const v4CharacterBasicFixture: V4CharacterBasic = {
  server_name: '테스트서버',
  character_name: '테스트브이포',
  character_date_create: '2023-12-14T00:00:00Z',
  character_create_type: '0',
  character_date_last_login: '2023-12-14T08:28:35Z',
  character_date_last_logout: '2023-12-14T09:40:12Z',
  character_class_name: '블레이더',
  character_level: 85,
};

export const v4CharacterHonorFixture: V4CharacterHonor = {
  honor: [
    {
      honor_type_name: '업적',
      honor_name: '테스트 명예',
      date_expire: '2023-12-14T08:28:35Z',
    },
    { honor_type_name: '업적', honor_name: '테스트 영구 명예', date_expire: null },
  ],
};

export const v4CharacterHonorEquipmentFixture: V4CharacterHonorEquipment = {
  honor_equipment: [
    {
      honor_type_name: '업적',
      honor_name: '테스트 명예',
      date_expire: '2023-12-14T08:28:35Z',
    },
    { honor_type_name: '업적', honor_name: '테스트 영구 명예', date_expire: null },
  ],
};
