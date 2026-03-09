/**
 * EA SPORTS FC Online 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_FC_ONLINE_API_KEY 값 입력
 *   2. yarn test:fconline 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { OUID } from '../src/games/fc-online/user/types.js';

const apiKey = process.env['NEXON_FC_ONLINE_API_KEY'];
if (!apiKey) {
  console.error('❌ .env 파일에 NEXON_FC_ONLINE_API_KEY 를 설정해주세요.');
  process.exit(1);
}

const nickname = process.env['FC_ONLINE_NICKNAME'];
if (!nickname) {
  console.error('❌ .env 파일에 FC_ONLINE_NICKNAME 를 설정해주세요. (테스트할 닉네임)');
  console.error('   예: FC_ONLINE_NICKNAME=내닉네임');
  process.exit(1);
}

const client = new NexonClient({ apiKey, debug: true });

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

// ─── 1. User ──────────────────────────────────────────────────────────────────
console.log('\n📋 User API');

let ouid: OUID | undefined;

await test('getOuid', async () => {
  const result = await client.fcOnline.getOuid(nickname);
  ouid = result;
  if (!ouid) throw new Error('ouid가 비어있음');
});

if (ouid) {
  await test('getBasic', async () => {
    const r = await client.fcOnline.getBasic(ouid!);
    if (!r.nickname) throw new Error('nickname 없음');
  });

  await test('getMaxDivision', async () => {
    await client.fcOnline.getMaxDivision(ouid!);
  });

  await test('getMatchList', async () => {
    const r = await client.fcOnline.getMatchList({
      ouid: ouid!,
      matchtype: 50,
      limit: 5,
    });
    if (!Array.isArray(r)) throw new Error('matchList가 배열이 아님');
  });
}

await test('getTradeList', async () => {
  const r = await client.fcOnline.getTradeList({ tradetype: 'buy', limit: 5 });
  if (!Array.isArray(r)) throw new Error('tradeList가 배열이 아님');
});

// ─── 2. Match ─────────────────────────────────────────────────────────────────
console.log('\n📋 Match API');

await test('getAllMatchList', async () => {
  const r = await client.fcOnline.getAllMatchList({ matchtype: 50, limit: 5 });
  if (!Array.isArray(r)) throw new Error('allMatchList가 배열이 아님');
});

// matchDetail은 실제 matchId가 필요 — 위에서 가져온 목록 사용
if (ouid) {
  await test('getMatchDetail', async () => {
    const matchIds = await client.fcOnline.getMatchList({
      ouid: ouid!,
      matchtype: 50,
      limit: 1,
    });
    if (matchIds.length === 0) throw new Error('매치가 없어서 스킵');
    const detail = await client.fcOnline.getMatchDetail(matchIds[0]!);
    if (!detail.matchType) throw new Error('matchType 없음');
  });
}

// ─── 3. Metadata ──────────────────────────────────────────────────────────────
console.log('\n📋 Metadata API');

await test('getMatchTypeMeta', async () => {
  const r = await client.fcOnline.getMatchTypeMeta();
  if (!Array.isArray(r) || r.length === 0) throw new Error('matchTypeMeta가 비어있음');
});

await test('getSpidMeta', async () => {
  const r = await client.fcOnline.getSpidMeta();
  if (!Array.isArray(r) || r.length === 0) throw new Error('spidMeta가 비어있음');
});

await test('getSeasonIdMeta', async () => {
  const r = await client.fcOnline.getSeasonIdMeta();
  if (!Array.isArray(r) || r.length === 0) throw new Error('seasonIdMeta가 비어있음');
});

await test('getSpPositionMeta', async () => {
  const r = await client.fcOnline.getSpPositionMeta();
  if (!Array.isArray(r) || r.length === 0) throw new Error('spPositionMeta가 비어있음');
});

await test('getDivisionMeta', async () => {
  const r = await client.fcOnline.getDivisionMeta();
  if (!Array.isArray(r) || r.length === 0) throw new Error('divisionMeta가 비어있음');
});

await test('getDivisionVoltaMeta', async () => {
  const r = await client.fcOnline.getDivisionVoltaMeta();
  if (!Array.isArray(r) || r.length === 0) throw new Error('divisionVoltaMeta가 비어있음');
});

// ─── 4. Image URL ─────────────────────────────────────────────────────────────
console.log('\n📋 Image URL (로컬 조립)');

await test('getActionShotUrl', async () => {
  const url = client.fcOnline.getActionShotUrl(272167135);
  if (!url.includes('272167135')) throw new Error('URL에 spid가 포함되지 않음');
});

await test('getPlayerImageUrl', async () => {
  const url = client.fcOnline.getPlayerImageUrl(272167135);
  if (!url.includes('272167135')) throw new Error('URL에 spid가 포함되지 않음');
});

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`결과: ✅ ${passed} passed, ❌ ${failed} failed (총 ${passed + failed}개)`);
process.exit(failed > 0 ? 1 : 0);
