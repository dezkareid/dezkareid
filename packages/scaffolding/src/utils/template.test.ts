import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { copyTemplate } from './template.js';

const TEST_DIR = path.join(process.cwd(), 'temp-test-template');
const TARGET_DIR = path.join(process.cwd(), 'temp-target-project');

describe('template utility', () => {
  beforeEach(async () => {
    // Setup temporary template
    await fs.ensureDir(TEST_DIR);
    await fs.writeFile(path.join(TEST_DIR, 'README.md'), '# {{name}}\n{{description}}');
    await fs.writeFile(path.join(TEST_DIR, '_gitignore'), 'node_modules');
    await fs.ensureDir(path.join(TEST_DIR, 'src'));
    await fs.writeFile(path.join(TEST_DIR, 'src/index.ts'), 'export const author = "{{author}}";');
  });

  afterEach(async () => {
    // Cleanup
    await fs.remove(TEST_DIR);
    await fs.remove(TARGET_DIR);
  });

  it('should copy files and replace placeholders', async () => {
    const data = {
      name: 'test-project',
      description: 'A test project',
      author: 'Test Author',
    };

    await copyTemplate(TEST_DIR, TARGET_DIR, data);

    // Check README.md
    const readmeContent = await fs.readFile(path.join(TARGET_DIR, 'README.md'), 'utf-8');
    expect(readmeContent).toBe('# test-project\nA test project');

    // Check .gitignore renaming
    expect(fs.existsSync(path.join(TARGET_DIR, '.gitignore'))).toBe(true);
    const gitignoreContent = await fs.readFile(path.join(TARGET_DIR, '.gitignore'), 'utf-8');
    expect(gitignoreContent).toBe('node_modules');

    // Check src/index.ts
    const indexContent = await fs.readFile(path.join(TARGET_DIR, 'src/index.ts'), 'utf-8');
    expect(indexContent).toBe('export const author = "Test Author";');
  });
});
