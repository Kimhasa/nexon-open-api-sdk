import type { HeroesEnchantMeta } from '../../../src/games/mabinogi-heroes/meta/types.js';

// 포털 스펙(specs/openapi/heroes/29.yaml) 스키마로 합성한 값이다. 실 API 응답이 아니다.
export const heroesEnchantMetaFixture: HeroesEnchantMeta = {
  enchant_grade: 9,
  enchant_available_slot_name: ['무기'],
  enchant_stat: ['공격력 +350', '밸런스 +2', '크리티컬 +3'],
};
