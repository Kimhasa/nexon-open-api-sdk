import { parseArgs } from 'node:util';
import { appendFileSync } from 'node:fs';
import { diffSnapshots, renderDiff, SEVERITIES } from './lib/specs-diff.js';
import { readDirectorySnapshot, readGitSnapshot, readLiveSnapshot } from './lib/specs-snapshot.js';

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      base: { type: 'string', default: 'HEAD' },
      live: { type: 'boolean' },
      json: { type: 'boolean' },
    },
  });
  const before = readGitSnapshot(values.base ?? 'HEAD');
  const after = values.live ? await readLiveSnapshot([...before.keys()]) : readDirectorySnapshot();
  const changes = diffSnapshots(before, after);
  const counts = Object.fromEntries(
    SEVERITIES.map((severity) => [
      `${severity.toLowerCase()}_count`,
      changes.filter((change) => change.severity === severity).length,
    ]),
  );
  console.log(values.json ? JSON.stringify({ counts, changes }, null, 2) : renderDiff(changes));
  const output = process.env['GITHUB_OUTPUT'];
  if (output) {
    appendFileSync(
      output,
      Object.entries(counts)
        .map(([key, value]) => `${key}=${value}\n`)
        .join(''),
    );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
