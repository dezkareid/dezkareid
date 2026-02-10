import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ClaudeStrategy } from './claude.js';
import { AGENTS_FILENAME } from '../constants.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('ClaudeStrategy', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-strategy-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should create a symbolic link CLAUDE.md pointing to AGENTS.md', async () => {
    const strategy = new ClaudeStrategy();
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agents');
    
    await strategy.sync('# Agents', tempDir);
    
    const claudePath = path.join(tempDir, 'CLAUDE.md');
    const stats = await fs.lstat(claudePath);
    expect(stats.isSymbolicLink()).toBe(true);
    
    const target = await fs.readlink(claudePath);
    expect(target).toBe(AGENTS_FILENAME);
  });

  it('should replace existing file with a symbolic link', async () => {
    const strategy = new ClaudeStrategy();
    const claudePath = path.join(tempDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, 'old content');
    
    await strategy.sync('# Agents', tempDir);
    
    const stats = await fs.lstat(claudePath);
    expect(stats.isSymbolicLink()).toBe(true);
  });

  it('should not recreate the link if it already exists and points to AGENTS.md', async () => {
    const strategy = new ClaudeStrategy();
    const claudePath = path.join(tempDir, 'CLAUDE.md');
    const agentsPath = path.join(tempDir, AGENTS_FILENAME);
    await fs.writeFile(agentsPath, '# Agents');
    await fs.ensureSymlink(AGENTS_FILENAME, claudePath);
    
    const statsBefore = await fs.lstat(claudePath);
    const mtimeBefore = statsBefore.mtimeMs;
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await strategy.sync('# Agents', tempDir);
    
    const statsAfter = await fs.lstat(claudePath);
    const mtimeAfter = statsAfter.mtimeMs;
    expect(mtimeAfter).toBe(mtimeBefore);
  });
});
