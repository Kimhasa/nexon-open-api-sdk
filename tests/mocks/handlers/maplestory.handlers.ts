import { http, HttpResponse } from 'msw';
import { ocidFixture } from '../../fixtures/maplestory/ocid.fixture.js';
import { characterBasicFixture } from '../../fixtures/maplestory/character-basic.fixture.js';
import { unionFixture } from '../../fixtures/maplestory/union.fixture.js';
import { guildIdFixture, guildBasicFixture } from '../../fixtures/maplestory/guild.fixture.js';
import { overallRankingFixture } from '../../fixtures/maplestory/ranking.fixture.js';
import { starforceHistoryFixture } from '../../fixtures/maplestory/history.fixture.js';
import {
  noticeListFixture,
  noticeDetailFixture,
} from '../../fixtures/maplestory/notice.fixture.js';

const BASE = 'https://open.api.nexon.com/maplestory/v1';

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

export const mapleStoryHandlers = [
  // OCID
  http.get(`${BASE}/id`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const name = url.searchParams.get('character_name');
    if (!name) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(ocidFixture);
  }),

  // Character Basic
  http.get(`${BASE}/character/basic`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const ocid = url.searchParams.get('ocid');
    if (!ocid) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(characterBasicFixture);
  }),

  // Character List
  http.get(`${BASE}/character/list`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json({ account_list: [] });
  }),

  // Union
  http.get(`${BASE}/user/union`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(unionFixture);
  }),

  // Guild ID
  http.get(`${BASE}/guild/id`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const guildName = url.searchParams.get('guild_name');
    const worldName = url.searchParams.get('world_name');
    if (!guildName || !worldName) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(guildIdFixture);
  }),

  // Guild Basic
  http.get(`${BASE}/guild/basic`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(guildBasicFixture);
  }),

  // Ranking Overall
  http.get(`${BASE}/ranking/overall`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(overallRankingFixture);
  }),

  // History Starforce
  http.get(`${BASE}/history/starforce`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(starforceHistoryFixture);
  }),

  // Notice
  http.get(`${BASE}/notice`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(noticeListFixture);
  }),

  // Notice Detail
  http.get(`${BASE}/notice/detail`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(noticeDetailFixture);
  }),
];
