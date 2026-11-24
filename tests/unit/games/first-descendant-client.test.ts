import { describe, it, expect } from 'vitest';
import { http as mswHttp, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { NexonServerError } from '../../../src/core/errors/NexonServerError.js';
import { FirstDescendantClient } from '../../../src/games/first-descendant/FirstDescendantClient.js';
import type { TfdOuid } from '../../../src/games/first-descendant/types.js';
import { server } from '../../mocks/server.js';
import {
  TFD_TEST_OUID,
  TFD_TEST_USER_NAME,
  tfdUserArcheTuningFixture,
  tfdUserBasicFixture,
  tfdUserDescendantFixture,
  tfdUserExternalComponentFixture,
  tfdUserReactorFixture,
  tfdUserWeaponFixture,
} from '../../fixtures/first-descendant/user.fixture.js';

import {
  tfdAcquisitionDetailMetaFixture,
  tfdArcheTuningNodeMetaFixture,
  tfdCollectibleItemMetaFixture,
  tfdConsumableMaterialMetaFixture,
  tfdCoreTypeMetaFixture,
  tfdCustomizingItemMetaFixture,
  tfdDescendantMetaFixture,
  tfdDescendantGroupMetaFixture,
  tfdExternalComponentMetaFixture,
  tfdFellowMetaFixture,
  tfdMedalMetaFixture,
  tfdModuleMetaFixture,
  tfdNodeItemMetaFixture,
  tfdNodeSocketTypeMetaFixture,
  tfdReactorMetaFixture,
  tfdResearchMetaFixture,
  tfdRewardMetaFixture,
  tfdStatMetaFixture,
  tfdTierMetaFixture,
  tfdTitleMetaFixture,
  tfdVehicleMetaFixture,
  tfdVoidBattleMetaFixture,
  tfdWeaponMetaFixture,
  tfdWeaponTypeMetaFixture,
  tfdAdaptLevelMetaFixture,
  tfdAmorphousRewardMetaFixture,
  tfdArcheTuningBoardMetaFixture,
  tfdArcheTuningBoardGroupMetaFixture,
  tfdCoreSlotMetaFixture,
  tfdDescendantLevelDetailMetaFixture,
  tfdFellowLevelDetailMetaFixture,
  tfdMasteryRankLevelDetailMetaFixture,
} from '../../fixtures/first-descendant/meta.fixture.js';
import {
  tfdLeaderboardVoidErosionPurgeChallengeFixture,
  tfdLeaderboardVoidInterceptBattleFixture,
  tfdLeaderboardVoidInterceptBattleNullFixture,
} from '../../fixtures/first-descendant/leaderboard.fixture.js';
import {
  tfdRecommendationModuleEmptyFixture,
  tfdRecommendationModuleFixture,
} from '../../fixtures/first-descendant/recommendation.fixture.js';

const BASE = 'https://open.api.nexon.com/tfd/v1';
const META = 'https://open.api.nexon.com/static/tfd/meta';

/** 클라이언트와, 실제로 나간 요청 URL 기록을 함께 만든다. */
const createClient = (
  apiKey: string = 'test-api-key',
): { client: FirstDescendantClient; urls: string[]; mismatches: ShapeMismatch[] } => {
  const mismatches: ShapeMismatch[] = [];
  const http = new HttpClient({
    apiKey,
    maxRetries: 0,
    responseValidation: true,
    logger: { onResponseShapeMismatch: (mismatch) => mismatches.push(mismatch) },
  });
  const urls: string[] = [];
  http.addRequestInterceptor((info) => {
    urls.push(info.url);
    return info;
  });
  return { client: new FirstDescendantClient(http), urls, mismatches };
};

const query = (params: Record<string, string>): string => new URLSearchParams(params).toString();

describe('FirstDescendantClient', () => {
  describe('getOuid', () => {
    it('닉네임으로 ouid를 조회한다 (GET /tfd/v1/id?user_name=)', async () => {
      const { client, urls } = createClient();
      const ouid = await client.getOuid(TFD_TEST_USER_NAME);

      expect(ouid).toBe(TFD_TEST_OUID);
      expect(urls).toEqual([`${BASE}/id?${query({ user_name: TFD_TEST_USER_NAME })}`]);
    });

    it('빈 닉네임은 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { client, urls } = createClient();

      const error = client.getOuid('  ');
      await expect(error).rejects.toThrow(NexonBadRequestError);
      await expect(error).rejects.toMatchObject({ code: 'OPENAPI00004' });
      await expect(client.getOuid('')).rejects.toThrow(
        /userName 값이 비어 있거나 문자열이 아닙니다/,
      );
      expect(urls).toEqual([]);
    });

    it('API 키가 거부되면 NexonAuthError를 던진다 (403)', async () => {
      server.use(
        mswHttp.get(`${BASE}/id`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00005', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );
      const { client } = createClient();

      await expect(client.getOuid(TFD_TEST_USER_NAME)).rejects.toBeInstanceOf(NexonAuthError);
    });
  });

  describe('sub-client getter', () => {
    it('같은 인스턴스를 재사용한다 (lazy)', () => {
      const { client } = createClient();

      expect(client.user).toBe(client.user);
      expect(client.meta).toBe(client.meta);
      expect(client.recommendation).toBe(client.recommendation);
      expect(client.leaderboard).toBe(client.leaderboard);
    });
  });

  describe('user', () => {
    it('getBasic — GET /tfd/v1/user/basic?ouid=', async () => {
      const { client, urls } = createClient();
      const result = await client.user.getBasic({ ouid: TFD_TEST_OUID });

      expect(result).toEqual(tfdUserBasicFixture);
      expect(urls).toEqual([`${BASE}/user/basic?${query({ ouid: TFD_TEST_OUID })}`]);
    });

    it('getDescendant — GET /tfd/v1/user/descendant?ouid=', async () => {
      const { client, urls } = createClient();
      const result = await client.user.getDescendant({ ouid: TFD_TEST_OUID });

      expect(result).toEqual(tfdUserDescendantFixture);
      expect(result.customizing[0]?.paint[0]?.customizing_item_type).toBe('Paint');
      expect(urls).toEqual([`${BASE}/user/descendant?${query({ ouid: TFD_TEST_OUID })}`]);
    });

    it('getWeapon — language_code 기본값은 ko', async () => {
      const { client, urls } = createClient();
      const result = await client.user.getWeapon({ ouid: TFD_TEST_OUID });

      expect(result).toEqual(tfdUserWeaponFixture);
      expect(result.weapon[0]?.core_unlock_flag).toBe('1');
      expect(urls).toEqual([
        `${BASE}/user/weapon?${query({ language_code: 'ko', ouid: TFD_TEST_OUID })}`,
      ]);
    });

    it('getWeapon — language_code를 그대로 전달한다', async () => {
      const { client, urls } = createClient();
      await client.user.getWeapon({ ouid: TFD_TEST_OUID, language_code: 'zh-CN' });

      expect(urls).toEqual([
        `${BASE}/user/weapon?${query({ language_code: 'zh-CN', ouid: TFD_TEST_OUID })}`,
      ]);
    });

    it('getReactor — GET /tfd/v1/user/reactor?language_code=&ouid=', async () => {
      const { client, urls } = createClient();
      const result = await client.user.getReactor({ ouid: TFD_TEST_OUID, language_code: 'en' });

      expect(result).toEqual(tfdUserReactorFixture);
      expect(urls).toEqual([
        `${BASE}/user/reactor?${query({ language_code: 'en', ouid: TFD_TEST_OUID })}`,
      ]);
    });

    it('getExternalComponent — GET /tfd/v1/user/external-component?language_code=&ouid=', async () => {
      const { client, urls } = createClient();
      const result = await client.user.getExternalComponent({ ouid: TFD_TEST_OUID });

      expect(result).toEqual(tfdUserExternalComponentFixture);
      expect(urls).toEqual([
        `${BASE}/user/external-component?${query({ language_code: 'ko', ouid: TFD_TEST_OUID })}`,
      ]);
    });

    it('getArcheTuning — GET /tfd/v1/user/arche-tuning?ouid=&descendant_group_id=', async () => {
      const { client, urls } = createClient();
      const result = await client.user.getArcheTuning({
        ouid: TFD_TEST_OUID,
        descendant_group_id: '101000001',
      });

      expect(result).toEqual(tfdUserArcheTuningFixture);
      expect(urls).toEqual([
        `${BASE}/user/arche-tuning?${query({ ouid: TFD_TEST_OUID, descendant_group_id: '101000001' })}`,
      ]);
    });

    it('빈 ouid는 요청 없이 NexonBadRequestError를 던지고 고치는 방법을 안내한다', async () => {
      const { client, urls } = createClient();
      const empty = '' as TfdOuid;

      await expect(client.user.getBasic({ ouid: empty })).rejects.toThrow(/getOuid/);
      await expect(client.user.getDescendant({ ouid: empty })).rejects.toThrow(
        NexonBadRequestError,
      );
      await expect(client.user.getWeapon({ ouid: empty })).rejects.toThrow(NexonBadRequestError);
      await expect(client.user.getReactor({ ouid: empty })).rejects.toThrow(NexonBadRequestError);
      await expect(client.user.getExternalComponent({ ouid: empty })).rejects.toThrow(
        NexonBadRequestError,
      );
      await expect(
        client.user.getArcheTuning({ ouid: empty, descendant_group_id: '101000001' }),
      ).rejects.toThrow(NexonBadRequestError);
      expect(urls).toEqual([]);
    });

    it('빈 descendant_group_id는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { client, urls } = createClient();

      await expect(
        client.user.getArcheTuning({ ouid: TFD_TEST_OUID, descendant_group_id: '' }),
      ).rejects.toThrow(/descendant_group_id 값이 비어 있거나 문자열이 아닙니다/);
      expect(urls).toEqual([]);
    });

    it('지원하지 않는 language_code는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { client, urls } = createClient();

      await expect(
        // @ts-expect-error 지원 목록에 없는 언어 코드
        client.user.getWeapon({ ouid: TFD_TEST_OUID, language_code: 'kr' }),
      ).rejects.toThrow(/language_code.*"ko"/);
      expect(urls).toEqual([]);
    });

    it('잘못된 ouid는 NexonBadRequestError를 던진다 (400)', async () => {
      server.use(
        mswHttp.get(`${BASE}/user/basic`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
            { status: 400 },
          ),
        ),
      );
      const { client } = createClient();

      await expect(
        client.user.getBasic({ ouid: 'not-a-real-ouid' as TfdOuid }),
      ).rejects.toBeInstanceOf(NexonBadRequestError);
    });

    it('호출 한도를 넘으면 NexonRateLimitError를 던진다 (429)', async () => {
      server.use(
        mswHttp.get(`${BASE}/user/reactor`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );
      const { client } = createClient();

      await expect(client.user.getReactor({ ouid: TFD_TEST_OUID })).rejects.toBeInstanceOf(
        NexonRateLimitError,
      );
    });
  });

  describe('meta', () => {
    it('공통 메타데이터 배열의 mastery_level 타입 불일치를 보고한다', async () => {
      const url = `${META}/mastery-rank-level-detail.json`;
      const response = [{ ...tfdMasteryRankLevelDetailMetaFixture[0], mastery_level: '1' }];
      const { client, mismatches } = createClient();
      server.use(mswHttp.get(url, () => HttpResponse.json(response)));

      await expect(client.meta.getMasteryRankLevelDetail()).resolves.toEqual(response);
      expect(mismatches).toEqual([
        expect.objectContaining({
          url,
          typeMismatches: [{ key: '[0].mastery_level', expected: 'number', actual: 'string' }],
        }),
      ]);
    });
    const localized = [
      ['getAcquisitionDetail', 'acquisition-detail', tfdAcquisitionDetailMetaFixture],
      ['getArcheTuningNode', 'arche-tuning-node', tfdArcheTuningNodeMetaFixture],
      ['getCollectibleItem', 'collectible-item', tfdCollectibleItemMetaFixture],
      ['getConsumableMaterial', 'consumable-material', tfdConsumableMaterialMetaFixture],
      ['getCoreType', 'core-type', tfdCoreTypeMetaFixture],
      ['getCustomizingItem', 'customizing-item', tfdCustomizingItemMetaFixture],
      ['getDescendant', 'descendant', tfdDescendantMetaFixture],
      ['getDescendantGroup', 'descendant-group', tfdDescendantGroupMetaFixture],
      ['getExternalComponent', 'external-component', tfdExternalComponentMetaFixture],
      ['getFellow', 'fellow', tfdFellowMetaFixture],
      ['getMedal', 'medal', tfdMedalMetaFixture],
      ['getModule', 'module', tfdModuleMetaFixture],
      ['getNodeItem', 'node-item', tfdNodeItemMetaFixture],
      ['getNodeSocketType', 'node-socket-type', tfdNodeSocketTypeMetaFixture],
      ['getReactor', 'reactor', tfdReactorMetaFixture],
      ['getResearch', 'research', tfdResearchMetaFixture],
      ['getReward', 'reward', tfdRewardMetaFixture],
      ['getStat', 'stat', tfdStatMetaFixture],
      ['getTier', 'tier', tfdTierMetaFixture],
      ['getTitle', 'title', tfdTitleMetaFixture],
      ['getVehicle', 'vehicle', tfdVehicleMetaFixture],
      ['getVoidBattle', 'void-battle', tfdVoidBattleMetaFixture],
      ['getWeapon', 'weapon', tfdWeaponMetaFixture],
      ['getWeaponType', 'weapon-type', tfdWeaponTypeMetaFixture],
    ] as const;

    const common = [
      ['getAdaptLevel', 'adapt-level', tfdAdaptLevelMetaFixture],
      ['getAmorphousReward', 'amorphous-reward', tfdAmorphousRewardMetaFixture],
      ['getArcheTuningBoard', 'arche-tuning-board', tfdArcheTuningBoardMetaFixture],
      ['getArcheTuningBoardGroup', 'arche-tuning-board-group', tfdArcheTuningBoardGroupMetaFixture],
      ['getCoreSlot', 'core-slot', tfdCoreSlotMetaFixture],
      ['getDescendantLevelDetail', 'descendant-level-detail', tfdDescendantLevelDetailMetaFixture],
      ['getFellowLevelDetail', 'fellow-level-detail', tfdFellowLevelDetailMetaFixture],
      [
        'getMasteryRankLevelDetail',
        'mastery-rank-level-detail',
        tfdMasteryRankLevelDetailMetaFixture,
      ],
    ] as const;

    it.each(localized)(
      '%s — GET /static/tfd/meta/{language_code}/%s.json',
      async (method, file, fixture) => {
        const { client, urls, mismatches } = createClient();

        const byDefault = await client.meta[method]();
        const english = await client.meta[method]('en');

        expect(byDefault).toEqual(fixture);
        expect(english).toEqual(fixture);
        expect(byDefault.length).toBeGreaterThan(0);
        expect(urls).toEqual([`${META}/ko/${file}.json`, `${META}/en/${file}.json`]);
        expect(mismatches).toEqual([]);
      },
    );

    it.each(common)('%s — GET /static/tfd/meta/%s.json', async (method, file, fixture) => {
      const { client, urls, mismatches } = createClient();
      const result = await client.meta[method]();

      expect(result).toEqual(fixture);
      expect(result.length).toBeGreaterThan(0);
      expect(urls).toEqual([`${META}/${file}.json`]);
      expect(mismatches).toEqual([]);
    });

    it('스펙의 메타데이터 32개를 모두 덮는다', () => {
      expect(localized).toHaveLength(24);
      expect(common).toHaveLength(8);
    });

    it('언어 코드는 대소문자를 구분해 경로에 그대로 들어간다', async () => {
      const { client, urls } = createClient();
      await client.meta.getTier('zh-TW');

      expect(urls).toEqual([`${META}/zh-TW/tier.json`]);
    });

    it('지원하지 않는 언어 코드는 요청 없이 NexonBadRequestError를 던지고 지원 목록을 안내한다', async () => {
      const { client, urls } = createClient();

      // @ts-expect-error 지원 목록에 없는 언어 코드
      await expect(client.meta.getDescendant('kr')).rejects.toThrow(NexonBadRequestError);
      // @ts-expect-error 대소문자가 다른 언어 코드
      await expect(client.meta.getWeapon('zh-cn')).rejects.toThrow(/"zh-CN", "zh-TW"/);
      expect(urls).toEqual([]);
    });

    it('실데이터가 스펙과 다른 필드를 타입이 그대로 담는다', async () => {
      const { client } = createClient();

      const mastery = await client.meta.getMasteryRankLevelDetail();
      // 스펙은 mastery_rank_level 이지만 실데이터 키는 mastery_level 이다
      expect(mastery[0]?.mastery_level).toBe(1);
      expect(mastery[0]?.mastery_rank_level).toBeUndefined();

      const coreType = await client.meta.getCoreType();
      // 스펙은 core_option[] 아래에 두지만 실데이터는 detail[] 아래에 있다
      const option = coreType[0]?.core_option[0]?.detail[0]?.available_item_option[0];
      expect(typeof option?.option_grade).toBe('number');
    });

    it('서버 오류는 NexonServerError로 분류된다 (500)', async () => {
      server.use(
        mswHttp.get(`${META}/ko/module.json`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00001', message: 'Internal Server Error' } },
            { status: 500 },
          ),
        ),
      );
      const { client } = createClient();

      await expect(client.meta.getModule()).rejects.toBeInstanceOf(NexonServerError);
    });
  });

  describe('recommendation', () => {
    const request = {
      descendant_id: '101000001',
      weapon_id: '211011001',
      void_battle_id: '151000001',
      period: '1',
    } as const;

    it('getModule — GET /tfd/v1/recommendation/module (쿼리 4개)', async () => {
      const { client, urls } = createClient();
      const result = await client.recommendation.getModule(request);

      expect(result).toEqual(tfdRecommendationModuleFixture);
      expect(urls).toEqual([`${BASE}/recommendation/module?${query(request)}`]);
    });

    it('getModule — 기록이 부족하면 빈 추천을 그대로 돌려준다', async () => {
      server.use(
        mswHttp.get(`${BASE}/recommendation/module`, () =>
          HttpResponse.json(tfdRecommendationModuleEmptyFixture),
        ),
      );
      const { client } = createClient();
      const result = await client.recommendation.getModule({ ...request, period: '2' });

      expect(result.descendant.recommendation).toEqual([]);
      expect(result.weapon.recommendation).toEqual([]);
    });

    it('빈 식별자와 잘못된 period는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { client, urls } = createClient();

      await expect(
        client.recommendation.getModule({ ...request, descendant_id: '' }),
      ).rejects.toThrow(/descendant_id 값이 비어 있거나 문자열이 아닙니다/);
      await expect(client.recommendation.getModule({ ...request, weapon_id: ' ' })).rejects.toThrow(
        /getWeapon/,
      );
      await expect(
        client.recommendation.getModule({ ...request, void_battle_id: '' }),
      ).rejects.toThrow(/getVoidBattle/);
      await expect(
        // @ts-expect-error period는 '0' | '1' | '2' 문자열이다
        client.recommendation.getModule({ ...request, period: '7' }),
      ).rejects.toThrow(/period.*최근 7일/);
      expect(urls).toEqual([]);
    });

    it('API 키가 없으면 NexonAuthError를 던진다 (403)', async () => {
      const { client } = createClient('');

      await expect(client.recommendation.getModule(request)).rejects.toBeInstanceOf(NexonAuthError);
    });
  });

  describe('leaderboard', () => {
    it('getVoidInterceptBattle — Solo, 기본값 contents_type=RiskMode · platform_type=All', async () => {
      const { client, urls } = createClient();
      const result = await client.leaderboard.getVoidInterceptBattle({
        leaderboard_type: 'Solo',
        descendant_id: '101000001',
      });

      expect(result).toEqual(tfdLeaderboardVoidInterceptBattleFixture);
      expect(result.leaderboard?.[1]?.ranking).toBeNull();
      expect(urls).toEqual([
        `${BASE}/leaderboard/void-intercept-battle?${query({
          leaderboard_type: 'Solo',
          descendant_id: '101000001',
          contents_type: 'RiskMode',
          platform_type: 'All',
        })}`,
      ]);
    });

    it('getVoidInterceptBattle — Squad는 squad_user_count를 보내고 descendant_id는 뺀다', async () => {
      const { client, urls } = createClient();
      await client.leaderboard.getVoidInterceptBattle({
        leaderboard_type: 'Squad',
        squad_user_count: 4,
        platform_type: 'PlayStation',
      });

      expect(urls).toEqual([
        `${BASE}/leaderboard/void-intercept-battle?${query({
          leaderboard_type: 'Squad',
          squad_user_count: '4',
          contents_type: 'RiskMode',
          platform_type: 'PlayStation',
        })}`,
      ]);
    });

    it('getVoidInterceptBattle — leaderboard가 null인 응답을 그대로 돌려준다', async () => {
      server.use(
        mswHttp.get(`${BASE}/leaderboard/void-intercept-battle`, () =>
          HttpResponse.json(tfdLeaderboardVoidInterceptBattleNullFixture),
        ),
      );
      const { client } = createClient();
      const result = await client.leaderboard.getVoidInterceptBattle({ leaderboard_type: 'Solo' });

      expect(result.leaderboard).toBeNull();
    });

    it('getVoidErosionPurgeChallenge — GET /tfd/v1/leaderboard/void-erosion-purge-challenge', async () => {
      const { client, urls } = createClient();
      const result = await client.leaderboard.getVoidErosionPurgeChallenge({
        leaderboard_type: 'Squad',
        squad_user_count: 2,
        platform_type: 'Xbox',
      });

      expect(result).toEqual(tfdLeaderboardVoidErosionPurgeChallengeFixture);
      expect(result.leaderboard[0]?.stage).toBe('30');
      expect(urls).toEqual([
        `${BASE}/leaderboard/void-erosion-purge-challenge?${query({
          leaderboard_type: 'Squad',
          squad_user_count: '2',
          platform_type: 'Xbox',
        })}`,
      ]);
    });

    it('getVoidErosionPurgeChallenge — Solo는 contents_type 없이 보낸다', async () => {
      const { client, urls } = createClient();
      await client.leaderboard.getVoidErosionPurgeChallenge({ leaderboard_type: 'Solo' });

      expect(urls).toEqual([
        `${BASE}/leaderboard/void-erosion-purge-challenge?${query({
          leaderboard_type: 'Solo',
          platform_type: 'All',
        })}`,
      ]);
    });

    it('모순된 조건은 요청 없이 NexonBadRequestError를 던지고 고치는 방법을 안내한다', async () => {
      const { client, urls } = createClient();
      // 타입이 막는 조합을 JavaScript 호출처럼 그대로 넘겨 런타임 검증을 확인한다
      const loose = client.leaderboard as unknown as Record<
        'getVoidInterceptBattle' | 'getVoidErosionPurgeChallenge',
        (params: unknown) => Promise<unknown>
      >;

      await expect(
        loose.getVoidInterceptBattle({
          leaderboard_type: 'Solo',
          squad_user_count: 2,
        }),
      ).rejects.toThrow(/'Solo' 인데 squad_user_count/);
      await expect(
        loose.getVoidErosionPurgeChallenge({
          leaderboard_type: 'Squad',
          descendant_id: '101000001',
        }),
      ).rejects.toThrow(/'Squad' 인데 descendant_id/);
      await expect(
        loose.getVoidErosionPurgeChallenge({
          leaderboard_type: 'Squad',
          squad_user_count: 5,
        }),
      ).rejects.toThrow(/2, 3, 4 중 하나/);
      await expect(loose.getVoidInterceptBattle({ leaderboard_type: 'solo' })).rejects.toThrow(
        NexonBadRequestError,
      );
      await expect(
        loose.getVoidInterceptBattle({
          leaderboard_type: 'Solo',
          platform_type: 'Switch',
        }),
      ).rejects.toThrow(/"All", "Pc", "PlayStation", "Xbox"/);
      await expect(
        loose.getVoidInterceptBattle({
          leaderboard_type: 'Solo',
          contents_type: 'Normal',
        }),
      ).rejects.toThrow(/contents_type.*RiskMode/);
      await expect(
        loose.getVoidInterceptBattle({ leaderboard_type: 'Solo', descendant_id: '' }),
      ).rejects.toThrow(/descendant_id 값이 비어 있거나 문자열이 아닙니다/);
      expect(urls).toEqual([]);
    });

    it('호출 한도를 넘으면 NexonRateLimitError를 던진다 (429)', async () => {
      server.use(
        mswHttp.get(`${BASE}/leaderboard/void-erosion-purge-challenge`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );
      const { client } = createClient();

      await expect(
        client.leaderboard.getVoidErosionPurgeChallenge({ leaderboard_type: 'Solo' }),
      ).rejects.toBeInstanceOf(NexonRateLimitError);
    });
  });
});
