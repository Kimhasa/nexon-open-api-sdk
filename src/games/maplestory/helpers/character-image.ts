import { invalidInput } from '../../../core/validation/input.js';

/** 캐릭터 외형 이미지의 동작·감정표현 한 가지. */
export interface MapleCharacterImageCode {
  /** 이미지 주소에 붙이는 코드 (예: `A00`, `E02`) */
  readonly code: string;
  /** 넥슨 안내에 적힌 영어 이름 (예: `stand1`, `smile`) */
  readonly name: string;
  /** 한국어 설명 */
  readonly label: string;
  /** 고를 수 있는 마지막 프레임 번호. 프레임은 0부터 이 값까지다 */
  readonly maxFrame: number;
}

/** 캐릭터 외형 이미지의 무기 모션 한 가지. */
export interface MapleWeaponMotionCode {
  /** 이미지 주소에 붙이는 코드 (예: `W01`) */
  readonly code: string;
  /** 넥슨 안내에 적힌 설명 */
  readonly label: string;
}

/**
 * 캐릭터 외형 이미지의 동작(`action`) 목록 — 넥슨 안내의 A00~A41 표 그대로.
 *
 * 동작마다 프레임 수가 다르다. 예: 서 있기 1(`A00`)은 0~2, 점프(`A06`)는 0 하나뿐이다.
 * 이름의 O·T·P·F 는 한손·두손·폴암·마무리 동작을 뜻한다.
 */
export const MAPLE_CHARACTER_ACTIONS = [
  { code: 'A00', name: 'stand1', label: '서 있기 1 (기본)', maxFrame: 2 },
  { code: 'A01', name: 'stand2', label: '서 있기 2', maxFrame: 2 },
  { code: 'A02', name: 'walk1', label: '걷기 1', maxFrame: 3 },
  { code: 'A03', name: 'walk2', label: '걷기 2', maxFrame: 3 },
  { code: 'A04', name: 'prone', label: '엎드리기', maxFrame: 0 },
  { code: 'A05', name: 'fly', label: '날기', maxFrame: 1 },
  { code: 'A06', name: 'jump', label: '점프', maxFrame: 0 },
  { code: 'A07', name: 'sit', label: '앉기', maxFrame: 0 },
  { code: 'A08', name: 'ladder', label: '사다리 타기', maxFrame: 1 },
  { code: 'A09', name: 'rope', label: '밧줄 타기', maxFrame: 1 },
  { code: 'A10', name: 'heal', label: '회복', maxFrame: 2 },
  { code: 'A11', name: 'alert', label: '전투 태세', maxFrame: 2 },
  { code: 'A12', name: 'proneStab', label: '엎드려 공격', maxFrame: 1 },
  { code: 'A13', name: 'swingO1', label: '한손 휘두르기 1', maxFrame: 2 },
  { code: 'A14', name: 'swingO2', label: '한손 휘두르기 2', maxFrame: 2 },
  { code: 'A15', name: 'swingO3', label: '한손 휘두르기 3', maxFrame: 2 },
  { code: 'A16', name: 'swingOF', label: '한손 휘두르기 마무리', maxFrame: 3 },
  { code: 'A17', name: 'swingP1', label: '폴암 휘두르기 1', maxFrame: 2 },
  { code: 'A18', name: 'swingP2', label: '폴암 휘두르기 2', maxFrame: 2 },
  { code: 'A19', name: 'swingPF', label: '폴암 휘두르기 마무리', maxFrame: 3 },
  { code: 'A20', name: 'swingT1', label: '두손 휘두르기 1', maxFrame: 2 },
  { code: 'A21', name: 'swingT2', label: '두손 휘두르기 2', maxFrame: 2 },
  { code: 'A22', name: 'swingT3', label: '두손 휘두르기 3', maxFrame: 2 },
  { code: 'A23', name: 'swingTF', label: '두손 휘두르기 마무리', maxFrame: 3 },
  { code: 'A24', name: 'stabO1', label: '한손 찌르기 1', maxFrame: 1 },
  { code: 'A25', name: 'stabO2', label: '한손 찌르기 2', maxFrame: 1 },
  { code: 'A26', name: 'stabOF', label: '한손 찌르기 마무리', maxFrame: 2 },
  { code: 'A27', name: 'stabT1', label: '두손 찌르기 1', maxFrame: 2 },
  { code: 'A28', name: 'stabT2', label: '두손 찌르기 2', maxFrame: 2 },
  { code: 'A29', name: 'stabTF', label: '두손 찌르기 마무리', maxFrame: 3 },
  { code: 'A30', name: 'shoot1', label: '쏘기 1', maxFrame: 2 },
  { code: 'A31', name: 'shoot2', label: '쏘기 2', maxFrame: 4 },
  { code: 'A32', name: 'shootF', label: '쏘기 마무리', maxFrame: 2 },
  { code: 'A33', name: 'dead', label: '사망', maxFrame: 0 },
  { code: 'A34', name: 'ghostwalk', label: '유령 걷기', maxFrame: 3 },
  { code: 'A35', name: 'ghoststand', label: '유령 서 있기', maxFrame: 2 },
  { code: 'A36', name: 'ghostjump', label: '유령 점프', maxFrame: 0 },
  { code: 'A37', name: 'ghostproneStab', label: '유령 엎드려 공격', maxFrame: 1 },
  { code: 'A38', name: 'ghostladder', label: '유령 사다리 타기', maxFrame: 1 },
  { code: 'A39', name: 'ghostrope', label: '유령 밧줄 타기', maxFrame: 1 },
  { code: 'A40', name: 'ghostfly', label: '유령 날기', maxFrame: 1 },
  { code: 'A41', name: 'ghostsit', label: '유령 앉기', maxFrame: 0 },
] as const satisfies readonly MapleCharacterImageCode[];

