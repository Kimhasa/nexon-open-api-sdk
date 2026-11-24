/**
 * 마비노기 영웅전 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_HEROES_API_KEY, HEROES_CHARACTER 설정
 *      (선택) HEROES_MARKET_ITEM — 거래 기록을 조회할 아이템 명 (기본값: 인챈트 스크롤)
 *   2. yarn test:mabinogi-heroes 실행 (= tsx scripts/test-mabinogi-heroes.ts)
 */
import 'dotenv/config';
import { maskIdentifier, NexonClient } from '../src/index.js';
import type { HeroesOCID } from '../src/games/mabinogi-heroes/types.js';

const apiKey = process.env['NEXON_HEROES_API_KEY'];
const characterName = process.env['HEROES_CHARACTER'];
if (!apiKey || !characterName) {
  console.error('❌ .env 파일에 NEXON_HEROES_API_KEY, HEROES_CHARACTER 를 설정해주세요.');
  process.exit(1);
}

// shape 불일치를 경고로 출력해 스펙 기반 타입이 실응답과 맞는지 함께 확인한다
const client = new NexonClient({ apiKey, debug: true, responseValidation: true });
const heroes = client.mabinogiHeroes;

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

let ocid: HeroesOCID | undefined;

await test('getOcid', async () => {
  ocid = await heroes.getOcid(characterName);
  if (!ocid) throw new Error('ocid가 비어있음');
  console.log(`    ocid: ${maskIdentifier(ocid)}`);
});

// ─── 2. Character ────────────────────────────────────────────────────────────
let enchantName: string | undefined;

if (ocid) {
  const params = { ocid };
  console.log('\n📋 Character API');

  await test('character.getBasic', async () => {
    const r = await heroes.character.getBasic(params);
    if (!r.character_name) throw new Error('character_name 없음');
    console.log(`    ${r.character_name} Lv.${r.character_level} (${r.character_class_name})`);
  });

  await test('character.getTitle', async () => {
    const r = await heroes.character.getTitle(params);
    if (!Array.isArray(r.title)) throw new Error('title 없음');
  });

  await test('character.getTitleEquipment', async () => {
    const r = await heroes.character.getTitleEquipment(params);
    if (!Array.isArray(r.title_equipment)) throw new Error('title_equipment 없음');
  });

  await test('character.getItemEquipment', async () => {
    const r = await heroes.character.getItemEquipment(params);
    if (!Array.isArray(r.item_equipment)) throw new Error('item_equipment 없음');
    enchantName =
      r.item_equipment.find((item) => item.item_option?.prefix_enchant_preset_1)?.item_option
        ?.prefix_enchant_preset_1 ?? undefined;
  });

  await test('character.getStat', async () => {
    const r = await heroes.character.getStat(params);
    if (!Array.isArray(r.stat)) throw new Error('stat 없음');
  });

  await test('character.getGuild', async () => {
    const r = await heroes.character.getGuild(params);
    if (r.guild_name === undefined) throw new Error('guild_name 없음');
  });
}

// ─── 3. Meta ─────────────────────────────────────────────────────────────────
console.log('\n📋 Meta API');

if (enchantName) {
  const name = enchantName;
  await test(`meta.getEnchant (접두: ${name})`, async () => {
    const r = await heroes.meta.getEnchant({ enchant_type: '0', enchant_name: name });
    if (r.enchant_grade === undefined) throw new Error('enchant_grade 없음');
  });
} else {
  console.log('  ⏭️  meta.getEnchant — 장착 아이템에서 접두 인챈트 명을 찾지 못해 스킵');
}

// ─── 4. Notice ───────────────────────────────────────────────────────────────
console.log('\n📋 Notice API');

let noticeId: number | undefined;
let patchNoticeId: number | undefined;
let eventNoticeId: number | undefined;

await test('notice.getList', async () => {
  const r = await heroes.notice.getList();
  if (!Array.isArray(r.notice)) throw new Error('notice 없음');
  noticeId = r.notice[0]?.notice_id;
});

await test('notice.getPatchList', async () => {
  const r = await heroes.notice.getPatchList();
  if (!Array.isArray(r.patch_notice)) throw new Error('patch_notice 없음');
  patchNoticeId = r.patch_notice[0]?.notice_id;
});

await test('notice.getEventList', async () => {
  const r = await heroes.notice.getEventList();
  if (!Array.isArray(r.event_notice)) throw new Error('event_notice 없음');
  eventNoticeId = r.event_notice[0]?.notice_id;
});

if (noticeId !== undefined) {
  const id = noticeId;
  await test('notice.getDetail', async () => {
    const r = await heroes.notice.getDetail(id);
    if (!r.title) throw new Error('title 없음');
  });
}

if (patchNoticeId !== undefined) {
  const id = patchNoticeId;
  await test('notice.getPatchDetail', async () => {
    const r = await heroes.notice.getPatchDetail(id);
    if (!r.title) throw new Error('title 없음');
  });
}

if (eventNoticeId !== undefined) {
  const id = eventNoticeId;
  await test('notice.getEventDetail', async () => {
    const r = await heroes.notice.getEventDetail(id);
    if (!r.title) throw new Error('title 없음');
  });
}

// ─── 5. Marketplace ──────────────────────────────────────────────────────────
console.log('\n📋 Marketplace API');

const marketItem = process.env['HEROES_MARKET_ITEM'] ?? '인챈트 스크롤';

await test(`marketplace.listHistory (${marketItem})`, async () => {
  const first = await heroes.marketplace.listHistory({ item_name: marketItem });
  if (!Array.isArray(first.item)) throw new Error('item 없음');
  console.log(`    ${first.item.length}건, next_cursor: ${String(first.next_cursor)}`);
  if (first.next_cursor) {
    const next = await heroes.marketplace.listHistory({
      item_name: marketItem,
      cursor: first.next_cursor,
    });
    if (!Array.isArray(next.item)) throw new Error('다음 페이지 item 없음');
  }
});

await test('marketplace.getGoldBuyTop30', async () => {
  const r = await heroes.marketplace.getGoldBuyTop30();
  if (!Array.isArray(r.buy_gold)) throw new Error('buy_gold 없음');
});

await test('marketplace.getGoldSellTop30', async () => {
  const r = await heroes.marketplace.getGoldSellTop30();
  if (!Array.isArray(r.sell_gold)) throw new Error('sell_gold 없음');
});

// ─── 6. Ranking ──────────────────────────────────────────────────────────────
console.log('\n📋 Ranking API');

await test('ranking.getHallOfHonor (0: 공격력)', async () => {
  const r = await heroes.ranking.getHallOfHonor({ ranking_type: '0' });
  if (!Array.isArray(r)) throw new Error('응답이 배열이 아님');
  console.log(`    ${r.length}건`);
});

await test('ranking.getRealTime (1: 마법 공격력, 1페이지)', async () => {
  const r = await heroes.ranking.getRealTime({ ranking_type: '1', page_no: 1 });
  if (!Array.isArray(r)) throw new Error('응답이 배열이 아님');
  console.log(`    ${r.length}건`);
});

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  Mabinogi Heroes E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
