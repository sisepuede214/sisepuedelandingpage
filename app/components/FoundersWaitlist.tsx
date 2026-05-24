'use client';

import { useEffect } from 'react';
import { SignupGate } from './SignupGate';

/** Ensures Klaviyo/PostHog source is founders_waitlist for sold-out signups. */
export function FoundersWaitlist() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('source') !== 'founders_waitlist') {
      url.searchParams.set('source', 'founders_waitlist');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return <SignupGate />;
}
