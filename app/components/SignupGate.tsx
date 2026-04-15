'use client';

import { useEffect, useMemo, useState } from 'react';
import posthog from 'posthog-js';
import { SignupForm } from './SignupForm';
import {
  getSignupTrackingContext,
  readStoredSignupIdentity,
  type StoredSignupIdentity,
  writeStoredSignupIdentity,
} from './signupTracking';
import { useLocaleMessages } from './LocaleProvider';

export function SignupGate() {
  const { messages: m, locale } = useLocaleMessages();
  const [storedIdentity, setStoredIdentity] = useState<StoredSignupIdentity | null | undefined>(
    undefined,
  );

  const context = useMemo(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    return getSignupTrackingContext(search, locale);
  }, [locale]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setStoredIdentity(readStoredSignupIdentity());
    });
  }, []);

  useEffect(() => {
    if (!storedIdentity) return;

    const contextKey = `${context.source}::${context.signup_phase}::${context.language}`;
    const storedKey = `${storedIdentity.last_touchpoint}::${storedIdentity.signup_phase}::${storedIdentity.language}`;
    if (contextKey === storedKey) return;

    (async () => {
      try {
        const res = await fetch('/api/touchpoint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: storedIdentity.email,
            phone: storedIdentity.phone,
            source: context.source,
            signup_phase: context.signup_phase,
            language: context.language,
          }),
        });

        if (!res.ok) return;
        const data = await res.json().catch(() => ({} as Record<string, unknown>));
        const touchpoint =
          typeof data.touchpoint === 'object' && data.touchpoint !== null
            ? (data.touchpoint as Record<string, unknown>)
            : {};
        const lastTouchAt =
          typeof touchpoint.last_touch_at === 'string'
            ? touchpoint.last_touch_at
            : new Date().toISOString();

        const updatedIdentity: StoredSignupIdentity = {
          ...storedIdentity,
          last_touchpoint: context.source,
          signup_phase: context.signup_phase,
          language: context.language,
          last_touch_at: lastTouchAt,
        };

        writeStoredSignupIdentity(updatedIdentity);
        setStoredIdentity(updatedIdentity);
        posthog.capture('landing_return_touch', {
          source: context.source,
          signup_phase: context.signup_phase,
        });
      } catch {
        // Best-effort tracking should not break the returning-user experience.
      }
    })();
  }, [context.language, context.signup_phase, context.source, storedIdentity]);

  if (storedIdentity === undefined) {
    return <SignupForm />;
  }

  if (!storedIdentity) {
    return <SignupForm />;
  }

  return (
    <div className="flex flex-col items-center text-center gap-5 py-8 w-full max-w-md">
      <p
        className="text-4xl uppercase tracking-wide"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
      >
        {m.signupGate.title}
      </p>
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
          {m.signupGate.body}
        </p>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          {m.signupGate.subnote}
        </p>
      </div>
      <a
        href="https://www.instagram.com/sisepuede1.0/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide"
      >
        {m.signupGate.followInstagram}
        <span>→</span>
      </a>
    </div>
  );
}
