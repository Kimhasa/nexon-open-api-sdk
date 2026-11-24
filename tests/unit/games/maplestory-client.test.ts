import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import type { JsonBodyType } from 'msw';
import { server } from '../../mocks/server.js';
import { _resetDeprecationWarnings } from '../../../src/core/deprecation/deprecation.js';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import type { HttpClientConfig } from '../../../src/core/http/http-types.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { MapleStoryClient } from '../../../src/games/maplestory/MapleStoryClient.js';
import { MapleStoryCharacterClient } from '../../../src/games/maplestory/character/MapleStoryCharacterClient.js';
import { MapleStoryUnionClient } from '../../../src/games/maplestory/union/MapleStoryUnionClient.js';
import { MapleStoryGuildClient } from '../../../src/games/maplestory/guild/MapleStoryGuildClient.js';
import { MapleStoryRankingClient } from '../../../src/games/maplestory/ranking/MapleStoryRankingClient.js';
import { MapleStoryHistoryClient } from '../../../src/games/maplestory/history/MapleStoryHistoryClient.js';
import { MapleStoryNoticeClient } from '../../../src/games/maplestory/notice/MapleStoryNoticeClient.js';
import { MapleStoryBattlePracticeClient } from '../../../src/games/maplestory/battle-practice/MapleStoryBattlePracticeClient.js';
import { MapleStorySchedulerClient } from '../../../src/games/maplestory/scheduler/MapleStorySchedulerClient.js';
import type { OCID } from '../../../src/games/_base/maple-base-types.js';
import type { GuildId } from '../../../src/games/_base/maple-base-types.js';
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
  characterRingReserveSkillEquipmentEmptyFixture,
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
  historySoulPotentialLastPageFixture,
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

const TEST_API_KEY = 'test-api-key';
const ROOT = 'https://open.api.nexon.com/maplestory';

const createMapleStoryClient = (config: Partial<HttpClientConfig> = {}): MapleStoryClient => {
  const http = new HttpClient({ apiKey: TEST_API_KEY, ...config });
  return new MapleStoryClient(http);
};

const TEST_OCID = ocidFixture.ocid as OCID;
const TEST_GUILD_ID = guildIdFixture.oguild_id as GuildId;
const TEST_REPLAY_ID = 'replay_0123456789abcdef';
const DATE = '2026-11-01';

/**
 * 다음 요청 1건의 URL·헤더를 기록하고 `body` 를 돌려주는 일회성 핸들러를 건다.
 * 선택 파라미터까지 스펙 이름 그대로 전달되는지 볼 때 쓴다.
 */
function captureRequest(
  path: string,
  body: JsonBodyType,
): { url: () => URL; headers: () => Headers } {
  let captured: Request | undefined;
  server.use(
    http.get(`${ROOT}${path}`, ({ request }) => {
      captured = request;
      return HttpResponse.json(body);
    }),
  );
  const get = (): Request => {
    if (!captured) throw new Error(`요청이 기록되지 않았습니다: ${path}`);
    return captured;
  };
  return { url: () => new URL(get().url), headers: () => get().headers };
}

/** [메서드 표기, 호출, 기대 응답] — public API 메서드 56개 전부 */
type MethodCase = readonly [string, (client: MapleStoryClient) => Promise<unknown>, unknown];

