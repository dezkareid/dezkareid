import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SymlinkStrategy } from './symlink.js';
import { AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

class TestSymlinkStrategy extends SymlinkStrategy {
  name = 'test';
  targetFilename = 'TEST.md';
}

describe('SymlinkStrategy', () => {
  let tempDir: string;
  let strategy: TestSymlinkStrategy;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'symlink-strategy-test-'));
    strategy = new TestSymlinkStrategy();
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should create a symlink to AGENTS.md', async () => {
    await strategy.sync('', tempDir);
    const targetPath = path.join(tempDir, 'TEST.md');
    
    const stats = await fs.lstat(targetPath);
    expect(stats.isSymbolicLink()).toBe(true);
    
    const target = await fs.readlink(targetPath);
    // It might be absolute or relative depending on environment/implementation
    expect(target).toContain(AGENTS_FILE);
  });
});
