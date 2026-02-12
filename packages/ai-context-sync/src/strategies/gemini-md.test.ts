import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GeminiMdStrategy } from './gemini-md.js';
import { AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('GeminiMdStrategy', () => {
  let tempDir: string;
  let strategy: GeminiMdStrategy;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-md-strategy-test-'));
    await fs.writeFile(path.join(tempDir, AGENTS_FILE), '# Agents');
    strategy = new GeminiMdStrategy();
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should create a symbolic link GEMINI.md pointing to AGENTS.md', async () => {
    await strategy.sync('', tempDir);
    const targetPath = path.join(tempDir, 'GEMINI.md');
    
    const stats = await fs.lstat(targetPath);
    expect(stats.isSymbolicLink()).toBe(true);
    
    const target = await fs.readlink(targetPath);
    expect(target).toBe(AGENTS_FILE);
  });
});
