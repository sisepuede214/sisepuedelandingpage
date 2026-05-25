'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useLocaleMessages } from './LocaleProvider';
import {
  FOUNDERS_PAGE_SOURCE,
  getOrCreateFoundersVisitorId,
  hasFoundersVisitRecorded,
  markFoundersVisitRecorded,
} from '@/lib/founders-visit-tracking';
import {
  getSignupTrackingContext,
  getUtmContext,
  readStoredSignupIdentity,
  writeStoredSignupIdentity,
} from './signupTracking';

export function FoundersPageTouchpoint() {
  const { locale } = useLocaleMessages();

  useEffect(() => {
    if (hasFoundersVisitRecorded(locale)) return;

    const storedIdentity = readStoredSignupIdentity();
    if (
      storedIdentity?.last_touchpoint === FOUNDERS_PAGE_SOURCE &&
      storedIdentity.language === locale
    ) {
      markFoundersVisitRecorded(locale);
      return;
    }

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const trackingContext = getSignupTrackingContext(search, locale);
    const utm = getUtmContext(search);
    const visitorId = storedIdentity ? undefined : getOrCreateFoundersVisitorId();

    (async () => {
      try {
        const res = await fetch('/api/founders-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: storedIdentity?.email,
            phone: storedIdentity?.phone,
            visitor_id: visitorId,
            language: locale,
            signup_phase: storedIdentity?.signup_phase ?? trackingContext.signup_phase,
            ...utm,
          }),
        });
        if (!res.ok) return;

        const data = await res.json().catch(() => ({} as Record<string, unknown>));
        const visit =
          typeof data.visit === 'object' && data.visit !== null
            ? (data.visit as Record<string, unknown>)
            : {};
        const touchedAt =
          typeof visit.last_touch_at === 'string'
            ? visit.last_touch_at
            : new Date().toISOString();

        if (storedIdentity) {
          writeStoredSignupIdentity({
            ...storedIdentity,
            last_touchpoint: FOUNDERS_PAGE_SOURCE,
            language: locale,
            last_touch_at: touchedAt,
          });
        }

        markFoundersVisitRecorded(locale);

        posthog.capture('founders_page_visit', {
          source: FOUNDERS_PAGE_SOURCE,
          language: locale,
          has_email: Boolean(storedIdentity?.email),
        });
      } catch {
        // Best-effort Klaviyo tracking.
      }
    })();
  }, [locale]);

  return null;
}
