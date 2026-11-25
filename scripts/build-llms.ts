/**
 * AI 코딩 도구가 읽는 `llms-full.txt` 를 소스에서 만든다.
 *
 * 게임 클라이언트의 공개 메서드 시그니처와 JSDoc 첫 줄(게임 용어 설명)을 모아,
 * AI가 포털 스펙 대신 이 SDK의 검증된 메서드·필드 이름으로 코드를 짜게 한다.
 * 소스가 바뀌면 다시 만들어야 하므로 CI는 `--check` 로 최신인지 확인한다.
 *
 * 사용법:
 *   yarn docs:llms           # llms-full.txt 를 다시 쓴다
 *   yarn docs:llms --check   # 최신이 아니면 exit 1
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import ts from 'typescript';
import { REPO_ROOT } from './lib/specs-portal.js';

const OUTPUT = resolve(REPO_ROOT, 'llms-full.txt');
const REPO_URL = 'https://github.com/Kimhasa/nexon-open-api-sdk';
const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } });

// 게임 진입 프로퍼티 → 창작자가 부르는 게임 이름과 문서
const GAMES: Record<string, { name: string; doc: string }> = {
  maplestory: { name: '메이플스토리', doc: 'docs/maplestory.md' },
  maplestorym: { name: '메이플스토리M', doc: 'docs/maplestory-m.md' },
  maplestorySEA: { name: 'MapleStorySEA', doc: 'docs/maplestory-sea.md' },
  maplestoryTW: { name: 'MapleStoryTaiwan', doc: 'docs/maplestory-tw.md' },
  fcOnline: { name: 'EA SPORTS FC 온라인', doc: 'docs/fc-online.md' },
  firstDescendant: { name: '퍼스트 디센던트', doc: 'docs/first-descendant.md' },
  mabinogiHeroes: { name: '마비노기 영웅전', doc: 'docs/mabinogi-heroes.md' },
  suddenAttack: { name: '서든어택', doc: 'docs/sudden-attack.md' },
  kartrider: { name: '카트라이더 러쉬플러스', doc: 'docs/kartrider.md' },
  baram: { name: '바람의나라', doc: 'docs/baram.md' },
  mabinogi: { name: '마비노기', doc: 'docs/mabinogi.md' },
  baramYeon: { name: '바람의나라: 연', doc: 'docs/baram-yeon.md' },
  v4: { name: 'V4', doc: 'docs/v4.md' },
  hit2: { name: '히트2', doc: 'docs/hit2.md' },
  platform: { name: 'NEXON Open API 공지', doc: 'docs/platform.md' },
};

interface ClassInfo {
  readonly getters: { readonly name: string; readonly type: string }[];
  readonly methods: {
    readonly name: string;
    readonly signature: string;
    readonly summary: string;
    readonly deprecated: boolean;
  }[];
}

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path);
    return entry.name.endsWith('.ts') ? [path] : [];
  });
}

function isPublic(node: ts.ClassElement): boolean {
  return !ts
    .getModifiers(node as ts.HasModifiers)
    ?.some(
      ({ kind }) =>
        kind === ts.SyntaxKind.PrivateKeyword ||
        kind === ts.SyntaxKind.ProtectedKeyword ||
        kind === ts.SyntaxKind.StaticKeyword,
    );
}

function jsDocSummary(node: ts.Node): { summary: string; deprecated: boolean } {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
  const doc = docs[docs.length - 1];
  const text =
    typeof doc?.comment === 'string' ? doc.comment : (ts.getTextOfJSDocComment(doc?.comment) ?? '');
  const summary =
    text
      .split(/\r?\n\s*\r?\n/)[0]
      ?.replace(/\s+/g, ' ')
      .trim() ?? '';
  const deprecated = doc?.tags?.some((tag) => tag.tagName.text === 'deprecated') ?? false;
  return { summary, deprecated };
}

function collectClasses(root: string): Map<string, ClassInfo> {
  const classes = new Map<string, ClassInfo>();
  for (const file of [
    resolve(root, 'src', 'NexonClient.ts'),
    ...files(resolve(root, 'src', 'games')),
  ]) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    for (const statement of source.statements) {
      if (!ts.isClassDeclaration(statement) || !statement.name) continue;
      const info: ClassInfo = { getters: [], methods: [] };
      for (const member of statement.members) {
        if (!isPublic(member) || !member.name || !ts.isIdentifier(member.name)) continue;
        if (ts.isGetAccessorDeclaration(member) && member.type) {
          info.getters.push({ name: member.name.text, type: member.type.getText(source) });
        } else if (ts.isMethodDeclaration(member)) {
          const params = member.parameters
            .map((p) => p.getText(source).replace(/\s+/g, ' '))
            .join(', ');
          const returns = member.type
            ? `: ${member.type.getText(source).replace(/\s+/g, ' ')}`
            : '';
          info.methods.push({
            name: member.name.text,
            signature: `${member.name.text}(${params})${returns}`,
            ...jsDocSummary(member),
          });
        }
      }
      classes.set(statement.name.text, info);
    }
  }
  return classes;
}

function render(root: string): string {
  const classes = collectClasses(root);
  const nexon = classes.get('NexonClient');
  if (!nexon) throw new Error('src/NexonClient.ts 에서 NexonClient 를 찾지 못했습니다.');
  const lines: string[] = [HEADER.trim(), ''];
  let total = 0;
  for (const getter of nexon.getters) {
    const game = GAMES[getter.name];
    if (!game) throw new Error(`게임 이름 표에 없는 클라이언트: client.${getter.name}`);
    lines.push(
      `## ${game.name} — \`client.${getter.name}\``,
      '',
      `문서: ${REPO_URL}/blob/main/${game.doc}`,
      '',
    );
    const walk = (className: string, path: string): void => {
      const info = classes.get(className);
      if (!info) throw new Error(`클래스를 찾지 못했습니다: ${className}`);
      for (const method of info.methods) {
        if (method.deprecated) continue;
        total += 1;
        lines.push(
          `- \`${path}.${method.signature}\`${method.summary ? ` — ${method.summary}` : ''}`,
        );
      }
      for (const child of info.getters) walk(child.type, `${path}.${child.name}`);
    };
    walk(getter.type, `client.${getter.name}`);
    lines.push('');
  }
  const helpers = rootFunctions(root);
  lines.push(
    '## 도우미 함수 — `nexon-open-api` 에서 바로 import',
    '',
    '넥슨에 요청을 보내지 않고 받은 데이터를 다루는 함수다. 예: 메이플 캐릭터 외형 이미지의 동작·표정 주소, 잠재능력 옵션 문자열("STR +12%") 파싱과 합산, 로그용 식별자 마스킹.',
    '',
    ...helpers.map(
      (helper) => `- \`${helper.signature}\`${helper.summary ? ` — ${helper.summary}` : ''}`,
    ),
    '',
    `(공개 메서드 ${total}개, 도우미 함수 ${helpers.length}개. 더 이상 권장하지 않는 메서드는 뺐다. 이 파일은 \`${relative(root, resolve(root, 'scripts', 'build-llms.ts')).replaceAll('\\', '/')}\` 가 소스에서 만든다.)`,
  );
  return `${lines.join('\n')}\n`;
}

/** 루트 진입점(`src/index.ts`)이 내보내는 함수의 시그니처와 JSDoc 첫 문단 */
function rootFunctions(root: string): { signature: string; summary: string }[] {
  const indexPath = resolve(root, 'src', 'index.ts');
  const index = ts.createSourceFile(
    indexPath,
    readFileSync(indexPath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  // 내보낸 이름(명시 export) 또는 파일 전체(export *)
  const wanted = new Map<string, Set<string> | 'all'>();
  for (const statement of index.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue;
    const specifier = statement.moduleSpecifier;
    if (!specifier || !ts.isStringLiteral(specifier)) continue;
    const file = resolve(root, 'src', specifier.text.replace(/\.js$/, '.ts'));
    if (!statement.exportClause) {
      wanted.set(file, 'all');
    } else if (ts.isNamedExports(statement.exportClause)) {
      const names = wanted.get(file);
      const set = names instanceof Set ? names : new Set<string>();
      for (const element of statement.exportClause.elements) {
        if (!element.isTypeOnly) set.add((element.propertyName ?? element.name).text);
      }
      if (names !== 'all') wanted.set(file, set);
    }
  }
  const result: { signature: string; summary: string }[] = [];
  const visit = (file: string, names: Set<string> | 'all'): void => {
    let text: string;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      return;
    }
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
      // 재노출(export { x } from './y.js')은 따라간다
      if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
        const specifier = statement.moduleSpecifier;
        if (ts.isStringLiteral(specifier) && !statement.isTypeOnly) {
          visit(resolve(file, '..', specifier.text.replace(/\.js$/, '.ts')), names);
        }
        continue;
      }
      if (!ts.isFunctionDeclaration(statement) || !statement.name) continue;
      const exported = ts
        .getModifiers(statement)
        ?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword);
      if (!exported || (names !== 'all' && !names.has(statement.name.text))) continue;
      const params = statement.parameters
        .map((p) => p.getText(source).replace(/\s+/g, ' '))
        .join(', ');
      const returns = statement.type
        ? `: ${statement.type.getText(source).replace(/\s+/g, ' ')}`
        : '';
      const { summary, deprecated } = jsDocSummary(statement);
      if (!deprecated)
        result.push({ signature: `${statement.name.text}(${params})${returns}`, summary });
    }
  };
  for (const [file, names] of wanted) visit(file, names);
  return result.sort((a, b) => a.signature.localeCompare(b.signature));
}

