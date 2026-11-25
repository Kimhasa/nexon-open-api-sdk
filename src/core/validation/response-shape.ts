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
 * 객체의 최상위 키 또는 배열 응답의 원소를 검사합니다.
 */
export interface ShapeDescriptor {
  /** 예상 키와 타입 맵 */
  readonly expectedKeys: Readonly<Record<string, ExpectedType>>;
  /** deprecated 키와 경고 메시지 맵 (존재 시 emitDeprecation 호출) */
  readonly deprecatedKeys?: Readonly<Record<string, string>> | undefined;
  /** 배열 응답 검증 설정. {@link arrayOf}로 생성합니다. */
  readonly array?: ArrayShape | undefined;
}

type ObjectShape = Pick<ShapeDescriptor, 'expectedKeys' | 'deprecatedKeys'>;
type ArrayItemShape = ObjectShape | Exclude<ExpectedType, 'optional'>;

interface ArrayShape {
  readonly items: ArrayItemShape;
  readonly allowSingleObject?: boolean | undefined;
}

/**
 * 최상위 배열의 각 항목에 적용할 응답 descriptor를 만든다.
 * 불일치가 있으면 첫 번째 항목의 인덱스와 키를 보고합니다.
 *
 * @param items - 배열 항목의 타입 또는 객체 shape
 * @param options.allowSingleObject - 객체 shape를 배열 항목 및 단일 객체에 적용할지 여부
 *
 * @example
 * ```ts
 * const idsShape = arrayOf('string');
 * const recordsShape = arrayOf({ expectedKeys: { id: 'number' } });
 * const flexibleShape = arrayOf({ expectedKeys: { id: 'number' } }, { allowSingleObject: true });
 * await http.get(url, undefined, flexibleShape);
 * ```
 */
export function arrayOf(
  items: ArrayItemShape,
  options?: { readonly allowSingleObject?: boolean | undefined },
): ShapeDescriptor {
  return { expectedKeys: {}, array: { items, allowSingleObject: options?.allowSingleObject } };
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
 * 응답 데이터를 shape descriptor와 비교한다.
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
  if (shape.array) return validateArrayShape(url, data, shape.array);
  return validateObjectShape(url, data, shape);
}

function validateArrayShape(url: string, data: unknown, shape: ArrayShape): ShapeMismatch | null {
  const { items, allowSingleObject } = shape;
  if (!Array.isArray(data)) {
    if (allowSingleObject && typeof items !== 'string' && isObjectRecord(data)) {
      return validateObjectShape(url, data, items);
    }
    return arrayTypeMismatch(url, '(root)', 'array', data);
  }

  for (let index = 0; index < data.length; index += 1) {
    const item: unknown = data[index];
    const key = `[${index}]`;
    if (typeof items === 'string') {
      if (items !== 'any' && responseType(item) !== items) {
        return arrayTypeMismatch(url, key, items, item);
      }
      continue;
    }

    if (!isObjectRecord(item)) return arrayTypeMismatch(url, key, 'object', item);
    const mismatch = validateObjectShape(url, item, items);
    if (mismatch) {
      return {
        url,
        unexpectedKeys: mismatch.unexpectedKeys.map((field) => `${key}.${field}`),
        missingKeys: mismatch.missingKeys.map((field) => `${key}.${field}`),
        typeMismatches: mismatch.typeMismatches.map((entry) => ({
          ...entry,
          key: `${key}.${entry.key}`,
        })),
      };
    }
  }

  return null;
}

function isObjectRecord(data: unknown): boolean {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

function responseType(data: unknown): string {
  if (data === null) return 'null';
  return Array.isArray(data) ? 'array' : typeof data;
}

function arrayTypeMismatch(
  url: string,
  key: string,
  expected: ExpectedType,
  value: unknown,
): ShapeMismatch {
  return {
    url,
    unexpectedKeys: [],
    missingKeys: [],
    typeMismatches: [{ key, expected, actual: responseType(value) }],
  };
}

function validateObjectShape(url: string, data: unknown, shape: ObjectShape): ShapeMismatch | null {
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

    // null은 object로 취급 (NEXON Open API에서 null 응답이 올 수 있음)
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
