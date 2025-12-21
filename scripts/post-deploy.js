#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const versionPath = join(__dirname, '../src/version.json');

try {
  // Read current version
  const versionData = JSON.parse(readFileSync(versionPath, 'utf-8'));

  // Parse and increment version (semantic versioning)
  const versionParts = versionData.version.split('.');
  const major = parseInt(versionParts[0], 10);
  const minor = parseInt(versionParts[1], 10);
  const patch = parseInt(versionParts[2], 10);

  // Increment patch version
  const newVersion = `${major}.${minor}.${patch + 1}`;

  // Update version only, preserve buildTime from the build step
  versionData.version = newVersion;
  // Note: buildTime is set during prebuild, not here

  // Write updated version
  writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');

  console.log(
    `✓ Version incremented: ${versionParts.join('.')} → ${newVersion}`,
  );

  // Git add and commit with [skip ci]
  try {
    execSync('git add src/version.json', { stdio: 'inherit' });
    execSync(`git commit -m "[skip ci] bump version to ${newVersion}"`, {
      stdio: 'inherit',
    });
    console.log('✓ Changes committed to repository');

    // Optionally push to remote
    // Uncomment the next line if you want to auto-push
    // execSync('git push', { stdio: 'inherit' });
    // console.log('✓ Changes pushed to remote');
  } catch (gitError) {
    console.warn('⚠ Git commit failed. You may need to commit manually.');
    console.warn('Error:', gitError.message);
  }
} catch (error) {
  console.error('✗ Post-deployment version bump failed:', error.message);
  process.exit(1);
}
