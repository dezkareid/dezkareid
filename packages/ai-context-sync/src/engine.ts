import fs from 'fs-extra';
import path from 'path';
import { AGENTS_FILENAME } from './constants.js';
import { SyncStrategy } from './strategies/index.js';
import { ClaudeStrategy } from './strategies/claude.js';
import { GeminiStrategy } from './strategies/gemini.js';

export class SyncEngine {
  private strategies: SyncStrategy[] = [];

  constructor() {
    this.strategies.push(new ClaudeStrategy());
    this.strategies.push(new GeminiStrategy());
  }

  async sync(projectRoot: string): Promise<void> {
    const agentsPath = path.join(projectRoot, AGENTS_FILENAME);

    if (!(await fs.pathExists(agentsPath))) {
      throw new Error(`${AGENTS_FILENAME} not found in ${projectRoot}`);
    }

    const context = await fs.readFile(agentsPath, 'utf-8');

    for (const strategy of this.strategies) {
      console.log(`Syncing for ${strategy.name}...`);
      await strategy.sync(context, projectRoot);
    }
  }
}
