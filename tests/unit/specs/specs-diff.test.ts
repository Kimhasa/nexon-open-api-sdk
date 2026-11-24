import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { diffSnapshots, renderDiff } from '../../../scripts/lib/specs-diff.js';
import { readOperations } from '../../../scripts/lib/specs-schema.js';
import type { Snapshot } from '../../../scripts/lib/specs-snapshot.js';

function snapshot(name: string): Snapshot {
  const bytes = readFileSync(new URL(`../../fixtures/specs/${name}.yaml`, import.meta.url));
  return parseSnapshot(name, bytes);
}

function parseSnapshot(name: string, yaml: string | Buffer): Snapshot {
  const operations = readOperations('fixture', name, yaml);
  return new Map([['fixture', new Map(operations.map((op) => [op.key, op]))]]);
}

describe('OpenAPI snapshot diff', () => {
  const before = snapshot('before');
  const after = snapshot('after');
  const changes = diffSnapshots(before, after);

  it.each([
    ['MINOR', 'operation-added', '$', 'POST /fixture/v1/new'],
    ['DEPRECATE', 'operation-removed', '$', 'DELETE /fixture/v1/retired'],
  ])('reports %s %s', (severity, kind, path, operation) => {
    expect(changes).toContainEqual(expect.objectContaining({ severity, kind, path, operation }));
  });

  it.each([
    ['MINOR', 'parameter-added', 'parameter.query.newlyOptional'],
    ['MAJOR', 'parameter-added', 'parameter.query.newlyRequired'],
    ['DEPRECATE', 'parameter-removed', 'parameter.query.obsolete'],
    ['MAJOR', 'parameter-required-changed', 'parameter.query.cursor'],
    ['MINOR', 'parameter-required-changed', 'parameter.query.nowOptional'],
    ['MAJOR', 'type-changed', 'parameter.query.mode'],
    ['MAJOR', 'format-changed', 'parameter.query.mode'],
    ['MAJOR', 'enum-changed', 'parameter.query.mode'],
    ['MINOR', 'field-added', 'response.new_response'],
    ['MINOR', 'field-added', 'response.entries[].new_nested'],
    ['DEPRECATE', 'field-removed', 'response.stale'],
    ['DEPRECATE', 'field-removed', 'response.entries[].legacy'],
    ['MAJOR', 'type-changed', 'response.entries[].id'],
    ['MAJOR', 'type-changed', 'response.entries[].flags[]'],
    ['MAJOR', 'type-changed', 'response.item'],
    ['MAJOR', 'nullable-changed', 'response.entries[].label'],
    ['MAJOR', 'format-changed', 'response.date'],
    ['MINOR', 'enum-changed', 'response.status'],
    ['MAJOR', 'field-required-changed', 'response.presence'],
  ])('reports %s %s at %s', (severity, kind, path) => {
    expect(changes).toContainEqual(
      expect.objectContaining({ severity, kind, path, operation: 'GET /fixture/v1/sample' }),
    );
  });

  it('ignores equivalent references, inherited parameters overridden by the operation and key order', () => {
    expect(diffSnapshots(before, snapshot('before'))).toEqual([]);
    expect(changes).toHaveLength(21);
    expect(
      changes.some(({ path }) => path.includes('overridden') || path.includes('recursive')),
    ).toBe(false);
    expect(renderDiff(changes)).toMatch(
      /### MAJOR \(\d+\)[\s\S]*### DEPRECATE \(\d+\)[\s\S]*### MINOR \(\d+\)/,
    );
  });

  it('rejects unresolved local references', () => {
    expect(() =>
      readOperations(
        'fixture',
        'invalid.yaml',
        `
openapi: 3.0.3
paths:
  /test:
    get:
      parameters:
        - $ref: '#/components/parameters/Missing'
`,
      ),
    ).toThrow('OpenAPI 참조가 없습니다');
  });

  it('compares each HTTP 200 representation', () => {
    const yaml = `
openapi: 3.0.3
paths:
  /test:
    get:
      responses:
        '200':
          content:
            application/json:
              schema: { type: object }
            image/png:
              schema: { type: string, format: binary }
        '201':
          content:
            text/plain:
              schema: { type: string, format: untouched }
`;
    const afterYaml = yaml
      .replace('format: binary', 'format: byte')
      .replace('format: untouched', 'format: date');
    expect(diffSnapshots(parseSnapshot('before', yaml), parseSnapshot('after', afterYaml))).toEqual(
      [
        {
          game: 'fixture',
          operation: 'GET /test',
          path: 'response["image/png"]',
          kind: 'format-changed',
          severity: 'MAJOR',
          before: 'binary',
          after: 'byte',
        },
      ],
    );
  });
});
