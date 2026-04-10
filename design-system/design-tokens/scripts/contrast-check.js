#!/usr/bin/env node

'use strict';

const globalTokens = require('../src/tokens/color/global.json');
const semanticTokens = require('../src/tokens/color/semantic.json');

// ---------------------------------------------------------------------------
// Token resolution
// ---------------------------------------------------------------------------

/**
 * Resolves a Style Dictionary reference like "{color.base.blue.500}" to its
 * hex value by walking the global token tree.
 *
 * @param {string} ref - e.g. "{color.base.blue.500}"
 * @param {object} globals - the parsed global.json object
 * @returns {string} hex color value
 */
function resolveRef(ref, globals) {
  const key = ref.replace(/^\{/, '').replace(/\}$/, '');
  const parts = key.split('.');
  let node = globals;
  for (const part of parts) {
    node = node[part];
    if (node === undefined) throw new Error(`Cannot resolve token reference: ${ref}`);
  }
  return node.value;
}

// ---------------------------------------------------------------------------
// WCAG contrast ratio
// ---------------------------------------------------------------------------

/**
 * Converts a hex color string to relative luminance (WCAG 2.x formula).
 *
 * @param {string} hex - e.g. "#3b82f6"
 * @returns {number} relative luminance [0, 1]
 */
function hexToLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculates the WCAG contrast ratio between two colors.
 *
 * @param {string} fg - foreground hex color
 * @param {string} bg - background hex color
 * @returns {number} contrast ratio (1–21)
 */
function contrastRatio(fg, bg) {
  const l1 = hexToLuminance(fg);
  const l2 = hexToLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Semantic pair definitions
// ---------------------------------------------------------------------------

/**
 * Returns the resolved hex value for a semantic token by theme.
 *
 * @param {string[]} path - e.g. ["background", "primary"]
 * @param {"light"|"dark"} theme
 */
function resolveSemanticHex(path, theme) {
  let node = semanticTokens.color.semantic[theme];
  for (const key of path) {
    node = node[key];
    if (!node) throw new Error(`Semantic token not found: color.semantic.${theme}.${path.join('.')}`);
  }
  return resolveRef(node.value, globalTokens);
}

/**
 * Pairs to audit: { label, foreground path, background path }.
 * These represent intentional foreground-on-background combinations from the
 * design system. Both paths are relative to color.semantic.<theme>.
 */
const PAIRS = [
  {
    label: 'text-primary on background-primary',
    fg: ['text', 'primary'],
    bg: ['background', 'primary'],
  },
  {
    label: 'text-primary on background-secondary',
    fg: ['text', 'primary'],
    bg: ['background', 'secondary'],
  },
  {
    label: 'text-secondary on background-primary',
    fg: ['text', 'secondary'],
    bg: ['background', 'primary'],
  },
  {
    label: 'text-secondary on background-secondary',
    fg: ['text', 'secondary'],
    bg: ['background', 'secondary'],
  },
  // text-inverse is designed for use on colored/branded surfaces (e.g. white
  // text on a filled button), not on standard backgrounds — excluded here.
  {
    label: 'primary on background-primary',
    fg: ['primary'],
    bg: ['background', 'primary'],
  },
  {
    label: 'primary on background-secondary',
    fg: ['primary'],
    bg: ['background', 'secondary'],
  },
  {
    label: 'error on background-primary',
    fg: ['error'],
    bg: ['background', 'primary'],
  },
  {
    label: 'error on background-secondary',
    fg: ['error'],
    bg: ['background', 'secondary'],
  },
  {
    label: 'like on background-primary',
    fg: ['like'],
    bg: ['background', 'primary'],
  },
  {
    label: 'like on background-secondary',
    fg: ['like'],
    bg: ['background', 'secondary'],
  },
];

// ---------------------------------------------------------------------------
// Audit runner
// ---------------------------------------------------------------------------

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;

/**
 * @typedef {{ label: string, theme: string, fg: string, bg: string, ratio: number, aaLarge: boolean, aaNormal: boolean }} AuditResult
 */

/**
 * Runs the full contrast audit across light and dark themes for all pairs.
 *
 * @returns {AuditResult[]}
 */
function runAudit() {
  const results = [];

  for (const theme of ['light', 'dark']) {
    for (const pair of PAIRS) {
      const fg = resolveSemanticHex(pair.fg, theme);
      const bg = resolveSemanticHex(pair.bg, theme);
      const ratio = contrastRatio(fg, bg);

      results.push({
        label: pair.label,
        theme,
        fg,
        bg,
        ratio,
        aaLarge: ratio >= WCAG_AA_LARGE,
        aaNormal: ratio >= WCAG_AA_NORMAL,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// CLI output
// ---------------------------------------------------------------------------

function formatRatio(ratio) {
  return ratio.toFixed(2) + ':1';
}

if (require.main === module) {
  const results = runAudit();

  let failures = 0;

  console.log('\n=== Design Token Contrast Audit (WCAG 2.x AA) ===\n');

  for (const r of results) {
    const status = r.aaNormal ? '✅ PASS' : r.aaLarge ? '⚠️  LARGE' : '❌ FAIL';
    if (!r.aaNormal) failures++;

    console.log(
      `[${r.theme.toUpperCase().padEnd(5)}] ${status}  ${formatRatio(r.ratio).padStart(7)}  ${r.label}`
    );
    if (!r.aaNormal) {
      console.log(`         fg: ${r.fg}  bg: ${r.bg}`);
    }
  }

  const passCount = results.filter((r) => r.aaNormal).length;
  console.log(`\n${passCount}/${results.length} pairs pass AA (normal text, 4.5:1).`);

  if (failures > 0) {
    console.log(`\n${failures} failure(s) found. Fix the semantic token pairings above.\n`);
    process.exit(1);
  } else {
    console.log('\nAll pairs pass. ✅\n');
  }
}

module.exports = { contrastRatio, hexToLuminance, resolveRef, runAudit, PAIRS };
