import { SyncStrategy, AGENTS_FILE } from './index.js';
import fs from 'fs-extra';
import path from 'path';

export class ClaudeStrategy implements SyncStrategy {
  name = 'claude';

  async sync(_context: string, projectRoot: string): Promise<void> {
    const claudePath = path.join(projectRoot, 'CLAUDE.md');
    
    // Check if it exists and what type it is
    if (await fs.pathExists(claudePath)) {
      const stats = await fs.lstat(claudePath);
      if (stats.isSymbolicLink()) {
        const target = await fs.readlink(claudePath);
        if (target === AGENTS_FILE) {
          // Already points to AGENTS.md, nothing to do
          return;
        }
      }
      // If it's a file or a link to somewhere else, remove it
      await fs.remove(claudePath);
    }

    // Create relative symlink
    await fs.ensureSymlink(AGENTS_FILE, claudePath);
  }
}
