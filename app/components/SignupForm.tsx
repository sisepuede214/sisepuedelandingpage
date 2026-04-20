'use client';

import { useState, useRef } from 'react';
import posthog from 'posthog-js';
import { getSignupTrackingContext, writeStoredSignupIdentity } from './signupTracking';
import { useLocaleMessages } from './LocaleProvider';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function SignupForm() {
  const { messages: m, locale } = useLocaleMessages();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const hasStarted = useRef(false);

  function buildSignupEventProps(extra?: Record<string, unknown>) {
    const context = getSignupTrackingContext(window.location.search, locale);
    return { ...context, ...(extra ?? {}) };
  }

  function handleFirstInteraction() {
    if (!hasStarted.current) {
      hasStarted.current = true;
      posthog.capture('signup_form_started', buildSignupEventProps());
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const hasPhone = Boolean(phone && smsConsent);
    const context = getSignupTrackingContext(window.location.search, locale);
    posthog.capture('signup_submitted', {
      ...context,
      has_phone: hasPhone,
    });

    setFormState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: smsConsent && phone ? phone : undefined,
          sms_consent: smsConsent && Boolean(phone),
          source: context.source,
          signup_phase: context.signup_phase,
          language: context.language,
        }),
      });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));

      if (!res.ok) {
        throw new Error(
          typeof data.message === 'string' ? data.message : m.signupForm.errorGeneric,
        );
      }

      const identity =
        typeof data.identity === 'object' && data.identity !== null
          ? (data.identity as Record<string, unknown>)
          : {};
      const nowIso = new Date().toISOString();

      const storedLanguage =
        identity.language === 'es' || identity.language === 'en'
          ? identity.language
          : locale;

      writeStoredSignupIdentity({
        email: typeof identity.email === 'string' ? identity.email : email.trim(),
        phone:
          typeof identity.phone === 'string'
            ? identity.phone
            : smsConsent && phone.trim()
              ? phone.trim()
              : undefined,
        signed_up_at: nowIso,
        last_touchpoint:
          typeof identity.last_touchpoint === 'string'
            ? identity.last_touchpoint
            : context.source,
        signup_phase:
          typeof identity.signup_phase === 'string'
            ? identity.signup_phase
            : context.signup_phase,
        language: storedLanguage,
        last_touch_at:
          typeof identity.last_touch_at === 'string'
            ? identity.last_touch_at
            : nowIso,
      });

      const identifiedEmail = typeof identity.email === 'string' ? identity.email : email.trim();
      posthog.identify(identifiedEmail, {
        email: identifiedEmail,
        language: storedLanguage,
        signup_phase:
          typeof identity.signup_phase === 'string'
            ? identity.signup_phase
            : context.signup_phase,
        last_touchpoint:
          typeof identity.last_touchpoint === 'string'
            ? identity.last_touchpoint
            : context.source,
        has_phone: hasPhone,
      });

      posthog.capture('signup_success', { ...context, has_phone: hasPhone });
      setFormState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : m.signupForm.errorGeneric;
      posthog.capture('signup_error', { ...context, error: message });
      setErrorMsg(message);
      setFormState('error');
    }
  }

  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-8 w-full max-w-md">
        <p
          className="text-4xl uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
        >
          {m.signupForm.successTitle}
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
            {m.signupForm.successBodyBefore}{' '}
            <a
              href="https://www.instagram.com/sisepuede1.0/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                posthog.capture('cta_instagram_clicked', {
                  cta_location: 'signup_success_text',
                })
              }
              style={{ color: 'var(--accent)' }}
            >
              @sisepuede1.0
            </a>{' '}
            {m.signupForm.successBodyAfter}
          </p>
          {phone && smsConsent && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {m.signupForm.smsNote}
            </p>
          )}
        </div>

        <a
          href="https://www.instagram.com/sisepuede1.0/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            posthog.capture('cta_instagram_clicked', {
              cta_location: 'signup_success_button',
            })
          }
          className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide"
        >
          {m.signupForm.followInstagram}
          <span>→</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          {m.signupForm.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFirstInteraction}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          {m.signupForm.phoneLabel}{' '}
          <span style={{ color: 'var(--muted)' }}>{m.signupForm.optional}</span>
        </label>
        <p className="text-[11px] leading-snug -mt-0.5" style={{ color: 'var(--muted)' }}>
          {m.signupForm.phoneHint}
        </p>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={handleFirstInteraction}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = phone ? 'var(--accent)' : 'var(--border)';
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        />
      </div>

      {phone && (
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <span className="relative mt-0.5 shrink-0 h-5 w-5">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="peer sr-only"
            />
            <span
              className="block h-5 w-5 rounded border transition-colors peer-checked:border-transparent"
              style={{
                background: smsConsent ? 'var(--accent)' : 'transparent',
                border: `1px solid ${smsConsent ? 'var(--accent)' : 'var(--border)'}`,
              }}
            />
            {smsConsent && (
              <svg
                className="absolute inset-0 m-auto pointer-events-none"
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
              >
                <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {m.signupForm.smsConsent}
          </span>
        </label>
      )}

      {formState === 'error' && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>
          {errorMsg || m.signupForm.errorGeneric}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === 'loading'}
        className="w-full rounded-lg py-3.5 text-sm font-semibold tracking-wide uppercase transition-all mt-1"
        style={{
          background: formState === 'loading' ? 'var(--border)' : 'var(--accent)',
          color: formState === 'loading' ? 'var(--muted)' : '#fff',
          cursor: formState === 'loading' ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (formState !== 'loading') e.currentTarget.style.background = 'var(--accent-hover)';
        }}
        onMouseLeave={(e) => {
          if (formState !== 'loading') e.currentTarget.style.background = 'var(--accent)';
        }}
      >
        {formState === 'loading' ? m.signupForm.sending : m.signupForm.submit}
      </button>
    </form>
  );
}
