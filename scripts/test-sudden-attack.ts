/**
 * 서든어택 실제 API 키로 SDK를 검증합니다.
 * .env에 NEXON_SUDDEN_ATTACK_API_KEY와 SUDDEN_ATTACK_USER_NAME을 설정하고
 * `yarn tsx scripts/test-sudden-attack.ts`를 실행하세요.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { NexonClient } from '../src/index.js';
import type { SuddenAttackMatchMode, SuddenAttackOuid } from '../src/index.js';

const apiKey = process.env['NEXON_SUDDEN_ATTACK_API_KEY'];
const userName = process.env['SUDDEN_ATTACK_USER_NAME'];
if (!apiKey || !userName) {
  console.error('.env에 NEXON_SUDDEN_ATTACK_API_KEY와 SUDDEN_ATTACK_USER_NAME을 설정하세요.');
  process.exit(1);
}

const { suddenAttack } = new NexonClient({ apiKey });
const matchMode = (process.env['SUDDEN_ATTACK_MATCH_MODE'] ?? '폭파미션') as SuddenAttackMatchMode;

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

let ouid: SuddenAttackOuid | undefined;
await test('getOuid', async () => {
  ouid = await suddenAttack.getOuid(userName);
  assert.ok(ouid, 'ouid 누락');
});

if (ouid) {
  const accountId = ouid;
  await test('user.getBasic', async () => {
    const result = await suddenAttack.user.getBasic(accountId);
    assert.ok(result.user_name, 'user_name 누락');
  });
  await test('user.getRank', async () => {
    const result = await suddenAttack.user.getRank(accountId);
    assert.ok('grade' in result, 'grade 누락');
  });
  await test('user.getTier', async () => {
    const result = await suddenAttack.user.getTier(accountId);
    assert.ok('solo_rank_match_tier' in result, 'solo_rank_match_tier 누락');
  });
  await test('user.getRecentInfo', async () => {
    const result = await suddenAttack.user.getRecentInfo(accountId);
    assert.ok('recent_win_rate' in result, 'recent_win_rate 누락');
  });

  let matchId: string | undefined;
  await test('match.getList', async () => {
    const result = await suddenAttack.match.getList({ ouid: accountId, match_mode: matchMode });
    assert.ok(Array.isArray(result.match), 'match 배열 누락');
    matchId = result.match[0]?.match_id;
  });

  await test('match.getDetail', async () => {
    assert.ok(
      matchId,
      '매치가 없습니다. 최근 기록이 있는 닉네임과 SUDDEN_ATTACK_MATCH_MODE를 설정하세요.',
    );
    const result = await suddenAttack.match.getDetail(matchId);
    assert.equal(result.match_id, matchId);
    assert.ok(Array.isArray(result.match_detail), 'match_detail 배열 누락');
  });
}

await test('metadata.getLogo', async () => {
  assert.ok((await suddenAttack.metadata.getLogo()).logo_image, 'logo_image 누락');
});
await test('metadata.getGrade', async () => {
  assert.ok((await suddenAttack.metadata.getGrade())[0]?.grade_image, 'grade_image 누락');
});
await test('metadata.getSeasonGrade', async () => {
  assert.ok(
    (await suddenAttack.metadata.getSeasonGrade())[0]?.season_grade_image,
    'season_grade_image 누락',
  );
});
await test('metadata.getTier', async () => {
  assert.ok((await suddenAttack.metadata.getTier())[0]?.tier_image, 'tier_image 누락');
});

console.log(`\n서든어택 E2E: ${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
