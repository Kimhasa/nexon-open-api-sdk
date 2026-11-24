/**
 * 퍼스트 디센던트 실제 API로 SDK를 검증하는 스크립트.
 *
 * 사용법:
 *   1. .env 파일에 NEXON_TFD_API_KEY, TFD_USER_NAME (예: 닉네임#1234) 설정
 *   2. tsx scripts/test-first-descendant.ts 실행
 *
 * 메타데이터는 API 키가 필요 없는 정적 파일이라, 키가 없으면 메타데이터 32개만 확인한다.
 * TFD_LANGUAGE 로 메타데이터 언어를 바꿀 수 있다 (기본값 ko).
 */
import 'dotenv/config';
import { NexonClient, TFD_LANGUAGE_CODES } from '../src/index.js';
import type { TfdLanguageCode, TfdOuid } from '../src/index.js';

const apiKey = process.env['NEXON_TFD_API_KEY'];
const userName = process.env['TFD_USER_NAME'];
const languageEnv = process.env['TFD_LANGUAGE'] ?? 'ko';

const LANGUAGE = TFD_LANGUAGE_CODES.find((code) => code === languageEnv);
if (LANGUAGE === undefined) {
  console.error(`❌ TFD_LANGUAGE 값이 올바르지 않습니다: ${languageEnv}`);
  console.error(`   사용 가능: ${TFD_LANGUAGE_CODES.join(', ')}`);
  process.exit(1);
}
const language: TfdLanguageCode = LANGUAGE;

// 메타데이터는 키를 검증하지 않으므로 키가 없어도 자리표시자로 클라이언트를 만든다
const client = new NexonClient({ apiKey: apiKey || 'no-api-key' });
const tfd = client.firstDescendant;

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

// ─── 1. Meta (키 불필요) ─────────────────────────────────────────────────────
console.log(`\n📋 Meta API (${language})`);

const metaCalls: ReadonlyArray<readonly [string, () => Promise<readonly unknown[]>]> = [
  ['getAcquisitionDetail', () => tfd.meta.getAcquisitionDetail(language)],
  ['getArcheTuningNode', () => tfd.meta.getArcheTuningNode(language)],
  ['getCollectibleItem', () => tfd.meta.getCollectibleItem(language)],
  ['getConsumableMaterial', () => tfd.meta.getConsumableMaterial(language)],
  ['getCoreType', () => tfd.meta.getCoreType(language)],
  ['getCustomizingItem', () => tfd.meta.getCustomizingItem(language)],
  ['getDescendant', () => tfd.meta.getDescendant(language)],
  ['getDescendantGroup', () => tfd.meta.getDescendantGroup(language)],
  ['getExternalComponent', () => tfd.meta.getExternalComponent(language)],
  ['getFellow', () => tfd.meta.getFellow(language)],
  ['getMedal', () => tfd.meta.getMedal(language)],
  ['getModule', () => tfd.meta.getModule(language)],
  ['getNodeItem', () => tfd.meta.getNodeItem(language)],
  ['getNodeSocketType', () => tfd.meta.getNodeSocketType(language)],
  ['getReactor', () => tfd.meta.getReactor(language)],
  ['getResearch', () => tfd.meta.getResearch(language)],
  ['getReward', () => tfd.meta.getReward(language)],
  ['getStat', () => tfd.meta.getStat(language)],
  ['getTier', () => tfd.meta.getTier(language)],
  ['getTitle', () => tfd.meta.getTitle(language)],
  ['getVehicle', () => tfd.meta.getVehicle(language)],
  ['getVoidBattle', () => tfd.meta.getVoidBattle(language)],
  ['getWeapon', () => tfd.meta.getWeapon(language)],
  ['getWeaponType', () => tfd.meta.getWeaponType(language)],
  ['getAdaptLevel', () => tfd.meta.getAdaptLevel()],
  ['getAmorphousReward', () => tfd.meta.getAmorphousReward()],
  ['getArcheTuningBoard', () => tfd.meta.getArcheTuningBoard()],
  ['getArcheTuningBoardGroup', () => tfd.meta.getArcheTuningBoardGroup()],
  ['getCoreSlot', () => tfd.meta.getCoreSlot()],
  ['getDescendantLevelDetail', () => tfd.meta.getDescendantLevelDetail()],
  ['getFellowLevelDetail', () => tfd.meta.getFellowLevelDetail()],
  ['getMasteryRankLevelDetail', () => tfd.meta.getMasteryRankLevelDetail()],
];

for (const [name, call] of metaCalls) {
  await test(`meta.${name}`, async () => {
    const items = await call();
    if (!Array.isArray(items) || items.length === 0) throw new Error('빈 응답');
    console.log(`    ${items.length}개`);
  });
}

