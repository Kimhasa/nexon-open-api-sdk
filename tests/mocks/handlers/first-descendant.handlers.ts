import { http, HttpResponse } from 'msw';
import type { JsonBodyType, RequestHandler } from 'msw';
import {
  tfdOuidFixture,
  tfdUserArcheTuningFixture,
  tfdUserBasicFixture,
  tfdUserDescendantFixture,
  tfdUserExternalComponentFixture,
  tfdUserReactorFixture,
  tfdUserWeaponFixture,
} from '../../fixtures/first-descendant/user.fixture.js';

const BASE = 'https://open.api.nexon.com/tfd/v1';

/**
 * 키 인증 API 핸들러를 만든다.
 * API 키가 없으면 403, 스펙의 required 쿼리 파라미터가 하나라도 빠지면 400을 돌려준다.
 */
const keyed = (
  path: string,
  requiredParams: readonly string[],
  body: JsonBodyType,
): RequestHandler =>
  http.get(`${BASE}/${path}`, ({ request }) => {
    if (!request.headers.get('x-nxopen-api-key')) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
        { status: 403 },
      );
    }
    const query = new URL(request.url).searchParams;
    if (requiredParams.some((name) => !query.get(name))) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
        { status: 400 },
      );
    }
    return HttpResponse.json(body);
  });

/** 퍼스트 디센던트 (The First Descendant) MSW 핸들러 */
export const firstDescendantHandlers: RequestHandler[] = [
  // ─── 계정 정보 조회 ───
  keyed('id', ['user_name'], tfdOuidFixture),
  keyed('user/basic', ['ouid'], tfdUserBasicFixture),
  keyed('user/descendant', ['ouid'], tfdUserDescendantFixture),
  keyed('user/weapon', ['language_code', 'ouid'], tfdUserWeaponFixture),
  keyed('user/reactor', ['language_code', 'ouid'], tfdUserReactorFixture),
  keyed('user/external-component', ['language_code', 'ouid'], tfdUserExternalComponentFixture),
  keyed('user/arche-tuning', ['ouid', 'descendant_group_id'], tfdUserArcheTuningFixture),
];
