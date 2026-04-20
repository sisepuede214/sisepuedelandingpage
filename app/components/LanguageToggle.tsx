'use client';

import { usePathname, useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import type { AppLocale } from '@/lib/i18n/locale';
import { useLocaleMessages } from './LocaleProvider';

export function LanguageToggle() {
  const { locale, messages } = useLocaleMessages();
  const router = useRouter();
  const pathname = usePathname();

  async function switchTo(next: AppLocale) {
    if (next === locale) return;
    posthog.capture('language_switched', {
      from_locale: locale,
      to_locale: next,
    });
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: next }),
    });
    const parts = pathname.split('/');
    if (parts[1] === 'en' || parts[1] === 'es') {
      parts[1] = next;
    } else {
      parts.splice(1, 0, next);
    }
    const nextPath = parts.join('/') || `/${next}`;
    const search = typeof window !== 'undefined' ? window.location.search : '';
    router.replace(`${nextPath}${search}`);
    router.refresh();
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border px-1 py-0.5 text-xs font-semibold uppercase tracking-wide"
      style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      role="group"
      aria-label={messages.nav.languageToggle}
    >
      <button
        type="button"
        onClick={() => void switchTo('en')}
        className="rounded px-2 py-1 transition-colors"
        style={{
          background: locale === 'en' ? 'var(--accent)' : 'transparent',
          color: locale === 'en' ? '#fff' : 'inherit',
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => void switchTo('es')}
        className="rounded px-2 py-1 transition-colors"
        style={{
          background: locale === 'es' ? 'var(--accent)' : 'transparent',
          color: locale === 'es' ? '#fff' : 'inherit',
        }}
      >
        ES
      </button>
    </div>
  );
}
