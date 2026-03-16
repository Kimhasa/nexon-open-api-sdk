import { describe, it, expect } from 'vitest';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { MapleStoryMClient } from '../../../src/games/maplestory-m/MapleStoryMClient.js';
import { MapleStoryMCharacterClient } from '../../../src/games/maplestory-m/character/MapleStoryMCharacterClient.js';
import { MapleStoryMUnionClient } from '../../../src/games/maplestory-m/union/MapleStoryMUnionClient.js';
import { MapleStoryMGuildClient } from '../../../src/games/maplestory-m/guild/MapleStoryMGuildClient.js';
import { MapleStoryMRankingClient } from '../../../src/games/maplestory-m/ranking/MapleStoryMRankingClient.js';
import { MapleStoryMNoticeClient } from '../../../src/games/maplestory-m/notice/MapleStoryMNoticeClient.js';
import type { OCID } from '../../../src/games/_base/maple-base-types.js';
import type { GuildId } from '../../../src/games/_base/maple-base-types.js';
import { mOcidFixture } from '../../fixtures/maplestory-m/ocid.fixture.js';
import { mCharacterBasicFixture } from '../../fixtures/maplestory-m/character-basic.fixture.js';
import { mUnionFixture } from '../../fixtures/maplestory-m/union.fixture.js';
import { mGuildIdFixture, mGuildBasicFixture } from '../../fixtures/maplestory-m/guild.fixture.js';

import {
  mNoticeListFixture,
  mNoticeDetailFixture,
} from '../../fixtures/maplestory-m/notice.fixture.js';

const TEST_API_KEY = 'test-api-key';
const createClient = (): MapleStoryMClient => {
  const http = new HttpClient({ apiKey: TEST_API_KEY });
  return new MapleStoryMClient(http);
};

const TEST_OCID = mOcidFixture.ocid as OCID;
const TEST_GUILD_ID = mGuildIdFixture.oguild_id as GuildId;

describe('MapleStoryMClient', () => {
  describe('lazy getters', () => {
    it('character getter는 MapleStoryMCharacterClient를 반환한다', () => {
      const client = createClient();
      expect(client.character).toBeInstanceOf(MapleStoryMCharacterClient);
    });

    it('union getter는 MapleStoryMUnionClient를 반환한다', () => {
      const client = createClient();
      expect(client.union).toBeInstanceOf(MapleStoryMUnionClient);
    });

    it('guild getter는 MapleStoryMGuildClient를 반환한다', () => {
      const client = createClient();
      expect(client.guild).toBeInstanceOf(MapleStoryMGuildClient);
    });

    it('ranking getter는 MapleStoryMRankingClient를 반환한다', () => {
      const client = createClient();
      expect(client.ranking).toBeInstanceOf(MapleStoryMRankingClient);
    });

    it('notice getter는 MapleStoryMNoticeClient를 반환한다', () => {
      const client = createClient();
      expect(client.notice).toBeInstanceOf(MapleStoryMNoticeClient);
    });

    it('같은 getter는 같은 인스턴스를 반환한다', () => {
      const client = createClient();
      expect(client.character).toBe(client.character);
      expect(client.union).toBe(client.union);
      expect(client.guild).toBe(client.guild);
      expect(client.ranking).toBe(client.ranking);
      expect(client.notice).toBe(client.notice);
    });
  });

  describe('getOcid', () => {
    it('캐릭터명으로 OCID를 조회한다', async () => {
      const client = createClient();
      const ocid = await client.getOcid('스카니아', '테스트캐릭터M');
      expect(ocid).toBe(mOcidFixture.ocid);
    });
  });

  describe('character', () => {
    it('getBasic — 캐릭터 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.character.getBasic({ ocid: TEST_OCID });

      expect(result.character_name).toBe(mCharacterBasicFixture.character_name);
      expect(result.character_level).toBe(mCharacterBasicFixture.character_level);
      expect(result.world_name).toBe(mCharacterBasicFixture.world_name);
    });
  });

  describe('union', () => {
    it('get — 유니온 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.union.get({ ocid: TEST_OCID });

      expect(result.union_level).toBe(mUnionFixture.union_level);
      expect(result.union_grade).toBe(mUnionFixture.union_grade);
    });
  });

  describe('guild', () => {
    it('getId — 길드 식별자를 반환한다', async () => {
      const client = createClient();
      const guildId = await client.guild.getId('스카니아', '테스트길드M');
      expect(guildId).toBe(mGuildIdFixture.oguild_id);
    });

    it('getBasic — 길드 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.guild.getBasic({ oguild_id: TEST_GUILD_ID });

      expect(result.guild_name).toBe(mGuildBasicFixture.guild_name);
      expect(result.guild_level).toBe(mGuildBasicFixture.guild_level);
      expect(result.guild_member_count).toBe(mGuildBasicFixture.guild_member_count);
    });
  });

  describe('ranking', () => {
    it('getLevel — 레벨 랭킹을 반환한다', async () => {
      const client = createClient();
      const result = await client.ranking.getLevel({ date: '2024-01-01' });

      expect(result.ranking).toHaveLength(1);
      expect(result.ranking[0]?.character_name).toBe('랭커1M');
    });
  });

  describe('notice', () => {
    it('getList — 공지 목록을 반환한다', async () => {
      const client = createClient();
      const result = await client.notice.getList();

      expect(result.notice).toHaveLength(1);
      expect(result.notice[0]?.title).toBe(mNoticeListFixture.notice[0]?.title);
    });

    it('getDetail — 공지 상세를 반환한다', async () => {
      const client = createClient();
      const result = await client.notice.getDetail(1001);

      expect(result.title).toBe(mNoticeDetailFixture.title);
      expect(result.contents).toBe(mNoticeDetailFixture.contents);
    });
  });
});
