/**
 * 이름으로 고유 번호를 찾는 메서드가 "없는 이름"을 NexonNotFoundError 로 알리는지 확인한다.
 *
 * 넥슨은 없는 캐릭터·계정 이름에 HTTP 400 + `OPENAPI00004` 를 돌려주고 (14개 게임),
 * 메이플스토리·SEA·TW 길드 이름 조회는 HTTP 200 + `{ oguild_id: null }` 을 돌려준다 (2026-11-24 실측).
 */
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { NexonClient } from '../../../src/NexonClient.js';
import { NexonNotFoundError } from '../../../src/core/errors/NexonNotFoundError.js';
import { server } from '../../mocks/server.js';

const BASE = 'https://open.api.nexon.com';
const client = new NexonClient({ apiKey: 'test-key', maxRetries: 0 });

const invalidParameter = (): Response =>
  HttpResponse.json(
    { error: { name: 'OPENAPI00004', message: 'Please input valid parameter' } },
    { status: 400 },
  );

const lookups: ReadonlyArray<readonly [string, string, () => Promise<unknown>]> = [
  ['메이플스토리 캐릭터', '/maplestory/v1/id', () => client.maplestory.getOcid('없는캐릭터')],
  [
    '메이플스토리M 캐릭터',
    '/maplestorym/v1/id',
    () => client.maplestorym.getOcid('스카니아', '없는캐릭터'),
  ],
  [
    '메이플스토리M 길드',
    '/maplestorym/v1/guild/id',
    () => client.maplestorym.guild.getId('스카니아', '없는길드'),
  ],
  [
    'MapleStory SEA 캐릭터',
    '/maplestorysea/v1/id',
    () => client.maplestorySEA.getOcid('NoSuchName'),
  ],
  ['MapleStory TW 캐릭터', '/maplestorytw/v1/id', () => client.maplestoryTW.getOcid('NoSuchName')],
  ['FC 온라인 구단주', '/fconline/v1/id', () => client.fcOnline.getOuid('없는구단주')],
  ['퍼스트 디센던트 계정', '/tfd/v1/id', () => client.firstDescendant.getOuid('NoSuchName#1234')],
  ['마비노기 영웅전 캐릭터', '/heroes/v2/id', () => client.mabinogiHeroes.getOcid('없는캐릭터')],
  ['서든어택 계정', '/suddenattack/v1/id', () => client.suddenAttack.getOuid('없는계정')],
  ['카트라이더 라이더', '/kartrush/v1/id', () => client.kartrider.getOuidInfo('없는라이더')],
  ['바람의나라 캐릭터', '/baram/v1/id', () => client.baram.getOcid('없는캐릭터', '연')],
  ['바람의나라: 연 캐릭터', '/baramy/v1/id', () => client.baramYeon.getOcid('없는캐릭터', '연')],
  ['V4 캐릭터', '/v4/v1/id', () => client.v4.getOcid('없는캐릭터')],
  ['히트2 캐릭터', '/hit2/v1/id', () => client.hit2.getOcid('없는캐릭터')],
];

describe('이름 조회: 없는 이름은 NexonNotFoundError', () => {
  it.each(lookups)(
    '%s — 넥슨의 OPENAPI00004 를 NexonNotFoundError 로 알린다',
    async (_, path, call) => {
      server.use(http.get(`${BASE}${path}`, invalidParameter));
      const error: unknown = await call().catch((err: unknown) => err);
      expect(error).toBeInstanceOf(NexonNotFoundError);
      // 넥슨이 준 코드와 원문은 그대로 남는다
      expect(error).toMatchObject({
        code: 'OPENAPI00004',
        status: 400,
        nexonMessage: 'Please input valid parameter',
      });
    },
  );

  it.each([
    [
      '메이플스토리 길드',
      '/maplestory/v1/guild/id',
      () => client.maplestory.guild.getId('없는길드', '스카니아'),
    ],
    [
      'MapleStory SEA 길드',
      '/maplestorysea/v1/guild/id',
      () => client.maplestorySEA.guild.getId('NoSuchGuild', 'Aquila'),
    ],
    [
      'MapleStory TW 길드',
      '/maplestorytw/v1/guild/id',
      () => client.maplestoryTW.guild.getId('NoSuchGuild', '艾麗亞'),
    ],
  ] as const)(
    '%s — 200과 oguild_id: null 을 NexonNotFoundError 로 알린다',
    async (_, path, call) => {
      server.use(http.get(`${BASE}${path}`, () => HttpResponse.json({ oguild_id: null })));
      const error: unknown = await call().catch((err: unknown) => err);
      expect(error).toBeInstanceOf(NexonNotFoundError);
      expect(error).toMatchObject({ status: 200, code: undefined });
    },
  );
});