const HEADER = `
# nexon-open-api — AI 코딩 도구용 전체 안내

> NEXON Open API의 14개 게임과 공지를 조회하는 비공식 TypeScript/JavaScript 라이브러리다. npm 패키지 이름은 \`nexon-open-api\` 이다. Node.js 18 이상이며 의존성은 0개, CJS·ESM을 모두 지원한다.
> 응답 타입은 2026-11-24 게임별 실제 API Key로 실서버 응답과 중첩 필드까지 대조해 맞췄다 (263개 API, 공개 캐릭터 42명). 포털 OpenAPI 스펙과 실제 응답이 다른 600여 곳(필드 이름, null, 숫자·문자열, 배열·객체)은 실제 응답을 따른다.

## 이 SDK로 코드를 짤 때 지킬 것

1. \`https://open.api.nexon.com\` 을 직접 fetch하지 말고 \`nexon-open-api\` 를 쓴다. 포털 스펙의 필드 이름을 추측해 쓰지 말고 아래 메서드와 TypeScript 타입(자동완성)을 따른다. 예: 장비 업그레이드 가능 횟수는 \`scroll_upgradeable_count\` 다 (스펙의 \`scroll_upgradable_count\` 는 실제로 오지 않는다).
2. 클라이언트는 \`new NexonClient({ apiKey: process.env.NEXON_API_KEY })\` 로 만든다. **API Key는 게임별로 발급된다.** 여러 게임을 다루면 게임마다 API Key를 발급받아 클라이언트를 각각 생성한다. API Key는 서버·봇에서만 쓰고 브라우저 코드에 넣지 않는다.
3. 조회는 보통 2단계다: 이름 → 식별자(\`getOcid\`/\`getOuid\`) → 정보 조회. 식별자(ocid·ouid)는 비밀처럼 다룬다. 화면·URL·로그에 원문을 남기지 않는다 (\`maskIdentifier\` 로 앞 8자만).
4. 없는 이름이면 \`NexonNotFoundError\` 가 난다 (넥슨은 OPENAPI00004를 주지만 SDK가 바꿔 준다). 사용자에게는 "캐릭터를 찾을 수 없어요"처럼 상황에 맞는 문구를 보여 준다.
5. 날짜(\`date\`)가 선택인 조회는 **최신 데이터가 필요하면 date를 생략**한다. 오늘·미래 날짜는 넣지 않는다. 랭킹처럼 date가 필수인 조회는 어제 날짜를 기본으로 쓴다.
6. 에러는 \`instanceof\` 로 나눈다: \`NexonNotFoundError\`(없는 캐릭터), \`NexonBadRequestError\`(입력 오류, 요청 전에 SDK가 검사), \`NexonDataNotReadyError\`(데이터 준비 중), \`NexonMaintenanceError\`(점검 중, \`NexonServerError\` 보다 먼저 검사), \`NexonAuthError\`(유효하지 않은 API Key·다른 게임의 API Key 사용), \`NexonRateLimitError\`(호출량 초과), \`NexonServerError\`(NEXON Open API 서버 오류). 모두 \`NexonError\` 를 상속한다. 429·5xx는 SDK가 자동으로 다시 시도한다.
7. 호출 허용량은 애플리케이션 타입에 따라 다르다. 개발 단계는 초당 5건·1일 1,000건, 서비스 단계는 초당 500건·1일 20,000,000건이다. 호출량은 애플리케이션별로 합산된다. 캐릭터 카드 한 장에 8회 안팎이 드므로 결과를 캐시한다.
8. 화면에 출처 "Data based on NEXON Open API" 를 표기하고, 저장한 데이터는 30일 이내에 다시 받아 갱신한다 (넥슨 이용 규칙).
9. 응답 필드는 null일 수 있다(장착하지 않은 장비, 날짜를 생략한 조회의 \`date\` 등). 타입에 \`| null\` 이 있으면 반드시 확인한다.

## 기본 예

\`\`\`js
import { NexonClient, NexonNotFoundError } from 'nexon-open-api';

const client = new NexonClient({ apiKey: process.env.NEXON_API_KEY });
try {
  const ocid = await client.maplestory.getOcid('캐릭터명');
  const basic = await client.maplestory.character.getBasic({ ocid }); // date 생략 = 최신
  console.log(\`\${basic.character_name} Lv.\${basic.character_level} \${basic.character_class}\`);
} catch (err) {
  if (err instanceof NexonNotFoundError) console.log('캐릭터를 찾을 수 없어요');
  else throw err;
}
\`\`\`

## 더 읽을 문서

- 시작 가이드: ${REPO_URL}/blob/main/docs/getting-started.md
- FAQ(상황별 에러와 해결): ${REPO_URL}/blob/main/docs/faq.md
- AI 도구와 함께 쓰기: ${REPO_URL}/blob/main/docs/ai-guide.md
- 예제: ${REPO_URL}/tree/main/examples
- 넥슨 공식 AI 에이전트 가이드(원 API의 함정): https://openapi.nexon.com/ko/guide/ai-agent/

## 게임별 공개 메서드

시그니처의 타입 이름은 패키지에서 \`import type\` 으로 가져올 수 있다. 응답 필드는 에디터 자동완성으로 확인한다.
`;

const content = render(REPO_ROOT);
if (values.check) {
  let current = '';
  try {
    current = readFileSync(OUTPUT, 'utf8');
  } catch {
    // 파일이 없으면 최신이 아니다
  }
  if (current.replace(/\r\n/g, '\n') !== content) {
    console.error(
      'llms-full.txt 가 소스와 다릅니다.\n→ corepack yarn docs:llms 로 다시 만든 뒤 커밋하세요.',
    );
    process.exit(1);
  }
  console.log('llms-full.txt 최신');
} else {
  writeFileSync(OUTPUT, content);
  console.log(`llms-full.txt 를 썼습니다 (${content.split('\n').length}줄).`);
}
