import { createClient } from '@/lib/supabase/server';

export type Role = 'admin' | 'user';

export interface SessionWithRole {
  user: { id: string; email: string | undefined };
  role: Role;
}

export async function getSessionAndRole(): Promise<SessionWithRole | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return undefined;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  return {
    user: { id: data.user.id, email: data.user.email },
    role: (profile?.role as Role) ?? 'user',
  };
}
