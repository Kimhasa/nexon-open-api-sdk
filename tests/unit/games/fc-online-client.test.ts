import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { _resetDeprecationWarnings } from '../../../src/core/deprecation/deprecation.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { server } from '../../mocks/server.js';
import {
  fcSpidMetaFixture,
  fcSeasonIdMetaFixture,
  fcSpPositionMetaFixture,
  fcDivisionMetaFixture,
  fcDivisionVoltaMetaFixture,
  fcClassMetaFixture,
  fcSeasonMetaFixture,
} from '../../fixtures/fc-online/metadata.fixture.js';
import { fcTradeFixture, fcRankerFixture } from '../../fixtures/fc-online/trade-ranker.fixture.js';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import type { HttpLogger } from '../../../src/core/http/http-types.js';
import { FcOnlineClient } from '../../../src/games/fc-online/FcOnlineClient.js';
import type { OUID } from '../../../src/games/fc-online/user/types.js';
import {
  fcOuidFixture,
  fcUserBasicFixture,
  fcMaxDivisionFixture,
  fcMaxDivisionObjectFixture,
  fcMatchListFixture,
  fcAllMatchListFixture,
  fcMatchDetailFixture,
  fcMatchTypeMetaFixture,
} from '../../fixtures/fc-online/fixtures.fixture.js';

const TEST_API_KEY = 'test-api-key';
const createClient = (logger: Partial<HttpLogger> = {}): FcOnlineClient => {
  const http = new HttpClient({ apiKey: TEST_API_KEY, responseValidation: true, logger });
  return new FcOnlineClient(http);
};

const TEST_OUID = fcOuidFixture.ouid as OUID;
const BASE = 'https://open.api.nexon.com/fconline/v1';

