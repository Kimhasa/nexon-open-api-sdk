import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { KartriderClient } from '../../../src/games/kartrider/KartriderClient.js';
import { KartriderNoticeClient } from '../../../src/games/kartrider/notice/KartriderNoticeClient.js';
import { KartriderUserClient } from '../../../src/games/kartrider/user/KartriderUserClient.js';
import type { KartriderOUID } from '../../../src/games/kartrider/types.js';
import {
  kartriderEventNoticeDetailFixture,
  kartriderEventNoticeListFixture,
  kartriderNoticeDetailFixture,
  kartriderNoticeListFixture,
  kartriderSeasonNoticeDetailFixture,
  kartriderSeasonNoticeListFixture,
} from '../../fixtures/kartrider/notice.fixture.js';
import {
  kartriderOuidLookupFixture,
  kartriderUserBasicFixture,
  kartriderUserTitleEquipmentFixture,
} from '../../fixtures/kartrider/user.fixture.js';
import { server } from '../../mocks/server.js';

const ORIGIN = 'https://open.api.nexon.com';
const TEST_OUID = 'test-kartrider-ouid-0001' as KartriderOUID;

const requests: URL[] = [];
const shapeMismatches: ShapeMismatch[] = [];
const onRequest = ({ request }: { request: Request }): void => {
  requests.push(new URL(request.url));
};

const createClient = (): KartriderClient =>
  new KartriderClient(
    new HttpClient({
      apiKey: 'test-api-key',
      maxRetries: 0,
      responseValidation: true,
      logger: { onResponseShapeMismatch: (mismatch) => shapeMismatches.push(mismatch) },
    }),
  );

/** 마지막 요청의 URL(쿼리 제외)과 쿼리 파라미터가 스펙과 정확히 같은지 확인한다. */
const expectRequest = (path: string, query: Record<string, string> = {}): void => {
  const url = requests.at(-1);
  expect(url && `${url.origin}${url.pathname}`).toBe(`${ORIGIN}${path}`);
  expect(Object.fromEntries(url?.searchParams ?? [])).toEqual(query);
};

