import { http, HttpResponse } from 'msw';
import type { JsonBodyType, RequestHandler } from 'msw';
import { ocidFixture } from '../../fixtures/maplestory/ocid.fixture.js';
import { characterBasicFixture } from '../../fixtures/maplestory/character-basic.fixture.js';
import {
  characterAbilityFixture,
  characterAndroidEquipmentFixture,
  characterBeautyEquipmentFixture,
  characterCashitemEquipmentFixture,
  characterDojangFixture,
  characterHexamatrixFixture,
  characterHexamatrixStatFixture,
  characterHyperStatFixture,
  characterItemEquipmentFixture,
  characterLinkSkillFixture,
  characterOtherStatFixture,
  characterPetEquipmentFixture,
  characterPopularityFixture,
  characterPropensityFixture,
  characterRingExchangeSkillEquipmentFixture,
  characterRingReserveSkillEquipmentFixture,
  characterSetEffectFixture,
  characterSkillFixture,
  characterStatFixture,
  characterSymbolEquipmentFixture,
  characterVmatrixFixture,
} from '../../fixtures/maplestory/character.fixture.js';
import {
  achievementFixture,
  characterListFixture,
  legacyOuidFixture,
  ouidFixture,
} from '../../fixtures/maplestory/user.fixture.js';
import {
  unionArtifactFixture,
  unionChampionFixture,
  unionFixture,
  unionRaiderFixture,
} from '../../fixtures/maplestory/union.fixture.js';
import { guildIdFixture, guildBasicFixture } from '../../fixtures/maplestory/guild.fixture.js';
import {
  overallRankingFixture,
  rankingAchievementFixture,
  rankingDojangFixture,
  rankingGuildFixture,
  rankingTheseedFixture,
  rankingUnionFixture,
} from '../../fixtures/maplestory/ranking.fixture.js';
import {
  historyCubeFixture,
  historyPotentialFixture,
  historySoulPotentialFixture,
  starforceHistoryFixture,
} from '../../fixtures/maplestory/history.fixture.js';
import {
  noticeCashshopDetailFixture,
  noticeCashshopFixture,
  noticeDetailFixture,
  noticeEventDetailFixture,
  noticeEventFixture,
  noticeListFixture,
  noticeUpdateDetailFixture,
  noticeUpdateFixture,
} from '../../fixtures/maplestory/notice.fixture.js';
import {
  battlePracticeCharacterInfoFixture,
  battlePracticeReplayIdFixture,
  battlePracticeResultFixture,
  battlePracticeSkillTimelineFixture,
} from '../../fixtures/maplestory/battle-practice.fixture.js';
import { schedulerCharacterStateFixture } from '../../fixtures/maplestory/scheduler.fixture.js';

const ROOT = 'https://open.api.nexon.com/maplestory';

const badRequest = (message: string): ReturnType<typeof HttpResponse.json> =>
  HttpResponse.json({ error: { name: 'OPENAPI00004', message } }, { status: 400 });

