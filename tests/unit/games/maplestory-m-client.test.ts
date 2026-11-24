import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NexonAuthError, NexonBadRequestError, NexonClient } from '../../../src/index.js';
import type { GuildId, OCID } from '../../../src/index.js';
import type { MapleStoryMClient } from '../../../src/games/maplestory-m/index.js';
import { MapleStoryMCharacterClient } from '../../../src/games/maplestory-m/character/MapleStoryMCharacterClient.js';
import { MapleStoryMUnionClient } from '../../../src/games/maplestory-m/union/MapleStoryMUnionClient.js';
import { MapleStoryMGuildClient } from '../../../src/games/maplestory-m/guild/MapleStoryMGuildClient.js';
import { MapleStoryMRankingClient } from '../../../src/games/maplestory-m/ranking/MapleStoryMRankingClient.js';
import { MapleStoryMNoticeClient } from '../../../src/games/maplestory-m/notice/MapleStoryMNoticeClient.js';
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
  M_RANKING_DATE,
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
import { server } from '../../mocks/server.js';

const BASE = 'https://open.api.nexon.com/maplestorym/v1';
const onResponseShapeMismatch = vi.fn();

function createClient(): MapleStoryMClient {
  return new NexonClient({
    apiKey: 'test-api-key',
    responseValidation: true,
    logger: { onResponseShapeMismatch },
  }).maplestorym;
}

const TEST_OCID = mOcidFixture.ocid as OCID;
const TEST_GUILD_ID = mGuildIdFixture.oguild_id as GuildId;

