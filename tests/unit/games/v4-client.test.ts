import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { V4Client } from '../../../src/games/v4/V4Client.js';
import { V4CharacterClient } from '../../../src/games/v4/character/V4CharacterClient.js';
import type { V4OCID } from '../../../src/games/v4/types.js';
import {
  v4CharacterBasicFixture,
  v4CharacterHonorEquipmentFixture,
  v4CharacterHonorFixture,
  v4OcidFixture,
} from '../../fixtures/v4/character.fixture.js';
import { server } from '../../mocks/server.js';

const ORIGIN = 'https://open.api.nexon.com';
const TEST_OCID = v4OcidFixture.ocid as V4OCID;

const requests: URL[] = [];
const shapeMismatches: ShapeMismatch[] = [];
const onRequest = ({ request }: { request: Request }): void => {
  requests.push(new URL(request.url));
};

const createClient = (): V4Client =>
  new V4Client(
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

describe('V4Client', () => {
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
    it('character getter는 V4CharacterClient를 반환하고 인스턴스를 재사용한다', () => {
      const client = createClient();
      expect(client.character).toBeInstanceOf(V4CharacterClient);
      expect(client.character).toBe(client.character);
    });
  });

  describe('getOcid', () => {
    it('GET /v4/v1/id?character_name — ocid를 반환한다', async () => {
      const ocid = await createClient().getOcid('테스트브이포');

      expect(ocid).toBe(v4OcidFixture.ocid);
      expectRequest('/v4/v1/id', { character_name: '테스트브이포' });
    });

    it('빈 캐릭터 명은 요청 없이 NexonBadRequestError를 던진다', async () => {
      const client = createClient();

      await expect(client.getOcid('')).rejects.toThrow(NexonBadRequestError);
      await expect(client.getOcid('  ')).rejects.toThrow(
        /characterName 값이 비어 있거나 문자열이 아닙니다/,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('character', () => {
    it('getBasic — GET /v4/v1/character/basic?ocid', async () => {
      const result = await createClient().character.getBasic({ ocid: TEST_OCID });

      expect(result).toEqual(v4CharacterBasicFixture);
      expectRequest('/v4/v1/character/basic', { ocid: TEST_OCID });
    });

    it('getHonor — GET /v4/v1/character/honor?ocid', async () => {
      const result = await createClient().character.getHonor({ ocid: TEST_OCID });

      expect(result).toEqual(v4CharacterHonorFixture);
      expect(result.honor[1]?.date_expire).toBeNull();
      expectRequest('/v4/v1/character/honor', { ocid: TEST_OCID });
    });

    it('getHonorEquipment — GET /v4/v1/character/honor-equipment?ocid', async () => {
      const result = await createClient().character.getHonorEquipment({ ocid: TEST_OCID });

      expect(result).toEqual(v4CharacterHonorEquipmentFixture);
      expectRequest('/v4/v1/character/honor-equipment', { ocid: TEST_OCID });
    });

    it('빈 ocid는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { character } = createClient();
      const empty = { ocid: '' as V4OCID };

      await expect(character.getBasic(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getHonor(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getHonorEquipment(empty)).rejects.toThrow(/getOcid\(characterName\)/);
      expect(requests).toHaveLength(0);
    });
  });

  describe('에러 경로', () => {
    it('400 OPENAPI00004 → NexonBadRequestError', async () => {
      server.use(
        http.get(`${ORIGIN}/v4/v1/character/basic`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
            { status: 400 },
          ),
        ),
      );

      const error: unknown = await createClient()
        .character.getBasic({ ocid: TEST_OCID })
        .catch((err: unknown) => err);

      expect(error).toBeInstanceOf(NexonBadRequestError);
      expect((error as NexonBadRequestError).nexonMessage).toBe('Please input valid parameter');
    });

    it('403 OPENAPI00002 → NexonAuthError', async () => {
      server.use(
        http.get(`${ORIGIN}/v4/v1/id`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(createClient().getOcid('테스트브이포')).rejects.toThrow(NexonAuthError);
    });

    it('429 OPENAPI00007 → NexonRateLimitError', async () => {
      server.use(
        http.get(`${ORIGIN}/v4/v1/character/honor`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );

      await expect(createClient().character.getHonor({ ocid: TEST_OCID })).rejects.toThrow(
        NexonRateLimitError,
      );
    });
  });
});
