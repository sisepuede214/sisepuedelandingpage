import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  LOCALE_COOKIE,
  isValidLocale,
  preferredLocaleFromAcceptLanguage,
  type AppLocale,
} from './lib/i18n/locale';

const STATIC_FILE = /\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot|txt|xml|js|map)$/i;

function setLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (STATIC_FILE.test(pathname)) {
    return NextResponse.next();
  }
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first === 'en' || first === 'es') {
    const res = NextResponse.next();
    setLocaleCookie(res, first);
    return res;
  }

  const cookieRaw = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: AppLocale =
    cookieRaw && isValidLocale(cookieRaw)
      ? cookieRaw
      : preferredLocaleFromAcceptLanguage(request.headers.get('accept-language'));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  const res = NextResponse.redirect(url);
  setLocaleCookie(res, locale);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
