import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { HttpRequestInfo } from '../../../src/core/http/http-types.js';
import type { ShapeMismatch } from '../../../src/core/validation/response-shape.js';
import { NexonAuthError, NexonClient } from '../../../src/index.js';
import type {
  MapleStoryTWClient,
  TWSkillGrade,
  TWWorldName,
} from '../../../src/games/maplestory-tw/index.js';
import type { GuildId, OCID } from '../../../src/games/_base/maple-base-types.js';
import { twOcidResponseFixture } from '../../fixtures/maplestory-tw/ocid.fixture.js';
import { twCharacterBasicFixture } from '../../fixtures/maplestory-tw/character-basic.fixture.js';
import { twCharacterPopularityFixture } from '../../fixtures/maplestory-tw/character-popularity.fixture.js';
import { twCharacterStatFixture } from '../../fixtures/maplestory-tw/character-stat.fixture.js';
import { twCharacterHyperStatFixture } from '../../fixtures/maplestory-tw/character-hyper-stat.fixture.js';
import { twCharacterPropensityFixture } from '../../fixtures/maplestory-tw/character-propensity.fixture.js';
import { twCharacterAbilityFixture } from '../../fixtures/maplestory-tw/character-ability.fixture.js';
import { twCharacterItemEquipmentFixture } from '../../fixtures/maplestory-tw/character-item-equipment.fixture.js';
import { twCharacterCashItemEquipmentFixture } from '../../fixtures/maplestory-tw/character-cashitem-equipment.fixture.js';
import { twCharacterSymbolEquipmentFixture } from '../../fixtures/maplestory-tw/character-symbol-equipment.fixture.js';
import { twCharacterSetEffectFixture } from '../../fixtures/maplestory-tw/character-set-effect.fixture.js';
import { twCharacterBeautyEquipmentFixture } from '../../fixtures/maplestory-tw/character-beauty-equipment.fixture.js';
import { twCharacterAndroidEquipmentFixture } from '../../fixtures/maplestory-tw/character-android-equipment.fixture.js';
import { twCharacterPetEquipmentFixture } from '../../fixtures/maplestory-tw/character-pet-equipment.fixture.js';
import { twCharacterSkillFixture } from '../../fixtures/maplestory-tw/character-skill.fixture.js';
import { twCharacterLinkSkillFixture } from '../../fixtures/maplestory-tw/character-link-skill.fixture.js';
import { twCharacterVMatrixFixture } from '../../fixtures/maplestory-tw/character-vmatrix.fixture.js';
import { twCharacterHexaMatrixFixture } from '../../fixtures/maplestory-tw/character-hexamatrix.fixture.js';
import { twCharacterHexaMatrixStatFixture } from '../../fixtures/maplestory-tw/character-hexamatrix-stat.fixture.js';
import { twCharacterDojangFixture } from '../../fixtures/maplestory-tw/character-dojang.fixture.js';
import { twCharacterFamiliarFixture } from '../../fixtures/maplestory-tw/character-familiar.fixture.js';
import { twUnionFixture } from '../../fixtures/maplestory-tw/user-union.fixture.js';
import { twUnionRaiderFixture } from '../../fixtures/maplestory-tw/user-union-raider.fixture.js';
import { twUnionArtifactFixture } from '../../fixtures/maplestory-tw/user-union-artifact.fixture.js';
import { twUnionChampionFixture } from '../../fixtures/maplestory-tw/user-union-champion.fixture.js';
import { twGuildIdResponseFixture } from '../../fixtures/maplestory-tw/guild-id.fixture.js';
import { twGuildBasicFixture } from '../../fixtures/maplestory-tw/guild-basic.fixture.js';
import { server } from '../../mocks/server.js';

const BASE = 'https://open.api.nexon.com/maplestorytw/v1';
const TEST_OCID = twOcidResponseFixture.ocid;
const TEST_GUILD_ID = twGuildIdResponseFixture.oguild_id;
const SNAPSHOT_DATE = '2025-12-18';

function createClient(): {
  client: MapleStoryTWClient;
  onRequest: Mock<(info: HttpRequestInfo) => void>;
  onResponseShapeMismatch: Mock<(mismatch: ShapeMismatch) => void>;
} {
  const onRequest = vi.fn<(info: HttpRequestInfo) => void>();
  const onResponseShapeMismatch = vi.fn<(mismatch: ShapeMismatch) => void>();
  const client = new NexonClient({
    apiKey: 'test-api-key',
    responseValidation: true,
    logger: { onRequest, onResponseShapeMismatch },
  }).maplestoryTW;
  return { client, onRequest, onResponseShapeMismatch };
}