if (!apiKey || !userName) {
  console.log('\n⏭️  계정·추천 모듈·리더보드 API — NEXON_TFD_API_KEY, TFD_USER_NAME 미설정, 스킵');
} else {
  // ─── 2. OUID ───────────────────────────────────────────────────────────────
  console.log('\n📋 OUID');

  let ouid: TfdOuid | undefined;

  await test('getOuid', async () => {
    ouid = await tfd.getOuid(userName);
    if (!ouid) throw new Error('ouid가 비어있음');
  });

  // ─── 3. User ───────────────────────────────────────────────────────────────
  let descendantId: string | undefined;
  let weaponId: string | undefined;

  if (ouid) {
    const id = ouid;
    console.log('\n📋 User API');

    await test('user.getBasic', async () => {
      const r = await tfd.user.getBasic({ ouid: id });
      if (!r.user_name) throw new Error('user_name 없음');
      console.log(`    마스터리 랭크 ${r.mastery_rank_level} (${r.platform_type})`);
    });

    await test('user.getDescendant', async () => {
      const r = await tfd.user.getDescendant({ ouid: id });
      if (!r.descendant_id) throw new Error('descendant_id 없음');
      descendantId = r.descendant_id;
      console.log(
        `    계승자 ${r.descendant_id} Lv.${r.descendant_level}, 모듈 ${r.module.length}개`,
      );
    });

    await test('user.getWeapon', async () => {
      const r = await tfd.user.getWeapon({ ouid: id, language_code: language });
      if (!Array.isArray(r.weapon)) throw new Error('weapon 배열 없음');
      weaponId = r.weapon[0]?.weapon_id;
      console.log(`    무기 ${r.weapon.length}개`);
    });

    await test('user.getReactor', async () => {
      const r = await tfd.user.getReactor({ ouid: id, language_code: language });
      if (!r.reactor_id) throw new Error('reactor_id 없음');
    });

    await test('user.getExternalComponent', async () => {
      const r = await tfd.user.getExternalComponent({ ouid: id, language_code: language });
      if (!Array.isArray(r.external_component)) throw new Error('external_component 배열 없음');
      console.log(`    외장 부품 ${r.external_component.length}개`);
    });

    await test('user.getArcheTuning', async () => {
      const descendants = await tfd.meta.getDescendant(language);
      const groupId = descendants.find(
        (d) => d.descendant_id === descendantId,
      )?.descendant_group_id;
      if (!groupId) throw new Error('장착 계승자의 descendant_group_id를 찾지 못함');
      const r = await tfd.user.getArcheTuning({ ouid: id, descendant_group_id: groupId });
      if (!Array.isArray(r.arche_tuning)) throw new Error('arche_tuning 배열 없음');
    });
  }

  // ─── 4. Recommendation ─────────────────────────────────────────────────────
  console.log('\n📋 Recommendation API');

  await test('recommendation.getModule', async () => {
    const voidBattleId = (await tfd.meta.getVoidBattle(language))[0]?.void_battle_id;
    const descendant = descendantId ?? (await tfd.meta.getDescendant(language))[0]?.descendant_id;
    const weapon = weaponId ?? (await tfd.meta.getWeapon(language))[0]?.weapon_id;
    if (!voidBattleId || !descendant || !weapon) throw new Error('조회 조건을 만들지 못함');
    const r = await tfd.recommendation.getModule({
      descendant_id: descendant,
      weapon_id: weapon,
      void_battle_id: voidBattleId,
      period: '2',
    });
    console.log(
      `    계승자 모듈 ${r.descendant?.recommendation?.length ?? 0}개, 무기 모듈 ${r.weapon?.recommendation?.length ?? 0}개`,
    );
  });

  // ─── 5. Leaderboard ────────────────────────────────────────────────────────
  console.log('\n📋 Leaderboard API');

  await test('leaderboard.getVoidInterceptBattle (Solo)', async () => {
    const r = await tfd.leaderboard.getVoidInterceptBattle({
      leaderboard_type: 'Solo',
      ...(descendantId ? { descendant_id: descendantId } : {}),
    });
    console.log(`    ${r.leaderboard?.length ?? 0}건`);
  });

  await test('leaderboard.getVoidInterceptBattle (Squad)', async () => {
    const r = await tfd.leaderboard.getVoidInterceptBattle({
      leaderboard_type: 'Squad',
      squad_user_count: 4,
    });
    console.log(`    ${r.leaderboard?.length ?? 0}건`);
  });

  await test('leaderboard.getVoidErosionPurgeChallenge (Solo)', async () => {
    const r = await tfd.leaderboard.getVoidErosionPurgeChallenge({
      leaderboard_type: 'Solo',
      ...(descendantId ? { descendant_id: descendantId } : {}),
    });
    console.log(`    ${r.leaderboard?.length ?? 0}건`);
  });

  await test('leaderboard.getVoidErosionPurgeChallenge (Squad)', async () => {
    const r = await tfd.leaderboard.getVoidErosionPurgeChallenge({
      leaderboard_type: 'Squad',
      squad_user_count: 4,
    });
    console.log(`    ${r.leaderboard?.length ?? 0}건`);
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(
  `  First Descendant E2E: ${passed} passed, ${failed} failed (total ${passed + failed})`,
);
console.log(`${'═'.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
