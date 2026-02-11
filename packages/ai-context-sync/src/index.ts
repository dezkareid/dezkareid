#!/usr/bin/env node
import { Command } from 'commander';
import { SyncEngine } from './engine.js';
import path from 'path';
import inquirer from 'inquirer';

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
  .action(async (options) => {
    try {
      let strategy = options.strategy;

      if (!strategy) {
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'strategies',
            message: 'Select the AI context files to sync:',
            choices: [
              { name: 'Claude (CLAUDE.md)', value: 'claude', checked: true },
              { name: 'Gemini (.gemini/settings.json)', value: 'gemini', checked: true }
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

      const engine = new SyncEngine();
      const projectRoot = path.resolve(options.dir);
      await engine.sync(projectRoot, strategy);
      
      const strategyMsg = Array.isArray(strategy) ? strategy.join(', ') : strategy;
      console.log(`Successfully synchronized context files using "${strategyMsg}"!`);
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
