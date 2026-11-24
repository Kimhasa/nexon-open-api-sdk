// 디스코드 봇에서 !정보 캐릭터명에 레벨, 전투력, 유니온 레벨이 담긴 카드로 답합니다.
// 실행: node --env-file=.env examples/maplestory-character-card.mjs "캐릭터명"
// @ts-check

import { NexonClient } from 'nexon-open-api';

async function main() {
  const apiKey = process.env['NEXON_MAPLESTORY_API_KEY']?.trim();
  const characterName = process.argv[2]?.trim();
  if (!apiKey || !characterName) {
    console.error(
      !apiKey
        ? '🍁 메이플스토리 API 키가 필요해요. .env에 NEXON_MAPLESTORY_API_KEY를 설정해 주세요.'
        : '🍁 실행 명령 끝에 조회할 캐릭터명을 적어 주세요.',
    );
    process.exitCode = 1;
    return;
  }

  try {
    const client = new NexonClient({ apiKey });
    // 캐릭터 이름으로 고유 번호(OCID)를 한 번 받아 세 조회에 사용합니다.
    const ocid = await client.maplestory.getOcid(characterName);
    const [basic, stats, union] = await Promise.all([
      client.maplestory.character.getBasic({ ocid }),
      client.maplestory.character.getStat({ ocid }),
      client.maplestory.union.getUnion({ ocid }),
    ]);

    // 종합 능력치(final_stat)에서 게임 화면의 전투력 항목을 찾습니다.
    const power = stats.final_stat.find(({ stat_name }) => stat_name === '전투력')?.stat_value;
    const combatPower =
      power && /^\d+$/.test(power) ? BigInt(power).toLocaleString('ko-KR') : power;

    console.log(`🍁 ${basic.character_name} · ${basic.world_name}`);
    console.log(`Lv.${basic.character_level} ${basic.character_class}`);
    console.log(`길드 ${basic.character_guild_name || '없음'}`);
    console.log(`전투력 ${combatPower ?? '정보 없음'} · 유니온 Lv.${union.union_level}`);
    // 출력 예시: 전투력 45,000,000 · 유니온 Lv.8000
  } catch {
    console.error(
      '🍁 캐릭터 카드를 만들지 못했어요. 캐릭터명과 메이플스토리 API 키를 확인해 주세요.',
    );
    process.exitCode = 1;
  }
}

await main();
