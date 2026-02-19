import { SyncStrategy, AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';

export class GeminiStrategy implements SyncStrategy {
  name = 'gemini';

  async sync(_context: string, projectRoot: string, targetDir?: string): Promise<void> {
    const outputDir = targetDir ?? projectRoot;
    const geminiDir = path.join(outputDir, '.gemini');
    const settingsPath = path.join(geminiDir, 'settings.json');

    // Compute the path to AGENTS.md relative to the target .gemini directory
    const agentsAbsPath = path.join(projectRoot, AGENTS_FILE);
    const agentsRelativePath = path.relative(outputDir, agentsAbsPath);

    await fs.ensureDir(geminiDir);

    let settings: any = {};
    let exists = false;
    if (await fs.pathExists(settingsPath)) {
      exists = true;
      try {
        settings = await fs.readJson(settingsPath);
      } catch (e) {
        settings = {};
      }
    }

    if (!settings.context) {
      settings.context = {};
    }

    const currentFiles = settings.context.fileName;
    let modified = false;

    if (Array.isArray(currentFiles)) {
      if (!currentFiles.includes(agentsRelativePath)) {
        settings.context.fileName = [...currentFiles, agentsRelativePath];
        modified = true;
      }
    } else if (typeof currentFiles === 'string') {
      if (currentFiles !== agentsRelativePath) {
        settings.context.fileName = [currentFiles, agentsRelativePath];
        modified = true;
      }
    } else {
      settings.context.fileName = [agentsRelativePath];
      modified = true;
    }

    if (modified || !exists) {
      await fs.writeJson(settingsPath, settings, { spaces: 2 });
    }
  }
}
