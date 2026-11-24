import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import { mOcidFixture } from '../../fixtures/maplestory-m/ocid.fixture.js';
import { mCharacterBasicFixture } from '../../fixtures/maplestory-m/character-basic.fixture.js';
import {
  mCharacterStatFixture,
  mCharacterHyperStatFixture,
  mCharacterGuildFixture,
  mCharacterItemEquipmentFixture,
  mCharacterCashItemEquipmentFixture,
  mCharacterSymbolEquipmentFixture,
  mCharacterSetEffectFixture,
  mCharacterAndroidEquipmentFixture,
  mCharacterJewelFixture,
  mCharacterBeautyEquipmentFixture,
  mCharacterPetEquipmentFixture,
  mCharacterSkillEquipmentFixture,
  mCharacterLinkSkillFixture,
  mCharacterVMatrixFixture,
  mCharacterHexaMatrixSkillFixture,
  mCharacterHexaMatrixStatFixture,
} from '../../fixtures/maplestory-m/character.fixture.js';
import {
  mNoticeListFixture,
  mNoticeDetailFixture,
  mPatchNoticeListFixture,
  mPatchNoticeDetailFixture,
  mEventNoticeListFixture,
  mEventNoticeDetailFixture,
} from '../../fixtures/maplestory-m/notice.fixture.js';
import { mGuildIdFixture, mGuildBasicFixture } from '../../fixtures/maplestory-m/guild.fixture.js';
import {
  mUnionFixture,
  mUnionRaiderFixture,
  mUnionStatFixture,
} from '../../fixtures/maplestory-m/union.fixture.js';
import {
  mLevelRankingFixture,
  mDojangRankingFixture,
  mRootOfTimeRankingFixture,
  mUnionRankingFixture,
  mCombatPowerRankingFixture,
  mKerningMTowerRankingFixture,
  mAchievementRankingFixture,
  mSharenianBattlefieldRankingFixture,
  mSharenianWaterwayRankingFixture,
} from '../../fixtures/maplestory-m/ranking.fixture.js';

const BASE = 'https://open.api.nexon.com/maplestorym/v1';
const ocidQuery = { ocid: mOcidFixture.ocid };

function get(path: string, query: Readonly<Record<string, string>>, fixture: object): HttpHandler {
  return http.get(`${BASE}${path}`, ({ request }) => {
    if (!request.headers.get('x-nxopen-api-key')) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00002', message: 'Invalid or missing API key' } },
        { status: 403 },
      );
    }

    const params = new URL(request.url).searchParams;
    const expected = Object.entries(query);
    if (
      [...params].length !== expected.length ||
      expected.some(([key, value]) => params.get(key) !== value)
    ) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Unexpected query parameters' } },
        { status: 400 },
      );
    }

    return HttpResponse.json(fixture);
  });
}

export const mapleStoryMHandlers = [
  // OCID
  get('/id', { world_name: '챌린저스', character_name: '테스트캐릭터M' }, mOcidFixture),

  // Character
  get('/character/basic', ocidQuery, mCharacterBasicFixture),
  get('/character/stat', ocidQuery, mCharacterStatFixture),
  get('/character/hyper-stat', ocidQuery, mCharacterHyperStatFixture),
  get('/character/guild', ocidQuery, mCharacterGuildFixture),
  get('/character/item-equipment', ocidQuery, mCharacterItemEquipmentFixture),
  get('/character/cashitem-equipment', ocidQuery, mCharacterCashItemEquipmentFixture),
  get('/character/symbol', ocidQuery, mCharacterSymbolEquipmentFixture),
  get('/character/set-effect', ocidQuery, mCharacterSetEffectFixture),
  get('/character/android-equipment', ocidQuery, mCharacterAndroidEquipmentFixture),
  get('/character/jewel', ocidQuery, mCharacterJewelFixture),
  get('/character/beauty-equipment', ocidQuery, mCharacterBeautyEquipmentFixture),
  get('/character/pet-equipment', ocidQuery, mCharacterPetEquipmentFixture),
  get('/character/skill-equipment', ocidQuery, mCharacterSkillEquipmentFixture),
  get('/character/link-skill', ocidQuery, mCharacterLinkSkillFixture),
  get('/character/vmatrix', ocidQuery, mCharacterVMatrixFixture),
  get('/character/hexamatrix-skill', ocidQuery, mCharacterHexaMatrixSkillFixture),
  get('/character/hexamatrix-stat', ocidQuery, mCharacterHexaMatrixStatFixture),

  // Union
  get('/user/union', ocidQuery, mUnionFixture),
  get('/user/union-raider', ocidQuery, mUnionRaiderFixture),
  get('/user/union-stat', ocidQuery, mUnionStatFixture),

  // Guild
  get('/guild/id', { world_name: '스카니아', guild_name: '테스트길드M' }, mGuildIdFixture),
  get('/guild/basic', { oguild_id: mGuildIdFixture.oguild_id }, mGuildBasicFixture),

  // Ranking
  get('/ranking/level', { date: '2024-01-01' }, mLevelRankingFixture),
  get(
    '/ranking/dojang',
    { date: '2024-01-01', world_name: '스카니아', page: '2' },
    mDojangRankingFixture,
  ),
  get('/ranking/root-of-time', { date: '2024-01-01' }, mRootOfTimeRankingFixture),
  get('/ranking/union', { date: '2024-01-01' }, mUnionRankingFixture),
  get('/ranking/combat-power', { date: '2024-01-01' }, mCombatPowerRankingFixture),
  get('/ranking/kerning-m-tower', { date: '2024-01-01' }, mKerningMTowerRankingFixture),
  get('/ranking/achievement', { date: '2024-01-01' }, mAchievementRankingFixture),
  get(
    '/ranking/sharenian-battlefield',
    { date: '2024-01-01', ocid: mOcidFixture.ocid },
    mSharenianBattlefieldRankingFixture,
  ),
  get('/ranking/sharenian-waterway', { date: '2024-01-01' }, mSharenianWaterwayRankingFixture),

  // Notice
  get('/notice', {}, mNoticeListFixture),
  get('/notice/detail', { notice_id: '1001' }, mNoticeDetailFixture),
  get('/notice-patch', {}, mPatchNoticeListFixture),
  get('/notice-patch/detail', { notice_id: '1002' }, mPatchNoticeDetailFixture),
  get('/notice-event', {}, mEventNoticeListFixture),
  get('/notice-event/detail', { notice_id: '1003' }, mEventNoticeDetailFixture),
];