/**
 * 캐릭터 외형 이미지의 감정표현(`emotion`) 목록 — 넥슨 안내의 E00~E24 표 그대로.
 *
 * 대부분 프레임이 0 하나뿐이고, 눈 깜빡임(`E06`)처럼 움직이는 표정만 프레임이 더 있다.
 */
export const MAPLE_CHARACTER_EMOTIONS = [
  { code: 'E00', name: 'default', label: '기본 표정', maxFrame: 0 },
  { code: 'E01', name: 'wink', label: '윙크', maxFrame: 0 },
  { code: 'E02', name: 'smile', label: '웃음', maxFrame: 0 },
  { code: 'E03', name: 'cry', label: '울음', maxFrame: 0 },
  { code: 'E04', name: 'angry', label: '화남', maxFrame: 0 },
  { code: 'E05', name: 'bewildered', label: '당황', maxFrame: 0 },
  { code: 'E06', name: 'blink', label: '눈 깜빡임', maxFrame: 2 },
  { code: 'E07', name: 'blaze', label: '이글이글', maxFrame: 1 },
  { code: 'E08', name: 'bowing', label: '꾸벅 인사', maxFrame: 1 },
  { code: 'E09', name: 'cheers', label: '환호', maxFrame: 0 },
  { code: 'E10', name: 'chu', label: '뽀뽀', maxFrame: 0 },
  { code: 'E11', name: 'dam', label: '투덜', maxFrame: 1 },
  { code: 'E12', name: 'despair', label: '절망', maxFrame: 1 },
  { code: 'E13', name: 'glitter', label: '반짝반짝', maxFrame: 1 },
  { code: 'E14', name: 'hit', label: '맞음', maxFrame: 0 },
  { code: 'E15', name: 'hot', label: '더위', maxFrame: 1 },
  { code: 'E16', name: 'hum', label: '흥얼', maxFrame: 1 },
  { code: 'E17', name: 'love', label: '사랑', maxFrame: 1 },
  { code: 'E18', name: 'oops', label: '아차', maxFrame: 0 },
  { code: 'E19', name: 'pain', label: '아픔', maxFrame: 0 },
  { code: 'E20', name: 'troubled', label: '곤란', maxFrame: 0 },
  { code: 'E21', name: 'qBlue', label: '질림', maxFrame: 0 },
  { code: 'E22', name: 'shine', label: '빛남', maxFrame: 0 },
  { code: 'E23', name: 'stunned', label: '기절', maxFrame: 0 },
  { code: 'E24', name: 'vomit', label: '구토', maxFrame: 1 },
] as const satisfies readonly MapleCharacterImageCode[];

