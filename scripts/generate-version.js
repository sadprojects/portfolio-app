#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const versionPath = join(__dirname, '../src/version.json');

// Keep the current version (or start one); the build time is epoch ms, so timezone-agnostic.
const readVersion = () => {
  try {
    return JSON.parse(readFileSync(versionPath, 'utf-8')).version;
  } catch {
    console.warn('Could not read existing version.json, using default version');
    return '0.0.2';
  }
};
const versionInfo = { version: readVersion(), buildTime: Date.now() };

// Write to src/version.json
writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2) + '\n');

console.log('✓ version.json ready:', versionInfo);
