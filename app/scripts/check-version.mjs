import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const repoRoot = resolve(appRoot, '..');

const rootVersion = readFileSync(resolve(repoRoot, 'VERSION'), 'utf8').trim();
const packageJson = JSON.parse(
  readFileSync(resolve(appRoot, 'package.json'), 'utf8'),
);
const versionSource = readFileSync(resolve(appRoot, 'src/version.ts'), 'utf8');
const changelog = readFileSync(resolve(repoRoot, 'CHANGELOG.md'), 'utf8');

const sourceMatch = versionSource.match(/APP_VERSION\s*=\s*'([^']+)'/);
const sourceVersion = sourceMatch?.[1];

const problems = [];
if (packageJson.version !== rootVersion) {
  problems.push(`package.json version ${packageJson.version} != VERSION ${rootVersion}`);
}
if (sourceVersion !== rootVersion) {
  problems.push(`APP_VERSION ${sourceVersion ?? 'missing'} != VERSION ${rootVersion}`);
}
if (!changelog.includes(`## ${rootVersion} `)) {
  problems.push(`CHANGELOG.md missing latest section for ${rootVersion}`);
}

if (problems.length > 0) {
  console.error('Version check failed:');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`Version check passed: ${rootVersion}`);
