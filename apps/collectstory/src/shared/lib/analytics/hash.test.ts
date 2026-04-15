import { describe, it, expect } from 'vitest';
import { sha256 } from './hash';

describe('sha256', () => {
  const testCases = [
    {
      input: 'hello',
      expected: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    },
    {
      input: 'world',
      expected: '486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
    },
    {
      input: '',
      expected: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      input: '12345',
      expected: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
    },
  ];

  it.each(testCases)(
    'should correctly hash "$input"',
    async ({ input, expected }) => {
      const result = await sha256(input);
      expect(result).toBe(expected);
    },
  );

  it('should produce different hashes for different inputs', async () => {
    const hash1 = await sha256('abc');
    const hash2 = await sha256('abd');
    expect(hash1).not.toBe(hash2);
  });

  it('should produce the same hash for the same input', async () => {
    const hash1 = await sha256('stable');
    const hash2 = await sha256('stable');
    expect(hash1).toBe(hash2);
  });
});