const snapshotCases = [
  {
    endpoint: 'character/basic',
    call: (client: MapleStoryTWClient) =>
      client.character.getBasic({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterBasicFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/popularity',
    call: (client: MapleStoryTWClient) =>
      client.character.getPopularity({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterPopularityFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/stat',
    call: (client: MapleStoryTWClient) =>
      client.character.getStat({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterStatFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/hyper-stat',
    call: (client: MapleStoryTWClient) =>
      client.character.getHyperStat({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterHyperStatFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/propensity',
    call: (client: MapleStoryTWClient) =>
      client.character.getPropensity({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterPropensityFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/ability',
    call: (client: MapleStoryTWClient) =>
      client.character.getAbility({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterAbilityFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/item-equipment',
    call: (client: MapleStoryTWClient) =>
      client.character.getItemEquipment({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterItemEquipmentFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/cashitem-equipment',
    call: (client: MapleStoryTWClient) =>
      client.character.getCashItemEquipment({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterCashItemEquipmentFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/symbol-equipment',
    call: (client: MapleStoryTWClient) =>
      client.character.getSymbolEquipment({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterSymbolEquipmentFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/set-effect',
    call: (client: MapleStoryTWClient) =>
      client.character.getSetEffect({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterSetEffectFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/beauty-equipment',
    call: (client: MapleStoryTWClient) =>
      client.character.getBeautyEquipment({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterBeautyEquipmentFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/android-equipment',
    call: (client: MapleStoryTWClient) =>
      client.character.getAndroidEquipment({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterAndroidEquipmentFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/pet-equipment',
    call: (client: MapleStoryTWClient) =>
      client.character.getPetEquipment({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterPetEquipmentFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/skill',
    call: (client: MapleStoryTWClient) =>
      client.character.getSkill({
        ocid: TEST_OCID,
        date: SNAPSHOT_DATE,
        character_skill_grade: '2.5',
      }),
    response: twCharacterSkillFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE, character_skill_grade: '2.5' },
  },
  {
    endpoint: 'character/link-skill',
    call: (client: MapleStoryTWClient) =>
      client.character.getLinkSkill({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterLinkSkillFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/vmatrix',
    call: (client: MapleStoryTWClient) =>
      client.character.getVMatrix({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterVMatrixFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/hexamatrix',
    call: (client: MapleStoryTWClient) =>
      client.character.getHexaMatrix({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterHexaMatrixFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/hexamatrix-stat',
    call: (client: MapleStoryTWClient) =>
      client.character.getHexaMatrixStat({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterHexaMatrixStatFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/dojang',
    call: (client: MapleStoryTWClient) =>
      client.character.getDojang({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterDojangFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'character/familiar',
    call: (client: MapleStoryTWClient) =>
      client.character.getFamiliar({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twCharacterFamiliarFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'user/union',
    call: (client: MapleStoryTWClient) =>
      client.union.getUnion({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twUnionFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'user/union-raider',
    call: (client: MapleStoryTWClient) =>
      client.union.getRaider({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twUnionRaiderFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'user/union-artifact',
    call: (client: MapleStoryTWClient) =>
      client.union.getArtifact({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twUnionArtifactFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'user/union-champion',
    call: (client: MapleStoryTWClient) =>
      client.union.getChampion({ ocid: TEST_OCID, date: SNAPSHOT_DATE }),
    response: twUnionChampionFixture,
    query: { ocid: TEST_OCID, date: SNAPSHOT_DATE },
  },
  {
    endpoint: 'guild/basic',
    call: (client: MapleStoryTWClient) =>
      client.guild.getBasic({ oguild_id: TEST_GUILD_ID, date: SNAPSHOT_DATE }),
    response: twGuildBasicFixture,
    query: { oguild_id: TEST_GUILD_ID, date: SNAPSHOT_DATE },
  },
];

describe('MapleStoryTWClient', () => {
  it('reuses each sub-client', () => {
    const { client } = createClient();
    expect(client.character).toBe(client.character);
    expect(client.union).toBe(client.union);
    expect(client.guild).toBe(client.guild);
  });

  it('looks up an OCID by character name', async () => {
    const { client, onRequest, onResponseShapeMismatch } = createClient();
    await expect(client.getOcid('測試 角色')).resolves.toBe(TEST_OCID);
    expect(onRequest).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ method: 'GET', params: { character_name: '測試 角色' } }),
    );
    expect(onResponseShapeMismatch).not.toHaveBeenCalled();
  });

  it('looks up a guild ID by guild and Taiwan world name', async () => {
    const { client, onRequest, onResponseShapeMismatch } = createClient();
    await expect(client.guild.getId('測試公會', '艾麗亞')).resolves.toBe(TEST_GUILD_ID);
    expect(onRequest).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        method: 'GET',
        params: { guild_name: '測試公會', world_name: '艾麗亞' },
      }),
    );
    expect(onResponseShapeMismatch).not.toHaveBeenCalled();
  });

  it.each(snapshotCases)(
    'GET /$endpoint matches the portal contract',
    async ({ endpoint, call, response, query }) => {
      const { client, onRequest, onResponseShapeMismatch } = createClient();
      await expect(call(client)).resolves.toEqual(response);
      const search = new URLSearchParams(Object.entries(query));
      expect(onRequest).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          method: 'GET',
          url: `${BASE}/${endpoint}?${search}`,
          params: query,
        }),
      );
      expect(onResponseShapeMismatch).not.toHaveBeenCalled();
    },
  );

  it('leaves the date query unset when omitted', async () => {
    const { client, onRequest } = createClient();
    await client.character.getBasic({ ocid: TEST_OCID });
    expect(onRequest).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: { ocid: TEST_OCID } }),
    );
  });

  it('formats timestamps at the Taiwan day boundary', async () => {
    const { client, onRequest } = createClient();
    await client.character.getBasic({ ocid: TEST_OCID, date: new Date('2025-10-14T16:00:00Z') });
    expect(onRequest).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ params: { ocid: TEST_OCID, date: '2025-10-15' } }),
    );
  });

  it('resolves today in Taiwan time', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-12-18T16:00:00Z'));
    try {
      const { client, onRequest } = createClient();
      await client.union.getChampion({ ocid: TEST_OCID, date: 'today' });
      expect(onRequest).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ params: { ocid: TEST_OCID, date: '2025-12-19' } }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('accepts October 14 for Union and rejects it for character and guild snapshots', async () => {
    const { client, onRequest } = createClient();
    const date = '2025-10-14';
    await expect(client.union.getUnion({ ocid: TEST_OCID, date })).resolves.toEqual(twUnionFixture);
    await expect(client.character.getBasic({ ocid: TEST_OCID, date })).rejects.toThrow(
      /2025-10-15/,
    );
    await expect(client.guild.getBasic({ oguild_id: TEST_GUILD_ID, date })).rejects.toThrow(
      /2025-10-15/,
    );
    expect(onRequest).toHaveBeenCalledTimes(1);
  });

  it('rejects a date before Union Champion data starts', async () => {
    const { client, onRequest } = createClient();
    await expect(client.union.getChampion({ ocid: TEST_OCID, date: '2025-12-17' })).rejects.toThrow(
      /2025-12-18/,
    );
    expect(onRequest).not.toHaveBeenCalled();
  });

  it.each(['', 'invalid', '2026-02-30', '2026-02-30T00:00:00Z', new Date(NaN), '9999-01-01'])(
    'rejects invalid or future date %s before making a request',
    async (date) => {
      const { client, onRequest } = createClient();
      await expect(client.character.getBasic({ ocid: TEST_OCID, date })).rejects.toThrow(
        RangeError,
      );
      expect(onRequest).not.toHaveBeenCalled();
    },
  );

  it('rejects blank identifiers and lookup names before making a request', async () => {
    const { client, onRequest } = createClient();
    await expect(client.getOcid(' ')).rejects.toThrow(/characterName must be a non-empty string/);
    await expect(client.character.getBasic({ ocid: '' as OCID })).rejects.toThrow('getOcid()');
    await expect(client.union.getUnion({ ocid: ' ' as OCID })).rejects.toThrow('getOcid()');
    await expect(client.guild.getId('', '艾麗亞')).rejects.toThrow(
      /guildName must be a non-empty string/,
    );
    await expect(client.guild.getBasic({ oguild_id: '' as GuildId })).rejects.toThrow(
      'guild.getId()',
    );
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('rejects a world or skill grade outside the portal enums', async () => {
    const { client, onRequest } = createClient();
    await expect(client.guild.getId('FixtureGuild', 'Aquila' as TWWorldName)).rejects.toThrow(
      /worldName must be one of/,
    );
    await expect(
      client.character.getSkill({ ocid: TEST_OCID, character_skill_grade: '7' as TWSkillGrade }),
    ).rejects.toThrow(/character_skill_grade must be one of/);
    expect(onRequest).not.toHaveBeenCalled();
  });

  it('classifies a 403 response as NexonAuthError', async () => {
    server.use(
      http.get(`${BASE}/id`, () =>
        HttpResponse.json(
          { error: { name: 'OPENAPI00002', message: 'Invalid API key' } },
          { status: 403 },
        ),
      ),
    );
    const { client } = createClient();
    await expect(client.getOcid('FixtureCharacter')).rejects.toBeInstanceOf(NexonAuthError);
  });

  it('reports an unexpected response shape and returns the result', async () => {
    server.use(
      http.get(`${BASE}/character/popularity`, () => HttpResponse.json({ date: SNAPSHOT_DATE })),
    );
    const { client, onResponseShapeMismatch } = createClient();
    await expect(client.character.getPopularity({ ocid: TEST_OCID })).resolves.toEqual({
      date: SNAPSHOT_DATE,
    });
    expect(onResponseShapeMismatch).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ missingKeys: ['popularity'] }),
    );
  });
});
