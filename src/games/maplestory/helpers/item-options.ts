/**
 * 잠재능력·에디셔널 잠재능력 한 줄을 읽은 결과.
 *
 * - `kind: 'stat'` — `STR +12%` 처럼 "옵션명 + 수치" 꼴. `name`, `value`, `unit` 이 채워진다
 * - `kind: 'effect'` — `피격 시 10% 확률로 데미지의 20% 무시` 처럼 확률로 발동하는 문장형 효과
 * - `kind: 'unknown'` — SDK가 모르는 표기. 게임 업데이트로 새 옵션이 생기면 여기로 온다
 *
 * 어떤 경우에도 원문은 `raw` 에 그대로 남는다.
 */
export interface MapleItemOption {
  /** 옵션 종류 */
  readonly kind: 'stat' | 'effect' | 'unknown';
  /** 넥슨이 준 원문 (예: `"STR +12%"`) */
  readonly raw: string;
  /** 옵션명 (예: `"STR"`, `"보스 몬스터 데미지"`). `kind` 가 `'stat'` 이 아니면 `undefined` */
  readonly name: string | undefined;
  /** 수치. 감소 옵션은 음수다 (예: 재사용 대기시간 -2초 → `-2`). `kind` 가 `'stat'` 이 아니면 `undefined` */
  readonly value: number | undefined;
  /** 단위: `'%'`, `'초'`, 단위가 없으면 `''`. `kind` 가 `'stat'` 이 아니면 `undefined` */
  readonly unit: string | undefined;
  /** "캐릭터 기준 9레벨 당 STR +2" 의 9. 레벨 비례 옵션에만 있다 */
  readonly perLevel?: number | undefined;
  /** 수치 뒤 괄호 안의 부가 설명. 있을 때만 채워진다 */
  readonly note?: string | undefined;
}

/** 잠재능력 옵션 필드를 가진 장비. `getItemEquipment()` 의 장비, 프리셋 장비 모두 넣을 수 있다. */
export interface MaplePotentialItem {
  /** 장비 명 */
  readonly item_name?: string | undefined;
  /** 잠재능력 첫 번째 옵션 */
  readonly potential_option_1?: string | null | undefined;
  /** 잠재능력 두 번째 옵션 */
  readonly potential_option_2?: string | null | undefined;
  /** 잠재능력 세 번째 옵션 */
  readonly potential_option_3?: string | null | undefined;
  /** 에디셔널 잠재능력 첫 번째 옵션 */
  readonly additional_potential_option_1?: string | null | undefined;
  /** 에디셔널 잠재능력 두 번째 옵션 */
  readonly additional_potential_option_2?: string | null | undefined;
  /** 에디셔널 잠재능력 세 번째 옵션 */
  readonly additional_potential_option_3?: string | null | undefined;
}

/** 같은 옵션명·단위끼리 모은 합계. */
export interface MapleItemOptionTotal {
  /** 옵션명 (예: `"STR"`, `"보스 몬스터 데미지"`) */
  readonly name: string;
  /** 단위: `'%'`, `'초'`, 단위가 없으면 `''` */
  readonly unit: string;
  /** 레벨 비례 옵션이면 기준 레벨 (예: 9레벨 당 → 9). 아니면 없다 */
  readonly perLevel?: number | undefined;
  /** 수치의 단순 합 */
  readonly total: number;
  /** 합치기 전 수치 목록. 몬스터 방어율 무시처럼 게임에서 단순 합이 아닌 옵션을 직접 계산할 때 쓴다 */
  readonly values: readonly number[];
}

/** 수치로 합칠 수 없어 원문 그대로 남긴 잠재능력 한 줄. */
export interface MapleItemOptionLeftover {
  /** 넥슨이 준 원문 */
  readonly raw: string;
  /** `'effect'`: 확률로 발동하는 문장형 효과, `'unknown'`: SDK가 모르는 표기 */
  readonly kind: 'effect' | 'unknown';
  /** 잠재능력(`'potential'`)인지 에디셔널 잠재능력(`'additional'`)인지 */
  readonly source: 'potential' | 'additional';
  /** 이 옵션이 붙은 장비 명 */
  readonly item_name: string | undefined;
}

/** {@link summarizeItemOptions} 의 결과. */
export interface MapleItemOptionSummary {
  /** 잠재능력(윗잠) 합계 */
  readonly potential: readonly MapleItemOptionTotal[];
  /** 에디셔널 잠재능력(아랫잠) 합계 */
  readonly additional: readonly MapleItemOptionTotal[];
  /** 수치로 합치지 못한 줄 (문장형 효과와 모르는 표기). 버리지 않고 원문으로 남긴다 */
  readonly leftovers: readonly MapleItemOptionLeftover[];
}

