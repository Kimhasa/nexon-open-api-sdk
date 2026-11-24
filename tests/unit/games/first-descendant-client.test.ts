import { describe, it, expect } from 'vitest';
import { http as mswHttp, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonError } from '../../../src/core/errors/NexonError.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
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

const BASE = 'https://open.api.nexon.com/tfd/v1';

/** 클라이언트와, 실제로 나간 요청 URL 기록을 함께 만든다. */
const createClient = (
  apiKey: string = 'test-api-key',
): { client: FirstDescendantClient; urls: string[] } => {
  const http = new HttpClient({ apiKey, maxRetries: 0 });
  const urls: string[] = [];
  http.addRequestInterceptor((info) => {
    urls.push(info.url);
    return info;
  });
  return { client: new FirstDescendantClient(http), urls };
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

    it('빈 닉네임은 요청 없이 NexonError를 던진다', async () => {
      const { client, urls } = createClient();

      await expect(client.getOuid('  ')).rejects.toThrow(NexonError);
      await expect(client.getOuid('')).rejects.toThrow(/userName 값이 비어 있습니다/);
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

    it('빈 ouid는 요청 없이 NexonError를 던지고 고치는 방법을 안내한다', async () => {
      const { client, urls } = createClient();
      const empty = '' as TfdOuid;

      await expect(client.user.getBasic({ ouid: empty })).rejects.toThrow(/getOuid/);
      await expect(client.user.getDescendant({ ouid: empty })).rejects.toThrow(NexonError);
      await expect(client.user.getWeapon({ ouid: empty })).rejects.toThrow(NexonError);
      await expect(client.user.getReactor({ ouid: empty })).rejects.toThrow(NexonError);
      await expect(client.user.getExternalComponent({ ouid: empty })).rejects.toThrow(NexonError);
      await expect(
        client.user.getArcheTuning({ ouid: empty, descendant_group_id: '101000001' }),
      ).rejects.toThrow(NexonError);
      expect(urls).toEqual([]);
    });

    it('빈 descendant_group_id는 요청 없이 NexonError를 던진다', async () => {
      const { client, urls } = createClient();

      await expect(
        client.user.getArcheTuning({ ouid: TFD_TEST_OUID, descendant_group_id: '' }),
      ).rejects.toThrow(/descendant_group_id 값이 비어 있습니다/);
      expect(urls).toEqual([]);
    });

    it('지원하지 않는 language_code는 요청 없이 NexonError를 던진다', async () => {
      const { client, urls } = createClient();

      await expect(
        // @ts-expect-error 지원 목록에 없는 언어 코드
        client.user.getWeapon({ ouid: TFD_TEST_OUID, language_code: 'kr' }),
      ).rejects.toThrow(/지원하지 않는 언어 코드입니다: "kr"/);
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
});
