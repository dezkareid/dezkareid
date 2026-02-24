import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OtherStrategy } from './other.js';
import { AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('OtherStrategy', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'other-strategy-test-'));
    await fs.writeFile(path.join(tempDir, AGENTS_FILE), '# Agents');
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should create a symlink with the correct targetFilename', async () => {
    const strategy = new OtherStrategy('CURSOR.md');
    await strategy.sync('', tempDir);

    const targetPath = path.join(tempDir, 'CURSOR.md');
    const stats = await fs.lstat(targetPath);
    expect(stats.isSymbolicLink()).toBe(true);

    const target = await fs.readlink(targetPath);
    expect(target).toContain(AGENTS_FILE);
  });

  it('should use default AGENTS.md as source when fromFile is not provided', async () => {
    const strategy = new OtherStrategy('COPILOT.md');
    await strategy.sync('', tempDir);

    const targetPath = path.join(tempDir, 'COPILOT.md');
    const resolvedPath = await fs.realpath(targetPath);
    const expectedPath = await fs.realpath(path.join(tempDir, AGENTS_FILE));
    expect(resolvedPath).toBe(expectedPath);
  });

  it('should use custom fromFile when provided', async () => {
    const customSource = 'MY_AGENTS.md';
    await fs.writeFile(path.join(tempDir, customSource), '# Custom Agents');

    const strategy = new OtherStrategy('CURSOR.md', customSource);
    await strategy.sync('', tempDir);

    const targetPath = path.join(tempDir, 'CURSOR.md');
    const stats = await fs.lstat(targetPath);
    expect(stats.isSymbolicLink()).toBe(true);

    const resolvedPath = await fs.realpath(targetPath);
    const expectedPath = await fs.realpath(path.join(tempDir, customSource));
    expect(resolvedPath).toBe(expectedPath);
  });

  it('should have name "other"', () => {
    const strategy = new OtherStrategy('CURSOR.md');
    expect(strategy.name).toBe('other');
  });

  it('should expose the targetFilename', () => {
    const strategy = new OtherStrategy('CUSTOM_FILE.md');
    expect(strategy.targetFilename).toBe('CUSTOM_FILE.md');
  });
});
