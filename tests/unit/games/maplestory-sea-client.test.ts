import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { _resetDeprecationWarnings } from '../../../src/core/deprecation/deprecation.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { server } from '../../mocks/server.js';
import {
  seaCharacterPopularityFixture,
  seaCharacterStatFixture,
  seaCharacterHyperStatFixture,
  seaCharacterPropensityFixture,
  seaCharacterAbilityFixture,
  seaCharacterItemEquipmentFixture,
  seaCharacterCashItemEquipmentFixture,
  seaCharacterSymbolEquipmentFixture,
  seaCharacterSetEffectFixture,
  seaCharacterBeautyEquipmentFixture,
  seaCharacterAndroidEquipmentFixture,
  seaCharacterPetEquipmentFixture,
  seaCharacterSkillFixture,
  seaCharacterLinkSkillFixture,
  seaCharacterVMatrixFixture,
  seaCharacterHexaMatrixFixture,
  seaCharacterHexaMatrixStatFixture,
  seaCharacterDojangFixture,
} from '../../fixtures/maplestory-sea/character.fixture.js';
import {
  seaUnionRaiderFixture,
  seaUnionArtifactFixture,
  seaUnionChampionFixture,
} from '../../fixtures/maplestory-sea/union-detail.fixture.js';
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
const query = { ocid: TEST_OCID, date: '2025-04-21' };

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
      const ocid = await client.getOcid(seaCharacterBasicFixture.character_name);
      expect(ocid).toBe(seaOcidFixture.ocid);
    });
  });

  describe('character', () => {
    it.each([
      { name: 'getPopularity', fixture: seaCharacterPopularityFixture },
      { name: 'getStat', fixture: seaCharacterStatFixture },
      { name: 'getHyperStat', fixture: seaCharacterHyperStatFixture },
      { name: 'getPropensity', fixture: seaCharacterPropensityFixture },
      { name: 'getAbility', fixture: seaCharacterAbilityFixture },
      { name: 'getItemEquipment', fixture: seaCharacterItemEquipmentFixture },
      { name: 'getCashItemEquipment', fixture: seaCharacterCashItemEquipmentFixture },
      { name: 'getSymbolEquipment', fixture: seaCharacterSymbolEquipmentFixture },
      { name: 'getSetEffect', fixture: seaCharacterSetEffectFixture },
      { name: 'getBeautyEquipment', fixture: seaCharacterBeautyEquipmentFixture },
      { name: 'getAndroidEquipment', fixture: seaCharacterAndroidEquipmentFixture },
      { name: 'getPetEquipment', fixture: seaCharacterPetEquipmentFixture },
      { name: 'getSkill', fixture: seaCharacterSkillFixture },
      { name: 'getLinkSkill', fixture: seaCharacterLinkSkillFixture },
      { name: 'getVMatrix', fixture: seaCharacterVMatrixFixture },
      { name: 'getHexaMatrix', fixture: seaCharacterHexaMatrixFixture },
      { name: 'getHexaMatrixStat', fixture: seaCharacterHexaMatrixStatFixture },
      { name: 'getDojang', fixture: seaCharacterDojangFixture },
    ] as const)('$name returns the response without shape warnings', async ({ name, fixture }) => {
      const onResponseShapeMismatch = vi.fn();
      const client = new MapleStorySEAClient(
        new HttpClient({
          apiKey: TEST_API_KEY,
          responseValidation: true,
          logger: { onResponseShapeMismatch },
        }),
      );
      const result =
        name === 'getSkill'
          ? await client.character.getSkill({ ...query, character_skill_grade: '6' })
          : await client.character[name](query);
      expect(result).toEqual(fixture);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('accepts a null date for the latest character data', async () => {
      const onResponseShapeMismatch = vi.fn();
      const client = new MapleStorySEAClient(
        new HttpClient({
          apiKey: TEST_API_KEY,
          responseValidation: true,
          logger: { onResponseShapeMismatch },
        }),
      );
      const response = { ...seaCharacterBasicFixture, date: null };
      server.use(
        http.get('https://open.api.nexon.com/maplestorysea/v1/character/basic', () =>
          HttpResponse.json(response),
        ),
      );

      await expect(client.character.getBasic({ ocid: TEST_OCID })).resolves.toEqual(response);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('accepts a null HEXA core list before the character unlocks HEXA', async () => {
      const onResponseShapeMismatch = vi.fn();
      const client = new MapleStorySEAClient(
        new HttpClient({
          apiKey: TEST_API_KEY,
          responseValidation: true,
          logger: { onResponseShapeMismatch },
        }),
      );
      const response: typeof seaCharacterHexaMatrixFixture = {
        date: null,
        character_hexa_core_equipment: null,
      };
      server.use(
        http.get('https://open.api.nexon.com/maplestorysea/v1/character/hexamatrix', () =>
          HttpResponse.json(response),
        ),
      );

      await expect(client.character.getHexaMatrix({ ocid: TEST_OCID })).resolves.toEqual(response);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

    it('getBasic — 캐릭터 기본 정보를 반환한다', async () => {
      const client = createClient();
      const result = await client.character.getBasic({ ocid: TEST_OCID });

      expect(result.character_name).toBe(seaCharacterBasicFixture.character_name);
      expect(result.character_level).toBe(seaCharacterBasicFixture.character_level);
      expect(result.world_name).toBe(seaCharacterBasicFixture.world_name);
    });
  });

  describe('union', () => {
    it.each([
      { name: 'getRaider', fixture: seaUnionRaiderFixture },
      { name: 'getArtifact', fixture: seaUnionArtifactFixture },
      { name: 'getChampion', fixture: seaUnionChampionFixture },
    ] as const)('$name returns the response without shape warnings', async ({ name, fixture }) => {
      const onResponseShapeMismatch = vi.fn();
      const client = new MapleStorySEAClient(
        new HttpClient({
          apiKey: TEST_API_KEY,
          responseValidation: true,
          logger: { onResponseShapeMismatch },
        }),
      );
      const result = await client.union[name](query);
      expect(result).toEqual(fixture);
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });

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

    it('getBasic — 최신 길드 정보의 기준일은 null이다', async () => {
      const onResponseShapeMismatch = vi.fn();
      const client = new MapleStorySEAClient(
        new HttpClient({
          apiKey: TEST_API_KEY,
          responseValidation: true,
          logger: { onResponseShapeMismatch },
        }),
      );
      const result = await client.guild.getBasic({ oguild_id: TEST_GUILD_ID });

      expect(result.guild_name).toBe(seaGuildBasicFixture.guild_name);
      expect(result.guild_level).toBe(seaGuildBasicFixture.guild_level);
      expect(result.guild_member_count).toBe(seaGuildBasicFixture.guild_member_count);
      expect(result.date).toBeNull();
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    });
  });

  it('reports a missing SEA response field through responseValidation', async () => {
    const onResponseShapeMismatch = vi.fn();
    const client = new MapleStorySEAClient(
      new HttpClient({
        apiKey: TEST_API_KEY,
        responseValidation: true,
        logger: { onResponseShapeMismatch },
      }),
    );
    server.use(
      http.get('https://open.api.nexon.com/maplestorysea/v1/character/popularity', () =>
        HttpResponse.json({ date: seaCharacterPopularityFixture.date }),
      ),
    );
    await expect(client.character.getPopularity(query)).resolves.toEqual({
      date: seaCharacterPopularityFixture.date,
    });
    expect(onResponseShapeMismatch).toHaveBeenCalledWith(
      expect.objectContaining({ missingKeys: ['popularity'] }),
    );
  });

  it('accepts stat responses from before mentorship was added', async () => {
    const { date, character_class, final_stat, remain_ap } = seaCharacterStatFixture;
    const response = { date, character_class, final_stat, remain_ap };
    server.use(
      http.get('https://open.api.nexon.com/maplestorysea/v1/character/stat', () =>
        HttpResponse.json(response),
      ),
    );
    const onResponseShapeMismatch = vi.fn();
    const client = new MapleStorySEAClient(
      new HttpClient({
        apiKey: TEST_API_KEY,
        responseValidation: true,
        logger: { onResponseShapeMismatch },
      }),
    );
    await expect(client.character.getStat(query)).resolves.toEqual(response);
    expect(onResponseShapeMismatch).not.toHaveBeenCalled();
  });

  it('preserves legacy cash equipment skills and warns once', async () => {
    _resetDeprecationWarnings();
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const response = {
      ...seaCharacterCashItemEquipmentFixture,
      cash_item_equipment_base: seaCharacterCashItemEquipmentFixture.cash_item_equipment_base.map(
        (item) => ({ ...item, skills: ['Example Skill'] }),
      ),
    };
    server.use(
      http.get('https://open.api.nexon.com/maplestorysea/v1/character/cashitem-equipment', () =>
        HttpResponse.json(response),
      ),
    );
    try {
      const client = createClient();
      await expect(client.character.getCashItemEquipment(query)).resolves.toEqual(response);
      await expect(client.character.getCashItemEquipment(query)).resolves.toEqual(response);
      expect(warning).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('skill_info'));
    } finally {
      warning.mockRestore();
    }
  });

  it('rejects a blank identifier before making a request', async () => {
    const onRequest = vi.fn();
    const client = new MapleStorySEAClient(
      new HttpClient({ apiKey: TEST_API_KEY, logger: { onRequest } }),
    );
    await expect(client.character.getBasic({ ocid: ' ' as OCID })).rejects.toBeInstanceOf(
      NexonBadRequestError,
    );
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('maps HTTP 403 to NexonAuthError', async () => {
    server.use(
      http.get('https://open.api.nexon.com/maplestorysea/v1/id', () =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00002', message: 'Invalid API key' } },
          { status: 403 },
        ),
      ),
    );
    await expect(createClient().getOcid('ExampleCharacter')).rejects.toBeInstanceOf(NexonAuthError);
  });
});
