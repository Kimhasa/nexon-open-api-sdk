/**
 * Nexon Open API 포털 모니터링 스크립트
 *
 * L1: 17개 게임 페이지에서 카테고리 링크 유무로 API 제공 시작 감지
 * L2: 각 게임 페이지에서 카테고리 링크 파싱 → 스냅샷과 비교하여 추가/삭제 감지
 *
 * 넥슨 포털이 SPA라서 모든 라우트가 HTTP 200을 반환하지만,
 * HTML 내 카테고리 링크 (/ko/game/{slug}/?id=N)는 서버에서 렌더링되므로 파싱 가능.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Types ───────────────────────────────────────────────────────────

interface GameEntry {
  name: string;
  portalPath: string;
  categories: Record<string, string>;
}

interface Snapshot {
  version: number;
  lastChecked: string | null;
  games: Record<string, GameEntry>;
}

interface Change {
  type: 'api_started' | 'category_added' | 'category_removed';
  game: string;
  detail: string;
}

// ─── Constants ───────────────────────────────────────────────────────

const PORTAL_BASE = 'https://openapi.nexon.com';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = resolve(__dirname, 'api-snapshot.json');

// 요청 간 딜레이 (서버 부하 방지, ms)
const REQUEST_DELAY = 500;

// ─── Helpers ─────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'nexon-open-api-sdk-monitor/1.0',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 게임 페이지 HTML에서 카테고리 링크를 추출한다.
 * 패턴: /ko/game/{slug}/?id={number}
 */
function extractCategoryIds(html: string, slug: string): string[] {
  const pattern = new RegExp(`/ko/game/${slug}/\\?id=(\\d+)`, 'g');
  const ids = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    ids.add(match[1]!);
  }
  return [...ids].sort((a, b) => Number(a) - Number(b));
}

// ─── Check ───────────────────────────────────────────────────────────

async function checkAllGames(snapshot: Snapshot): Promise<Change[]> {
  const changes: Change[] = [];

  for (const [slug, game] of Object.entries(snapshot.games)) {
    console.log(`  🔍 ${game.name} (${slug})`);

    // 카테고리가 있으면 첫 번째 카테고리 페이지, 없으면 메인 페이지 fetch
    const firstCategoryId = Object.keys(game.categories)[0];
    const url = firstCategoryId
      ? `${PORTAL_BASE}/ko/game/${slug}/?id=${firstCategoryId}`
      : `${PORTAL_BASE}/ko/game/${slug}/`;
    const html = await fetchHtml(url);

    if (html === null) {
      console.log(`     ⚠️  fetch 실패 — 스킵`);
      await delay(REQUEST_DELAY);
      continue;
    }

    // 카테고리 링크 파싱
    const foundIds = extractCategoryIds(html, slug);
    const knownIds = new Set(Object.keys(game.categories));

    // API가 없던 게임에 카테고리가 생긴 경우 (API 제공 시작)
    if (knownIds.size === 0 && foundIds.length > 0) {
      changes.push({
        type: 'api_started',
        game: slug,
        detail: `${game.name} API 제공 시작 감지 — 카테고리 ${foundIds.length}개 발견 (${PORTAL_BASE}/ko/game/${slug}/)`,
      });
      // 새 카테고리도 개별 기록
      for (const id of foundIds) {
        changes.push({
          type: 'category_added',
          game: slug,
          detail: `${game.name}에 새 카테고리 (id=${id}) — ${PORTAL_BASE}/ko/game/${slug}/?id=${id}`,
        });
      }
    } else {
      // 새 카테고리 감지
      for (const id of foundIds) {
        if (!knownIds.has(id)) {
          changes.push({
            type: 'category_added',
            game: slug,
            detail: `${game.name}에 새 카테고리 감지 (id=${id}) — ${PORTAL_BASE}/ko/game/${slug}/?id=${id}`,
          });
        }
      }

      // 삭제된 카테고리 감지
      const foundIdSet = new Set(foundIds);
      for (const [id, name] of Object.entries(game.categories)) {
        if (!foundIdSet.has(id)) {
          changes.push({
            type: 'category_removed',
            game: slug,
            detail: `${game.name}에서 카테고리 제거 감지: "${name}" (id=${id})`,
          });
        }
      }
    }

    // 결과 출력
    const gameChanges = changes.filter((c) => c.game === slug);
    if (gameChanges.length === 0) {
      const status = knownIds.size === 0 ? 'API 미제공' : `카테고리 ${knownIds.size}개 일치`;
      console.log(`     ✅ ${status}`);
    } else {
      gameChanges.forEach((c) => console.log(`     ⚠️  ${c.detail}`));
    }

    await delay(REQUEST_DELAY);
  }

  return changes;
}

// ─── Main ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('🔍 Nexon Open API 포털 모니터링 시작...\n');

  const snapshot: Snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf-8'));
  const gamesWithApi = Object.values(snapshot.games).filter(
    (g) => Object.keys(g.categories).length > 0,
  ).length;
  const gamesWithoutApi = Object.values(snapshot.games).filter(
    (g) => Object.keys(g.categories).length === 0,
  ).length;
  console.log(
    `📋 스냅샷: ${Object.keys(snapshot.games).length}개 게임 (API 제공: ${gamesWithApi}, 미제공: ${gamesWithoutApi}), 마지막 확인: ${snapshot.lastChecked ?? '없음'}\n`,
  );

  console.log('── 게임별 카테고리 변경 감지 ──');
  const allChanges = await checkAllGames(snapshot);

  // 스냅샷 타임스탬프 업데이트
  snapshot.lastChecked = new Date().toISOString();
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf-8');

  if (allChanges.length > 0) {
    console.log(`\n🚨 총 ${allChanges.length}건의 변경 감지됨`);

    // GitHub Actions 출력
    const outputPath = process.env['GITHUB_OUTPUT'];
    if (outputPath) {
      const summary = allChanges.map((c) => `- ${c.detail}`).join('\n');
      const output = [
        `changes_detected=true`,
        `changes_count=${allChanges.length}`,
        `changes_summary<<EOF`,
        summary,
        'EOF',
      ].join('\n');
      writeFileSync(outputPath, output + '\n', { flag: 'a' });
    }
  } else {
    console.log('\n✅ 변경사항 없음 — 모든 게임/카테고리가 스냅샷과 일치합니다.');

    const outputPath = process.env['GITHUB_OUTPUT'];
    if (outputPath) {
      writeFileSync(outputPath, 'changes_detected=false\n', { flag: 'a' });
    }
  }
}

main().catch((error: unknown) => {
  console.error('❌ 모니터링 실패:', error);
  process.exitCode = 1;
});
