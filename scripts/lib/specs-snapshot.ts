import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { collectPortal, REPO_ROOT, SPECS_DIR } from './specs-portal.js';
import { compareText, readOperations } from './specs-schema.js';
import type { Operation } from './specs-schema.js';

export type Snapshot = Map<string, Map<string, Operation>>;

const SPEC_PATH = 'specs/openapi/';
const YAML_FILE = /^([^/]+)\/[^/]+\.ya?ml$/;

function git(args: string[]): Buffer {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function loadSnapshot(files: string[], read: (file: string) => Buffer): Snapshot {
  const snapshot: Snapshot = new Map();
  for (const file of files.sort(compareText)) {
    const game = YAML_FILE.exec(file)?.[1];
    if (game === undefined) continue;
    const operations = snapshot.get(game) ?? new Map<string, Operation>();
    for (const operation of readOperations(game, file, read(file))) {
      // 포털이 같은 오퍼레이션을 여러 카테고리에 싣는 경우 첫 파일을 사용한다.
      if (!operations.has(operation.key)) operations.set(operation.key, operation);
    }
    snapshot.set(game, operations);
  }
  return snapshot;
}

export function readGitSnapshot(ref: string): Snapshot {
  const commit = git(['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`])
    .toString()
    .trim();
  const files = git(['ls-tree', '-r', '--name-only', '-z', commit, '--', SPEC_PATH])
    .toString()
    .split('\0')
    .filter((file) => file.startsWith(SPEC_PATH))
    .map((file) => file.slice(SPEC_PATH.length));
  return loadSnapshot(files, (file) => git(['show', `${commit}:${SPEC_PATH}${file}`]));
}

export function readDirectorySnapshot(directory: string = SPECS_DIR): Snapshot {
  const files = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap(({ name }) =>
      readdirSync(resolve(directory, name), { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => `${name}/${entry.name}`),
    );
  return loadSnapshot(files, (file) => readFileSync(resolve(directory, file)));
}

export async function readLiveSnapshot(seedSlugs: string[]): Promise<Snapshot> {
  const { files } = await collectPortal({ seedSlugs });
  const directory = mkdtempSync(resolve(tmpdir(), 'nexon-specs-'));
  try {
    for (const [file, bytes] of files) {
      const dest = resolve(directory, file);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, bytes);
    }
    return readDirectorySnapshot(directory);
  } finally {
    rmSync(directory, { recursive: true });
  }
}
