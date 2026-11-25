// 디스코드 봇에서 캐릭터 조회에 실패했을 때 유저가 할 수 있는 일을 알려 줍니다.
// 실행: node --env-file=.env examples/error-handling.mjs "캐릭터명"
// 명령 끝에 YYYY-MM-DD를 넣으면 해당 날짜의 캐릭터 정보를 조회합니다.
// @ts-check

import {
  NexonAuthError,
  NexonBadRequestError,
  NexonClient,
  NexonDataNotReadyError,
  NexonMaintenanceError,
  NexonNotFoundError,
  NexonRateLimitError,
} from 'nexon-open-api';

/** @param {unknown} error */
function messageForPlayer(error) {
  if (error instanceof NexonNotFoundError) {
    return '캐릭터를 찾지 못했어요. 캐릭터명과 띄어쓰기를 확인해 주세요.';
  }
  if (error instanceof NexonBadRequestError) {
    // SDK가 넥슨에 보내기 전에 걸러 낸 입력 (빈 이름, 달력에 없는 날짜 등)
    return '캐릭터명과 날짜(예: 2026-11-01)를 다시 확인해 주세요.';
  }
  if (error instanceof NexonDataNotReadyError) {
    return '그날의 캐릭터 정보가 아직 준비되지 않았어요. 하루 전 날짜로 검색하거나 잠시 후 다시 검색해 주세요.';
  }
  if (error instanceof NexonMaintenanceError) {
    // 정기·임시 점검 중에는 NEXON Open API도 응답하지 않는다
    return '지금은 메이플스토리 점검 중이에요. 점검이 끝나면 다시 검색해 주세요.';
  }
  if (error instanceof NexonAuthError) {
    return '캐릭터 조회에 필요한 메이플스토리 API Key를 확인해야 해요. 봇 운영자에게 알려 주세요.';
  }
  if (error instanceof NexonRateLimitError) {
    return '한꺼번에 검색 요청이 많이 들어왔어요. 잠시 쉬었다가 다시 검색해 주세요.';
  }
  return '캐릭터 정보를 불러오지 못했어요. 잠시 뒤 다시 검색해 주세요.';
}

const apiKey = process.env['NEXON_MAPLESTORY_API_KEY']?.trim();
const characterName = process.argv[2]?.trim();
if (!apiKey || !characterName) {
  console.error(
    !apiKey
      ? '🍁 메이플스토리 API Key가 필요해요. .env에 NEXON_MAPLESTORY_API_KEY를 설정해 주세요.'
      : '🍁 실행 명령 끝에 조회할 캐릭터명을 적어 주세요.',
  );
  process.exitCode = 1;
} else {
  try {
    const client = new NexonClient({ apiKey });
    const ocid = await client.maplestory.getOcid(characterName);
    const date = process.argv[3];
    const basic = await client.maplestory.character.getBasic(date ? { ocid, date } : { ocid });
    console.log(`🍁 ${basic.character_name} · ${basic.world_name} · Lv.${basic.character_level}`);
  } catch (error) {
    console.error(`🍁 ${messageForPlayer(error)}`);
    process.exitCode = 1;
  }
}
// 출력 예시: 🍁 캐릭터를 찾지 못했어요. 캐릭터명과 띄어쓰기를 확인해 주세요.
