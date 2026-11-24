import { describe, it, expect } from 'vitest';
import * as root from '../../../src/index.js';
import * as subPath from '../../../src/games/maplestory/index.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import {
  MAPLE_CHARACTER_ACTIONS,
  MAPLE_CHARACTER_EMOTIONS,
  MAPLE_WEAPON_MOTIONS,
  characterImageUrl,
} from '../../../src/games/maplestory/helpers/character-image.js';
import type {
  MapleCharacterAction,
  MapleCharacterEmotion,
  MapleCharacterImageOptions,
  MapleWeaponMotion,
} from '../../../src/games/maplestory/helpers/character-image.js';
import {
  getItemStarforce,
  parseItemOption,
  sumItemTotalOptions,
  summarizeItemOptions,
} from '../../../src/games/maplestory/helpers/item-options.js';
import { characterItemEquipmentFixture } from '../../fixtures/maplestory/character.fixture.js';

const LOOK = 'https://open.api.nexon.com/static/maplestory/character/look/ABCDEFG';

function expectBadRequest(run: () => unknown, ...fragments: string[]): void {
  let caught: unknown;
  try {
    run();
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(NexonBadRequestError);
  const error = caught as NexonBadRequestError;
  expect(error.code).toBe('OPENAPI00004');
  for (const fragment of fragments) expect(error.message).toContain(fragment);
}

describe('characterImageUrl — 캐릭터 외형 이미지 주소', () => {
  it('넥슨 안내의 예시 주소를 만든다', () => {
    expect(characterImageUrl(LOOK, { action: 'A00', actionFrame: 2, emotion: 'E00' })).toBe(
      `${LOOK}?action=A00.2&emotion=E00`,
    );
  });

  it('동작·감정표현·무기 모션을 각각 붙인다', () => {
    expect(characterImageUrl(LOOK, { action: 'A06' })).toBe(`${LOOK}?action=A06`);
    expect(characterImageUrl(LOOK, { emotion: 'E06', emotionFrame: 1 })).toBe(
      `${LOOK}?emotion=E06.1`,
    );
    expect(characterImageUrl(LOOK, { wmotion: 'W04' })).toBe(`${LOOK}?wmotion=W04`);
    expect(
      characterImageUrl(LOOK, {
        action: 'A31',
        actionFrame: 4,
        emotion: 'E24',
        emotionFrame: 1,
        wmotion: 'W03',
      }),
    ).toBe(`${LOOK}?action=A31.4&emotion=E24.1&wmotion=W03`);
  });

  it('바꿀 것이 없으면 받은 주소를 그대로 돌려준다', () => {
    expect(characterImageUrl(LOOK)).toBe(LOOK);
    expect(characterImageUrl(`${LOOK}?action=A05`, {})).toBe(`${LOOK}?action=A05`);
    expect(characterImageUrl(LOOK, { action: undefined, wmotion: undefined })).toBe(LOOK);
  });

  it('기존 쿼리는 남기고 같은 항목만 바꾼다', () => {
    expect(characterImageUrl(`${LOOK}?action=A00.2&emotion=E00`, { action: 'A06' })).toBe(
      `${LOOK}?action=A06&emotion=E00`,
    );
    expect(characterImageUrl(`${LOOK}?foo=bar`, { emotion: 'E02' })).toBe(
      `${LOOK}?foo=bar&emotion=E02`,
    );
    expect(characterImageUrl(`${LOOK}?wmotion=W01#top`, { wmotion: 'W02', action: 'A07' })).toBe(
      `${LOOK}?wmotion=W02&action=A07#top`,
    );
  });

  it('모든 코드의 프레임 0과 마지막 프레임을 받고, 그다음 프레임은 거절한다', () => {
    for (const { code, maxFrame } of MAPLE_CHARACTER_ACTIONS) {
      expect(characterImageUrl(LOOK, { action: code, actionFrame: 0 })).toBe(
        `${LOOK}?action=${code}.0`,
      );
      expect(characterImageUrl(LOOK, { action: code, actionFrame: maxFrame })).toBe(
        `${LOOK}?action=${code}.${maxFrame}`,
      );
      expectBadRequest(
        () => characterImageUrl(LOOK, { action: code, actionFrame: maxFrame + 1 }),
        code,
      );
    }
    for (const { code, maxFrame } of MAPLE_CHARACTER_EMOTIONS) {
      expect(characterImageUrl(LOOK, { emotion: code, emotionFrame: maxFrame })).toBe(
        `${LOOK}?emotion=${code}.${maxFrame}`,
      );
      expectBadRequest(
        () => characterImageUrl(LOOK, { emotion: code, emotionFrame: maxFrame + 1 }),
        code,
      );
    }
    for (const { code } of MAPLE_WEAPON_MOTIONS) {
      expect(characterImageUrl(LOOK, { wmotion: code })).toBe(`${LOOK}?wmotion=${code}`);
    }
  });

  it('프레임 범위를 벗어나면 허용 범위를 안내한다', () => {
    expectBadRequest(
      () => characterImageUrl(LOOK, { action: 'A00', actionFrame: 3 }),
      'actionFrame',
      '0 ~ 2',
    );
    expectBadRequest(
      () => characterImageUrl(LOOK, { action: 'A06', actionFrame: 1 }),
      '프레임이 0 하나뿐',
    );
    expectBadRequest(() => characterImageUrl(LOOK, { action: 'A02', actionFrame: -1 }), '0 ~ 3');
    expectBadRequest(() => characterImageUrl(LOOK, { action: 'A02', actionFrame: 1.5 }), '0 ~ 3');
    expectBadRequest(
      () => characterImageUrl(LOOK, { emotion: 'E06', emotionFrame: 3 }),
      'emotionFrame',
      '0 ~ 2',
    );
  });

  it('넥슨 안내에 없는 코드는 범위를 안내하며 거절한다', () => {
    expectBadRequest(
      () => characterImageUrl(LOOK, { action: 'A42' as MapleCharacterAction }),
      'A42',
      'A00 ~ A41',
    );
    expectBadRequest(
      () => characterImageUrl(LOOK, { emotion: 'E25' as MapleCharacterEmotion }),
      'E25',
      'E00 ~ E24',
    );
    expectBadRequest(
      () => characterImageUrl(LOOK, { wmotion: 'W05' as MapleWeaponMotion }),
      'W05',
      'W00 ~ W04',
    );
    expectBadRequest(
      () => characterImageUrl(LOOK, { action: 'A00.2' as MapleCharacterAction }),
      'A00 ~ A41',
    );
  });

  it('코드 없이 프레임만 넣으면 함께 넣으라고 안내한다', () => {
    expectBadRequest(() => characterImageUrl(LOOK, { actionFrame: 1 }), 'actionFrame', 'action');
    expectBadRequest(() => characterImageUrl(LOOK, { emotionFrame: 0 }), 'emotionFrame', 'emotion');
  });

  it('주소가 올바르지 않으면 character_image 를 넣으라고 안내한다', () => {
    expectBadRequest(() => characterImageUrl('', { action: 'A00' }), 'character_image');
    expectBadRequest(() => characterImageUrl('look/ABCDEFG', { action: 'A00' }), 'character_image');
    expectBadRequest(
      () => characterImageUrl(null as unknown as string, { action: 'A00' }),
      'character_image',
    );
  });

  it('코드 표는 넥슨 안내의 범위와 개수 그대로다', () => {
    expect(MAPLE_CHARACTER_ACTIONS.map(({ code }) => code)).toEqual(
      Array.from({ length: 42 }, (_, i) => `A${String(i).padStart(2, '0')}`),
    );
    expect(MAPLE_CHARACTER_EMOTIONS.map(({ code }) => code)).toEqual(
      Array.from({ length: 25 }, (_, i) => `E${String(i).padStart(2, '0')}`),
    );
    expect(MAPLE_WEAPON_MOTIONS.map(({ code }) => code)).toEqual([
      'W00',
      'W01',
      'W02',
      'W03',
      'W04',
    ]);
    // 스펙 표에서 뽑은 경계값 표본
    const frames = Object.fromEntries(
      [...MAPLE_CHARACTER_ACTIONS, ...MAPLE_CHARACTER_EMOTIONS].map((item) => [
        `${item.code}:${item.name}`,
        item.maxFrame,
      ]),
    );
    expect(frames).toMatchObject({
      'A00:stand1': 2,
      'A02:walk1': 3,
      'A04:prone': 0,
      'A06:jump': 0,
      'A16:swingOF': 3,
      'A24:stabO1': 1,
      'A31:shoot2': 4,
      'A33:dead': 0,
      'A41:ghostsit': 0,
      'E00:default': 0,
      'E02:smile': 0,
      'E06:blink': 2,
      'E07:blaze': 1,
      'E21:qBlue': 0,
      'E24:vomit': 1,
    });
    for (const item of [...MAPLE_CHARACTER_ACTIONS, ...MAPLE_CHARACTER_EMOTIONS]) {
      expect(item.label).not.toBe('');
    }
  });

  it('옵션 타입에 리터럴 코드를 그대로 쓸 수 있다', () => {
    const options: MapleCharacterImageOptions = { action: 'A41', emotion: 'E24', wmotion: 'W00' };
    expect(characterImageUrl(LOOK, options)).toBe(`${LOOK}?action=A41&emotion=E24&wmotion=W00`);
  });
});

// 2026-11-25 실제 응답에서 모은 잠재능력·에디셔널 잠재능력 문구 151종 (게임 공통 문구)
const REAL_OPTION_TEXTS = `35% 확률로 받은 피해의 50%를 반사
DEX +1%
DEX +18
DEX +2%
DEX +5
DEX +6
DEX +6%
DEX +8
DEX +9%
HP 회복 아이템 및 회복 스킬 효율 +30%
INT +1%
INT +10
INT +10%
INT +12%
INT +13%
INT +14
INT +18
INT +2%
INT +3%
INT +4%
INT +5
INT +5%
INT +6
INT +6%
INT +7%
INT +8%
INT +9%
LUK +1%
LUK +10
LUK +10%
LUK +12%
LUK +13%
LUK +18
LUK +19
LUK +3%
LUK +5
LUK +6
LUK +6%
LUK +7%
LUK +8
LUK +8%
LUK +9%
STR +10
STR +10%
STR +12
STR +12%
STR +13%
STR +19
STR +2%
STR +6
STR +6%
STR +7%
STR +8
STR +8%
STR +9%
공격 시 2% 확률로 오토스틸
공격 시 7% 확률로 오토스틸
공격력 +10
공격력 +10%
공격력 +11
공격력 +12%
공격력 +13%
공격력 +14
공격력 +15
공격력 +16
공격력 +2
공격력 +3
공격력 +6
공격력 +8
공격력 +9%
데미지 +10%
데미지 +9%
마력 +10
마력 +10%
마력 +11
마력 +12%
마력 +13%
마력 +14
마력 +16
마력 +17
마력 +2
마력 +3
마력 +6
마력 +8
마력 +9%
메소 획득량 +20%
모든 스킬의 MP 소모 -20%
몬스터 방어율 무시 +40%
방어력 +125
방어력 +2%
방어력 +5%
방어력 +50
방어력 +60
방어력 +7%
방어력 +9%
보스 몬스터 데미지 +12%
보스 몬스터 데미지 +14%
보스 몬스터 데미지 +30%
보스 몬스터 데미지 +35%
보스 몬스터 데미지 +40%
스킬 재사용 대기시간 -1초
스킬 재사용 대기시간 -2초
아이템 드롭률 +20%
아이템 드롭률 +4%
올스탯 +10%
올스탯 +2%
올스탯 +3
올스탯 +5%
올스탯 +6%
올스탯 +7%
올스탯 +9%
이동속도 +3
이동속도 +4
이동속도 +5
이동속도 +6
이동속도 +8
점프력 +3
점프력 +4
점프력 +6
최대 HP +10%
최대 HP +100
최대 HP +180
최대 HP +2%
최대 HP +40
최대 HP +50
최대 HP +7%
최대 HP +8%
최대 HP +9%
최대 MP +100
최대 MP +12%
최대 MP +135
최대 MP +180
최대 MP +2%
최대 MP +3%
최대 MP +40
최대 MP +45
최대 MP +50
최대 MP +60
최대 MP +9%
캐릭터 기준 9레벨 당 DEX +1
캐릭터 기준 9레벨 당 DEX +2
캐릭터 기준 9레벨 당 INT +1
캐릭터 기준 9레벨 당 INT +2
캐릭터 기준 9레벨 당 LUK +1
캐릭터 기준 9레벨 당 LUK +2
캐릭터 기준 9레벨 당 STR +1
캐릭터 기준 9레벨 당 STR +2
크리티컬 데미지 +3%
크리티컬 데미지 +8%
피격 시 10% 확률로 데미지의 20% 무시
피격 시 5% 확률로 데미지의 40% 무시`.split('\n');

const REAL_STAT_NAMES = [
  'DEX',
  'HP 회복 아이템 및 회복 스킬 효율',
  'INT',
  'LUK',
  'STR',
  '공격력',
  '데미지',
  '마력',
  '메소 획득량',
  '모든 스킬의 MP 소모',
  '몬스터 방어율 무시',
  '방어력',
  '보스 몬스터 데미지',
  '스킬 재사용 대기시간',
  '아이템 드롭률',
  '올스탯',
  '이동속도',
  '점프력',
  '최대 HP',
  '최대 MP',
  '크리티컬 데미지',
];

describe('parseItemOption — 잠재능력 한 줄 읽기', () => {
  it('옵션명 +값 꼴을 이름·수치·단위로 나눈다', () => {
    expect(parseItemOption('STR +12%')).toEqual({
      kind: 'stat',
      raw: 'STR +12%',
      name: 'STR',
      value: 12,
      unit: '%',
    });
    expect(parseItemOption('보스 몬스터 데미지 +40%')).toMatchObject({
      kind: 'stat',
      name: '보스 몬스터 데미지',
      value: 40,
      unit: '%',
    });
    expect(parseItemOption('방어력 +125')).toMatchObject({ name: '방어력', value: 125, unit: '' });
    expect(parseItemOption('HP 회복 아이템 및 회복 스킬 효율 +30%')).toMatchObject({
      name: 'HP 회복 아이템 및 회복 스킬 효율',
      value: 30,
      unit: '%',
    });
  });

  it('감소 옵션은 음수로, 초 단위는 unit 으로 돌려준다', () => {
    expect(parseItemOption('스킬 재사용 대기시간 -2초')).toEqual({
      kind: 'stat',
      raw: '스킬 재사용 대기시간 -2초',
      name: '스킬 재사용 대기시간',
      value: -2,
      unit: '초',
    });
    expect(parseItemOption('모든 스킬의 MP 소모 -20%')).toMatchObject({
      name: '모든 스킬의 MP 소모',
      value: -20,
      unit: '%',
    });
  });

  it('레벨 비례 옵션은 스탯 이름과 perLevel 로 나눈다', () => {
    expect(parseItemOption('캐릭터 기준 9레벨 당 DEX +1')).toEqual({
      kind: 'stat',
      raw: '캐릭터 기준 9레벨 당 DEX +1',
      name: 'DEX',
      value: 1,
      unit: '',
      perLevel: 9,
    });
  });

  it('문장형 확률 효과는 나누지 않고 원문으로 남긴다', () => {
    for (const raw of [
      '피격 시 10% 확률로 데미지의 20% 무시',
      '공격 시 7% 확률로 오토스틸',
      '35% 확률로 받은 피해의 50%를 반사',
    ]) {
      expect(parseItemOption(raw)).toEqual({
        kind: 'effect',
        raw,
        name: undefined,
        value: undefined,
        unit: undefined,
      });
    }
  });

  it('모르는 표기는 예외 없이 unknown 과 원문으로 남긴다', () => {
    for (const raw of ['<쓸만한 샤프 아이즈> 스킬 사용 가능', '새로 생긴 옵션', '+', '12%']) {
      expect(parseItemOption(raw)).toEqual({
        kind: 'unknown',
        raw,
        name: undefined,
        value: undefined,
        unit: undefined,
      });
    }
  });

  it('옵션이 없는 칸(null·undefined·빈 문자열)은 null 이다', () => {
    expect(parseItemOption(null)).toBeNull();
    expect(parseItemOption(undefined)).toBeNull();
    expect(parseItemOption('')).toBeNull();
    expect(parseItemOption('   ')).toBeNull();
    expect(parseItemOption(12 as unknown as string)).toBeNull();
  });

  it('공백·콜론 변형과 괄호 설명도 받는다', () => {
    expect(parseItemOption('STR : +12%')).toMatchObject({ name: 'STR', value: 12, unit: '%' });
    expect(parseItemOption('STR: +12%')).toMatchObject({ name: 'STR', value: 12, unit: '%' });
    expect(parseItemOption('STR:12%')).toMatchObject({ name: 'STR', value: 12, unit: '%' });
    expect(parseItemOption('  STR  +12 % ')).toMatchObject({
      raw: '  STR  +12 % ',
      name: 'STR',
      value: 12,
      unit: '%',
    });
    expect(parseItemOption('STR+12%')).toMatchObject({ name: 'STR', value: 12, unit: '%' });
    expect(parseItemOption('최대 HP +1,200')).toMatchObject({ name: '최대 HP', value: 1200 });
    expect(parseItemOption('크리티컬 확률 +1.5%')).toMatchObject({ value: 1.5, unit: '%' });
    expect(parseItemOption('캐릭터 기준 9레벨 당 STR : +2')).toMatchObject({
      name: 'STR',
      value: 2,
      perLevel: 9,
    });
    expect(
      parseItemOption(
        '모든 스킬의 재사용 대기시간 : -2초(10초 이하는 10%감소, 5초 미만으로 감소 불가)',
      ),
    ).toEqual({
      kind: 'stat',
      raw: '모든 스킬의 재사용 대기시간 : -2초(10초 이하는 10%감소, 5초 미만으로 감소 불가)',
      name: '모든 스킬의 재사용 대기시간',
      value: -2,
      unit: '초',
      note: '10초 이하는 10%감소, 5초 미만으로 감소 불가',
    });
  });

  it('실제 문구 151종을 모두 수치형 또는 효과형으로 분류한다', () => {
    expect(REAL_OPTION_TEXTS).toHaveLength(151);
    const names = new Set<string>();
    const effects: string[] = [];

    for (const raw of REAL_OPTION_TEXTS) {
      const option = parseItemOption(raw);
      expect(option?.raw).toBe(raw);
      if (option?.kind === 'stat') {
        expect(Number.isFinite(option.value)).toBe(true);
        expect(['%', '초', '']).toContain(option.unit);
        names.add(option.name ?? '');
        // 수치형은 이름·부호·수치·단위를 다시 이으면 원문이 된다
        const sign = (option.value ?? 0) < 0 ? '-' : '+';
        const prefix = option.perLevel ? `캐릭터 기준 ${option.perLevel}레벨 당 ` : '';
        expect(`${prefix}${option.name} ${sign}${Math.abs(option.value ?? 0)}${option.unit}`).toBe(
          raw,
        );
      } else {
        expect(option?.kind).toBe('effect');
        effects.push(raw);
      }
    }

    expect([...names].sort()).toEqual([...REAL_STAT_NAMES].sort());
    expect(effects).toEqual([
      '35% 확률로 받은 피해의 50%를 반사',
      '공격 시 2% 확률로 오토스틸',
      '공격 시 7% 확률로 오토스틸',
      '피격 시 10% 확률로 데미지의 20% 무시',
      '피격 시 5% 확률로 데미지의 40% 무시',
    ]);
  });
});

describe('summarizeItemOptions — 잠재능력 합산', () => {
  const items = [
    {
      item_name: '모자',
      potential_option_1: 'STR +12%',
      potential_option_2: 'STR +9%',
      potential_option_3: '캐릭터 기준 9레벨 당 STR +2',
      additional_potential_option_1: 'STR +18',
      additional_potential_option_2: '공격력 +11',
      additional_potential_option_3: null,
    },
    {
      item_name: '무기',
      potential_option_1: '보스 몬스터 데미지 +40%',
      potential_option_2: '몬스터 방어율 무시 +40%',
      potential_option_3: '몬스터 방어율 무시 +30%',
      additional_potential_option_1: '공격력 +12%',
      additional_potential_option_2: '공격력 +14',
      additional_potential_option_3: '캐릭터 기준 9레벨 당 STR +1',
    },
    {
      item_name: '장갑',
      potential_option_1: '크리티컬 데미지 +8%',
      potential_option_2: '공격 시 7% 확률로 오토스틸',
      potential_option_3: 'STR +12%',
      additional_potential_option_1: '새로 생긴 옵션',
      additional_potential_option_2: null,
      additional_potential_option_3: null,
    },
    // 잠재능력이 없는 장비
    {
      item_name: '훈장',
      potential_option_1: null,
      potential_option_2: null,
      potential_option_3: null,
      additional_potential_option_1: null,
      additional_potential_option_2: null,
      additional_potential_option_3: null,
    },
  ];

  it('잠재능력과 에디셔널을 따로, 같은 이름·단위끼리 합친다', () => {
    const summary = summarizeItemOptions(items);

    expect(summary.potential).toEqual([
      { name: 'STR', unit: '%', values: [12, 9, 12], total: 33 },
      { name: 'STR', unit: '', perLevel: 9, values: [2], total: 2 },
      { name: '보스 몬스터 데미지', unit: '%', values: [40], total: 40 },
      { name: '몬스터 방어율 무시', unit: '%', values: [40, 30], total: 70 },
      { name: '크리티컬 데미지', unit: '%', values: [8], total: 8 },
    ]);
    expect(summary.additional).toEqual([
      { name: 'STR', unit: '', values: [18], total: 18 },
      { name: '공격력', unit: '', values: [11, 14], total: 25 },
      { name: '공격력', unit: '%', values: [12], total: 12 },
      { name: 'STR', unit: '', perLevel: 9, values: [1], total: 1 },
    ]);
  });

  it('합치지 못한 줄은 버리지 않고 원문·출처·장비 이름과 함께 남긴다', () => {
    expect(summarizeItemOptions(items).leftovers).toEqual([
      {
        raw: '공격 시 7% 확률로 오토스틸',
        kind: 'effect',
        source: 'potential',
        item_name: '장갑',
      },
      { raw: '새로 생긴 옵션', kind: 'unknown', source: 'additional', item_name: '장갑' },
    ]);
  });

  it('빈 목록과 옵션 필드가 없는 장비도 받는다', () => {
    expect(summarizeItemOptions([])).toEqual({ potential: [], additional: [], leftovers: [] });
    expect(summarizeItemOptions([{}, { potential_option_1: undefined }])).toEqual({
      potential: [],
      additional: [],
      leftovers: [],
    });
  });

  it('소수 합계에 부동소수 오차가 드러나지 않는다', () => {
    const summary = summarizeItemOptions([
      { potential_option_1: '크리티컬 확률 +0.1%', potential_option_2: '크리티컬 확률 +0.2%' },
    ]);
    expect(summary.potential[0]?.total).toBe(0.3);
  });

  it('getItemEquipment() 응답의 장비 목록을 그대로 받는다', () => {
    const equipment = characterItemEquipmentFixture;
    const summary = summarizeItemOptions(equipment.item_equipment);
    const lines = equipment.item_equipment.flatMap((item) => [
      item.potential_option_1,
      item.potential_option_2,
      item.potential_option_3,
      item.additional_potential_option_1,
      item.additional_potential_option_2,
      item.additional_potential_option_3,
    ]);
    const counted =
      [...summary.potential, ...summary.additional].reduce((n, o) => n + o.values.length, 0) +
      summary.leftovers.length;
    expect(counted).toBe(lines.filter((line) => line !== null).length);

    // 프리셋 장비, 에반 드래곤 장비도 같은 함수에 넣을 수 있다
    expect(() => summarizeItemOptions(equipment.item_equipment_preset_1)).not.toThrow();
    expect(() => summarizeItemOptions(equipment.dragon_equipment)).not.toThrow();
  });
});

describe('sumItemTotalOptions — 장비 옵션 숫자 합산', () => {
  const option = (overrides: Record<string, string | number>): Record<string, string | number> => ({
    str: '0',
    dex: '0',
    attack_power: '0',
    ...overrides,
  });

  it('문자열 숫자를 숫자로 바꿔 더한다', () => {
    const sum = sumItemTotalOptions([
      { item_total_option: option({ str: '150', attack_power: '85', boss_damage: '30' }) },
      { item_total_option: option({ str: '150', all_stat: '6', boss_damage: '10' }) },
    ]);
    expect(sum.str).toBe(300);
    expect(sum.attack_power).toBe(85);
    expect(sum.boss_damage).toBe(40);
    expect(sum.all_stat).toBe(6);
  });

  it('장비에 없는 항목도 0 으로 채운다', () => {
    const sum = sumItemTotalOptions([]);
    expect(sum).toEqual({
      str: 0,
      dex: 0,
      int: 0,
      luk: 0,
      max_hp: 0,
      max_mp: 0,
      attack_power: 0,
      magic_power: 0,
      armor: 0,
      speed: 0,
      jump: 0,
      boss_damage: 0,
      ignore_monster_armor: 0,
      all_stat: 0,
      damage: 0,
      max_hp_rate: 0,
      max_mp_rate: 0,
    });
  });

  it('숫자 필드, 쉼표, 모르는 새 항목을 더하고 읽을 수 없는 값은 건너뛴다', () => {
    const sum = sumItemTotalOptions([
      {
        item_total_option: {
          max_hp: '1,200',
          equipment_level_decrease: 5,
          new_stat: '7',
          str: '',
          dex: 'abc',
          int: null,
          luk: ' 12 ',
          damage: '1.5',
        },
      },
      { item_total_option: { max_hp: '300', equipment_level_decrease: 5, new_stat: '3' } },
      { item_total_option: null },
      {},
    ]);
    expect(sum.max_hp).toBe(1500);
    expect(sum['equipment_level_decrease']).toBe(10);
    expect(sum['new_stat']).toBe(10);
    expect(sum.str).toBe(0);
    expect(sum.dex).toBe(0);
    expect(sum.int).toBe(0);
    expect(sum.luk).toBe(12);
    expect(sum.damage).toBe(1.5);
  });

  it('source 로 추가 옵션·스타포스 옵션 등 다른 묶음을 고른다', () => {
    const items = [
      {
        item_total_option: option({ str: '100' }),
        item_add_option: option({ str: '40' }),
        item_starforce_option: option({ str: '30' }),
      },
      {
        item_total_option: option({ str: '100' }),
        item_add_option: option({ str: '25' }),
        item_starforce_option: option({ str: '0' }),
      },
    ];
    expect(sumItemTotalOptions(items).str).toBe(200);
    expect(sumItemTotalOptions(items, 'item_add_option').str).toBe(65);
    expect(sumItemTotalOptions(items, 'item_starforce_option').str).toBe(30);
    expect(sumItemTotalOptions(items, 'item_base_option').str).toBe(0);
  });

  it('getItemEquipment() 응답의 장비 목록을 그대로 받는다', () => {
    const { item_equipment: equipment } = characterItemEquipmentFixture;
    const expected = equipment.reduce((n, item) => n + Number(item.item_total_option.str), 0);
    expect(sumItemTotalOptions(equipment).str).toBe(expected);
    expect(sumItemTotalOptions(equipment, 'item_exceptional_option').str).toBe(
      equipment.reduce((n, item) => n + Number(item.item_exceptional_option.str), 0),
    );
  });
});

describe('getItemStarforce — 스타포스 별 개수', () => {
  it('문자열 숫자를 숫자로 바꾼다', () => {
    expect(getItemStarforce({ starforce: '22' })).toBe(22);
    expect(getItemStarforce({ starforce: '0' })).toBe(0);
    expect(getItemStarforce({ starforce: 17 })).toBe(17);
  });

  it('읽을 수 없는 값은 0 이다', () => {
    expect(getItemStarforce({ starforce: '' })).toBe(0);
    expect(getItemStarforce({ starforce: null })).toBe(0);
    expect(getItemStarforce({})).toBe(0);
    expect(getItemStarforce({ starforce: '별' })).toBe(0);
  });

  it('getItemEquipment() 응답의 장비를 그대로 받는다', () => {
    const [item] = characterItemEquipmentFixture.item_equipment;
    expect(item && getItemStarforce(item)).toBe(Number(item?.starforce));
  });
});

describe('도우미 공개 export', () => {
  const names = [
    'characterImageUrl',
    'MAPLE_CHARACTER_ACTIONS',
    'MAPLE_CHARACTER_EMOTIONS',
    'MAPLE_WEAPON_MOTIONS',
    'parseItemOption',
    'summarizeItemOptions',
    'sumItemTotalOptions',
    'getItemStarforce',
  ] as const;

  it('루트와 maplestory sub-path 양쪽에서 같은 도우미를 내보낸다', () => {
    for (const name of names) {
      expect(root[name]).toBeDefined();
      expect(subPath[name]).toBe(root[name]);
    }
  });
});
