import fs from 'node:fs/promises';
import path from 'node:path';
import { optimize } from 'svgo';

const SVG_DIR = path.resolve('src/svg');
const REACT_DIR = path.resolve('src/react');
const ASTRO_DIR = path.resolve('src/astro');
const ICONS_FILE = path.resolve('src/icons.ts');

/** Convert kebab-case filename (without extension) to PascalCase component name */
function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/** Extract the inner SVG content (everything inside the root <svg> element) */
function extractInnerSvg(optimizedSvg: string): string {
  const match = optimizedSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  return match ? match[1].trim() : '';
}

/** Map of SVG attribute names to their JSX equivalents */
const SVG_ATTR_MAP: Record<string, string> = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'font-size': 'fontSize',
  'font-family': 'fontFamily',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
};

/** Convert SVG attribute string to JSX-compatible attributes */
function toJsxAttrs(attrs: string): string {
  return attrs.replace(/(\S+?)=/g, (_, attr) => {
    return (SVG_ATTR_MAP[attr] ?? attr) + '=';
  });
}

/** Extract all attributes from the root <svg> element except xmlns, one per line */
function extractSvgAttrs(optimizedSvg: string): string {
  const match = optimizedSvg.match(/<svg([^>]*)>/);
  if (!match) return '';
  const raw = match[1]
    .replace(/\s*xmlns="[^"]*"/, '')
    .trim();
  const jsxAttrs = toJsxAttrs(raw);
  // Split attr string into individual attr="value" tokens and put each on its own line
  const tokens = jsxAttrs.match(/\S+="[^"]*"/g) ?? [];
  return tokens.join('\n      ');
}

/**
 * Extract root <svg> attributes for Astro (HTML attribute names, no camelCase).
 * Excludes xmlns, viewBox (hardcoded in template), width, height.
 * Returns a string of `attr="value"` pairs separated by newlines, ready to
 * be inlined into the Astro <svg> template.
 */
function extractSvgAttrsHtml(optimizedSvg: string): string {
  const match = optimizedSvg.match(/<svg([^>]*)>/);
  if (!match) return '';
  const raw = match[1]
    .replace(/\s*xmlns="[^"]*"/, '')
    .replace(/\s*viewBox="[^"]*"/, '')
    .trim();
  const tokens = raw.match(/\S+="[^"]*"/g) ?? [];
  return tokens.join('\n  ');
}

async function buildIcons(): Promise<void> {
  // Ensure output directories exist
  await fs.mkdir(REACT_DIR, { recursive: true });
  await fs.mkdir(ASTRO_DIR, { recursive: true });

  const files = (await fs.readdir(SVG_DIR)).filter(f => f.endsWith('.svg'));
  files.sort();

  const exports: { name: string; kebab: string }[] = [];

  for (const file of files) {
    const kebab = file.replace(/\.svg$/, '');
    const name = toPascalCase(kebab);
    const raw = await fs.readFile(path.join(SVG_DIR, file), 'utf-8');

    const result = optimize(raw, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // convertColors is part of preset-default — disable to keep currentColor
              convertColors: false,
            },
          },
        },
        // removeViewBox must be listed outside preset-default overrides to disable it
        { name: 'removeViewBox', active: false },
        {
          name: 'removeAttrs',
          params: { attrs: ['svg:width', 'svg:height'] },
        },
      ],
    });

    const optimized = result.data;
    const innerSvg = extractInnerSvg(optimized);
    const sq = '\x27';
    const innerSvgEscaped = innerSvg.replace(/\\/g, '\\\\').replace(/'/g, `\\${sq}`);
    const svgAttrs = extractSvgAttrs(optimized);

    const component = `import type { SVGProps } from 'react';

interface ${name}Props extends SVGProps<SVGSVGElement> {
  label?: string;
}

export function ${name}({ label, style, ...props }: ${name}Props) {
  return (
    <svg
      ${svgAttrs}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={{ width: 'var(--icon-size, 1em)', height: 'var(--icon-size, 1em)', ...style }}
      {...props}
      dangerouslySetInnerHTML={{ __html: '${innerSvgEscaped}' }}
    />
  );
}
`;

    await fs.writeFile(path.join(REACT_DIR, `${name}.tsx`), component, 'utf-8');

    // Astro component — reuses the same innerSvg from the SVGO pass above.
    // The inner SVG is stored as a frontmatter const so that set:html={} (template
    // expression) is used instead of an HTML attribute string, avoiding parse
    // errors caused by > characters in path data.
    const innerSvgEscapedAstro = innerSvg.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const svgAttrsHtml = extractSvgAttrsHtml(optimized);
    const svgAttrsHtmlLine = svgAttrsHtml ? `\n  ${svgAttrsHtml}` : '';
    const astroComponent = `---
interface Props {
  label?: string;
  class?: string;
}

const { label, class: className } = Astro.props;
const innerSvg = \`${innerSvgEscapedAstro}\`;
---

<svg
  viewBox="0 0 24 24"${svgAttrsHtmlLine}
  aria-hidden={label ? undefined : 'true'}
  aria-label={label}
  role={label ? 'img' : undefined}
  class={className}
  style="width: var(--icon-size, 1em); height: var(--icon-size, 1em);"
>
  <Fragment set:html={innerSvg} />
</svg>
`;
    await fs.writeFile(path.join(ASTRO_DIR, `${name}.astro`), astroComponent, 'utf-8');

    exports.push({ name, kebab });
    console.log(`  ✓ ${file} → ${name}.tsx + ${name}.astro`);
  }

  // Emit React barrel index
  const barrel = exports.map(({ name }) => `export { ${name} } from './${name}.js';`).join('\n') + '\n';
  await fs.writeFile(path.join(REACT_DIR, 'index.ts'), barrel, 'utf-8');

  // Emit Astro barrel index
  const astroBarrel = exports.map(({ name }) => `export { default as ${name} } from './${name}.astro';`).join('\n') + '\n';
  await fs.writeFile(path.join(ASTRO_DIR, 'index.ts'), astroBarrel, 'utf-8');

  // Emit IconName union type
  const [first, ...rest] = exports.map(({ kebab }) => kebab);
  const restLines = rest.map(kebab => `    | '${kebab}'`).join('\n');
  const iconsTs = `// Auto-generated by scripts/build-icons.ts — do not edit manually\nexport type IconName\n  = '${first}'\n${restLines};\n`;
  await fs.writeFile(ICONS_FILE, iconsTs, 'utf-8');

  console.log(`\nGenerated ${exports.length} icons → src/react/ + src/astro/`);
  console.log('Generated src/icons.ts');
}

buildIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
