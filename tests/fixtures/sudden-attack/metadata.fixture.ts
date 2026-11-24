import type {
  SuddenAttackGradeMeta,
  SuddenAttackLogo,
  SuddenAttackSeasonGradeMeta,
  SuddenAttackTierMeta,
} from '../../../src/games/sudden-attack/index.js';

// 키 없이 조회한 공식 /static/suddenattack/meta/ 응답의 일부입니다.
export const suddenAttackLogoFixture: SuddenAttackLogo = {
  logo_image: 'https://open.api.nexon.com/static/suddenattack/img/473e902819d68aee4fa770977e70bdb9',
};

export const suddenAttackGradeFixture: readonly SuddenAttackGradeMeta[] = [
  {
    grade: '훈련병',
    grade_image:
      'https://open.api.nexon.com/static/suddenattack/img/ee33e82aefcc246d112d88aca8098387',
  },
  {
    grade: '이병',
    grade_image:
      'https://open.api.nexon.com/static/suddenattack/img/f6b0bce6a0633923c6d0dc1a1535a752',
  },
];

export const suddenAttackSeasonGradeFixture: readonly SuddenAttackSeasonGradeMeta[] = [
  {
    season_grade: '특등이병',
    season_grade_image:
      'https://open.api.nexon.com/static/suddenattack/img/5c0245da786782a483c7407e0b212fc6',
  },
  {
    season_grade: '특등일병',
    season_grade_image:
      'https://open.api.nexon.com/static/suddenattack/img/91d2f3a77afa2bfc56b9c3f1ebe62f50',
  },
];

export const suddenAttackTierFixture: readonly SuddenAttackTierMeta[] = [
  {
    tier: 'UNRANK',
    tier_image:
      'https://open.api.nexon.com/static/suddenattack/img/012402621044afac26c6066600ddc646',
  },
  {
    tier: 'BRONZE I',
    tier_image:
      'https://open.api.nexon.com/static/suddenattack/img/b0f5af75bf3550a99f889430dfca5c74',
  },
];
