import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import {
  seaCharacterPopularityFixture,
  seaCharacterStatFixture,
  seaCharacterHyperStatFixture,
  seaCharacterPropensityFixture,
  seaCharacterAbilityFixture,
  seaCharacterItemEquipmentFixture,
  seaCharacterCashItemEquipmentFixture,
  seaCharacterSymbolEquipmentFixture,
  seaCharacterSetEffectFixture,
  seaCharacterBeautyEquipmentFixture,
  seaCharacterAndroidEquipmentFixture,
  seaCharacterPetEquipmentFixture,
  seaCharacterSkillFixture,
  seaCharacterLinkSkillFixture,
  seaCharacterVMatrixFixture,
  seaCharacterHexaMatrixFixture,
  seaCharacterHexaMatrixStatFixture,
  seaCharacterDojangFixture,
} from '../../fixtures/maplestory-sea/character.fixture.js';
import {
  SEA_UNION_CHAMPION_DATE,
  seaUnionRaiderFixture,
  seaUnionArtifactFixture,
  seaUnionChampionFixture,
} from '../../fixtures/maplestory-sea/union-detail.fixture.js';
import { seaOcidFixture } from '../../fixtures/maplestory-sea/ocid.fixture.js';
import { seaCharacterBasicFixture } from '../../fixtures/maplestory-sea/character-basic.fixture.js';
import { seaUnionFixture } from '../../fixtures/maplestory-sea/union.fixture.js';
import {
  seaGuildIdFixture,
  seaGuildBasicFixture,
} from '../../fixtures/maplestory-sea/guild.fixture.js';

const BASE = 'https://open.api.nexon.com/maplestorysea/v1';

const checkApiKey = (request: Request): ReturnType<typeof HttpResponse.json> | null => {
  const apiKey = request.headers.get('x-nxopen-api-key');
  if (!apiKey) {
    return HttpResponse.json(
      { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
      { status: 403 },
    );
  }
  return null;
};

const REQUEST_DATE = '2025-04-21';

function datedOcidHandler(
  path: string,
  fixture: Parameters<typeof HttpResponse.json>[0],
  { date = REQUEST_DATE, skillGrade }: { date?: string; skillGrade?: string } = {},
): HttpHandler {
  return http.get(`${BASE}/${path}`, ({ request }) => {
    const authError = checkApiKey(request);
    if (authError) return authError;
    const query = new URL(request.url).searchParams;
    if (
      query.get('ocid') !== seaOcidFixture.ocid ||
      query.get('date') !== date ||
      (skillGrade !== undefined && query.get('character_skill_grade') !== skillGrade)
    ) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Unexpected character query' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(fixture);
  });
}

export const mapleStorySEAHandlers = [
  datedOcidHandler('character/popularity', seaCharacterPopularityFixture),
  datedOcidHandler('character/stat', seaCharacterStatFixture),
  datedOcidHandler('character/hyper-stat', seaCharacterHyperStatFixture),
  datedOcidHandler('character/propensity', seaCharacterPropensityFixture),
  datedOcidHandler('character/ability', seaCharacterAbilityFixture),
  datedOcidHandler('character/item-equipment', seaCharacterItemEquipmentFixture),
  datedOcidHandler('character/cashitem-equipment', seaCharacterCashItemEquipmentFixture),
  datedOcidHandler('character/symbol-equipment', seaCharacterSymbolEquipmentFixture),
  datedOcidHandler('character/set-effect', seaCharacterSetEffectFixture),
  datedOcidHandler('character/beauty-equipment', seaCharacterBeautyEquipmentFixture),
  datedOcidHandler('character/android-equipment', seaCharacterAndroidEquipmentFixture),
  datedOcidHandler('character/pet-equipment', seaCharacterPetEquipmentFixture),
  datedOcidHandler('character/skill', seaCharacterSkillFixture, { skillGrade: '6' }),
  datedOcidHandler('character/link-skill', seaCharacterLinkSkillFixture),
  datedOcidHandler('character/vmatrix', seaCharacterVMatrixFixture),
  datedOcidHandler('character/hexamatrix', seaCharacterHexaMatrixFixture),
  datedOcidHandler('character/hexamatrix-stat', seaCharacterHexaMatrixStatFixture),
  datedOcidHandler('character/dojang', seaCharacterDojangFixture),
  datedOcidHandler('user/union-raider', seaUnionRaiderFixture),
  datedOcidHandler('user/union-artifact', seaUnionArtifactFixture),
  datedOcidHandler('user/union-champion', seaUnionChampionFixture, {
    date: SEA_UNION_CHAMPION_DATE,
  }),

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
    const { searchParams } = new URL(request.url);
    return HttpResponse.json(
      searchParams.has('date')
        ? seaGuildBasicFixture
        : {
            ...seaGuildBasicFixture,
            date: null,
          },
    );
  }),
];
