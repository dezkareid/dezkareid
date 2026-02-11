import fs from 'fs-extra';
import path from 'path';
import { AGENTS_FILENAME } from './constants.js';
import { SyncStrategy } from './strategies/index.js';
import { ClaudeStrategy } from './strategies/claude.js';
import { GeminiStrategy } from './strategies/gemini.js';

export class SyncEngine {
  private allStrategies: SyncStrategy[] = [
    new ClaudeStrategy(),
    new GeminiStrategy()
  ];

  async sync(projectRoot: string, selectedStrategies?: string | string[]): Promise<void> {
    const agentsPath = path.join(projectRoot, AGENTS_FILENAME);

    if (!(await fs.pathExists(agentsPath))) {
      throw new Error(`${AGENTS_FILENAME} not found in ${projectRoot}`);
    }

    const context = await fs.readFile(agentsPath, 'utf-8');

    let strategiesToRun: SyncStrategy[];

    if (!selectedStrategies || (Array.isArray(selectedStrategies) && selectedStrategies.length === 0)) {
      strategiesToRun = this.allStrategies;
    } else {
      const selectedList = Array.isArray(selectedStrategies) ? selectedStrategies : [selectedStrategies];
      const normalizedList = selectedList.map(s => s.toLowerCase());
      
      if (normalizedList.includes('all') || normalizedList.includes('both')) {
        strategiesToRun = this.allStrategies;
      } else {
        strategiesToRun = this.allStrategies.filter(s => 
          normalizedList.includes(s.name.toLowerCase())
        );
      }
    }

    if (strategiesToRun.length === 0 && selectedStrategies) {
      throw new Error(`No valid strategies found for: ${selectedStrategies}. Available strategies: claude, gemini`);
    }

    for (const strategy of strategiesToRun) {
      console.log(`Syncing for ${strategy.name}...`);
      await strategy.sync(context, projectRoot);
    }
  }
}
