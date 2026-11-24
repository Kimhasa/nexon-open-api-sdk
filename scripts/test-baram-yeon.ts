/**
 * 바람의나라: 연 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_BARAM_YEON_API_KEY, BARAM_YEON_CHARACTER 설정 (BARAM_YEON_SERVER 생략 시 '연')
 *   2. yarn test:baram-yeon 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { BaramYeonOCID } from '../src/games/baram-yeon/types.js';

const apiKey = process.env['NEXON_BARAM_YEON_API_KEY'];
const characterName = process.env['BARAM_YEON_CHARACTER'];
const serverName = process.env['BARAM_YEON_SERVER'] ?? '연';
if (!apiKey || !characterName) {
  console.error('❌ .env 파일에 NEXON_BARAM_YEON_API_KEY, BARAM_YEON_CHARACTER 를 설정해주세요.');
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

let ocid: BaramYeonOCID | undefined;

await test('getOcid', async () => {
  ocid = await client.baramYeon.getOcid(characterName, serverName);
  if (!ocid) throw new Error('ocid가 비어있음');
  console.log(`    ocid: ${ocid}`);
});

// ─── 2. Character ────────────────────────────────────────────────────────────
if (ocid) {
  const target = ocid;
  console.log('\n📋 Character API');

  await test('character.getBasic', async () => {
    const r = await client.baramYeon.character.getBasic({ ocid: target });
    if (!r.character_name) throw new Error('character_name 없음');
    console.log(`    [${r.server_name}] ${r.character_name} Lv.${r.character_level}`);
  });

  await test('character.getTitle', async () => {
    const r = await client.baramYeon.character.getTitle({ ocid: target });
    if (!Array.isArray(r.title)) throw new Error('title 이 배열이 아님');
  });

  await test('character.getTitleEquipment', async () => {
    const r = await client.baramYeon.character.getTitleEquipment({ ocid: target });
    if (!Array.isArray(r.title_equipment)) throw new Error('title_equipment 가 배열이 아님');
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  Baram: Yeon E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
