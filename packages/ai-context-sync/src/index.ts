#!/usr/bin/env node
import { Command } from 'commander';
import { SyncEngine } from './engine.js';
import path from 'path';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { CONFIG_FILENAME } from './constants.js';

type SyncConfig = {
  strategies?: string | string[];
  otherFiles?: string[];
  from?: string;
};

type SyncOptions = {
  dir: string;
  targetDir?: string;
  strategy?: string | string[];
  files?: string;
  from?: string;
  skipConfig?: boolean;
};

async function readConfig(configPath: string): Promise<SyncConfig> {
  try {
    return await fs.readJson(configPath) as SyncConfig;
  } catch {
    return {};
  }
}

async function promptStrategies(): Promise<string[]> {
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'strategies',
      message: 'Select the AI context files to sync:',
      choices: [
        { name: 'Claude (CLAUDE.md)', value: 'claude', checked: true },
        { name: 'Gemini (.gemini/settings.json)', value: 'gemini', checked: true },
        { name: 'Gemini Markdown (GEMINI.md)', value: 'gemini-md', checked: true },
        { name: 'Other (custom files)', value: 'other', checked: false }
      ],
      validate: (answer: string[]) => {
        if (answer.length < 1) {
          return 'You must choose at least one strategy.';
        }
        return true;
      }
    }
  ]);
  return answers.strategies as string[];
}

async function promptOtherFiles(): Promise<string[]> {
  const filesAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'otherFiles',
      message: 'Enter custom file name(s) to create as symlinks (comma-separated):',
      validate: (v: string) => v.trim().length > 0 || 'At least one filename is required.'
    }
  ]);
  return (filesAnswer.otherFiles as string).split(',').map((s: string) => s.trim()).filter(Boolean);
}

async function resolveStrategy(
  strategyOption: string | string[] | undefined,
  otherFiles: string[] | undefined
): Promise<{ strategy: string[]; otherFiles: string[] | undefined }> {
  if (!strategyOption) {
    const selected = await promptStrategies();
    let resolved = [...(otherFiles ?? [])];
    if (selected.includes('other') && resolved.length === 0) {
      resolved = await promptOtherFiles();
    }
    return { strategy: selected, otherFiles: resolved.length > 0 ? resolved : otherFiles };
  }

  const strategy = typeof strategyOption === 'string'
    ? strategyOption.split(',').map(s => s.trim())
    : strategyOption;

  return { strategy, otherFiles };
}

async function applyConfig(
  options: SyncOptions,
  configPath: string
): Promise<{ strategy: string | string[] | undefined; otherFiles: string[] | undefined; fromFile: string | undefined }> {
  let strategy = options.strategy;
  let otherFiles: string[] | undefined;
  let fromFile: string | undefined;

  if (!options.skipConfig && await fs.pathExists(configPath)) {
    const config = await readConfig(configPath);
    if (!strategy && config.strategies) {
      strategy = config.strategies;
    }
    otherFiles = config.otherFiles;
    fromFile = config.from;
  }

  return { strategy, otherFiles, fromFile };
}

function resolveFromFile(optionFrom: string | undefined, configFromFile: string | undefined): string | undefined {
  if (!optionFrom) return configFromFile;
  if (path.isAbsolute(optionFrom)) {
    throw new Error('--from must be a relative path, not an absolute path.');
  }
  return optionFrom;
}

function mergeOtherFiles(optionFiles: string | undefined, configOtherFiles: string[] | undefined): string[] | undefined {
  if (!optionFiles) return configOtherFiles;
  const flagFiles = optionFiles.split(',').map((s: string) => s.trim()).filter(Boolean);
  return [...new Set([...(configOtherFiles ?? []), ...flagFiles])];
}

async function runSync(options: SyncOptions): Promise<void> {
  const projectRoot = path.resolve(options.dir);
  const targetDir = options.targetDir ? path.resolve(options.targetDir) : projectRoot;
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  const configResult = await applyConfig(options, configPath);
  let { strategy, otherFiles } = configResult;
  const fromFile = resolveFromFile(options.from, configResult.fromFile);
  otherFiles = mergeOtherFiles(options.files, otherFiles);

  const resolved = await resolveStrategy(strategy, otherFiles);
  strategy = resolved.strategy;
  otherFiles = resolved.otherFiles;

  if ((strategy as string[]).includes('other') && (!otherFiles || otherFiles.length === 0)) {
    throw new Error('Strategy "other" requires --files or a saved "otherFiles" config entry.');
  }

  if (!options.skipConfig) {
    const configData: Record<string, unknown> = { strategies: strategy };
    if (otherFiles?.length) configData.otherFiles = otherFiles;
    if (fromFile) configData.from = fromFile;
    await fs.writeJson(configPath, configData, { spaces: 2 });
  }

  const engine = new SyncEngine();
  await engine.sync(projectRoot, strategy, targetDir, fromFile, otherFiles);

  console.log(`Successfully synchronized context files using "${(strategy as string[]).join(', ')}"!`);
}

const program = new Command();

program
  .name('ai-context-sync')
  .description('Sync AI context files across different providers')
  .version('1.0.0');

program
  .command('sync')
  .description('Synchronize context files from AGENTS.md')
  .option('-d, --dir <path>', 'Project directory (where AGENTS.md lives)', process.cwd())
  .option('-t, --target-dir <path>', 'Target directory where synced files will be written (defaults to --dir)')
  .option('-s, --strategy <strategy>', 'Sync strategy (claude, gemini, all, or comma-separated list)')
  .option('-f, --files <names>', 'Comma-separated custom filenames for "other" strategy')
  .option('--from <path>', 'Source file path for symlinks (default: AGENTS.md)')
  .option('--skip-config', 'Avoid reading/creating the config file', false)
  .action(async (options: SyncOptions) => {
    try {
      await runSync(options);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse();
