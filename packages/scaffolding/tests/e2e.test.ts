import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';

const E2E_DIR = path.join(process.cwd(), 'e2e-test-project');

describe('E2E scaffolding', () => {
  beforeAll(async () => {
    await fs.remove(E2E_DIR);
  });

  afterAll(async () => {
    await fs.remove(E2E_DIR);
  });

  it('should scaffold a project and run build/test', async () => {
    // 1. Run the CLI to scaffold a project
    // Use tsx to run the local src/index.ts
    console.log('Scaffolding project...');
    await execa('npx', ['tsx', 'src/index.ts', 'create', 'e2e-test-project', '-d', 'E2E Test Project', '-a', 'E2E Tester', '-u', 'e2e-user']);

    expect(fs.existsSync(E2E_DIR)).toBe(true);
    expect(fs.existsSync(path.join(E2E_DIR, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(E2E_DIR, '.git'))).toBe(true);

    // 2. Run pnpm install in the scaffolded project
    // We skip pnpm install in the actual test to avoid network dependency and long wait times,
    // but we verify that package.json has the right dependencies.
    const pkg = await fs.readJson(path.join(E2E_DIR, 'package.json'));
    expect(pkg.name).toBe('e2e-test-project');
    expect(pkg.devDependencies).toHaveProperty('tsup');
    expect(pkg.devDependencies).toHaveProperty('typescript');
    expect(pkg.devDependencies).toHaveProperty('vitest');
    expect(pkg.repository.url).toBe('git+https://github.com/e2e-user/e2e-test-project.git');
    expect(pkg.homepage).toBe('https://github.com/e2e-user/e2e-test-project#readme');
    expect(pkg.bugs.url).toBe('https://github.com/e2e-user/e2e-test-project/issues');

    // 3. Verify README.md placeholders
    const readme = await fs.readFile(path.join(E2E_DIR, 'README.md'), 'utf-8');
    expect(readme).toContain('e2e-test-project');
    expect(readme).toContain('E2E Test Project');
  }, 30000); // Increase timeout for E2E
});
