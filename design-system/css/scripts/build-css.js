import { bundle } from 'lightningcss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

async function build() {
  try {
    const folders = fs.readdirSync(distDir).filter(f => fs.statSync(path.join(distDir, f)).isDirectory() && f !== 'scss');
    
    // Process category folders
    for (const folder of folders) {
      const inputPath = path.join(distDir, folder, 'index.css');
      if (!fs.existsSync(inputPath)) continue;

      const outputPath = path.join(distDir, `${folder}.css`);
      console.log(`Bundling and minifying ${folder}/index.css -> ${folder}.css...`);
      
      let { code } = bundle({
        filename: inputPath,
        minify: true,
        sourceMap: false
      });

      fs.writeFileSync(outputPath, code);
      
      // Clean up folder
      fs.rmSync(path.join(distDir, folder), { recursive: true, force: true });
      console.log(`Successfully built ${folder}.css`);
    }

    // Process main.css at root
    const mainPath = path.join(distDir, 'main.css');
    if (fs.existsSync(mainPath)) {
      console.log('Bundling and minifying main.css...');
      let { code } = bundle({
        filename: mainPath,
        minify: true,
        sourceMap: false
      });
      fs.writeFileSync(mainPath, code);
      console.log('Successfully built main.css');
    }

  } catch (err) {
    console.error('Error during CSS build:', err);
    process.exit(1);
  }
}

build();
