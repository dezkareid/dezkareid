import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SlugOption } from '@/app/[locale]/[username]/[collectionSlug]/actions';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const { mockRpc, mockSelect, mockGetUser } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
  mockSelect: vi.fn(),
  mockGetUser: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: mockGetUser },
    rpc: mockRpc,
    from: () => ({
      select: mockSelect,
    }),
  }),
}));

vi.mock('@/lib/slug', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/slug')>();
  return {
    ...actual,
    toSlug: (name: string) => name.toLowerCase().replaceAll(/\s+/g, '-'),
  };
});

// Import after mocks are set up
import { checkSlugCollision } from '@/app/[locale]/[username]/[collectionSlug]/actions';

const COLLECTION_ID = 'col-abc123';
const USER = { id: 'user-1' };

const FULL_OPTIONS: SlugOption[] = [
  { priority: 1, slug: 'barbie-masters', label: 'name + line' },
  { priority: 7, slug: 'barbie-ab12c', label: 'name + ID' },
];

const ID_ONLY_OPTION: SlugOption[] = [
  { priority: 7, slug: 'barbie-xk9z1', label: 'name + ID' },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('checkSlugCollision', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: USER }, error: null });
  });

  it.each([
    [
      'returns null when no collision (base slug is free)',
      [], // existing items with base slug
      [], // rpc options (irrelevant)
      null, // expected result
    ],
    [
      'returns slug options when collision detected',
      [{ slug: 'barbie' }], // base slug taken
      FULL_OPTIONS,
      FULL_OPTIONS,
    ],
    [
      'returns only ID fallback when all field-based options are taken',
      [{ slug: 'barbie' }],
      ID_ONLY_OPTION,
      ID_ONLY_OPTION,
    ],
    [
      'returns null when user is not authenticated',
      [],
      [],
      null,
    ],
  ])('%s', async (_label, existingItems, rpcOptions, expected) => {
    if (_label.includes('not authenticated')) {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    }

    // Mock the base-slug existence check
    const mockLimitFunction = vi.fn().mockResolvedValue({ data: existingItems, error: null });
    const mockEqFunction = vi.fn().mockReturnValue({ limit: mockLimitFunction });
    const mockEqFunction2 = vi.fn().mockReturnValue({ eq: mockEqFunction, limit: mockLimitFunction });
    mockSelect.mockReturnValue({ eq: mockEqFunction2 });

    // Mock the RPC call
    mockRpc.mockResolvedValue({ data: rpcOptions, error: null });

    const result = await checkSlugCollision(COLLECTION_ID, 'barbie', undefined, undefined, undefined);

    expect(result).toEqual(expected);
  });

  it('passes correct parameters to get_slug_options RPC', async () => {
    const mockLimitFunction = vi.fn().mockResolvedValue({ data: [{ slug: 'barbie' }], error: null });
    const mockEqFunction = vi.fn().mockReturnValue({ limit: mockLimitFunction });
    const mockEqFunction2 = vi.fn().mockReturnValue({ eq: mockEqFunction, limit: mockLimitFunction });
    mockSelect.mockReturnValue({ eq: mockEqFunction2 });
    mockRpc.mockResolvedValue({ data: FULL_OPTIONS, error: null });

    await checkSlugCollision(COLLECTION_ID, 'Barbie', 'Masters', 'Red', 'Mattel');

    expect(mockRpc).toHaveBeenCalledWith('get_slug_options', {
      p_collection_id: COLLECTION_ID,
      p_name: 'Barbie',
      p_line_name: 'Masters',
      p_variant: 'Red',
      p_brand_name: 'Mattel',
      p_exclude_slug: null,
    });
  });

  it.each([
    ['Unknown', 'Unknown', null],
    ['N/A', 'N/A', null],
    ['none', 'none', null],
    ['unknow', 'unknow', null],
    ['TBD', 'TBD', null],
    ['misc', 'misc', null],
  ])('passes null to RPC for meaningless %s line/variant/brand', async (_label, meaninglessValue) => {
    const mockLimitFunction = vi.fn().mockResolvedValue({ data: [{ slug: 'barbie' }], error: null });
    const mockEqFunction = vi.fn().mockReturnValue({ limit: mockLimitFunction });
    const mockEqFunction2 = vi.fn().mockReturnValue({ eq: mockEqFunction, limit: mockLimitFunction });
    mockSelect.mockReturnValue({ eq: mockEqFunction2 });
    mockRpc.mockResolvedValue({ data: FULL_OPTIONS, error: null });

    await checkSlugCollision(COLLECTION_ID, 'barbie', meaninglessValue, meaninglessValue, meaninglessValue);

    expect(mockRpc).toHaveBeenCalledWith('get_slug_options', expect.objectContaining({
      p_line_name: null,
      p_variant: null,
      p_brand_name: null,
    }));
  });

  it('returns null when RPC returns an error', async () => {
    const mockLimitFunction = vi.fn().mockResolvedValue({ data: [{ slug: 'barbie' }], error: null });
    const mockEqFunction = vi.fn().mockReturnValue({ limit: mockLimitFunction });
    const mockEqFunction2 = vi.fn().mockReturnValue({ eq: mockEqFunction, limit: mockLimitFunction });
    mockSelect.mockReturnValue({ eq: mockEqFunction2 });
    mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc error' } });

    const result = await checkSlugCollision(COLLECTION_ID, 'barbie', undefined, undefined, undefined);

    expect(result).toBeNull();
  });
});
