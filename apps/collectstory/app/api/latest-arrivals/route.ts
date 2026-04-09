import { NextResponse } from 'next/server';
import { getLatestPublicItems } from '@/lib/collections';

export async function GET() {
  try {
    const items = await getLatestPublicItems(4);
    return NextResponse.json(items);
  }
  catch (error) {
    console.error('[/api/latest-arrivals] Error fetching latest arrivals:', error);
    return NextResponse.json({ error: 'Failed to fetch latest arrivals' }, { status: 500 });
  }
}
