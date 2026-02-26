import { describe, it, expect } from 'vitest';
const { generateCatalog } = require('../catalog-generator');

describe('catalog-generator', () => {
  const tokens = [
    {
      path: ['color', 'base', 'red', '500'],
      value: '#ff0000'
    },
    {
      path: ['spacing', 'sm'],
      value: '8px'
    },
    {
      path: ['typography', 'body'],
      value: { fontSize: '16px', lineHeight: '1.5' }
    }
  ];

  describe('generateCatalog', () => {
    it('should include all token categories as headers', () => {
      const markdown = generateCatalog(tokens);
      expect(markdown).toContain('## Color');
      expect(markdown).toContain('## Spacing');
      expect(markdown).toContain('## Typography');
    });

    it('should include CSS, SCSS, and JS variable names in the table', () => {
      const markdown = generateCatalog(tokens);
      expect(markdown).toContain('| CSS Variable | SCSS Variable | JS Variable | Value |');
      expect(markdown).toContain('--color-base-red-500');
      expect(markdown).toContain('$color-base-red-500');
      expect(markdown).toContain('ColorBaseRedVal500');
    });

    it('should stringify object values (like typography)', () => {
      const markdown = generateCatalog(tokens);
      expect(markdown).toContain('{"fontSize":"16px","lineHeight":"1.5"}');
    });

    it('should include a main title and description', () => {
      const markdown = generateCatalog(tokens);
      expect(markdown).toContain('# Design Tokens Catalog');
      expect(markdown).toContain('optimized for AI');
    });
  });
});
