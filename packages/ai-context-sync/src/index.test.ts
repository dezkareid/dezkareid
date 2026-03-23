import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { resolveProjectConfig, SyncConfig, ProjectConfig, readConfig, addProject } from './index.js';

vi.mock('fs-extra');
vi.mock('inquirer');

describe('CLI Logic & Configuration', () => {
  const projectRoot = '/mock/root';
  const configPath = path.join(projectRoot, '.ai-context-configrc');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.pathExists).mockResolvedValue(true);
  });

  describe('readConfig', () => {
    it('should return empty object if file does not exist', async () => {
      vi.mocked(fs.readJson).mockRejectedValue(new Error('not found'));
      const config = await readConfig(configPath);
      expect(config).toEqual({});
    });

    it('should return config object if file exists', async () => {
      const mockConfig: SyncConfig = { strategies: ['claude'] };
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig);
      const config = await readConfig(configPath);
      expect(config).toEqual(mockConfig);
    });
  });

  describe('resolveProjectConfig', () => {
    const rootConfig: SyncConfig = {
      strategies: ['claude'],
      otherFiles: ['root.md'],
      from: 'ROOT_AGENTS.md'
    };

    it('should use local config if it exists', async () => {
      const projectPath = '/mock/root/apps/web';
      vi.mocked(fs.readJson).mockResolvedValue({
        strategies: 'gemini',
        otherFiles: ['local.md']
      });

      const result = await resolveProjectConfig(projectPath, rootConfig);

      expect(result.strategy).toEqual(['gemini']);
      expect(result.otherFiles).toEqual(['local.md']);
      expect(result.fromFile).toBe('ROOT_AGENTS.md');
    });

    it('should use overrides if provided', async () => {
      const projectPath = '/mock/root/apps/web';
      vi.mocked(fs.readJson).mockResolvedValue({
        strategies: 'gemini'
      });

      const overrides: ProjectConfig = {
        strategies: 'gemini-md',
        from: 'OVERRIDE.md'
      };

      const result = await resolveProjectConfig(projectPath, rootConfig, overrides);

      expect(result.strategy).toEqual(['gemini-md']);
      expect(result.fromFile).toBe('OVERRIDE.md');
    });
  });

  describe('addProject', () => {
    it('should add a project to an empty config', async () => {
      vi.mocked(fs.readJson).mockResolvedValue({});
      
      await addProject('apps/web', { 
        dir: projectRoot,
        strategy: 'claude'
      });

      expect(fs.writeJson).toHaveBeenCalledWith(
        configPath,
        expect.objectContaining({
          projects: {
            'apps/web': { strategies: ['claude'] }
          }
        }),
        { spaces: 2 }
      );
    });

    it('should add a project to an existing config', async () => {
      vi.mocked(fs.readJson).mockResolvedValue({
        projects: { 'apps/api': { strategies: ['gemini'] } }
      });
      
      await addProject('apps/web', { 
        dir: projectRoot,
        strategy: 'claude'
      });

      expect(fs.writeJson).toHaveBeenCalledWith(
        configPath,
        expect.objectContaining({
          projects: {
            'apps/api': { strategies: ['gemini'] },
            'apps/web': { strategies: ['claude'] }
          }
        }),
        { spaces: 2 }
      );
    });

    it('should convert absolute project path to relative', async () => {
      vi.mocked(fs.readJson).mockResolvedValue({});
      
      const absolutePath = path.resolve(projectRoot, 'apps/web');
      await addProject(absolutePath, { 
        dir: projectRoot,
        strategy: 'claude'
      });

      expect(fs.writeJson).toHaveBeenCalledWith(
        configPath,
        expect.objectContaining({
          projects: {
            'apps/web': { strategies: ['claude'] }
          }
        }),
        { spaces: 2 }
      );
    });
  });
});
