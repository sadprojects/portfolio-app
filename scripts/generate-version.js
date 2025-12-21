#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const versionPath = join(__dirname, '../src/version.json');

// Read existing version.json or create new one
let currentVersion = '0.0.2';
if (existsSync(versionPath)) {
  try {
    const existing = JSON.parse(readFileSync(versionPath, 'utf-8'));
    currentVersion = existing.version;
  } catch (error) {
    console.warn('Could not read existing version.json, using default version');
  }
}

// Set the version and build timestamp (epoch ms for timezone-agnostic storage)
const versionInfo = {
  version: currentVersion,
  buildTime: Date.now(),
};

// Write to src/version.json
writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2) + '\n');

console.log('✓ version.json ready:', versionInfo);
