/**
 * 히트2 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_HIT2_API_KEY, HIT2_CHARACTER 설정
 *   2. yarn test:hit2 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { Hit2OCID } from '../src/games/hit2/types.js';

const apiKey = process.env['NEXON_HIT2_API_KEY'];
const characterName = process.env['HIT2_CHARACTER'];
if (!apiKey || !characterName) {
  console.error('❌ .env 파일에 NEXON_HIT2_API_KEY, HIT2_CHARACTER 를 설정해주세요.');
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

let ocid: Hit2OCID | undefined;

await test('getOcid', async () => {
  ocid = await client.hit2.getOcid(characterName);
  if (!ocid) throw new Error('ocid가 비어있음');
  console.log(`    ocid: ${ocid}`);
});

// ─── 2. Character ────────────────────────────────────────────────────────────
if (ocid) {
  const target = ocid;
  console.log('\n📋 Character API');

  await test('character.getBasic', async () => {
    const r = await client.hit2.character.getBasic({ ocid: target });
    if (!r.character_name) throw new Error('character_name 없음');
    console.log(`    [${r.server_name}] ${r.character_name} Lv.${r.character_level}`);
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  HIT2 E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
