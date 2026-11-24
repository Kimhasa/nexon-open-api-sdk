import { parseOpenApi, HTTP_METHODS } from './specs-portal.js';

type JsonObject = Record<string, unknown>;

export interface Field {
  readonly shape: Shape;
  readonly required: boolean;
}

export interface Shape {
  types: string[];
  nullable: boolean;
  format: string | undefined;
  enumValues: string[];
  properties: Map<string, Field>;
  items: Shape | undefined;
  unsupported: string | undefined;
}

export interface Parameter extends Field {
  readonly name: string;
  readonly location: string;
}

export interface Operation {
  readonly game: string;
  readonly key: string;
  readonly parameters: ReadonlyMap<string, Parameter>;
  readonly responses: ReadonlyMap<string, Shape>;
}

export function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function fieldPath(parent: string, name: string): string {
  return /^[\w-]+$/.test(name) ? `${parent}.${name}` : `${parent}[${JSON.stringify(name)}]`;
}

export function emptyShape(): Shape {
  return {
    types: [],
    nullable: false,
    format: undefined,
    enumValues: [],
    properties: new Map(),
    items: undefined,
    unsupported: undefined,
  };
}

function canonicalValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalValue).join(',')}]`;
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort(compareText)
      .map((key) => `${JSON.stringify(key)}:${canonicalValue(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? String(value);
}

function typeNames(value: unknown, properties: unknown, items: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return [...new Set(value.filter((type) => typeof type === 'string'))];
  if (isObject(properties)) return ['object'];
  return isObject(items) ? ['array'] : [];
}

class OpenApiDocument {
  private readonly shapes = new WeakMap<JsonObject, Shape>();

  constructor(
    private readonly root: JsonObject,
    private readonly label: string,
  ) {}

  private resolve(value: unknown): JsonObject {
    if (!isObject(value)) throw new Error(`OpenAPI 객체 형식 오류: ${this.label}`);
    let node = value;
    const seen = new Set<JsonObject>();
    while (typeof node['$ref'] === 'string') {
      const ref = node['$ref'];
      if (!ref.startsWith('#/components/') || seen.has(node)) {
        throw new Error(`해석할 수 없는 OpenAPI 참조: ${this.label} (${ref})`);
      }
      seen.add(node);
      const parts = decodeURIComponent(ref.slice(2))
        .split('/')
        .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'));
      let target: unknown = this.root;
      for (const part of parts)
        target = isObject(target) && Object.hasOwn(target, part) ? target[part] : undefined;
      if (!isObject(target)) throw new Error(`OpenAPI 참조가 없습니다: ${this.label} (${ref})`);
      node = target;
    }
    return node;
  }

  private shape(value: unknown): Shape {
    const node = this.resolve(value);
    const cached = this.shapes.get(node);
    if (cached) return cached;
    const shape = emptyShape();
    this.shapes.set(node, shape);
    const types = typeNames(node['type'], node['properties'], node['items']);
    shape.types = types.filter((type) => type !== 'null').sort(compareText);
    shape.nullable = node['nullable'] === true || types.includes('null');
    const format = node['format'];
    if (typeof format === 'string') shape.format = format;
    const values = node['enum'];
    if (Array.isArray(values)) shape.enumValues = [...new Set(values.map(canonicalValue))].sort();
    for (const keyword of ['allOf', 'oneOf', 'anyOf', 'not', 'additionalProperties']) {
      if (Object.hasOwn(node, keyword)) {
        shape.unsupported = [shape.unsupported, keyword].filter(Boolean).join(', ');
      }
    }
    const required = Array.isArray(node['required']) ? node['required'] : [];
    const properties = node['properties'];
    if (properties !== undefined) {
      if (!isObject(properties)) throw new Error(`properties 형식 오류: ${this.label}`);
      for (const name of Object.keys(properties).sort(compareText)) {
        shape.properties.set(name, {
          shape: this.shape(properties[name]),
          required: required.includes(name),
        });
      }
    }
    if (node['items'] !== undefined) shape.items = this.shape(node['items']);
    return shape;
  }

  parameters(path: JsonObject, operation: JsonObject): Map<string, Parameter> {
    const parameters = new Map<string, Parameter>();
    for (const raw of [path['parameters'], operation['parameters']]) {
      if (raw === undefined) continue;
      if (!Array.isArray(raw)) throw new Error(`parameters 형식 오류: ${this.label}`);
      for (const value of raw) {
        const parameter = this.resolve(value);
        const name = parameter['name'];
        const location = parameter['in'];
        if (typeof name !== 'string' || typeof location !== 'string') {
          throw new Error(`파라미터 name/in이 없습니다: ${this.label}`);
        }
        parameters.set(`${location}:${name}`, {
          name,
          location,
          required: parameter['required'] === true || location === 'path',
          shape: parameter['schema'] === undefined ? emptyShape() : this.shape(parameter['schema']),
        });
      }
    }
    return parameters;
  }

  responses(operation: JsonObject): Map<string, Shape> {
    const schemas = new Map<string, Shape>();
    const responses = operation['responses'];
    if (!isObject(responses) || responses['200'] === undefined) return schemas;
    const response = this.resolve(responses['200']);
    const content = response['content'];
    if (!isObject(content)) return schemas;
    for (const type of Object.keys(content).sort(compareText)) {
      const mediaType = content[type];
      if (isObject(mediaType) && mediaType['schema'] !== undefined) {
        schemas.set(type, this.shape(mediaType['schema']));
      }
    }
    return schemas;
  }
}

export function jsonResponse(operation: Operation): Shape | undefined {
  const primary = operation.responses.get('application/json');
  if (primary) return primary;
  for (const [type, shape] of operation.responses) {
    if (/^application\/(?:json|[^;]+\+json)(?:;|$)/i.test(type)) return shape;
  }
  return undefined;
}

export function readOperations(game: string, label: string, yaml: Buffer | string): Operation[] {
  const { root, paths } = parseOpenApi(yaml, label);
  const document = new OpenApiDocument(root, label);
  const result: Operation[] = [];
  for (const path of Object.keys(paths).sort(compareText)) {
    const item = paths[path];
    if (!isObject(item)) throw new Error(`OpenAPI 경로 형식 오류: ${label} (${path})`);
    for (const method of HTTP_METHODS) {
      const operation = item[method];
      if (operation === undefined) continue;
      if (!isObject(operation)) throw new Error(`OpenAPI 오퍼레이션 형식 오류: ${label} (${path})`);
      result.push({
        game,
        key: `${method.toUpperCase()} ${path.trim()}`,
        parameters: document.parameters(item, operation),
        responses: document.responses(operation),
      });
    }
  }
  return result;
}

export function markdownCode(value: string): string {
  const text = value.replace(/\s+/g, ' ');
  let fence = '`';
  while (text.includes(fence)) fence += '`';
  return `${fence} ${text} ${fence}`;
}
