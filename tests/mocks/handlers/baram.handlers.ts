import { http, HttpResponse } from 'msw';
import type { JsonBodyType, RequestHandler } from 'msw';
import {
  baramCharacterBasicFixture,
  baramCharacterGuildFixture,
  baramCharacterItemEquipmentFixture,
  baramCharacterStatFixture,
  baramCharacterTitleEquipmentFixture,
  baramCharacterTitleFixture,
  baramOcidFixture,
} from '../../fixtures/baram/character.fixture.js';

const BASE = 'https://open.api.nexon.com/baram/v1';

/** 스펙의 필수 헤더·쿼리 파라미터가 빠지면 넥슨 API처럼 403/400을 돌려준다. */
const get = (path: string, requiredParams: readonly string[], body: JsonBodyType): RequestHandler =>
  http.get(`${BASE}${path}`, ({ request }) => {
    if (!request.headers.get('x-nxopen-api-key')) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
        { status: 403 },
      );
    }
    const { searchParams } = new URL(request.url);
    if (requiredParams.some((name) => !searchParams.get(name))) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(body);
  });

/** 바람의나라 MSW 핸들러 */
export const baramHandlers: RequestHandler[] = [
  get('/id', ['character_name', 'server_name'], baramOcidFixture),
  get('/character/basic', ['ocid'], baramCharacterBasicFixture),
  get('/character/title', ['ocid'], baramCharacterTitleFixture),
  get('/character/title-equipment', ['ocid'], baramCharacterTitleEquipmentFixture),
  get('/character/item-equipment', ['ocid'], baramCharacterItemEquipmentFixture),
  get('/character/stat', ['ocid'], baramCharacterStatFixture),
  get('/character/guild', ['ocid'], baramCharacterGuildFixture),
];
