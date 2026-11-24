import { ok as assert } from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { REPO_ROOT } from './lib/specs-portal.js';

const require = createRequire(import.meta.url);
const entries = {
  sdk: 'nexon-open-api',
  fc: 'nexon-open-api/fconline',
  tfd: 'nexon-open-api/first-descendant',
  suddenAttack: 'nexon-open-api/sudden-attack',
};

function npm(args: string[], cwd: string, packDestination?: string): string {
  // On Windows npm is a cmd shim. All command arguments are fixed by this script.
  const windows = process.platform === 'win32';
  return execFileSync(windows ? 'cmd.exe' : 'npm', windows ? ['/d', '/c', 'npm', ...args] : args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...(packDestination ? { npm_config_pack_destination: packDestination } : {}),
    },
  });
}

async function main(): Promise<void> {
  assert(
    existsSync(resolve(REPO_ROOT, 'dist/index.js')),
    'dist/index.js를 찾을 수 없습니다. 먼저 yarn build를 실행하세요.',
  );
  const directory = mkdtempSync(resolve(tmpdir(), 'nexon-sdk-package-'));
  try {
    const packed: unknown = JSON.parse(
      npm(['pack', '--offline', '--ignore-scripts', '--json'], REPO_ROOT, directory),
    );
    assert(
      Array.isArray(packed) && packed.length === 1,
      'npm pack 결과에 패키지가 하나 있어야 합니다.',
    );
    const { filename } = packed[0] as { filename?: string };
    assert(
      typeof filename === 'string' && /^nexon-open-api-[\w.-]+\.tgz$/.test(filename),
      'npm pack 결과에 tarball 이름이 없습니다.',
    );
    renameSync(resolve(directory, filename), resolve(directory, 'package.tgz'));
    console.log('PASS npm pack (' + filename + ')');

    npm(['init', '-y'], directory);
    npm(
      ['install', './package.tgz', '--offline', '--ignore-scripts', '--no-audit', '--no-fund'],
      directory,
    );
    console.log('PASS npm install --offline (레지스트리 연결 불필요)');

    const consumerBody = [
      "assert.equal(typeof fc.FcOnlineClient.prototype.getMatchTypeMeta, 'function');",
      "const client = new sdk.NexonClient({ apiKey: 'sdk-package-smoke-invalid', maxRetries: 0 });",
      'const metadata = await client.fcOnline.getMatchTypeMeta();',
      'assert(Array.isArray(metadata) && metadata.length > 0);',
      "assert(metadata.every((row) => typeof row.matchtype === 'number' && typeof row.desc === 'string'));",
      "console.log(metadata.length + '건');",
    ].join('\n');
    const runtimeScripts = {
      'runtime.cjs': [
        "const assert = require('node:assert/strict');",
        "const sdk = require('nexon-open-api');",
        "const fc = require('nexon-open-api/fconline');",
        '(async () => {',
        consumerBody,
        '})().catch((error) => { console.error(error); process.exitCode = 1; });',
      ],
      'runtime.mjs': [
        "import assert from 'node:assert/strict';",
        "import * as sdk from 'nexon-open-api';",
        "import * as fc from 'nexon-open-api/fconline';",
        consumerBody,
      ],
    };
    for (const [file, lines] of Object.entries(runtimeScripts)) {
      writeFileSync(resolve(directory, file), lines.join('\n'));
      const count = execFileSync(process.execPath, [file], { cwd: directory, encoding: 'utf8' });
      console.log('PASS ' + file + ' FC 메타데이터 GET (' + count.trim() + ')');
      await delay(150);
    }

    const typeChecks = [
      "const client = new sdk.NexonClient({ apiKey: 'sdk-package-smoke-invalid' });",
      'const fcApi: fc.FcOnlineClient = client.fcOnline;',
      'const metadata: Promise<fc.FcMatchTypeMeta[]> = fcApi.getMatchTypeMeta();',
      'const tfdApi: tfd.FirstDescendantMetaClient = client.firstDescendant.meta;',
      'const suddenAttackApi: suddenAttack.SuddenAttackMetadataClient = client.suddenAttack.metadata;',
    ];
    const consumerImports = Object.entries(entries);
    writeFileSync(
      resolve(directory, 'consumer.cts'),
      [
        ...consumerImports.map(
          ([name, specifier]) => 'import ' + name + " = require('" + specifier + "');",
        ),
        ...typeChecks,
      ].join('\n'),
    );
    writeFileSync(
      resolve(directory, 'consumer.mts'),
      [
        ...consumerImports.map(
          ([name, specifier]) => 'import * as ' + name + " from '" + specifier + "';",
        ),
        ...typeChecks,
      ].join('\n'),
    );

    const tsc = require.resolve('typescript/bin/tsc');
    const compilerCases = [
      ['consumer.cts', 'node16', 'node16'],
      ['consumer.mts', 'node16', 'node16'],
      ['consumer.mts', 'esnext', 'bundler'],
    ] as const;
    for (const [file, module, resolution] of compilerCases) {
      execFileSync(
        process.execPath,
        [
          tsc,
          '--noEmit',
          '--strict',
          '--verbatimModuleSyntax',
          '--target',
          'es2022',
          '--module',
          module,
          '--moduleResolution',
          resolution,
          file,
        ],
        { cwd: directory, stdio: 'inherit' },
      );
      console.log('PASS ' + file + ' (module ' + module + ', resolution ' + resolution + ')');
    }
  } finally {
    // directory is the fresh absolute temp path returned by mkdtempSync.
    rmSync(directory, { recursive: true, force: true, maxRetries: 3 });
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
