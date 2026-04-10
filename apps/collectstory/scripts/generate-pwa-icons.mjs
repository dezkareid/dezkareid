/**
 * One-off script to rasterise the Collectstory app SVG icon into PNG files
 * required by the web app manifest.
 *
 * Usage (from monorepo root):
 *   node apps/collectstory/scripts/generate-pwa-icons.mjs
 *
 * Requires: sharp (already a dependency of apps/collectstory)
 * Source SVG: design-system/icons/src/svg/collectstory-app.svg
 * Output: apps/collectstory/public/icons/icon-192.png
 *         apps/collectstory/public/icons/icon-512.png
 */

/* eslint-disable no-console */

import { readFileSync, mkdirSync } from 'node:fs';
import * as nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const { resolve, dirname } = nodePath;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, '..', '..', '..');

const svgPath = resolve(repoRoot, 'design-system/icons/src/svg/collectstory-app.svg');
const outputDirectory = resolve(scriptDirectory, '..', 'public', 'icons');

// Brand blue — matches favicon.svg fill and manifest theme_color
const BRAND_BLUE = { r: 37, g: 99, b: 235, alpha: 1 };

const sizes = [192, 512];

mkdirSync(outputDirectory, { recursive: true });

const svgBuffer = readFileSync(svgPath);

for (const size of sizes) {
  const outputPath = resolve(outputDirectory, `icon-${size}.png`);

  // Render SVG at target size with a white icon on brand-blue background
  const iconBuffer = await sharp(svgBuffer)
    .resize(size, size)
    // Tint to white so currentColor renders as white on the coloured background
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  // Composite white icon onto brand-blue background
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BLUE,
    },
  })
    .composite([{ input: iconBuffer, blend: 'multiply' }])
    .png()
    .toFile(outputPath);

  console.log(`✓ Generated icon-${size}.png`);
}

console.log('Done — PWA icons written to apps/collectstory/public/icons/');
