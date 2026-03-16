import { http, HttpResponse } from 'msw';
import { seaOcidFixture } from '../../fixtures/maplestory-sea/ocid.fixture.js';
import { seaCharacterBasicFixture } from '../../fixtures/maplestory-sea/character-basic.fixture.js';
import { seaUnionFixture } from '../../fixtures/maplestory-sea/union.fixture.js';
import {
  seaGuildIdFixture,
  seaGuildBasicFixture,
} from '../../fixtures/maplestory-sea/guild.fixture.js';

const BASE = 'https://open.api.nexon.com/maplestorysea/v1';

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

export const mapleStorySEAHandlers = [
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
    return HttpResponse.json(seaOcidFixture);
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
    return HttpResponse.json(seaCharacterBasicFixture);
  }),

  // Union
  http.get(`${BASE}/user/union`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(seaUnionFixture);
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
    return HttpResponse.json(seaGuildIdFixture);
  }),

  // Guild Basic
  http.get(`${BASE}/guild/basic`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    return HttpResponse.json(seaGuildBasicFixture);
  }),
];