/** 캐릭터 외형 이미지의 무기 모션(`wmotion`) 목록 — 넥슨 안내의 W00~W04 표 그대로. */
export const MAPLE_WEAPON_MOTIONS = [
  { code: 'W00', label: '기본 모션 (무기 타입에 따른 모션)' },
  { code: 'W01', label: '한손 모션' },
  { code: 'W02', label: '두손 모션' },
  { code: 'W03', label: '건 모션' },
  { code: 'W04', label: '무기 제외' },
] as const satisfies readonly MapleWeaponMotionCode[];

/** 동작 코드 (`'A00'` ~ `'A41'`). 뜻은 {@link MAPLE_CHARACTER_ACTIONS} 참고 */
export type MapleCharacterAction = (typeof MAPLE_CHARACTER_ACTIONS)[number]['code'];

/** 감정표현 코드 (`'E00'` ~ `'E24'`). 뜻은 {@link MAPLE_CHARACTER_EMOTIONS} 참고 */
export type MapleCharacterEmotion = (typeof MAPLE_CHARACTER_EMOTIONS)[number]['code'];

/** 무기 모션 코드 (`'W00'` ~ `'W04'`). 뜻은 {@link MAPLE_WEAPON_MOTIONS} 참고 */
export type MapleWeaponMotion = (typeof MAPLE_WEAPON_MOTIONS)[number]['code'];

/** {@link characterImageUrl} 에 넣는 외형 이미지 설정. 생략한 항목은 주소를 건드리지 않는다. */
export interface MapleCharacterImageOptions {
  /** 동작. 예: `'A00'` 서 있기 1, `'A06'` 점프 */
  readonly action?: MapleCharacterAction | undefined;
  /** 동작의 프레임 번호 (0부터). `action` 과 함께 넣는다. 범위는 동작마다 다르다 */
  readonly actionFrame?: number | undefined;
  /** 감정표현. 예: `'E02'` 웃음 */
  readonly emotion?: MapleCharacterEmotion | undefined;
  /** 감정표현의 프레임 번호 (0부터). `emotion` 과 함께 넣는다 */
  readonly emotionFrame?: number | undefined;
  /** 무기 모션. 예: `'W04'` 무기 제외 */
  readonly wmotion?: MapleWeaponMotion | undefined;
}

function withFrame(
  kind: '동작(action)' | '감정표현(emotion)',
  frameName: 'actionFrame' | 'emotionFrame',
  table: readonly MapleCharacterImageCode[],
  code: string | undefined,
  frame: number | undefined,
): string | undefined {
  if (code === undefined) {
    if (frame !== undefined) {
      invalidInput(
        `${frameName} 만 있고 ${kind} 코드가 없습니다.`,
        `프레임은 코드와 함께 넣어 주세요. 예: { ${frameName === 'actionFrame' ? "action: 'A00', actionFrame: 2" : "emotion: 'E06', emotionFrame: 1"} }`,
      );
    }
    return undefined;
  }

  const entry = table.find((item) => item.code === code);
  if (!entry) {
    const first = table[0]?.code;
    const last = table[table.length - 1]?.code;
    invalidInput(
      `${kind} 코드 ${JSON.stringify(code)} 는 넥슨 안내에 없는 값입니다.`,
      `${first} ~ ${last} 중 하나를 넣어 주세요.`,
    );
  }
  if (frame === undefined) return entry.code;

  if (!Number.isInteger(frame) || frame < 0 || frame > entry.maxFrame) {
    invalidInput(
      `${frameName} 값 ${String(frame)} 은(는) ${entry.code}(${entry.label}) 에서 쓸 수 없습니다.`,
      entry.maxFrame === 0
        ? '이 코드는 프레임이 0 하나뿐입니다. 0 을 넣거나 프레임을 생략해 주세요.'
        : `0 ~ ${entry.maxFrame} 사이의 정수를 넣어 주세요.`,
    );
  }
  return `${entry.code}.${frame}`;
}

