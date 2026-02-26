#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('export-catalog')
  .description('Output generated color token catalog in Markdown')
  .version('1.0.0')
  .option('-f, --format <format>', 'Output format: css, scss, js', 'css')
  .action(async (options) => {
    const catalogPath = path.join(process.cwd(), 'dist', 'catalogs', `color-${options.format}.md`);

    if (!fs.existsSync(catalogPath)) {
      console.error(`Error: Catalog file for format "${options.format}" not found at: ${catalogPath}`);
      console.error('Please run "npm run build" first to generate the catalogs.');
      process.exit(1);
    }

    try {
      const content = fs.readFileSync(catalogPath, 'utf8');
      console.log(content);
    } catch (error) {
      console.error('Error reading catalog:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
