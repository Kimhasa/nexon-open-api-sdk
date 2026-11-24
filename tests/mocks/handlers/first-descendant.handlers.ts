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

import {
  tfdAcquisitionDetailMetaFixture,
  tfdArcheTuningNodeMetaFixture,
  tfdCollectibleItemMetaFixture,
  tfdConsumableMaterialMetaFixture,
  tfdCoreTypeMetaFixture,
  tfdCustomizingItemMetaFixture,
  tfdDescendantMetaFixture,
  tfdDescendantGroupMetaFixture,
  tfdExternalComponentMetaFixture,
  tfdFellowMetaFixture,
  tfdMedalMetaFixture,
  tfdModuleMetaFixture,
  tfdNodeItemMetaFixture,
  tfdNodeSocketTypeMetaFixture,
  tfdReactorMetaFixture,
  tfdResearchMetaFixture,
  tfdRewardMetaFixture,
  tfdStatMetaFixture,
  tfdTierMetaFixture,
  tfdTitleMetaFixture,
  tfdVehicleMetaFixture,
  tfdVoidBattleMetaFixture,
  tfdWeaponMetaFixture,
  tfdWeaponTypeMetaFixture,
  tfdAdaptLevelMetaFixture,
  tfdAmorphousRewardMetaFixture,
  tfdArcheTuningBoardMetaFixture,
  tfdArcheTuningBoardGroupMetaFixture,
  tfdCoreSlotMetaFixture,
  tfdDescendantLevelDetailMetaFixture,
  tfdFellowLevelDetailMetaFixture,
  tfdMasteryRankLevelDetailMetaFixture,
} from '../../fixtures/first-descendant/meta.fixture.js';

const BASE = 'https://open.api.nexon.com/tfd/v1';
const META = 'https://open.api.nexon.com/static/tfd/meta';

const LANGUAGES = ['ko', 'en', 'de', 'fr', 'ja', 'zh-CN', 'zh-TW', 'it', 'pl', 'pt', 'ru', 'es'];

/** 언어별 메타데이터: 파일 이름 → fixture (/static/tfd/meta/{language_code}/{file}.json) */
const LOCALIZED_META: Readonly<Record<string, JsonBodyType>> = {
  'acquisition-detail': tfdAcquisitionDetailMetaFixture,
  'arche-tuning-node': tfdArcheTuningNodeMetaFixture,
  'collectible-item': tfdCollectibleItemMetaFixture,
  'consumable-material': tfdConsumableMaterialMetaFixture,
  'core-type': tfdCoreTypeMetaFixture,
  'customizing-item': tfdCustomizingItemMetaFixture,
  descendant: tfdDescendantMetaFixture,
  'descendant-group': tfdDescendantGroupMetaFixture,
  'external-component': tfdExternalComponentMetaFixture,
  fellow: tfdFellowMetaFixture,
  medal: tfdMedalMetaFixture,
  module: tfdModuleMetaFixture,
  'node-item': tfdNodeItemMetaFixture,
  'node-socket-type': tfdNodeSocketTypeMetaFixture,
  reactor: tfdReactorMetaFixture,
  research: tfdResearchMetaFixture,
  reward: tfdRewardMetaFixture,
  stat: tfdStatMetaFixture,
  tier: tfdTierMetaFixture,
  title: tfdTitleMetaFixture,
  vehicle: tfdVehicleMetaFixture,
  'void-battle': tfdVoidBattleMetaFixture,
  weapon: tfdWeaponMetaFixture,
  'weapon-type': tfdWeaponTypeMetaFixture,
};

/** 공통 메타데이터: 파일 이름 → fixture (/static/tfd/meta/{file}.json) */
const COMMON_META: Readonly<Record<string, JsonBodyType>> = {
  'adapt-level': tfdAdaptLevelMetaFixture,
  'amorphous-reward': tfdAmorphousRewardMetaFixture,
  'arche-tuning-board': tfdArcheTuningBoardMetaFixture,
  'arche-tuning-board-group': tfdArcheTuningBoardGroupMetaFixture,
  'core-slot': tfdCoreSlotMetaFixture,
  'descendant-level-detail': tfdDescendantLevelDetailMetaFixture,
  'fellow-level-detail': tfdFellowLevelDetailMetaFixture,
  'mastery-rank-level-detail': tfdMasteryRankLevelDetailMetaFixture,
};

// 실서버는 없는 정적 경로(미지원 언어, 없는 파일)에 JSON이 아닌 403 XML을 돌려준다
const accessDenied = (): Response =>
  new HttpResponse(
    '<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>AccessDenied</Code><Message>Access Denied</Message></Error>',
    { status: 403, headers: { 'Content-Type': 'application/xml' } },
  );

const metaBody = (table: Readonly<Record<string, JsonBodyType>>, file: unknown): Response => {
  const name = typeof file === 'string' && file.endsWith('.json') ? file.slice(0, -5) : '';
  const body = Object.hasOwn(table, name) ? table[name] : undefined;
  return body === undefined ? accessDenied() : HttpResponse.json(body);
};

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

  // ─── 메타데이터 정보 조회 (정적 파일, API 키 불필요) ───
  http.get(`${META}/:language/:file`, ({ params }) =>
    typeof params['language'] === 'string' && LANGUAGES.includes(params['language'])
      ? metaBody(LOCALIZED_META, params['file'])
      : accessDenied(),
  ),
  http.get(`${META}/:file`, ({ params }) => metaBody(COMMON_META, params['file'])),
];
