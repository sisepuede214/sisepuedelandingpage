'use client';

import { useState, useRef } from 'react';
import posthog from 'posthog-js';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const hasStarted = useRef(false);

  function handleFirstInteraction() {
    if (!hasStarted.current) {
      hasStarted.current = true;
      posthog.capture('signup_form_started');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    posthog.capture('signup_submitted', {
      has_phone: Boolean(phone && smsConsent),
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
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Something went wrong');
      }

      posthog.capture('signup_success', { has_phone: Boolean(phone && smsConsent) });
      setFormState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      posthog.capture('signup_error', { error: message });
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
          You&apos;re on the list.
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
            Watch{' '}
            <a
              href="https://www.instagram.com/sisepuede1.0/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              @sisepuede1.0
            </a>{' '}
            — that&apos;s where the tease drops.
          </p>
          {phone && smsConsent && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              We&apos;ll text you first when pre-orders open July 4th.
            </p>
          )}
        </div>

        <a
          href="https://www.instagram.com/sisepuede1.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide"
        >
          Follow on Instagram
          <span>→</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Email *
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

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Phone <span style={{ color: 'var(--muted)' }}>(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
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

      {/* SMS consent */}
      {phone && (
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <span className="relative mt-0.5 flex-shrink-0 h-5 w-5">
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
            Yes, text me updates about the event. Message &amp; data rates may apply. Reply STOP to unsubscribe.
          </span>
        </label>
      )}

      {/* Error message */}
      {formState === 'error' && (
        <p className="text-xs" style={{ color: '#E8453C' }}>
          {errorMsg || 'Something went wrong. Please try again.'}
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
        {formState === 'loading' ? 'Sending...' : 'Get early access'}
      </button>
    </form>
  );
}
