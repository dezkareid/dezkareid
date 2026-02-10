import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SyncEngine } from './engine.js';
import { AGENTS_FILENAME } from './constants.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('SyncEngine', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sync-engine-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should throw error if AGENTS.md is missing', async () => {
    const engine = new SyncEngine();
    await expect(engine.sync(tempDir)).rejects.toThrow(`${AGENTS_FILENAME} not found`);
  });

  it('should run all strategies when AGENTS.md exists', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    const context = '# Agent Context';
    await fs.writeFile(agentsPath, context);

    await engine.sync(tempDir);

    // Verify Claude
    const claudePath = path.join(tempDir, 'CLAUDE.md');
    expect(await fs.pathExists(claudePath)).toBe(true);
    expect(await fs.readFile(claudePath, 'utf-8')).toBe(context);

    // Verify Gemini
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    expect(await fs.pathExists(settingsPath)).toBe(true);
    const settings = await fs.readJson(settingsPath);
    expect(settings.context.fileName).toContain(AGENTS_FILENAME);
  });
});