// 넥슨 표기: "옵션명 +값[단위]". 콜론이 낀 표기("STR : +12%")는 실제로 관찰되지 않았지만 받아 둔다.
const STAT_OPTION =
  /^(.+?)\s*(?::\s*([+-]?)|([+-]))\s*(\d[\d,]*(?:\.\d+)?)\s*([^\d\s()+-]*)\s*(?:\((.*)\))?$/u;
const PER_LEVEL_NAME = /^캐릭터 기준\s*(\d+)\s*레벨\s*당\s*(.+)$/u;

/**
 * 잠재능력·에디셔널 잠재능력 한 줄(`"STR +12%"`)을 옵션명·수치·단위로 나눈다 — 환산 계산기, 스펙 비교 도구의 재료.
 *
 * 장비의 `potential_option_1`~`3`, `additional_potential_option_1`~`3` 값을 그대로 넣는다.
 * 모르는 표기가 와도 예외를 던지지 않고 `kind: 'unknown'` 과 원문(`raw`)을 돌려준다.
 *
 * @param text - 잠재능력 옵션 한 줄. 옵션이 없는 칸은 `null` 이다
 * @returns 읽은 결과. `text` 가 `null`·`undefined`·빈 문자열이면 `null`
 *
 * @example
 * ```ts
 * import { parseItemOption } from 'nexon-open-api';
 *
 * parseItemOption('보스 몬스터 데미지 +40%');
 * // { kind: 'stat', raw: '보스 몬스터 데미지 +40%', name: '보스 몬스터 데미지', value: 40, unit: '%' }
 * parseItemOption('캐릭터 기준 9레벨 당 STR +2');
 * // { kind: 'stat', ..., name: 'STR', value: 2, unit: '', perLevel: 9 }
 * parseItemOption('스킬 재사용 대기시간 -2초');
 * // { kind: 'stat', ..., name: '스킬 재사용 대기시간', value: -2, unit: '초' }
 * parseItemOption('피격 시 10% 확률로 데미지의 20% 무시');
 * // { kind: 'effect', raw: '피격 시 10% 확률로 데미지의 20% 무시', name: undefined, ... }
 * parseItemOption(null); // null — 옵션이 없는 칸
 * ```
 */
export function parseItemOption(text: string | null | undefined): MapleItemOption | null {
  if (typeof text !== 'string') return null;
  const raw = text;
  const trimmed = text.trim();
  if (trimmed === '') return null;

  const match = STAT_OPTION.exec(trimmed);
  const amount = match ? Number(match[4]?.replaceAll(',', '')) : NaN;
  if (!match || !Number.isFinite(amount)) {
    return {
      kind: trimmed.includes('확률로') ? 'effect' : 'unknown',
      raw,
      name: undefined,
      value: undefined,
      unit: undefined,
    };
  }

  const sign = match[2] ?? match[3];
  const fullName = (match[1] ?? '').trim();
  const perLevel = PER_LEVEL_NAME.exec(fullName);
  const note = match[6]?.trim();
  return {
    kind: 'stat',
    raw,
    name: perLevel ? (perLevel[2] ?? fullName).trim() : fullName,
    value: sign === '-' ? -amount : amount,
    unit: match[5] ?? '',
    ...(perLevel ? { perLevel: Number(perLevel[1]) } : {}),
    ...(note ? { note } : {}),
  };
}

