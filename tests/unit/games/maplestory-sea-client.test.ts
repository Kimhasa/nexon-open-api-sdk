import { describe, it, expect } from 'vitest';
import { HttpClient } from '../../../src/core/http/HttpClient.js';
import { MapleStorySEAClient } from '../../../src/games/maplestory-sea/MapleStorySEAClient.js';
import { MapleStorySEACharacterClient } from '../../../src/games/maplestory-sea/character/MapleStorySEACharacterClient.js';
import { MapleStorySEAUnionClient } from '../../../src/games/maplestory-sea/union/MapleStorySEAUnionClient.js';
import { MapleStorySEAGuildClient } from '../../../src/games/maplestory-sea/guild/MapleStorySEAGuildClient.js';
import type { OCID } from '../../../src/games/_base/maple-base-types.js';
import type { GuildId } from '../../../src/games/_base/maple-base-types.js';
import { seaOcidFixture } from '../../fixtures/maplestory-sea/ocid.fixture.js';
import { seaCharacterBasicFixture } from '../../fixtures/maplestory-sea/character-basic.fixture.js';
import { seaUnionFixture } from '../../fixtures/maplestory-sea/union.fixture.js';
import {
  seaGuildIdFixture,
  seaGuildBasicFixture,
} from '../../fixtures/maplestory-sea/guild.fixture.js';

const TEST_API_KEY = 'test-api-key';
const createClient = (): MapleStorySEAClient => {
  const http = new HttpClient({ apiKey: TEST_API_KEY });
  return new MapleStorySEAClient(http);
};

const TEST_OCID = seaOcidFixture.ocid as OCID;
const TEST_GUILD_ID = seaGuildIdFixture.oguild_id as GuildId;

describe('MapleStorySEAClient', () => {
  describe('lazy getters', () => {
    it('character getter는 MapleStorySEACharacterClient를 반환한다', () => {
      const client = createClient();
      expect(client.character).toBeInstanceOf(MapleStorySEACharacterClient);
    });

    it('union getter는 MapleStorySEAUnionClient를 반환한다', () => {
      const client = createClient();
      expect(client.union).toBeInstanceOf(MapleStorySEAUnionClient);
    });

    it('guild getter는 MapleStorySEAGuildClient를 반환한다', () => {
      const client = createClient();
      expect(client.guild).toBeInstanceOf(MapleStorySEAGuildClient);
    });

    it('같은 getter는 같은 인스턴스를 반환한다', () => {
      const client = createClient();
      expect(client.character).toBe(client.character);
      expect(client.union).toBe(client.union);
      expect(client.guild).toBe(client.guild);
    });
  });

  describe('getOcid', () => {
    it('캐릭터명으로 OCID를 조회한다', async () => {
      const client = createClient();
      const ocid = await client.getOcid('BubbIeLord');
      expect(ocid).toBe(seaOcidFixture.ocid);
    });
  });

  describe('character', () => {
    it('getBasic — 캐릭터 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.character.getBasic({ ocid: TEST_OCID });

      expect(result.character_name).toBe(seaCharacterBasicFixture.character_name);
      expect(result.character_level).toBe(seaCharacterBasicFixture.character_level);
      expect(result.world_name).toBe(seaCharacterBasicFixture.world_name);
    });
  });

  describe('union', () => {
    it('getUnion — 유니온 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.union.getUnion({ ocid: TEST_OCID });

      expect(result.union_level).toBe(seaUnionFixture.union_level);
      expect(result.union_grade).toBe(seaUnionFixture.union_grade);
    });
  });

  describe('guild', () => {
    it('getId — 길드 식별자를 반환한다', async () => {
      const client = createClient();
      const guildId = await client.guild.getId('TestGuild', 'Aquila');
      expect(guildId).toBe(seaGuildIdFixture.oguild_id);
    });

    it('getBasic — 길드 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.guild.getBasic({ oguild_id: TEST_GUILD_ID });

      expect(result.guild_name).toBe(seaGuildBasicFixture.guild_name);
      expect(result.guild_level).toBe(seaGuildBasicFixture.guild_level);
      expect(result.guild_member_count).toBe(seaGuildBasicFixture.guild_member_count);
    });
  });
});
