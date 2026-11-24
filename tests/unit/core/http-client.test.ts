import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server.js';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonError } from '../../../src/core/errors/NexonError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonServerError } from '../../../src/core/errors/NexonServerError.js';
import { NexonMaintenanceError } from '../../../src/core/errors/NexonMaintenanceError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';

const TEST_URL = 'https://test-api.example.com/test';
const TEST_API_KEY = 'test-api-key-123';

const createClient = (overrides: Record<string, unknown> = {}): HttpClient =>
  new HttpClient({ apiKey: TEST_API_KEY, ...overrides });

describe('HttpClient', () => {
  describe('apiKey 검증', () => {
    it.each([
      ['누락 (undefined)', undefined],
      ['빈 문자열', ''],
      ['공백뿐인 문자열', '   '],
    ])('apiKey 가 %s 이면 NexonBadRequestError(OPENAPI00004)를 던진다', (_label, apiKey) => {
      let caught: unknown;
      try {
        new HttpClient({ apiKey: apiKey as string });
      } catch (err) {
        caught = err;
      }
      expect(caught).toBeInstanceOf(NexonBadRequestError);
      expect((caught as NexonBadRequestError).code).toBe('OPENAPI00004');
      expect((caught as NexonBadRequestError).message).toContain('API 키가 비어 있습니다');
      expect((caught as NexonBadRequestError).message).toContain('--env-file=.env');
    });

    it('앞뒤 공백이 섞인 키는 다듬지 않고 그대로 보낸다', async () => {
      let sentKey: string | null = null;
      server.use(
        http.get(TEST_URL, ({ request }) => {
          sentKey = request.headers.get('x-nxopen-api-key');
          return HttpResponse.json({});
        }),
      );

      await new HttpClient({ apiKey: 'key-with-inner space' }).get(TEST_URL);

      expect(sentKey).toBe('key-with-inner space');
    });
  });

  describe('503 점검 응답', () => {
    it('OPENAPI00011 은 재시도 뒤 NexonMaintenanceError 로 분류된다', async () => {
      let calls = 0;
      server.use(
        http.get(TEST_URL, () => {
          calls++;
          return HttpResponse.json(
            { error: { name: 'OPENAPI00011', message: 'Under maintenance' } },
            { status: 503 },
          );
        }),
      );

      const client = createClient({ maxRetries: 1, retryBaseDelayMs: 1 });
      const err: unknown = await client.get(TEST_URL).catch((e: unknown) => e);

      expect(err).toBeInstanceOf(NexonMaintenanceError);
      expect(err).toBeInstanceOf(NexonServerError);
      expect((err as NexonMaintenanceError).status).toBe(503);
      expect((err as NexonMaintenanceError).nexonMessage).toBe('Under maintenance');
      expect(calls).toBe(2); // 최초 1회 + 재시도 1회
    });
  });

  describe('성공적인 요청', () => {
    it('JSON 응답을 파싱하여 반환한다', async () => {
      server.use(http.get(TEST_URL, () => HttpResponse.json({ name: 'test', value: 42 })));

      const client = createClient();
      const result = await client.get<{ name: string; value: number }>(TEST_URL);

      expect(result).toEqual({ name: 'test', value: 42 });
    });

    it('x-nxopen-api-key 헤더를 자동 주입한다', async () => {
      let capturedHeaders: Headers | undefined;
      server.use(
        http.get(TEST_URL, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient();
      await client.get(TEST_URL);

      expect(capturedHeaders?.get('x-nxopen-api-key')).toBe(TEST_API_KEY);
    });

    it('쿼리 파라미터를 URL에 추가한다', async () => {
      let capturedUrl = '';
      server.use(
        http.get(TEST_URL, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient();
      await client.get(TEST_URL, { ocid: 'abc123', date: '2024-01-15' });

      const url = new URL(capturedUrl);
      expect(url.searchParams.get('ocid')).toBe('abc123');
      expect(url.searchParams.get('date')).toBe('2024-01-15');
    });

    it('undefined 값의 파라미터는 제거한다', async () => {
      let capturedUrl = '';
      server.use(
        http.get(TEST_URL, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient();
      await client.get(TEST_URL, { ocid: 'abc', date: undefined });

      const url = new URL(capturedUrl);
      expect(url.searchParams.get('ocid')).toBe('abc');
      expect(url.searchParams.has('date')).toBe(false);
    });
  });

  describe('기본 디버그 로거', () => {
    it('요청과 응답 검증 경고의 URL에서 고유 번호를 가리고 캐릭터명은 유지한다', async () => {
      const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ocid = '0123456789abcdef'.repeat(4);
      const characterName = '메이플용사';
      const matchingRequest = vi.fn(({ request }: { request: Request }) => {
        const query = new URL(request.url).searchParams;
        expect(query.get('ocid')).toBe(ocid);
        expect(query.get('character_name')).toBe(characterName);
        return HttpResponse.json({});
      });
      server.use(http.get(TEST_URL, matchingRequest));

      try {
        const client = createClient({ debug: true, responseValidation: true });
        await client.get(
          TEST_URL,
          { ocid, character_name: characterName },
          { expectedKeys: { character_name: 'string' } },
        );

        const query = new URLSearchParams({
          ocid: '01234567…',
          character_name: characterName,
        }).toString();
        expect(matchingRequest).toHaveBeenCalledOnce();
        expect(debug).toHaveBeenCalledWith(`[nexon-sdk] → GET ${TEST_URL}?${query}`);
        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining(`Response shape mismatch for ${TEST_URL}?${query}`),
        );
        expect(debug.mock.calls.flat().join(' ')).not.toContain(ocid);
        expect(warn.mock.calls.flat().join(' ')).not.toContain(ocid);
      } finally {
        debug.mockRestore();
        warn.mockRestore();
      }
    });
  });

  describe('에러 처리', () => {
    it('403 응답 시 NexonAuthError를 던진다', async () => {
      server.use(
        http.get(TEST_URL, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API key' } },
            { status: 403 },
          ),
        ),
      );

      const client = createClient({ maxRetries: 0 });
      await expect(client.get(TEST_URL)).rejects.toThrow(NexonAuthError);
    });

    it('HTTP 400의 OPENAPI00006은 재시도 없이 조회하려던 게임의 키를 확인하도록 안내한다', async () => {
      const url = 'https://open.api.nexon.com/tfd/v1/id';
      const handler = vi.fn(() =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00006', message: 'Invalid game or path' } },
          { status: 400 },
        ),
      );
      server.use(http.get(url, handler));

      const client = createClient({ maxRetries: 2, retryBaseDelayMs: 1 });
      const err: unknown = await client.get(url, { user_name: 'example' }).catch((e: unknown) => e);

      expect(err).toBeInstanceOf(NexonAuthError);
      expect(err).toMatchObject({
        status: 400,
        code: 'OPENAPI00006',
        nexonMessage: 'Invalid game or path',
        message: expect.stringContaining('퍼스트 디센던트용 애플리케이션'),
      });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('500 응답 시 NexonServerError를 던진다', async () => {
      server.use(
        http.get(TEST_URL, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00001', message: 'Server error' } },
            { status: 500 },
          ),
        ),
      );

      const client = createClient({ maxRetries: 0 });
      await expect(client.get(TEST_URL)).rejects.toThrow(NexonServerError);
    });

    it('JSON 아닌 에러 응답도 처리한다', async () => {
      server.use(
        http.get(TEST_URL, () => new HttpResponse('Internal Server Error', { status: 500 })),
      );

      const client = createClient({ maxRetries: 0 });
      await expect(client.get(TEST_URL)).rejects.toThrow(NexonError);
    });

    it('넥슨 에러 코드가 없는 502 JSON 응답은 재시도 후 NexonServerError를 던진다', async () => {
      const handler = vi.fn(() => HttpResponse.json({ message: 'Bad Gateway' }, { status: 502 }));
      server.use(http.get(TEST_URL, handler));

      const client = createClient({ maxRetries: 1, retryBaseDelayMs: 1 });
      await expect(client.get(TEST_URL)).rejects.toThrow(NexonServerError);
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('재시도', () => {
    it('429 응답 시 재시도한다', async () => {
      let callCount = 0;
      server.use(
        http.get(TEST_URL, () => {
          callCount++;
          if (callCount < 3) {
            return HttpResponse.json(
              { error: { name: 'OPENAPI00007', message: 'Rate limit' } },
              { status: 429 },
            );
          }
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient({ retryBaseDelayMs: 10 });
      const result = await client.get<{ ok: boolean }>(TEST_URL);

      expect(result).toEqual({ ok: true });
      expect(callCount).toBe(3);
    });

    it('maxRetries 초과 시 NexonRateLimitError를 던진다', async () => {
      server.use(
        http.get(TEST_URL, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Rate limit' } },
            { status: 429 },
          ),
        ),
      );

      const client = createClient({ maxRetries: 1, retryBaseDelayMs: 10 });
      await expect(client.get(TEST_URL)).rejects.toThrow(NexonRateLimitError);
    });

    it('500 응답 뒤 재시도에 성공하면 응답을 반환한다', async () => {
      let callCount = 0;
      server.use(
        http.get(TEST_URL, () => {
          callCount++;
          if (callCount === 1) {
            return HttpResponse.json(
              { error: { name: 'OPENAPI00001', message: 'Server error' } },
              { status: 500 },
            );
          }
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient({ maxRetries: 1, retryBaseDelayMs: 1 });
      await expect(client.get(TEST_URL)).resolves.toEqual({ ok: true });
      expect(callCount).toBe(2);
    });

    it.each(['OPENAPI00003', 'OPENAPI00004'])('400 %s는 재시도하지 않는다', async (code) => {
      let callCount = 0;
      server.use(
        http.get(TEST_URL, () => {
          callCount++;
          return HttpResponse.json(
            { error: { name: code, message: 'Bad request' } },
            { status: 400 },
          );
        }),
      );

      const client = createClient({ retryBaseDelayMs: 10 });
      await expect(client.get(TEST_URL)).rejects.toThrow();
      expect(callCount).toBe(1);
    });
  });

  describe('인터셉터', () => {
    it('Request 인터셉터가 실행된다', async () => {
      const interceptor = vi.fn((info) => ({
        ...info,
        headers: { ...info.headers, 'X-Custom': 'test' },
      }));

      let capturedHeaders: Headers | undefined;
      server.use(
        http.get(TEST_URL, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient();
      client.addRequestInterceptor(interceptor);
      await client.get(TEST_URL);

      expect(interceptor).toHaveBeenCalledOnce();
      expect(capturedHeaders?.get('X-Custom')).toBe('test');
    });

    it('Response 인터셉터가 실행된다', async () => {
      const interceptor = vi.fn();
      server.use(http.get(TEST_URL, () => HttpResponse.json({ ok: true })));

      const client = createClient();
      client.addResponseInterceptor(interceptor);
      await client.get(TEST_URL);

      expect(interceptor).toHaveBeenCalledOnce();
      expect(interceptor.mock.calls[0]?.[0]).toHaveProperty('status', 200);
    });
  });

  describe('요청별 옵션 (headers)', () => {
    const captureHeaders = (): (() => Headers) => {
      let captured: Headers | undefined;
      server.use(
        http.get(TEST_URL, ({ request }) => {
          captured = request.headers;
          return HttpResponse.json({ ok: true });
        }),
      );
      return () => {
        if (!captured) throw new Error('요청이 기록되지 않았습니다');
        return captured;
      };
    };

    it('옵션 없이 호출하면 기본 헤더만 보낸다', async () => {
      const headers = captureHeaders();
      await createClient().get(TEST_URL, { key: 'value' }, undefined);

      expect(headers().get('x-nxopen-api-key')).toBe(TEST_API_KEY);
      expect(headers().get('accept')).toBe('application/json');
      expect(headers().get('x-extra')).toBeNull();
    });

    it('빈 옵션 객체는 기본 동작과 같다', async () => {
      const headers = captureHeaders();
      await createClient().get(TEST_URL, undefined, undefined, {});

      expect(headers().get('x-nxopen-api-key')).toBe(TEST_API_KEY);
      expect(headers().get('accept')).toBe('application/json');
    });

    it('헤더를 추가하고 기본 헤더는 유지한다', async () => {
      const headers = captureHeaders();
      await createClient().get(TEST_URL, undefined, undefined, { headers: { 'X-Extra': 'one' } });

      expect(headers().get('x-extra')).toBe('one');
      expect(headers().get('x-nxopen-api-key')).toBe(TEST_API_KEY);
    });

    it('같은 이름의 기본 헤더를 덮어쓴다 (대소문자 무시)', async () => {
      const headers = captureHeaders();
      await createClient().get(TEST_URL, undefined, undefined, {
        headers: { 'X-NXOPEN-API-KEY': 'other-key', accept: 'text/plain' },
      });

      // 표기가 다른 두 헤더가 함께 나가면 fetch가 값을 "a, b"로 합친다
      expect(headers().get('x-nxopen-api-key')).toBe('other-key');
      expect(headers().get('accept')).toBe('text/plain');
    });

    it('undefined 값은 기본 헤더를 제거한다', async () => {
      const headers = captureHeaders();
      await createClient().get(TEST_URL, undefined, undefined, {
        headers: { 'x-nxopen-api-key': undefined, 'x-nxopen-legacy-api-key': 'legacy-key' },
      });

      expect(headers().get('x-nxopen-api-key')).toBeNull();
      expect(headers().get('x-nxopen-legacy-api-key')).toBe('legacy-key');
      expect(headers().get('accept')).toBe('application/json');
    });

    it('요청별 헤더는 다음 요청에 남지 않는다', async () => {
      const client = createClient();
      const first = captureHeaders();
      await client.get(TEST_URL, undefined, undefined, {
        headers: { 'x-nxopen-api-key': undefined, 'X-Extra': 'one' },
      });
      expect(first().get('x-nxopen-api-key')).toBeNull();

      const second = captureHeaders();
      await client.get(TEST_URL);
      expect(second().get('x-nxopen-api-key')).toBe(TEST_API_KEY);
      expect(second().get('x-extra')).toBeNull();
    });

    it('Request 인터셉터와 로거가 병합된 헤더를 받는다', async () => {
      const headers = captureHeaders();
      const seenByInterceptor: Array<Record<string, string>> = [];
      const onRequest = vi.fn();
      const client = createClient({ logger: { onRequest } });
      client.addRequestInterceptor((req) => {
        seenByInterceptor.push(req.headers);
        return { ...req, headers: { ...req.headers, 'X-From-Interceptor': 'yes' } };
      });

      await client.get(TEST_URL, undefined, undefined, {
        headers: { 'x-nxopen-api-key': undefined, 'X-Extra': 'one' },
      });

      expect(seenByInterceptor).toEqual([{ Accept: 'application/json', 'X-Extra': 'one' }]);
      expect(onRequest).toHaveBeenCalledOnce();
      expect(headers().get('x-from-interceptor')).toBe('yes');
      expect(headers().get('x-extra')).toBe('one');
    });

    it('재시도할 때도 같은 요청별 헤더를 보낸다', async () => {
      const seen: Array<string | null> = [];
      const onRetry = vi.fn();
      server.use(
        http.get(TEST_URL, ({ request }) => {
          seen.push(request.headers.get('x-extra'));
          if (seen.length === 1) {
            return HttpResponse.json(
              { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
              { status: 429 },
            );
          }
          return HttpResponse.json({ ok: true });
        }),
      );

      const client = createClient({ retryBaseDelayMs: 1 });
      client.addRetryInterceptor(onRetry);
      const result = await client.get(TEST_URL, undefined, undefined, {
        headers: { 'X-Extra': 'one' },
      });

      expect(result).toEqual({ ok: true });
      expect(seen).toEqual(['one', 'one']);
      expect(onRetry).toHaveBeenCalledOnce();
    });

    it('shape 검증도 그대로 적용된다', async () => {
      server.use(http.get(TEST_URL, () => HttpResponse.json({ unexpected: 1 })));
      const onResponseShapeMismatch = vi.fn();
      const client = createClient({
        responseValidation: true,
        logger: { onResponseShapeMismatch },
      });

      await client.get(
        TEST_URL,
        undefined,
        { expectedKeys: { ouid: 'string' } },
        { headers: { 'X-Extra': 'one' } },
      );

      expect(onResponseShapeMismatch).toHaveBeenCalledOnce();
    });
  });
});
