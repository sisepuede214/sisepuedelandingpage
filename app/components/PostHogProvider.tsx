'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

let didInitPostHog = false;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!didInitPostHog) {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (key) {
      posthog.init(key, {
        api_host: host ?? 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        persistence: 'localStorage',
      });
      didInitPostHog = true;
    }
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
