import { compareText, fieldPath, isObject, jsonResponse, markdownCode } from './specs-schema.js';
import type { Operation, Shape } from './specs-schema.js';
import { normalizedOperation } from './specs-sdk.js';
import type { SdkMethod, SdkQueryParameter, SdkShape } from './specs-sdk.js';
import type { Snapshot } from './specs-snapshot.js';

interface BaselineEntry {
  readonly operation: string;
  readonly path: string;
  readonly kind: string;
  readonly reason: string;
}

interface Detail {
  readonly path: string;
  readonly kind: string;
  readonly spec?: string;
  readonly sdk?: string;
}

interface Finding extends Detail {
  readonly operation: string;
  readonly method: string;
  readonly reason?: string;
}

interface Limitation {
  readonly operation: string | undefined;
  readonly method: string;
  readonly path: string;
  readonly reason: string;
}

interface GameReport {
  readonly game: string;
  matchedMethods: number;
  readonly findings: Finding[];
  readonly deprecated: Finding[];
  readonly unresolved: Limitation[];
}

const LIMITS = [
  '직접 HttpClient를 호출하는 공개 메서드의 선언된 Promise 응답과 JSON 200 스키마를 비교합니다. 엔드포인트 누락이나 이미지 URL 헬퍼는 specs:coverage로 확인합니다.',
  '응답에 optional 속성, undefined와 스펙보다 넓은 null 허용 타입을 쓸 수 있습니다. 스펙이 null을 허용하는데 SDK 타입이 이를 수용하지 못하면 drift입니다.',
  '포털에서 제거된 필드, 오퍼레이션, 쿼리를 SDK가 @deprecated로 유지하는 경우 별도로 집계합니다.',
  '조건부 URL, 여러 HTTP 요청을 묶는 메서드, 분석 불가 스키마·타입은 따로 집계합니다.',
  '쿼리는 HTTP 호출 객체의 키와 포털 필수 키의 전달 여부를 비교합니다. 직렬화, 포맷과 값의 범위는 검사하지 않습니다.',
  '단일 문자열 필드를 가진 객체에서 SDK가 해당 필드를 직접 반환하면 그 필드와 응답 타입을 비교합니다. 다른 의도적 변환은 baseline에 기록할 수 있습니다.',
];

function signature(entry: Pick<BaselineEntry, 'operation' | 'path' | 'kind'>): string {
  return JSON.stringify([entry.operation, entry.path, entry.kind]);
}

export function parseBaseline(input: unknown): Map<string, string> {
  if (!Array.isArray(input)) throw new Error('drift baseline은 배열이어야 합니다.');
  const baseline = new Map<string, string>();
  for (const [index, value] of input.entries()) {
    const entry: unknown = value;
    if (!isObject(entry))
      throw new Error(`drift baseline 항목 ${index + 1}의 형식이 잘못되었습니다.`);
    const { operation, path, kind, reason } = entry;
    if (
      typeof operation !== 'string' ||
      !operation.trim() ||
      typeof path !== 'string' ||
      !path.trim() ||
      typeof kind !== 'string' ||
      !kind.trim() ||
      typeof reason !== 'string' ||
      !reason.trim()
    ) {
      throw new Error(
        `drift baseline 항목 ${index + 1}에 operation, path, kind, reason이 필요합니다.`,
      );
    }
    const key = signature({ operation, path, kind });
    if (baseline.has(key)) throw new Error(`중복 drift baseline 항목: ${key}`);
    baseline.set(key, reason);
  }
  return baseline;
}

