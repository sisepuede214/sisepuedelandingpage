export const POSTHOG_CONSENT_STORAGE_KEY = 'sise_posthog_consent_v1';

export type PostHogConsentStatus = 'accepted' | 'declined';

export function readPostHogConsent(): PostHogConsentStatus | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(POSTHOG_CONSENT_STORAGE_KEY);
  if (raw === 'accepted' || raw === 'declined') return raw;
  return null;
}

export function writePostHogConsent(consent: PostHogConsentStatus) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(POSTHOG_CONSENT_STORAGE_KEY, consent);
}
