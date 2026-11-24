import type { TfdRecommendationModule } from '../../../src/games/first-descendant/recommendation/types.js';

// 추천 모듈 API는 API 키가 있어야 실응답을 볼 수 있다. 아래 값은 스펙 스키마로 합성한 가상 데이터다.

export const tfdRecommendationModuleFixture: TfdRecommendationModule = {
  descendant: {
    descendant_id: '101000001',
    recommendation: [{ module_id: '252011001' }, { module_id: '251001001' }],
  },
  weapon: {
    weapon_id: '211011001',
    recommendation: [{ module_id: '251002001' }],
  },
};

/** 조건에 맞는 기록이 부족해 추천이 비어 있는 경우 */
export const tfdRecommendationModuleEmptyFixture: TfdRecommendationModule = {
  descendant: { descendant_id: '101000001', recommendation: [] },
  weapon: { weapon_id: '211011001', recommendation: [] },
};