function compareResponse(
  spec: Shape,
  sdk: SdkShape,
  path: string,
  report: (finding: Detail, deprecated?: boolean) => void,
  unable: (path: string, reason: string) => void,
  ancestors: readonly (readonly [Shape, SdkShape])[] = [],
): void {
  if (ancestors.some(([a, b]) => a === spec && b === sdk)) return;
  if (spec.unsupported || sdk.unsupported || (spec.types.length === 0 && !spec.nullable)) {
    const reason =
      [
        spec.unsupported && `OpenAPI: ${spec.unsupported}`,
        sdk.unsupported && `SDK: ${sdk.unsupported}`,
      ]
        .filter(Boolean)
        .join(', ') || 'OpenAPI 스키마에 타입이 지정되지 않았습니다';
    unable(path, reason);
    return;
  }
  const specTypes = [
    ...new Set(spec.types.map((type) => (type === 'integer' ? 'number' : type))),
  ].sort(compareText);
  const expected = specTypes.join(' | ') || 'null';
  const actual = sdk.types.join(' | ') || (sdk.nullable ? 'null' : 'undefined');
  if (expected !== actual) report({ kind: 'type-mismatch', path, spec: expected, sdk: actual });
  if (spec.nullable && !sdk.nullable) {
    report({
      kind: 'nullable-mismatch',
      path,
      spec: String(spec.nullable),
      sdk: String(sdk.nullable),
    });
  }

  const parents = [...ancestors, [spec, sdk] as const];
  if (specTypes.includes('object') && sdk.types.includes('object')) {
    const fields = [...new Set([...spec.properties.keys(), ...sdk.properties.keys()])].sort(
      compareText,
    );
    for (const field of fields) {
      const specField = spec.properties.get(field);
      const sdkField = sdk.properties.get(field);
      const child = fieldPath(path, field);
      if (!sdkField) report({ path: child, kind: 'missing-sdk-field' });
      else if (!specField) report({ path: child, kind: 'missing-spec-field' }, sdkField.deprecated);
      else compareResponse(specField.shape, sdkField.shape, child, report, unable, parents);
    }
  }
  if (specTypes.includes('array') && sdk.types.includes('array')) {
    if (spec.items && sdk.items) {
      compareResponse(spec.items, sdk.items, `${path}[]`, report, unable, parents);
    } else {
      unable(`${path}[]`, '배열 원소 타입을 해석할 수 없습니다');
    }
  }
}

function compareQuery(
  spec: Operation,
  sdk: ReadonlyMap<string, SdkQueryParameter>,
  deprecatedInputs: readonly string[],
  report: (finding: Detail, deprecated?: boolean) => void,
): void {
  const parameters = new Set<string>();
  for (const parameter of spec.parameters.values()) {
    if (parameter.location !== 'query') continue;
    parameters.add(parameter.name);
    const path = fieldPath('query', parameter.name);
    const input = sdk.get(parameter.name);
    if (!input) report({ path, kind: 'missing-sdk-query' });
    else if (parameter.required && !input.required)
      report({ path, kind: 'required-query-mismatch' });
  }
  const deprecated = new Set(deprecatedInputs);
  for (const name of new Set([...sdk.keys(), ...deprecated])) {
    if (!parameters.has(name))
      report(
        { path: fieldPath('query', name), kind: 'missing-spec-query' },
        sdk.get(name)?.deprecated ?? deprecated.has(name),
      );
  }
}

function gameReport(game: string): GameReport {
  return { game, matchedMethods: 0, findings: [], deprecated: [], unresolved: [] };
}

