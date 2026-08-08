#!/usr/bin/env node
// Shared TCP port registry so parallel Superset workspaces for this repo
// don't collide on dev-server ports. The registry lives outside the repo
// (~/.superset/port-allocations.json) so it's shared across every workspace
// on this machine, keyed by "<workspace path>#<service>".
import { createServer } from 'node:net';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

const REGISTRY_PATH = join(homedir(), '.superset', 'port-allocations.json');

function loadRegistry() {
  if (!existsSync(REGISTRY_PATH)) return {};
  try {
    return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveRegistry(registry) {
  mkdirSync(dirname(REGISTRY_PATH), { recursive: true });
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = createServer();
    srv.once('error', () => resolve(false));
    srv.listen(port, '127.0.0.1', () => srv.close(() => resolve(true)));
  });
}

async function alloc(key, rangeStart, rangeEnd) {
  const registry = loadRegistry();

  const existing = registry[key];
  if (existing && (await isPortFree(existing))) {
    console.log(existing);
    return;
  }

  const taken = new Set(Object.values(registry));
  for (let port = rangeStart; port <= rangeEnd; port += 1) {
    if (taken.has(port)) continue;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) {
      registry[key] = port;
      saveRegistry(registry);
      console.log(port);
      return;
    }
  }

  throw new Error(`No free port in range ${rangeStart}-${rangeEnd} for "${key}"`);
}

function release(key) {
  const registry = loadRegistry();
  if (key in registry) {
    delete registry[key];
    saveRegistry(registry);
  }
}

function get(key) {
  const registry = loadRegistry();
  if (registry[key]) console.log(registry[key]);
}

const [, , command, key, rangeStartArg, rangeEndArg] = process.argv;

if (!command || !key) {
  console.error('Usage: ports.mjs <alloc|release|get> <key> [rangeStart] [rangeEnd]');
  process.exit(1);
}

switch (command) {
  case 'alloc':
    await alloc(key, Number(rangeStartArg) || 3000, Number(rangeEndArg) || 3999);
    break;
  case 'release':
    release(key);
    break;
  case 'get':
    get(key);
    break;
  default:
    console.error('Usage: ports.mjs <alloc|release|get> <key> [rangeStart] [rangeEnd]');
    process.exit(1);
}
