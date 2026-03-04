/**
 * 메이플스토리M 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_API_KEY 값 입력
 *   2. MAPLE_M_WORLD, MAPLE_M_CHARACTER 환경변수 설정 (또는 아래 기본값 사용)
 *   3. yarn test:api:m 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';

const apiKey = process.env['NEXON_MAPLESTORY_M_API_KEY'];
if (!apiKey) {
  console.error('❌ .env 파일에 NEXON_MAPLESTORY_M_API_KEY 를 설정해주세요.');
  process.exit(1);
}

const worldName = process.env['MAPLE_M_WORLD'] ?? '스카니아';
const characterName = process.env['MAPLE_M_CHARACTER'];
if (!characterName) {
  console.error('❌ .env 파일에 MAPLE_M_CHARACTER 를 설정해주세요. (테스트할 캐릭터명)');
  console.error('   예: MAPLE_M_CHARACTER=내캐릭터');
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

// ─── 1. Character ────────────────────────────────────────────────────────────
console.log('\n📋 Character API');

let ocid: string | undefined;

await test('getOcid', async () => {
  const result = await client.maplestorym.getOcid(worldName, characterName);
  ocid = result;
  if (!ocid) throw new Error('ocid가 비어있음');
});

if (ocid) {
  await test('character.getBasic', async () => {
    const r = await client.maplestorym.character.getBasic({ ocid: ocid as any });
    if (!r.character_name) throw new Error('character_name 없음');
  });

  await test('character.getStat', async () => {
    const r = await client.maplestorym.character.getStat({ ocid: ocid as any });
    if (!r.stat) throw new Error('stat 없음');
  });

  await test('character.getHyperStat', async () => {
    const r = await client.maplestorym.character.getHyperStat({ ocid: ocid as any });
    if (r.use_preset_no === undefined) throw new Error('use_preset_no 없음');
  });

  await test('character.getGuild', async () => {
    await client.maplestorym.character.getGuild({ ocid: ocid as any });
  });

  await test('character.getItemEquipment', async () => {
    const r = await client.maplestorym.character.getItemEquipment({ ocid: ocid as any });
    if (!r.item_equipment) throw new Error('item_equipment 없음');
  });

  await test('character.getCashItemEquipment', async () => {
    const r = await client.maplestorym.character.getCashItemEquipment({ ocid: ocid as any });
    if (!r.cash_item_equipment_base) throw new Error('cash_item_equipment_base 없음');
  });

  await test('character.getSymbol', async () => {
    const r = await client.maplestorym.character.getSymbol({ ocid: ocid as any });
    if (!r.symbol) throw new Error('symbol 없음');
  });

  await test('character.getSetEffect', async () => {
    const r = await client.maplestorym.character.getSetEffect({ ocid: ocid as any });
    if (!r.set_effect) throw new Error('set_effect 없음');
  });

  await test('character.getAndroidEquipment', async () => {
    await client.maplestorym.character.getAndroidEquipment({ ocid: ocid as any });
  });

  await test('character.getJewel', async () => {
    const r = await client.maplestorym.character.getJewel({ ocid: ocid as any });
    if (!r.jewel) throw new Error('jewel 없음');
  });

  await test('character.getBeautyEquipment', async () => {
    const r = await client.maplestorym.character.getBeautyEquipment({ ocid: ocid as any });
    if (!r.character_hair) throw new Error('character_hair 없음');
  });

  await test('character.getPetEquipment', async () => {
    await client.maplestorym.character.getPetEquipment({ ocid: ocid as any });
  });

  await test('character.getSkillEquipment', async () => {
    const r = await client.maplestorym.character.getSkillEquipment({ ocid: ocid as any });
    if (!r.character_skill) throw new Error('character_skill 없음');
  });

  await test('character.getLinkSkill', async () => {
    const r = await client.maplestorym.character.getLinkSkill({ ocid: ocid as any });
    if (!r.character_link_skill) throw new Error('character_link_skill 없음');
  });

  await test('character.getVMatrix', async () => {
    await client.maplestorym.character.getVMatrix({ ocid: ocid as any });
  });

  await test('character.getHexaMatrixSkill', async () => {
    await client.maplestorym.character.getHexaMatrixSkill({ ocid: ocid as any });
  });

  await test('character.getHexaMatrixStat', async () => {
    await client.maplestorym.character.getHexaMatrixStat({ ocid: ocid as any });
  });

  // ─── 2. Union ──────────────────────────────────────────────────────────────
  console.log('\n📋 Union API');

  await test('union.get', async () => {
    const r = await client.maplestorym.union.get({ ocid: ocid as any });
    if (r.union_level === undefined) throw new Error('union_level 없음');
  });

  await test('union.getRaider', async () => {
    const r = await client.maplestorym.union.getRaider({ ocid: ocid as any });
    if (!r.union_raider_stat) throw new Error('union_raider_stat 없음');
  });
}

// ─── 3. Guild ────────────────────────────────────────────────────────────────
console.log('\n📋 Guild API');

let guildId: string | undefined;

await test('guild.getId', async () => {
  const r = await client.maplestorym.guild.getId(worldName, '테스트길드');
  guildId = r;
  if (!guildId) throw new Error('oguild_id가 비어있음');
});

if (guildId) {
  await test('guild.getBasic', async () => {
    const r = await client.maplestorym.guild.getBasic({ oguild_id: guildId as any });
    if (!r.guild_name) throw new Error('guild_name 없음');
  });
}

// ─── 4. Ranking ──────────────────────────────────────────────────────────────
console.log('\n📋 Ranking API');

await test('ranking.getLevel', async () => {
  const r = await client.maplestorym.ranking.getLevel({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getDojang', async () => {
  const r = await client.maplestorym.ranking.getDojang({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getRootOfTime', async () => {
  const r = await client.maplestorym.ranking.getRootOfTime({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getUnion', async () => {
  const r = await client.maplestorym.ranking.getUnion({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getCombatPower', async () => {
  const r = await client.maplestorym.ranking.getCombatPower({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getKerningMTower', async () => {
  const r = await client.maplestorym.ranking.getKerningMTower({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getAchievement', async () => {
  const r = await client.maplestorym.ranking.getAchievement({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getSharenianBattlefield', async () => {
  const r = await client.maplestorym.ranking.getSharenianBattlefield({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getSharenianWaterway', async () => {
  const r = await client.maplestorym.ranking.getSharenianWaterway({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

// ─── 5. Notice ───────────────────────────────────────────────────────────────
console.log('\n📋 Notice API');

let noticeId: number | undefined;

await test('notice.getList', async () => {
  const r = await client.maplestorym.notice.getList();
  if (!r.notice) throw new Error('notice 없음');
  noticeId = r.notice[0]?.notice_id;
});

if (noticeId) {
  await test('notice.getDetail', async () => {
    const r = await client.maplestorym.notice.getDetail(noticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

await test('notice.getPatchList', async () => {
  const r = await client.maplestorym.notice.getPatchList();
  if (!r.patch_notice) throw new Error('patch_notice 없음');
});

let eventNoticeId: number | undefined;

await test('notice.getEventList', async () => {
  const r = await client.maplestorym.notice.getEventList();
  if (!r.event_notice) throw new Error('event_notice 없음');
  eventNoticeId = r.event_notice[0]?.notice_id;
});

if (eventNoticeId) {
  await test('notice.getEventDetail', async () => {
    const r = await client.maplestorym.notice.getEventDetail(eventNoticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`결과: ✅ ${passed} passed, ❌ ${failed} failed (총 ${passed + failed}개)`);
process.exit(failed > 0 ? 1 : 0);