describe('MapleStoryMClient', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-02T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    const calls = onResponseShapeMismatch.mock.calls.slice();
    onResponseShapeMismatch.mockClear();
    expect(calls).toEqual([]);
  });

  describe('lazy getters', () => {
    it('character getter는 MapleStoryMCharacterClient를 반환한다', () => {
      const client = createClient();
      expect(client.character).toBeInstanceOf(MapleStoryMCharacterClient);
    });

    it('union getter는 MapleStoryMUnionClient를 반환한다', () => {
      const client = createClient();
      expect(client.union).toBeInstanceOf(MapleStoryMUnionClient);
    });

    it('guild getter는 MapleStoryMGuildClient를 반환한다', () => {
      const client = createClient();
      expect(client.guild).toBeInstanceOf(MapleStoryMGuildClient);
    });

    it('ranking getter는 MapleStoryMRankingClient를 반환한다', () => {
      const client = createClient();
      expect(client.ranking).toBeInstanceOf(MapleStoryMRankingClient);
    });

    it('notice getter는 MapleStoryMNoticeClient를 반환한다', () => {
      const client = createClient();
      expect(client.notice).toBeInstanceOf(MapleStoryMNoticeClient);
    });

    it('같은 getter는 같은 인스턴스를 반환한다', () => {
      const client = createClient();
      expect(client.character).toBe(client.character);
      expect(client.union).toBe(client.union);
      expect(client.guild).toBe(client.guild);
      expect(client.ranking).toBe(client.ranking);
      expect(client.notice).toBe(client.notice);
    });
  });

  describe('OCID', () => {
    it('getOcid 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.getOcid('챌린저스', '테스트캐릭터M')).resolves.toEqual(mOcidFixture.ocid);
    });
  });

  describe('character', () => {
    it('getBasic 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getBasic({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterBasicFixture,
      );
    });

    it('getStat 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getStat({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterStatFixture,
      );
    });

    it('getHyperStat 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getHyperStat({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterHyperStatFixture,
      );
    });

    it('getGuild 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getGuild({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterGuildFixture,
      );
    });

    it('getItemEquipment 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getItemEquipment({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterItemEquipmentFixture,
      );
    });

    it('getCashItemEquipment 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getCashItemEquipment({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterCashItemEquipmentFixture,
      );
    });

    it('getSymbol 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getSymbol({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterSymbolEquipmentFixture,
      );
    });

    it('getSetEffect 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getSetEffect({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterSetEffectFixture,
      );
    });

    it('getAndroidEquipment 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getAndroidEquipment({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterAndroidEquipmentFixture,
      );
    });

    it('getJewel 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getJewel({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterJewelFixture,
      );
    });

    it('getBeautyEquipment 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getBeautyEquipment({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterBeautyEquipmentFixture,
      );
    });

    it('getPetEquipment 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getPetEquipment({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterPetEquipmentFixture,
      );
    });

    it('getSkillEquipment 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getSkillEquipment({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterSkillEquipmentFixture,
      );
    });

    it('getLinkSkill 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getLinkSkill({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterLinkSkillFixture,
      );
    });

    it('getVMatrix 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getVMatrix({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterVMatrixFixture,
      );
    });

    it('getHexaMatrixSkill 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getHexaMatrixSkill({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterHexaMatrixSkillFixture,
      );
    });

    it('getHexaMatrixStat 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.character.getHexaMatrixStat({ ocid: TEST_OCID })).resolves.toEqual(
        mCharacterHexaMatrixStatFixture,
      );
    });
  });

  describe('union', () => {
    it('get 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.union.get({ ocid: TEST_OCID })).resolves.toEqual(mUnionFixture);
    });

    it('getRaider 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.union.getRaider({ ocid: TEST_OCID })).resolves.toEqual(
        mUnionRaiderFixture,
      );
    });

    it('getStat 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.union.getStat({ ocid: TEST_OCID })).resolves.toEqual(mUnionStatFixture);
    });
  });

  describe('guild', () => {
    it('getId 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.guild.getId('스카니아', '테스트길드M')).resolves.toEqual(
        mGuildIdFixture.oguild_id,
      );
    });

    it('getBasic 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.guild.getBasic({ oguild_id: TEST_GUILD_ID })).resolves.toEqual(
        mGuildBasicFixture,
      );
    });
  });

  describe('ranking', () => {
    it('랭킹 첫날은 KST 자정을 지나면 조회할 수 있다', async () => {
      vi.setSystemTime(new Date('2025-11-26T14:59:59.999Z'));
      const fetch = vi.spyOn(globalThis, 'fetch');
      const client = createClient();
      await expect(client.ranking.getLevel({ date: M_RANKING_DATE })).rejects.toMatchObject({
        code: 'OPENAPI00004',
      });
      expect(fetch).not.toHaveBeenCalled();
      vi.setSystemTime(new Date('2025-11-26T15:00:00Z'));
      await expect(client.ranking.getLevel({ date: '2025-11-26' })).rejects.toThrow(/2025-11-27/);
      expect(fetch).not.toHaveBeenCalled();
      await expect(client.ranking.getLevel({ date: M_RANKING_DATE })).resolves.toEqual(
        mLevelRankingFixture,
      );
    });

    it('getLevel 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getLevel({ date: M_RANKING_DATE })).resolves.toEqual(
        mLevelRankingFixture,
      );
    });

    it('getDojang 응답을 반환한다', async () => {
      const client = createClient();
      await expect(
        client.ranking.getDojang({ date: M_RANKING_DATE, world_name: '스카니아', page: 2 }),
      ).resolves.toEqual(mDojangRankingFixture);
    });

    it('getRootOfTime 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getRootOfTime({ date: M_RANKING_DATE })).resolves.toEqual(
        mRootOfTimeRankingFixture,
      );
    });

    it('getUnion 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getUnion({ date: M_RANKING_DATE })).resolves.toEqual(
        mUnionRankingFixture,
      );
    });

    it('getCombatPower 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getCombatPower({ date: M_RANKING_DATE })).resolves.toEqual(
        mCombatPowerRankingFixture,
      );
    });

    it('getKerningMTower 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getKerningMTower({ date: M_RANKING_DATE })).resolves.toEqual(
        mKerningMTowerRankingFixture,
      );
    });

    it('getAchievement 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getAchievement({ date: M_RANKING_DATE })).resolves.toEqual(
        mAchievementRankingFixture,
      );
    });

    it('getSharenianBattlefield 응답을 반환한다', async () => {
      const client = createClient();
      await expect(
        client.ranking.getSharenianBattlefield({ date: M_RANKING_DATE, ocid: TEST_OCID }),
      ).resolves.toEqual(mSharenianBattlefieldRankingFixture);
    });

    it('getSharenianWaterway 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.ranking.getSharenianWaterway({ date: M_RANKING_DATE })).resolves.toEqual(
        mSharenianWaterwayRankingFixture,
      );
    });
  });

  describe('notice', () => {
    it('getList 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.notice.getList()).resolves.toEqual(mNoticeListFixture);
    });

    it('getDetail 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.notice.getDetail(1001)).resolves.toEqual(mNoticeDetailFixture);
    });

    it('getPatchList 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.notice.getPatchList()).resolves.toEqual(mPatchNoticeListFixture);
    });

    it('getPatchDetail 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.notice.getPatchDetail(1002)).resolves.toEqual(mPatchNoticeDetailFixture);
    });

    it('getEventList 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.notice.getEventList()).resolves.toEqual(mEventNoticeListFixture);
    });

    it('getEventDetail 응답을 반환한다', async () => {
      const client = createClient();
      await expect(client.notice.getEventDetail(1003)).resolves.toEqual(mEventNoticeDetailFixture);
    });
  });

  it('403 응답을 NexonAuthError로 반환한다', async () => {
    server.use(
      http.get(`${BASE}/user/union-stat`, () =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00002', message: 'Invalid API key' } },
          { status: 403 },
        ),
      ),
    );

    await expect(createClient().union.getStat({ ocid: TEST_OCID })).rejects.toBeInstanceOf(
      NexonAuthError,
    );
  });

  it('이전 유니온 공격대 필드를 보존하고 지원 중단 경고를 출력한다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const legacyResponse = { ...mUnionRaiderFixture, use_preset_no: 1 };
    server.use(http.get(`${BASE}/user/union-raider`, () => HttpResponse.json(legacyResponse)));

    await expect(createClient().union.getRaider({ ocid: TEST_OCID })).resolves.toEqual(
      legacyResponse,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('use_preset_no'));
  });

  it('이전 V코어 필드를 보존하고 지원 중단 경고를 출력한다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const legacyResponse = {
      character_class: mCharacterVMatrixFixture.character_class,
      character_v_core_equipment: mCharacterVMatrixFixture.character_v_core_equipment.map(
        (core) => ({
          ...core,
          vcore_skill_name_1: '테스트 스킬',
        }),
      ),
    };
    server.use(http.get(`${BASE}/character/vmatrix`, () => HttpResponse.json(legacyResponse)));

    await expect(createClient().character.getVMatrix({ ocid: TEST_OCID })).resolves.toEqual(
      legacyResponse,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('vcore_skill_name1'));
  });

  it.each([
    ['빈 월드명', (client: MapleStoryMClient) => client.getOcid(' ', '테스트캐릭터M'), '월드명'],
    ['빈 캐릭터명', (client: MapleStoryMClient) => client.getOcid('스카니아', ''), '캐릭터명'],
    [
      '빈 캐릭터 식별자',
      (client: MapleStoryMClient) => client.character.getBasic({ ocid: '' as OCID }),
      'getOcid',
    ],
    [
      '빈 길드 식별자',
      (client: MapleStoryMClient) => client.guild.getBasic({ oguild_id: '' as GuildId }),
      'guild.getId',
    ],
    [
      '빈 유니온 캐릭터 식별자',
      (client: MapleStoryMClient) => client.union.getStat({ ocid: ' ' as OCID }),
      'getOcid',
    ],
    [
      '정수가 아닌 공지 식별자',
      (client: MapleStoryMClient) => client.notice.getDetail(1.5),
      'notice_id',
    ],
    [
      '빈 랭킹 기준일',
      (client: MapleStoryMClient) => client.ranking.getLevel({ date: '' }),
      'YYYY-MM-DD',
    ],
    [
      '동시에 지정한 월드명과 식별자',
      (client: MapleStoryMClient) =>
        client.ranking.getLevel({ date: M_RANKING_DATE, world_name: '스카니아', ocid: TEST_OCID }),
      'world_name과 ocid',
    ],
  ] as const)('%s 입력을 요청 전에 거부한다', async (_name, call, message) => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    const result = call(createClient());
    await expect(result).rejects.toThrow(NexonBadRequestError);
    await expect(result).rejects.toMatchObject({ code: 'OPENAPI00004' });
    await expect(result).rejects.toThrow(message);
    expect(fetch).not.toHaveBeenCalled();
  });
});
