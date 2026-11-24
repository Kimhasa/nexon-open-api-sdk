/**
 * 카트라이더 러쉬플러스 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_KARTRIDER_API_KEY, KARTRIDER_RACER_NAME 설정
 *   2. yarn test:kartrider 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { KartriderOUID } from '../src/games/kartrider/types.js';

const apiKey = process.env['NEXON_KARTRIDER_API_KEY'];
const racerName = process.env['KARTRIDER_RACER_NAME'];
if (!apiKey || !racerName) {
  console.error('❌ .env 파일에 NEXON_KARTRIDER_API_KEY, KARTRIDER_RACER_NAME 를 설정해주세요.');
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

// ─── 1. OUID ─────────────────────────────────────────────────────────────────
console.log('\n📋 OUID');

let ouid: KartriderOUID | undefined;

await test('getOuidInfo', async () => {
  const r = await client.kartrider.getOuidInfo(racerName);
  if (!Array.isArray(r.ouid_info)) throw new Error('ouid_info 가 배열이 아님');
  ouid = r.ouid_info[0]?.ouid;
  if (!ouid) throw new Error('ouid_info 가 비어있음');
  console.log(
    `    계정 ${r.ouid_info.length}개, racer_level 타입: ${typeof r.ouid_info[0]?.racer_level}`,
  );
});

// ─── 2. User ─────────────────────────────────────────────────────────────────
if (ouid) {
  const target = ouid;
  console.log('\n📋 User API');

  await test('user.getBasic', async () => {
    const r = await client.kartrider.user.getBasic({ ouid: target });
    if (!r.racer_name) throw new Error('racer_name 없음');
    console.log(`    ${r.racer_name} Lv.${r.racer_level}`);
  });

  await test('user.getTitleEquipment', async () => {
    const r = await client.kartrider.user.getTitleEquipment({ ouid: target });
    if (!Array.isArray(r.title_equipment)) throw new Error('title_equipment 가 배열이 아님');
  });
}

// ─── 3. Notice ───────────────────────────────────────────────────────────────
console.log('\n📋 Notice API');

let noticeId: number | undefined;
let seasonNoticeId: number | undefined;
let eventNoticeId: number | undefined;

await test('notice.getList', async () => {
  const r = await client.kartrider.notice.getList();
  if (!Array.isArray(r.notice)) throw new Error('notice 가 배열이 아님');
  noticeId = r.notice[0]?.notice_id;
});

await test('notice.getSeasonList', async () => {
  const r = await client.kartrider.notice.getSeasonList();
  if (!Array.isArray(r.season_notice)) throw new Error('season_notice 가 배열이 아님');
  seasonNoticeId = r.season_notice[0]?.notice_id;
});

await test('notice.getEventList', async () => {
  const r = await client.kartrider.notice.getEventList();
  if (!Array.isArray(r.event_notice)) throw new Error('event_notice 가 배열이 아님');
  eventNoticeId = r.event_notice[0]?.notice_id;
});

if (noticeId !== undefined) {
  const id = noticeId;
  await test('notice.getDetail', async () => {
    const r = await client.kartrider.notice.getDetail(id);
    if (!r.title) throw new Error('title 없음');
  });
}

if (seasonNoticeId !== undefined) {
  const id = seasonNoticeId;
  await test('notice.getSeasonDetail', async () => {
    const r = await client.kartrider.notice.getSeasonDetail(id);
    if (!r.title) throw new Error('title 없음');
  });
}

if (eventNoticeId !== undefined) {
  const id = eventNoticeId;
  await test('notice.getEventDetail', async () => {
    const r = await client.kartrider.notice.getEventDetail(id);
    if (!r.title) throw new Error('title 없음');
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  KartRider Rush+ E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
