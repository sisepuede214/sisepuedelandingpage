'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import {
  readPostHogConsent,
  writePostHogConsent,
  type PostHogConsentStatus,
} from './posthogTracking';

let didInitPostHog = false;

function TrackingConsentBanner({
  onAccept,
  onDecline,
  onClose,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t p-4 sm:p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
          We use analytics cookies to understand site performance and improve the signup flow.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDecline}
            className="rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-2 py-2 text-xs font-semibold"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            aria-label="Close consent banner"
          >
            x
          </button>
        </div>
      </div>
    </div>
  );
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<PostHogConsentStatus | null>(() => readPostHogConsent());
  const [isBannerOpen, setIsBannerOpen] = useState(() => readPostHogConsent() === null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key) return;

    if (!didInitPostHog) {
      posthog.init(key, {
        api_host: host ?? 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        persistence: 'localStorage',
        opt_out_capturing_by_default: consent !== 'accepted',
      });
      didInitPostHog = true;
    }

    if (consent === 'accepted') {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, [consent]);

  function updateConsent(next: PostHogConsentStatus) {
    writePostHogConsent(next);
    setConsent(next);
    setIsBannerOpen(false);
  }

  return (
    <PHProvider client={posthog}>
      {children}
      <button
        type="button"
        onClick={() => setIsBannerOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--muted)' }}
      >
        Privacy
      </button>
      {isBannerOpen && (
        <TrackingConsentBanner
          onAccept={() => updateConsent('accepted')}
          onDecline={() => updateConsent('declined')}
          onClose={() => setIsBannerOpen(false)}
        />
      )}
    </PHProvider>
  );
}
