import { SyncStrategy, AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';

export abstract class SymlinkStrategy implements SyncStrategy {
  abstract name: string;
  abstract targetFilename: string;

  async sync(_context: string, projectRoot: string): Promise<void> {
    const targetPath = path.join(projectRoot, this.targetFilename);
    
    // Check if it exists and what type it is
    if (await fs.pathExists(targetPath)) {
      const stats = await fs.lstat(targetPath);
      if (stats.isSymbolicLink()) {
        const target = await fs.readlink(targetPath);
        if (target === AGENTS_FILE) {
          // Already points to AGENTS.md, nothing to do
          return;
        }
      }
      // If it's a file or a link to somewhere else, remove it
      await fs.remove(targetPath);
    }

    // Create relative symlink
    await fs.ensureSymlink(AGENTS_FILE, targetPath);
  }
}
