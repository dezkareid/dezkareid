export const DEFAULT_PAGE_SIZE = 20;

export function getSupabaseRange(page: number, limit: number = DEFAULT_PAGE_SIZE): { from: number; to: number } {
  const from = (page - 1) * limit;
  const to = page * limit - 1;
  return { from, to };
}

export function getTotalPages(totalCount: number, limit: number = DEFAULT_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(totalCount / limit));
}
