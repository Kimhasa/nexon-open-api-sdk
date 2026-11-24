import { http, HttpResponse } from 'msw';
import type { JsonBodyType, RequestHandler } from 'msw';
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

const BASE = 'https://open.api.nexon.com/kartrush/v1';

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

/** 카트라이더 러쉬플러스 MSW 핸들러 */
export const kartriderHandlers: RequestHandler[] = [
  get('/id', ['racer_name'], kartriderOuidLookupFixture),
  get('/user/basic', ['ouid'], kartriderUserBasicFixture),
  get('/user/title-equipment', ['ouid'], kartriderUserTitleEquipmentFixture),
  get('/notice', [], kartriderNoticeListFixture),
  get('/notice/detail', ['notice_id'], kartriderNoticeDetailFixture),
  get('/notice-season', [], kartriderSeasonNoticeListFixture),
  get('/notice-season/detail', ['notice_id'], kartriderSeasonNoticeDetailFixture),
  get('/notice-event', [], kartriderEventNoticeListFixture),
  get('/notice-event/detail', ['notice_id'], kartriderEventNoticeDetailFixture),
];
