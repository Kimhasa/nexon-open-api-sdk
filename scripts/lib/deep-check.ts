/**
 * 실 API E2E 스크립트(`yarn test:{game}`)에 붙이는 사전 로드 모듈.
 *
 * 모든 게임 클라이언트의 public 메서드를 감싸, 반환값을 SDK가 선언한 응답 타입과 중첩 필드까지 대조한다.
 * E2E 스크립트는 대표 필드 몇 개만 확인하므로, 실제 응답과 타입의 차이(누락·추가 필드, null, 타입)는
 * 이 대조로 찾는다. 결과는 `DEEP_CHECK_REPORT` 경로에 JSON으로 남긴다. 응답 값은 기록하지 않는다.
 *
 * 사용:
 *   DEEP_CHECK_REPORT=./deep-check.json corepack yarn tsx --import ./scripts/lib/deep-check.ts scripts/test-maplestory.ts
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT } from './specs-portal.js';
import { fieldPath, isObject } from './specs-schema.js';
import { analyzeSdk } from './specs-sdk.js';
import type { SdkShape } from './specs-sdk.js';

interface MethodReport {
  calls: number;
  /** 차이 항목("$.path 설명") → 발생 횟수 */
  differences: Record<string, number>;
  /** 선언된 응답 타입을 해석할 수 없어 대조하지 못한 이유 */
  limitation?: string | undefined;
}

const reportPath = process.env['DEEP_CHECK_REPORT'];
const methods = new Map(analyzeSdk().map((method) => [method.name, method]));
const reports = new Map<string, MethodReport>();

/** 타입에 없는 필드를 고칠 때 필요한 정보: 값 대신 구조만 적는다. */
function describe(value: unknown, depth = 0): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    const first: unknown = value.find((item) => item !== null);
    return first === undefined
      ? 'array(empty)'
      : `array<${depth > 1 ? '…' : describe(first, depth + 1)}>`;
  }
  if (isObject(value)) {
    const keys = Object.keys(value);
    return depth > 1
      ? `object(${keys.length})`
      : `{${keys.map((key) => `${key}: ${describe(value[key], depth + 1)}`).join(', ')}}`;
  }
  return typeof value;
}

/** `scripts/smoke-live.ts` 의 대조 규칙과 같고, 추가 필드에는 구조를 덧붙인다. */
function checkValue(
  value: unknown,
  shape: SdkShape,
  differences: Record<string, number>,
  path = '$',
): void {
  const record = (detail: string): void => {
    const key = `${path} ${detail}`;
    differences[key] = (differences[key] ?? 0) + 1;
  };
  if (shape.unsupported) {
    record(`cannot compare type ${shape.unsupported}`);
    return;
  }
  if (value === null) {
    if (!shape.nullable) record('unexpected null');
    return;
  }
  const actual = Array.isArray(value) ? 'array' : typeof value;
  if (!shape.types.includes(actual)) {
    record(`expected ${shape.types.join(' or ')}, received ${actual}`);
    return;
  }
  if (Array.isArray(value) && shape.items) {
    for (const item of value) checkValue(item, shape.items, differences, `${path}[]`);
  } else if (isObject(value)) {
    for (const [key, property] of shape.properties) {
      if (Object.hasOwn(value, key)) {
        checkValue(value[key], property.shape, differences, fieldPath(path, key));
      } else if (!property.optional) {
        record(`missing field ${key}`);
      }
    }
    for (const key of Object.keys(value)) {
      if (!shape.properties.has(key)) record(`additional field ${key}: ${describe(value[key])}`);
    }
  }
}

function inspect(name: string, data: unknown): void {
  const method = methods.get(name);
  if (!method) return;
  const report = reports.get(name) ?? { calls: 0, differences: {} };
  reports.set(name, report);
  report.calls += 1;
  if (!method.response) {
    report.limitation = method.limitation ?? '응답 타입 없음';
    return;
  }
  checkValue(data, method.response, report.differences);
}

function clientFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_base' ? [] : clientFiles(path);
    return /Client\.ts$/.test(entry.name) ? [path] : [];
  });
}

for (const file of clientFiles(resolve(REPO_ROOT, 'src', 'games'))) {
  const module = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
  for (const [exportName, value] of Object.entries(module)) {
    if (typeof value !== 'function' || !exportName.endsWith('Client')) continue;
    const prototype = (value as { prototype: Record<string, unknown> }).prototype;
    for (const key of Object.getOwnPropertyNames(prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      if (key === 'constructor' || typeof descriptor?.value !== 'function') continue;
      const original = descriptor.value as (...args: unknown[]) => unknown;
      const name = `${exportName}.${key}`;
      Object.defineProperty(prototype, key, {
        ...descriptor,
        value(this: unknown, ...args: unknown[]): unknown {
          const result = original.apply(this, args);
          if (result instanceof Promise) {
            return result.then((data: unknown) => {
              inspect(name, data);
              return data;
            });
          }
          return result;
        },
      });
    }
  }
}

process.on('exit', () => {
  if (!reportPath) return;
  const entries = [...reports.entries()].sort(([a], [b]) => a.localeCompare(b));
  writeFileSync(reportPath, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`);
});
