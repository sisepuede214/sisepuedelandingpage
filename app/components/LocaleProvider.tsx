'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { AppLocale } from '@/lib/i18n/locale';
import type { Messages } from '@/lib/i18n/messages';

const LocaleContext = createContext<{ locale: AppLocale; messages: Messages } | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: AppLocale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleMessages() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocaleMessages must be used within LocaleProvider');
  }
  return ctx;
}
