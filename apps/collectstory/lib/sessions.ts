import { cacheLife, cacheTag } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export type PublicSession = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | undefined;
  likes_count: number;
  photo_count: number;
  cover_url: string | undefined;
};

export type SessionPhoto = {
  id: string;
  session_id: string;
  image_url: string;
  position: number;
};

export async function getSessionsByUsername(
  username: string,
): Promise<{ sessions: PublicSession[]; userId: string; avatarUrl: string | undefined } | undefined> {
  'use cache';
  cacheLife('user-content');
  cacheTag(`sessions:${username}`);

  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) return undefined;

  const { data: rows } = await supabase
    .from('photo_sessions')
    .select('id, user_id, name, slug, description, likes_count')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  if (!rows) return { sessions: [], userId: profile.id, avatarUrl: profile.avatar_url ?? undefined };

  const sessions: PublicSession[] = await Promise.all(
    rows.map(async (row) => {
      const [{ count }, { data: cover }] = await Promise.all([
        supabase
          .from('session_photos')
          .select('id', { count: 'exact', head: true })
          .eq('session_id', row.id),
        supabase
          .from('session_photos')
          .select('image_url')
          .eq('session_id', row.id)
          .order('position', { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);

      return {
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        slug: row.slug,
        description: row.description ?? undefined,
        likes_count: row.likes_count,
        photo_count: count ?? 0,
        cover_url: cover?.image_url ?? undefined,
      };
    }),
  );

  return { sessions, userId: profile.id, avatarUrl: profile.avatar_url ?? undefined };
}

export async function getSessionBySlug(
  username: string,
  sessionSlug: string,
): Promise<(PublicSession & { username: string }) | undefined> {
  'use cache';
  cacheLife('user-content');
  cacheTag(`session:${username}:${sessionSlug}`);

  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile) return undefined;

  const { data: row } = await supabase
    .from('photo_sessions')
    .select('id, user_id, name, slug, description, likes_count')
    .eq('user_id', profile.id)
    .eq('slug', sessionSlug)
    .single();

  if (!row) return undefined;

  const [{ count }, { data: cover }] = await Promise.all([
    supabase
      .from('session_photos')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', row.id),
    supabase
      .from('session_photos')
      .select('image_url')
      .eq('session_id', row.id)
      .order('position', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    likes_count: row.likes_count,
    photo_count: count ?? 0,
    cover_url: cover?.image_url ?? undefined,
    username,
  };
}

export async function getSessionPhotos(sessionId: string): Promise<SessionPhoto[]> {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from('session_photos')
    .select('id, session_id, image_url, position')
    .eq('session_id', sessionId)
    .order('position', { ascending: true });

  return (data ?? []).map(row => ({
    id: row.id,
    session_id: row.session_id,
    image_url: row.image_url,
    position: row.position,
  }));
}

export async function getUserSessionCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('photo_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  return count ?? 0;
}

export async function getSessionPhotoCount(sessionId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('session_photos')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId);
  return count ?? 0;
}

export async function isSessionLikedByUser(
  sessionId: string,
  userId: string,
): Promise<boolean> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('session_likes')
    .select('session_id')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();
  return data !== null;
}
