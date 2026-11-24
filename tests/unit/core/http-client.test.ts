import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server.js';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonError } from '../../../src/core/errors/NexonError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonServerError } from '../../../src/core/errors/NexonServerError.js';

const TEST_URL = 'https://test-api.example.com/test';
const TEST_API_KEY = 'test-api-key-123';

const createClient = (overrides: Record<string, unknown> = {}): HttpClient =>
  new HttpClient({ apiKey: TEST_API_KEY, ...overrides });

describe('HttpClient', () => {
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

    it('400 응답은 재시도하지 않는다', async () => {
      let callCount = 0;
      server.use(
        http.get(TEST_URL, () => {
          callCount++;
          return HttpResponse.json(
            { error: { name: 'OPENAPI00004', message: 'Bad request' } },
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
