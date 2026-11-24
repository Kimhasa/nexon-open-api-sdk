/**
 * 마비노기 실제 API 키로 SDK를 검증합니다.
 * .env에 NEXON_MABINOGI_API_KEY를 설정하고
 * `yarn tsx scripts/test-mabinogi.ts`를 실행하세요.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { NexonClient } from '../src/index.js';

const apiKey = process.env['NEXON_MABINOGI_API_KEY'];
if (!apiKey) {
  console.error('.env에 NEXON_MABINOGI_API_KEY를 설정하세요.');
  process.exit(1);
}

const { mabinogi } = new NexonClient({ apiKey });
const filters = { auction_item_category: '검' } as const;

let passed = 0;
let failed = 0;

async function test(name: string, check: () => Promise<void>): Promise<void> {
  try {
    await check();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failed++;
    console.error(`  ❌ ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await test('npcShop.getList', async () => {
  const result = await mabinogi.npcShop.getList({
    npc_name: '델',
    server_name: '류트',
    channel: 1,
  });
  assert.ok(Array.isArray(result.shop), 'shop 배열 누락');
});
await test('auction.listItems', async () => {
  const result = await mabinogi.auction.listItems(filters);
  assert.ok(Array.isArray(result.auction_item), 'auction_item 배열 누락');
  if (result.next_cursor !== null) {
    assert.equal(
      typeof result.next_cursor,
      'string',
      'next_cursor는 문자열 또는 null이어야 합니다.',
    );
    const next = await mabinogi.auction.listItems({ ...filters, cursor: result.next_cursor });
    assert.ok(Array.isArray(next.auction_item), '다음 페이지의 auction_item 배열 누락');
  }
});
await test('auction.listHistory', async () => {
  const result = await mabinogi.auction.listHistory(filters);
  assert.ok(Array.isArray(result.auction_history), 'auction_history 배열 누락');
});
await test('auction.listByKeyword', async () => {
  const result = await mabinogi.auction.listByKeyword({ keyword: '숏,소드' });
  assert.ok(Array.isArray(result.auction_item), 'auction_item 배열 누락');
});
await test('hornBugleWorld.getHistory', async () => {
  const result = await mabinogi.hornBugleWorld.getHistory('류트');
  assert.ok(Array.isArray(result.horn_bugle_world_history), 'horn_bugle_world_history 배열 누락');
});

console.log(`\n마비노기 E2E: ${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