export function buildDriftReport(
  snapshot: Snapshot,
  methods: readonly SdkMethod[],
  baseline: ReadonlyMap<string, string>,
  onlyGame?: string,
): {
  games: GameReport[];
  newCount: number;
  baselineCount: number;
  deprecatedCount: number;
  limitations: readonly string[];
} {
  const games = new Map([...snapshot.keys()].map((game) => [game, gameReport(game)]));
  const matching = new Map(
    [...snapshot].map(([game, operations]) => {
      const paths = new Map<string, Operation[]>();
      for (const operation of operations.values()) {
        const key = normalizedOperation(operation.key);
        const candidates = paths.get(key) ?? [];
        candidates.push(operation);
        paths.set(key, candidates);
      }
      return [game, paths];
    }),
  );
  for (const method of methods) {
    if (onlyGame && method.game !== onlyGame) continue;
    const row = games.get(method.game) ?? gameReport(method.game);
    games.set(method.game, row);
    const unresolved = (path: string, reason: string): void => {
      row.unresolved.push({ operation: method.operation, method: method.name, path, reason });
    };
    if (!method.operation) {
      unresolved('$', method.limitation ?? '오퍼레이션을 식별할 수 없습니다');
      continue;
    }
    const operations = matching.get(method.game)?.get(normalizedOperation(method.operation)) ?? [];
    const op =
      operations.find(({ key }) => key === method.operation) ??
      (operations.length === 1 ? operations[0] : undefined);
    const operation = op?.key ?? method.operation;
    const report = (detail: Detail, deprecated = false): void => {
      if (deprecated) {
        row.deprecated.push({ operation, method: method.name, ...detail });
        return;
      }
      const reason = baseline.get(signature({ ...detail, operation }));
      row.findings.push({
        operation,
        method: method.name,
        ...detail,
        ...(reason ? { reason } : {}),
      });
    };
    if (!op) {
      if (operations.length > 1)
        unresolved('$', '경로 변수만 다른 여러 포털 오퍼레이션이 있습니다');
      else report({ path: '$', kind: 'missing-spec-operation' }, method.deprecated);
      continue;
    }
    row.matchedMethods++;
    const response = jsonResponse(op);
    if (method.response && response) {
      const projected =
        method.responseField &&
        !response.nullable &&
        !response.unsupported &&
        response.types.length === 1 &&
        response.types[0] === 'object' &&
        response.properties.size === 1
          ? response.properties.get(method.responseField)
          : undefined;
      if (
        projected?.shape.types.length === 1 &&
        projected.shape.types[0] === 'string' &&
        method.responseField
      ) {
        compareResponse(
          projected.shape,
          method.response,
          fieldPath('response', method.responseField),
          report,
          unresolved,
        );
      } else {
        compareResponse(response, method.response, 'response', report, unresolved);
      }
    } else {
      unresolved('response', method.limitation ?? 'JSON 200 응답 스키마가 없습니다');
    }
    if (method.query) compareQuery(op, method.query, method.deprecatedInputs, report);
    else unresolved('query', '동적 쿼리 키를 해석할 수 없습니다');
  }
  if (onlyGame && !games.has(onlyGame)) throw new Error(`알 수 없는 게임 slug: ${onlyGame}`);
  const rows = [...games.values()]
    .filter(({ game }) => !onlyGame || game === onlyGame)
    .sort((a, b) => compareText(a.game, b.game));
  let newCount = 0;
  let baselineCount = 0;
  let deprecatedCount = 0;
  const compareFindings = (a: Finding, b: Finding): number =>
    compareText(a.operation, b.operation) ||
    compareText(a.path, b.path) ||
    compareText(a.kind, b.kind) ||
    compareText(a.method, b.method);
  for (const row of rows) {
    row.findings.sort(compareFindings);
    row.deprecated.sort(compareFindings);
    deprecatedCount += row.deprecated.length;
    baselineCount += row.findings.filter(({ reason }) => reason !== undefined).length;
    newCount += row.findings.filter(({ reason }) => reason === undefined).length;
  }
  return { games: rows, newCount, baselineCount, deprecatedCount, limitations: LIMITS };
}

export function renderDrift(report: ReturnType<typeof buildDriftReport>, summary: boolean): string {
  const lines = [
    '## SDK drift',
    '',
    `Baseline 외 ${report.newCount}건 · baseline ${report.baselineCount}건 · deprecated로 유지 중 ${report.deprecatedCount}건`,
    '',
    '| 게임 | 매칭한 SDK 메서드 | Baseline 외 | Baseline | Deprecated 유지 | 분석 불가 |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const row of report.games) {
    const accepted = row.findings.filter(({ reason }) => reason !== undefined).length;
    lines.push(
      `| ${row.game} | ${row.matchedMethods} | ${row.findings.length - accepted} | ${accepted} | ${row.deprecated.length} | ${row.unresolved.length} |`,
    );
  }
  if (!summary) {
    for (const row of report.games) {
      if (row.findings.length === 0 && row.deprecated.length === 0 && row.unresolved.length === 0)
        continue;
      lines.push('', `### ${row.game}`, '');
      for (const finding of row.findings) {
        const types =
          finding.spec === undefined
            ? ''
            : ` · 스펙 ${markdownCode(finding.spec)}, SDK ${markdownCode(finding.sdk ?? '')}`;
        const baseline =
          finding.reason === undefined ? '' : ` · baseline ${markdownCode(finding.reason)}`;
        lines.push(
          `- ${markdownCode(finding.operation)} ${markdownCode(finding.path)} · ${finding.kind} (${finding.method})${types}${baseline}`,
        );
      }
      for (const item of row.unresolved) {
        lines.push(
          `- 분석 불가 · ${markdownCode(item.method)} ${markdownCode(item.path)} · ${markdownCode(item.reason)}`,
        );
      }
      for (const item of row.deprecated) {
        lines.push(
          `- Deprecated 유지 · ${markdownCode(item.operation)} ${markdownCode(item.path)} · ${item.kind} (${item.method})`,
        );
      }
    }
  }
  lines.push('', '### 분석 범위', '', ...report.limitations.map((item) => `- ${item}`), '');
  return lines.join('\n');
}
