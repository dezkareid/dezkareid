import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { sessionId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify session ownership
  const { data: session } = await supabase
    .from('photo_sessions')
    .select('id, user_id')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();
  if (!session) return NextResponse.json({ error: 'Session not found or access denied' }, { status: 403 });

  let orderedIds: string[];
  try {
    const body = await request.json() as unknown;
    if (!body || typeof body !== 'object' || !('orderedIds' in body) || !Array.isArray((body as { orderedIds: unknown }).orderedIds)) {
      return NextResponse.json({ error: 'Invalid request body. Expected { orderedIds: string[] }' }, { status: 400 });
    }
    orderedIds = (body as { orderedIds: string[] }).orderedIds;
  }
  catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (orderedIds.length === 0) {
    return NextResponse.json({ ok: true });
  }

  // Batch update positions
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('session_photos')
      .update({ position: index })
      .eq('id', id)
      .eq('session_id', sessionId)
      .eq('user_id', user.id),
  );

  await Promise.all(updates);

  revalidateTag(`session-photos:${sessionId}`, 'max');

  return NextResponse.json({ ok: true });
}
