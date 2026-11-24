import type { Hit2CharacterBasic } from '../../../src/games/hit2/character/types.js';

// 포털 스펙(specs/openapi/hit2/10.yaml) 스키마와 example 로 합성한 값. 실 캐릭터 데이터가 아니다.
// 접속 시각 필드명은 2026-11-24 실제 응답(character_date_last_login·logout)을 따른다.

export const hit2OcidFixture = {
  ocid: 'test-hit2-ocid-0001',
};

export const hit2CharacterBasicFixture: Hit2CharacterBasic = {
  server_name: '테스트서버',
  character_name: '테스트히트',
  character_date_create: '2023-12-14T00:00:00Z',
  character_date_last_login: '2023-12-14T08:28:35Z',
  character_date_last_logout: '2023-12-14T09:40:12Z',
  character_class_group_name: '검',
  character_class_name: '대검',
  character_level: 70,
};
