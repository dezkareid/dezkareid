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

  it('should run only Claude strategy when selected', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agent Context');

    await engine.sync(tempDir, 'claude');

    const claudePath = path.join(tempDir, 'CLAUDE.md');
    expect(await fs.pathExists(claudePath)).toBe(true);

    const geminiDir = path.join(tempDir, '.gemini');
    expect(await fs.pathExists(geminiDir)).toBe(false);
  });

  it('should run only Gemini strategy when selected', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agent Context');

    await engine.sync(tempDir, 'gemini');

    const claudePath = path.join(tempDir, 'CLAUDE.md');
    expect(await fs.pathExists(claudePath)).toBe(false);

    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    expect(await fs.pathExists(settingsPath)).toBe(true);
  });

  it('should run Gemini Markdown strategy when selected', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agent Context');

    await engine.sync(tempDir, 'gemini-md');

    const geminiMdPath = path.join(tempDir, 'GEMINI.md');
    expect(await fs.pathExists(geminiMdPath)).toBe(true);
    const stats = await fs.lstat(geminiMdPath);
    expect(stats.isSymbolicLink()).toBe(true);
  });

  it('should run multiple selected strategies from array', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agent Context');

    await engine.sync(tempDir, ['claude', 'gemini']);

    expect(await fs.pathExists(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, '.gemini', 'settings.json'))).toBe(true);
  });

  it('should run all strategies when "all" is selected', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agent Context');

    await engine.sync(tempDir, 'all');

    expect(await fs.pathExists(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, '.gemini', 'settings.json'))).toBe(true);
  });

  it('should throw error for invalid strategy', async () => {
    const engine = new SyncEngine();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agent Context');

    await expect(engine.sync(tempDir, 'invalid')).rejects.toThrow('No valid strategies found for: invalid. Available strategies: claude, gemini, gemini-md');
  });
});
