#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const versionPath = join(__dirname, '../src/version.json');

try {
  // Read current version (this is what was just deployed)
  const versionData = JSON.parse(readFileSync(versionPath, 'utf-8'));
  const currentVersion = versionData.version;

  // Parse version for incrementing later
  const versionParts = currentVersion.split('.');
  const major = parseInt(versionParts[0], 10);
  const minor = parseInt(versionParts[1], 10);
  const patch = parseInt(versionParts[2], 10);

  // First, create a tag for the CURRENT deployed version
  const deployedTagName = `v${currentVersion}`;
  try {
    execSync(`git tag -a ${deployedTagName} -m "Release ${currentVersion}"`, {
      stdio: 'inherit',
    });
    console.log(`✓ Git tag created for deployed version: ${deployedTagName}`);
  } catch (tagError) {
    // Tag might already exist, that's okay
    console.warn(`⚠ Git tag creation skipped (may already exist): ${deployedTagName}`);
  }

  // Now increment version for NEXT deployment
  const nextVersion = `${major}.${minor}.${patch + 1}`;

  // Update version only, preserve buildTime from the build step
  versionData.version = nextVersion;
  // Note: buildTime is set during prebuild, not here

  // Write updated version
  writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');

  console.log(
    `✓ Version incremented for next deployment: ${currentVersion} → ${nextVersion}`,
  );

  // Git add and commit with [skip ci]
  try {
    execSync('git add src/version.json', { stdio: 'inherit' });
    execSync(`git commit -m "[skip ci] prepare next version ${nextVersion}"`, {
      stdio: 'inherit',
    });
    console.log('✓ Changes committed to repository');

    execSync('git push --follow-tags', { stdio: 'inherit' });
    console.log('✓ Changes and tags pushed to remote');
  } catch (gitError) {
    console.warn('⚠ Git commit failed. You may need to commit manually.');
    console.warn('Error:', gitError.message);
  }
} catch (error) {
  console.error('✗ Post-deployment version bump failed:', error.message);
  process.exit(1);
}
