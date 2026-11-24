/**
 * 바람의나라 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_BARAM_API_KEY, BARAM_CHARACTER 설정 (BARAM_SERVER 생략 시 '연')
 *   2. yarn test:baram 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { BaramOCID } from '../src/games/baram/types.js';

const apiKey = process.env['NEXON_BARAM_API_KEY'];
const characterName = process.env['BARAM_CHARACTER'];
const serverName = process.env['BARAM_SERVER'] ?? '연';
if (!apiKey || !characterName) {
  console.error('❌ .env 파일에 NEXON_BARAM_API_KEY, BARAM_CHARACTER 를 설정해주세요.');
  process.exit(1);
}

const client = new NexonClient({ apiKey, responseValidation: true, debug: true });

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>): Promise<void> {
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

let ocid: BaramOCID | undefined;

await test('getOcid', async () => {
  ocid = await client.baram.getOcid(characterName, serverName);
  if (!ocid) throw new Error('ocid가 비어있음');
  console.log(`    ocid: ${ocid}`);
});

// ─── 2. Character ────────────────────────────────────────────────────────────
if (ocid) {
  const target = ocid;
  console.log('\n📋 Character API');

  await test('character.getBasic', async () => {
    const r = await client.baram.character.getBasic({ ocid: target });
    if (!r.character_name) throw new Error('character_name 없음');
    console.log(`    ${r.character_name} Lv.${r.character_level} (${r.character_class_name})`);
  });

  await test('character.getTitle', async () => {
    const r = await client.baram.character.getTitle({ ocid: target });
    if (!Array.isArray(r.title)) throw new Error('title 이 배열이 아님');
  });

  await test('character.getTitleEquipment', async () => {
    const r = await client.baram.character.getTitleEquipment({ ocid: target });
    if (!Array.isArray(r.title_equipment)) throw new Error('title_equipment 가 배열이 아님');
  });

  await test('character.getItemEquipment', async () => {
    const r = await client.baram.character.getItemEquipment({ ocid: target });
    if (!Array.isArray(r.item_equipment)) throw new Error('item_equipment 가 배열이 아님');
  });

  await test('character.getStat', async () => {
    const r = await client.baram.character.getStat({ ocid: target });
    if (!Array.isArray(r.stat)) throw new Error('stat 이 배열이 아님');
  });

  await test('character.getGuild', async () => {
    const r = await client.baram.character.getGuild({ ocid: target });
    if (r.guild_name === undefined) throw new Error('guild_name 키 없음');
    console.log(`    guild_name: ${String(r.guild_name)}`);
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  Baram E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
