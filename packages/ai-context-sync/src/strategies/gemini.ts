import { SyncStrategy, AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';

export class GeminiStrategy implements SyncStrategy {
  name = 'gemini';

  async sync(_context: string, projectRoot: string): Promise<void> {
    const geminiDir = path.join(projectRoot, '.gemini');
    const settingsPath = path.join(geminiDir, 'settings.json');

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
      if (!currentFiles.includes(AGENTS_FILE)) {
        settings.context.fileName = [...currentFiles, AGENTS_FILE];
        modified = true;
      }
    } else if (typeof currentFiles === 'string') {
      if (currentFiles !== AGENTS_FILE) {
        settings.context.fileName = [currentFiles, AGENTS_FILE];
        modified = true;
      }
    } else {
      settings.context.fileName = [AGENTS_FILE];
      modified = true;
    }

    if (modified || !exists) {
      await fs.writeJson(settingsPath, settings, { spaces: 2 });
    }
  }
}
