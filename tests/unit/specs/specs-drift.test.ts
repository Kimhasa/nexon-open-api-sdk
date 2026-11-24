import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildDriftReport, parseBaseline } from '../../../scripts/lib/specs-drift.js';
import { analyzeSdk } from '../../../scripts/lib/specs-sdk.js';
import { readOperations } from '../../../scripts/lib/specs-schema.js';

const CLIENT = [
  "import { ENDPOINTS } from './endpoints.js';",
  'class HttpClient {',
  '  get<T>(_url: string, _query?: object): Promise<T> { throw new Error(); }',
  '}',
  'type Id = string & { readonly brand: unique symbol };',
  'interface Entry {',
  '  readonly id: Id;',
  '  readonly value: number;',
  '  readonly local: boolean;',
  '  readonly label: string;',
  '  /** @deprecated old response key */',
  '  readonly old?: string;',
  '}',
  'interface Request {',
  '  readonly limit?: number;',
  '  /** @deprecated old wire query */',
  '  readonly old?: string;',
  '  /** @deprecated old SDK-only query */',
  '  readonly kept?: string;',
  '}',
  'interface Response {',
  '  readonly nested?: readonly Entry[] | null;',
  '}',
  'class Client {',
  "  protected readonly pathPrefix = 'fixture';",
  '  private readonly http = new HttpClient();',
  '  protected buildUrl(path: string, version = "v1"): string { return `/fixture/${version}/${path}`; }',
  '  async getItems(params: Request): Promise<Response> {',
  "    const url = this.buildUrl('items', 'openapi/v2');",
  '    return this.http.get(url, { limit: params.limit, old: params.old, extra: true });',
  '  }',
  '  async getMeta(): Promise<number[]> { return this.http.get(ENDPOINTS.META); }',
  '  async getLocalizedMeta(language: "ko" | "en" = "ko"): Promise<number[]> {',
  '    const url = `https://api.example.test/static/fixture/${language}/meta.json`;',
  '    return this.http.get(url);',
  '  }',
  '  async getDynamicMeta(path: "a" | "b/c"): Promise<number[]> {',
  '    return this.http.get(`https://api.example.test/static/fixture/${path}/meta.json`);',
  '  }',
  "  async getLiteral(): Promise<string> { return this.http.get('https://api.example.test/fixture/v1/literal'); }",
  '  async getDynamic(path: string): Promise<boolean> { return this.http.get(this.buildUrl(path)); }',
  '  async getGeneric<T>(): Promise<T> { return this.http.get("/fixture/v1/generic"); }',
  '  /** @deprecated endpoint removed from the portal */',
  '  async getRetired(): Promise<string> { return this.http.get("/fixture/v1/retired"); }',
  '  async getId(): Promise<Id> {',
  '    const data = await this.http.get<{ ocid: string }>("/fixture/v1/id");',
  '    return data.ocid as Id;',
  '  }',
  '  async getExpandedId(): Promise<Id> {',
  '    const data = await this.http.get<{ ocid: string }>("/fixture/v1/expanded-id");',
  '    return data.ocid as Id;',
  '  }',
  '}',
].join('\n');

const SPEC = `
openapi: 3.0.3
paths:
  /fixture/openapi/v2/items:
    get:
      parameters:
        - { name: limit, in: query, required: true, schema: { type: integer } }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  nested:
                    type: array
                    items:
                      type: object
                      properties:
                        id: { type: string }
                        value: { type: string }
                        portal: { type: boolean }
                        label: { type: string, nullable: true }
  /fixture/v1/id:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  ocid: { type: string }
  /fixture/v1/expanded-id:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  ocid: { type: string }
                  newField: { type: string }
  /static/fixture/meta.json:
    get:
      responses:
        '200':
          content:
            application/json:
              schema: { type: array, items: { type: integer } }
  /static/fixture/{language_code}/meta.json:
    get:
      responses:
        '200':
          content:
            application/json:
              schema: { type: array, items: { type: integer } }
  /fixture/v1/literal:
    get:
      responses:
        '200':
          content:
            application/json:
              schema: { type: string }
  /fixture/v1/generic:
    get:
      responses:
        '200':
          content:
            application/json:
              schema: { type: boolean }
`;

describe('SDK drift', () => {
  it('matches literal and constant URLs and reports nested, nullable, query and unanalyzable shapes', () => {
    const root = mkdtempSync(join(tmpdir(), 'nexon-sdk-drift-'));
    try {
      const folder = join(root, 'src', 'games', 'different-folder-name');
      mkdirSync(folder, { recursive: true });
      writeFileSync(
        join(root, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: { strict: true, target: 'ES2022', types: [] },
          include: ['src'],
        }),
      );
      writeFileSync(join(folder, 'Client.ts'), CLIENT);
      writeFileSync(
        join(folder, 'endpoints.ts'),
        "const BASE = 'https://api.example.test/static';\n" +
          'export const ENDPOINTS = { META: `${BASE}/fixture/meta.json` } as const;\n',
      );
      const operations = readOperations('fixture', 'spec.yaml', SPEC);
      const snapshot = new Map([['fixture', new Map(operations.map((op) => [op.key, op]))]]);
      const baseline = parseBaseline([
        {
          operation: 'GET /fixture/openapi/v2/items',
          path: 'response.nested[].label',
          kind: 'nullable-mismatch',
          reason: 'Intentionally narrows the label',
        },
      ]);
      const report = buildDriftReport(snapshot, analyzeSdk(root), baseline, 'fixture');
      expect(report.newCount).toBe(6);
      expect(report.baselineCount).toBe(1);
      expect(report.deprecatedCount).toBe(4);
      const game = report.games[0];
      expect(game?.matchedMethods).toBe(7);
      expect(game?.findings.map(({ path, kind }) => [path, kind])).toEqual([
        ['query.extra', 'missing-spec-query'],
        ['query.limit', 'required-query-mismatch'],
        ['response.nested[].label', 'nullable-mismatch'],
        ['response.nested[].local', 'missing-spec-field'],
        ['response.nested[].portal', 'missing-sdk-field'],
        ['response.nested[].value', 'type-mismatch'],
        ['response', 'type-mismatch'],
      ]);
      expect(game?.deprecated.map(({ path, kind }) => [path, kind])).toEqual([
        ['query.kept', 'missing-spec-query'],
        ['query.old', 'missing-spec-query'],
        ['response.nested[].old', 'missing-spec-field'],
        ['$', 'missing-spec-operation'],
      ]);
      expect(game?.unresolved.map(({ method }) => method)).toEqual([
        'Client.getDynamic',
        'Client.getDynamicMeta',
        'Client.getGeneric',
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('requires a reason for baseline entries', () => {
    expect(() =>
      parseBaseline([
        {
          operation: 'GET /fixture/v1/items',
          path: 'response',
          kind: 'type-mismatch',
          reason: '  ',
        },
      ]),
    ).toThrow('reason');
  });
});
