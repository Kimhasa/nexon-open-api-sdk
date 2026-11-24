import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { analyzeSdk } from './lib/specs-sdk.js';
import { buildDriftReport, parseBaseline, renderDrift } from './lib/specs-drift.js';
import { REPO_ROOT } from './lib/specs-portal.js';
import { readGitSnapshot } from './lib/specs-snapshot.js';

function main(): void {
  const { values } = parseArgs({
    options: {
      game: { type: 'string' },
      json: { type: 'boolean' },
      strict: { type: 'boolean' },
      summary: { type: 'boolean' },
    },
  });
  const input: unknown = JSON.parse(
    readFileSync(resolve(REPO_ROOT, 'specs/drift-baseline.json'), 'utf8'),
  );
  const baseline = parseBaseline(input);
  const report = buildDriftReport(readGitSnapshot('HEAD'), analyzeSdk(), baseline, values.game);
  console.log(
    values.json ? JSON.stringify(report, null, 2) : renderDrift(report, values.summary ?? false),
  );
  if (values.strict && report.newCount > 0) process.exitCode = 1;
}

try {
  main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
