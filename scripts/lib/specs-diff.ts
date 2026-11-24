import { compareText, fieldPath, markdownCode } from './specs-schema.js';
import type { Operation, Shape } from './specs-schema.js';
import type { Snapshot } from './specs-snapshot.js';

export const SEVERITIES = ['MAJOR', 'DEPRECATE', 'MINOR'] as const;
type Severity = (typeof SEVERITIES)[number];

export interface Change {
  readonly game: string;
  readonly operation: string;
  readonly path: string;
  readonly kind: string;
  readonly severity: Severity;
  readonly before?: string;
  readonly after?: string;
}

type Detail = Omit<Change, 'game' | 'operation'>;
type Report = (change: Detail) => void;

function keys<T>(before: ReadonlyMap<string, T>, after: ReadonlyMap<string, T>): string[] {
  return [...new Set([...before.keys(), ...after.keys()])].sort(compareText);
}

function describe(values: readonly string[]): string {
  return values.length === 0 ? '미지정' : values.join(' | ');
}

function compareShapes(
  before: Shape,
  after: Shape,
  path: string,
  report: Report,
  ancestors: readonly (readonly [Shape, Shape])[] = [],
): void {
  if (ancestors.some(([a, b]) => a === before && b === after)) return;
  const parents = [...ancestors, [before, after] as const];
  const oldType = describe(before.types);
  const newType = describe(after.types);
  if (oldType !== newType) {
    const widening =
      before.types.length > 0 && before.types.every((type) => after.types.includes(type));
    report({
      path,
      kind: 'type-changed',
      severity: widening ? 'MINOR' : 'MAJOR',
      before: oldType,
      after: newType,
    });
  }
  if (before.format !== after.format) {
    report({
      path,
      kind: 'format-changed',
      severity: 'MAJOR',
      before: before.format ?? '미지정',
      after: after.format ?? '미지정',
    });
  }
  if (before.nullable !== after.nullable) {
    // 응답에 null이 새로 들어오면 기존 소비자에게 호환되지 않을 수 있다.
    const breaking = path.startsWith('response') ? after.nullable : before.nullable;
    report({
      path,
      kind: 'nullable-changed',
      severity: breaking ? 'MAJOR' : 'MINOR',
      before: String(before.nullable),
      after: String(after.nullable),
    });
  }
  if (describe(before.enumValues) !== describe(after.enumValues)) {
    const narrowed =
      after.enumValues.length > 0 &&
      (before.enumValues.length === 0 ||
        before.enumValues.some((v) => !after.enumValues.includes(v)));
    report({
      path,
      kind: 'enum-changed',
      severity: narrowed ? 'MAJOR' : 'MINOR',
      before: describe(before.enumValues),
      after: describe(after.enumValues),
    });
  }
  if (oldType !== newType && !before.types.some((type) => after.types.includes(type))) return;
  for (const name of keys(before.properties, after.properties)) {
    const oldField = before.properties.get(name);
    const newField = after.properties.get(name);
    const child = fieldPath(path, name);
    const response = path.startsWith('response');
    if (!oldField) {
      report({
        path: child,
        kind: 'field-added',
        severity: response || !newField?.required ? 'MINOR' : 'MAJOR',
      });
    } else if (!newField) {
      report({ path: child, kind: 'field-removed', severity: 'DEPRECATE' });
    } else {
      if (oldField.required !== newField.required) {
        report({
          path: child,
          kind: 'field-required-changed',
          severity: (response ? oldField.required : newField.required) ? 'MAJOR' : 'MINOR',
          before: oldField.required ? 'required' : 'optional',
          after: newField.required ? 'required' : 'optional',
        });
      }
      compareShapes(oldField.shape, newField.shape, child, report, parents);
    }
  }
  if (before.items && after.items) {
    compareShapes(before.items, after.items, `${path}[]`, report, parents);
  } else if (before.items !== after.items) {
    report({
      path: `${path}[]`,
      kind: 'array-items-changed',
      severity: 'MAJOR',
      before: before.items ? describe(before.items.types) : '미지정',
      after: after.items ? describe(after.items.types) : '미지정',
    });
  }
}

function compareOperations(before: Operation, after: Operation, report: Report): void {
  for (const key of keys(before.parameters, after.parameters)) {
    const oldParameter = before.parameters.get(key);
    const newParameter = after.parameters.get(key);
    const parameter = oldParameter ?? newParameter;
    if (!parameter) continue;
    const path = fieldPath(`parameter.${parameter.location}`, parameter.name);
    if (!oldParameter) {
      report({ path, kind: 'parameter-added', severity: parameter.required ? 'MAJOR' : 'MINOR' });
    } else if (!newParameter) {
      report({ path, kind: 'parameter-removed', severity: 'DEPRECATE' });
    } else {
      if (oldParameter.required !== newParameter.required) {
        report({
          path,
          kind: 'parameter-required-changed',
          severity: newParameter.required ? 'MAJOR' : 'MINOR',
          before: oldParameter.required ? 'required' : 'optional',
          after: newParameter.required ? 'required' : 'optional',
        });
      }
      compareShapes(oldParameter.shape, newParameter.shape, path, report);
    }
  }
  for (const media of keys(before.responses, after.responses)) {
    const path = media === 'application/json' ? 'response' : fieldPath('response', media);
    const oldResponse = before.responses.get(media);
    const newResponse = after.responses.get(media);
    if (oldResponse && newResponse) {
      compareShapes(oldResponse, newResponse, path, report);
    } else {
      report({
        path,
        kind: newResponse ? 'response-schema-added' : 'response-schema-removed',
        severity: newResponse ? 'MINOR' : 'MAJOR',
      });
    }
  }
}

export function diffSnapshots(before: Snapshot, after: Snapshot): Change[] {
  const changes: Change[] = [];
  for (const game of keys(before, after)) {
    const oldOps = before.get(game) ?? new Map<string, Operation>();
    const newOps = after.get(game) ?? new Map<string, Operation>();
    for (const operation of keys(oldOps, newOps)) {
      const oldOp = oldOps.get(operation);
      const newOp = newOps.get(operation);
      const report: Report = (change) => {
        changes.push({ game, operation, ...change });
      };
      if (!oldOp) report({ path: '$', kind: 'operation-added', severity: 'MINOR' });
      else if (!newOp) report({ path: '$', kind: 'operation-removed', severity: 'DEPRECATE' });
      else compareOperations(oldOp, newOp, report);
    }
  }
  return changes;
}

export function renderDiff(changes: readonly Change[]): string {
  const lines = ['## OpenAPI 스키마 변경', ''];
  if (!changes.length) lines.push('구조적 변경이 없습니다.', '');
  for (const severity of SEVERITIES) {
    const group = changes.filter((change) => change.severity === severity);
    if (group.length === 0) continue;
    lines.push(`### ${severity} (${group.length})`, '');
    for (const change of group) {
      const details =
        change.before === undefined
          ? ''
          : ` · ${markdownCode(change.before)} → ${markdownCode(change.after ?? '')}`;
      lines.push(
        `- ${markdownCode(change.game)} ${markdownCode(change.operation)} ${markdownCode(change.path)} · ${change.kind}${details}`,
      );
    }
    lines.push('');
  }
  return lines.join('\n');
}
