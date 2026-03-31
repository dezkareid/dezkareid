import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParameter = searchParams.get('next') ?? '/collection';
  // Validate next is an internal path to prevent open redirect attacks.
  const next = nextParameter.startsWith('/') && !nextParameter.startsWith('//') ? nextParameter : '/collection';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // If no explicit `next`, redirect to the user's public profile.
      // Fall back to profile edit if they haven't set a username yet.
      if (nextParameter === '/collection') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        const destination = profile?.username ? `/${profile.username}` : '/collection/edit';
        return NextResponse.redirect(`${origin}${destination}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