describe('FcOnlineClient', () => {
  describe('getOuid', () => {
    it('닉네임으로 OUID를 조회한다', async () => {
      const client = createClient();
      const ouid = await client.getOuid('테스트유저FC');
      expect(ouid).toBe(fcOuidFixture.ouid);
    });
  });

  describe('getBasic', () => {
    it('유저 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.getBasic(TEST_OUID);

      expect(result.nickname).toBe(fcUserBasicFixture.nickname);
      expect(result.level).toBe(fcUserBasicFixture.level);
      expect(result.ouid).toBe(fcUserBasicFixture.ouid);
    });
  });

  describe('getMaxDivision', () => {
    it('역대 최고 등급 정보를 반환한다', async () => {
      const onResponseShapeMismatch = vi.fn();
      const client = createClient({ onResponseShapeMismatch });
      const result = await client.getMaxDivision(TEST_OUID);

      expect(result).toEqual(fcMaxDivisionFixture);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('단일 등급 객체를 길이 1의 배열로 정규화한다', async () => {
      server.use(
        http.get(`${BASE}/user/maxdivision`, ({ request }) => {
          expect(new URL(request.url).searchParams.get('ouid')).toBe(TEST_OUID);
          return HttpResponse.json(fcMaxDivisionObjectFixture);
        }),
      );
      const onResponseShapeMismatch = vi.fn();
      await expect(
        createClient({ onResponseShapeMismatch }).getMaxDivision(TEST_OUID),
      ).resolves.toEqual([fcMaxDivisionObjectFixture]);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('등급 배열에서 형식이 바뀐 항목을 경고한다', async () => {
      const record = { ...fcMaxDivisionObjectFixture, division: '800' };
      server.use(http.get(`${BASE}/user/maxdivision`, () => HttpResponse.json([record])));
      const onResponseShapeMismatch = vi.fn();
      await expect(
        createClient({ onResponseShapeMismatch }).getMaxDivision(TEST_OUID),
      ).resolves.toEqual([record]);
      expect(onResponseShapeMismatch).toHaveBeenCalledWith(
        expect.objectContaining({
          typeMismatches: [{ key: '[0].division', expected: 'number', actual: 'string' }],
        }),
      );
    });
  });

  describe('getMatchList', () => {
    it('유저의 매치 ID 목록을 반환한다', async () => {
      const client = createClient();
      const result = await client.getMatchList({
        ouid: TEST_OUID,
        matchtype: 50,
      });

      expect(result).toHaveLength(3);
      expect(result[0]).toBe(fcMatchListFixture[0]);
    });
  });

  describe('getAllMatchList', () => {
    it('폐지 경고를 한 번 표시하고 기존 경로에 요청한다', async () => {
      _resetDeprecationWarnings();
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const client = createClient();
        const params = { matchtype: 50 };
        await expect(client.getAllMatchList(params)).resolves.toEqual(fcAllMatchListFixture);
        await expect(client.getAllMatchList(params)).resolves.toEqual(fcAllMatchListFixture);
        expect(warning).toHaveBeenCalledTimes(1);
        expect(warning).toHaveBeenCalledWith(expect.stringContaining('getMatchList()'));
      } finally {
        warning.mockRestore();
      }
    });
  });

  describe('getMatchDetail', () => {
    it('매치 상세 기록을 반환한다', async () => {
      const onResponseShapeMismatch = vi.fn();
      const client = createClient({ onResponseShapeMismatch });
      const result = await client.getMatchDetail('6572d9bbc7331d2a45f3d755');

      expect(result.matchId).toBe(fcMatchDetailFixture.matchId);
      expect(result.matchDate).toBe(fcMatchDetailFixture.matchDate);
      expect(result.matchType).toBe(fcMatchDetailFixture.matchType);
      expect(result.matchInfo).toHaveLength(1);
      expect(result.matchInfo[0]?.nickname).toBe('테스트유저FC');
      expect(result.matchInfo[0]?.division).toBe(800);
      expect(result.matchInfo[0]?.matchDetail.matchResult).toBe('승');
      expect(result.matchInfo[0]?.matchDetail.offsideCount).toBe(1);
      expect(result.matchInfo[0]?.player[0]?.status.ballPossesionSuccess).toBe(8);
      expect(result.matchInfo[0]?.shootDetail[0]?.assistSpId).toBe(100167680);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('참가자 등급이 생략된 매치 상세 기록도 반환한다', async () => {
      const fixture = {
        ...fcMatchDetailFixture,
        matchInfo: fcMatchDetailFixture.matchInfo.map((info) => ({ ...info, division: undefined })),
      };
      server.use(http.get(`${BASE}/match-detail`, () => HttpResponse.json(fixture)));
      const onResponseShapeMismatch = vi.fn();
      const result = await createClient({ onResponseShapeMismatch }).getMatchDetail(
        fixture.matchId,
      );

      expect(result.matchInfo[0]).not.toHaveProperty('division');
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });
  });

  it('getTradeList forwards the trade type and pagination without an OUID', async () => {
    await expect(
      createClient().getTradeList({ tradetype: 'buy', offset: 10, limit: 5 }),
    ).resolves.toEqual(fcTradeFixture);
  });

  it('getRankerStats sends the players array as a JSON query value', async () => {
    const onResponseShapeMismatch = vi.fn();
    await expect(
      createClient({ onResponseShapeMismatch }).getRankerStats({
        matchtype: 52,
        players: [{ id: 100167680, po: 18 }],
      }),
    ).resolves.toEqual(fcRankerFixture);
    expect(onResponseShapeMismatch).not.toHaveBeenCalled();
  });

  it('rejects an empty match ID before making a request', async () => {
    const onRequest = vi.fn();
    const client = new FcOnlineClient(
      new HttpClient({ apiKey: TEST_API_KEY, logger: { onRequest } }),
    );
    await expect(client.getMatchDetail(' ')).rejects.toBeInstanceOf(NexonBadRequestError);
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('maps HTTP 403 to NexonAuthError', async () => {
    server.use(
      http.get(`${BASE}/id`, () =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00002', message: 'Invalid API key' } },
          { status: 403 },
        ),
      ),
    );
    await expect(createClient().getOuid('ExamplePlayer')).rejects.toBeInstanceOf(NexonAuthError);
  });

  describe('metadata', () => {
    it.each([
      { name: 'getSpidMeta', fixture: fcSpidMetaFixture },
      { name: 'getSpPositionMeta', fixture: fcSpPositionMetaFixture },
      { name: 'getDivisionMeta', fixture: fcDivisionMetaFixture },
      { name: 'getDivisionVoltaMeta', fixture: fcDivisionVoltaMetaFixture },
      { name: 'getSeasonMeta', fixture: fcSeasonMetaFixture },
      { name: 'getClassMeta', fixture: fcClassMetaFixture },
    ] as const)('$name returns the public metadata', async ({ name, fixture }) => {
      const onResponseShapeMismatch = vi.fn();
      await expect(createClient({ onResponseShapeMismatch })[name]()).resolves.toEqual(fixture);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('getSeasonIdMeta keeps the legacy endpoint and warns about its replacement', async () => {
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        await expect(createClient().getSeasonIdMeta()).resolves.toEqual(fcSeasonIdMetaFixture);
        expect(warning).toHaveBeenCalledWith(expect.stringContaining('getClassMeta()'));
      } finally {
        warning.mockRestore();
      }
    });

    it('getSeasonMeta also accepts the portal schema', async () => {
      server.use(
        http.get('https://open.api.nexon.com/static/fconline/meta/season.json', () =>
          HttpResponse.json(fcSeasonMetaFixture),
        ),
      );
      await expect(createClient().getSeasonMeta()).resolves.toEqual(fcSeasonMetaFixture);
    });

    it('getMatchTypeMeta — 매치 종류 메타데이터를 반환한다', async () => {
      const client = createClient();
      const result = await client.getMatchTypeMeta();

      expect(result).toHaveLength(2);
      expect(result[0]?.matchtype).toBe(fcMatchTypeMetaFixture[0]?.matchtype);
      expect(result[0]?.desc).toBe(fcMatchTypeMetaFixture[0]?.desc);
    });
  });

  describe('image URL', () => {
    it('getActionShotUrl — 액션샷 이미지 URL을 조립한다', () => {
      const client = createClient();
      const url = client.getActionShotUrl(272167135);

      expect(url).toBe(
        'https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p272167135.png',
      );
    });

    it('getPlayerImageUrl — 선수 이미지 URL을 조립한다', () => {
      const client = createClient();
      const url = client.getPlayerImageUrl(167680);

      expect(url).toBe(
        'https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p167680.png',
      );
    });
  });
});
