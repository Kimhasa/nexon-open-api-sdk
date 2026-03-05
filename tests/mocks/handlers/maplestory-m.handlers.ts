import { http, HttpResponse } from 'msw';
import { mOcidFixture } from '../../fixtures/maplestory-m/ocid.fixture.js';
import { mCharacterBasicFixture } from '../../fixtures/maplestory-m/character-basic.fixture.js';
import { mUnionFixture } from '../../fixtures/maplestory-m/union.fixture.js';
import { mGuildIdFixture, mGuildBasicFixture } from '../../fixtures/maplestory-m/guild.fixture.js';
import { mLevelRankingFixture } from '../../fixtures/maplestory-m/ranking.fixture.js';
import {
  mNoticeListFixture,
  mNoticeDetailFixture,
} from '../../fixtures/maplestory-m/notice.fixture.js';

const BASE = 'https://open.api.nexon.com/maplestorym/v1';

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

export const mapleStoryMHandlers = [
  // OCID
  http.get(`${BASE}/id`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const name = url.searchParams.get('character_name');
    const worldName = url.searchParams.get('world_name');
    if (!name || !worldName) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(mOcidFixture);
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
    return HttpResponse.json(mCharacterBasicFixture);
  }),

  // Union
  http.get(`${BASE}/user/union`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(mUnionFixture);
  }),

  // Guild ID
  http.get(`${BASE}/guild/id`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const url = new URL(request.url);
    const worldName = url.searchParams.get('world_name');
    const guildName = url.searchParams.get('guild_name');
    if (!worldName || !guildName) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(mGuildIdFixture);
  }),

  // Guild Basic
  http.get(`${BASE}/guild/basic`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(mGuildBasicFixture);
  }),

  // Ranking Level
  http.get(`${BASE}/ranking/level`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(mLevelRankingFixture);
  }),

  // Notice List
  http.get(`${BASE}/notice`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(mNoticeListFixture);
  }),

  // Notice Detail
  http.get(`${BASE}/notice/detail`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(mNoticeDetailFixture);
  }),
];
