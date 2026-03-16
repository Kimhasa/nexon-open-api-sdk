/**
 * MapleStory SEA 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_MAPLESTORY_SEA_API_KEY, MAPLESTORY_SEA_CHARACTER 설정
 *   2. yarn test:maplestory-sea 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { OCID, GuildId } from '../src/games/_base/maple-base-types.js';

const apiKey = process.env['NEXON_MAPLESTORY_SEA_API_KEY'];
const characterName = process.env['MAPLESTORY_SEA_CHARACTER'];
if (!apiKey || !characterName) {
  console.error(
    '❌ .env 파일에 NEXON_MAPLESTORY_SEA_API_KEY, MAPLESTORY_SEA_CHARACTER 를 설정해주세요.',
  );
  process.exit(1);
}

const client = new NexonClient({ apiKey });

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ❌ ${name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── 1. OCID ─────────────────────────────────────────────────────────────────
console.log('\n📋 OCID');

let ocid: OCID | undefined;

await test('getOcid', async () => {
  const result = await client.maplestorySEA.getOcid(characterName);
  ocid = result;
  if (!ocid) throw new Error('ocid가 비어있음');
  console.log(`    ocid: ${ocid}`);
});

// ─── 2. Character ────────────────────────────────────────────────────────────
if (ocid) {
  console.log('\n📋 Character API');

  await test('character.getBasic', async () => {
    const r = await client.maplestorySEA.character.getBasic({ ocid: ocid! });
    if (!r.character_name) throw new Error('character_name 없음');
    console.log(`    ${r.character_name} Lv.${r.character_level} (${r.character_class})`);
  });

  await test('character.getPopularity', async () => {
    const r = await client.maplestorySEA.character.getPopularity({ ocid: ocid! });
    if (r.popularity === undefined) throw new Error('popularity 없음');
  });

  await test('character.getStat', async () => {
    const r = await client.maplestorySEA.character.getStat({ ocid: ocid! });
    if (!r.final_stat) throw new Error('final_stat 없음');
  });

  await test('character.getHyperStat', async () => {
    const r = await client.maplestorySEA.character.getHyperStat({ ocid: ocid! });
    if (r.use_preset_no === undefined) throw new Error('use_preset_no 없음');
  });

  await test('character.getPropensity', async () => {
    const r = await client.maplestorySEA.character.getPropensity({ ocid: ocid! });
    if (r.charisma_level === undefined) throw new Error('charisma_level 없음');
  });

  await test('character.getAbility', async () => {
    const r = await client.maplestorySEA.character.getAbility({ ocid: ocid! });
    if (!r.ability_info) throw new Error('ability_info 없음');
  });

  await test('character.getItemEquipment', async () => {
    const r = await client.maplestorySEA.character.getItemEquipment({ ocid: ocid! });
    if (!r.item_equipment) throw new Error('item_equipment 없음');
  });

  await test('character.getCashItemEquipment', async () => {
    const r = await client.maplestorySEA.character.getCashItemEquipment({ ocid: ocid! });
    if (r.character_look_mode === undefined) throw new Error('character_look_mode 없음');
  });

  await test('character.getSymbolEquipment', async () => {
    const r = await client.maplestorySEA.character.getSymbolEquipment({ ocid: ocid! });
    if (!r.symbol) throw new Error('symbol 없음');
  });

  await test('character.getSetEffect', async () => {
    const r = await client.maplestorySEA.character.getSetEffect({ ocid: ocid! });
    if (!r.set_effect) throw new Error('set_effect 없음');
  });

  await test('character.getBeautyEquipment', async () => {
    const r = await client.maplestorySEA.character.getBeautyEquipment({ ocid: ocid! });
    if (r.character_hair === undefined) throw new Error('character_hair 없음');
  });

  await test('character.getAndroidEquipment', async () => {
    const r = await client.maplestorySEA.character.getAndroidEquipment({ ocid: ocid! });
    // android_name can be null if no android equipped
    if (r.date === undefined) throw new Error('date 없음');
  });

  await test('character.getPetEquipment', async () => {
    const r = await client.maplestorySEA.character.getPetEquipment({ ocid: ocid! });
    if (r.date === undefined) throw new Error('date 없음');
  });

  await test('character.getSkill (grade: 5)', async () => {
    const r = await client.maplestorySEA.character.getSkill({
      ocid: ocid!,
      character_skill_grade: '5',
    });
    if (!r.character_skill) throw new Error('character_skill 없음');
  });

  await test('character.getLinkSkill', async () => {
    const r = await client.maplestorySEA.character.getLinkSkill({ ocid: ocid! });
    if (!r.character_link_skill) throw new Error('character_link_skill 없음');
  });

  await test('character.getVMatrix', async () => {
    const r = await client.maplestorySEA.character.getVMatrix({ ocid: ocid! });
    if (!r.character_v_core_equipment) throw new Error('character_v_core_equipment 없음');
  });

  await test('character.getHexaMatrix', async () => {
    const r = await client.maplestorySEA.character.getHexaMatrix({ ocid: ocid! });
    if (!r.character_hexa_core_equipment) throw new Error('character_hexa_core_equipment 없음');
  });

  await test('character.getHexaMatrixStat', async () => {
    const r = await client.maplestorySEA.character.getHexaMatrixStat({ ocid: ocid! });
    if (!r.character_hexa_stat_core) throw new Error('character_hexa_stat_core 없음');
  });

  await test('character.getDojang', async () => {
    const r = await client.maplestorySEA.character.getDojang({ ocid: ocid! });
    if (r.date === undefined) throw new Error('date 없음');
  });

  // ─── 3. Union ────────────────────────────────────────────────────────────────
  console.log('\n📋 Union API');

  await test('union.getUnion', async () => {
    const r = await client.maplestorySEA.union.getUnion({ ocid: ocid! });
    if (r.union_level === undefined) throw new Error('union_level 없음');
  });

  await test('union.getRaider', async () => {
    const r = await client.maplestorySEA.union.getRaider({ ocid: ocid! });
    if (r.use_preset_no === undefined) throw new Error('use_preset_no 없음');
  });

  await test('union.getArtifact', async () => {
    const r = await client.maplestorySEA.union.getArtifact({ ocid: ocid! });
    if (r.union_artifact_remain_ap === undefined) throw new Error('union_artifact_remain_ap 없음');
  });

  await test('union.getChampion', async () => {
    const r = await client.maplestorySEA.union.getChampion({ ocid: ocid! });
    if (!r.union_champion) throw new Error('union_champion 없음');
  });
}

// ─── 4. Guild ──────────────────────────────────────────────────────────────────
const guildName = process.env['MAPLESTORY_SEA_GUILD'];
const worldName = process.env['MAPLESTORY_SEA_WORLD'] ?? 'Aquila';

if (guildName) {
  console.log('\n📋 Guild API');

  let guildId: GuildId | undefined;

  await test('guild.getId', async () => {
    guildId = await client.maplestorySEA.guild.getId(guildName, worldName);
    if (!guildId) throw new Error('guildId가 비어있음');
    console.log(`    guildId: ${guildId}`);
  });

  if (guildId) {
    await test('guild.getBasic', async () => {
      const r = await client.maplestorySEA.guild.getBasic({ oguild_id: guildId! });
      if (!r.guild_name) throw new Error('guild_name 없음');
      console.log(`    ${r.guild_name} Lv.${r.guild_level} (${r.guild_member_count} members)`);
    });
  }
} else {
  console.log('\n⏭️  Guild API — MAPLESTORY_SEA_GUILD 미설정, 스킵');
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  MapleStory SEA E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
