import type { AppLocale } from '@/lib/i18n/locale';

export const SIGNUP_STORAGE_KEY = 'sise_signup_v1';

export interface StoredSignupIdentity {
  email: string;
  phone?: string;
  signed_up_at: string;
  last_touchpoint: string;
  signup_phase: string;
  language: AppLocale;
  last_touch_at: string;
}

export interface SignupUtmContext {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function getSignupContext(search: string): { source: string; signup_phase: string } {
  const params = new URLSearchParams(search);
  const sourceParam = params.get('source')?.trim() || '';
  return {
    source: sourceParam || 'landing_page',
    signup_phase: sourceParam ? 'event_day' : 'pre_event',
  };
}

function sanitizeUtmValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function getUtmContext(search: string): SignupUtmContext {
  const params = new URLSearchParams(search);
  return {
    utm_source: sanitizeUtmValue(params.get('utm_source')),
    utm_medium: sanitizeUtmValue(params.get('utm_medium')),
    utm_campaign: sanitizeUtmValue(params.get('utm_campaign')),
    utm_term: sanitizeUtmValue(params.get('utm_term')),
    utm_content: sanitizeUtmValue(params.get('utm_content')),
  };
}

export function getSignupTrackingContext(
  search: string,
  language: AppLocale,
): { source: string; signup_phase: string; language: AppLocale } & SignupUtmContext {
  return { ...getSignupContext(search), language, ...getUtmContext(search) };
}

export function readStoredSignupIdentity(): StoredSignupIdentity | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(SIGNUP_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSignupIdentity>;
    if (
      typeof parsed.email !== 'string' ||
      typeof parsed.signed_up_at !== 'string' ||
      typeof parsed.last_touchpoint !== 'string' ||
      typeof parsed.signup_phase !== 'string' ||
      typeof parsed.last_touch_at !== 'string'
    ) {
      return null;
    }

    const language: AppLocale =
      parsed.language === 'es' || parsed.language === 'en' ? parsed.language : 'en';

    return {
      email: parsed.email,
      phone: typeof parsed.phone === 'string' ? parsed.phone : undefined,
      signed_up_at: parsed.signed_up_at,
      last_touchpoint: parsed.last_touchpoint,
      signup_phase: parsed.signup_phase,
      language,
      last_touch_at: parsed.last_touch_at,
    };
  } catch {
    return null;
  }
}

export function writeStoredSignupIdentity(identity: StoredSignupIdentity) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(identity));
}
