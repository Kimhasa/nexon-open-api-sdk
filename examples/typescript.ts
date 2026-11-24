// TypeScript 팬사이트에서 캐릭터 고유 번호와 응답 타입으로 프로필 한 줄을 만듭니다.
// 실행 (Node.js 24): node --env-file=.env examples/typescript.ts "캐릭터명"

import { NexonClient } from 'nexon-open-api';
import type { CharacterBasic, OCID } from 'nexon-open-api';

async function loadProfile(client: NexonClient, ocid: OCID): Promise<CharacterBasic> {
  return client.maplestory.character.getBasic({ ocid });
}

const apiKey = process.env['NEXON_MAPLESTORY_API_KEY']?.trim();
const characterName = process.argv[2]?.trim();
if (!apiKey || !characterName) {
  console.error(
    !apiKey
      ? '🍁 메이플스토리 API 키가 필요해요. .env에 NEXON_MAPLESTORY_API_KEY를 설정해 주세요.'
      : '🍁 실행 명령 끝에 조회할 캐릭터명을 적어 주세요.',
  );
  process.exitCode = 1;
} else {
  try {
    const client = new NexonClient({ apiKey });
    // 캐릭터마다 붙는 고유 번호(OCID)를 이름으로 찾습니다.
    // loadProfile에 캐릭터명이나 길드 고유 번호를 넘기면 에디터에서 타입 오류를 확인할 수 있습니다.
    const ocid = await client.maplestory.getOcid(characterName);
    const profile = await loadProfile(client, ocid);
    console.log(
      `🍁 ${profile.character_name} · ${profile.world_name} · Lv.${profile.character_level} ${profile.character_class}`,
    );
    // 출력 예시: 🍁 캐릭터명 · 스카니아 · Lv.275 비숍
  } catch {
    console.error('🍁 프로필을 불러오지 못했어요. 캐릭터명과 메이플스토리 API 키를 확인해 주세요.');
    process.exitCode = 1;
  }
}
