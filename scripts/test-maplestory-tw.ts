/**
 * Smoke-test MapleStory Taiwan against Nexon Open API.
 *
 * Set NEXON_MAPLESTORY_TW_API_KEY and MAPLESTORY_TW_CHARACTER in .env.
 * Set MAPLESTORY_TW_GUILD to include guild checks and MAPLESTORY_TW_WORLD
 * to select a world (defaults to 艾麗亞).
 * Run with `yarn tsx scripts/test-maplestory-tw.ts`.
 */
import 'dotenv/config';
import { ok } from 'node:assert/strict';
import { TW_WORLD_NAMES } from '../src/games/maplestory-tw/guild/types.js';
import { NexonClient } from '../src/index.js';

const apiKey = process.env['NEXON_MAPLESTORY_TW_API_KEY'];
const characterName = process.env['MAPLESTORY_TW_CHARACTER'];
const guildName = process.env['MAPLESTORY_TW_GUILD'];
const requestedWorld = process.env['MAPLESTORY_TW_WORLD'] ?? '艾麗亞';
const worldName = TW_WORLD_NAMES.find((world) => world === requestedWorld);

if (!apiKey || !characterName) {
  console.error('Set NEXON_MAPLESTORY_TW_API_KEY and MAPLESTORY_TW_CHARACTER in .env.');
  process.exit(1);
}
if (guildName && !worldName) {
  console.error(`MAPLESTORY_TW_WORLD must be one of ${TW_WORLD_NAMES.join(', ')}.`);
  process.exit(1);
}

const tw = new NexonClient({ apiKey }).maplestoryTW;
let passed = 0;
let failed = 0;

async function test<T>(name: string, run: () => Promise<T>): Promise<T | undefined> {
  try {
    const result = await run();
    passed++;
    console.log(`PASS ${name}`);
    return result;
  } catch (error) {
    failed++;
    console.error(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

async function check(name: string, run: () => Promise<object>, field: string): Promise<void> {
  await test(name, async () => {
    const result = await run();
    ok(Object.hasOwn(result, field), `Expected response property "${field}".`);
  });
}

const ocid = await test('getOcid', async () => {
  const id = await tw.getOcid(characterName);
  ok(id, 'Expected a character identifier.');
  return id;
});

if (ocid) {
  const { character, union } = tw;
  await check('character.getBasic', () => character.getBasic({ ocid }), 'character_name');
  await check('character.getPopularity', () => character.getPopularity({ ocid }), 'popularity');
  await check('character.getStat', () => character.getStat({ ocid }), 'final_stat');
  await check(
    'character.getHyperStat',
    () => character.getHyperStat({ ocid }),
    'hyper_stat_preset_1',
  );
  await check('character.getPropensity', () => character.getPropensity({ ocid }), 'charisma_level');
  await check('character.getAbility', () => character.getAbility({ ocid }), 'ability_info');
  await check(
    'character.getItemEquipment',
    () => character.getItemEquipment({ ocid }),
    'item_equipment',
  );
  await check(
    'character.getCashItemEquipment',
    () => character.getCashItemEquipment({ ocid }),
    'cash_item_equipment_base',
  );
  await check(
    'character.getSymbolEquipment',
    () => character.getSymbolEquipment({ ocid }),
    'symbol',
  );
  await check('character.getSetEffect', () => character.getSetEffect({ ocid }), 'set_effect');
  await check(
    'character.getBeautyEquipment',
    () => character.getBeautyEquipment({ ocid }),
    'character_hair',
  );
  await check(
    'character.getAndroidEquipment',
    () => character.getAndroidEquipment({ ocid }),
    'android_name',
  );
  await check(
    'character.getPetEquipment',
    () => character.getPetEquipment({ ocid }),
    'pet_1_potential',
  );
  await check(
    'character.getSkill',
    () => character.getSkill({ ocid, character_skill_grade: '5' }),
    'character_skill',
  );
  await check(
    'character.getLinkSkill',
    () => character.getLinkSkill({ ocid }),
    'character_link_skill',
  );
  await check(
    'character.getVMatrix',
    () => character.getVMatrix({ ocid }),
    'character_v_core_equipment',
  );
  await check(
    'character.getHexaMatrix',
    () => character.getHexaMatrix({ ocid }),
    'character_hexa_core_equipment',
  );
  await check(
    'character.getHexaMatrixStat',
    () => character.getHexaMatrixStat({ ocid }),
    'character_hexa_stat_core',
  );
  await check('character.getDojang', () => character.getDojang({ ocid }), 'dojang_best_floor');
  await check('character.getFamiliar', () => character.getFamiliar({ ocid }), 'familiar_info');
  await check('union.getUnion', () => union.getUnion({ ocid }), 'union_level');
  await check('union.getRaider', () => union.getRaider({ ocid }), 'union_block');
  await check('union.getArtifact', () => union.getArtifact({ ocid }), 'union_artifact_effect');
  await check('union.getChampion', () => union.getChampion({ ocid }), 'union_champion');
}

if (guildName && worldName) {
  const guildId = await test('guild.getId', async () => {
    const id = await tw.guild.getId(guildName, worldName);
    ok(id, 'Expected a guild identifier.');
    return id;
  });
  if (guildId) {
    await check('guild.getBasic', () => tw.guild.getBasic({ oguild_id: guildId }), 'guild_name');
  }
} else {
  console.log('SKIP guild checks. Set MAPLESTORY_TW_GUILD to include them.');
}

console.log(`MapleStory Taiwan E2E: ${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
