import fs from 'fs-extra';
import path from 'path';
import { AGENTS_FILENAME } from './constants.js';
import { SyncStrategy } from './strategies/index.js';
import { ClaudeStrategy } from './strategies/claude.js';
import { GeminiStrategy } from './strategies/gemini.js';
import { GeminiMdStrategy } from './strategies/gemini-md.js';
import { OtherStrategy } from './strategies/other.js';

export class SyncEngine {
  async sync(
    projectRoot: string,
    selectedStrategies?: string | string[],
    targetDir?: string,
    fromFile?: string,
    otherFiles?: string[]
  ): Promise<void> {
    const sourceFile = fromFile ?? AGENTS_FILENAME;
    const agentsPath = path.join(projectRoot, sourceFile);
    const outputDir = targetDir ?? projectRoot;

    if (!(await fs.pathExists(agentsPath))) {
      throw new Error(`${sourceFile} not found in ${projectRoot}`);
    }

    const context = await fs.readFile(agentsPath, 'utf-8');

    const builtInStrategies: SyncStrategy[] = [
      new ClaudeStrategy(fromFile),
      new GeminiStrategy(fromFile),
      new GeminiMdStrategy(fromFile)
    ];

    let strategiesToRun: SyncStrategy[];

    if (!selectedStrategies || (Array.isArray(selectedStrategies) && selectedStrategies.length === 0)) {
      strategiesToRun = builtInStrategies;
    } else {
      const selectedList = Array.isArray(selectedStrategies) ? selectedStrategies : [selectedStrategies];
      const normalizedList = selectedList.map(s => s.toLowerCase());

      if (normalizedList.includes('all') || normalizedList.includes('both')) {
        strategiesToRun = builtInStrategies;
      } else {
        strategiesToRun = builtInStrategies.filter(s =>
          normalizedList.includes(s.name.toLowerCase())
        );
      }

      if (normalizedList.includes('other')) {
        if (!otherFiles || otherFiles.length === 0) {
          throw new Error('Strategy "other" requires otherFiles to be specified.');
        }
        for (const filename of otherFiles) {
          strategiesToRun.push(new OtherStrategy(filename, fromFile));
        }
      }
    }

    const availableNames = [...builtInStrategies.map(s => s.name), 'other'].join(', ');
    if (strategiesToRun.length === 0 && selectedStrategies) {
      throw new Error(`No valid strategies found for: ${selectedStrategies}. Available strategies: ${availableNames}`);
    }

    for (const strategy of strategiesToRun) {
      console.log(`Syncing for ${strategy.name}...`);
      await strategy.sync(context, projectRoot, outputDir);
    }
  }
}
