import { http, HttpResponse } from 'msw';
import {
  suddenAttackOuidFixture,
  suddenAttackUserBasicFixture,
  suddenAttackUserRankFixture,
  suddenAttackUserRecentInfoFixture,
  suddenAttackUserTierFixture,
  suddenAttackMatchListFixture,
  suddenAttackMatchDetailFixture,
} from '../../fixtures/sudden-attack/fixtures.fixture.js';
import {
  suddenAttackLogoFixture,
  suddenAttackGradeFixture,
  suddenAttackSeasonGradeFixture,
  suddenAttackTierFixture,
} from '../../fixtures/sudden-attack/metadata.fixture.js';

const BASE = 'https://open.api.nexon.com/suddenattack/v1';
const STATIC = 'https://open.api.nexon.com/static/suddenattack/meta';

export const suddenAttackHandlers = [
  http.get(`${BASE}/id`, () => HttpResponse.json(suddenAttackOuidFixture)),
  http.get(`${BASE}/user/basic`, () => HttpResponse.json(suddenAttackUserBasicFixture)),
  http.get(`${BASE}/user/rank`, () => HttpResponse.json(suddenAttackUserRankFixture)),
  http.get(`${BASE}/user/tier`, () => HttpResponse.json(suddenAttackUserTierFixture)),
  http.get(`${BASE}/user/recent-info`, () => HttpResponse.json(suddenAttackUserRecentInfoFixture)),
  http.get(`${BASE}/match`, () => HttpResponse.json(suddenAttackMatchListFixture)),
  http.get(`${BASE}/match-detail`, () => HttpResponse.json(suddenAttackMatchDetailFixture)),
  http.get(`${STATIC}/logo`, () => HttpResponse.json(suddenAttackLogoFixture)),
  http.get(`${STATIC}/grade`, () => HttpResponse.json(suddenAttackGradeFixture)),
  http.get(`${STATIC}/season_grade`, () => HttpResponse.json(suddenAttackSeasonGradeFixture)),
  http.get(`${STATIC}/tier`, () => HttpResponse.json(suddenAttackTierFixture)),
];
