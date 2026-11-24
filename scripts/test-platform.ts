/**
 * 넥슨 Open API 플랫폼(Open API 공지) 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_PLATFORM_API_KEY 설정 (PLATFORM_GAME_NAME 생략 시 '메이플스토리')
 *   2. yarn test:platform 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';

const apiKey = process.env['NEXON_PLATFORM_API_KEY'];
const gameName = process.env['PLATFORM_GAME_NAME'] ?? '메이플스토리';
if (!apiKey) {
  console.error('❌ .env 파일에 NEXON_PLATFORM_API_KEY 를 설정해주세요.');
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

// ─── Notice ──────────────────────────────────────────────────────────────────
console.log('\n📋 Notice API');

await test('getNoticeList', async () => {
  const r = await client.platform.getNoticeList();
  if (!Array.isArray(r.notice)) throw new Error('notice 가 배열이 아님');
  console.log(`    ${r.notice.length}건, 첫 공지: ${r.notice[0]?.title ?? '(없음)'}`);
});

await test(`getNoticeList({ game_name: '${gameName}' })`, async () => {
  const r = await client.platform.getNoticeList({ game_name: gameName });
  if (!Array.isArray(r.notice)) throw new Error('notice 가 배열이 아님');
  const other = r.notice.find((n) => n.game_name !== gameName);
  if (other) throw new Error(`다른 게임 공지가 섞여 있음: ${other.game_name}`);
});

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  Platform E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
