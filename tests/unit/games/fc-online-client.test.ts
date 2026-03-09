import { describe, it, expect } from 'vitest';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { FcOnlineClient } from '../../../src/games/fc-online/FcOnlineClient.js';
import type { OUID } from '../../../src/games/fc-online/user/types.js';
import {
  fcOuidFixture,
  fcUserBasicFixture,
  fcMaxDivisionFixture,
  fcMatchListFixture,
  fcAllMatchListFixture,
  fcMatchDetailFixture,
  fcMatchTypeMetaFixture,
} from '../../fixtures/fc-online/fixtures.fixture.js';

const TEST_API_KEY = 'test-api-key';
const createClient = () => {
  const http = new HttpClient({ apiKey: TEST_API_KEY });
  return new FcOnlineClient(http);
};

const TEST_OUID = fcOuidFixture.ouid as OUID;

describe('FcOnlineClient', () => {
  describe('getOuid', () => {
    it('닉네임으로 OUID를 조회한다', async () => {
      const client = createClient();
      const ouid = await client.getOuid('테스트유저FC');
      expect(ouid).toBe(fcOuidFixture.ouid);
    });
  });

  describe('getBasic', () => {
    it('유저 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.getBasic(TEST_OUID);

      expect(result.nickname).toBe(fcUserBasicFixture.nickname);
      expect(result.level).toBe(fcUserBasicFixture.level);
      expect(result.ouid).toBe(fcUserBasicFixture.ouid);
    });
  });

  describe('getMaxDivision', () => {
    it('역대 최고 등급 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.getMaxDivision(TEST_OUID);

      expect(result).toHaveLength(2);
      expect(result[0]?.matchType).toBe(fcMaxDivisionFixture[0]?.matchType);
      expect(result[0]?.division).toBe(fcMaxDivisionFixture[0]?.division);
    });
  });

  describe('getMatchList', () => {
    it('유저의 매치 ID 목록을 반환한다', async () => {
      const client = createClient();
      const result = await client.getMatchList({
        ouid: TEST_OUID,
        matchtype: 50,
      });

      expect(result).toHaveLength(3);
      expect(result[0]).toBe(fcMatchListFixture[0]);
    });
  });

  describe('getAllMatchList', () => {
    it('전체 매치 ID 목록을 반환한다', async () => {
      const client = createClient();
      const result = await client.getAllMatchList({
        matchtype: 50,
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(fcAllMatchListFixture[0]);
    });
  });

  describe('getMatchDetail', () => {
    it('매치 상세 기록을 반환한다', async () => {
      const client = createClient();
      const result = await client.getMatchDetail('6572d9bbc7331d2a45f3d755');

      expect(result.matchId).toBe(fcMatchDetailFixture.matchId);
      expect(result.matchDate).toBe(fcMatchDetailFixture.matchDate);
      expect(result.matchType).toBe(fcMatchDetailFixture.matchType);
      expect(result.matchInfo).toHaveLength(1);
      expect(result.matchInfo[0]?.nickname).toBe('테스트유저FC');
      expect(result.matchInfo[0]?.matchDetail.matchResult).toBe('승');
    });
  });

  describe('metadata', () => {
    it('getMatchTypeMeta — 매치 종류 메타데이터를 반환한다', async () => {
      const client = createClient();
      const result = await client.getMatchTypeMeta();

      expect(result).toHaveLength(2);
      expect(result[0]?.matchtype).toBe(fcMatchTypeMetaFixture[0]?.matchtype);
      expect(result[0]?.desc).toBe(fcMatchTypeMetaFixture[0]?.desc);
    });
  });

  describe('image URL', () => {
    it('getActionShotUrl — 액션샷 이미지 URL을 조립한다', () => {
      const client = createClient();
      const url = client.getActionShotUrl(272167135);

      expect(url).toBe(
        'https://open.api.nexon.com/live/externalAssets/common/playersAction/p272167135.png',
      );
    });

    it('getPlayerImageUrl — 선수 이미지 URL을 조립한다', () => {
      const client = createClient();
      const url = client.getPlayerImageUrl(272167135);

      expect(url).toBe(
        'https://open.api.nexon.com/live/externalAssets/common/players/p272167135.png',
      );
    });
  });
});
