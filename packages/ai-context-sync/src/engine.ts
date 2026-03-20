import fs from 'fs-extra';
import path from 'path';
import { AGENTS_FILENAME } from './constants.js';
import { SyncStrategy } from './strategies/index.js';
import { ClaudeStrategy } from './strategies/claude.js';
import { GeminiStrategy } from './strategies/gemini.js';
import { GeminiMdStrategy } from './strategies/gemini-md.js';
import { OtherStrategy } from './strategies/other.js';

function buildBuiltInStrategies(fromFile?: string): SyncStrategy[] {
  return [
    new ClaudeStrategy(fromFile),
    new GeminiStrategy(fromFile),
    new GeminiMdStrategy(fromFile)
  ];
}

function resolveStrategiesToRun(
  selectedStrategies: string | string[] | undefined,
  builtInStrategies: SyncStrategy[],
  otherFiles?: string[],
  fromFile?: string
): SyncStrategy[] {
  if (!selectedStrategies || (Array.isArray(selectedStrategies) && selectedStrategies.length === 0)) {
    return builtInStrategies;
  }

  const selectedList = Array.isArray(selectedStrategies) ? selectedStrategies : [selectedStrategies];
  const normalizedList = selectedList.map(s => s.toLowerCase());

  let strategies: SyncStrategy[];
  if (normalizedList.includes('all') || normalizedList.includes('both')) {
    strategies = [...builtInStrategies];
  } else {
    strategies = builtInStrategies.filter(s => normalizedList.includes(s.name.toLowerCase()));
  }

  if (normalizedList.includes('other')) {
    if (!otherFiles || otherFiles.length === 0) {
      throw new Error('Strategy "other" requires otherFiles to be specified.');
    }
    for (const filename of otherFiles) {
      strategies.push(new OtherStrategy(filename, fromFile));
    }
  }

  return strategies;
}

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
    const builtInStrategies = buildBuiltInStrategies(fromFile);
    const strategiesToRun = resolveStrategiesToRun(selectedStrategies, builtInStrategies, otherFiles, fromFile);

    if (strategiesToRun.length === 0 && selectedStrategies) {
      const availableNames = [...builtInStrategies.map(s => s.name), 'other'].join(', ');
      throw new Error(`No valid strategies found for: ${selectedStrategies}. Available strategies: ${availableNames}`);
    }

    for (const strategy of strategiesToRun) {
      console.log(`Syncing for ${strategy.name}...`);
      await strategy.sync(context, projectRoot, outputDir);
    }
  }
}
