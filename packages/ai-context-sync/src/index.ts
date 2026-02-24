#!/usr/bin/env node
import { Command } from 'commander';
import { SyncEngine } from './engine.js';
import path from 'path';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { CONFIG_FILENAME } from './constants.js';

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
  .action(async (options) => {
    try {
      const projectRoot = path.resolve(options.dir);
      const targetDir = options.targetDir ? path.resolve(options.targetDir) : projectRoot;
      const configPath = path.join(projectRoot, CONFIG_FILENAME);
      let strategy = options.strategy;
      let otherFiles: string[] | undefined;
      let fromFile: string | undefined;

      // 1. If no strategy provided, try to read from config
      if (!options.skipConfig) {
        if (await fs.pathExists(configPath)) {
          try {
            const config = await fs.readJson(configPath);
            if (!strategy && config.strategies) {
              strategy = config.strategies;
            }
            if (config.otherFiles) {
              otherFiles = config.otherFiles;
            }
            if (config.from) {
              fromFile = config.from;
            }
          } catch (e) {
            // Ignore corrupted config and proceed to prompt
          }
        }
      }

      // 2. Resolve --from flag (takes precedence over config)
      if (options.from) {
        if (path.isAbsolute(options.from)) {
          throw new Error('--from must be a relative path, not an absolute path.');
        }
        fromFile = options.from;
      }

      // 3. Resolve --files flag (merge with config otherFiles)
      if (options.files) {
        const flagFiles = options.files.split(',').map((s: string) => s.trim()).filter(Boolean);
        otherFiles = [...new Set([...(otherFiles ?? []), ...flagFiles])];
      }

      // 4. If still no strategy, prompt user
      if (!strategy) {
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
            validate: (answer) => {
              if (answer.length < 1) {
                return 'You must choose at least one strategy.';
              }
              return true;
            }
          }
        ]);
        strategy = answers.strategies;

        // Follow-up prompt for custom filenames when 'other' is selected and not already set
        if (strategy.includes('other') && (!otherFiles || otherFiles.length === 0)) {
          const filesAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'otherFiles',
              message: 'Enter custom file name(s) to create as symlinks (comma-separated):',
              validate: (v: string) => v.trim().length > 0 || 'At least one filename is required.'
            }
          ]);
          otherFiles = filesAnswer.otherFiles.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      } else if (typeof strategy === 'string') {
        strategy = strategy.split(',').map(s => s.trim());
      }

      // 5. Validate: if 'other' strategy selected but no otherFiles resolved
      if (Array.isArray(strategy) && strategy.includes('other') && (!otherFiles || otherFiles.length === 0)) {
        throw new Error('Strategy "other" requires --files or a saved "otherFiles" config entry.');
      }

      // 6. Save strategy to config if not skipping
      if (!options.skipConfig) {
        const configData: Record<string, unknown> = { strategies: strategy };
        if (otherFiles?.length) configData.otherFiles = otherFiles;
        if (fromFile) configData.from = fromFile;
        await fs.writeJson(configPath, configData, { spaces: 2 });
      }

      const engine = new SyncEngine();
      await engine.sync(projectRoot, strategy, targetDir, fromFile, otherFiles);

      const strategyMsg = Array.isArray(strategy) ? strategy.join(', ') : strategy;
      console.log(`Successfully synchronized context files using "${strategyMsg}"!`);
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
