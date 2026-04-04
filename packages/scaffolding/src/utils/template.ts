import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves the path to a template directory.
 * During development (using tsx), it's relative to src.
 * After build, it's relative to dist.
 * Since we publish both 'dist' and 'templates' at the root:
 * - src/utils/template.ts -> ../../templates
 * - dist/index.js -> ./templates (if we copy it to dist) OR ../templates (if we don't)
 * Let's assume templates stay in root:
 * - From src/utils/template.ts: ../../templates
 * - From dist/index.js: ../templates
 */
export function getTemplatePath(templateName: string): string {
  // If we're in src/utils/template.ts, root is 2 levels up.
  // If we're in dist/index.js, root is 1 level up.
  const isDist = __dirname.includes('dist');
  const rootDir = isDist ? path.join(__dirname, '..') : path.join(__dirname, '../..');
  const templatePath = path.join(rootDir, 'templates', templateName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template '${templateName}' not found at ${templatePath}`);
  }

  return templatePath;
}

export async function copyTemplate(templatePath: string, targetPath: string, data: Record<string, string>) {
  await fs.ensureDir(targetPath);
  const files = await fs.readdir(templatePath);

  for (const file of files) {
    const sourceFile = path.join(templatePath, file);
    // Rename _gitignore to .gitignore
    const targetFileName = file === '_gitignore' ? '.gitignore' : file;
    const targetFile = path.join(targetPath, targetFileName);
    const stat = await fs.stat(sourceFile);

    if (stat.isDirectory()) {
      await copyTemplate(sourceFile, targetFile, data);
    }
    else {
      let content = await fs.readFile(sourceFile, 'utf-8');

      // Replace placeholders like {{name}}
      for (const [key, value] of Object.entries(data)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(placeholder, value);
      }

      await fs.writeFile(targetFile, content);
    }
  }
}
