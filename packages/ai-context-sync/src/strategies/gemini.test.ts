import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GeminiStrategy } from './gemini.js';
import { AGENTS_FILENAME } from '../constants.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('GeminiStrategy', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-strategy-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should create .gemini/settings.json if it does not exist', async () => {
    const strategy = new GeminiStrategy();
    await strategy.sync('context', tempDir);
    
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    expect(await fs.pathExists(settingsPath)).toBe(true);
    
    const settings = await fs.readJson(settingsPath);
    expect(settings.context.fileName).toContain(AGENTS_FILENAME);
  });

  it('should update existing context.fileName array', async () => {
    const strategy = new GeminiStrategy();
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    await fs.ensureDir(path.dirname(settingsPath));
    await fs.writeJson(settingsPath, {
      context: {
        fileName: ['OTHER.md']
      }
    });

    await strategy.sync('context', tempDir);
    
    const settings = await fs.readJson(settingsPath);
    expect(settings.context.fileName).toContain('OTHER.md');
    expect(settings.context.fileName).toContain(AGENTS_FILENAME);
  });

  it('should convert string fileName to array and add AGENTS.md', async () => {
    const strategy = new GeminiStrategy();
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    await fs.ensureDir(path.dirname(settingsPath));
    await fs.writeJson(settingsPath, {
      context: {
        fileName: 'OTHER.md'
      }
    });

    await strategy.sync('context', tempDir);
    
    const settings = await fs.readJson(settingsPath);
    expect(Array.isArray(settings.context.fileName)).toBe(true);
    expect(settings.context.fileName).toContain('OTHER.md');
    expect(settings.context.fileName).toContain(AGENTS_FILENAME);
  });

  it('should not add AGENTS.md twice', async () => {
    const strategy = new GeminiStrategy();
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    await fs.ensureDir(path.dirname(settingsPath));
    await fs.writeJson(settingsPath, {
      context: {
        fileName: [AGENTS_FILENAME]
      }
    });

    await strategy.sync('context', tempDir);
    
    const settings = await fs.readJson(settingsPath);
    expect(settings.context.fileName.filter((f: string) => f === AGENTS_FILENAME).length).toBe(1);
  });

  it('should not write to settings.json if AGENTS.md is already present', async () => {
    const strategy = new GeminiStrategy();
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    await fs.ensureDir(path.dirname(settingsPath));
    await fs.writeJson(settingsPath, {
      context: {
        fileName: [AGENTS_FILENAME]
      }
    });

    const mtimeBefore = (await fs.stat(settingsPath)).mtimeMs;
    // Wait a bit to ensure mtime would change if written
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await strategy.sync('context', tempDir);
    
    const mtimeAfter = (await fs.stat(settingsPath)).mtimeMs;
    expect(mtimeAfter).toBe(mtimeBefore);
  });

  it('should handle invalid JSON in settings.json by starting fresh', async () => {
    const strategy = new GeminiStrategy();
    const settingsPath = path.join(tempDir, '.gemini', 'settings.json');
    await fs.ensureDir(path.dirname(settingsPath));
    await fs.writeFile(settingsPath, 'not a json');

    await strategy.sync('context', tempDir);
    
    const settings = await fs.readJson(settingsPath);
    expect(settings.context.fileName).toContain(AGENTS_FILENAME);
  });
});
