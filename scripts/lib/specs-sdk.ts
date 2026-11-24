import ts from 'typescript';
import { relative, resolve } from 'node:path';
import { compareText, emptyShape } from './specs-schema.js';
import type { Shape } from './specs-schema.js';
import { HTTP_METHODS, REPO_ROOT } from './specs-portal.js';

export interface SdkMethod {
  readonly game: string;
  readonly name: string;
  readonly operation: string | undefined;
  readonly limitation: string | undefined;
  readonly response: SdkShape | undefined;
  readonly responseField: string | undefined;
  readonly query: ReadonlyMap<string, SdkQueryParameter> | undefined;
  readonly deprecatedInputs: readonly string[];
  readonly deprecated: boolean;
}

export interface SdkShape extends Omit<Shape, 'properties' | 'items'> {
  properties: Map<
    string,
    { readonly shape: SdkShape; readonly deprecated: boolean; readonly optional: boolean }
  >;
  items: SdkShape | undefined;
}

export interface SdkQueryParameter {
  readonly required: boolean;
  readonly deprecated: boolean;
}

function hasFlag(type: ts.Type, flags: ts.TypeFlags): boolean {
  return (type.flags & flags) !== 0;
}

function primitive(type: ts.Type): string | undefined {
  if (hasFlag(type, ts.TypeFlags.StringLike)) return 'string';
  if (hasFlag(type, ts.TypeFlags.NumberLike)) return 'number';
  if (hasFlag(type, ts.TypeFlags.BooleanLike)) return 'boolean';
  return type.isIntersection() ? type.types.map(primitive).find(Boolean) : undefined;
}

function unwrap(expression: ts.Expression): ts.Expression {
  while (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isTypeAssertionExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isNonNullExpression(expression)
  ) {
    expression = expression.expression;
  }
  return expression;
}

/**
 * 값을 바꾸지 않고 감싸기만 하는 SDK 도우미 호출을 벗긴다 (`src/core/errors/name-lookup.ts`).
 *
 * - `lookupByName(() => this.http.get(...), notFound)` → `this.http.get(...)`
 * - `requireFoundId(response.oguild_id, notFound)` → `response.oguild_id`
 */
function unwrapHelper(expression: ts.Expression): ts.Expression {
  const node = unwrap(expression);
  if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) return node;
  const [first] = node.arguments;
  if (!first) return node;
  if (node.expression.text === 'requireFoundId') return unwrap(first);
  if (
    node.expression.text === 'lookupByName' &&
    ts.isArrowFunction(first) &&
    !ts.isBlock(first.body)
  ) {
    return unwrap(first.body);
  }
  return node;
}

function propertyName(name: ts.PropertyName): string | undefined {
  return ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)
    ? name.text
    : undefined;
}

function isConst(declaration: ts.VariableDeclaration): boolean {
  return (
    ts.isVariableDeclarationList(declaration.parent) &&
    (declaration.parent.flags & ts.NodeFlags.Const) !== 0
  );
}

class Analyzer {
  private readonly shapes = new Map<ts.Type, SdkShape>();

  constructor(private readonly checker: ts.TypeChecker) {}

  private isDeprecated(symbol: ts.Symbol | undefined): boolean {
    return symbol?.getJsDocTags(this.checker).some(({ name }) => name === 'deprecated') ?? false;
  }

  private staticString(node: ts.Expression, seen = new Set<ts.Expression>()): string | undefined {
    const expression = unwrap(node);
    if (seen.has(expression)) return undefined;
    seen.add(expression);
    try {
      if (ts.isStringLiteralLike(expression) || ts.isNumericLiteral(expression))
        return expression.text;
      if (ts.isTemplateExpression(expression)) {
        let text = expression.head.text;
        for (const span of expression.templateSpans) {
          const value = this.staticString(span.expression, seen);
          if (value === undefined) return undefined;
          text += value + span.literal.text;
        }
        return text;
      }
      let target: ts.Node = expression;
      if (ts.isPropertyAccessExpression(expression)) target = expression.name;
      else if (ts.isElementAccessExpression(expression)) {
        const key = this.staticString(expression.argumentExpression, seen);
        if (key === undefined) return undefined;
        const symbol = this.checker.getTypeAtLocation(expression.expression).getProperty(key);
        return this.stringFromSymbol(symbol, seen);
      }
      return this.stringFromSymbol(this.checker.getSymbolAtLocation(target), seen);
    } finally {
      seen.delete(expression);
    }
  }

