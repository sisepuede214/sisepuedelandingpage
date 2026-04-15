export const LOCALE_COOKIE = 'sise_locale';

export const SUPPORTED_LOCALES = ['en', 'es'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export function isValidLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function preferredLocaleFromAcceptLanguage(header: string | null): AppLocale {
  if (!header) return 'en';
  const first = header.split(',')[0]?.trim().toLowerCase() ?? '';
  if (first.startsWith('es')) return 'es';
  return 'en';
}
