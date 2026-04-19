import { NextRequest, NextResponse } from 'next/server';
import { getPublicCollectionsByUsername } from '@/lib/collections';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get('username');
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  try {
    const result = await getPublicCollectionsByUsername(username, page);
    if (!result) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(result);
  }
  catch (error) {
    console.error('[/api/collections] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}
