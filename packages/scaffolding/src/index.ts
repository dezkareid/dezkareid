#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import prompts from 'prompts';
import pc from 'picocolors';
import { execa } from 'execa';
import { getTemplatePath, copyTemplate } from './utils/template.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json manually to avoid JSON import issues in some environments
const packageJson = fs.readJsonSync(path.join(__dirname, '../package.json'));

const program = new Command();

interface CreateOptions {
  description?: string;
  author?: string;
  authorUsername?: string;
}

async function getProjectMetadata(nameArg?: string, options: CreateOptions = {}) {
  const name = nameArg;
  const { description, author, authorUsername } = options;

  const questions: prompts.PromptObject[] = [];

  if (!name) {
    questions.push({
      type: 'text',
      name: 'name',
      message: 'Project name:',
      validate: (value: string) => (value ? true : 'Project name is required'),
    });
  }

  if (description === undefined) {
    questions.push({
      type: 'text',
      name: 'description',
      message: 'Project description:',
      initial: '',
    });
  }

  if (author === undefined) {
    questions.push({
      type: 'text',
      name: 'author',
      message: 'Project author:',
      initial: '',
    });
  }

  if (authorUsername === undefined) {
    questions.push({
      type: 'text',
      name: 'authorUsername',
      message: 'Author GitHub username:',
      initial: '',
    });
  }

  let finalName = name;
  let finalDescription = description;
  let finalAuthor = author;
  let finalAuthorUsername = authorUsername;

  if (questions.length > 0) {
    const response = await prompts(questions);

    // Handle cancel
    if (questions.some(q => q.name && response[q.name as string] === undefined)) {
      console.log(pc.yellow('\nOperation cancelled.'));
      process.exit(0);
    }

    if (!finalName) finalName = response.name;
    if (finalDescription === undefined) finalDescription = response.description;
    if (finalAuthor === undefined) finalAuthor = response.author;
    if (finalAuthorUsername === undefined) finalAuthorUsername = response.authorUsername;
  }

  return {
    name: finalName as string,
    description: finalDescription,
    author: finalAuthor,
    authorUsername: finalAuthorUsername,
  };
}

program
  .name('scaffolding')
  .description('Standardize and automate the creation of new software projects')
  .version(packageJson.version);

program
  .command('create')
  .description('Create a new project from a template')
  .argument('[name]', 'Project name')
  .option('-d, --description <description>', 'Project description')
  .option('-a, --author <author>', 'Project author')
  .option('-u, --author-username <username>', 'Author GitHub username')
  .action(async (nameArg, options: CreateOptions) => {
    const { name, description, author, authorUsername } = await getProjectMetadata(nameArg, options);

    const targetPath = path.join(process.cwd(), name);
    const templatePath = getTemplatePath('library');

    console.log(pc.cyan(`\nCreating project ${pc.bold(name)} in ${pc.dim(targetPath)}...`));

    try {
      await copyTemplate(templatePath, targetPath, {
        name,
        'description': description || '',
        'author': author || '',
        'author-username': authorUsername || '',
      });

      // Conditional git init
      const gitPath = path.join(targetPath, '.git');
      if (!fs.existsSync(gitPath)) {
        console.log(pc.dim('Initializing git repository...'));
        try {
          await execa('git', ['init'], { cwd: targetPath });
        }
        catch (gitError) {
          console.warn(pc.yellow('Failed to initialize git repository:'), (gitError as Error).message);
        }
      }

      console.log(pc.green(`\nProject ${pc.bold(name)} created successfully!`));
      console.log(pc.dim(`Next steps:\n  cd ${name}\n  pnpm install\n`));
    }
    catch (error) {
      console.error(pc.red('\nError creating project:'), (error as Error).message);
      process.exit(1);
    }
  });

program.parse();
