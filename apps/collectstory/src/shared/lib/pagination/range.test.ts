import { describe, it, expect } from 'vitest';
import { getSupabaseRange, getTotalPages, DEFAULT_PAGE_SIZE } from './range';

describe('getSupabaseRange', () => {
  it.each([
    { page: 1, limit: 20, expected: { from: 0, to: 19 } },
    { page: 2, limit: 20, expected: { from: 20, to: 39 } },
    { page: 3, limit: 20, expected: { from: 40, to: 59 } },
    { page: 1, limit: 10, expected: { from: 0, to: 9 } },
    { page: 5, limit: 10, expected: { from: 40, to: 49 } },
    { page: 1, limit: 1, expected: { from: 0, to: 0 } },
    { page: 100, limit: 20, expected: { from: 1980, to: 1999 } },
  ])('page=$page, limit=$limit → from=$expected.from, to=$expected.to', ({ page, limit, expected }) => {
    expect(getSupabaseRange(page, limit)).toEqual(expected);
  });

  it('uses DEFAULT_PAGE_SIZE when limit is omitted', () => {
    const { from, to } = getSupabaseRange(2);
    expect(from).toBe(DEFAULT_PAGE_SIZE);
    expect(to).toBe(DEFAULT_PAGE_SIZE * 2 - 1);
  });
});

describe('getTotalPages', () => {
  it.each([
    { totalCount: 0, limit: 20, expected: 1 },
    { totalCount: 1, limit: 20, expected: 1 },
    { totalCount: 20, limit: 20, expected: 1 },
    { totalCount: 21, limit: 20, expected: 2 },
    { totalCount: 40, limit: 20, expected: 2 },
    { totalCount: 41, limit: 20, expected: 3 },
    { totalCount: 100, limit: 20, expected: 5 },
    { totalCount: 101, limit: 20, expected: 6 },
    { totalCount: 1, limit: 1, expected: 1 },
    { totalCount: 2, limit: 1, expected: 2 },
  ])('totalCount=$totalCount, limit=$limit → $expected pages', ({ totalCount, limit, expected }) => {
    expect(getTotalPages(totalCount, limit)).toBe(expected);
  });

  it('returns at least 1 page even for 0 items', () => {
    expect(getTotalPages(0, 20)).toBe(1);
  });

  it('uses DEFAULT_PAGE_SIZE when limit is omitted', () => {
    expect(getTotalPages(DEFAULT_PAGE_SIZE + 1)).toBe(2);
  });
});
