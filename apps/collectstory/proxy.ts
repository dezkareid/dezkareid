import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);

          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) supabaseResponse.cookies.set(name, value, options);
        },
      },
    },
  );

  // Must be called immediately after createServerClient — no code in between.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;

  if (!user && (pathname.startsWith('/collection') || pathname.startsWith('/admin'))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // For /admin routes, check the role — redirect non-admins to /collection.
  // The admin layout performs a second server-side check as defense-in-depth.
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profile?.role !== 'admin') {
      const collectionUrl = request.nextUrl.clone();
      collectionUrl.pathname = '/collection';
      return NextResponse.redirect(collectionUrl);
    }
  }

  // IMPORTANT: return supabaseResponse unmodified to preserve cookie sync.
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