describe('KartriderClient', () => {
  beforeEach(() => {
    requests.length = 0;
    shapeMismatches.length = 0;
    server.events.on('request:start', onRequest);
  });

  afterEach(() => {
    server.events.removeListener('request:start', onRequest);
    // fixture(스펙 합성)가 shapes.ts 와 어긋나면 여기서 잡힌다
    expect(shapeMismatches).toEqual([]);
  });

  describe('lazy getters', () => {
    it('user / notice getter는 sub-client를 반환하고 인스턴스를 재사용한다', () => {
      const client = createClient();
      expect(client.user).toBeInstanceOf(KartriderUserClient);
      expect(client.notice).toBeInstanceOf(KartriderNoticeClient);
      expect(client.user).toBe(client.user);
      expect(client.notice).toBe(client.notice);
    });
  });

  describe('getOuidInfo', () => {
    it('GET /kartrush/v1/id?racer_name — 계정 식별자 정보를 반환한다', async () => {
      const result = await createClient().getOuidInfo('테스트라이더');

      expect(result).toEqual(kartriderOuidLookupFixture);
      expectRequest('/kartrush/v1/id', { racer_name: '테스트라이더' });
    });

    it("라이더 명의 '|' 를 '_' 로 바꿔 보낸다", async () => {
      await createClient().getOuidInfo('|카러플라이더|');

      expectRequest('/kartrush/v1/id', { racer_name: '_카러플라이더_' });
    });

    it('빈 라이더 명은 요청 없이 NexonBadRequestError를 던진다', async () => {
      await expect(createClient().getOuidInfo('  ')).rejects.toThrow(NexonBadRequestError);
      await expect(createClient().getOuidInfo('')).rejects.toThrow(
        /racerName 값이 비어 있거나 문자열이 아닙니다/,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('user', () => {
    it('getBasic — GET /kartrush/v1/user/basic?ouid', async () => {
      const result = await createClient().user.getBasic({ ouid: TEST_OUID });

      expect(result).toEqual(kartriderUserBasicFixture);
      expectRequest('/kartrush/v1/user/basic', { ouid: TEST_OUID });
    });

    it('getTitleEquipment — GET /kartrush/v1/user/title-equipment?ouid', async () => {
      const result = await createClient().user.getTitleEquipment({ ouid: TEST_OUID });

      expect(result).toEqual(kartriderUserTitleEquipmentFixture);
      expectRequest('/kartrush/v1/user/title-equipment', { ouid: TEST_OUID });
    });

    it('빈 ouid는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const client = createClient();
      const empty = '' as KartriderOUID;

      await expect(client.user.getBasic({ ouid: empty })).rejects.toThrow(NexonBadRequestError);
      await expect(client.user.getTitleEquipment({ ouid: empty })).rejects.toThrow(
        /getOuidInfo\(racerName\)/,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('notice', () => {
    it('getList — GET /kartrush/v1/notice', async () => {
      const result = await createClient().notice.getList();

      expect(result).toEqual(kartriderNoticeListFixture);
      expectRequest('/kartrush/v1/notice');
    });

    it('getDetail — GET /kartrush/v1/notice/detail?notice_id', async () => {
      const result = await createClient().notice.getDetail(1001);

      expect(result).toEqual(kartriderNoticeDetailFixture);
      expectRequest('/kartrush/v1/notice/detail', { notice_id: '1001' });
    });

    it('getSeasonList — GET /kartrush/v1/notice-season', async () => {
      const result = await createClient().notice.getSeasonList();

      expect(result).toEqual(kartriderSeasonNoticeListFixture);
      expectRequest('/kartrush/v1/notice-season');
    });

    it('getSeasonDetail — GET /kartrush/v1/notice-season/detail?notice_id', async () => {
      const result = await createClient().notice.getSeasonDetail(2001);

      expect(result).toEqual(kartriderSeasonNoticeDetailFixture);
      expectRequest('/kartrush/v1/notice-season/detail', { notice_id: '2001' });
    });

    it('getEventList — GET /kartrush/v1/notice-event', async () => {
      const result = await createClient().notice.getEventList();

      expect(result).toEqual(kartriderEventNoticeListFixture);
      expectRequest('/kartrush/v1/notice-event');
    });

    it('getEventDetail — GET /kartrush/v1/notice-event/detail?notice_id', async () => {
      const result = await createClient().notice.getEventDetail(3001);

      expect(result).toEqual(kartriderEventNoticeDetailFixture);
      expectRequest('/kartrush/v1/notice-event/detail', { notice_id: '3001' });
    });

    it('정수가 아닌 noticeId는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { notice } = createClient();

      await expect(notice.getDetail(Number.NaN)).rejects.toThrow(NexonBadRequestError);
      await expect(notice.getSeasonDetail(1.5)).rejects.toThrow(
        /noticeId.*안전한 정수.*getSeasonList/,
      );
      await expect(notice.getEventDetail(Number.POSITIVE_INFINITY)).rejects.toThrow(
        NexonBadRequestError,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('에러 경로', () => {
    it('400 OPENAPI00004 → NexonBadRequestError', async () => {
      server.use(
        http.get(`${ORIGIN}/kartrush/v1/user/basic`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
            { status: 400 },
          ),
        ),
      );

      const error: unknown = await createClient()
        .user.getBasic({ ouid: TEST_OUID })
        .catch((err: unknown) => err);

      expect(error).toBeInstanceOf(NexonBadRequestError);
      expect((error as NexonBadRequestError).nexonMessage).toBe('Please input valid parameter');
    });

    it('403 OPENAPI00002 → NexonAuthError', async () => {
      server.use(
        http.get(`${ORIGIN}/kartrush/v1/id`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(createClient().getOuidInfo('테스트라이더')).rejects.toThrow(NexonAuthError);
    });

    it('429 OPENAPI00007 → NexonRateLimitError', async () => {
      server.use(
        http.get(`${ORIGIN}/kartrush/v1/notice`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );

      await expect(createClient().notice.getList()).rejects.toThrow(NexonRateLimitError);
    });
  });
});