const forbidden = (): ReturnType<typeof HttpResponse.json> =>
  HttpResponse.json(
    { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
    { status: 403 },
  );

/**
 * 스펙의 쿼리 파라미터 계약을 그대로 검사하는 핸들러를 만든다.
 *
 * `query` 는 포털 YAML의 query 파라미터 목록이다 (`*` = required).
 * 필수 파라미터가 빠지거나 스펙에 없는 파라미터를 보내면 400을 돌려주므로,
 * SDK가 스펙과 다른 이름으로 요청하면 테스트가 실패한다.
 */
function specHandler(path: string, query: string, body: JsonBodyType): RequestHandler {
  const params = query === '' ? [] : query.split(',');
  const required = params.filter((p) => p.endsWith('*')).map((p) => p.slice(0, -1));
  const allowed = new Set(params.map((p) => p.replace(/\*$/, '')));

  return http.get(`${ROOT}${path}`, ({ request }) => {
    if (!request.headers.get('x-nxopen-api-key')) return forbidden();
    const search = new URL(request.url).searchParams;
    for (const name of required) {
      if (!search.get(name)) return badRequest(`Missing required parameter: ${name}`);
    }
    for (const name of search.keys()) {
      if (!allowed.has(name)) return badRequest(`Unknown parameter: ${name}`);
    }
    return HttpResponse.json(body);
  });
}

export const mapleStoryHandlers: RequestHandler[] = [
  // ─── 계정 / 식별자 ───
  specHandler('/v1/id', 'character_name*', ocidFixture),
  specHandler('/v1/ouid', '', ouidFixture),
  specHandler('/v1/user/achievement', '', achievementFixture),
  // 구 API KEY 전용 경로: x-nxopen-legacy-api-key 만 받고 x-nxopen-api-key 는 보내지 않아야 한다
  http.get(`${ROOT}/legacy/ouid`, ({ request }) => {
    if (!request.headers.get('x-nxopen-legacy-api-key')) return forbidden();
    if (request.headers.get('x-nxopen-api-key')) {
      return badRequest('x-nxopen-api-key must not be sent to the legacy endpoint');
    }
    return HttpResponse.json(legacyOuidFixture);
  }),

  // ─── 캐릭터 ───
  specHandler('/v1/character/list', '', characterListFixture),
  specHandler('/v1/character/basic', 'ocid*,date', characterBasicFixture),
  specHandler('/v1/character/popularity', 'ocid*,date', characterPopularityFixture),
  specHandler('/v1/character/stat', 'ocid*,date', characterStatFixture),
  specHandler('/v1/character/hyper-stat', 'ocid*,date', characterHyperStatFixture),
  specHandler('/v1/character/propensity', 'ocid*,date', characterPropensityFixture),
  specHandler('/v1/character/ability', 'ocid*,date', characterAbilityFixture),
  specHandler('/v1/character/item-equipment', 'ocid*,date', characterItemEquipmentFixture),
  specHandler('/v1/character/cashitem-equipment', 'ocid*,date', characterCashitemEquipmentFixture),
  specHandler('/v1/character/symbol-equipment', 'ocid*,date', characterSymbolEquipmentFixture),
  specHandler('/v1/character/set-effect', 'ocid*,date', characterSetEffectFixture),
  specHandler('/v1/character/beauty-equipment', 'ocid*,date', characterBeautyEquipmentFixture),
  specHandler('/v1/character/android-equipment', 'ocid*,date', characterAndroidEquipmentFixture),
  specHandler('/v1/character/pet-equipment', 'ocid*,date', characterPetEquipmentFixture),
  specHandler('/v1/character/skill', 'ocid*,date,character_skill_grade*', characterSkillFixture),
  specHandler('/v1/character/link-skill', 'ocid*,date', characterLinkSkillFixture),
  specHandler('/v1/character/vmatrix', 'ocid*,date', characterVmatrixFixture),
  specHandler('/v1/character/hexamatrix', 'ocid*,date', characterHexamatrixFixture),
  specHandler('/v1/character/hexamatrix-stat', 'ocid*,date', characterHexamatrixStatFixture),
  specHandler('/v1/character/dojang', 'ocid*,date', characterDojangFixture),
  specHandler('/v1/character/other-stat', 'ocid*,date', characterOtherStatFixture),
  specHandler(
    '/v1/character/ring-exchange-skill-equipment',
    'ocid*,date',
    characterRingExchangeSkillEquipmentFixture,
  ),
  specHandler(
    '/v1/character/ring-reserve-skill-equipment',
    'ocid*,date',
    characterRingReserveSkillEquipmentFixture,
  ),

  // ─── 유니온 ───
  specHandler('/v1/user/union', 'ocid*,date', unionFixture),
  specHandler('/v1/user/union-raider', 'ocid*,date', unionRaiderFixture),
  specHandler('/v1/user/union-artifact', 'ocid*,date', unionArtifactFixture),
  specHandler('/v1/user/union-champion', 'ocid*,date', unionChampionFixture),

  // ─── 길드 ───
  specHandler('/v1/guild/id', 'guild_name*,world_name*', guildIdFixture),
  specHandler('/v1/guild/basic', 'oguild_id*,date', guildBasicFixture),

  // ─── 확률 / 이력 ───
  specHandler('/v1/history/starforce', 'count*,date,cursor', starforceHistoryFixture),
  specHandler('/v1/history/potential', 'count*,date,cursor', historyPotentialFixture),
  specHandler('/v1/history/cube', 'count*,date,cursor', historyCubeFixture),
  specHandler('/v1/history/soul-potential', 'count*,date,cursor', historySoulPotentialFixture),

  // ─── 랭킹 ───
  specHandler(
    '/v1/ranking/overall',
    'date*,world_name,world_type,class,ocid,page',
    overallRankingFixture,
  ),
  specHandler('/v1/ranking/union', 'date*,world_name,ocid,page', rankingUnionFixture),
  specHandler(
    '/v1/ranking/guild',
    'date*,world_name,ranking_type*,guild_name,page',
    rankingGuildFixture,
  ),
  specHandler(
    '/v1/ranking/dojang',
    'date*,world_name,difficulty*,class,ocid,page',
    rankingDojangFixture,
  ),
  specHandler('/v1/ranking/theseed', 'date*,world_name,ocid,page', rankingTheseedFixture),
  specHandler('/v1/ranking/achievement', 'date*,ocid,page', rankingAchievementFixture),

  // ─── 공지 ───
  specHandler('/v1/notice', '', noticeListFixture),
  specHandler('/v1/notice/detail', 'notice_id*', noticeDetailFixture),
  specHandler('/v1/notice-update', '', noticeUpdateFixture),
  specHandler('/v1/notice-update/detail', 'notice_id*', noticeUpdateDetailFixture),
  specHandler('/v1/notice-event', '', noticeEventFixture),
  specHandler('/v1/notice-event/detail', 'notice_id*', noticeEventDetailFixture),
  specHandler('/v1/notice-cashshop', '', noticeCashshopFixture),
  specHandler('/v1/notice-cashshop/detail', 'notice_id*', noticeCashshopDetailFixture),

  // ─── 연무장 ───
  specHandler('/v1/battle-practice/replay-id', 'ocid*', battlePracticeReplayIdFixture),
  specHandler('/v1/battle-practice/result', 'replay_id*', battlePracticeResultFixture),
  specHandler(
    '/v1/battle-practice/skill-timeline',
    'replay_id*,page_no',
    battlePracticeSkillTimelineFixture,
  ),
  specHandler(
    '/v1/battle-practice/character-info',
    'replay_id*',
    battlePracticeCharacterInfoFixture,
  ),

  // ─── 스케줄러 ───
  specHandler('/v1/scheduler/character-state', 'ocid*,date', schedulerCharacterStateFixture),
];
