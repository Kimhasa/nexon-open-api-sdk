// 길드 디스코드에서 서버별 거대한 외침의 뿔피리 메시지를 최근 5개까지 보여 줍니다.
// 실행: node --env-file=.env examples/mabinogi-horn-bugle.mjs "류트"
// @ts-check

import { NexonClient } from 'nexon-open-api';

async function main() {
  const apiKey = process.env['NEXON_MABINOGI_API_KEY']?.trim();
  if (!apiKey) {
    console.error('📣 마비노기 API Key가 필요해요. .env에 NEXON_MABINOGI_API_KEY를 설정해 주세요.');
    process.exitCode = 1;
    return;
  }

  const server = process.argv[2]?.trim() ?? '류트';
  if (server !== '류트' && server !== '만돌린' && server !== '하프' && server !== '울프') {
    console.error('📣 서버 이름은 류트, 만돌린, 하프, 울프 중에서 골라 주세요.');
    process.exitCode = 1;
    return;
  }

  const client = new NexonClient({ apiKey });
  const { horn_bugle_world_history: messages } =
    await client.mabinogi.hornBugleWorld.getHistory(server);
  // 최근 1시간에 서버 전체 채널로 보낸 외침을 최신순으로 보여 줍니다.
  const recentMessages = messages
    .map((entry) => ({ ...entry, sentAt: Date.parse(entry.date_send) }))
    .sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0))
    .slice(0, 5);
  const time = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  console.log(`📣 ${server} · 거대한 외침의 뿔피리 (KST)`);
  if (recentMessages.length === 0) console.log('최근 1시간에 올라온 메시지가 없어요.');
  for (const { sentAt, character_name, message } of recentMessages) {
    const sentTime = Number.isFinite(sentAt) ? time.format(sentAt) : '시각 미확인';
    console.log(`• ${sentTime} · ${character_name} — ${message}`);
  }
  // 출력 예시: • 21:05 · 캐릭터명 — 던전 같이 가실 분 구해요!
}

try {
  await main();
} catch {
  console.error('📣 뿔피리 메시지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
  process.exitCode = 1;
}