  private stringFromSymbol(
    symbol: ts.Symbol | undefined,
    seen: Set<ts.Expression>,
  ): string | undefined {
    if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
      symbol = this.checker.getAliasedSymbol(symbol);
    }
    const declaration = symbol?.valueDeclaration;
    if (!declaration) return undefined;
    if (ts.isEnumMember(declaration)) {
      const value = this.checker.getConstantValue(declaration);
      return value === undefined ? undefined : String(value);
    }
    if (
      (ts.isVariableDeclaration(declaration) && isConst(declaration)) ||
      ts.isPropertyAssignment(declaration) ||
      (ts.isPropertyDeclaration(declaration) &&
        declaration.modifiers?.some(({ kind }) => kind === ts.SyntaxKind.ReadonlyKeyword))
    ) {
      return declaration.initializer && this.staticString(declaration.initializer, seen);
    }
    return undefined;
  }

  prefix(node: ts.ClassDeclaration): string | undefined {
    const prefix = this.checker.getTypeAtLocation(node).getProperty('pathPrefix');
    return this.stringFromSymbol(prefix, new Set());
  }

  private templateUrl(expression: ts.TemplateExpression): string | undefined {
    let url = expression.head.text;
    for (const span of expression.templateSpans) {
      const literal = this.staticString(span.expression);
      if (literal !== undefined) {
        url += literal + span.literal.text;
        continue;
      }

      // Only a bounded set of single path segments can stand in for an OpenAPI parameter.
      const value = unwrap(span.expression);
      if (!url.endsWith('/') || !span.literal.text.startsWith('/') || !ts.isIdentifier(value)) {
        return undefined;
      }
      const declaration = this.checker.getSymbolAtLocation(value)?.valueDeclaration;
      const type = this.checker.getTypeAtLocation(value);
      const alternatives = type.isUnion() ? type.types : [type];
      if (
        !declaration ||
        !ts.isParameter(declaration) ||
        !alternatives.every((part) => part.isStringLiteral() && /^[\w-]+$/.test(part.value))
      ) {
        return undefined;
      }
      url += `{${value.text}}${span.literal.text}`;
    }
    return url;
  }

  private url(
    node: ts.Expression,
    prefix: string,
    seen = new Set<ts.Expression>(),
  ): string | undefined {
    const expression = unwrap(node);
    if (seen.has(expression)) return undefined;
    seen.add(expression);
    if (
      ts.isCallExpression(expression) &&
      ts.isPropertyAccessExpression(expression.expression) &&
      expression.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
      expression.expression.name.text === 'buildUrl'
    ) {
      const [pathNode, versionNode] = expression.arguments;
      const path = pathNode && this.staticString(pathNode);
      const version = versionNode === undefined ? 'v1' : this.staticString(versionNode);
      return path !== undefined && version !== undefined
        ? `/${prefix}/${version}/${path}`
        : undefined;
    }
    if (ts.isIdentifier(expression)) {
      const declaration = this.checker.getSymbolAtLocation(expression)?.valueDeclaration;
      if (
        declaration &&
        ts.isVariableDeclaration(declaration) &&
        isConst(declaration) &&
        declaration.initializer
      ) {
        return this.url(declaration.initializer, prefix, seen);
      }
    }
    if (ts.isTemplateExpression(expression)) {
      return this.templateUrl(expression);
    }
    return this.staticString(expression);
  }

  private shape(type: ts.Type, at: ts.Node): SdkShape {
    const cached = this.shapes.get(type);
    if (cached) return cached;
    const shape: SdkShape = { ...emptyShape(), properties: new Map(), items: undefined };
    this.shapes.set(type, shape);
    const parts = type.isUnion() ? type.types : [type];
    shape.nullable = parts.some((part) => hasFlag(part, ts.TypeFlags.Null));
    const present = parts.filter(
      (part) => !hasFlag(part, ts.TypeFlags.Null | ts.TypeFlags.Undefined),
    );
    for (const part of present) {
      const simple = primitive(part);
      if (simple) shape.types.push(simple);
      else if (this.checker.isArrayType(part) || this.checker.isTupleType(part))
        shape.types.push('array');
      else if (
        hasFlag(part, ts.TypeFlags.Object | ts.TypeFlags.Intersection) &&
        part.getCallSignatures().length === 0
      ) {
        shape.types.push('object');
      } else shape.unsupported = this.checker.typeToString(part);
    }
    shape.types = [...new Set(shape.types)].sort(compareText);
    const structured = present.filter((part) => primitive(part) === undefined);
    if (structured.length > 1 || (structured.length > 0 && shape.types.length > 1)) {
      shape.unsupported = this.checker.typeToString(type);
      return shape;
    }
    const [base] = structured;
    if (!base || shape.unsupported) return shape;
    if (shape.types.includes('array')) {
      const items = this.checker.getIndexTypeOfType(base, ts.IndexKind.Number);
      if (items) shape.items = this.shape(items, at);
    } else if (shape.types.includes('object')) {
      if (this.checker.getIndexInfosOfType(base).length > 0) {
        shape.unsupported = `인덱스 시그니처: ${this.checker.typeToString(base)}`;
        return shape;
      }
      for (const property of this.checker.getPropertiesOfType(base)) {
        const name = property.getName();
        if (name.startsWith('__@')) continue;
        const value = this.checker.getTypeOfSymbolAtLocation(
          property,
          property.valueDeclaration ?? at,
        );
        shape.properties.set(name, {
          shape: this.shape(value, at),
          deprecated: this.isDeprecated(property),
          optional: (property.flags & ts.SymbolFlags.Optional) !== 0,
        });
      }
    }
    return shape;
  }

  private query(expression: ts.Expression | undefined): Map<string, SdkQueryParameter> | undefined {
    if (!expression) return new Map();
    const type = this.checker.getTypeAtLocation(expression);
    if (hasFlag(type, ts.TypeFlags.Undefined)) return new Map();
    if (
      type.isUnion() ||
      !hasFlag(type, ts.TypeFlags.Object) ||
      this.checker.getIndexInfosOfType(type).length > 0
    ) {
      return undefined;
    }
    return new Map(
      type.getProperties().map((property) => {
        const value = this.checker.getTypeOfSymbolAtLocation(property, expression);
        const parts = value.isUnion() ? value.types : [value];
        const required =
          (property.flags & ts.SymbolFlags.Optional) === 0 &&
          parts.every((part) => !hasFlag(part, ts.TypeFlags.Undefined | ts.TypeFlags.Null));
        return [
          property.getName(),
          {
            required,
            deprecated: this.isDeprecated(property) || this.deprecatedQuerySource(property),
          },
        ];
      }),
    );
  }

  private deprecatedQuerySource(property: ts.Symbol): boolean {
    const declaration = property.valueDeclaration;
    if (!declaration || !ts.isPropertyAssignment(declaration)) return false;
    const source = unwrap(declaration.initializer);
    if (ts.isPropertyAccessExpression(source)) {
      return this.isDeprecated(this.checker.getSymbolAtLocation(source.name));
    }
    if (ts.isElementAccessExpression(source) && ts.isStringLiteralLike(source.argumentExpression)) {
      return this.isDeprecated(
        this.checker
          .getTypeAtLocation(source.expression)
          .getProperty(source.argumentExpression.text),
      );
    }
    return false;
  }

  private responseField(body: ts.Block, call: ts.CallExpression): string | undefined {
    const returns: ts.ReturnStatement[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isFunctionLike(node) || ts.isClassLike(node)) return;
      if (ts.isReturnStatement(node)) returns.push(node);
      ts.forEachChild(node, visit);
    };
    visit(body);
    const statement = returns[0];
    if (returns.length !== 1 || !statement?.expression || statement.parent !== body)
      return undefined;
    const result = unwrapHelper(statement.expression);
    if (!ts.isPropertyAccessExpression(result) || result.questionDotToken) return undefined;
    const value = unwrap(result.expression);
    if (!ts.isIdentifier(value)) return undefined;
    const source = this.checker.getSymbolAtLocation(value)?.valueDeclaration;
    if (!source || !ts.isVariableDeclaration(source) || !isConst(source) || !source.initializer)
      return undefined;
    const initializer = unwrap(source.initializer);
    return ts.isAwaitExpression(initializer) && unwrapHelper(initializer.expression) === call
      ? result.name.text
      : undefined;
  }

  private calls(body: ts.Block): { method: string; call: ts.CallExpression }[] {
    const calls: { method: string; call: ts.CallExpression }[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        const { name, expression } = node.expression;
        const receiver = this.checker.getTypeAtLocation(expression).getSymbol();
        if (receiver?.getName() === 'HttpClient') {
          calls.push({ method: name.text, call: node });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(body);
    return calls;
  }

  method(node: ts.MethodDeclaration, game: string, className: string): SdkMethod | undefined {
    const name = propertyName(node.name);
    if (
      !node.body ||
      !name ||
      node.modifiers?.some(
        ({ kind }) =>
          kind === ts.SyntaxKind.PrivateKeyword || kind === ts.SyntaxKind.ProtectedKeyword,
      )
    ) {
      return undefined;
    }
    const calls = this.calls(node.body);
    if (calls.length === 0) return undefined;
    const key = `${className}.${name}`;
    const record = {
      game,
      name: key,
      operation: undefined,
      response: undefined,
      query: undefined,
      responseField: undefined,
      deprecated: this.isDeprecated(this.checker.getSymbolAtLocation(node.name)),
      deprecatedInputs: node.parameters.flatMap((parameter) => {
        const type = this.checker.getTypeAtLocation(parameter).getNonNullableType();
        if (
          !hasFlag(type, ts.TypeFlags.Object) ||
          this.checker.isArrayType(type) ||
          this.checker.isTupleType(type) ||
          type.getCallSignatures().length > 0
        )
          return [];
        return type
          .getProperties()
          .filter((property) => this.isDeprecated(property))
          .map((property) => property.getName());
      }),
    };
    const first = calls[0];
    if (!first || calls.length !== 1) return { ...record, limitation: 'HTTP 호출이 여러 개입니다' };
    const { method, call } = first;
    const url = call.arguments[0] && this.url(call.arguments[0], game);
    const path = url && urlPath(url);
    if (!path || !HTTP_METHODS.includes(method)) {
      return { ...record, limitation: 'HTTP 메서드 또는 동적 URL을 해석할 수 없습니다' };
    }
    const operation = `${method.toUpperCase()} ${path}`;
    const type = node.type && this.checker.getTypeFromTypeNode(node.type);
    const response =
      type && type.getSymbol()?.getName() === 'Promise'
        ? this.checker.getAwaitedType(type)
        : undefined;
    const query = this.query(call.arguments[1]);
    const limitation = !response
      ? '선언된 Promise<T> 응답을 해석할 수 없습니다'
      : node.typeParameters?.length
        ? '제네릭 메서드의 응답을 해석할 수 없습니다'
        : undefined;
    return {
      ...record,
      operation,
      query,
      limitation,
      responseField:
        response && primitive(response) === 'string'
          ? this.responseField(node.body, call)
          : undefined,
      response: response && !limitation ? this.shape(response, node) : undefined,
    };
  }
}

function urlPath(url: string): string | undefined {
  return /^(?:https?:\/\/[^/]+)?(\/[^?#]*)/i.exec(url)?.[1];
}

export function normalizedOperation(operation: string): string {
  return operation.replace(/\{[^}]+\}/g, '{}');
}

export function analyzeSdk(root = REPO_ROOT): SdkMethod[] {
  const config = resolve(root, 'tsconfig.json');
  const gameRoot = resolve(root, 'src', 'games');
  const parsed = ts.getParsedCommandLineOfConfigFile(
    config,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      },
    },
  );
  if (!parsed || parsed.errors.length > 0) {
    throw new Error(`TypeScript 설정을 읽지 못했습니다: ${config}`);
  }
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const analyzer = new Analyzer(program.getTypeChecker());
  const prefixes = new Map<string, string>();
  const clients: { node: ts.ClassDeclaration; directory: string; prefix: string | undefined }[] =
    [];
  for (const source of program.getSourceFiles()) {
    const [directory, file] = relative(gameRoot, source.fileName).split(/[\\/]/);
    if (
      !directory ||
      directory.startsWith('_') ||
      directory === '..' ||
      !file ||
      source.isDeclarationFile
    )
      continue;
    for (const node of source.statements) {
      if (!ts.isClassDeclaration(node)) continue;
      const prefix = analyzer.prefix(node);
      if (prefix !== undefined) prefixes.set(directory, prefix);
      clients.push({ node, directory, prefix });
    }
  }
  const methods: SdkMethod[] = [];
  for (const { node, directory, prefix } of clients) {
    const game = prefix ?? prefixes.get(directory) ?? directory;
    for (const member of node.members) {
      if (!ts.isMethodDeclaration(member)) continue;
      const method = analyzer.method(member, game, node.name?.text ?? directory);
      if (method) methods.push(method);
    }
  }
  return methods.sort((a, b) => compareText(a.game, b.game) || compareText(a.name, b.name));
}
