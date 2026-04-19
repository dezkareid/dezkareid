import { NextRequest, NextResponse } from 'next/server';
import { getPublicItemsInCollection } from '@/lib/collections';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const collectionId = searchParams.get('collectionId');
  const username = searchParams.get('username');
  const collectionSlug = searchParams.get('collectionSlug');
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  if (!collectionId || !username || !collectionSlug) {
    return NextResponse.json({ error: 'collectionId, username, and collectionSlug are required' }, { status: 400 });
  }

  try {
    const result = await getPublicItemsInCollection(collectionId, username, collectionSlug, page);
    return NextResponse.json(result);
  }
  catch (error) {
    console.error('[/api/collection-items] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch collection items' }, { status: 500 });
  }
}
