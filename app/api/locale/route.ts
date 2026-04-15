import { NextRequest, NextResponse } from 'next/server';
import { LOCALE_COOKIE, isValidLocale, type AppLocale } from '@/lib/i18n/locale';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const locale =
    typeof body === 'object' && body !== null && 'locale' in body
      ? (body as { locale: unknown }).locale
      : undefined;

  if (typeof locale !== 'string' || !isValidLocale(locale)) {
    return NextResponse.json({ message: 'Invalid locale' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, locale: locale as AppLocale });
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return res;
}
