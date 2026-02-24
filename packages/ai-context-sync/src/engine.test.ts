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

    await expect(engine.sync(tempDir, 'invalid')).rejects.toThrow('No valid strategies found for: invalid. Available strategies: claude, gemini, gemini-md, other');
  });

  describe('otherFiles option', () => {
    it('should create a symlink for a single otherFile', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, 'other', undefined, undefined, ['CURSOR.md']);

      const cursorPath = path.join(tempDir, 'CURSOR.md');
      expect(await fs.pathExists(cursorPath)).toBe(true);
      const stats = await fs.lstat(cursorPath);
      expect(stats.isSymbolicLink()).toBe(true);
    });

    it('should create symlinks for multiple otherFiles', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, ['other'], undefined, undefined, ['CURSOR.md', 'COPILOT.md']);

      const cursorPath = path.join(tempDir, 'CURSOR.md');
      const copilotPath = path.join(tempDir, 'COPILOT.md');
      expect(await fs.pathExists(cursorPath)).toBe(true);
      expect(await fs.pathExists(copilotPath)).toBe(true);
    });

    it('should throw descriptive error when strategy is "other" but otherFiles is not provided', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await expect(engine.sync(tempDir, 'other')).rejects.toThrow('Strategy "other" requires otherFiles to be specified.');
    });

    it('should throw descriptive error when strategy is "other" but otherFiles is empty', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await expect(engine.sync(tempDir, 'other', undefined, undefined, [])).rejects.toThrow('Strategy "other" requires otherFiles to be specified.');
    });

    it('should run both built-in and custom strategies when combined', async () => {
      const engine = new SyncEngine();
      const agentsPath = path.join(tempDir, AGENTS_FILENAME);
      await fs.writeFile(agentsPath, '# Agent Context');

      await engine.sync(tempDir, ['claude', 'other'], undefined, undefined, ['CURSOR.md']);

      const claudePath = path.join(tempDir, 'CLAUDE.md');
      const cursorPath = path.join(tempDir, 'CURSOR.md');
      expect(await fs.pathExists(claudePath)).toBe(true);
      expect(await fs.pathExists(cursorPath)).toBe(true);
    });
  });

  describe('fromFile option', () => {
    it('should use a custom source file when fromFile is provided', async () => {
      const engine = new SyncEngine();
      const customSource = 'MY_AGENTS.md';
      const customSourcePath = path.join(tempDir, customSource);
      await fs.writeFile(customSourcePath, '# Custom Agent Context');

      await engine.sync(tempDir, 'claude', undefined, customSource);

      const claudePath = path.join(tempDir, 'CLAUDE.md');
      expect(await fs.pathExists(claudePath)).toBe(true);
      const stats = await fs.lstat(claudePath);
      expect(stats.isSymbolicLink()).toBe(true);

      // Symlink should resolve to the custom source file
      const resolvedPath = await fs.realpath(claudePath);
      const expectedPath = await fs.realpath(customSourcePath);
      expect(resolvedPath).toBe(expectedPath);
    });

    it('should throw error when custom fromFile does not exist', async () => {
      const engine = new SyncEngine();

      await expect(engine.sync(tempDir, 'claude', undefined, 'MISSING.md')).rejects.toThrow('MISSING.md not found in');
    });

    it('should use custom fromFile with other strategy', async () => {
      const engine = new SyncEngine();
      const customSource = 'MY_AGENTS.md';
      await fs.writeFile(path.join(tempDir, customSource), '# Custom Agent Context');

      await engine.sync(tempDir, 'other', undefined, customSource, ['CURSOR.md']);

      const cursorPath = path.join(tempDir, 'CURSOR.md');
      const resolvedPath = await fs.realpath(cursorPath);
      const expectedPath = await fs.realpath(path.join(tempDir, customSource));
      expect(resolvedPath).toBe(expectedPath);
    });
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
