#!/usr/bin/env node
// Prints scripts/cv/index.html to the CV the site links to, with headless Chrome: the same way the first one was made.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGE = pathToFileURL(resolve(import.meta.dirname, 'cv/index.html')).href;
const OUT = resolve(
  import.meta.dirname,
  '../public/media/cv/Silviu_Alexandru_Dinu_CV_EN.pdf',
);
const PORT = 9800 + Math.floor(Math.random() * 100);
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cv-'))}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);
let targets;
for (let attempt = 0; attempt < 40 && !targets; attempt++) {
  await sleep(250);
  try {
    targets = await (await fetch(`http://localhost:${PORT}/json`)).json();
  } catch {
    /* not up yet */
  }
}
const ws = new WebSocket(
  targets.find((t) => t.type === 'page').webSocketDebuggerUrl,
);
await new Promise((open) => (ws.onopen = open));
let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!pending.has(message.id)) return;
  const { done, fail } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) fail(new Error(JSON.stringify(message.error)));
  else done(message.result);
};
const send = (method, params = {}) =>
  new Promise((done, fail) => {
    const id = ++nextId;
    pending.set(id, { done, fail });
    ws.send(JSON.stringify({ id, method, params }));
  });

await send('Page.enable');
await send('Page.navigate', { url: PAGE });
await sleep(1500);
const { data } = await send('Page.printToPDF', {
  printBackground: true,
  preferCSSPageSize: true,
});
writeFileSync(OUT, Buffer.from(data, 'base64'));
ws.close();
chrome.kill();
console.log('✓ CV printed to', OUT);
