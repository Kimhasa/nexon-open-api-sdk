import type { KartriderOUID } from '../../../src/games/kartrider/types.js';
import type {
  KartriderOuidLookup,
  KartriderUserBasic,
  KartriderUserTitleEquipment,
} from '../../../src/games/kartrider/user/types.js';

// 포털 스펙(specs/openapi/kartrush/8.yaml) 스키마와 example 로 합성한 값. 실 계정 데이터가 아니다.

export const kartriderOuidLookupFixture: KartriderOuidLookup = {
  ouid_info: [
    {
      ouid: 'test-kartrider-ouid-0001' as KartriderOUID,
      racer_date_create: '2023-12-14T08:28:35Z',
      racer_level: '108',
    },
    {
      ouid: 'test-kartrider-ouid-0002' as KartriderOUID,
      racer_date_create: '2024-03-02T01:10:00Z',
      racer_level: '12',
    },
  ],
};

export const kartriderUserBasicFixture: KartriderUserBasic = {
  racer_name: '테스트라이더',
  racer_date_create: '2023-12-14T08:28:35Z',
  racer_date_last_login: '2024-01-01T10:00:00Z',
  racer_date_last_logout: '2024-01-01T12:30:00Z',
  racer_level: 108,
};

export const kartriderUserTitleEquipmentFixture: KartriderUserTitleEquipment = {
  title_equipment: [{ title_name: '전설의 라이더' }],
};
