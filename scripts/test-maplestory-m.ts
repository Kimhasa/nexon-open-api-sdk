/**
 * 메이플스토리M 실제 API 키로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_MAPLESTORY_M_API_KEY 값 입력
 *   2. MAPLE_M_WORLD, MAPLE_M_CHARACTER 환경변수 설정 (또는 아래 기본값 사용)
 *   3. yarn test:maplestory-m 실행
 */
import 'dotenv/config';
import { NexonClient } from '../src/index.js';
import type { OCID, GuildId } from '../src/games/_base/maple-base-types.js';

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

// 어제 날짜 (KST 기준) — 랭킹 API에 사용
const yesterday = new Date(Date.now() + 9 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

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

let ocid: OCID | undefined;

await test('getOcid', async () => {
  const result = await client.maplestorym.getOcid(worldName, characterName);
  ocid = result;
  if (!ocid) throw new Error('ocid가 비어있음');
});

if (ocid) {
  await test('character.getBasic', async () => {
    const r = await client.maplestorym.character.getBasic({ ocid: ocid! });
    if (!r.character_name) throw new Error('character_name 없음');
  });

  await test('character.getStat', async () => {
    const r = await client.maplestorym.character.getStat({ ocid: ocid! });
    if (!('stat' in r)) throw new Error('stat 키 없음');
  });

  await test('character.getHyperStat', async () => {
    const r = await client.maplestorym.character.getHyperStat({ ocid: ocid! });
    if (!('use_preset_no' in r)) throw new Error('use_preset_no 키 없음');
  });

  await test('character.getGuild', async () => {
    await client.maplestorym.character.getGuild({ ocid: ocid! });
  });

  await test('character.getItemEquipment', async () => {
    const r = await client.maplestorym.character.getItemEquipment({ ocid: ocid! });
    if (!('item_equipment' in r)) throw new Error('item_equipment 키 없음');
  });

  await test('character.getCashItemEquipment', async () => {
    const r = await client.maplestorym.character.getCashItemEquipment({ ocid: ocid! });
    if (!('cash_item_equipment' in r)) throw new Error('cash_item_equipment 키 없음');
  });

  await test('character.getSymbol', async () => {
    const r = await client.maplestorym.character.getSymbol({ ocid: ocid! });
    if (!('arcane_symbol' in r)) throw new Error('arcane_symbol 키 없음');
  });

  await test('character.getSetEffect', async () => {
    const r = await client.maplestorym.character.getSetEffect({ ocid: ocid! });
    if (!('set_info' in r)) throw new Error('set_info 키 없음');
  });

  await test('character.getAndroidEquipment', async () => {
    await client.maplestorym.character.getAndroidEquipment({ ocid: ocid! });
  });

  await test('character.getJewel', async () => {
    const r = await client.maplestorym.character.getJewel({ ocid: ocid! });
    if (!('jewel_equipment' in r)) throw new Error('jewel_equipment 키 없음');
  });

  await test('character.getBeautyEquipment', async () => {
    await client.maplestorym.character.getBeautyEquipment({ ocid: ocid! });
  });

  await test('character.getPetEquipment', async () => {
    await client.maplestorym.character.getPetEquipment({ ocid: ocid! });
  });

  await test('character.getSkillEquipment', async () => {
    const r = await client.maplestorym.character.getSkillEquipment({ ocid: ocid! });
    if (!('skill' in r)) throw new Error('skill 키 없음');
  });

  await test('character.getLinkSkill', async () => {
    const r = await client.maplestorym.character.getLinkSkill({ ocid: ocid! });
    if (!('link_skill' in r)) throw new Error('link_skill 키 없음');
  });

  await test('character.getVMatrix', async () => {
    await client.maplestorym.character.getVMatrix({ ocid: ocid! });
  });

  await test('character.getHexaMatrixSkill', async () => {
    await client.maplestorym.character.getHexaMatrixSkill({ ocid: ocid! });
  });

  await test('character.getHexaMatrixStat', async () => {
    await client.maplestorym.character.getHexaMatrixStat({ ocid: ocid! });
  });

  // ─── 2. Union ──────────────────────────────────────────────────────────────
  console.log('\n📋 Union API');

  await test('union.get', async () => {
    const r = await client.maplestorym.union.get({ ocid: ocid! });
    if (!('union_level' in r)) throw new Error('union_level 키 없음');
  });

  await test('union.getRaider', async () => {
    const r = await client.maplestorym.union.getRaider({ ocid: ocid! });
    if (!('use_preset_no' in r)) throw new Error('use_preset_no 키 없음');
  });
}

// ─── 3. Guild ────────────────────────────────────────────────────────────────
console.log('\n📋 Guild API');

// 캐릭터의 길드 정보에서 길드명 가져와서 테스트
let guildName: string | undefined;
if (ocid) {
  try {
    const guildInfo = await client.maplestorym.character.getGuild({ ocid: ocid! });
    guildName = guildInfo.guild_name;
  } catch {
    // 길드 미가입 시 무시
  }
}

let guildId: GuildId | undefined;

if (guildName) {
  await test('guild.getId', async () => {
    const r = await client.maplestorym.guild.getId(worldName, guildName!);
    guildId = r;
    if (!guildId) throw new Error('oguild_id가 비어있음');
  });

  if (guildId) {
    await test('guild.getBasic', async () => {
      const r = await client.maplestorym.guild.getBasic({ oguild_id: guildId! });
      if (!r.guild_name) throw new Error('guild_name 없음');
    });
  }
} else {
  console.log('  ⏭️  guild.getId (캐릭터 길드 미가입 — 스킵)');
  console.log('  ⏭️  guild.getBasic (캐릭터 길드 미가입 — 스킵)');
}

// ─── 4. Ranking ──────────────────────────────────────────────────────────────
console.log(`\n📋 Ranking API (date: ${yesterday})`);

await test('ranking.getLevel', async () => {
  const r = await client.maplestorym.ranking.getLevel({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getDojang', async () => {
  const r = await client.maplestorym.ranking.getDojang({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getRootOfTime', async () => {
  const r = await client.maplestorym.ranking.getRootOfTime({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getUnion', async () => {
  const r = await client.maplestorym.ranking.getUnion({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getCombatPower', async () => {
  const r = await client.maplestorym.ranking.getCombatPower({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getKerningMTower', async () => {
  const r = await client.maplestorym.ranking.getKerningMTower({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getAchievement', async () => {
  const r = await client.maplestorym.ranking.getAchievement({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getSharenianBattlefield', async () => {
  const r = await client.maplestorym.ranking.getSharenianBattlefield({ date: yesterday });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getSharenianWaterway', async () => {
  const r = await client.maplestorym.ranking.getSharenianWaterway({ date: yesterday });
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

let patchNoticeId: number | undefined;

await test('notice.getPatchList', async () => {
  const r = await client.maplestorym.notice.getPatchList();
  if (!r.patch_notice) throw new Error('patch_notice 없음');
  patchNoticeId = r.patch_notice[0]?.notice_id;
});

if (patchNoticeId) {
  await test('notice.getPatchDetail', async () => {
    const r = await client.maplestorym.notice.getPatchDetail(patchNoticeId!);
    if (!r.title) throw new Error('title 없음');
  });
}

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
