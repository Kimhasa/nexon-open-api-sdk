import { http, HttpResponse } from 'msw';
import { twOcidResponseFixture } from '../../fixtures/maplestory-tw/ocid.fixture.js';
import { twCharacterBasicFixture } from '../../fixtures/maplestory-tw/character-basic.fixture.js';
import { twCharacterPopularityFixture } from '../../fixtures/maplestory-tw/character-popularity.fixture.js';
import { twCharacterStatFixture } from '../../fixtures/maplestory-tw/character-stat.fixture.js';
import { twCharacterHyperStatFixture } from '../../fixtures/maplestory-tw/character-hyper-stat.fixture.js';
import { twCharacterPropensityFixture } from '../../fixtures/maplestory-tw/character-propensity.fixture.js';
import { twCharacterAbilityFixture } from '../../fixtures/maplestory-tw/character-ability.fixture.js';
import { twCharacterItemEquipmentFixture } from '../../fixtures/maplestory-tw/character-item-equipment.fixture.js';
import { twCharacterCashItemEquipmentFixture } from '../../fixtures/maplestory-tw/character-cashitem-equipment.fixture.js';
import { twCharacterSymbolEquipmentFixture } from '../../fixtures/maplestory-tw/character-symbol-equipment.fixture.js';
import { twCharacterSetEffectFixture } from '../../fixtures/maplestory-tw/character-set-effect.fixture.js';
import { twCharacterBeautyEquipmentFixture } from '../../fixtures/maplestory-tw/character-beauty-equipment.fixture.js';
import { twCharacterAndroidEquipmentFixture } from '../../fixtures/maplestory-tw/character-android-equipment.fixture.js';
import { twCharacterPetEquipmentFixture } from '../../fixtures/maplestory-tw/character-pet-equipment.fixture.js';
import { twCharacterSkillFixture } from '../../fixtures/maplestory-tw/character-skill.fixture.js';
import { twCharacterLinkSkillFixture } from '../../fixtures/maplestory-tw/character-link-skill.fixture.js';
import { twCharacterVMatrixFixture } from '../../fixtures/maplestory-tw/character-vmatrix.fixture.js';
import { twCharacterHexaMatrixFixture } from '../../fixtures/maplestory-tw/character-hexamatrix.fixture.js';
import { twCharacterHexaMatrixStatFixture } from '../../fixtures/maplestory-tw/character-hexamatrix-stat.fixture.js';
import { twCharacterDojangFixture } from '../../fixtures/maplestory-tw/character-dojang.fixture.js';
import { twCharacterFamiliarFixture } from '../../fixtures/maplestory-tw/character-familiar.fixture.js';
import { twUnionFixture } from '../../fixtures/maplestory-tw/user-union.fixture.js';
import { twUnionRaiderFixture } from '../../fixtures/maplestory-tw/user-union-raider.fixture.js';
import { twUnionArtifactFixture } from '../../fixtures/maplestory-tw/user-union-artifact.fixture.js';
import { twUnionChampionFixture } from '../../fixtures/maplestory-tw/user-union-champion.fixture.js';
import { twGuildIdResponseFixture } from '../../fixtures/maplestory-tw/guild-id.fixture.js';
import { twGuildBasicFixture } from '../../fixtures/maplestory-tw/guild-basic.fixture.js';

const BASE = 'https://open.api.nexon.com/maplestorytw/v1';

export const mapleStoryTWHandlers = [
  http.get(`${BASE}/id`, () => HttpResponse.json(twOcidResponseFixture)),
  http.get(`${BASE}/character/basic`, () => HttpResponse.json(twCharacterBasicFixture)),
  http.get(`${BASE}/character/popularity`, () => HttpResponse.json(twCharacterPopularityFixture)),
  http.get(`${BASE}/character/stat`, () => HttpResponse.json(twCharacterStatFixture)),
  http.get(`${BASE}/character/hyper-stat`, () => HttpResponse.json(twCharacterHyperStatFixture)),
  http.get(`${BASE}/character/propensity`, () => HttpResponse.json(twCharacterPropensityFixture)),
  http.get(`${BASE}/character/ability`, () => HttpResponse.json(twCharacterAbilityFixture)),
  http.get(`${BASE}/character/item-equipment`, () =>
    HttpResponse.json(twCharacterItemEquipmentFixture),
  ),
  http.get(`${BASE}/character/cashitem-equipment`, () =>
    HttpResponse.json(twCharacterCashItemEquipmentFixture),
  ),
  http.get(`${BASE}/character/symbol-equipment`, () =>
    HttpResponse.json(twCharacterSymbolEquipmentFixture),
  ),
  http.get(`${BASE}/character/set-effect`, () => HttpResponse.json(twCharacterSetEffectFixture)),
  http.get(`${BASE}/character/beauty-equipment`, () =>
    HttpResponse.json(twCharacterBeautyEquipmentFixture),
  ),
  http.get(`${BASE}/character/android-equipment`, () =>
    HttpResponse.json(twCharacterAndroidEquipmentFixture),
  ),
  http.get(`${BASE}/character/pet-equipment`, () =>
    HttpResponse.json(twCharacterPetEquipmentFixture),
  ),
  http.get(`${BASE}/character/skill`, () => HttpResponse.json(twCharacterSkillFixture)),
  http.get(`${BASE}/character/link-skill`, () => HttpResponse.json(twCharacterLinkSkillFixture)),
  http.get(`${BASE}/character/vmatrix`, () => HttpResponse.json(twCharacterVMatrixFixture)),
  http.get(`${BASE}/character/hexamatrix`, () => HttpResponse.json(twCharacterHexaMatrixFixture)),
  http.get(`${BASE}/character/hexamatrix-stat`, () =>
    HttpResponse.json(twCharacterHexaMatrixStatFixture),
  ),
  http.get(`${BASE}/character/dojang`, () => HttpResponse.json(twCharacterDojangFixture)),
  http.get(`${BASE}/character/familiar`, () => HttpResponse.json(twCharacterFamiliarFixture)),
  http.get(`${BASE}/user/union`, () => HttpResponse.json(twUnionFixture)),
  http.get(`${BASE}/user/union-raider`, () => HttpResponse.json(twUnionRaiderFixture)),
  http.get(`${BASE}/user/union-artifact`, () => HttpResponse.json(twUnionArtifactFixture)),
  http.get(`${BASE}/user/union-champion`, () => HttpResponse.json(twUnionChampionFixture)),
  http.get(`${BASE}/guild/id`, () => HttpResponse.json(twGuildIdResponseFixture)),
  http.get(`${BASE}/guild/basic`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    return HttpResponse.json(
      searchParams.has('date')
        ? twGuildBasicFixture
        : {
            ...twGuildBasicFixture,
            date: null,
          },
    );
  }),
];