const METHOD_CASES: readonly MethodCase[] = [
  // 계정 / 식별자 (4)
  ['getOcid', (c) => c.getOcid('테스트캐릭터'), ocidFixture.ocid],
  ['getOuid', (c) => c.getOuid(), ouidFixture.ouid],
  ['getLegacyOuid', (c) => c.getLegacyOuid('legacy-api-key'), legacyOuidFixture.ouid],
  ['getAchievement', (c) => c.getAchievement(), achievementFixture],

  // 캐릭터 (23)
  ['character.getList', (c) => c.character.getList(), characterListFixture],
  ['character.getBasic', (c) => c.character.getBasic({ ocid: TEST_OCID }), characterBasicFixture],
  [
    'character.getPopularity',
    (c) => c.character.getPopularity({ ocid: TEST_OCID }),
    characterPopularityFixture,
  ],
  ['character.getStat', (c) => c.character.getStat({ ocid: TEST_OCID }), characterStatFixture],
  [
    'character.getHyperStat',
    (c) => c.character.getHyperStat({ ocid: TEST_OCID }),
    characterHyperStatFixture,
  ],
  [
    'character.getPropensity',
    (c) => c.character.getPropensity({ ocid: TEST_OCID }),
    characterPropensityFixture,
  ],
  [
    'character.getAbility',
    (c) => c.character.getAbility({ ocid: TEST_OCID }),
    characterAbilityFixture,
  ],
  [
    'character.getItemEquipment',
    (c) => c.character.getItemEquipment({ ocid: TEST_OCID }),
    characterItemEquipmentFixture,
  ],
  [
    'character.getCashItemEquipment',
    (c) => c.character.getCashItemEquipment({ ocid: TEST_OCID }),
    characterCashitemEquipmentFixture,
  ],
  [
    'character.getSymbolEquipment',
    (c) => c.character.getSymbolEquipment({ ocid: TEST_OCID }),
    characterSymbolEquipmentFixture,
  ],
  [
    'character.getSetEffect',
    (c) => c.character.getSetEffect({ ocid: TEST_OCID }),
    characterSetEffectFixture,
  ],
  [
    'character.getBeautyEquipment',
    (c) => c.character.getBeautyEquipment({ ocid: TEST_OCID }),
    characterBeautyEquipmentFixture,
  ],
  [
    'character.getAndroidEquipment',
    (c) => c.character.getAndroidEquipment({ ocid: TEST_OCID }),
    characterAndroidEquipmentFixture,
  ],
  [
    'character.getPetEquipment',
    (c) => c.character.getPetEquipment({ ocid: TEST_OCID }),
    characterPetEquipmentFixture,
  ],
  [
    'character.getSkill',
    (c) => c.character.getSkill({ ocid: TEST_OCID, character_skill_grade: '6' }),
    characterSkillFixture,
  ],
  [
    'character.getLinkSkill',
    (c) => c.character.getLinkSkill({ ocid: TEST_OCID }),
    characterLinkSkillFixture,
  ],
  [
    'character.getVMatrix',
    (c) => c.character.getVMatrix({ ocid: TEST_OCID }),
    characterVmatrixFixture,
  ],
  [
    'character.getHexaMatrix',
    (c) => c.character.getHexaMatrix({ ocid: TEST_OCID }),
    characterHexamatrixFixture,
  ],
  [
    'character.getHexaMatrixStat',
    (c) => c.character.getHexaMatrixStat({ ocid: TEST_OCID }),
    characterHexamatrixStatFixture,
  ],
  [
    'character.getDojang',
    (c) => c.character.getDojang({ ocid: TEST_OCID }),
    characterDojangFixture,
  ],
  [
    'character.getOtherStat',
    (c) => c.character.getOtherStat({ ocid: TEST_OCID }),
    characterOtherStatFixture,
  ],
  [
    'character.getRingExchangeSkillEquipment',
    (c) => c.character.getRingExchangeSkillEquipment({ ocid: TEST_OCID }),
    characterRingExchangeSkillEquipmentFixture,
  ],
  [
    'character.getRingReserveSkillEquipment',
    (c) => c.character.getRingReserveSkillEquipment({ ocid: TEST_OCID }),
    characterRingReserveSkillEquipmentFixture,
  ],

  // 유니온 (4)
  ['union.getUnion', (c) => c.union.getUnion({ ocid: TEST_OCID }), unionFixture],
  ['union.getRaider', (c) => c.union.getRaider({ ocid: TEST_OCID }), unionRaiderFixture],
  ['union.getArtifact', (c) => c.union.getArtifact({ ocid: TEST_OCID }), unionArtifactFixture],
  ['union.getChampion', (c) => c.union.getChampion({ ocid: TEST_OCID }), unionChampionFixture],

  // 길드 (2)
  ['guild.getId', (c) => c.guild.getId('테스트길드', '스카니아'), guildIdFixture.oguild_id],
  ['guild.getBasic', (c) => c.guild.getBasic({ oguild_id: TEST_GUILD_ID }), guildBasicFixture],

  // 확률 / 이력 (4)
  [
    'history.getStarforce',
    (c) => c.history.getStarforce({ count: 100, date: DATE }),
    starforceHistoryFixture,
  ],
  [
    'history.getPotential',
    (c) => c.history.getPotential({ count: 100, date: DATE }),
    historyPotentialFixture,
  ],
  ['history.getCube', (c) => c.history.getCube({ count: 100, date: DATE }), historyCubeFixture],
  [
    'history.getSoulPotential',
    (c) => c.history.getSoulPotential({ count: 100, date: DATE }),
    historySoulPotentialFixture,
  ],

  // 랭킹 (6)
  ['ranking.getOverall', (c) => c.ranking.getOverall({ date: DATE }), overallRankingFixture],
  ['ranking.getUnion', (c) => c.ranking.getUnion({ date: DATE }), rankingUnionFixture],
  [
    'ranking.getGuild',
    (c) => c.ranking.getGuild({ date: DATE, ranking_type: 0 }),
    rankingGuildFixture,
  ],
  [
    'ranking.getDojang',
    (c) => c.ranking.getDojang({ date: DATE, difficulty: 1 }),
    rankingDojangFixture,
  ],
  ['ranking.getTheSeed', (c) => c.ranking.getTheSeed({ date: DATE }), rankingTheseedFixture],
  [
    'ranking.getAchievement',
    (c) => c.ranking.getAchievement({ date: DATE }),
    rankingAchievementFixture,
  ],

  // 공지 (8)
  ['notice.getList', (c) => c.notice.getList(), noticeListFixture],
  ['notice.getDetail', (c) => c.notice.getDetail(1), noticeDetailFixture],
  ['notice.getUpdateList', (c) => c.notice.getUpdateList(), noticeUpdateFixture],
  ['notice.getUpdateDetail', (c) => c.notice.getUpdateDetail(1), noticeUpdateDetailFixture],
  ['notice.getEventList', (c) => c.notice.getEventList(), noticeEventFixture],
  ['notice.getEventDetail', (c) => c.notice.getEventDetail(1), noticeEventDetailFixture],
  ['notice.getCashshopList', (c) => c.notice.getCashshopList(), noticeCashshopFixture],
  ['notice.getCashshopDetail', (c) => c.notice.getCashshopDetail(1), noticeCashshopDetailFixture],

  // 연무장 (4)
  [
    'battlePractice.getReplayId',
    (c) => c.battlePractice.getReplayId({ ocid: TEST_OCID }),
    battlePracticeReplayIdFixture,
  ],
  [
    'battlePractice.getResult',
    (c) => c.battlePractice.getResult({ replay_id: TEST_REPLAY_ID }),
    battlePracticeResultFixture,
  ],
  [
    'battlePractice.getSkillTimeline',
    (c) => c.battlePractice.getSkillTimeline({ replay_id: TEST_REPLAY_ID }),
    battlePracticeSkillTimelineFixture,
  ],
  [
    'battlePractice.getCharacterInfo',
    (c) => c.battlePractice.getCharacterInfo({ replay_id: TEST_REPLAY_ID }),
    battlePracticeCharacterInfoFixture,
  ],

  // 스케줄러 (1)
  [
    'scheduler.getCharacterState',
    (c) => c.scheduler.getCharacterState({ ocid: TEST_OCID }),
    schedulerCharacterStateFixture,
  ],
];

