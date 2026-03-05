/**
 * 실제 Nexon API 키로 SDK를 빠르게 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env.example 을 복사해서 .env 파일 생성
 *   2. .env 에 NEXON_API_KEY 값 입력
 *   3. yarn test:api 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';

const apiKey = process.env['NEXON_MAPLESTORY_API_KEY'];
if (!apiKey) {
  console.error('❌ .env 파일에 NEXON_MAPLESTORY_API_KEY 를 설정해주세요.');
  console.error('   .env.example 파일을 참고하세요.');
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
  const result = await client.maplestory.getOcid('아델');
  ocid = result;
  if (!ocid) throw new Error('ocid가 비어있음');
});

if (ocid) {
  await test('character.getBasic', async () => {
    const r = await client.maplestory.character.getBasic({ ocid: ocid as any });
    if (!r.character_name) throw new Error('character_name 없음');
  });

  await test('character.getPopularity', async () => {
    const r = await client.maplestory.character.getPopularity({ ocid: ocid as any });
    if (r.popularity === undefined) throw new Error('popularity 없음');
  });

  await test('character.getStat', async () => {
    const r = await client.maplestory.character.getStat({ ocid: ocid as any });
    if (!r.final_stat) throw new Error('final_stat 없음');
  });

  await test('character.getHyperStat', async () => {
    const r = await client.maplestory.character.getHyperStat({ ocid: ocid as any });
    if (!r.use_preset_no) throw new Error('use_preset_no 없음');
  });

  await test('character.getPropensity', async () => {
    const r = await client.maplestory.character.getPropensity({ ocid: ocid as any });
    if (r.charisma_level === undefined) throw new Error('charisma_level 없음');
  });

  await test('character.getAbility', async () => {
    const r = await client.maplestory.character.getAbility({ ocid: ocid as any });
    if (!r.ability_grade) throw new Error('ability_grade 없음');
  });

  await test('character.getItemEquipment', async () => {
    const r = await client.maplestory.character.getItemEquipment({ ocid: ocid as any });
    if (!r.item_equipment) throw new Error('item_equipment 없음');
  });

  await test('character.getCashItemEquipment', async () => {
    const r = await client.maplestory.character.getCashItemEquipment({ ocid: ocid as any });
    if (!r.cash_item_equipment_base) throw new Error('cash_item_equipment_base 없음');
  });

  await test('character.getSymbolEquipment', async () => {
    const r = await client.maplestory.character.getSymbolEquipment({ ocid: ocid as any });
    if (!r.symbol) throw new Error('symbol 없음');
  });

  await test('character.getSetEffect', async () => {
    const r = await client.maplestory.character.getSetEffect({ ocid: ocid as any });
    if (!r.set_effect) throw new Error('set_effect 없음');
  });

  await test('character.getBeautyEquipment', async () => {
    const r = await client.maplestory.character.getBeautyEquipment({ ocid: ocid as any });
    if (!r.character_hair) throw new Error('character_hair 없음');
  });

  await test('character.getAndroidEquipment', async () => {
    await client.maplestory.character.getAndroidEquipment({ ocid: ocid as any });
  });

  await test('character.getPetEquipment', async () => {
    await client.maplestory.character.getPetEquipment({ ocid: ocid as any });
  });

  await test('character.getSkill (4차)', async () => {
    const r = await client.maplestory.character.getSkill({
      ocid: ocid as any,
      character_skill_grade: '4',
    });
    if (!r.character_skill) throw new Error('character_skill 없음');
  });

  await test('character.getLinkSkill', async () => {
    const r = await client.maplestory.character.getLinkSkill({ ocid: ocid as any });
    if (!r.character_link_skill) throw new Error('character_link_skill 없음');
  });

  await test('character.getVMatrix', async () => {
    await client.maplestory.character.getVMatrix({ ocid: ocid as any });
  });

  await test('character.getHexaMatrix', async () => {
    await client.maplestory.character.getHexaMatrix({ ocid: ocid as any });
  });

  await test('character.getHexaMatrixStat', async () => {
    await client.maplestory.character.getHexaMatrixStat({ ocid: ocid as any });
  });

  await test('character.getDojang', async () => {
    await client.maplestory.character.getDojang({ ocid: ocid as any });
  });

  // ─── 2. Union ──────────────────────────────────────────────────────────────
  console.log('\n📋 Union API');

  await test('union.getUnion', async () => {
    const r = await client.maplestory.union.getUnion({ ocid: ocid as any });
    if (r.union_level === undefined) throw new Error('union_level 없음');
  });

  await test('union.getRaider', async () => {
    const r = await client.maplestory.union.getRaider({ ocid: ocid as any });
    if (!r.union_raider_stat) throw new Error('union_raider_stat 없음');
  });

  await test('union.getArtifact', async () => {
    const r = await client.maplestory.union.getArtifact({ ocid: ocid as any });
    if (!r.union_artifact_effect) throw new Error('union_artifact_effect 없음');
  });

  await test('union.getChampion', async () => {
    await client.maplestory.union.getChampion({ ocid: ocid as any });
  });
}

// ─── 3. Guild ────────────────────────────────────────────────────────────────
console.log('\n📋 Guild API');

let guildId: string | undefined;

await test('guild.getId', async () => {
  const r = await client.maplestory.guild.getId('아델', '스카니아');
  guildId = r;
  if (!guildId) throw new Error('oguild_id가 비어있음');
});

if (guildId) {
  await test('guild.getBasic', async () => {
    const r = await client.maplestory.guild.getBasic({ oguild_id: guildId as any });
    if (!r.guild_name) throw new Error('guild_name 없음');
  });
}

// ─── 4. History ──────────────────────────────────────────────────────────────
console.log('\n📋 History API');

await test('history.getStarforce', async () => {
  const r = await client.maplestory.history.getStarforce({ count: 10, date: '2024-06-01' });
  if (r.count === undefined) throw new Error('count 없음');
});

await test('history.getPotential', async () => {
  const r = await client.maplestory.history.getPotential({ count: 10, date: '2024-06-01' });
  if (r.count === undefined) throw new Error('count 없음');
});

await test('history.getCube', async () => {
  const r = await client.maplestory.history.getCube({ count: 10, date: '2024-06-01' });
  if (r.count === undefined) throw new Error('count 없음');
});

// ─── 5. Ranking ──────────────────────────────────────────────────────────────
console.log('\n📋 Ranking API');

await test('ranking.getOverall', async () => {
  const r = await client.maplestory.ranking.getOverall({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getUnion', async () => {
  const r = await client.maplestory.ranking.getUnion({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getGuild', async () => {
  const r = await client.maplestory.ranking.getGuild({ date: '2024-06-01', ranking_type: 0 });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getDojang', async () => {
  const r = await client.maplestory.ranking.getDojang({ date: '2024-06-01', difficulty: 0 });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getTheSeed', async () => {
  const r = await client.maplestory.ranking.getTheSeed({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getAchievement', async () => {
  const r = await client.maplestory.ranking.getAchievement({ date: '2024-06-01' });
  if (!r.ranking) throw new Error('ranking 없음');
});

// ─── 6. Notice ───────────────────────────────────────────────────────────────
console.log('\n📋 Notice API');

let noticeId: number | undefined;

await test('notice.getList', async () => {
  const r = await client.maplestory.notice.getList();
  if (!r.notice) throw new Error('notice 없음');
  noticeId = r.notice[0]?.notice_id;
});

if (noticeId) {
  await test('notice.getDetail', async () => {
    const r = await client.maplestory.notice.getDetail(noticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

let updateNoticeId: number | undefined;

await test('notice.getUpdateList', async () => {
  const r = await client.maplestory.notice.getUpdateList();
  if (!r.update_notice) throw new Error('update_notice 없음');
  updateNoticeId = r.update_notice[0]?.notice_id;
});

if (updateNoticeId) {
  await test('notice.getUpdateDetail', async () => {
    const r = await client.maplestory.notice.getUpdateDetail(updateNoticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

let eventNoticeId: number | undefined;

await test('notice.getEventList', async () => {
  const r = await client.maplestory.notice.getEventList();
  if (!r.event_notice) throw new Error('event_notice 없음');
  eventNoticeId = r.event_notice[0]?.notice_id;
});

if (eventNoticeId) {
  await test('notice.getEventDetail', async () => {
    const r = await client.maplestory.notice.getEventDetail(eventNoticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

let cashshopNoticeId: number | undefined;

await test('notice.getCashshopList', async () => {
  const r = await client.maplestory.notice.getCashshopList();
  if (!r.cashshop_notice) throw new Error('cashshop_notice 없음');
  cashshopNoticeId = r.cashshop_notice[0]?.notice_id;
});

if (cashshopNoticeId) {
  await test('notice.getCashshopDetail', async () => {
    const r = await client.maplestory.notice.getCashshopDetail(cashshopNoticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`결과: ✅ ${passed} passed, ❌ ${failed} failed (총 ${passed + failed}개)`);
process.exit(failed > 0 ? 1 : 0);
