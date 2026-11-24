import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { BaramYeonClient } from '../../../src/games/baram-yeon/BaramYeonClient.js';
import { BaramYeonCharacterClient } from '../../../src/games/baram-yeon/character/BaramYeonCharacterClient.js';
import type { BaramYeonOCID } from '../../../src/games/baram-yeon/types.js';
import {
  baramYeonCharacterBasicFixture,
  baramYeonCharacterTitleEquipmentFixture,
  baramYeonCharacterTitleFixture,
  baramYeonOcidFixture,
} from '../../fixtures/baram-yeon/character.fixture.js';
import { server } from '../../mocks/server.js';

const ORIGIN = 'https://open.api.nexon.com';
const TEST_OCID = baramYeonOcidFixture.ocid as BaramYeonOCID;

const requests: URL[] = [];
const shapeMismatches: ShapeMismatch[] = [];
const onRequest = ({ request }: { request: Request }): void => {
  requests.push(new URL(request.url));
};

const createClient = (): BaramYeonClient =>
  new BaramYeonClient(
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

describe('BaramYeonClient', () => {
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
    it('character getter는 BaramYeonCharacterClient를 반환하고 인스턴스를 재사용한다', () => {
      const client = createClient();
      expect(client.character).toBeInstanceOf(BaramYeonCharacterClient);
      expect(client.character).toBe(client.character);
    });
  });

  describe('getOcid', () => {
    it('GET /baramy/v1/id?character_name&server_name — ocid를 반환한다', async () => {
      const ocid = await createClient().getOcid('테스트연', '세류');

      expect(ocid).toBe(baramYeonOcidFixture.ocid);
      expectRequest('/baramy/v1/id', { character_name: '테스트연', server_name: '세류' });
    });

    it('빈 캐릭터 명·서버 명은 요청 없이 NexonBadRequestError를 던진다', async () => {
      const client = createClient();

      await expect(client.getOcid('', '연')).rejects.toThrow(NexonBadRequestError);
      await expect(client.getOcid(' ', '연')).rejects.toThrow(/characterName 값이 비어 있습니다/);
      await expect(client.getOcid('테스트연', '')).rejects.toThrow(/serverName 값이 비어 있습니다/);
      expect(requests).toHaveLength(0);
    });
  });

  describe('character', () => {
    it('getBasic — GET /baramy/v1/character/basic?ocid', async () => {
      const result = await createClient().character.getBasic({ ocid: TEST_OCID });

      expect(result).toEqual(baramYeonCharacterBasicFixture);
      expectRequest('/baramy/v1/character/basic', { ocid: TEST_OCID });
    });

    it('getTitle — GET /baramy/v1/character/title?ocid', async () => {
      const result = await createClient().character.getTitle({ ocid: TEST_OCID });

      expect(result).toEqual(baramYeonCharacterTitleFixture);
      expect(result.title[1]?.title_type_name).toBeNull();
      expectRequest('/baramy/v1/character/title', { ocid: TEST_OCID });
    });

    it('getTitleEquipment — GET /baramy/v1/character/title-equipment?ocid', async () => {
      const result = await createClient().character.getTitleEquipment({ ocid: TEST_OCID });

      expect(result).toEqual(baramYeonCharacterTitleEquipmentFixture);
      expect(result.title_equipment[0]?.title_equipment_type).toBe('1');
      expectRequest('/baramy/v1/character/title-equipment', { ocid: TEST_OCID });
    });

    it('빈 ocid는 요청 없이 NexonBadRequestError를 던진다', async () => {
      const { character } = createClient();
      const empty = { ocid: '' as BaramYeonOCID };

      await expect(character.getBasic(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getTitle(empty)).rejects.toThrow(NexonBadRequestError);
      await expect(character.getTitleEquipment(empty)).rejects.toThrow(
        /getOcid\(characterName, serverName\)/,
      );
      expect(requests).toHaveLength(0);
    });
  });

  describe('에러 경로', () => {
    it('400 OPENAPI00004 → NexonBadRequestError', async () => {
      server.use(
        http.get(`${ORIGIN}/baramy/v1/character/basic`, () =>
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
        http.get(`${ORIGIN}/baramy/v1/id`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00002', message: 'Invalid API Key' } },
            { status: 403 },
          ),
        ),
      );

      await expect(createClient().getOcid('테스트연', '연')).rejects.toThrow(NexonAuthError);
    });

    it('429 OPENAPI00007 → NexonRateLimitError', async () => {
      server.use(
        http.get(`${ORIGIN}/baramy/v1/character/title`, () =>
          HttpResponse.json(
            { error: { name: 'OPENAPI00007', message: 'Too Many Requests' } },
            { status: 429 },
          ),
        ),
      );

      await expect(createClient().character.getTitle({ ocid: TEST_OCID })).rejects.toThrow(
        NexonRateLimitError,
      );
    });
  });
});