/**
 * 캐릭터 외형 이미지 주소에 동작·감정표현·무기 모션을 입힌다 — 코디 카드, 프로필 이미지를 만들 때 쓴다.
 *
 * `character.getBasic()` 의 `character_image` 주소를 받아, 넥슨이 안내한 쿼리 파라미터
 * (`action`, `emotion`, `wmotion`)를 붙인 새 주소를 돌려준다. 서버를 호출하지 않는다.
 * 주소에 이미 다른 쿼리가 있으면 그대로 두고, 같은 항목만 새 값으로 바꾼다.
 *
 * 이벤트 캐릭터인 사이타마는 기본 모션만 제공되어 쿼리를 붙여도 모습이 바뀌지 않는다 (넥슨 안내).
 *
 * @param imageUrl - 캐릭터 외형 이미지 주소 (`character.getBasic()` 의 `character_image`)
 * @param options - 동작, 감정표현, 무기 모션과 프레임. 생략한 항목은 주소를 건드리지 않는다
 * @returns 쿼리 파라미터가 붙은 이미지 주소
 * @throws {NexonBadRequestError} 주소가 올바르지 않거나, 코드·프레임이 넥슨 안내의 범위를 벗어날 때
 *
 * @example
 * ```ts
 * import { NexonClient, characterImageUrl } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY ?? '' });
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 *
 * // 웃으면서 점프하는 모습
 * const jumping = characterImageUrl(basic.character_image, { action: 'A06', emotion: 'E02' });
 * // 걷기 1의 프레임 0~3으로 걷는 애니메이션 만들기
 * const walkFrames = [0, 1, 2, 3].map((actionFrame) =>
 *   characterImageUrl(basic.character_image, { action: 'A02', actionFrame }),
 * );
 * ```
 */
export function characterImageUrl(
  imageUrl: string,
  options: MapleCharacterImageOptions = {},
): string {
  let url: URL;
  try {
    if (typeof imageUrl !== 'string' || imageUrl.trim() === '') throw new TypeError('empty');
    url = new URL(imageUrl);
  } catch {
    invalidInput(
      '캐릭터 외형 이미지 주소가 올바르지 않습니다.',
      'character.getBasic() 응답의 character_image 값을 그대로 넣어 주세요.',
    );
  }

  const action = withFrame(
    '동작(action)',
    'actionFrame',
    MAPLE_CHARACTER_ACTIONS,
    options.action,
    options.actionFrame,
  );
  const emotion = withFrame(
    '감정표현(emotion)',
    'emotionFrame',
    MAPLE_CHARACTER_EMOTIONS,
    options.emotion,
    options.emotionFrame,
  );
  const { wmotion } = options;
  if (wmotion !== undefined && !MAPLE_WEAPON_MOTIONS.some((item) => item.code === wmotion)) {
    invalidInput(
      `무기 모션(wmotion) 코드 ${JSON.stringify(wmotion)} 는 넥슨 안내에 없는 값입니다.`,
      'W00 ~ W04 중 하나를 넣어 주세요. 예: W04 는 무기 제외입니다.',
    );
  }

  // 바꿀 것이 없으면 받은 주소를 글자 그대로 돌려준다 (URL 정규화로 주소가 달라지지 않게)
  if (action === undefined && emotion === undefined && wmotion === undefined) return imageUrl;

  if (action !== undefined) url.searchParams.set('action', action);
  if (emotion !== undefined) url.searchParams.set('emotion', emotion);
  if (wmotion !== undefined) url.searchParams.set('wmotion', wmotion);
  return url.toString();
}
