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
    await fs.writeFile(path.join(tempDir, AGENTS_FILE), '# Agents');
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

  it('should not recreate symlink if it already points to AGENTS.md', async () => {
    const targetPath = path.join(tempDir, 'TEST.md');
    await fs.ensureSymlink(AGENTS_FILE, targetPath);
    
    // Get initial mtime
    const initialStats = await fs.lstat(targetPath);
    
    await strategy.sync('', tempDir);
    
    const finalStats = await fs.lstat(targetPath);
    expect(finalStats.mtimeMs).toBe(initialStats.mtimeMs);
    
    const target = await fs.readlink(targetPath);
    expect(target).toBe(AGENTS_FILE);
  });

  it('should recreate symlink if it points elsewhere', async () => {
    const targetPath = path.join(tempDir, 'TEST.md');
    const otherFile = path.join(tempDir, 'OTHER.md');
    await fs.writeFile(otherFile, 'other content');
    await fs.ensureSymlink('OTHER.md', targetPath);
    
    await strategy.sync('', tempDir);
    
    const target = await fs.readlink(targetPath);
    expect(target).toBe(AGENTS_FILE);
  });

  it('should replace existing file with a symlink', async () => {
    const targetPath = path.join(tempDir, 'TEST.md');
    await fs.writeFile(targetPath, 'existing file');
    
    await strategy.sync('', tempDir);
    
    const stats = await fs.lstat(targetPath);
    expect(stats.isSymbolicLink()).toBe(true);
    
    const target = await fs.readlink(targetPath);
    expect(target).toBe(AGENTS_FILE);
  });
});
