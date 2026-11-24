import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';
import { platformNoticeListFixture } from '../../fixtures/platform/notice.fixture.js';

/** 넥슨 Open API 플랫폼 MSW 핸들러 */
export const platformHandlers: RequestHandler[] = [
  // 스펙 경로 그대로: `{prefix}/v1` 꼴이 아니라 `/platform/openapi/v1/notice`
  http.get('https://open.api.nexon.com/platform/openapi/v1/notice', ({ request }) => {
    if (!request.headers.get('x-nxopen-api-key')) {
      return HttpResponse.json(
        { error: { name: 'OPENAPI00002', message: 'Invalid or missing API Key' } },
        { status: 403 },
      );
    }
    const gameName = new URL(request.url).searchParams.get('game_name');
    return HttpResponse.json(
      gameName === null
        ? platformNoticeListFixture
        : { notice: platformNoticeListFixture.notice.filter((n) => n.game_name === gameName) },
    );
  }),
];