describe('MapleStoryClient', () => {
  describe('lazy getters', () => {
    it('character getter는 MapleStoryCharacterClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.character).toBeInstanceOf(MapleStoryCharacterClient);
    });

    it('union getter는 MapleStoryUnionClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.union).toBeInstanceOf(MapleStoryUnionClient);
    });

    it('guild getter는 MapleStoryGuildClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.guild).toBeInstanceOf(MapleStoryGuildClient);
    });

    it('ranking getter는 MapleStoryRankingClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.ranking).toBeInstanceOf(MapleStoryRankingClient);
    });

    it('history getter는 MapleStoryHistoryClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.history).toBeInstanceOf(MapleStoryHistoryClient);
    });

    it('notice getter는 MapleStoryNoticeClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.notice).toBeInstanceOf(MapleStoryNoticeClient);
    });

    it('battlePractice getter는 MapleStoryBattlePracticeClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.battlePractice).toBeInstanceOf(MapleStoryBattlePracticeClient);
    });

    it('scheduler getter는 MapleStorySchedulerClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.scheduler).toBeInstanceOf(MapleStorySchedulerClient);
    });

    it('같은 getter는 같은 인스턴스를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.character).toBe(client.character);
      expect(client.union).toBe(client.union);
      expect(client.guild).toBe(client.guild);
      expect(client.ranking).toBe(client.ranking);
      expect(client.history).toBe(client.history);
      expect(client.notice).toBe(client.notice);
      expect(client.battlePractice).toBe(client.battlePractice);
      expect(client.scheduler).toBe(client.scheduler);
    });
  });

  describe('성공 경로 — 모든 public 메서드', () => {
    it('public API 메서드 56개를 모두 다룬다', () => {
      expect(METHOD_CASES).toHaveLength(56);
      expect(new Set(METHOD_CASES.map(([name]) => name)).size).toBe(56);
    });

    // 기본 핸들러가 스펙의 경로·필수 파라미터·허용 파라미터를 검사하므로,
    // 응답이 fixture와 같다는 것은 요청이 스펙 계약대로 나갔다는 뜻이다.
    it.each(METHOD_CASES)(
      '%s — 스펙 경로로 요청하고 응답을 그대로 반환한다',
      async (_n, call, expected) => {
        const client = createMapleStoryClient();
        await expect(call(client)).resolves.toEqual(expected);
      },
    );

    it.each(METHOD_CASES)('%s — 응답 shape descriptor가 스펙 응답과 일치한다', async (_n, call) => {
      const mismatches: ShapeMismatch[] = [];
      const client = createMapleStoryClient({
        responseValidation: true,
        logger: { onResponseShapeMismatch: (m) => mismatches.push(m) },
      });
      await call(client);
      expect(mismatches).toEqual([]);
    });
  });

  describe('요청 파라미터 — 스펙 이름 그대로 전달', () => {
    it('getOcid — character_name 과 API 키 헤더를 보낸다', async () => {
      const captured = captureRequest('/v1/id', ocidFixture);
      await createMapleStoryClient().getOcid('테스트캐릭터');

      expect(captured.url().pathname).toBe('/maplestory/v1/id');
      expect(captured.url().searchParams.get('character_name')).toBe('테스트캐릭터');
      expect(captured.headers().get('x-nxopen-api-key')).toBe(TEST_API_KEY);
    });

    it('character.getBasic — date 를 생략하면 쿼리에 넣지 않는다', async () => {
      const captured = captureRequest('/v1/character/basic', characterBasicFixture);
      await createMapleStoryClient().character.getBasic({ ocid: TEST_OCID });

      expect([...captured.url().searchParams.keys()]).toEqual(['ocid']);
    });

    it('character.getBasic — date 를 그대로 전달한다', async () => {
      const captured = captureRequest('/v1/character/basic', characterBasicFixture);
      await createMapleStoryClient().character.getBasic({ ocid: TEST_OCID, date: DATE });

      expect(captured.url().searchParams.get('ocid')).toBe(TEST_OCID);
      expect(captured.url().searchParams.get('date')).toBe(DATE);
    });

    it('character.getSkill — character_skill_grade 를 전달한다', async () => {
      const captured = captureRequest('/v1/character/skill', characterSkillFixture);
      await createMapleStoryClient().character.getSkill({
        ocid: TEST_OCID,
        character_skill_grade: 'hyperpassive',
      });

      expect(captured.url().searchParams.get('character_skill_grade')).toBe('hyperpassive');
    });

    it('guild.getBasic — oguild_id 와 date 를 전달한다', async () => {
      const captured = captureRequest('/v1/guild/basic', guildBasicFixture);
      await createMapleStoryClient().guild.getBasic({ oguild_id: TEST_GUILD_ID, date: DATE });

      expect(Object.fromEntries(captured.url().searchParams)).toEqual({
        oguild_id: TEST_GUILD_ID,
        date: DATE,
      });
    });

    it('history.getSoulPotential — count 와 cursor 를 전달한다', async () => {
      const captured = captureRequest(
        '/v1/history/soul-potential',
        historySoulPotentialLastPageFixture,
      );
      const result = await createMapleStoryClient().history.getSoulPotential({
        count: 10,
        cursor: 'next_cursor_abc123',
      });

      expect(Object.fromEntries(captured.url().searchParams)).toEqual({
        count: '10',
        cursor: 'next_cursor_abc123',
      });
      expect(result.next_cursor).toBeNull();
      expect(result.soul_potential_history).toEqual([]);
    });

    it('ranking.getOverall — 선택 파라미터를 모두 스펙 이름으로 전달한다', async () => {
      const captured = captureRequest('/v1/ranking/overall', overallRankingFixture);
      await createMapleStoryClient().ranking.getOverall({
        date: DATE,
        world_name: '스카니아',
        world_type: 0,
        class: '마법사-아크메이지(불,독)',
        ocid: TEST_OCID,
        page: 2,
      });

      expect(Object.fromEntries(captured.url().searchParams)).toEqual({
        date: DATE,
        world_name: '스카니아',
        world_type: '0',
        class: '마법사-아크메이지(불,독)',
        ocid: TEST_OCID,
        page: '2',
      });
    });

    it('ranking.getGuild — ranking_type·guild_name·page 를 전달한다', async () => {
      const captured = captureRequest('/v1/ranking/guild', rankingGuildFixture);
      await createMapleStoryClient().ranking.getGuild({
        date: DATE,
        world_name: '스카니아',
        ranking_type: 2,
        guild_name: '테스트길드',
        page: 3,
      });

      expect(Object.fromEntries(captured.url().searchParams)).toEqual({
        date: DATE,
        world_name: '스카니아',
        ranking_type: '2',
        guild_name: '테스트길드',
        page: '3',
      });
    });

    it('ranking.getGuild — 폐지된 ocid는 서버로 보내지 않고 한 번만 경고한다', async () => {
      const captured = captureRequest('/v1/ranking/guild', rankingGuildFixture);
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      _resetDeprecationWarnings();
      try {
        const ranking = createMapleStoryClient().ranking;
        const params = { date: DATE, ranking_type: 2 as const, guild_name: '테스트길드' };
        await ranking.getGuild(params);
        expect(warn).not.toHaveBeenCalled();
        for (let attempt = 0; attempt < 2; attempt += 1) {
          await ranking.getGuild({ ...params, ocid: TEST_OCID });
          expect(captured.url().searchParams.has('ocid')).toBe(false);
          expect(captured.url().searchParams.get('guild_name')).toBe('테스트길드');
        }
        expect(warn).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('guild_name'));
      } finally {
        warn.mockRestore();
        _resetDeprecationWarnings();
      }
    });

    it('ranking.getDojang — difficulty 0 도 누락 없이 전달한다', async () => {
      const captured = captureRequest('/v1/ranking/dojang', rankingDojangFixture);
      await createMapleStoryClient().ranking.getDojang({ date: DATE, difficulty: 0 });

      expect(captured.url().searchParams.get('difficulty')).toBe('0');
    });

    it('notice.getEventDetail — notice_id 를 전달한다', async () => {
      const captured = captureRequest('/v1/notice-event/detail', noticeEventDetailFixture);
      await createMapleStoryClient().notice.getEventDetail(1234);

      expect(captured.url().pathname).toBe('/maplestory/v1/notice-event/detail');
      expect(captured.url().searchParams.get('notice_id')).toBe('1234');
    });

    it('battlePractice.getSkillTimeline — replay_id 와 page_no 를 전달한다', async () => {
      const captured = captureRequest(
        '/v1/battle-practice/skill-timeline',
        battlePracticeSkillTimelineFixture,
      );
      await createMapleStoryClient().battlePractice.getSkillTimeline({
        replay_id: TEST_REPLAY_ID,
        page_no: 2,
      });

      expect(Object.fromEntries(captured.url().searchParams)).toEqual({
        replay_id: TEST_REPLAY_ID,
        page_no: '2',
      });
    });

    it('scheduler.getCharacterState — ocid 와 date 를 전달한다', async () => {
      const captured = captureRequest(
        '/v1/scheduler/character-state',
        schedulerCharacterStateFixture,
      );
      await createMapleStoryClient().scheduler.getCharacterState({ ocid: TEST_OCID, date: DATE });

      expect(Object.fromEntries(captured.url().searchParams)).toEqual({
        ocid: TEST_OCID,
        date: DATE,
      });
    });
  });

  describe('getLegacyOuid', () => {
    it('구 API 키를 x-nxopen-legacy-api-key 헤더로만 보낸다', async () => {
      const captured = captureRequest('/legacy/ouid', legacyOuidFixture);
      const ouid = await createMapleStoryClient().getLegacyOuid('legacy-api-key');

      expect(ouid).toBe(legacyOuidFixture.ouid);
      expect(captured.url().pathname).toBe('/maplestory/legacy/ouid');
      expect(captured.headers().get('x-nxopen-legacy-api-key')).toBe('legacy-api-key');
      expect(captured.headers().get('x-nxopen-api-key')).toBeNull();
    });

    it('이후의 일반 요청은 계속 x-nxopen-api-key 를 쓴다', async () => {
      const client = createMapleStoryClient();
      await client.getLegacyOuid('legacy-api-key');

      const captured = captureRequest('/v1/ouid', ouidFixture);
      await client.getOuid();

      expect(captured.headers().get('x-nxopen-api-key')).toBe(TEST_API_KEY);
      expect(captured.headers().get('x-nxopen-legacy-api-key')).toBeNull();
    });

    it('기본 핸들러(구 키 헤더만 허용)에서도 성공한다', async () => {
      // 기본 핸들러는 x-nxopen-api-key 가 함께 오면 400을 돌려준다
      await expect(createMapleStoryClient().getLegacyOuid('legacy-api-key')).resolves.toBe(
        legacyOuidFixture.ouid,
      );
    });

    it('공유 HttpClient의 인터셉터·로거·재시도 설정이 적용된다', async () => {
      let calls = 0;
      server.use(
        http.get(`${ROOT}/legacy/ouid`, ({ request }) => {
          calls++;
          if (calls === 1) {
            return HttpResponse.json(
              { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
              { status: 429 },
            );
          }
          // 재시도 요청에도 포털 키가 섞이면 안 된다
          if (request.headers.get('x-nxopen-api-key')) {
            return HttpResponse.json(
              { error: { name: 'OPENAPI00004', message: 'unexpected api key' } },
              { status: 400 },
            );
          }
          return HttpResponse.json(legacyOuidFixture);
        }),
      );

      const requests: string[] = [];
      const retries: number[] = [];
      const interceptedHeaders: Array<Record<string, string>> = [];
      const sharedHttp = new HttpClient({
        apiKey: TEST_API_KEY,
        maxRetries: 1,
        retryBaseDelayMs: 1,
        logger: {
          onRequest: (req) => requests.push(req.url),
          onRetry: (info) => retries.push(info.attempt),
        },
      });
      sharedHttp.addRequestInterceptor((req) => {
        interceptedHeaders.push(req.headers);
        return req;
      });

      const ouid = await new MapleStoryClient(sharedHttp).getLegacyOuid('legacy-api-key');

      expect(ouid).toBe(legacyOuidFixture.ouid);
      expect(calls).toBe(2);
      expect(retries).toEqual([1]);
      expect(requests).toEqual([`${ROOT}/legacy/ouid`]);
      expect(interceptedHeaders).toEqual([
        { Accept: 'application/json', 'x-nxopen-legacy-api-key': 'legacy-api-key' },
      ]);
    });

    it('설정한 maxRetries 를 넘으면 NexonRateLimitError를 던진다', async () => {
      let calls = 0;
      server.use(
        http.get(`${ROOT}/legacy/ouid`, () => {
          calls++;
          return HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          );
        }),
      );

      await expect(
        createMapleStoryClient({ maxRetries: 0 }).getLegacyOuid('legacy-api-key'),
      ).rejects.toBeInstanceOf(NexonRateLimitError);
      expect(calls).toBe(1);
    });

    it('구 API 키가 거부되면 NexonAuthError를 던진다', async () => {
      server.use(
        http.get(`${ROOT}/legacy/ouid`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(createMapleStoryClient().getLegacyOuid('wrong-key')).rejects.toBeInstanceOf(
        NexonAuthError,
      );
    });
  });

  describe('nullable 응답', () => {
    it('character.getRingReserveSkillEquipment — 반지 미장착 시 null 필드를 그대로 반환한다', async () => {
      server.use(
        http.get(`${ROOT}/v1/character/ring-reserve-skill-equipment`, () =>
          HttpResponse.json(characterRingReserveSkillEquipmentEmptyFixture),
        ),
      );
      const result = await createMapleStoryClient().character.getRingReserveSkillEquipment({
        ocid: TEST_OCID,
      });

      expect(result.special_ring_reserve_name).toBeNull();
      expect(result.special_ring_reserve_level).toBe(0);
    });
  });

  describe('에러 경로', () => {
    it('400 OPENAPI00004 → NexonBadRequestError', async () => {
      server.use(
        http.get(`${ROOT}/v1/battle-practice/result`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
            { status: 400 },
          ),
        ),
      );

      const error: unknown = await createMapleStoryClient()
        .battlePractice.getResult({ replay_id: 'unknown-replay' })
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(NexonBadRequestError);
      expect((error as NexonBadRequestError).status).toBe(400);
      expect((error as NexonBadRequestError).code).toBe('OPENAPI00004');
    });

    it('403 OPENAPI00002 → NexonAuthError', async () => {
      server.use(
        http.get(`${ROOT}/v1/scheduler/character-state`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(
        createMapleStoryClient().scheduler.getCharacterState({ ocid: TEST_OCID }),
      ).rejects.toBeInstanceOf(NexonAuthError);
    });

    it('429 OPENAPI00007 → 재시도 후 NexonRateLimitError', async () => {
      let calls = 0;
      server.use(
        http.get(`${ROOT}/v1/history/soul-potential`, () => {
          calls++;
          return HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          );
        }),
      );

      await expect(
        createMapleStoryClient({ maxRetries: 1, retryBaseDelayMs: 1 }).history.getSoulPotential({
          count: 100,
          date: DATE,
        }),
      ).rejects.toBeInstanceOf(NexonRateLimitError);
      expect(calls).toBe(2);
    });
  });

  describe('SDK 입력 검증 — 요청 전에 즉시 throw', () => {
    /** 요청이 실제로 나가면 실패하도록, 대상 경로에 500을 돌려주는 핸들러를 건다 */
    const failIfRequested = (path: string): void => {
      server.use(
        http.get(`${ROOT}${path}`, () => {
          throw new Error(`요청이 나가면 안 됩니다: ${path}`);
        }),
      );
    };

    it('getOcid — 빈 캐릭터명', async () => {
      failIfRequested('/v1/id');
      const error: unknown = await createMapleStoryClient()
        .getOcid('  ')
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(NexonBadRequestError);
      expect((error as NexonBadRequestError).message).toContain('characterName');
      expect((error as NexonBadRequestError).code).toBe('OPENAPI00004');
    });

    it('getLegacyOuid — 빈 구 API 키', async () => {
      failIfRequested('/legacy/ouid');
      await expect(createMapleStoryClient().getLegacyOuid('')).rejects.toBeInstanceOf(
        NexonBadRequestError,
      );
    });

    it('character.getRingReserveSkillEquipment — 빈 ocid', async () => {
      failIfRequested('/v1/character/ring-reserve-skill-equipment');
      await expect(
        createMapleStoryClient().character.getRingReserveSkillEquipment({ ocid: '' as OCID }),
      ).rejects.toThrow(/ocid.*getOcid/s);
    });

    it('history.getSoulPotential — count 범위 밖', async () => {
      failIfRequested('/v1/history/soul-potential');
      await expect(
        createMapleStoryClient().history.getSoulPotential({ count: 5, date: DATE }),
      ).rejects.toThrow(/count.*10~1000/s);
    });

    it('history.getSoulPotential — date 와 cursor 가 모두 없음', async () => {
      failIfRequested('/v1/history/soul-potential');
      await expect(
        createMapleStoryClient().history.getSoulPotential({ count: 100 }),
      ).rejects.toThrow(/date와 cursor/);
    });

    it('battlePractice.getReplayId — 빈 ocid', async () => {
      failIfRequested('/v1/battle-practice/replay-id');
      await expect(
        createMapleStoryClient().battlePractice.getReplayId({ ocid: '' as OCID }),
      ).rejects.toBeInstanceOf(NexonBadRequestError);
    });

    it.each([
      ['getResult', '/v1/battle-practice/result'],
      ['getSkillTimeline', '/v1/battle-practice/skill-timeline'],
      ['getCharacterInfo', '/v1/battle-practice/character-info'],
    ] as const)('battlePractice.%s — 빈 replay_id', async (method, path) => {
      failIfRequested(path);
      await expect(
        createMapleStoryClient().battlePractice[method]({ replay_id: '' }),
      ).rejects.toThrow(/replay_id.*getReplayId/s);
    });

    it('battlePractice.getSkillTimeline — page_no 가 1 미만', async () => {
      failIfRequested('/v1/battle-practice/skill-timeline');
      await expect(
        createMapleStoryClient().battlePractice.getSkillTimeline({
          replay_id: TEST_REPLAY_ID,
          page_no: 0,
        }),
      ).rejects.toThrow(/page_no/);
    });

    it('scheduler.getCharacterState — 빈 ocid', async () => {
      failIfRequested('/v1/scheduler/character-state');
      await expect(
        createMapleStoryClient().scheduler.getCharacterState({ ocid: '' as OCID }),
      ).rejects.toBeInstanceOf(NexonBadRequestError);
    });
  });
});
