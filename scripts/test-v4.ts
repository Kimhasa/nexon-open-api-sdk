/**
 * V4 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_V4_API_KEY, V4_CHARACTER 설정
 *   2. yarn test:v4 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { V4OCID } from '../src/games/v4/types.js';

const apiKey = process.env['NEXON_V4_API_KEY'];
const characterName = process.env['V4_CHARACTER'];
if (!apiKey || !characterName) {
  console.error('❌ .env 파일에 NEXON_V4_API_KEY, V4_CHARACTER 를 설정해주세요.');
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

let ocid: V4OCID | undefined;

await test('getOcid', async () => {
  ocid = await client.v4.getOcid(characterName);
  if (!ocid) throw new Error('ocid가 비어있음');
  console.log(`    ocid: ${ocid}`);
});

// ─── 2. Character ────────────────────────────────────────────────────────────
if (ocid) {
  const target = ocid;
  console.log('\n📋 Character API');

  await test('character.getBasic', async () => {
    const r = await client.v4.character.getBasic({ ocid: target });
    if (!r.character_name) throw new Error('character_name 없음');
    console.log(`    [${r.server_name}] ${r.character_name} Lv.${r.character_level}`);
  });

  await test('character.getHonor', async () => {
    const r = await client.v4.character.getHonor({ ocid: target });
    if (!Array.isArray(r.honor)) throw new Error('honor 가 배열이 아님');
  });

  await test('character.getHonorEquipment', async () => {
    const r = await client.v4.character.getHonorEquipment({ ocid: target });
    if (!Array.isArray(r.honor_equipment)) throw new Error('honor_equipment 가 배열이 아님');
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  V4 E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