// 0.1 + 0.2 같은 부동소수 오차가 합계에 드러나지 않게 한다
function roundSum(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

/**
 * 장착 장비 전체의 잠재능력과 에디셔널 잠재능력을 같은 옵션끼리 합산한다 — "STR% 총합", "보스 데미지 총합" 을 한 번에 구한다.
 *
 * `getItemEquipment()` 의 `item_equipment` (또는 `item_equipment_preset_1`~`3`)를 그대로 넣는다.
 * 옵션명·단위·레벨 비례 여부가 모두 같은 줄만 합친다. `STR +12%` 와 `STR +18`, `캐릭터 기준 9레벨 당 STR +2` 는 따로 센다.
 * 문장형 효과와 모르는 표기는 버리지 않고 `leftovers` 에 원문으로 남긴다.
 *
 * `total` 은 단순 합이다. 몬스터 방어율 무시처럼 게임에서 단순 합으로 적용되지 않는 옵션은 `values` 로 직접 계산한다.
 * 환산 주스탯 같은 환산 공식은 커뮤니티마다 달라 SDK에 넣지 않았다.
 *
 * @param items - 장비 목록 (`getItemEquipment()` 의 `item_equipment`)
 * @returns 잠재능력 합계, 에디셔널 잠재능력 합계, 합치지 못한 줄
 *
 * @example
 * ```ts
 * import { NexonClient, summarizeItemOptions } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const equip = await client.maplestory.character.getItemEquipment({ ocid });
 *
 * const { potential, additional, leftovers } = summarizeItemOptions(equip.item_equipment);
 * const boss = potential.find((o) => o.name === '보스 몬스터 데미지' && o.unit === '%');
 * console.log(`잠재능력 보스 데미지 합계: ${boss?.total ?? 0}%`);
 * console.log(`에디셔널 옵션 ${additional.length}종, 문장형 효과 ${leftovers.length}줄`);
 * ```
 */
export function summarizeItemOptions(items: readonly MaplePotentialItem[]): MapleItemOptionSummary {
  const totals = {
    potential: new Map<
      string,
      { name: string; unit: string; perLevel?: number; values: number[] }
    >(),
    additional: new Map<
      string,
      { name: string; unit: string; perLevel?: number; values: number[] }
    >(),
  };
  const leftovers: MapleItemOptionLeftover[] = [];

  for (const item of items) {
    const lines = [
      ['potential', item.potential_option_1],
      ['potential', item.potential_option_2],
      ['potential', item.potential_option_3],
      ['additional', item.additional_potential_option_1],
      ['additional', item.additional_potential_option_2],
      ['additional', item.additional_potential_option_3],
    ] as const;

    for (const [source, text] of lines) {
      const option = parseItemOption(text);
      if (!option) continue;
      if (option.kind !== 'stat' || option.name === undefined || option.value === undefined) {
        leftovers.push({
          raw: option.raw,
          kind: option.kind === 'effect' ? 'effect' : 'unknown',
          source,
          item_name: item.item_name,
        });
        continue;
      }

      const unit = option.unit ?? '';
      const key = JSON.stringify([option.name, unit, option.perLevel ?? null]);
      let bucket = totals[source].get(key);
      if (!bucket) {
        bucket = {
          name: option.name,
          unit,
          ...(option.perLevel === undefined ? {} : { perLevel: option.perLevel }),
          values: [],
        };
        totals[source].set(key, bucket);
      }
      bucket.values.push(option.value);
    }
  }

  const finish = (source: 'potential' | 'additional'): MapleItemOptionTotal[] =>
    [...totals[source].values()].map((bucket) => ({
      ...bucket,
      total: roundSum(bucket.values.reduce((sum, value) => sum + value, 0)),
    }));

  return { potential: finish('potential'), additional: finish('additional'), leftovers };
}

/** {@link sumItemTotalOptions} 가 합산할 수 있는 장비 옵션 종류 (장비의 필드 이름). */
export type MapleItemOptionSource =
  | 'item_total_option'
  | 'item_base_option'
  | 'item_add_option'
  | 'item_etc_option'
  | 'item_starforce_option'
  | 'item_exceptional_option';

/**
 * 장비 옵션을 숫자로 합산한 결과. 넥슨이 문자열로 주는 수치(`"150"`)를 숫자로 바꿔 더한 값이다.
 *
 * 아래 항목은 항상 있고(없으면 0), 넥슨이 새 항목을 추가하면 그 이름으로도 합계가 들어온다.
 */
export interface MapleItemOptionSum {
  /** STR */
  readonly str: number;
  /** DEX */
  readonly dex: number;
  /** INT */
  readonly int: number;
  /** LUK */
  readonly luk: number;
  /** 최대 HP */
  readonly max_hp: number;
  /** 최대 MP */
  readonly max_mp: number;
  /** 공격력 */
  readonly attack_power: number;
  /** 마력 */
  readonly magic_power: number;
  /** 방어력 */
  readonly armor: number;
  /** 이동속도 */
  readonly speed: number;
  /** 점프력 */
  readonly jump: number;
  /** 보스 몬스터 공격 시 데미지 증가 (%) */
  readonly boss_damage: number;
  /** 몬스터 방어율 무시 (%)의 단순 합. 게임에서는 단순 합으로 적용되지 않으니 표시용으로만 쓴다 */
  readonly ignore_monster_armor: number;
  /** 올스탯 (%) */
  readonly all_stat: number;
  /** 데미지 (%) */
  readonly damage: number;
  /** 최대 HP (%) */
  readonly max_hp_rate: number;
  /** 최대 MP (%) */
  readonly max_mp_rate: number;
  /** 그 밖의 항목 (착용 레벨 감소 등, 그리고 넥슨이 나중에 추가하는 항목) */
  readonly [field: string]: number;
}

/** 옵션 묶음을 가진 장비. `getItemEquipment()` 의 장비, 프리셋 장비 모두 넣을 수 있다. */
export type MapleOptionItem = {
  readonly [K in MapleItemOptionSource]?: object | null | undefined;
};

const KNOWN_OPTION_FIELDS = [
  'str',
  'dex',
  'int',
  'luk',
  'max_hp',
  'max_mp',
  'attack_power',
  'magic_power',
  'armor',
  'speed',
  'jump',
  'boss_damage',
  'ignore_monster_armor',
  'all_stat',
  'damage',
  'max_hp_rate',
  'max_mp_rate',
] as const;

// 넥슨은 수치를 "150" 같은 문자열로 준다. 숫자로 읽을 수 없으면 undefined
function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const text = value.trim().replaceAll(',', '');
  if (text === '') return undefined;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * 장착 장비 전체의 옵션 수치를 항목별로 합산한다 — "장비로 얻는 STR 총합", "추가 옵션 공격력 총합" 을 구한다.
 *
 * 장비 옵션은 `"150"` 같은 문자열 숫자로 오기 때문에 그대로 더하면 `"150150"` 처럼 글자가 이어 붙는다.
 * 이 함수가 숫자로 바꿔 더한다. 숫자로 읽을 수 없는 값은 건너뛴다.
 *
 * 기본은 모든 강화를 더한 최종 옵션(`item_total_option`)이다. `source` 로 다른 묶음을 고른다.
 * - `'item_base_option'` 기본 옵션, `'item_add_option'` 추가 옵션(환생의 불꽃)
 * - `'item_etc_option'` 주문서, `'item_starforce_option'` 스타포스, `'item_exceptional_option'` 익셉셔널
 *
 * 잠재능력은 여기에 포함되지 않는다. 잠재능력은 {@link summarizeItemOptions} 로 따로 합산한다.
 *
 * @param items - 장비 목록 (`getItemEquipment()` 의 `item_equipment`)
 * @param source - 합산할 옵션 묶음. 생략하면 최종 옵션(`'item_total_option'`)
 * @returns 항목별 합계 (숫자)
 *
 * @example
 * ```ts
 * import { NexonClient, sumItemTotalOptions } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const equip = await client.maplestory.character.getItemEquipment({ ocid });
 *
 * const total = sumItemTotalOptions(equip.item_equipment);
 * const flame = sumItemTotalOptions(equip.item_equipment, 'item_add_option');
 * console.log(`장비 STR ${total.str}, 공격력 ${total.attack_power}, 올스탯 ${total.all_stat}%`);
 * console.log(`그중 추가 옵션 STR ${flame.str}`);
 * ```
 */
export function sumItemTotalOptions(
  items: readonly MapleOptionItem[],
  source: MapleItemOptionSource = 'item_total_option',
): MapleItemOptionSum {
  const sums: Record<string, number> = {};
  for (const field of KNOWN_OPTION_FIELDS) sums[field] = 0;

  for (const item of items) {
    const option = item[source];
    if (typeof option !== 'object' || option === null) continue;
    for (const [field, value] of Object.entries(option)) {
      const amount = toNumber(value);
      if (amount !== undefined) sums[field] = (sums[field] ?? 0) + amount;
    }
  }

  for (const field of Object.keys(sums)) sums[field] = roundSum(sums[field] ?? 0);
  return sums as MapleItemOptionSum;
}

/**
 * 장비의 스타포스 별 개수를 숫자로 돌려준다.
 *
 * 넥슨은 스타포스를 `"22"` 같은 문자열로 준다. 비교·정렬 전에 이 함수로 숫자로 바꾼다.
 * 스타포스 강화를 하지 않는 장비나 숫자로 읽을 수 없는 값은 0 이다.
 *
 * @param item - 장비 한 개 (`getItemEquipment()` 의 `item_equipment[]`)
 * @returns 스타포스 별 개수
 *
 * @example
 * ```ts
 * import { NexonClient, getItemStarforce } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const equip = await client.maplestory.character.getItemEquipment({ ocid });
 *
 * const over22 = equip.item_equipment.filter((item) => getItemStarforce(item) >= 22);
 * console.log(`22성 이상 장비 ${over22.length}개`);
 * ```
 */
export function getItemStarforce(item: {
  readonly starforce?: string | number | null | undefined;
}): number {
  return toNumber(item.starforce) ?? 0;
}
