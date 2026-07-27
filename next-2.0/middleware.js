import { NextResponse } from 'next/server';
import { SUPPORTED_LANGS, DEFAULT_LANG } from '@/lib/routes';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore static files, next internal paths, public assets, and api
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a supported language
  const hasLang = SUPPORTED_LANGS.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (hasLang) {
    return NextResponse.next();
  }

  // Redirect to default locale prefix
  const targetPath = pathname === '/' ? `/${DEFAULT_LANG}` : `/${DEFAULT_LANG}${pathname}`;
  return NextResponse.redirect(new URL(targetPath, request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
