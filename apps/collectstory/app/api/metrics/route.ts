import { NextResponse } from 'next/server';
import { getGlobalMetrics } from '@/lib/metrics';

export async function GET() {
  try {
    const metrics = await getGlobalMetrics();
    return NextResponse.json(metrics);
  }
  catch (error) {
    console.error('[/api/metrics] Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
