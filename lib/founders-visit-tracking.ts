export const FOUNDERS_PAGE_SOURCE = 'founders_page';
export const FOUNDERS_VISIT_STORAGE_KEY = 'sise_founders_visit_v1';
export const FOUNDERS_VISITOR_ID_KEY = 'sise_founders_visitor_id_v1';

export function getOrCreateFoundersVisitorId(): string {
  if (typeof window === 'undefined') return '';

  const existing = window.localStorage.getItem(FOUNDERS_VISITOR_ID_KEY)?.trim();
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `fv_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(FOUNDERS_VISITOR_ID_KEY, id);
  return id;
}

export function hasFoundersVisitRecorded(locale: string): boolean {
  if (typeof window === 'undefined') return false;

  const raw = window.sessionStorage.getItem(FOUNDERS_VISIT_STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { locale?: string };
    return parsed.locale === locale;
  } catch {
    return false;
  }
}

export function markFoundersVisitRecorded(locale: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(
    FOUNDERS_VISIT_STORAGE_KEY,
    JSON.stringify({ locale, tracked_at: new Date().toISOString() }),
  );
}
