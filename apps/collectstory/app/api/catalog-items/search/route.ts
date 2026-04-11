import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim() ?? '';
  const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 20);

  if (!q) {
    return NextResponse.json({ items: [] }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('search_catalog_items', {
    query: q,
    max_results: limit,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  return NextResponse.json({ items: data ?? [] }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
