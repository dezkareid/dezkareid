#!/usr/bin/env node
import { Command } from 'commander';
import { SyncEngine } from './engine.js';
import path from 'path';

const program = new Command();

program
  .name('ai-context-sync')
  .description('Sync AI context files across different providers')
  .version('1.0.0');

program
  .command('sync')
  .description('Synchronize context files from AGENTS.md')
  .option('-d, --dir <path>', 'Project directory', process.cwd())
  .action(async (options) => {
    try {
      const engine = new SyncEngine();
      const projectRoot = path.resolve(options.dir);
      await engine.sync(projectRoot);
      console.log('Successfully synchronized context files!');
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
