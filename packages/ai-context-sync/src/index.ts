#!/usr/bin/env node
import { Command } from 'commander';
import { SyncEngine } from './engine.js';
import path from 'path';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { CONFIG_FILENAME } from './constants.js';

export type ProjectConfig = {
  strategies?: string | string[];
  otherFiles?: string[];
  from?: string;
};

export type SyncConfig = ProjectConfig & {
  projects?: Record<string, ProjectConfig>;
};

export type SyncOptions = {
  dir: string;
  targetDir?: string;
  strategy?: string | string[];
  files?: string;
  from?: string;
  skipConfig?: boolean;
};

type SyncResult = { name: string; success: boolean; error?: string };

export async function readConfig(configPath: string): Promise<SyncConfig> {
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
): Promise<{ config: SyncConfig; strategy: string | string[] | undefined; otherFiles: string[] | undefined; fromFile: string | undefined }> {
  let strategy = options.strategy;
  let otherFiles: string[] | undefined;
  let fromFile: string | undefined;
  let config: SyncConfig = {};

  if (!options.skipConfig && await fs.pathExists(configPath)) {
    config = await readConfig(configPath);
    if (!strategy && config.strategies) {
      strategy = config.strategies;
    }
    otherFiles = config.otherFiles;
    fromFile = config.from;
  }

  return { config, strategy, otherFiles, fromFile };
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

export async function resolveProjectConfig(
  projectPath: string,
  rootConfig: SyncConfig,
  overrides?: ProjectConfig
): Promise<{ strategy: string[]; otherFiles: string[] | undefined; fromFile: string | undefined }> {
  const configPath = path.join(projectPath, CONFIG_FILENAME);
  const localConfig = await readConfig(configPath);

  const strategy = overrides?.strategies ?? localConfig.strategies ?? rootConfig.strategies;
  const otherFiles = overrides?.otherFiles ?? localConfig.otherFiles ?? rootConfig.otherFiles;
  const fromFile = overrides?.from ?? localConfig.from ?? rootConfig.from;

  const strategyArray = typeof strategy === 'string'
    ? strategy.split(',').map(s => s.trim())
    : (strategy ?? []);

  return { 
    strategy: strategyArray as string[], 
    otherFiles, 
    fromFile 
  };
}

async function syncProject(
  projectRoot: string,
  strategy: string[],
  targetDir: string,
  fromFile: string | undefined,
  otherFiles: string[] | undefined,
  projectName: string
): Promise<void> {
  if (strategy.includes('other') && (!otherFiles || otherFiles.length === 0)) {
    throw new Error('Strategy "other" requires custom files to be defined.');
  }

  const engine = new SyncEngine();
  await engine.sync(projectRoot, strategy, targetDir, fromFile, otherFiles);

  console.log(`[${projectName}] Successfully synchronized using "${strategy.join(', ')}"!`);
}

async function runRootSync(
  options: SyncOptions,
  config: SyncConfig,
  projectRoot: string,
  configPath: string,
  configResult: { strategy: string | string[] | undefined; otherFiles: string[] | undefined; fromFile: string | undefined }
): Promise<SyncResult> {
  try {
    const fromFile = resolveFromFile(options.from, configResult.fromFile);
    const otherFiles = mergeOtherFiles(options.files, configResult.otherFiles);
    const resolved = await resolveStrategy(configResult.strategy, otherFiles);
    
    await syncProject(projectRoot, resolved.strategy, options.targetDir ? path.resolve(options.targetDir) : projectRoot, fromFile, resolved.otherFiles, 'root');
    
    if (!options.skipConfig) {
      const configData: SyncConfig = { ...config, strategies: resolved.strategy };
      if (resolved.otherFiles?.length) configData.otherFiles = resolved.otherFiles;
      if (fromFile) configData.from = fromFile;
      await fs.writeJson(configPath, configData, { spaces: 2 });
    }
    return { name: 'root', success: true };
  } catch (error: unknown) {
    return { name: 'root', success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function runProjectsSync(
  config: SyncConfig,
  projectRoot: string
): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  if (!config.projects) return results;

  for (const [projectPath, projectOverrides] of Object.entries(config.projects)) {
    try {
      const absoluteProjectPath = path.resolve(projectRoot, projectPath);
      if (!(await fs.pathExists(absoluteProjectPath))) {
        throw new Error(`Project path does not exist: ${projectPath}`);
      }

      const resolved = await resolveProjectConfig(absoluteProjectPath, config, projectOverrides);
      await syncProject(absoluteProjectPath, resolved.strategy, absoluteProjectPath, resolved.fromFile, resolved.otherFiles, projectPath);
      results.push({ name: projectPath, success: true });
    } catch (error: unknown) {
      results.push({ name: projectPath, success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return results;
}

function displaySummary(results: SyncResult[]): void {
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.warn('\n--- Synchronization Summary ---');
    console.warn(`Success: ${results.length - failures.length}/${results.length}`);
    console.warn('Failures:');
    failures.forEach(f => console.warn(`  - [${f.name}]: ${f.error}`));
    
    if (failures.length === results.length) {
      throw new Error('All synchronizations failed.');
    }
  } else if (results.length > 0) {
    console.log('\nAll projects synchronized successfully!');
  }
}

async function runSync(options: SyncOptions): Promise<void> {
  const projectRoot = path.resolve(options.dir);
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  const configResult = await applyConfig(options, configPath);
  
  const results: SyncResult[] = [];

  const rootResult = await runRootSync(options, configResult.config, projectRoot, configPath, configResult);
  results.push(rootResult);

  const projectResults = await runProjectsSync(configResult.config, projectRoot);
  results.push(...projectResults);

  displaySummary(results);
}

export async function addProject(projectPath: string, options: { strategy?: string; files?: string; from?: string; dir: string }): Promise<void> {
  const projectRoot = path.resolve(options.dir);
  const configPath = path.join(projectRoot, CONFIG_FILENAME);
  const config = await readConfig(configPath);

  const relativePath = path.isAbsolute(projectPath) 
    ? path.relative(projectRoot, projectPath) 
    : projectPath;

  const absoluteProjectPath = path.resolve(projectRoot, relativePath);
  if (!(await fs.pathExists(absoluteProjectPath))) {
    console.warn(`Warning: Project path does not exist: ${absoluteProjectPath}`);
  }

  const otherFiles = options.files ? options.files.split(',').map(s => s.trim()) : undefined;
  const strategies = options.strategy ? options.strategy.split(',').map(s => s.trim()) : undefined;

  let resolvedStrategies = strategies;
  let resolvedOtherFiles = otherFiles;

  if (!strategies) {
    const resolved = await resolveStrategy(undefined, undefined);
    resolvedStrategies = resolved.strategy;
    resolvedOtherFiles = resolved.otherFiles;
  }

  const projectConfig: ProjectConfig = {};
  if (resolvedStrategies) projectConfig.strategies = resolvedStrategies;
  if (resolvedOtherFiles) projectConfig.otherFiles = resolvedOtherFiles;
  if (options.from) projectConfig.from = options.from;

  const newConfig: SyncConfig = {
    ...config,
    projects: {
      ...(config.projects || {}),
      [relativePath]: projectConfig
    }
  };

  await fs.writeJson(configPath, newConfig, { spaces: 2 });
  console.log(`Successfully added project "${relativePath}" to configuration.`);
}

export function createProgram(): Command {
  const program = new Command();

  program
    .name('ai-context-sync')
    .description('Sync AI context files across different providers')
    .version('1.0.0');

  const projectCommand = program.command('project').description('Manage configured projects');

  projectCommand
    .command('add <path>')
    .description('Add a new project to the configuration')
    .option('-d, --dir <path>', 'Root project directory', process.cwd())
    .option('-s, --strategy <strategy>', 'Sync strategy for this project')
    .option('-f, --files <names>', 'Custom filenames for "other" strategy')
    .option('--from <path>', 'Source file path for symlinks')
    .action(async (projectPath: string, options: { strategy?: string; files?: string; from?: string; dir: string }) => {
      try {
        await addProject(projectPath, options);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error: ${message}`);
        process.exit(1);
      }
    });

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

  return program;
}

if (process.argv[1] && (
  process.argv[1].endsWith('dist/index.js') || 
  process.argv[1].endsWith('bin/ai-context-sync') ||
  (fs.existsSync(path.resolve('dist/index.js')) && fs.realpathSync(process.argv[1]) === fs.realpathSync(path.resolve('dist/index.js')))
)) {
  createProgram().parse();
}
