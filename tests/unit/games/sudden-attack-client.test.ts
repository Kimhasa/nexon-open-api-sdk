import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NexonClient, NexonAuthError } from '../../../src/index.js';
import type {
  SuddenAttackClient,
  SuddenAttackMatchMode,
  SuddenAttackMatchType,
  SuddenAttackOuid,
} from '../../../src/index.js';
import {
  suddenAttackMatchDetailFixture,
  suddenAttackMatchListFixture,
  suddenAttackOuidFixture,
  suddenAttackUserBasicFixture,
  suddenAttackUserRankFixture,
  suddenAttackUserRecentInfoFixture,
  suddenAttackUserTierFixture,
} from '../../fixtures/sudden-attack/fixtures.fixture.js';
import {
  suddenAttackGradeFixture,
  suddenAttackLogoFixture,
  suddenAttackSeasonGradeFixture,
  suddenAttackTierFixture,
} from '../../fixtures/sudden-attack/metadata.fixture.js';
import { server } from '../../mocks/server.js';

const BASE = '/suddenattack/v1';
const ouid = suddenAttackOuidFixture.ouid;
const onRequest = vi.fn<({ url }: { url: string }) => void>();
const onResponseShapeMismatch = vi.fn();
let game: SuddenAttackClient;

function expectRequest(path: string, query: Record<string, string> = {}): void {
  const request = onRequest.mock.lastCall?.[0];
  expect(request).toBeDefined();
  const url = new URL(request!.url);
  expect(url.origin).toBe('https://open.api.nexon.com');
  expect(url.pathname).toBe(path);
  expect(Object.fromEntries(url.searchParams)).toEqual(query);
  expect(onResponseShapeMismatch).not.toHaveBeenCalled();
}

beforeEach(() => {
  onRequest.mockClear();
  onResponseShapeMismatch.mockClear();
  game = new NexonClient({
    apiKey: 'test-api-key',
    responseValidation: true,
    logger: { onRequest, onResponseShapeMismatch },
  }).suddenAttack;
});

describe('SuddenAttackClient', () => {
  it('sub-client 인스턴스를 재사용한다', () => {
    expect(game.user).toBe(game.user);
    expect(game.match).toBe(game.match);
    expect(game.metadata).toBe(game.metadata);
  });

  it('닉네임으로 계정 식별자를 조회한다', async () => {
    await expect(game.getOuid('합성 유저')).resolves.toBe(ouid);
    expectRequest(`${BASE}/id`, { user_name: '합성 유저' });
  });

  it.each([
    ['basic', () => game.user.getBasic(ouid), suddenAttackUserBasicFixture],
    ['rank', () => game.user.getRank(ouid), suddenAttackUserRankFixture],
    ['tier', () => game.user.getTier(ouid), suddenAttackUserTierFixture],
    ['recent-info', () => game.user.getRecentInfo(ouid), suddenAttackUserRecentInfoFixture],
  ] as const)('user/%s 계정 정보를 조회한다', async (path, get, fixture) => {
    await expect(get()).resolves.toEqual(fixture);
    expectRequest(`${BASE}/user/${path}`, { ouid });
  });

  it('매치 모드와 유형으로 최근 매치 목록을 조회한다', async () => {
    const params = { ouid, match_mode: '폭파미션', match_type: '퀵매치 클랜전' } as const;
    await expect(game.match.list(params)).resolves.toEqual(suddenAttackMatchListFixture);
    expectRequest(`${BASE}/match`, params);
  });

  it('매치 유형을 생략할 수 있다', async () => {
    const params = { ouid, match_mode: '폭파미션' } as const;
    await expect(game.match.list(params)).resolves.toEqual(suddenAttackMatchListFixture);
    expectRequest(`${BASE}/match`, params);
  });

  it('매치 식별자로 상세 기록을 조회한다', async () => {
    const matchId = suddenAttackMatchDetailFixture.match_id;
    await expect(game.match.getDetail(matchId)).resolves.toEqual(suddenAttackMatchDetailFixture);
    expectRequest(`${BASE}/match-detail`, { match_id: matchId });
  });

  it.each([
    ['logo', () => game.metadata.getLogo(), suddenAttackLogoFixture],
    ['grade', () => game.metadata.getGrade(), suddenAttackGradeFixture],
    ['season_grade', () => game.metadata.getSeasonGrade(), suddenAttackSeasonGradeFixture],
    ['tier', () => game.metadata.getTier(), suddenAttackTierFixture],
  ] as const)('정적 %s 메타데이터를 조회한다', async (path, get, fixture) => {
    await expect(get()).resolves.toEqual(fixture);
    expectRequest(`/static/suddenattack/meta/${path}`);
  });

  it('403 응답을 NexonAuthError로 분류한다', async () => {
    server.use(
      http.get('https://open.api.nexon.com/suddenattack/v1/id', () =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00002', message: 'Invalid API key' } },
          { status: 403 },
        ),
      ),
    );
    await expect(game.getOuid('합성 유저')).rejects.toBeInstanceOf(NexonAuthError);
  });

  it('빈 식별자를 요청 전에 거절한다', async () => {
    await expect(game.getOuid(' ')).rejects.toThrow(/userName.*닉네임/);
    await expect(game.user.getBasic(' ' as SuddenAttackOuid)).rejects.toThrow(/ouid.*getOuid/);
    await expect(
      game.match.list({ ouid: '' as SuddenAttackOuid, match_mode: '폭파미션' }),
    ).rejects.toThrow(/ouid.*getOuid/);
    await expect(game.match.getDetail('')).rejects.toThrow(/matchId.*match_id/);
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('스펙에 없는 매치 모드와 유형을 요청 전에 거절한다', async () => {
    await expect(
      game.match.list({ ouid, match_mode: '잘못된 모드' as SuddenAttackMatchMode }),
    ).rejects.toThrow(/match_mode/);
    await expect(
      game.match.list({
        ouid,
        match_mode: '개인전',
        match_type: '잘못된 유형' as SuddenAttackMatchType,
      }),
    ).rejects.toThrow(/match_type/);
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('응답 검증이 켜져 있으면 누락된 계정 기본 정보 키를 보고한다', async () => {
    server.use(
      http.get('https://open.api.nexon.com/suddenattack/v1/user/basic', () =>
        HttpResponse.json({ user_name: '합성 유저' }),
      ),
    );
    await game.user.getBasic(ouid);
    expect(onResponseShapeMismatch).toHaveBeenCalledWith(
      expect.objectContaining({ missingKeys: expect.arrayContaining(['manner_grade']) }),
    );
  });
});
