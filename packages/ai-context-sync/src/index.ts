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
  .option('-d, --dir <path>', 'Project directory', process.cwd())
  .option('-s, --strategy <strategy>', 'Sync strategy (claude, gemini, all, or comma-separated list)')
  .option('--skip-config', 'Avoid reading/creating the config file', false)
  .action(async (options) => {
    try {
      const projectRoot = path.resolve(options.dir);
      const configPath = path.join(projectRoot, CONFIG_FILENAME);
      let strategy = options.strategy;

      // 1. If no strategy provided, try to read from config
      if (!strategy && !options.skipConfig) {
        if (await fs.pathExists(configPath)) {
          try {
            const config = await fs.readJson(configPath);
            if (config.strategies) {
              strategy = config.strategies;
            }
          } catch (e) {
            // Ignore corrupted config and proceed to prompt
          }
        }
      }

      // 2. If still no strategy, prompt user
      if (!strategy) {
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'strategies',
            message: 'Select the AI context files to sync:',
            choices: [
              { name: 'Claude (CLAUDE.md)', value: 'claude', checked: true },
              { name: 'Gemini (.gemini/settings.json)', value: 'gemini', checked: true },
              { name: 'Gemini Markdown (GEMINI.md)', value: 'gemini-md', checked: true }
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
      } else if (typeof strategy === 'string') {
        strategy = strategy.split(',').map(s => s.trim());
      }

      // 3. Save strategy to config if not skipping
      if (!options.skipConfig) {
        await fs.writeJson(configPath, { strategies: strategy }, { spaces: 2 });
      }

      const engine = new SyncEngine();
      await engine.sync(projectRoot, strategy);

      const strategyMsg = Array.isArray(strategy) ? strategy.join(', ') : strategy;
      console.log(`Successfully synchronized context files using "${strategyMsg}"!`);
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
