import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { PlatformClient } from '../../../src/games/platform/PlatformClient.js';
import { platformNoticeListFixture } from '../../fixtures/platform/notice.fixture.js';
import { server } from '../../mocks/server.js';

/** 스펙(specs/openapi/platform/19.yaml)의 servers[0].url + path 를 그대로 옮긴 값 */
const SPEC_NOTICE_URL = 'https://open.api.nexon.com/platform/openapi/v1/notice';

const requests: URL[] = [];
const shapeMismatches: ShapeMismatch[] = [];
const onRequest = ({ request }: { request: Request }): void => {
  requests.push(new URL(request.url));
};

const createClient = (): PlatformClient =>
  new PlatformClient(
    new HttpClient({
      apiKey: 'test-api-key',
      maxRetries: 0,
      responseValidation: true,
      logger: { onResponseShapeMismatch: (mismatch) => shapeMismatches.push(mismatch) },
    }),
  );

describe('PlatformClient', () => {
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

  describe('getNoticeList', () => {
    it('GET /platform/openapi/v1/notice — 요청 URL이 스펙과 정확히 같다', async () => {
      const result = await createClient().getNoticeList();

      expect(result).toEqual(platformNoticeListFixture);
      expect(requests).toHaveLength(1);
      // 쿼리 없이 호출했으므로 전체 URL이 스펙 URL과 글자 그대로 같아야 한다
      expect(requests[0]?.href).toBe(SPEC_NOTICE_URL);
    });

    it('game_name 을 쿼리 파라미터로 전달한다', async () => {
      const result = await createClient().getNoticeList({ game_name: '메이플스토리' });

      expect(result.notice).toHaveLength(1);
      expect(result.notice[0]?.game_name).toBe('메이플스토리');
      const url = requests.at(-1);
      expect(url && `${url.origin}${url.pathname}`).toBe(SPEC_NOTICE_URL);
      expect(Object.fromEntries(url?.searchParams ?? [])).toEqual({ game_name: '메이플스토리' });
    });

    it('빈 game_name 은 쿼리에서 빼고 전체 공지를 조회한다', async () => {
      const result = await createClient().getNoticeList({ game_name: '' });

      expect(result).toEqual(platformNoticeListFixture);
      expect(requests[0]?.href).toBe(SPEC_NOTICE_URL);
    });
  });

  describe('에러 경로', () => {
    it('400 OPENAPI00004 → NexonBadRequestError', async () => {
      server.use(
        http.get(SPEC_NOTICE_URL, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
            { status: 400 },
          ),
        ),
      );

      const error: unknown = await createClient()
        .getNoticeList({ game_name: '없는게임' })
        .catch((err: unknown) => err);

      expect(error).toBeInstanceOf(NexonBadRequestError);
      expect((error as NexonBadRequestError).nexonMessage).toBe('Please input valid parameter');
    });

    it('403 OPENAPI00002 → NexonAuthError', async () => {
      server.use(
        http.get(SPEC_NOTICE_URL, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(createClient().getNoticeList()).rejects.toThrow(NexonAuthError);
    });

    it('429 OPENAPI00007 → NexonRateLimitError', async () => {
      server.use(
        http.get(SPEC_NOTICE_URL, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );

      await expect(createClient().getNoticeList()).rejects.toThrow(NexonRateLimitError);
    });
  });
});
