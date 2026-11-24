// require를 쓰는 기존 봇에서 메이플스토리 캐릭터의 월드와 레벨을 조회합니다.
// 실행: node --env-file=.env examples/commonjs.cjs "캐릭터명"
// @ts-check

const { NexonClient } = require('nexon-open-api');

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

  const client = new NexonClient({ apiKey });
  const ocid = await client.maplestory.getOcid(characterName);
  const basic = await client.maplestory.character.getBasic({ ocid });
  console.log(`🍁 ${basic.character_name} · ${basic.world_name} · Lv.${basic.character_level}`);
  // 출력 예시: 🍁 캐릭터명 · 스카니아 · Lv.275
}

main().catch(() => {
  console.error(
    '🍁 캐릭터 정보를 불러오지 못했어요. 캐릭터명과 메이플스토리 API 키를 확인해 주세요.',
  );
  process.exitCode = 1;
});
