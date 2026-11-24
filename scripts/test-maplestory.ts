/**
 * 실제 Nexon API 키로 SDK를 빠르게 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env.example 을 복사해서 .env 파일 생성
 *   2. .env 에 NEXON_MAPLESTORY_API_KEY, MAPLESTORY_CHARACTER 값 입력
 *   3. yarn test:maplestory 실행
 *
 * 스케줄러와 강화 기록은 API 키를 발급한 계정의 캐릭터만 조회된다.
 * 그래서 스케줄러는 `character.getList()` 의 첫 캐릭터로 확인한다.
 */
import 'dotenv/config';
import { NexonBadRequestError, NexonClient, toNexonDate } from '../src/index.js';
import type { OCID, GuildId } from '../src/games/_base/maple-base-types.js';

const apiKey = process.env['NEXON_MAPLESTORY_API_KEY'];
const characterName = process.env['MAPLESTORY_CHARACTER'];
const guildName = process.env['MAPLESTORY_GUILD'];
const worldName = process.env['MAPLESTORY_WORLD'] ?? '스카니아';
// 선택: 구 개발자센터 API 키. 없으면 getLegacyOuid 검증을 건너뛴다.
const legacyApiKey = process.env['NEXON_MAPLESTORY_LEGACY_API_KEY'];
// 강화 기록과 랭킹은 최근 2년만 조회되므로 고정 날짜 대신 어제(KST)를 쓴다.
const historyDate = toNexonDate(new Date(Date.now() - 24 * 60 * 60 * 1000), 540);
// 링 익스체인지는 2025-08-21 ~ 2026-03-18 데이터만 있다 (포털 안내)
const ringExchangeDate = '2026-03-18';
if (!apiKey || !characterName) {
  console.error('❌ .env 파일에 NEXON_MAPLESTORY_API_KEY, MAPLESTORY_CHARACTER 를 설정해주세요.');
  console.error('   .env.example 파일을 참고하세요.');
  process.exit(1);
}

const client = new NexonClient({ apiKey, debug: true });

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

// ─── 1. Character ────────────────────────────────────────────────────────────
console.log('\n📋 Character API');

let ocid: OCID | undefined;

await test('getOcid', async () => {
  const result = await client.maplestory.getOcid(characterName);
  ocid = result;
  if (!ocid) throw new Error('ocid가 비어있음');
});

