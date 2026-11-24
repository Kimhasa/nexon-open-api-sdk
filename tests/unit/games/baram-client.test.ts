import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { BaramClient } from '../../../src/games/baram/BaramClient.js';
import { BaramCharacterClient } from '../../../src/games/baram/character/BaramCharacterClient.js';
import type { BaramOCID } from '../../../src/games/baram/types.js';
import {
  baramCharacterBasicFixture,
  baramCharacterGuildFixture,
  baramCharacterItemEquipmentFixture,
  baramCharacterNoGuildFixture,
  baramCharacterStatFixture,
  baramCharacterTitleEquipmentFixture,
  baramCharacterTitleFixture,
  baramOcidFixture,
} from '../../fixtures/baram/character.fixture.js';
import { server } from '../../mocks/server.js';

const ORIGIN = 'https://open.api.nexon.com';
const TEST_OCID = baramOcidFixture.ocid as BaramOCID;

const requests: URL[] = [];
const shapeMismatches: ShapeMismatch[] = [];
const onRequest = ({ request }: { request: Request }): void => {
  requests.push(new URL(request.url));
};

const createClient = (): BaramClient =>
  new BaramClient(
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

describe('BaramClient', () => {
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
    it('character getter는 BaramCharacterClient를 반환하고 인스턴스를 재사용한다', () => {
      const client = createClient();
      expect(client.character).toBeInstanceOf(BaramCharacterClient);
      expect(client.character).toBe(client.character);
    });
  });

  describe('getOcid', () => {
    it('GET /baram/v1/id?character_name&server_name — ocid를 반환한다', async () => {
      const ocid = await createClient().getOcid('테스트바람', '연');

      expect(ocid).toBe(baramOcidFixture.ocid);
      expectRequest('/baram/v1/id', { character_name: '테스트바람', server_name: '연' });
    });

    it('빈 캐릭터 명·서버 명은 요청 없이 NexonBadRequestError를 던진다', async () => {
      const client = createClient();

      await expect(client.getOcid('', '연')).rejects.toThrow(NexonBadRequestError);
      await expect(client.getOcid(' ', '연')).rejects.toThrow(/characterName 값이 비어 있습니다/);
      await expect(client.getOcid('테스트바람', '')).rejects.toThrow(
        /serverName 값이 비어 있습니다/,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('character', () => {
    it('getBasic — GET /baram/v1/character/basic?ocid', async () => {
      const result = await createClient().character.getBasic({ ocid: TEST_OCID });

      expect(result).toEqual(baramCharacterBasicFixture);
      expectRequest('/baram/v1/character/basic', { ocid: TEST_OCID });
    });

    it('getTitle — GET /baram/v1/character/title?ocid', async () => {
      const result = await createClient().character.getTitle({ ocid: TEST_OCID });

      expect(result).toEqual(baramCharacterTitleFixture);
      expect(result.title[1]?.date_expire).toBeNull();
      expectRequest('/baram/v1/character/title', { ocid: TEST_OCID });
    });

    it('getTitleEquipment — GET /baram/v1/character/title-equipment?ocid', async () => {
      const result = await createClient().character.getTitleEquipment({ ocid: TEST_OCID });

      expect(result).toEqual(baramCharacterTitleEquipmentFixture);
      expectRequest('/baram/v1/character/title-equipment', { ocid: TEST_OCID });
    });

    it('getItemEquipment — GET /baram/v1/character/item-equipment?ocid', async () => {
      const result = await createClient().character.getItemEquipment({ ocid: TEST_OCID });

      expect(result).toEqual(baramCharacterItemEquipmentFixture);
      expectRequest('/baram/v1/character/item-equipment', { ocid: TEST_OCID });
    });

    it('getStat — GET /baram/v1/character/stat?ocid', async () => {
      const result = await createClient().character.getStat({ ocid: TEST_OCID });

      expect(result).toEqual(baramCharacterStatFixture);
      expectRequest('/baram/v1/character/stat', { ocid: TEST_OCID });
    });

    it('getGuild — GET /baram/v1/character/guild?ocid', async () => {
      const result = await createClient().character.getGuild({ ocid: TEST_OCID });

      expect(result).toEqual(baramCharacterGuildFixture);
      expectRequest('/baram/v1/character/guild', { ocid: TEST_OCID });
    });

    it('getGuild — guild_name 이 null 이어도 shape 경고 없이 그대로 반환한다', async () => {
      server.use(
        http.get(`${ORIGIN}/baram/v1/character/guild`, () =>
          HttpResponse.json(baramCharacterNoGuildFixture),
        ),
      );

      const result = await createClient().character.getGuild({ ocid: TEST_OCID });

      expect(result.guild_name).toBeNull();
    });

    it('빈 ocid는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { character } = createClient();
      const empty = { ocid: '' as BaramOCID };

      await expect(character.getBasic(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getTitle(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getTitleEquipment(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getItemEquipment(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getStat(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getGuild(empty)).rejects.toThrow(
        /getOcid\(characterName, serverName\)/,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('에러 경로', () => {
    it('400 OPENAPI00004 → NexonBadRequestError', async () => {
      server.use(
        http.get(`${ORIGIN}/baram/v1/character/basic`, () =>
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
        http.get(`${ORIGIN}/baram/v1/id`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(createClient().getOcid('테스트바람', '연')).rejects.toThrow(NexonAuthError);
    });

    it('429 OPENAPI00007 → NexonRateLimitError', async () => {
      server.use(
        http.get(`${ORIGIN}/baram/v1/character/stat`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );

      await expect(createClient().character.getStat({ ocid: TEST_OCID })).rejects.toThrow(
        NexonRateLimitError,
      );
    });
  });
});
