import { NextResponse } from 'next/server';
import { getLastArrivals } from '@/lib/collections';

export async function GET() {
  try {
    const items = await getLastArrivals();
    return NextResponse.json(items);
  }
  catch (error) {
    console.error('[/api/latest-arrivals] Error fetching latest arrivals:', error);
    return NextResponse.json({ error: 'Failed to fetch latest arrivals' }, { status: 500 });
  }
}