if (ocid) {
  await test('character.getBasic', async () => {
    const r = await client.maplestory.character.getBasic({ ocid: ocid! });
    if (!r.character_name) throw new Error('character_name 없음');
  });

  await test('character.getPopularity', async () => {
    const r = await client.maplestory.character.getPopularity({ ocid: ocid! });
    if (r.popularity === undefined) throw new Error('popularity 없음');
  });

  await test('character.getStat', async () => {
    const r = await client.maplestory.character.getStat({ ocid: ocid! });
    if (!r.final_stat) throw new Error('final_stat 없음');
  });

  await test('character.getHyperStat', async () => {
    const r = await client.maplestory.character.getHyperStat({ ocid: ocid! });
    if (!r.use_preset_no) throw new Error('use_preset_no 없음');
  });

  await test('character.getPropensity', async () => {
    const r = await client.maplestory.character.getPropensity({ ocid: ocid! });
    if (r.charisma_level === undefined) throw new Error('charisma_level 없음');
  });

  await test('character.getAbility', async () => {
    const r = await client.maplestory.character.getAbility({ ocid: ocid! });
    if (!r.ability_grade) throw new Error('ability_grade 없음');
  });

  await test('character.getItemEquipment', async () => {
    const r = await client.maplestory.character.getItemEquipment({ ocid: ocid! });
    if (!r.item_equipment) throw new Error('item_equipment 없음');
  });

  await test('character.getCashItemEquipment', async () => {
    const r = await client.maplestory.character.getCashItemEquipment({ ocid: ocid! });
    if (!r.cash_item_equipment_base) throw new Error('cash_item_equipment_base 없음');
  });

  await test('character.getSymbolEquipment', async () => {
    const r = await client.maplestory.character.getSymbolEquipment({ ocid: ocid! });
    if (!r.symbol) throw new Error('symbol 없음');
  });

  await test('character.getSetEffect', async () => {
    const r = await client.maplestory.character.getSetEffect({ ocid: ocid! });
    if (!r.set_effect) throw new Error('set_effect 없음');
  });

  await test('character.getBeautyEquipment', async () => {
    const r = await client.maplestory.character.getBeautyEquipment({ ocid: ocid! });
    if (!r.character_hair) throw new Error('character_hair 없음');
  });

  await test('character.getAndroidEquipment', async () => {
    await client.maplestory.character.getAndroidEquipment({ ocid: ocid! });
  });

  await test('character.getPetEquipment', async () => {
    await client.maplestory.character.getPetEquipment({ ocid: ocid! });
  });

  await test('character.getSkill (4차)', async () => {
    const r = await client.maplestory.character.getSkill({
      ocid: ocid!,
      character_skill_grade: '4',
    });
    if (!r.character_skill) throw new Error('character_skill 없음');
  });

  await test('character.getLinkSkill', async () => {
    const r = await client.maplestory.character.getLinkSkill({ ocid: ocid! });
    if (!r.character_link_skill) throw new Error('character_link_skill 없음');
  });

  await test('character.getVMatrix', async () => {
    await client.maplestory.character.getVMatrix({ ocid: ocid! });
  });

  await test('character.getHexaMatrix', async () => {
    await client.maplestory.character.getHexaMatrix({ ocid: ocid! });
  });

  await test('character.getHexaMatrixStat', async () => {
    await client.maplestory.character.getHexaMatrixStat({ ocid: ocid! });
  });

  await test('character.getDojang', async () => {
    await client.maplestory.character.getDojang({ ocid: ocid! });
  });

  await test('character.getOtherStat', async () => {
    const r = await client.maplestory.character.getOtherStat({ ocid: ocid! });
    // 기타 능력치가 없는 캐릭터는 null 이 온다
    if (!('other_stat' in r)) throw new Error('other_stat 없음');
  });

  await test('character.getRingExchangeSkillEquipment', async () => {
    await client.maplestory.character.getRingExchangeSkillEquipment({
      ocid: ocid!,
      date: ringExchangeDate,
    });
  });

  await test('character.getRingReserveSkillEquipment', async () => {
    const r = await client.maplestory.character.getRingReserveSkillEquipment({ ocid: ocid! });
    if (r.special_ring_reserve_level === undefined) {
      throw new Error('special_ring_reserve_level 없음');
    }
  });

  // ─── Scheduler (자신의 계정 캐릭터만 조회 가능) ──────────────────────────────
  console.log('\n📋 Scheduler API');

  const ownList = await client.maplestory.character.getList().catch(() => undefined);
  const ownOcid = ownList?.account_list[0]?.character_list[0]?.ocid;
  if (ownOcid) {
    await test('scheduler.getCharacterState', async () => {
      const r = await client.maplestory.scheduler.getCharacterState({ ocid: ownOcid });
      if (!('boss_contents' in r)) throw new Error('boss_contents 없음');
    });
  } else {
    console.log('  ⏭️  API 키 계정에 캐릭터가 없어 scheduler.getCharacterState 생략');
  }

  // ─── Battle Practice (리플레이를 등록한 캐릭터만 조회 가능) ──────────────────
  console.log('\n📋 Battle Practice API');

  let replayId: string | undefined;
  let hasReplay = true;

  await test('battlePractice.getReplayId', async () => {
    try {
      const r = await client.maplestory.battlePractice.getReplayId({ ocid: ocid! });
      if (!r.replay_list) throw new Error('replay_list 없음');
      replayId = r.replay_list[0]?.replay_id;
    } catch (err) {
      // 리플레이를 등록하지 않은 캐릭터는 넥슨이 OPENAPI00004 를 돌려준다
      if (!(err instanceof NexonBadRequestError)) throw err;
      hasReplay = false;
    }
  });
  if (!hasReplay)
    console.log('  ⏭️  연무장 리플레이를 등록하지 않은 캐릭터라 getReplayId 응답 대조 생략');

  if (replayId) {
    await test('battlePractice.getResult', async () => {
      const r = await client.maplestory.battlePractice.getResult({ replay_id: replayId! });
      if (r.total_damage === undefined) throw new Error('total_damage 없음');
    });

    await test('battlePractice.getSkillTimeline', async () => {
      const r = await client.maplestory.battlePractice.getSkillTimeline({
        replay_id: replayId!,
        page_no: 1,
      });
      if (!r.skill_timeline) throw new Error('skill_timeline 없음');
    });

    await test('battlePractice.getCharacterInfo', async () => {
      const r = await client.maplestory.battlePractice.getCharacterInfo({ replay_id: replayId! });
      if (!r.basic_object) throw new Error('basic_object 없음');
    });
  } else {
    console.log('  ⏭️  등록된 연무장 리플레이가 없어 result/skill-timeline/character-info 생략');
  }

  // ─── 2. Union ──────────────────────────────────────────────────────────────
  console.log('\n📋 Union API');

  await test('union.getUnion', async () => {
    const r = await client.maplestory.union.getUnion({ ocid: ocid! });
    if (r.union_level === undefined) throw new Error('union_level 없음');
  });

  await test('union.getRaider', async () => {
    const r = await client.maplestory.union.getRaider({ ocid: ocid! });
    if (!r.union_raider_stat) throw new Error('union_raider_stat 없음');
  });

  await test('union.getArtifact', async () => {
    const r = await client.maplestory.union.getArtifact({ ocid: ocid! });
    if (!r.union_artifact_effect) throw new Error('union_artifact_effect 없음');
  });

  await test('union.getChampion', async () => {
    await client.maplestory.union.getChampion({ ocid: ocid! });
  });
}

