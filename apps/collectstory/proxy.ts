import { createServerClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';
import { routing } from './app/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/**
 * Handles redirects for admin-only routes.
 */
async function handleAdminAccess(request: NextRequest, supabase: SupabaseClient, user: { sub: string } | undefined) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
    || pathname.match(/^\/(es|en)\/admin(\/.*)?$/);

  if (!isAdminPath) return;

  const localeMatch = pathname.match(/^\/(es|en)/);
  const locale = localeMatch ? localeMatch[0] : '';

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `${locale}/login`;
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.sub)
    .single();

  if (profile?.role !== 'admin') {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = `${locale}/`;
    return NextResponse.redirect(homeUrl);
  }

  return;
}

export async function proxy(request: NextRequest) {
  // 1. Run next-intl middleware
  const response = handleI18nRouting(request);

  // 2. Inject x-pathname so Server Components can read the current path
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Sync headers from next-intl response if any (e.g. x-middleware-rewrite)
  for (const [key, value] of response.headers.entries()) {
    if (key.startsWith('x-middleware')) {
      requestHeaders.set(key, value);
    }
  }

  const supabaseResponse = response;

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

          // Update supabaseResponse but preserve next-intl headers/status
          for (const { name, value, options } of cookiesToSet) supabaseResponse.cookies.set(name, value, options);
        },
      },
    },
  );

  // Must be called immediately after createServerClient — no code in between.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const adminRedirect = await handleAdminAccess(request, supabase, user);
  if (adminRedirect) return adminRedirect;

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
