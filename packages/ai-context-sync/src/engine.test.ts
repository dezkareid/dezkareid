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

  describe('targetDir option', () => {
    let targetDir: string;

    beforeEach(async () => {
      targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sync-engine-target-'));
    });

    afterEach(async () => {
      await fs.remove(targetDir);
    });

    it('should write synced files to targetDir instead of projectRoot', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, 'claude', targetDir);

      // File should be in targetDir
      const claudeInTarget = path.join(targetDir, 'CLAUDE.md');
      expect(await fs.pathExists(claudeInTarget)).toBe(true);

      // File should NOT be in projectRoot (tempDir)
      const claudeInSource = path.join(tempDir, 'CLAUDE.md');
      expect(await fs.pathExists(claudeInSource)).toBe(false);
    });

    it('should create symlink in targetDir pointing back to projectRoot AGENTS.md', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, 'claude', targetDir);

      const claudePath = path.join(targetDir, 'CLAUDE.md');
      const stats = await fs.lstat(claudePath);
      expect(stats.isSymbolicLink()).toBe(true);

      // The symlink should resolve to the AGENTS.md in projectRoot
      const resolvedPath = await fs.realpath(claudePath);
      const expectedPath = await fs.realpath(agentsPath);
      expect(resolvedPath).toBe(expectedPath);
    });

    it('should write .gemini/settings.json to targetDir when targetDir is specified', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, 'gemini', targetDir);

      // Settings should be in targetDir
      const settingsInTarget = path.join(targetDir, '.gemini', 'settings.json');
      expect(await fs.pathExists(settingsInTarget)).toBe(true);

      // Settings should NOT be in projectRoot
      const settingsInSource = path.join(tempDir, '.gemini', 'settings.json');
      expect(await fs.pathExists(settingsInSource)).toBe(false);

      // The stored path should be relative from targetDir to AGENTS.md
      const settings = await fs.readJson(settingsInTarget);
      const expectedRelPath = path.relative(targetDir, agentsPath);
      expect(settings.context.fileName).toContain(expectedRelPath);
    });

    it('should use projectRoot as targetDir when targetDir is not specified', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, 'claude');

      const claudeInSource = path.join(tempDir, 'CLAUDE.md');
      expect(await fs.pathExists(claudeInSource)).toBe(true);
    });
  });
});
