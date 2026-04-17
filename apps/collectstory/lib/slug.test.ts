import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toSlug, toSlugField, generateUniqueSlug } from './slug';

// ─── toSlug ───────────────────────────────────────────────────────────────────

describe('toSlug', () => {
  it.each([
    ['lowercases input', 'Spider-Man', 'spider-man'],
    ['strips accents', 'Barbie Niña', 'barbie-nina'],
    ['strips accents — complex', 'José María', 'jose-maria'],
    ['collapses multiple separators', 'a  b--c', 'a-b-c'],
    ['trims leading dashes', '-hello', 'hello'],
    ['trims trailing dashes', 'hello-', 'hello'],
    ['trims both leading+trailing dashes', '-hello-', 'hello'],
    ['handles special characters', 'S.H. Figuarts!', 's-h-figuarts'],
    ['handles numbers', 'Unit 01', 'unit-01'],
    ['truncates at 60 chars', 'a'.repeat(70), 'a'.repeat(60)],
    ['handles empty string', '', ''],
    ['handles only special chars', '!!!', ''],
  ])('%s — input %j → %j', (_label, input, expected) => {
    expect(toSlug(input)).toBe(expected);
  });
});

// ─── toSlugField ──────────────────────────────────────────────────────────────

describe('toSlugField', () => {
  it.each([
    ['returns slugified value for normal input', 'Masters of the Universe', 'masters-of-the-universe'],
    ['returns slugified value for brand name', 'Mattel', 'mattel'],
    ['returns undefined for undefined input', undefined, undefined],
    ['returns undefined for empty string', '', undefined],
    ['returns undefined for "Unknown"', 'Unknown', undefined],
    ['returns undefined for "unknow" (typo)', 'unknow', undefined],
    ['returns undefined for "N/A"', 'N/A', undefined],
    ['returns undefined for "NA"', 'NA', undefined],
    ['returns undefined for "None"', 'None', undefined],
    ['returns undefined for "none" lowercase', 'none', undefined],
    ['returns undefined for "Other"', 'Other', undefined],
    ['returns undefined for "misc"', 'misc', undefined],
    ['returns undefined for "TBD"', 'TBD', undefined],
    ['returns valid slug for accented meaningful value', 'Niña', 'nina'],
  ])('%s', (_label, input, expected) => {
    expect(toSlugField(input)).toBe(expected);
  });
});

// ─── generateUniqueSlug ───────────────────────────────────────────────────────

function makeMockSupabase(existingSlugs: string[]): SupabaseClient {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          like: () => Promise.resolve({ data: existingSlugs.map(slug => ({ slug })), error: null }),
        }),
      }),
    }),
  } as unknown as SupabaseClient;
}

describe('generateUniqueSlug', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['returns base slug when collection is empty', [], 'barbie', /^barbie$/],
    ['returns base slug when no collision', ['other-item'], 'barbie', /^barbie$/],
    ['returns base slug even with unrelated prefix', ['barbie-doll'], 'barbie', /^barbie$/],
    ['appends random ID suffix on exact collision', ['barbie'], 'barbie', /^barbie-[a-z0-9]+$/],
    ['generated suffix is different from taken slugs', ['barbie', 'barbie-ab12'], 'barbie', /^barbie-[a-z0-9]+$/],
    ['works with accented name', [], 'Barbie Niña', /^barbie-nina$/],
  ])('%s', async (_label, existingSlugs, name, expectedPattern) => {
    const supabase = makeMockSupabase(existingSlugs);
    const result = await generateUniqueSlug(supabase, 'collection-id-123', name);
    expect(result).toMatch(expectedPattern);
  });

  it('does not return a slug already in the taken set', async () => {
    const taken = Array.from({ length: 50 }, (_, index) => `barbie-${index.toString(36)}`);
    const supabase = makeMockSupabase(taken);
    const result = await generateUniqueSlug(supabase, 'collection-id-123', 'barbie');
    expect(taken).not.toContain(result);
  });
});
