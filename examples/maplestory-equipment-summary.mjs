// 환산 계산기·스펙 비교 도구의 재료: 장착 장비의 스타포스, 장비 옵션 합계, 잠재능력 합계를 뽑습니다.
// 실행: node --env-file=.env examples/maplestory-equipment-summary.mjs "캐릭터명"
// @ts-check

import {
  NexonClient,
  NexonNotFoundError,
  getItemStarforce,
  sumItemTotalOptions,
  summarizeItemOptions,
} from 'nexon-open-api';

/**
 * 합계 한 줄을 "STR +33%" 꼴로 만듭니다.
 * @param {import('nexon-open-api').MapleItemOptionTotal} option
 */
function formatTotal(option) {
  const prefix = option.perLevel ? `캐릭터 기준 ${option.perLevel}레벨 당 ` : '';
  const sign = option.total < 0 ? '' : '+';
  return `${prefix}${option.name} ${sign}${option.total}${option.unit}`;
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
    // 넥슨 서버 호출은 이 두 번뿐입니다. 합산은 모두 받은 응답 안에서 계산합니다.
    const ocid = await client.maplestory.getOcid(characterName);
    const equip = await client.maplestory.character.getItemEquipment({ ocid });
    const items = equip.item_equipment;

    // 스타포스는 "22" 같은 문자열로 옵니다. 숫자로 바꿔 더합니다.
    const stars = items.reduce((sum, item) => sum + getItemStarforce(item), 0);
    console.log(`🍁 ${characterName} · 장착 장비 ${items.length}개 · 스타포스 합계 ${stars}성`);

    // 장비 옵션(기본 + 추가 옵션 + 주문서 + 스타포스)의 합계
    const total = sumItemTotalOptions(items);
    const flame = sumItemTotalOptions(items, 'item_add_option');
    console.log('\n[장비 옵션 합계]');
    console.log(`STR ${total.str} · DEX ${total.dex} · INT ${total.int} · LUK ${total.luk}`);
    console.log(`공격력 ${total.attack_power} · 마력 ${total.magic_power}`);
    console.log(`올스탯 ${total.all_stat}% · 보스 데미지 ${total.boss_damage}%`);
    console.log(`그중 추가 옵션: 공격력 ${flame.attack_power} · 올스탯 ${flame.all_stat}%`);

    // 잠재능력과 에디셔널 잠재능력은 따로 합산됩니다.
    const { potential, additional, leftovers } = summarizeItemOptions(items);
    console.log('\n[잠재능력 합계]');
    for (const option of potential) console.log(formatTotal(option));
    console.log('\n[에디셔널 잠재능력 합계]');
    for (const option of additional) console.log(formatTotal(option));

    // 수치로 합칠 수 없는 줄(확률 발동 효과, 새로 생긴 옵션)도 버리지 않고 보여 줍니다.
    if (leftovers.length > 0) {
      console.log('\n[합산하지 않은 옵션]');
      for (const { item_name, raw } of leftovers) console.log(`${item_name ?? '장비'}: ${raw}`);
    }

    console.log('\nData based on NEXON Open API');
    // 출력 예시
    // 🍁 캐릭터명 · 장착 장비 24개 · 스타포스 합계 330성
    //
    // [장비 옵션 합계]
    // STR 2150 · DEX 1480 · INT 320 · LUK 310
    // 공격력 1850 · 마력 420
    // 올스탯 96% · 보스 데미지 60%
    // 그중 추가 옵션: 공격력 180 · 올스탯 78%
    //
    // [잠재능력 합계]
    // STR +285%
    // 보스 몬스터 데미지 +110%
    // 몬스터 방어율 무시 +70%
    // ...
  } catch (error) {
    console.error(
      error instanceof NexonNotFoundError
        ? '🍁 그런 캐릭터를 찾을 수 없어요. 캐릭터명을 다시 확인해 주세요.'
        : '🍁 장비 정보를 가져오지 못했어요. 메이플스토리 API Key와 호출 허용량을 확인해 주세요.',
    );
    process.exitCode = 1;
  }
}

await main();
