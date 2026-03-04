import { emitDeprecation } from '../deprecation/deprecation.js';

/**
 * 응답 필드의 예상 타입.
 *
 * - `'string'`, `'number'`, `'boolean'`, `'object'` — `typeof` 체크
 * - `'array'` — `Array.isArray()` 체크
 * - `'any'` — 키 존재만 확인, 타입 무관
 * - `'optional'` — 키가 없어도 OK
 */
export type ExpectedType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'any'
  | 'optional';

/**
 * 런타임 응답 Shape descriptor.
 *
 * Top-level key와 예상 타입만 정의합니다.
 * 깊은 nested 검증은 성능 비용 대비 효과가 낮으므로 의도적으로 제외합니다.
 */
export interface ShapeDescriptor {
  /** 예상 키와 타입 맵 */
  readonly expectedKeys: Readonly<Record<string, ExpectedType>>;
  /** deprecated 키와 경고 메시지 맵 (존재 시 emitDeprecation 호출) */
  readonly deprecatedKeys?: Readonly<Record<string, string>> | undefined;
}

/** 응답 shape 불일치 정보. */
export interface ShapeMismatch {
  /** 응답을 받은 엔드포인트 URL */
  readonly url: string;
  /** 응답에 있지만 descriptor에 없는 키 */
  readonly unexpectedKeys: readonly string[];
  /** descriptor에 있지만 응답에 없는 필수 키 */
  readonly missingKeys: readonly string[];
  /** 타입이 예상과 다른 키 */
  readonly typeMismatches: ReadonlyArray<{
    readonly key: string;
    readonly expected: ExpectedType;
    readonly actual: string;
  }>;
}

/**
 * 응답 객체를 shape descriptor와 비교한다.
 *
 * - shape가 일치하면 `null` 반환
 * - 불일치가 있으면 `ShapeMismatch` 반환 (throw하지 않음)
 * - deprecated 키가 응답에 존재하면 `emitDeprecation()` 호출
 *
 * @param url - 요청 URL (로깅용)
 * @param data - 파싱된 JSON 응답
 * @param shape - 예상 shape descriptor
 */
export function validateShape(
  url: string,
  data: unknown,
  shape: ShapeDescriptor,
): ShapeMismatch | null {
  if (typeof data !== 'object' || data === null) {
    return {
      url,
      unexpectedKeys: [],
      missingKeys: Object.keys(shape.expectedKeys),
      typeMismatches: [{ key: '(root)', expected: 'object', actual: typeof data }],
    };
  }

  const responseKeys = new Set(Object.keys(data));
  const expectedEntries = Object.entries(shape.expectedKeys);

  const missingKeys: string[] = [];
  const typeMismatches: Array<{ key: string; expected: ExpectedType; actual: string }> = [];

  for (const [key, expectedType] of expectedEntries) {
    if (!responseKeys.has(key)) {
      if (expectedType !== 'optional') {
        missingKeys.push(key);
      }
      continue;
    }

    responseKeys.delete(key);

    if (expectedType === 'any' || expectedType === 'optional') continue;

    const value = (data as Record<string, unknown>)[key];
    const actualType = Array.isArray(value) ? 'array' : typeof value;

    // null은 object로 취급 (넥슨 API에서 null 응답이 올 수 있음)
    if (actualType !== expectedType && !(value === null && expectedType === 'object')) {
      typeMismatches.push({ key, expected: expectedType, actual: actualType });
    }
  }

  // deprecated 키 체크
  if (shape.deprecatedKeys) {
    for (const [key, message] of Object.entries(shape.deprecatedKeys)) {
      if (responseKeys.has(key)) {
        responseKeys.delete(key);
        emitDeprecation(`response.${key}`, message);
      }
    }
  }

  const unexpectedKeys = [...responseKeys];

  if (missingKeys.length === 0 && typeMismatches.length === 0 && unexpectedKeys.length === 0) {
    return null;
  }

  return { url, unexpectedKeys, missingKeys, typeMismatches };
}
