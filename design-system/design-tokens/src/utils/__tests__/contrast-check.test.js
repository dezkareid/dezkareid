import { describe, it, expect } from 'vitest';
const { contrastRatio, hexToLuminance, resolveRef, runAudit } = require('../.././../scripts/contrast-check');

// ---------------------------------------------------------------------------
// hexToLuminance
// ---------------------------------------------------------------------------

describe('hexToLuminance', () => {
  it('white has luminance 1', () => {
    expect(hexToLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('black has luminance 0', () => {
    expect(hexToLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('mid-gray is between 0 and 1', () => {
    const l = hexToLuminance('#6b7280');
    expect(l).toBeGreaterThan(0);
    expect(l).toBeLessThan(1);
  });
});

// ---------------------------------------------------------------------------
// contrastRatio
// ---------------------------------------------------------------------------

describe('contrastRatio', () => {
  it('black on white is 21:1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('white on white is 1:1', () => {
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });

  it('is symmetric (fg/bg order does not matter)', () => {
    const a = contrastRatio('#3b82f6', '#ffffff');
    const b = contrastRatio('#ffffff', '#3b82f6');
    expect(a).toBeCloseTo(b, 10);
  });

  it('returns a value >= 1', () => {
    expect(contrastRatio('#6b7280', '#6b7280')).toBeCloseTo(1, 5);
  });
});

// ---------------------------------------------------------------------------
// resolveRef
// ---------------------------------------------------------------------------

describe('resolveRef', () => {
  const globals = {
    color: {
      base: {
        blue: { 500: { value: '#3b82f6' } },
        white: { value: '#ffffff' },
      },
    },
  };

  it('resolves a nested reference', () => {
    expect(resolveRef('{color.base.blue.500}', globals)).toBe('#3b82f6');
  });

  it('resolves a shallow reference', () => {
    expect(resolveRef('{color.base.white}', globals)).toBe('#ffffff');
  });

  it('throws for an unknown reference', () => {
    expect(() => resolveRef('{color.base.missing}', globals)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// runAudit — contract tests (shape and minimum pass expectations)
// ---------------------------------------------------------------------------

describe('runAudit', () => {
  it('returns results for both themes for every pair', () => {
    const results = runAudit();
    // Each pair × 2 themes
    const { PAIRS } = require('../../../scripts/contrast-check');
    expect(results).toHaveLength(PAIRS.length * 2);
  });

  it('every result has the required fields', () => {
    const results = runAudit();
    for (const r of results) {
      expect(r).toHaveProperty('label');
      expect(r).toHaveProperty('theme');
      expect(r).toHaveProperty('fg');
      expect(r).toHaveProperty('bg');
      expect(r).toHaveProperty('ratio');
      expect(r).toHaveProperty('aaLarge');
      expect(r).toHaveProperty('aaNormal');
    }
  });

  it('ratio is always >= 1', () => {
    const results = runAudit();
    for (const r of results) {
      expect(r.ratio).toBeGreaterThanOrEqual(1);
    }
  });

  it('text-primary on background-primary passes AA normal in both themes', () => {
    const results = runAudit();
    const relevant = results.filter((r) => r.label === 'text-primary on background-primary');
    expect(relevant).toHaveLength(2);
    for (const r of relevant) {
      expect(r.aaNormal).toBe(true);
    }
  });

  it('text-secondary on background-primary passes AA normal in both themes', () => {
    const results = runAudit();
    const relevant = results.filter((r) => r.label === 'text-secondary on background-primary');
    expect(relevant).toHaveLength(2);
    for (const r of relevant) {
      expect(r.aaNormal).toBe(true);
    }
  });
});
