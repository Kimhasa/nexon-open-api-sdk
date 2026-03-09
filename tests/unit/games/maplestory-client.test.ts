import { describe, it, expect } from 'vitest';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { MapleStoryClient } from '../../../src/games/maplestory/MapleStoryClient.js';
import { MapleStoryCharacterClient } from '../../../src/games/maplestory/character/MapleStoryCharacterClient.js';
import { MapleStoryUnionClient } from '../../../src/games/maplestory/union/MapleStoryUnionClient.js';
import { MapleStoryGuildClient } from '../../../src/games/maplestory/guild/MapleStoryGuildClient.js';
import { MapleStoryRankingClient } from '../../../src/games/maplestory/ranking/MapleStoryRankingClient.js';
import { MapleStoryHistoryClient } from '../../../src/games/maplestory/history/MapleStoryHistoryClient.js';
import { MapleStoryNoticeClient } from '../../../src/games/maplestory/notice/MapleStoryNoticeClient.js';
import type { OCID } from '../../../src/games/_base/maple-base-types.js';
import type { GuildId } from '../../../src/games/_base/maple-base-types.js';
import { ocidFixture } from '../../fixtures/maplestory/ocid.fixture.js';
import { characterBasicFixture } from '../../fixtures/maplestory/character-basic.fixture.js';
import { unionFixture } from '../../fixtures/maplestory/union.fixture.js';
import { guildIdFixture, guildBasicFixture } from '../../fixtures/maplestory/guild.fixture.js';
import { overallRankingFixture } from '../../fixtures/maplestory/ranking.fixture.js';
import { starforceHistoryFixture } from '../../fixtures/maplestory/history.fixture.js';
import { noticeListFixture, noticeDetailFixture } from '../../fixtures/maplestory/notice.fixture.js';

const TEST_API_KEY = 'test-api-key';
const createMapleStoryClient = () => {
  const http = new HttpClient({ apiKey: TEST_API_KEY });
  return new MapleStoryClient(http);
};

const TEST_OCID = ocidFixture.ocid as OCID;
const TEST_GUILD_ID = guildIdFixture.oguild_id as GuildId;

describe('MapleStoryClient', () => {
  describe('lazy getters', () => {
    it('character getter는 MapleStoryCharacterClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.character).toBeInstanceOf(MapleStoryCharacterClient);
    });

    it('union getter는 MapleStoryUnionClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.union).toBeInstanceOf(MapleStoryUnionClient);
    });

    it('guild getter는 MapleStoryGuildClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.guild).toBeInstanceOf(MapleStoryGuildClient);
    });

    it('ranking getter는 MapleStoryRankingClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.ranking).toBeInstanceOf(MapleStoryRankingClient);
    });

    it('history getter는 MapleStoryHistoryClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.history).toBeInstanceOf(MapleStoryHistoryClient);
    });

    it('notice getter는 MapleStoryNoticeClient를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.notice).toBeInstanceOf(MapleStoryNoticeClient);
    });

    it('같은 getter는 같은 인스턴스를 반환한다', () => {
      const client = createMapleStoryClient();
      expect(client.character).toBe(client.character);
      expect(client.union).toBe(client.union);
      expect(client.guild).toBe(client.guild);
    });
  });

  describe('getOcid', () => {
    it('캐릭터명으로 OCID를 조회한다', async () => {
      const client = createMapleStoryClient();
      const ocid = await client.getOcid('테스트캐릭터');
      expect(ocid).toBe(ocidFixture.ocid);
    });
  });

  describe('character', () => {
    it('getBasic — 캐릭터 기본 정보를 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.character.getBasic({ ocid: TEST_OCID });

      expect(result.character_name).toBe(characterBasicFixture.character_name);
      expect(result.character_level).toBe(characterBasicFixture.character_level);
      expect(result.world_name).toBe(characterBasicFixture.world_name);
    });

    it('getList — 캐릭터 목록을 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.character.getList();
      expect(result).toHaveProperty('account_list');
    });
  });

  describe('union', () => {
    it('getUnion — 유니온 정보를 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.union.getUnion({ ocid: TEST_OCID });

      expect(result.union_level).toBe(unionFixture.union_level);
      expect(result.union_grade).toBe(unionFixture.union_grade);
    });
  });

  describe('guild', () => {
    it('getId — 길드 식별자를 반환한다', async () => {
      const client = createMapleStoryClient();
      const guildId = await client.guild.getId('테스트길드', '스카니아');
      expect(guildId).toBe(guildIdFixture.oguild_id);
    });

    it('getBasic — 길드 기본 정보를 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.guild.getBasic({ oguild_id: TEST_GUILD_ID });

      expect(result.guild_name).toBe(guildBasicFixture.guild_name);
      expect(result.guild_level).toBe(guildBasicFixture.guild_level);
    });
  });

  describe('ranking', () => {
    it('getOverall — 종합 랭킹을 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.ranking.getOverall({ date: '2024-01-01' });

      expect(result.ranking).toHaveLength(1);
      expect(result.ranking[0]?.character_name).toBe('1위캐릭터');
    });
  });

  describe('history', () => {
    it('getStarforce — 스타포스 이력을 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.history.getStarforce({ count: 100, date: '2024-01-01' });

      expect(result.count).toBe(starforceHistoryFixture.count);
      expect(result.starforce_history).toHaveLength(1);
      expect(result.next_cursor).toBe(starforceHistoryFixture.next_cursor);
    });
  });

  describe('notice', () => {
    it('getList — 공지 목록을 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.notice.getList();

      expect(result.notice).toHaveLength(1);
      expect(result.notice[0]?.title).toBe(noticeListFixture.notice[0]?.title);
    });

    it('getDetail — 공지 상세를 반환한다', async () => {
      const client = createMapleStoryClient();
      const result = await client.notice.getDetail(1);

      expect(result.title).toBe(noticeDetailFixture.title);
      expect(result.contents).toBe(noticeDetailFixture.contents);
    });
  });
});
