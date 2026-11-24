// 팬사이트의 메이플스토리 종합 랭킹 TOP 10을 만듭니다.
// 실행: node --env-file=.env examples/maplestory-ranking-top10.mjs
// 명령 끝에 YYYY-MM-DD를 넣으면 해당 날짜의 랭킹을 조회합니다.
// @ts-check

import { NexonClient, toNexonDate } from 'nexon-open-api';

const apiKey = process.env['NEXON_MAPLESTORY_API_KEY']?.trim();
if (!apiKey) {
  console.error(
    '🏆 메이플스토리 API 키가 필요해요. .env에 NEXON_MAPLESTORY_API_KEY를 설정해 주세요.',
  );
  process.exitCode = 1;
} else {
  try {
    // 오늘 랭킹 집계 전에도 조회하도록 한국 시간으로 어제 날짜를 기본으로 사용합니다.
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const date = toNexonDate(process.argv[2] ?? yesterday, 9 * 60);
    const client = new NexonClient({ apiKey });
    const { ranking } = await client.maplestory.ranking.getOverall({ date, page: 1 });

    console.log(`🏆 메이플스토리 종합 랭킹 TOP 10 · ${date} (KST)`);
    if (ranking.length === 0) console.log('이 날짜의 랭킹이 비어 있어요.');
    for (const entry of ranking.slice(0, 10)) {
      const job = entry.sub_class_name || entry.class_name;
      console.log(
        `${entry.ranking}위 · ${entry.character_name} · Lv.${entry.character_level} ${job} (${entry.world_name})`,
      );
    }
    // 출력 예시: 1위 · 캐릭터명 · Lv.300 비숍 (스카니아)
  } catch {
    console.error(
      '🏆 종합 랭킹을 불러오지 못했어요. 조회일과 메이플스토리 API 키를 확인해 주세요.',
    );
    process.exitCode = 1;
  }
}
