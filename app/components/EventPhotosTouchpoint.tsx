'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { readStoredSignupIdentity, writeStoredSignupIdentity } from './signupTracking';
import { TrackedLink } from './TrackedLink';
import { useLocaleMessages } from './LocaleProvider';

const PHOTOS_TOUCHPOINT_SOURCE = 'event_photos_touchpoint';
const PHOTOS_LINK_PLACEHOLDER = 'https://egphotography86.pixieset.com/sisepuedecincodemayo/';

export function EventPhotosTouchpoint() {
  const { locale, messages } = useLocaleMessages();

  useEffect(() => {
    const storedIdentity = readStoredSignupIdentity();
    if (!storedIdentity) return;
    if (storedIdentity.last_touchpoint === PHOTOS_TOUCHPOINT_SOURCE && storedIdentity.language === locale) {
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/touchpoint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: storedIdentity.email,
            phone: storedIdentity.phone,
            source: PHOTOS_TOUCHPOINT_SOURCE,
            signup_phase: 'post_event',
            language: locale,
            engagement_level: 'high',
          }),
        });
        if (!res.ok) return;

        const data = await res.json().catch(() => ({} as Record<string, unknown>));
        const touchpoint =
          typeof data.touchpoint === 'object' && data.touchpoint !== null
            ? (data.touchpoint as Record<string, unknown>)
            : {};
        const touchedAt =
          typeof touchpoint.last_touch_at === 'string'
            ? touchpoint.last_touch_at
            : new Date().toISOString();

        writeStoredSignupIdentity({
          ...storedIdentity,
          last_touchpoint: PHOTOS_TOUCHPOINT_SOURCE,
          signup_phase: 'post_event',
          language: locale,
          last_touch_at: touchedAt,
        });

        posthog.capture('landing_return_touch', {
          source: PHOTOS_TOUCHPOINT_SOURCE,
          signup_phase: 'post_event',
        });
      } catch {
        // Best-effort touchpoint tracking.
      }
    })();
  }, [locale]);

  return (
    <div className="w-full max-w-lg flex flex-col items-center text-center gap-4">
      <TrackedLink
        href={PHOTOS_LINK_PLACEHOLDER}
        eventName="cta_get_photos_clicked"
        eventProperties={{
          source: PHOTOS_TOUCHPOINT_SOURCE,
          cta_location: 'photos_primary',
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide"
      >
        {messages.photosPage.ctaLabel}
        <span>→</span>
      </TrackedLink>
    </div>
  );
}
