// 코디 카드: 캐릭터 외형 이미지(동작·표정 변경)와 캐시 장비, 헤어·성형·피부, 안드로이드를 한 장에 모읍니다.
// 실행: node --env-file=.env examples/maplestory-coordi-card.mjs "캐릭터명"
// @ts-check

import { NexonClient, NexonNotFoundError, characterImageUrl } from 'nexon-open-api';

/**
 * 헤어·성형의 색을 "검은색 + 빨간색 30%" 꼴로 만듭니다. 믹스 염색을 하지 않았으면 베이스 컬러만 나옵니다.
 * @param {{ base_color: string | null, mix_color: string | null, mix_rate: string }} info
 */
function formatColor(info) {
  if (!info.base_color) return '기본 색';
  return info.mix_color
    ? `${info.base_color} + ${info.mix_color} ${info.mix_rate}%`
    : info.base_color;
}

async function main() {
  const apiKey = process.env['NEXON_MAPLESTORY_API_KEY']?.trim();
  const characterName = process.argv[2]?.trim();
  if (!apiKey || !characterName) {
    console.error(
      !apiKey
        ? '🍁 메이플스토리 API Key가 필요해요. .env에 NEXON_MAPLESTORY_API_KEY를 설정해 주세요.'
        : '🍁 실행 명령 끝에 조회할 캐릭터명을 적어 주세요.',
    );
    process.exitCode = 1;
    return;
  }

  try {
    const client = new NexonClient({ apiKey });
    const ocid = await client.maplestory.getOcid(characterName);
    // 카드 한 장에 넥슨 서버 호출 5번(위 1번 + 아래 4번)입니다. 개발 단계의 초당 호출 허용량인 5건 이내입니다.
    const [basic, cash, beauty, android] = await Promise.all([
      client.maplestory.character.getBasic({ ocid }),
      client.maplestory.character.getCashItemEquipment({ ocid }),
      client.maplestory.character.getBeautyEquipment({ ocid }),
      client.maplestory.character.getAndroidEquipment({ ocid }),
    ]);

    console.log(`🍁 ${basic.character_name} · ${basic.world_name} · ${basic.character_class}`);

    // 외형 이미지 주소에 동작과 표정을 입힙니다. 서버를 다시 부르지 않고 주소만 만듭니다.
    console.log('\n[외형 이미지]');
    console.log(`기본        ${basic.character_image}`);
    console.log(
      `웃으며 점프 ${characterImageUrl(basic.character_image, { action: 'A06', emotion: 'E02' })}`,
    );
    console.log(`무기 빼고   ${characterImageUrl(basic.character_image, { wmotion: 'W04' })}`);
    // 걷기 1(A02)은 프레임이 0~3입니다. 네 장을 차례로 보여 주면 걷는 애니메이션이 됩니다.
    const walk = [0, 1, 2, 3].map((actionFrame) =>
      characterImageUrl(basic.character_image, { action: 'A02', actionFrame }),
    );
    console.log(`걷기 ${walk.length}프레임 ${walk[0]} …`);

    // 지금 입고 있는 캐시 장비입니다. 저장해 둔 코디 프리셋 1~3번은 따로 들어 있습니다.
    console.log(`\n[장착 중인 캐시 장비 · 적용 프리셋 ${cash.preset_no}번]`);
    for (const item of cash.cash_item_equipment_base) {
      // 장착 위치는 slot 입니다. part 는 아이템 종류라 반지처럼 여러 칸에 끼는 장비는 겹칩니다.
      const prism = item.cash_item_coloring_prism ? ' (컬러링프리즘)' : '';
      console.log(`${item.cash_item_equipment_slot}: ${item.cash_item_name}${prism}`);
    }
    const presets = [
      cash.cash_item_equipment_preset_1,
      cash.cash_item_equipment_preset_2,
      cash.cash_item_equipment_preset_3,
    ];
    console.log(`코디 프리셋 1~3번: ${presets.map((preset) => `${preset.length}개`).join(' · ')}`);

    console.log('\n[헤어·성형·피부]');
    const { character_hair: hair, character_face: face, character_skin: skin } = beauty;
    console.log(`헤어 ${hair.hair_name ?? '정보 없음'} (${formatColor(hair)})`);
    console.log(`성형 ${face.face_name ?? '정보 없음'} (${formatColor(face)})`);
    console.log(`피부 ${skin.skin_name}`);

    // 안드로이드를 장착하지 않은 캐릭터는 이 칸을 건너뜁니다.
    if (android.android_name) {
      console.log('\n[안드로이드]');
      console.log(`${android.android_name} · ${android.android_nickname}`);
      console.log(`헤어 ${android.android_hair.hair_name ?? '정보 없음'}`);
      console.log(`성형 ${android.android_face.face_name ?? '정보 없음'}`);
      for (const item of android.android_cash_item_equipment) {
        console.log(`${item.cash_item_equipment_slot}: ${item.cash_item_name}`);
      }
    }

    console.log('\nData based on NEXON Open API');
    // 출력 예시
    // 🍁 캐릭터명 · 스카니아 · 아크메이지(불,독)
    //
    // [외형 이미지]
    // 기본        https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG
    // 웃으며 점프 https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG?action=A06&emotion=E02
    // 무기 빼고   https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG?wmotion=W04
    //
    // [장착 중인 캐시 장비 · 적용 프리셋 1번]
    // 모자: 캐시 모자 이름 (컬러링프리즘)
    // 한벌옷: 캐시 한벌옷 이름
    // 코디 프리셋 1~3번: 6개 · 5개 · 0개
    //
    // [헤어·성형·피부]
    // 헤어 헤어 이름 (검은색 + 빨간색 30%)
  } catch (error) {
    console.error(
      error instanceof NexonNotFoundError
        ? '🍁 그런 캐릭터를 찾을 수 없어요. 캐릭터명을 다시 확인해 주세요.'
        : '🍁 코디 카드를 만들지 못했어요. 메이플스토리 API Key와 호출 허용량을 확인해 주세요.',
    );
    process.exitCode = 1;
  }
}

await main();
