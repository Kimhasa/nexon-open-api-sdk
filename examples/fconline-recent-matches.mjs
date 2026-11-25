// 전적 검색 봇에서 최근 EA SPORTS FC 온라인 공식경기 5판의 승·무·패와 스코어를 보여 줍니다.
// 실행: node --env-file=.env examples/fconline-recent-matches.mjs "닉네임"
// @ts-check

import { NexonClient } from 'nexon-open-api';

async function main() {
  const apiKey = process.env['NEXON_FC_ONLINE_API_KEY']?.trim();
  const nickname = process.argv[2]?.trim();
  if (!apiKey || !nickname) {
    console.error(
      !apiKey
        ? '⚽ EA SPORTS FC 온라인 API Key가 필요해요. .env에 NEXON_FC_ONLINE_API_KEY를 설정해 주세요.'
        : '⚽ 실행 명령 끝에 조회할 닉네임을 적어 주세요.',
    );
    process.exitCode = 1;
    return;
  }

  const client = new NexonClient({ apiKey });
  const ouid = await client.fcOnline.getOuid(nickname);
  const matchtype = 50; // 50 = 공식경기
  const [matchIds, matchTypes] = await Promise.all([
    client.fcOnline.getMatchList({ ouid, matchtype, limit: 5 }),
    client.fcOnline.getMatchTypeMeta(),
  ]);
  const matchNames = new Map(matchTypes.map(({ matchtype, desc }) => [matchtype, desc]));

  console.log(`⚽ ${nickname} · 최근 ${matchNames.get(matchtype) ?? '공식경기'}`);
  if (matchIds.length === 0) {
    console.log('최근 경기 기록이 없어요.');
    return;
  }

  const results = { 승: 0, 무: 0, 패: 0 };
  for (const matchId of matchIds) {
    const match = await client.fcOnline.getMatchDetail(matchId);
    const me = match.matchInfo.find((player) => player.ouid === ouid);
    const opponent = match.matchInfo.find((player) => player.ouid !== ouid);
    const result = me?.matchDetail?.matchResult;
    if (result === '승' || result === '무' || result === '패') results[result] += 1;

    // 경기 종료 화면에 표시되는 골 수를 내 스코어부터 적습니다.
    // 상대가 일찍 종료하면 상대 기록이 비어 있을 수 있습니다.
    const myGoals = me?.shoot?.goalTotalDisplay ?? '?';
    const opponentGoals = opponent?.shoot?.goalTotalDisplay ?? '?';
    const matchName = matchNames.get(match.matchType) ?? `매치 종류 ${match.matchType}`;
    console.log(
      `• ${matchName} · ${result ?? '결과 미확인'} ${myGoals}:${opponentGoals} · 상대 ${opponent?.nickname ?? '정보 없음'}`,
    );
  }
  console.log(`결과가 확인된 경기 · ${results.승}승 ${results.무}무 ${results.패}패`);
  // 출력 예시: • 공식경기 · 승 3:1 · 상대 닉네임
}

try {
  await main();
} catch {
  console.error(
    '⚽ 전적을 불러오지 못했어요. 닉네임과 EA SPORTS FC 온라인 API Key를 확인해 주세요.',
  );
  process.exitCode = 1;
}