// ─── 3. Guild ────────────────────────────────────────────────────────────────
console.log('\n📋 Guild API');

let guildId: GuildId | undefined;

await test('guild.getId', async () => {
  const r = await client.maplestory.guild.getId(guildName ?? characterName, worldName);
  guildId = r;
  if (!guildId) throw new Error('oguild_id가 비어있음');
});

if (guildId) {
  await test('guild.getBasic', async () => {
    const r = await client.maplestory.guild.getBasic({ oguild_id: guildId! });
    if (!r.guild_name) throw new Error('guild_name 없음');
  });
}

// ─── 4. History ──────────────────────────────────────────────────────────────
console.log('\n📋 History API');

await test('history.getStarforce', async () => {
  const r = await client.maplestory.history.getStarforce({ count: 10, date: historyDate });
  if (r.count === undefined) throw new Error('count 없음');
});

await test('history.getPotential', async () => {
  const r = await client.maplestory.history.getPotential({ count: 10, date: historyDate });
  if (r.count === undefined) throw new Error('count 없음');
});

await test('history.getCube', async () => {
  const r = await client.maplestory.history.getCube({ count: 10, date: historyDate });
  if (r.count === undefined) throw new Error('count 없음');
});

await test('history.getSoulPotential', async () => {
  const r = await client.maplestory.history.getSoulPotential({ count: 10, date: historyDate });
  if (r.count === undefined) throw new Error('count 없음');
});

// ─── Account ─────────────────────────────────────────────────────────────────
console.log('\n📋 Account API');

await test('getOuid', async () => {
  const ouid = await client.maplestory.getOuid();
  if (!ouid) throw new Error('ouid가 비어있음');
});

await test('getAchievement', async () => {
  const r = await client.maplestory.getAchievement();
  if (!r.account_list) throw new Error('account_list 없음');
});

await test('character.getList', async () => {
  const r = await client.maplestory.character.getList();
  if (!r.account_list) throw new Error('account_list 없음');
});

if (legacyApiKey) {
  await test('getLegacyOuid', async () => {
    const ouid = await client.maplestory.getLegacyOuid(legacyApiKey);
    if (!ouid) throw new Error('ouid가 비어있음');
  });
} else {
  console.log('  ⏭️  NEXON_MAPLESTORY_LEGACY_API_KEY 가 없어 getLegacyOuid 생략');
}

// ─── 5. Ranking ──────────────────────────────────────────────────────────────
console.log('\n📋 Ranking API');

await test('ranking.getOverall', async () => {
  const r = await client.maplestory.ranking.getOverall({ date: historyDate });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getUnion', async () => {
  const r = await client.maplestory.ranking.getUnion({ date: historyDate });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getGuild', async () => {
  const r = await client.maplestory.ranking.getGuild({ date: historyDate, ranking_type: 0 });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getDojang', async () => {
  const r = await client.maplestory.ranking.getDojang({ date: historyDate, difficulty: 0 });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getTheSeed', async () => {
  const r = await client.maplestory.ranking.getTheSeed({ date: historyDate });
  if (!r.ranking) throw new Error('ranking 없음');
});

await test('ranking.getAchievement', async () => {
  const r = await client.maplestory.ranking.getAchievement({ date: historyDate });
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
