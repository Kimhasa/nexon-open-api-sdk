import { http, HttpResponse } from 'msw';
import {
  fcOuidFixture,
  fcUserBasicFixture,
  fcMaxDivisionFixture,
  fcMatchListFixture,
  fcAllMatchListFixture,
  fcMatchDetailFixture,
  fcMatchTypeMetaFixture,
} from '../../fixtures/fc-online/fixtures.fixture.js';

const BASE = 'https://open.api.nexon.com/fconline/v1';
const STATIC = 'https://open.api.nexon.com/static/fconline/meta';

const checkApiKey = (request: Request): HttpResponse | null => {
  const apiKey = request.headers.get('x-nxopen-api-key');
  if (!apiKey) {
    return HttpResponse.json(
      { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
      { status: 403 },
    );
  }
  return null;
};

export const fcOnlineHandlers = [
  // OUID
  http.get(`${BASE}/id`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    if (!nickname) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fcOuidFixture);
  }),

  // User Basic
  http.get(`${BASE}/user/basic`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const ouid = url.searchParams.get('ouid');
    if (!ouid) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fcUserBasicFixture);
  }),

  // Max Division
  http.get(`${BASE}/user/maxdivision`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const ouid = url.searchParams.get('ouid');
    if (!ouid) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fcMaxDivisionFixture);
  }),

  // User Match List
  http.get(`${BASE}/user/match`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const ouid = url.searchParams.get('ouid');
    const matchtype = url.searchParams.get('matchtype');
    if (!ouid || !matchtype) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fcMatchListFixture);
  }),

  // All Match List
  http.get(`${BASE}/match`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const matchtype = url.searchParams.get('matchtype');
    if (!matchtype) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fcAllMatchListFixture);
  }),

  // Match Detail
  http.get(`${BASE}/match-detail`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const matchid = url.searchParams.get('matchid');
    if (!matchid) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fcMatchDetailFixture);
  }),

  // ─── Metadata (static JSON) ─────────────────────────────────────────────

  http.get(`${STATIC}/matchtype.json`, () => {
    return HttpResponse.json(fcMatchTypeMetaFixture);
  }),
];
