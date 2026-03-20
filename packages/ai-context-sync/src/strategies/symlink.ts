import { SyncStrategy, AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';

export abstract class SymlinkStrategy implements SyncStrategy {
  abstract name: string;
  abstract targetFilename: string;

  protected fromFile: string;

  constructor(fromFile: string = AGENTS_FILE) {
    this.fromFile = fromFile;
  }

  async sync(_context: string, projectRoot: string, targetDir?: string): Promise<void> {
    const outputDir = targetDir ?? projectRoot;
    const targetPath = path.join(outputDir, this.targetFilename);

    // Compute the symlink value: relative path from outputDir to the source file in projectRoot
    const agentsAbsPath = path.join(projectRoot, this.fromFile);
    const symlinkTarget = path.relative(outputDir, agentsAbsPath);

    // Check if it exists and what type it is
    if (await fs.pathExists(targetPath)) {
      const stats = await fs.lstat(targetPath);
      if (stats.isSymbolicLink()) {
        const existingTarget = await fs.readlink(targetPath);
        if (existingTarget === symlinkTarget) {
          // Already points to the correct location, nothing to do
          return;
        }
      }
      // If it's a file or a link to somewhere else, remove it
      await fs.remove(targetPath);
    }

    // Create symlink pointing to the source file
    await fs.ensureSymlink(symlinkTarget, targetPath);
  }
}
