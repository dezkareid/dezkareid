import { describe, it, expect } from 'vitest';
const { getCssName, getScssName, getJsName } = require('../token-naming');

describe('token-naming', () => {
  const standardToken = {
    path: ['color', 'base', 'blue', '500'],
    value: '#3b82f6'
  };

  const lightToken = {
    path: ['color', 'semantic', 'light', 'primary'],
    value: '#3b82f6'
  };

  const darkToken = {
    path: ['color', 'semantic', 'dark', 'primary'],
    value: '#dbeafe'
  };

  describe('getCssName', () => {
    it('should format standard tokens with hyphens', () => {
      expect(getCssName(standardToken)).toBe('color-base-blue-500');
    });

    it('should format light semantic tokens with light- prefix', () => {
      expect(getCssName(lightToken)).toBe('light-color-primary');
    });

    it('should format dark semantic tokens with dark- prefix', () => {
      expect(getCssName(darkToken)).toBe('dark-color-primary');
    });
  });

  describe('getScssName', () => {
    it('should format all tokens with hyphens', () => {
      expect(getScssName(standardToken)).toBe('color-base-blue-500');
      expect(getScssName(lightToken)).toBe('color-semantic-light-primary');
    });
  });

  describe('getJsName', () => {
    it('should format standard tokens in PascalCase with val prefix for numbers', () => {
      expect(getJsName(standardToken)).toBe('ColorBaseBlueVal500');
    });

    it('should format light semantic tokens with Light prefix', () => {
      expect(getJsName(lightToken)).toBe('LightColorPrimary');
    });

    it('should format dark semantic tokens with Dark prefix', () => {
      expect(getJsName(darkToken)).toBe('DarkColorPrimary');
    });
  });
});
